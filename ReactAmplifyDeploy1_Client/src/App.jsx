import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [formContent, setFormContent] = useState('');
  const [displayContent, setDisplayContent] = useState(null);

  useEffect(() => {
    // Fetch initial data from the backend
    fetch('/api/display')
      .then(response => response.json())
      .then(data => setDisplayContent(data));
    
    fetch('/api/messages')
      .then(response => response.json())
      .then(data => setMessages(data));
  }, []);

  const handleSendMessage = () => {
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage })
    })
    .then(response => response.json())
    .then(data => setMessages([...messages, data]));

    setNewMessage('');
  };

  const handleSubmitForm = () => {
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: formContent })
    })
    .then(response => response.json())
    .then(data => console.log(data));

    setFormContent('');
  };

  return (
    <div className="App">
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
          {messages.map((msg, index) => (
            <div key={index} className="message">{msg.content}</div>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div className="form-section">
        <textarea
          value={formContent}
          onChange={(e) => setFormContent(e.target.value)}
        />
        <button onClick={handleSubmitForm}>Submit</button>
      </div>
    </div>
  );
}

export default App;