import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminpage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rating, setRating] = useState('');
  const [userclass, setUserclass] = useState('');
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('General');
  const [targetId, setTargetId] = useState('');

  useEffect(() => {
    // Fetch users and contents
    axios.get('/api/admin/users').then(res => setUsers(res.data));
    axios.get('/api/admin/content').then(res => setContent(res.data));
  }, []);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleFileUpload = () => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('description', description);
      formData.append('audience', audience);
      formData.append('targetId', targetId);

      axios.post('/api/admin/content/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        alert('Files uploaded successfully');
      }).catch(err => {
        alert('Error uploading files');
      });
    }
  };

  const handleUserAction = (userId, action) => {
    axios.post(`/api/admin/user/${action}`, { userId }).then(res => {
      // Update users list
      setUsers(users.map(user => (user.id === userId ? res.data : user)));
    });
  };

  const handleContentAction = (contentId, action) => {
    axios.post(`/api/admin/content/${action}`, { contentId }).then(res => {
      // Update contents list
      setContent(content.map(sub => (sub.id === contentId ? res.data : sub)));
    });
  };

  const handleUpdateUser = () => {
    if (!/^[a-zA-Z0-9]{6}$/.test(userclass)) {
      setError('Userclass must be a 6-figure alphanumeric ID');
      return;
    }
    axios.post('/api/admin/user/update', { userId: selectedUser, rating, userclass }).then(res => {
      // Update users list
      setUsers(users.map(user => (user.id === selectedUser ? res.data : user)));
      setSelectedUser(null);
      setRating('');
      setUserclass('');
      setError('');
    });
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <div className="admin-section">
        <h2>Upload Content</h2>
        <input type="file" multiple onChange={handleFileChange} />
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
        <button onClick={handleFileUpload}>Upload Files</button>
      </div>
      <div className="admin-section">
        <h2>Users</h2>
        <ul>
          {users?.map(user => (
            <li key={user.id}>
              {user.username} - {user.email}
              <button className="ban" onClick={() => handleUserAction(user.id, 'ban')}>Ban</button>
              <button className="unban" onClick={() => handleUserAction(user.id, 'unban')}>Unban</button>
              <button className="grant" onClick={() => handleUserAction(user.id, 'grant')}>Grant Posting Rights</button>
              <button onClick={() => setSelectedUser(user.id)}>Update</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <div className="admin-section">
          <h2>Update User</h2>
          <div>
            <label>Rating:</label>
            <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
          </div>
          <div>
            <label>Userclass:</label>
            <input type="text" value={userclass} onChange={(e) => setUserclass(e.target.value)} />
          </div>
          {error && <div className="error">{error}</div>}
          <button onClick={handleUpdateUser}>Update User</button>
        </div>
      )}
      <div className="admin-section">
        <h2>Content Submissions</h2>
        <ul>
          {content?.map(sub => (
            <li key={sub.id}>
              {sub.title} - {sub.submitter}
              <button className="feature" onClick={() => handleContentAction(sub.id, 'feature')}>Feature</button>
              <button className="remove" onClick={() => handleContentAction(sub.id, 'remove')}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;