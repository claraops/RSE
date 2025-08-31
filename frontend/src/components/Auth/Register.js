import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from "../../services/api";
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'étudiant', // valeur par défaut
  });

  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Register.js
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formData.password !== formData.confirmPassword) {
    setError('Les mots de passe ne correspondent pas');
    return;
  }

  try {
    await register(
      formData.nom,
      formData.prenom,
      formData.email,
      formData.password,
      formData.role // Envoi du rôle
    );
    navigate('/');
  } catch (err) {
    setError(err.message || "Erreur lors de l'inscription");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un compte</h2>
        {error && <p className="error">{error}</p>}
        
       <form onSubmit={handleSubmit}>
  <div className="form-row">
  <div className="form-group">
    <label>Nom</label>
    <input
      type="text"
      name="nom"
      value={formData.nom}
      onChange={handleChange}
      required
    />
  </div>
  <div className="form-group">
    <label>Prénom</label>
    <input
      type="text"
      name="prenom"
      value={formData.prenom}
      onChange={handleChange}
      required
    />
  </div>
</div>

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

<div className="form-row">
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
  <div className="form-group">
    <label>Confirmer le mot de passe</label>
    <input
      type="password"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
    />
  </div>
</div>

<div className="form-group">
  <label>Rôle</label>
  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    required
  >
    <option value="">-- Sélectionner un rôle --</option>
    <option value="admin">Admin</option>
    <option value="enseignant">Enseignant</option>
    <option value="étudiant">Étudiant</option>
    <option value="partenaire">Partenaire</option>
  </select>
</div>

  <button type="submit" className="auth-btn">S'inscrire</button>
</form>

        
        <p className="auth-footer">
          Déjà inscrit ? <span onClick={() => navigate('/login')}>Se connecter</span>
        </p>
      </div>
    </div>
  );
};

export default Register;




















/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await register(formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un compte</h2>
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
          
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="auth-btn">S'inscrire</button>
        </form>
        
        <p className="auth-footer">
          Déjà inscrit? <span onClick={() => navigate('/login')}>Se connecter</span>
        </p>
      </div>
    </div>
  );
};

export default Register;*/