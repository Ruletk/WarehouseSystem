// apps/frontend/src/components/auth/authComponent.ts
import React from 'react';

interface AuthComponentProps {
  onLogin: (username: string, password: string) => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ onLogin }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="username">Username:</label>
  <input
  id="username"
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  />
  </div>
  <div>
  <label htmlFor="password">Password:</label>
  <input
  id="password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  />
  </div>
  <button type="submit">Login</button>
    </form>
);
};

export default AuthComponent;
