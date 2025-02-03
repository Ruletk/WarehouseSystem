import React, { useState } from 'react';
import { authApi } from '../../services/api';

interface ChangePasswordFormProps {
  token: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ token }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.changePassword(token, password);
      setMessage('Password changed successfully');
    } catch (err) {
      setMessage('Failed to change password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Change Password</h2>
      {message && <p>{message}</p>}
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePasswordForm;
