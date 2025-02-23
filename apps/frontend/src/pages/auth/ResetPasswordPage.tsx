import React from 'react';
import ResetPasswordComponent from '../../components/auth/ResetPasswordComponent';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <ResetPasswordComponent onSuccess={() => navigate('/login')} />
    </div>
  );
};

export default ResetPasswordPage;
