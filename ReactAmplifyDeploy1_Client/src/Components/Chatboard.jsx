import React, { useState } from 'react';
import './chatboard.css';

const Chatboard = ({ newMessage, setNewMessage, sendMessage, uploadFile }) => {
  const [file, setFile] = useState(null);
  const [audience, setAudience] = useState('General');
  const [targetId, setTargetId] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      uploadFile.mutate({ file, audience, targetId });
    }
  };

  const handleSendMessage = () => {
    sendMessage.mutate({ message: newMessage, audience, targetId });
  };

  return (
    <div className="chatboard">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      <select value={audience} onChange={(e) => setAudience(e.target.value)}>
        <option value="General">General</option>
        <option value="submitter">Submitter</option>
        <option value="userclass">Userclass</option>
      </select>
      {(audience === 'submitter' || audience === 'userclass') && (
        <input
          type="text"
          placeholder="Enter 6-alphanumeric ID"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
        />
      )}
    </div>
  );
};

export default Chatboard;