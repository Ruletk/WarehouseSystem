import React from 'react';
import RegisterComponent from '../../components/auth/RegisterComponent';
import apiClient from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { ApiResponse } from '@warehouse/validation';

const RegisterPage = () => {
  const handleRegister = async (data: { email: string; password: string }) => {
    try {
      const response = await apiClient.post(endpoints.auth.register, data);
      return response.data as ApiResponse;
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
