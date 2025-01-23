import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const PasswordChangeRequestPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handlePasswordChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.requestPasswordChange(email);
      alert("Password reset link has been sent to your email.");
      navigate("/login");
    } catch (error) {
      console.error("Password change request failed", error);
    }
  };

  return (
    <div>
      <h2>Password Change Request</h2>
      <form onSubmit={handlePasswordChangeRequest}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PasswordChangeRequestPage;
