import axiosInstance from './axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

export const authAPI = {
  register: async (userData) => {
    const response = await axiosInstance.post(`${API_BASE_URL}users/register/`, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post(`${API_BASE_URL}users/login/`, credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}users/profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  },
};
