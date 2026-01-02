import api from './axios';

export const login = (username, password) => api.post('token/', { username, password });
export const register = (data) => api.post('register/', data);
export const getCurrentUser = () => api.get('me/');
export const refreshToken = (refresh) => api.post('token/refresh/', { refresh });
