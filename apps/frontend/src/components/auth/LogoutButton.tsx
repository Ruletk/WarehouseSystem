import React from 'react';
import { logout } from '../../services/AuthService';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logged out successfully');
      // Redirect or update state as needed
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
