import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import commonStyles from './commonStyles.module.css';

interface ResetPasswordComponentProps {
  onSuccess: () => void;
}

const ResetPasswordComponent: React.FC<ResetPasswordComponentProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className={commonStyles['form-container']}>
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <div className={commonStyles['input-group']}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <div className={commonStyles['error-message']}>{error}</div>}
        {message && <div className={commonStyles['success-message']}>{message}</div>}
        <button type="submit" className={commonStyles.button} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <button
        className={commonStyles['link-button']}
        onClick={() => navigate('/login')} 
        style={{ marginTop: '20px' }} 
      >
        Back to Login
      </button>
    </div>
  );
};

export default ResetPasswordComponent;