import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AuthService from "../../services/AuthService";

const PasswordChangePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await AuthService.changePassword(token!, password);
      setSuccess(true);
    } catch (error) {
      setError("Password change failed");
    }
  };

  return (
    <div>
      <h1>Change Password</h1>
      {success ? (
        <p>Password changed successfully</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">New Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Change Password</button>
        </form>
      )}
    </div>
  );
};

export default PasswordChangePage;
