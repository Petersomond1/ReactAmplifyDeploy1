import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Chatpage from './Chatpage';
import '../app.css';

const Home = () => {
  const [newMessage, setNewMessage] = useState('');
  const [newContent, setNewContent] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    axios.get('http://localhost:3000', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setUsername(res.data.username);
          setMessage(res.data.Status + " - " + "You are authenticated @ home page");
        } else {
          setAuth(false);
          setMessage(res.data.Error + " - " + "You are not authenticated @ home page");
        }
      })
      .catch(err => {
        setMessage("You are not authenticated @ catcher @ home page");
      });
  }, []);

  const handleDeleteCookies = () => {
    axios.get('http://localhost:3000/logout')
      .then(res => {
        location.reload(true);
        navigate('/');
      }).catch(err => console.log(err));
  };

  const { data: displayContent } = useQuery({
    queryKey: ['display'],
    queryFn: () =>
      axios.get(`${import.meta.env.BASE_URL}/api/display`, {
        headers: { Authorization: authToken },
      }).then(res => res.data),
  });

  const { data: messages } = useQuery({
    queryKey: ['messages'],
    queryFn: () =>
      axios.get(`${import.meta.env.BASE_URL}/api/messages`, {
        headers: { Authorization: authToken },
      }).then(res => res.data),
  });

  const sendMessage = useMutation({
    mutationFn: (message) =>
      axios.post(`${import.meta.env.BASE_URL}/api/messages`, { message }, {
        headers: { Authorization: authToken },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setNewMessage('');
    },
  });

  const uploadContent = useMutation({
    mutationFn: (content) =>
      axios.post(`${import.meta.env.BASE_URL}/api/upload`, content, {
        headers: { Authorization: authToken },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['display'] });
      setNewContent('');
    },
  });

  // const handleLogin = async (email, password) => {
  //   const res = await axios.post(`http://localhost:3000/api/login`, { email, password });
  //   localStorage.setItem('token', res.data.token);
  //   setAuthToken(res.data.token);
  // };

  // const handleRegister = async (email, password) => {
  //   await axios.post(`http://localhost:3000/api/register`, { email, password });
  //   alert('Registration successful!');
  // };

  return (
    <div className="App">
      {!authToken ? (
        <div>
           {/* <button onClick={() => handleLogin('test@example.com', 'password123')}>Login</button>  */}


          <button onClick={async () => { 
            // await handleRegister('newuser@example.com', 'password123'); 
            navigate('/signup'); 
          }}>Register</button>
        
          
        </div>
      ) : (
        <>
         <div>Welcome {username}</div>
           <Chatpage />
          <div>
            <div>{message}</div> 
            <button onClick={handleDeleteCookies}>Logout</button>
          </div>       
        </>
      )}
    </div>
  );
};

export default Home;