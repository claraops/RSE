// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  login,
  register,
  logout
};