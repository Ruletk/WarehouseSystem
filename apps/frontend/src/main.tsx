import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

// Импортируем компоненты
import Header from './components/layout/Header';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ActivatePage from './pages/auth/ActivatePage';
import PasswordChangePage from './pages/auth/PasswordChangePage';
import PasswordChangeRequestPage from './pages/auth/PasswordChangeRequestPage';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/activate/:token" element={<ActivatePage />} />
        <Route path="/change-password/:token" element={<PasswordChangePage />} />
        <Route path="/reset-password" element={<PasswordChangeRequestPage />} />
      </Routes>
    </Router>
  );
};

// Используем createRoot для рендеринга
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
