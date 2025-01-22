// apps/frontend/src/pages/auth/LoginPage.ts
import React from 'react';
import AuthComponent from '../../components/auth/authComponent';

const LoginPage: React.FC = () => {
  const handleLogin = (username: string, password: string) => {
    console.log('Login attempt:', username, password);
    // Здесь будет логика для отправки данных на сервер
  };

  return (
    <div>
      <h1>Login Page</h1>
      <AuthComponent onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
