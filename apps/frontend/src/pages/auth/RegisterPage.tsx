import React from 'react';
import RegisterComponent from '../../components/auth/RegisterComponent';
import { register } from '../../services/api';

const RegisterPage: React.FC = () => {
    const handleRegister = async ({ email, password }: { email: string; password: string }) => {
        const response = await register(email, password); 
        console.log('Registration successful:', response);
        alert('Registration successful!');
      };
      

  return (
    <div>
      <h1>Register</h1>
      <RegisterComponent onRegister={handleRegister} />
    </div>
  );
};

export default RegisterPage;
