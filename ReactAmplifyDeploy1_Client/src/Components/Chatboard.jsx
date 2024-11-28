import React from 'react';
import './chatboard.css';

const Chatboard = ({ newMessage, setNewMessage, sendMessage }) => {
  return (
    <div className="chatboard">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={() => sendMessage.mutate(newMessage)}>Send</button>
    </div>
  );
};

export default Chatboard;