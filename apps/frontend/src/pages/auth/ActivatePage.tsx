import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthService from "../../services/AuthService";

const ActivatePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await AuthService.activateAccount(token!);
        setMessage("Account successfully activated.");
      } catch (error) {
        setMessage("Account activation failed.");
      }
    };

    activateAccount();
  }, [token]);

  return (
    <div>
      <h1>Account Activation</h1>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ActivatePage;
