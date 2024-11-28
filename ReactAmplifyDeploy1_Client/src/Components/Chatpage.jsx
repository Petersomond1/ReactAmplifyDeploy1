import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import '../app.css';
import './chatpage.css';
import ContentListing from './ContentListing';
import ContentImageVideoDisplay from './ContentImageVideoDisplay';
import ChatsbyContent from './ChatsbyContent';
import Chatboard from './Chatboard';

const Chatpage = () => {
  const [newMessage, setNewMessage] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (authToken) {
      axios.get('http://localhost:3000', { withCredentials: true })
        .then(res => {
          if (res.data.Status === "Success") {
            setAuth(true);
            setUsername(res.data.username);
            setMessage(res.data.Status + " - " + "You are authenticated @ chat page");
          } else {
            setAuth(false);
            setMessage(res.data.Error + " - " + "You are not authenticated @ chat page");
          }
        })
        .catch(err => {
          setMessage("You are not authenticated @ catcher @ chat page");
        });
    } else {
      navigate('/');
    }
  }, [authToken, navigate]);

  const handleDeleteCookies = () => {
    axios.get('http://localhost:3000/logout')
      .then(res => {
        localStorage.removeItem('token'); // Remove the token
        location.reload(true);
        navigate('/');
      }).catch(err => console.log(err));
  };

  const { data: displayContent, isLoading: isLoadingDisplay } = useQuery({
    queryKey: ['display'],
    queryFn: () =>
      axios.get(`${import.meta.env.BASE_URL}/api/display`, {
        headers: { Authorization: authToken },
      }).then(res => res.data),
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
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

  if (!authToken) {
    return null; // Prevent rendering if no authToken
  }

  return (
    <div className="App">
      {authToken && !auth ? (
        <div>
          <button onClick={async () => { navigate('/login'); }}>Login</button>
        </div>
      ) : (
        <>
          <section className='navbar'>
            <div className='welcome_div'>Welcome {username}</div>
            <div className='nav_div'>Navigation</div>
          </section>
          <section className='display_section'>
            <div className='display_div'>
              <ContentListing contentList={[]} />
              {!isLoadingDisplay && displayContent && (
                <ContentImageVideoDisplay displayContent={displayContent} />
              )}
              {!isLoadingMessages && messages && (
                <ChatsbyContent messages={messages} />
              )}
            </div>
          </section>
          <section className='message_section'>
            <Chatboard
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
            />
          </section>
          <section className='footer_section'>
            <div className='footer_div'>footer</div>
          </section>
          <div>
            <div>{message}</div>
            <p>Remember to logout, when you're done. Thx</p>
            <button onClick={handleDeleteCookies}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatpage;