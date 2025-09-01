import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchActions } from '../services/api';
import "./Dashboard.css";
import SearchBar from '../components/SearchBar';
import '../App.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalActions: 0,
    completedActions: 0,
    upcomingActions: 0,
    participationRate: 0
  });

  const [allActions, setAllActions] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    loadActions();
  }, []);

  useEffect(() => {
    // Filtrer les actions en fonction du terme de recherche
    const filtered = allActions.filter(action => 
      action.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActions(filtered);
  }, [searchTerm, allActions]);

  const loadActions = async () => {
    try {
      setLoading(true);
      const response = await fetchActions();
      const actions = response.data;

      setAllActions(actions);
      setFilteredActions(actions);

      setStats({
        totalActions: actions.length,
        completedActions: actions.filter(a => a.statut === "terminé").length,
        upcomingActions: actions.filter(a => a.statut === "planifié").length,
        participationRate: Math.round(
          (actions.filter(a => a.statut === "en_cours").length / (actions.length || 1)) * 100
        )
      });
    } catch (err) {
      console.error("Erreur lors du chargement des actions:", err);
      setError("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Toutes les actions</h1>
        <div className="search-container">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Actions totales</h3>
          <p className="stat-number">{stats.totalActions}</p>
        </div>
        <div className="stat-card">
          <h3>Actions complétées</h3>
          <p className="stat-number">{stats.completedActions}</p>
        </div>
        <div className="stat-card">
          <h3>Actions à venir</h3>
          <p className="stat-number">{stats.upcomingActions}</p>
        </div>
        <div className="stat-card">
          <h3>Taux de participation</h3>
          <p className="stat-number">{stats.participationRate}%</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="all-actions">
          <h2>
            Liste des actions 
            {searchTerm && ` (${filteredActions.length} résultat(s) trouvé(s))`}
          </h2>
          {filteredActions.length === 0 ? (
            <p className="no-results">
              {searchTerm 
                ? "Aucune action ne correspond à votre recherche" 
                : "Aucune action disponible"}
            </p>
          ) : (
            <ul className="actions-list">
              {filteredActions.map(action => (
                <li key={action.id} className="action-item">
                  <span className={`status-indicator ${action.statut.replace('é', 'e')}`}></span>
                  <div className="action-info">
                    <h4>{action.titre}</h4>
                    <p>Date: {new Date(action.date_debut).toLocaleDateString('fr-FR')}</p>
                    <p className="action-status">Statut: {action.statut}</p>
                  </div>
                  <Link to={`/actions/${action.id}`} className="view-details">Voir détails</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;




























/*import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchActions } from '../services/api';
import "./Dashboard.css";
import SearchBar from '../components/SearchBar';
import '../App.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalActions: 0,
    completedActions: 0,
    upcomingActions: 0,
    participationRate: 0
  });

  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    const [filteredActions, setFilteredActions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      const response = await fetchActions();
      const actions = response.data;

      setRecentActions(
        actions.slice(0, 5).map(a => ({
          id: a.id,
          title: a.titre,
          date: a.date_debut,
          status: a.statut
        }))
      );

      setStats({
        totalActions: actions.length,
        completedActions: actions.filter(a => a.statut === "terminé").length,
        upcomingActions: actions.filter(a => a.statut === "planifié").length,
        participationRate: Math.round(
          (actions.filter(a => a.statut === "en_cours").length / (actions.length || 1)) * 100
        )
      });
    } catch (err) {
      console.error("Erreur lors du chargement des actions:", err);
      setError("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Tableau de Bord RSE</h1>
      <div className="action-search-container">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Actions totales</h3>
          <p className="stat-number">{stats.totalActions}</p>
        </div>
        <div className="stat-card">
          <h3>Actions complétées</h3>
          <p className="stat-number">{stats.completedActions}</p>
        </div>
        <div className="stat-card">
          <h3>Actions à venir</h3>
          <p className="stat-number">{stats.upcomingActions}</p>
        </div>
        <div className="stat-card">
          <h3>Taux de participation</h3>
          <p className="stat-number">{stats.participationRate}%</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="recent-actions">
          <h2>Actions récentes</h2>
          {recentActions.length === 0 ? (
            <p>Aucune action récente</p>
          ) : (
            <ul>
              {recentActions.map(action => (
                <li key={action.id} className="action-item">
                  <span className={`status-indicator ${action.status.replace('é', 'e')}`}></span>
                  <div className="action-info">
                    <h4>{action.title}</h4>
                    <p>Date: {new Date(action.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <Link to={`/actions/${action.id}`} className="view-details">Voir détails</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;*/
