import axios from "axios";

const API = axios.create({ 
  baseURL: "http://localhost:5000/api",
  timeout: 30000
});

// Intercepteur pour ajouter le token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Fonctions d'authentification
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const registerUser = (data) => API.post("/auth/register", data);

// Fonctions pour les actions
export const fetchActions = () => API.get("/action");
export const createAction = (action) => API.post("/action", action);
export const updateAction = (id, action) => API.put(`/action/${id}`, action);
export const deleteAction = (id) => API.delete(`/action/${id}`);









/*import axios from "axios";

const API = axios.create({ 
  baseURL: "http://localhost:5000/api",
  timeout: 30000 // Augmentez le timeout si nécessaire
});


// Intercepteur pour ajouter le token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const API_URL = "http://localhost:5000/api";

// Fonction pour récupérer le token stocké (localStorage ou contexte)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // ou depuis AuthContext
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchActions = async () => {
  return await axios.get(`${API_URL}/action`, getAuthHeaders());
};


export const createAction = async (data) => {
  return await API.post("/action", data);
};


export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const registerUser = (data) => API.post("/auth/register", data);
//export const fetchActions = () => API.get("/action");
//export const createAction = (action) => API.post("/action", action);
export const updateAction = (id, action) => API.put(`/action/${id}`, action);
export const deleteAction = (id) => API.delete(`/action/${id}`);











/*

import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const registerUser = (data) => API.post("/auth/register", data);
export const fetchActions = () => API.get("/action");
export const createAction = (action) => API.post("/action", action);
export const updateAction = (id, action) => API.put(`/action/${id}`, action);
export const deleteAction = (id) => API.delete(`/action/${id}`);


*/

