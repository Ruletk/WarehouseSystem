import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333/api/v1';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/change-password/${token}`,
      {
        password: newPassword,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const activateAccount = async (token: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/auth/activate/${token}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
