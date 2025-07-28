import React from 'react';



const ActionCard = ({ action, onEdit, onDelete }) => {
  return (
    <div className="action-card">
      <div className="card-header">
        <h3>{action.title}</h3>
        <div className="card-actions">
          <button 
            className="edit-btn"
            onClick={() => onEdit(action)}
            aria-label="Modifier"
          >
            ✏️
          </button>
          <button 
            className="delete-btn"
            onClick={() => onDelete(action.id)}
            aria-label="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <p className="details">{action.details.toLowerCase()}</p>
      
      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Population:</span>
          <span>{action.population}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Ressources:</span>
          <span>{action.ressources}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">KPI:</span>
          <span>{action.kpi}</span>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;