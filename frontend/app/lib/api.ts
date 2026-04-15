import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ngo-hub-production.up.railway.app";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor (Inject Token Automatically)
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
