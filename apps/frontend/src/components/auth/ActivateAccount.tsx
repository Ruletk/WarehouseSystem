import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ActivateAccountProps {
  token: string;
}

const ActivateAccount: React.FC<ActivateAccountProps> = ({ token }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const activateUser = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/activate/${token}`);
        if (response.data && response.data.message) {
          setMessage(response.data.message);
        }
      } catch (err: any) {
        if (err.response?.data?.message) {
          setError(err.response.data.message); 
        } else {
          setError('An error occurred during activation.');
        }
      }
    };

    if (token) {
      activateUser();
    } else {
      setError('Activation token is missing.');
    }
  }, [token]);

  return (
    <div>
      <h1>Account Activation</h1>
      {message && <div style={{ color: 'green', fontWeight: 'bold' }}>{message}</div>}
      {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
    </div>
  );
};

export default ActivateAccount;