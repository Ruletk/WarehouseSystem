import React from 'react';
import axios from 'axios';
import RegisterComponent from '../../components/auth/RegisterComponent';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/api/v1';

const RegisterPage = () => {
  const handleRegister = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data); 
      console.log('Registration successful:', response.data);
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error('An error occurred during registration.');
      }
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