import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function App() {
  const [newMessage, setNewMessage] = useState('');
  const [newContent, setNewContent] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  const queryClient = useQueryClient();

  // Fetch display content
  const { data: displayContent } = useQuery(['display'], () =>
    axios.get(`${process.env.REACT_APP_API_URL}/api/display`, {
      headers: { Authorization: authToken }
    }).then(res => res.data)
  );

  // Fetch messages
  const { data: messages } = useQuery(['messages'], () =>
    axios.get(`${process.env.REACT_APP_API_URL}/api/messages`, {
      headers: { Authorization: authToken }
    }).then(res => res.data)
  );

  // Post message
  const sendMessage = useMutation(message => 
    axios.post(`${process.env.REACT_APP_API_URL}/api/messages`, { message }, {
      headers: { Authorization: authToken }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages']);
        setNewMessage('');
      }
    }
  );

  const uploadContent = useMutation(content =>
    axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, content, {
      headers: { Authorization: authToken }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['display']);
        setNewContent('');
      }
    }
  );

  const handleLogin = async (email, password) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);
  };

  const handleRegister = async (email, password) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, { email, password });
    alert('Registration successful!');
  };

  return (
    <div className="App">
      {!authToken ? (
        <div>
          <button onClick={() => handleLogin('test@example.com', 'password123')}>Login</button>
          <button onClick={() => handleRegister('newuser@example.com', 'password123')}>Register</button>
        </div>
      ) : (
        <>
          <div className="display-section">
            {displayContent && (
              displayContent.type === 'image' ? (
                <img src={displayContent.url} alt="Display" />
              ) : (
                <video src={displayContent.url} controls />
              )
            )}
          </div>
          <div className="chat-section">
            <div className="messages">
              {messages && messages.map((msg) => (
                <div key={msg.id} className="message">{msg.content}</div>
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
            <button onClick={() => uploadContent.mutate({ type: 'text', url: newContent })}>Submit</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;