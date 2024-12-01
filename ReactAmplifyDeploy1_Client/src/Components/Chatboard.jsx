import React, { useState } from 'react';
import './chatboard.css';

const Chatboard = ({ newMessage, setNewMessage, sendMessage, uploadFile }) => {
  const [file, setFile] = useState(null);
  const [audience, setAudience] = useState('General');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      uploadFile.mutate({ file, audience });
    }
  };

  return (
    <div className="chatboard">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={() => sendMessage.mutate({ message: newMessage, audience })}>Send</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      <select value={audience} onChange={(e) => setAudience(e.target.value)}>
        <option value="General">General</option>
        <option value="submitter">Submitter</option>
        <option value="userclass">Userclass</option>
      </select>
    </div>
  );
};

export default Chatboard;