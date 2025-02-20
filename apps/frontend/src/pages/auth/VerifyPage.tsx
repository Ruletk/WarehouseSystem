import React from 'react';
import { useParams } from 'react-router-dom';
import ActivateAccount from '../../components/auth/ActivateAccount';

const VerifyPage = () => {
  const { token } = useParams<{ token: string }>(); 

  return (
    <div>
      <h1>Verify Account</h1>
      {token ? (
        <ActivateAccount token={token} />
      ) : (
        <div style={{ color: 'red', fontWeight: 'bold' }}>Invalid activation link.</div>
      )}
    </div>
  );
};

export default VerifyPage;