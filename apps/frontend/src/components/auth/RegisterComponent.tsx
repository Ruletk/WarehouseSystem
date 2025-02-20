import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import commonStyles from './commonStyles.module.css';

interface RegisterComponentProps {
  onRegister: (data: { email: string; password: string }) => Promise<void>;
}

const RegisterComponent: React.FC<RegisterComponentProps> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await onRegister({ email, password });
      setSuccessMessage('Successfully registered. Check your email for verification.');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={commonStyles['form-container']}>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className={commonStyles['input-group']}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={commonStyles['input-group']}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className={commonStyles['error-message']}>{error}</div>}
        {successMessage && <div className={commonStyles['success-message']}>{successMessage}</div>}
        <button type="submit" className={commonStyles.button} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <button className={commonStyles['link-button']} onClick={() => navigate('/login')}>
        Already have an account?
      </button>
    </div>
  );
};

export default RegisterComponent;