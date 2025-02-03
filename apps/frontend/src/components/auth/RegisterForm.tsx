import React, { useState } from 'react';
import { authApi } from '../../services/api';
import styles from './LoginForm.module.css';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.register({ email, password });
      window.location.href = '/login'; // Перенаправление на страницу входа
    } catch (err) {
      setError('User already exists');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Register</h2>
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
