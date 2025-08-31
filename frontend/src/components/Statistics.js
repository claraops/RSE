import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Statistics = () => {
  const [selectedKpi, setSelectedKpi] = useState('participation');
  const [timeRange, setTimeRange] = useState('month');

  // Données simulées pour les graphiques
  const participationData = [
    { name: 'Jan', participation: 65 },
    { name: 'Fév', participation: 70 },
    { name: 'Mar', participation: 75 },
    { name: 'Avr', participation: 80 },
    { name: 'Mai', participation: 78 },
    { name: 'Juin', participation: 82 }
  ];

  const actionStatusData = [
    { name: 'Terminées', value: 12 },
    { name: 'En cours', value: 5 },
    { name: 'Planifiées', value: 7 }
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="statistics">
      <h1>Statistiques et Indicateurs de Performance</h1>
      
      <div className="stats-controls">
        <select value={selectedKpi} onChange={(e) => setSelectedKpi(e.target.value)}>
          <option value="participation">Taux de participation</option>
          <option value="actions">Répartition des actions</option>
          <option value="impact">Impact environnemental</option>
        </select>
        
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
          <option value="quarter">Trimestre</option>
          <option value="year">Année</option>
        </select>
      </div>

      <div className="charts-container">
        {selectedKpi === 'participation' && (
          <div className="chart">
            <h2>Taux de participation aux actions RSE</h2>
            <BarChart width={600} height={300} data={participationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="participation" fill="#8884d8" />
            </BarChart>
          </div>
        )}

        {selectedKpi === 'actions' && (
          <div className="chart">
            <h2>Répartition des actions par statut</h2>
            <PieChart width={400} height={300}>
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
          </div>
        )}
      </div>

      <div className="kpi-summary">
        <h2>Résumé des indicateurs clés</h2>
        <div className="kpi-cards">
          <div className="kpi-card">
            <h3>Taux de participation moyen</h3>
            <p className="kpi-value">75%</p>
            <span className="kpi-trend positive">+5% vs mois dernier</span>
          </div>
          <div className="kpi-card">
            <h3>Actions réalisées</h3>
            <p className="kpi-value">12/24</p>
            <span className="kpi-trend">50% du plan annuel</span>
          </div>
          <div className="kpi-card">
            <h3>Nouveaux participants</h3>
            <p className="kpi-value">45</p>
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