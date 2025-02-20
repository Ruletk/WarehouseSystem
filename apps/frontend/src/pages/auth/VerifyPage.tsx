import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const VerifyPage = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        if (!token) {
          setError('Invalid activation link.');
          return;
        }
        const response = await AuthService.activateAccount(token);
        if (response && response.message) {
          setMessage(response.message);
        }
      } catch (err: any) {
        setError(err.message || 'Account activation failed.');
      }
    };

    activateAccount();
  }, [token]);

  return (
    <div>
      <h1>Account Activation</h1>
      {message && <div style={{ color: 'green', fontWeight: 'bold' }}>{message}</div>}
      {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
    </div>
  );
};

export default VerifyPage;
