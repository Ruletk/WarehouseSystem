import React, { useState } from 'react';
import { authApi } from '../../services/api';
import styles from './ResetPasswordForm.module.css';

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.resetPassword(email);
      setMessage('Password reset email sent');
    } catch (err) {
      setMessage('Invalid request');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Reset Password</h2>
      {message && (
        <p className={`${styles.message} ${message.includes('sent') ? styles.success : styles.error}`}>
          {message}
        </p>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Reset Password
      </button>
    </form>
  );
};

export default ResetPasswordForm;
