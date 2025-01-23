import React from 'react';
import LogoutButton from '../auth/LogoutButton';

const Header: React.FC = () => {
  return (
    <header>
      <h1>Warehouse Management System</h1>
      <LogoutButton />
    </header>
  );
};

export default Header;
