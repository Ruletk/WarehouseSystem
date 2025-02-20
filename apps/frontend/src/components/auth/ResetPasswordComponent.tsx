import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import styles from './ResetPasswordComponent.module.css';

interface ResetPasswordComponentProps {
  onSuccess: () => void;
}

const ResetPasswordComponent: React.FC<ResetPasswordComponentProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await AuthService.resetPassword(email);
      setMessage('Password reset email sent. Check your inbox.');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <div>
          <label>Email:</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordComponent;
