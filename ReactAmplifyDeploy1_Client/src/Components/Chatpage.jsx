import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import '../app.css';

const Chatpage = () => {
  const [newMessage, setNewMessage] = useState('');
  const [newContent, setNewContent] = useState('');
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
          <div>Welcome {username}</div>
          <div>Listing</div>
          <div>Display</div>
          <div>Chat</div>
          <div>Messages</div>

          <div className="display-section">
            {displayContent &&
              (displayContent.type === 'image' ? (
                <img src={displayContent.url} alt="Display" />
              ) : (
                <video src={displayContent.url} controls />
              ))}
          </div>
          <div className="chat-section">
            <div className="messages">
              {messages &&
                messages.map((msg) => (
                  <div key={msg.id} className="message">
                    {msg.content}
                  </div>
                ))}
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={() => sendMessage.mutate(newMessage)}>Send</button>
          </div>
          <div className="form-section">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <button
              onClick={() =>
                uploadContent.mutate({ type: 'text', url: newContent })
              }
            >
              Submit
            </button>
          </div>
          <div>
            <div>{message}</div>
            <button onClick={handleDeleteCookies}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatpage;