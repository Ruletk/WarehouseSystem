import React from 'react';
import { useParams } from 'react-router-dom';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';

const ChangePasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return <div>Invalid token</div>;
  }

  return (
    <div>
      <h1>Change Password Page</h1>
      <ChangePasswordForm token={token} />
    </div>
  );
};

export default ChangePasswordPage;
