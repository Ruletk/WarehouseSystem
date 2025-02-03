import React, { useEffect, useState } from 'react';
import { authApi } from '../../services/api';
import styles from './ActivateAccount.module.css';

interface ActivateAccountProps {
  token: string;
}

const ActivateAccount: React.FC<ActivateAccountProps> = ({ token }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activate = async () => {
      try {
        await authApi.activateAccount(token);
        setMessage('Account activated successfully');
      } catch (err) {
        setMessage('Failed to activate account');
      }
    };
    activate();
  }, [token]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Activate Account</h2>
      {message && (
        <p className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ActivateAccount;
