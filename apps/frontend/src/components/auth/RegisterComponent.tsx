import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterComponent.module.css';

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
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Register</h2>
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
        <div>
          <label>Password:</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <button className={styles.linkButton} onClick={() => navigate('/login')}>
        Already have an account?
      </button>
    </div>
  );
};

export default RegisterComponent;
