import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  // Cacher la navbar pour login et register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="app-title">
          🌍 RSE App
        </Link>
      </div>

      {/* Bouton menu burger pour mobile */}
      <button
        className={`burger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Liens de navigation */}
      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li><Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
        <li><Link to="/planning" onClick={() => setIsOpen(false)}>Planning</Link></li>
        <li><Link to="/newsletter" onClick={() => setIsOpen(false)}>Newsletter</Link></li>
        <li><Link to="/statistics" onClick={() => setIsOpen(false)}>Statistiques</Link></li>
        {user?.role === "admin" && (
          <li><Link to="/RSEPlatform" onClick={() => setIsOpen(false)}>admin</Link></li>
        )}
      </ul>

      {/* Zone utilisateur */}
      <div className="navbar-right">
        {user ? (
          <>
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.nom || user.name}+${user.prenom || ""}&background=2563eb&color=fff`}
              alt="avatar"
              className="user-avatar"
            />
            <span className="user-name">
              {user.prenom || user.name} {user.nom || ""}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Se déconnecter
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-login">Se connecter</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;





