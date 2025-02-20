import axios from 'axios';

const API_URL = 'http://localhost/api/v1/auth';

class AuthService {
  // Регистрация пользователя
  async register(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/register`, { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Registration failed');
    }
  }

  // Вход пользователя
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed');
    }
  }

  // Выход пользователя
  async logout(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/logout`, {
        withCredentials: true, // Для обработки cookies
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
      const response = await axios.get(`${API_URL}/user/verify/${token}`);
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