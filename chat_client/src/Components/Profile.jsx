import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';


const fetchUserData = async () => {
  const { data } = await axios.get('/api/auth');
  return data;
};

const Profile = () => {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useQuery('userData', fetchUserData);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  const handleLogout = () => {
    axios.post('/api/auth/logout').then(() => {
      localStorage.removeItem("token"); // Remove the token
      navigate('/');
    }).catch(err => {
      console.error('Error logging out:', err);
    });
  };

  return (
    <div style={styles.container}>
      <div>
        <h1>Profile</h1>
        <img src={user.avatar} alt="Avatar" style={styles.avatar} />
        <h1 style={styles.name}>{user.name}</h1>
        <p style={styles.email}>{user.email}</p>
        <p style={styles.phone}>{user.phone}</p>
        <p style={styles.userclass}>{user.userclass}</p>
      </div>
      <br />
      <div>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => { if (user.isAdmin) { navigate('/adminpage')} }}>Login as Admin</button>
        <button onClick={() => navigate('/chatpage')}>Chat</button>
      </div> 
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    maxWidth: '400px',
    margin: '0 auto',
    marginTop: '50px',
    backgroundColor: '#f9f9f9'
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '20px'
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  email: {
    fontSize: '18px',
    color: '#555'
  },
  phone: {
    fontSize: '18px',
    color: '#555'
  },
  userclass: {
    fontSize: '18px',
    color: '#555'
  }  
};

export default Profile;