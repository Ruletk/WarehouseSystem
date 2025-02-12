import React, { useState } from 'react';
import { changePassword } from '../../services/api';

const ChangePasswordForm = ({ token }: { token: string }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(token, password);
      setMessage('Password changed successfully!');
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
