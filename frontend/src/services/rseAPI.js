// frontend/src/services/rseAPI.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rse';

const getActions = async () => {
  const response = await axios.get(`${API_URL}/actions`);
  return response.data;
};

const createAction = async (actionData) => {
  const response = await axios.post(`${API_URL}/actions`, actionData);
  return response.data;
};

export default {
  getActions,
  createAction
};