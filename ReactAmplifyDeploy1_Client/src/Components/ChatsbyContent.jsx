import React from 'react';
import './chatsbycontent.css';

const ChatsbyContent = ({ messages }) => {
  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chatsby-content">
      {messages.map((msg) => (
        // msg.id will be the unique identifier that relates message to the particular content it is associated with, the submitter, and the timestamp
    // msg.content will be the actual message content
        <div key={msg.id} className="message">
          {msg.content}
          <div className="message-info">
            <div>{msg.submitter}</div>
            <div>{msg.timestamp}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatsbyContent;