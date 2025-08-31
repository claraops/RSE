import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Planning.css";


const Planning = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [actions, setActions] = useState([]);

  useEffect(() => {
    // Simulation de données - à remplacer par un appel API
    const mockActions = [
      { id: 1, title: 'Journée de nettoyage', date: '2024-09-15', status: 'planned' },
      { id: 2, title: 'Atelier recyclage', date: '2024-09-22', status: 'planned' },
      { id: 3, title: 'Collecte de vêtements', date: '2024-10-05', status: 'planned' },
      { id: 4, title: 'Conférence sur le développement durable', date: '2024-10-12', status: 'planned' }
    ];
    setActions(mockActions);
  }, []);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const years = [2024, 2025];

  const filteredActions = actions.filter(action => {
    const actionDate = new Date(action.date);
    return actionDate.getMonth() === selectedMonth && 
           actionDate.getFullYear() === selectedYear;
  });

  return (
    <div className="planning">
      <h1>Planning des Actions RSE</h1>
      
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
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="calendar">
        {filteredActions.length > 0 ? (
          filteredActions.map(action => (
            <div key={action.id} className="calendar-event">
              <div className="event-date">
                {new Date(action.date).getDate()} {months[selectedMonth]}
              </div>
              <div className="event-details">
                <h3>{action.title}</h3>
                <span className={`event-status ${action.status}`}>
                  {action.status === 'planned' ? 'Planifiée' : 
                   action.status === 'in-progress' ? 'En cours' : 'Terminée'}
                </span>
                <Link to={`/action/${action.id}`} className="event-link">Voir détails</Link>
              </div>
            </div>
          ))
        ) : (
          <p>Aucune action planifiée pour cette période.</p>
        )}
      </div>

      <div className="planning-actions">
        <Link to="/create-action" className="btn btn-primary">
          Ajouter une action au planning
        </Link>
      </div>
    </div>
  );
};

export default Planning;