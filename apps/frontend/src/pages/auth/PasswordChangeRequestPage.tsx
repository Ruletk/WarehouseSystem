import React, { useState } from 'react';
import { resetPassword } from '../../services/AuthService';

const PasswordChangeRequestPage: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending reset email:', error);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default PasswordChangeRequestPage;
