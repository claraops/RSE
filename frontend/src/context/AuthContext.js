// context/AuthContext.js
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

  // Fonction d'inscription corrigée
  const register = async (nom, prenom, email, password, role = "étudiant") => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        nom,
        prenom,
        email,
        password,
        role
      });

      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);
      }

      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userData");
    localStorage.removeItem("user");
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
        register, // IMPORTANT: Ajout de la fonction register
        logout,
        normalizeRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};