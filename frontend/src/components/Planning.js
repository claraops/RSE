import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Planning.css";

const Planning = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupération du token JWT
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Vous devez être connecté pour accéder au planning");
        setLoading(false);
        navigate('/login'); // Redirection vers la page de connexion
        return;
      }

      const apiUrl = 'http://localhost:5000/api/action';
      console.log('Tentative de connexion à:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Gestion spécifique de l'erreur 401
      if (response.status === 401) {
        localStorage.removeItem("token"); // Supprimer le token invalide
        setError("Session expirée. Veuillez vous reconnecter.");
        navigate('/login'); // Redirection vers la page de connexion
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setActions(data);
    } catch (err) {
      console.error('Erreur détaillée:', err);

      if (err.message.includes('Failed to fetch')) {
        setError('Impossible de se connecter au serveur backend. Vérifiez que le serveur est en cours d\'exécution sur le port 5000.');
      } else {
        setError(`Erreur lors du chargement: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  };

  const filteredActions = actions.filter(action => {
    if (!action.date_debut) return false;

    const actionDate = new Date(action.date_debut);
    return actionDate.getMonth() === selectedMonth && 
           actionDate.getFullYear() === selectedYear;
  });

  if (loading) {
    return (
      <div className="planning">
        <h1>Planning des Actions RSE</h1>
        <div className="loading">Chargement des actions...</div>
      </div>
    );
  }

  return (
    <div className="planning">
      <h1>Planning des Actions RSE</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <div className="troubleshooting">
            <h3>Dépannage :</h3>
            <ul>
              <li>Vérifiez que vous êtes bien connecté</li>
              <li>Si l'erreur persiste, déconnectez-vous et reconnectez-vous</li>
              <li>Assurez-vous que le serveur backend est en cours d'exécution</li>
            </ul>
          </div>
          <div className="action-buttons">
            <button onClick={fetchActions} className="retry-button">
              Réessayer
            </button>
            <button onClick={handleLogout} className="logout-button">
             
            </button>
          </div>
        </div>
      )}

      {!error && (
        <>
          <div className="header-actions">
            <button onClick={handleLogout} className="logout-button">
             
            </button>
          </div>
          
          <div className="planning-controls">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>

            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {generateYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="calendar">
            {filteredActions.length > 0 ? (
              filteredActions.map(action => (
                <div key={action.id} className="calendar-event">
                  <div className="event-date">
                    {new Date(action.date_debut).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                  <div className="event-details">
                    <h3>{action.titre}</h3>
                    <span className={`event-status ${action.statut}`}>
                      {action.statut === 'planifié' ? 'Planifiée' : 
                      action.statut === 'en_cours' ? 'En cours' : 'Terminée'}
                    </span>
                    <p className="event-description">{action.description}</p>
                    <Link to={`/action/${action.id}`} className="event-link">Voir détails</Link>
                  </div>
                </div>
              ))
            ) : (
              <p>Aucune action planifiée pour {months[selectedMonth]} {selectedYear}.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Planning;




