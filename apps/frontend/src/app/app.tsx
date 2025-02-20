import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyPage from '../pages/auth/VerifyPage'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/user/verify/:token" element={<VerifyPage />} />
      </Routes>
    </Router>
  );
};

export default App;