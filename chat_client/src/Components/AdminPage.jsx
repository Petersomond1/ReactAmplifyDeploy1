import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import './adminpage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rating, setRating] = useState('');
  const [userclass, setUserclass] = useState('');
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('General');
  const [clarionContent, setClarionContent] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Fetch users and contents
    axios.get('/api/admin/users')
      .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Error fetching users:', err);
        setUsers([]);
      });

    axios.get('/api/admin/content')
      .then(res => setContent(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Error fetching content:', err);
        setContent([]);
      });
  }, []);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const uploadFile = useMutation({
    mutationFn: (formData) => {
      return axios.post('/api/content/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      alert('Files uploaded successfully');
    },
    onError: () => {
      alert('Error uploading files');
    }
  });

  const handleFileUpload = () => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('title', title);
      formData.append('description', description);
      formData.append('audience', audience);

      uploadFile.mutate(formData);
    }
  };

  const handleClarionFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const uploadClarionFile = useMutation({
    mutationFn: (formData) => {
      return axios.post('/api/content/clarioncall/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clarionContent'] });
      alert('Content posted to Clarion Call successfully');
      setClarionContent('');
    },
    onError: () => {
      alert('Error posting content to Clarion Call');
    }
  });

  const handleClarionFileUpload = () => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('clarionContent', clarionContent);

      uploadClarionFile.mutate(formData);
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

  const handleLogout = () => {
    axios.get('/api/auth/logout').then(() => {
      localStorage.removeItem("token"); // Remove the token
      navigate('/');
    }).catch(err => {
      console.error('Error logging out:', err);
    });
  };

  const returnToChatpage = () => {
    navigate('/chatpage');
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} style={{color: 'red', marginRight:'10px'}}>Logout</button>
      <button onClick={returnToChatpage}>Return to Chatpage</button>
      <div className="admin-section">
        <h2>Upload Content</h2>
        <input type="file" multiple onChange={handleFileChange} />
        <textarea
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={60}
        />
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
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        )}
        <button onClick={handleFileUpload}>Upload Files</button>
      </div>
      <div className="admin-clarioncall-section">
        <h2>Post to Clarion Call</h2>
        <input type="file" multiple onChange={handleClarionFileChange} />
        <textarea
          placeholder="Enter content for Clarion Call"
          value={clarionContent}
          onChange={(e) => setClarionContent(e.target.value)}
        />
        <button onClick={handleClarionFileUpload}>Post ClarionCall Content</button>
      </div>
      <div className="admin-section">
        <h2>Users</h2>
        <ul>
          {users.map(user => (
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
          {content.map(sub => (
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