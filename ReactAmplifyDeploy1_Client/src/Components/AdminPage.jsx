import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminpage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    // Fetch users and submissions
    axios.get('/api/admin/users').then(res => setUsers(res.data));
    axios.get('/api/admin/submissions').then(res => setSubmissions(res.data));
  }, []);

  const handleUserAction = (userId, action) => {
    axios.post(`/api/admin/user/${action}`, { userId }).then(res => {
      // Update users list
      setUsers(users.map(user => (user.id === userId ? res.data : user)));
    });
  };

  const handleSubmissionAction = (submissionId, action) => {
    axios.post(`/api/admin/submission/${action}`, { submissionId }).then(res => {
      // Update submissions list
      setSubmissions(submissions.map(sub => (sub.id === submissionId ? res.data : sub)));
    });
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <div className="admin-section">
        <h2>Users</h2>
        <ul>
          {users?.map(user => (
            <li key={user.id}>
              {user.username} - {user.email}
              <button className="ban" onClick={() => handleUserAction(user.id, 'ban')}>Ban</button>
              <button className="unban" onClick={() => handleUserAction(user.id, 'unban')}>Unban</button>
              <button className="grant" onClick={() => handleUserAction(user.id, 'grant')}>Grant Posting Rights</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="admin-section">
        <h2>Submissions</h2>
        <ul>
          {submissions?.map(sub => (
            <li key={sub.id}>
              {sub.title} - {sub.submitter}
              <button className="feature" onClick={() => handleSubmissionAction(sub.id, 'feature')}>Feature</button>
              <button className="remove" onClick={() => handleSubmissionAction(sub.id, 'remove')}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;