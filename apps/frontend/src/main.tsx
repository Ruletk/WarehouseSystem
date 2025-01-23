import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PasswordChangeRequestPage from "./pages/auth/PasswordChangeRequestPage";
import PasswordChangePage from "./pages/auth/PasswordChangePage";
import ActivatePage from "./pages/auth/ActivatePage";
import WarehousePage from "./pages/warehouse/warehousePage";
import Header from "./components/layout/Header";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<PasswordChangeRequestPage />} />
        <Route path="/reset-password/:token" element={<PasswordChangePage />} />
        <Route path="/activate/:token" element={<ActivatePage />} />
        <Route path="/warehouse" element={<WarehousePage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
