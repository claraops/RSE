import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'étudiant',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, login, normalizeRole } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      // Utilisation de la fonction register du contexte
      await register(
        formData.nom,
        formData.prenom,
        formData.email,
        formData.password,
        formData.role
      );
      
      // Après l'inscription, connectez automatiquement l'utilisateur
      try {
        await login(formData.email, formData.password);
        
        // Redirigez en fonction du rôle
        const normalizedRole = normalizeRole(formData.role);
        if (normalizedRole === "admin") {
          navigate("/RSEPlatform", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (loginError) {
        // Si la connexion automatique échoue, redirigez vers la page de connexion
        console.error("Auto-login failed:", loginError);
        navigate('/login', { 
          state: { message: 'Inscription réussie! Veuillez vous connecter.' } 
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           "Erreur lors de l'inscription. Veuillez réessayer.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>
      <div className="auth-card">
        <div className="auth-header">
          <h2>Créer un compte</h2>
          <p>Rejoignez la communauté GreenCampus</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
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
                disabled={isLoading}
                placeholder="Votre nom"
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
                disabled={isLoading}
                placeholder="Votre prénom"
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
              disabled={isLoading}
              placeholder="votre@email.com"
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
                disabled={isLoading}
                placeholder="Créez un mot de passe"
                minLength="6"
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
                disabled={isLoading}
                placeholder="Confirmez votre mot de passe"
                minLength="6"
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
              disabled={isLoading}
            >
              <option value="admin">Administrateur</option>
              <option value="enseignant">Enseignant</option>
              <option value="étudiant">Étudiant</option>
              <option value="partenaire">Partenaire</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Ou</span>
        </div>

        <p className="auth-footer">
          Déjà inscrit ?{" "}
          <span className="auth-link" onClick={handleNavigateToLogin}>
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;