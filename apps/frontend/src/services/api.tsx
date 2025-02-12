import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/api/v1',
  withCredentials: true, // To handle cookies
});

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (email: string, password: string) =>
  api.post('/auth/register', { email, password });

export const logout = () => api.get('/auth/logout');

export const resetPassword = (email: string) =>
  api.post('/auth/reset-password', { email });

export const changePassword = (token: string, password: string) =>
  api.post(`/auth/change-password/${token}`, { password });

export const activateAccount = (token: string) =>
  api.get(`/auth/activate/${token}`);
