import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userData = localStorage.getItem("userData");
    
    if (token && role && userData) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser({ 
        token, 
        role, 
        ...JSON.parse(userData) 
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      
      const { token, role, user: userData } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userData", JSON.stringify(userData));
      
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser({ token, role, ...userData });
      
      return { role };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userData");
    delete axios.defaults.headers.common.Authorization;
    setUser(null);
  };

  const normalizeRole = (role) => {
    if (!role) return "";
    return role.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        normalizeRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


















/*import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l’utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Connexion
  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);

    return response.data;
  };

  // Inscription
  const register = async (nom, prenom, email, password, role = "user") => {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      nom,
      prenom,
      email,
      password,
      role
    });

    if (response.data.token && response.data.user) {
      const { token, user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    }

    return response.data;
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, setUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};



























/*



// backend/context/AuthContext.js ou src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour consommer le contexte
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Connexion
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  // Inscription
  const register = async (nom, prenom, email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        nom,
        prenom,
        email,
        password,
        role
      });

      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};





























/*import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };


  const register = async (nom, prenom, email, password) => {
  const response = await axios.post('http://localhost:5000/api/auth/register', {
    nom,
    prenom,
    email,
    password
  });
  return response.data;
};


  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);*/