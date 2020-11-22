import axios from 'axios';

import { store } from 'store/store';
import { authLogout } from 'store/auth/auth.actions';

const axiosInstance = axios.create({
  baseURL: '/api'
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const { dispatch } = store;
      dispatch(authLogout());
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
