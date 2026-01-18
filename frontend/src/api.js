import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
  } catch (error) {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = "/"; 
    }
    return Promise.reject(error);
  }
);

export default api;