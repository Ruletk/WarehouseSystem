import React from 'react';
import AuthService from '../../services/AuthService';
import RegisterComponent from '../../components/auth/RegisterComponent';

const RegisterPage = () => {
  const handleRegister = async (data: { email: string; password: string }) => {
    try {
      await AuthService.register(data.email, data.password);
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed.');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <RegisterComponent onRegister={handleRegister} />
    </div>
  );
};

export default RegisterPage;
