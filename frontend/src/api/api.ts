import { authUtils } from '@/lib/auth';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = authUtils.getUser();
  if (user?.token) config.headers.Authorization = `Bearer ${user?.token}`;
  return config;
});

export default api;
