import React from 'react';
import { useParams } from 'react-router-dom';
import ActivateAccount from '../../components/auth/ActivateAccount';

const ActivateAccountPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return <div>Invalid token</div>;
  }

  return (
    <div>
      <h1>Activate Account Page</h1>
      <ActivateAccount token={token} />
    </div>
  );
};

export default ActivateAccountPage;
