import { Route, Routes, Link } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';
import ActivateAccountPage from '../pages/auth/ActivateAccountPage';

export function App() {
  return (
    <div>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/reset-password">Reset Password</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<div>Welcome frontend</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/change-password/:token" element={<ChangePasswordPage />} />
        <Route path="/activate/:token" element={<ActivateAccountPage />} />
      </Routes>
    </div>
  );
}

export default App;
