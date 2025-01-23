import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { activateAccount } from '../../services/AuthService';

const ActivatePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    if (token) {
      activateAccount(token)
        .then(() => {
          console.log('Account activated successfully');
        })
        .catch((error) => {
          console.error('Error activating account:', error);
        });
    }
  }, [token]);

  return (
    <div>
      <h1>Activate Account</h1>
      <p>Activating your account...</p>
    </div>
  );
};

export default ActivatePage;
