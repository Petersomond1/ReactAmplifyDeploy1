import React, { useState } from 'react';
import './chatboard.css';

const Chatboard = ({ newTitle, setNewTitle, newDescription, setNewDescription, newAudience, setNewAudience, sendMessage, uploadFiles }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleFileUpload = () => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('title', newTitle);
      formData.append('description', newDescription);
      formData.append('audience', newAudience);

      uploadFiles.mutate(formData);
    }
  };

  const handleSendMessage = () => {
    sendMessage.mutate({ title: newTitle, description: newDescription, audience: newAudience });
  };

  const handleSendContent = () => {
    handleSendMessage();
    handleFileUpload();
  };

  return (
    <div className="chatboard">
      <textarea
        type="text"
        placeholder="Enter title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        maxLength={60}
      />
      <textarea
        type="text"
        placeholder="Enter description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <div className='contentSubmit_container'>
        <input type="file" multiple onChange={handleFileChange} />
        <button>Audience</button>
        <select value={newAudience} onChange={(e) => setNewAudience(e.target.value)}>
          <option value="General">General</option>
          <option value="submitter">Submitter</option>
          <option value="userclass">Userclass</option>
        </select>
        {(newAudience === 'submitter' || newAudience === 'userclass') && (
          <input
            type="text"
            placeholder="Enter 6-alphanumeric ID"
            value={newAudience}
            onChange={(e) => setNewAudience(e.target.value)}
          />
        )}
        <br />
        <button onClick={handleSendContent}>Send Content</button>
      </div>
    </div>
  );
};

export default Chatboard;