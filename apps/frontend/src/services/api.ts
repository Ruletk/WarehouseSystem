import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/api/v1',
  withCredentials: true, // Для работы с cookieAuth
});

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string }) => api.post('/auth/register', data),
  logout: () => api.get('/auth/logout'),
  resetPassword: (email: string) => api.post('/auth/reset-password', { email }),
  changePassword: (token: string, newPassword: string) =>
    api.post(`/auth/change-password/${token}`, { password: newPassword }),
  activateAccount: (token: string) => api.get(`/auth/activate/${token}`),
};
