import React, { useEffect, useState } from 'react';
import { activateAccount } from '../../services/api';

const ActivateAccountPage = () => {
  const [message, setMessage] = useState('');
  const token = new URLSearchParams(window.location.search).get('token') || '';

  useEffect(() => {
    const activate = async () => {
      try {
        await activateAccount(token);
        setMessage('Account activated successfully!');
      } catch (err) {
        setMessage('Failed to activate account');
      }
    };
    activate();
  }, [token]);

  return (
    <div>
      <h1>Activate Account</h1>
      <p>{message}</p>
    </div>
  );
};

export default ActivateAccountPage;
