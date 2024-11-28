import React from 'react';
import './chatsbycontent.css';

const ChatsbyContent = ({ messages }) => {
  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chatsby-content">
      {messages.map((msg) => (
        <div key={msg.id} className="message">
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default ChatsbyContent;