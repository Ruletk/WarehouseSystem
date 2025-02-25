// src/components/NavBar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ddd',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">Home</Link>
        {isAuthenticated && <Link to="/warehouse">Warehouses</Link>}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#333',
              textDecoration: 'underline',
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
