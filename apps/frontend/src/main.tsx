// apps/frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import WarehousePage from './pages/warehouse/warehousePage';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/warehouse" element={<WarehousePage />} />
        <Route path="/" element={<LoginPage />} /> {/* По умолчанию открываем страницу входа */}
      </Routes>
    </Router>
  </React.StrictMode>
);
