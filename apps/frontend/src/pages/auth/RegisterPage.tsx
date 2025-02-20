import React, { useState } from 'react';
import axios from 'axios';
import RegisterComponent from '../../components/auth/RegisterComponent';

const API_URL = 'http://localhost/api/v1/auth/register';

const RegisterPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 
  const [activationLink, setActivationLink] = useState<string | null>(null); 

  const handleRegister = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post(API_URL, data);

      if (response.data && response.data.message) {
        setSuccessMessage(response.data.message); 
        if (response.data.activationLink) {
          setActivationLink(response.data.activationLink); 
        }
      }
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

      {successMessage && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          <p>{successMessage}</p>
          {activationLink && (
            <a href={activationLink} target="_blank" rel="noopener noreferrer">
              Click here to activate your account
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterPage;