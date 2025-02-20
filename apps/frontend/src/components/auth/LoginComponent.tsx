import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import commonStyles from './commonStyles.module.css';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await AuthService.login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={commonStyles['form-container']}>
      <h2>Login</h2>
      {error && <p className={commonStyles['error-message']}>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit" className={commonStyles.button}>Login</button>
      </form>
      <div className={commonStyles.links}>
        <button className={commonStyles['link-button']} onClick={() => navigate('/reset-password')}>
          Forgot Password?
        </button>
        <button className={commonStyles['link-button']} onClick={() => navigate('/register')}>
          Don't have an account?
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;