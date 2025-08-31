import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchActions } from '../services/api';
import "./Dashboard.css";

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

export default Dashboard;
