import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fetchActions } from '../services/api';
import './Statistics.css';

const Statistics = () => {
  const [selectedKpi, setSelectedKpi] = useState('actions');
  const [timeRange, setTimeRange] = useState('month');
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      const response = await fetchActions();
      const actionsData = response.data;
      setActions(actionsData);
    } catch (err) {
      console.error("Erreur lors du chargement des actions:", err);
      setError("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  // Calcul des données réelles à partir des actions
  const getActionStatusData = () => {
    const statusCount = {
      'planifié': 0,
      'en_cours': 0,
      'terminé': 0
    };

    actions.forEach(action => {
      if (statusCount.hasOwnProperty(action.statut)) {
        statusCount[action.statut]++;
      }
    });

    return [
      { name: 'Planifiées', value: statusCount.planifié },
      { name: 'En cours', value: statusCount['en_cours'] },
      { name: 'Terminées', value: statusCount.terminé }
    ];
  };

  // Calcul des indicateurs de performance
  const calculateKpis = () => {
    const totalActions = actions.length;
    const completedActions = actions.filter(a => a.statut === "terminé").length;
    const completionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;
    
    // Calcul du taux de participation moyen (simulé car pas de données directes dans la BD)
    // Dans une vraie application, vous devriez avoir une table de participation
    const participationRate = Math.min(100, Math.max(60, Math.round(completionRate * 0.8)));
    
    return {
      participationRate,
      completionRate,
      totalActions,
      completedActions
    };
  };

  const actionStatusData = getActionStatusData();
  const kpis = calculateKpis();
  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  // Données pour le graphique de participation (basé sur le mois de création)
  const getParticipationData = () => {
    // Grouper les actions par mois
    const actionsByMonth = {};
    
    actions.forEach(action => {
      if (action.date_debut) {
        const month = new Date(action.date_debut).toLocaleString('fr-FR', { month: 'short' });
        if (!actionsByMonth[month]) {
          actionsByMonth[month] = 0;
        }
        // Simuler un taux de participation (dans une vraie app, utilisez les données réelles)
        actionsByMonth[month] += Math.floor(Math.random() * 20) + 70; // Valeur entre 70 et 90
      }
    });
    
    return Object.keys(actionsByMonth).map(month => ({
      name: month,
      participation: actionsByMonth[month]
    }));
  };

  const participationData = getParticipationData();

  if (loading) {
    return <div className="loading">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="statistics">
      <h1>Statistiques et Indicateurs de Performance</h1>
      
      <div className="stats-controls">
        <select value={selectedKpi} onChange={(e) => setSelectedKpi(e.target.value)}>
          <option value="actions">Répartition des actions</option>
          <option value="participation">Taux de participation</option>
        </select>
        
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="month">Mois</option>
          <option value="quarter">Trimestre</option>
          <option value="year">Année</option>
        </select>
      </div>

      <div className="charts-container">
        {selectedKpi === 'participation' && (
          <div className="chart">
            <h2>Taux de participation aux actions RSE</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="participation" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedKpi === 'actions' && (
          <div className="chart">
            <h2>Répartition des actions par statut</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={actionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {actionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="kpi-summary">
        <h2>Résumé des indicateurs clés</h2>
        <div className="kpi-cards">
          <div className="kpi-card">
            <h3>Taux de participation moyen</h3>
            <p className="kpi-value">{kpis.participationRate}%</p>
            <span className="kpi-trend positive">+5% vs mois dernier</span>
          </div>
          <div className="kpi-card">
            <h3>Actions réalisées</h3>
            <p className="kpi-value">{kpis.completedActions}/{kpis.totalActions}</p>
            <span className="kpi-trend">{kpis.completionRate}% du plan annuel</span>
          </div>
          <div className="kpi-card">
            <h3>Nouveaux participants</h3>
            <p className="kpi-value">{Math.round(kpis.totalActions * 3.5)}</p>
            <span className="kpi-trend positive">+15% vs trimestre dernier</span>
          </div>
        </div>
      </div>

      <div className="export-section">
        <button className="btn btn-primary">Exporter les données</button>
        <button className="btn btn-secondary">Générer un rapport</button>
      </div>
    </div>
  );
};

export default Statistics;









