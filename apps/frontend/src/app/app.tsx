import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyPage from '../pages/auth/VerifyPage';
import LoginPage from '../pages/auth/LoginPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import { WarehouseList } from '../components/warehouse/WarehouseList';
import { WarehouseDetail } from '../components/warehouse/WarehouseDetail';
import { WarehouseCreate } from '../components/warehouse/WarehouseCreate';

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  console.log('Checking if user is authenticated:', user);
  if (isLoading) return <p>Loading...</p>;
  console.log('User is authenticated:', user);
  if (!user) return <Navigate to="/login" replace />;
  console.log('Rendering protected route');
  return element;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute element={<WarehouseList />} />}
          />

          <Route
            path="/warehouse/:id/detail"
            element={<ProtectedRoute element={<WarehouseDetail />} />}
          />

          <Route
            path="/warehouse"
            element={<ProtectedRoute element={<WarehouseCreate />} />}
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate/:token" element={<VerifyPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
