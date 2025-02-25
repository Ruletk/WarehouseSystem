import axios from 'axios';

const API_URL = '/api/v1/auth';

class AuthService {
  async register(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('Server response:', data); 
  
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
  
      return data;
    } catch (error) {
      console.error('AuthService Error:', error);
      throw error;
    }
  };

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
  
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Invalid email or password');
      }
      throw new Error('Login failed');
    }
  }
  

  // Выход пользователя
  async logout(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/logout`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Logout failed');
    }
  }

  // Сброс пароля
  async resetPassword(email: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, { email });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Password reset failed');
    }
  }

  // Изменение пароля
  async changePassword(token: string, newPassword: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/change-password/${token}`, { newPassword });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Password change failed');
    }
  }

  // Активация аккаунта
  async activateAccount(token: string): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/activate/${token}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to activate account');
    }
  }
}

export default new AuthService();