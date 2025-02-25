import axios from 'axios';


const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Здесь можно реализовать централизованную обработку ошибок, например:
    // - Перенаправление на страницу логина при 401
    // - Логирование ошибок
    // - Автоматическое обновление токена и повтор запроса
    return Promise.reject(error);
  }
);

export default apiClient;
