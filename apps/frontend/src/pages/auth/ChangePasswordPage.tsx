import React from 'react';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';

const ChangePasswordPage = () => {
  const token = new URLSearchParams(window.location.search).get('token') || '';

  return (
    <div>
      <h1>Change Password Page</h1>
      <ChangePasswordForm token={token} />
    </div>
  );
};

export default ChangePasswordPage;
