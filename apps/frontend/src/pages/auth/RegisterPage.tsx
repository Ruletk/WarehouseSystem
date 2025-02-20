import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import RegisterComponent from '../../components/auth/RegisterComponent';

const RegisterPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (data: { email: string; password: string }) => {
    try {
      const response = await AuthService.register(data.email, data.password);
      console.log('Register response:', response);

      if (response && response.message) {
        setSuccessMessage(response.message);
        setErrorMessage(null);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage(err.message || 'Registration failed.');
      setSuccessMessage(null);
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
