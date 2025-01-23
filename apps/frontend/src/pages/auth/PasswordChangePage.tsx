import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { changePassword } from '../../services/AuthService';

const PasswordChangePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      try {
        await changePassword(token, newPassword);
        console.log('Password changed successfully');
      } catch (error) {
        console.error('Error changing password:', error);
      }
    }
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default PasswordChangePage;
