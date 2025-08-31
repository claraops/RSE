import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const { login, normalizeRole } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { role } = await login(formData.email, formData.password);
      const normalizedRole = normalizeRole(role);
      
      // Redirection basée sur le rôle
      if (normalizedRole === "admin") {
        navigate("/RSEPlatform", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           "Identifiants incorrects. Réessayez.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion à GreenCampus</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-footer">
          Pas encore inscrit ?{" "}
          <span 
            className="auth-link"
            onClick={() => !isLoading && navigate("/register")}
          >
            Créer un compte
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;









/*// src/components/Auth/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const { login, normalizeRole } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { role } = await login(formData.email, formData.password);
      const r = normalizeRole(role);
      if (r === "admin") {
        navigate("/RSEPlatform", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || "Identifiants incorrects. Réessayez.";
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion à GreenCampus</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">Se connecter</button>
        </form>

        <p className="auth-footer">
          Pas encore inscrit ?{" "}
          <span onClick={() => navigate("/register")}>Créer un compte</span>
        </p>
      </div>
    </div>
  );
};

export default Login;

















/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api"; // ✅ utilise ton fichier api.js

import "./Auth.css"; // ✅ pour le style

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // ✅ state pour afficher les erreurs
  const navigate = useNavigate();

  // 🔹 gérer les changements dans les inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ appelle la fonction loginUser depuis services/api.js
      const response = await loginUser(formData);

      // ✅ stocke le token dans localStorage
      localStorage.setItem("authToken", response.token);

      // ✅ redirige vers la page d'accueil ou dashboard
      navigate("/");
    } catch (err) {
      // ✅ affiche l’erreur proprement
      setError("Identifiants incorrects. Réessayez.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion à GreenCampus</h2>

        {/* ✅ affiche l'erreur s'il y en a *
        {error && <p className="error">{error}</p>}

       <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Se connecter
          </button>
        </form>

        <p className="auth-footer">
          Pas encore inscrit ?{" "}
          <span onClick={() => navigate("/register")}>Créer un compte</span>
        </p>
      </div>
    </div>
  );
};

export default Login;*/




