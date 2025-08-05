import axios from 'axios';

const API_URL = 'http://localhost:5000/api/actionrse';

export const fetchActions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAction = async (action) => {
  const response = await axios.post(API_URL, action);
  return response.data;
};

export const updateAction = async (id, action) => {
  const response = await axios.put(`${API_URL}/${id}`, action);
  return response.data;
};

export const deleteAction = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Ajoutez les autres fonctions (updateAction, deleteAction) si nécessaire

















/*import axios from 'axios';

const API_URL = 'http://localhost:5000/api/actions';

export const fetchActions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAction = async (action) => {
  const response = await axios.post(API_URL, action);
  return response.data;
};

export const updateAction = async (id, action) => {
  const response = await axios.put(`${API_URL}/${id}`, action);
  return response.data;
};

export const deleteAction = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};*/