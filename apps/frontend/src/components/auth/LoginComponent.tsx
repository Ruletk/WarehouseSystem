// src/components/LoginComponent.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import commonStyles from './commonStyles.module.css';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      // Ошибка уже обработана в AuthProvider
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
            disabled={isLoading}
          />
        </div>
        <div className={commonStyles['input-group']}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className={commonStyles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <div className={commonStyles.links}>
        <button
          className={commonStyles['link-button']}
          onClick={() => navigate('/reset-password')}
          disabled={isLoading}
        >
          Forgot Password?
        </button>
        <button
          className={commonStyles['link-button']}
          onClick={() => navigate('/register')}
          disabled={isLoading}
        >
          Don't have an account?
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;
