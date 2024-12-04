import React, { useState } from 'react';
import './chatboard.css';

const Chatboard = ({ newMessage, setNewMessage, sendMessage, uploadFiles }) => {
  const [files, setFiles] = useState([]);
  const [audience, setAudience] = useState('General');
  const [targetId, setTargetId] = useState('');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleFileUpload = () => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('description', newMessage);
      formData.append('audience', audience);
      formData.append('targetId', targetId);

      uploadFiles.mutate(formData);
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
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload Files</button>
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