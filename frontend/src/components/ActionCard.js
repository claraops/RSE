import React from 'react';

const ActionCard = ({ action, onEdit, onDelete, canEdit }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Remplacer le contenu de la carte avec cette structure améliorée
return (
  <div className="action-card">
    <div className="card-header">
      <h3>{action.titre}</h3>
      {canEdit && (
        <div className="card-actions">
          <button className="edit-btn" onClick={() => onEdit(action)}>
            ✏️
          </button>
          <button className="delete-btn" onClick={() => onDelete(action.id)}>
            🗑️
          </button>
        </div>
      )}
    </div>
    
    <p className="details">{action.description}</p>
    
    <div className="card-meta">
      <div className="meta-grid">
        <div className="meta-item">
          <span className="meta-label">Statut :</span>
          <span className={`status-badge ${action.statut}`}>
            {action.statut}
          </span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Période :</span>
          <span>
            {formatDate(action.date_debut)} - {action.date_fin ? formatDate(action.date_fin) : 'En cours'}
          </span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Établissement : </span>
          <div className="etablissement-info">
            <div>{action.etablissement_nom || "Non défini"}</div>
            <div className="etablissement-details">
              {action.etablissement_localisation && `${action.etablissement_localisation} • `}
              {action.etablissement_type || "Non spécifié"}
            </div>
          </div>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Ressources</span>
          <div className="resources-list">
            {action.ressources?.length > 0 ? (
              action.ressources.map((res, idx) => (
                <div key={idx} className="resource-item">
                  • {res.description} ({res.type}, quantité: {res.quantite})
                </div>
              ))
            ) : 'Aucune'}
          </div>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Indicateurs</span>
          <div className="kpi-list">
            {action.kpis?.length > 0 ? (
              action.kpis.map((kpi, idx) => (
                <div key={idx} className="kpi-item">
                  • {kpi.nom}: {kpi.valeur_cible} {kpi.unite_mesure}
                </div>
              ))
            ) : 'Aucun'}
          </div>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Créateur</span>
          <span>
            {action.createur?.prenom} {action.createur?.nom}
          </span>
        </div>
      </div>
    </div>
  </div>
);
};


export default ActionCard;








/*import React from 'react';

const ActionCard = ({ action, onEdit, onDelete, canEdit }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="action-card">
      <div className="card-header">
        <h3>{action.titre}</h3>
        {canEdit && (
          <div className="card-actions">
            <button className="edit-btn" onClick={() => onEdit(action)}>
              ✏️
            </button>
            <button className="delete-btn" onClick={() => onDelete(action.id)}>
              🗑️
            </button>
          </div>
        )}
      </div>
      
      <p className="details">{action.description}</p>
      
      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Statut:</span>
          <span className={`status-badge ${action.statut}`}>
            {action.statut}
          </span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Dates:</span>
          <span>
            {formatDate(action.date_debut)} - {action.date_fin ? formatDate(action.date_fin) : 'En cours'}
          </span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Populations:</span>
          <span>{action.populations?.join(', ') || 'Aucune'}</span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Ressources:</span>
          <div>
            {action.ressources?.length > 0 ? (
              action.ressources.map((res, idx) => (
                <div key={idx} className="resource-item">
                  • {res.description} ({res.type}, quantité: {res.quantite_utilisee})
                </div>
              ))
            ) : 'Aucune'}
          </div>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">KPI:</span>
          <div>
            {action.kpis?.length > 0 ? (
              action.kpis.map((kpi, idx) => (
                <div key={idx} className="kpi-item">
                  • {kpi.nom}: {kpi.valeur_cible} {kpi.unite_mesure}
                </div>
              ))
            ) : 'Aucun'}
          </div>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Créateur:</span>
          <span>
            {action.createur?.prenom} {action.createur?.nom}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;



*/











/*import React from 'react';

const ActionCard = ({ action, onEdit, onDelete }) => {
  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="action-card">
      <div className="card-header">
        <h3>{action.titre}</h3>
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
      
      <p className="details">{action.description}</p>
      
      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Statut:</span>
          <span className={`status-badge ${action.statut.replace('é', 'e')}`}>
            {action.statut}
          </span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Dates:</span>
          <span>
            {formatDate(action.date_debut)} - {action.date_fin ? formatDate(action.date_fin) : 'En cours'}
          </span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Populations:</span>
          <span>
            {action.populations?.join(', ') || 'Aucune'}
          </span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Ressources:</span>
          <div>
            {action.ressources?.length > 0 ? (
              action.ressources.map((res, idx) => (
                <div key={idx} className="resource-item">
                  • {res.description} ({res.type}, quantité: {res.quantite_utilisee})
                </div>
              ))
            ) : 'Aucune'}
          </div>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">KPI:</span>
          <div>
            {action.kpis?.length > 0 ? (
              action.kpis.map((kpi, idx) => (
                <div key={idx} className="kpi-item">
                  • {kpi.nom}: {kpi.valeur_cible} {kpi.unite_mesure} ({kpi.periode_mesure})
                </div>
              ))
            ) : 'Aucun'}
          </div>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Créateur:</span>
          <span>
            {action.createur?.prenom} {action.createur?.nom}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;


























/*import React from 'react';

const ActionCard = ({ action, onEdit, onDelete }) => {
  return (
    <div className="action-card">
      <div className="card-header">
        <h3>{action.titre}</h3>
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
      
      <p className="details">{action.description}</p>
      
      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Statut:</span>
          <span>{action.statut}</span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Dates:</span>
          <span>{action.date_debut} - {action.date_fin || 'En cours'}</span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Populations:</span>
          <span>{action.populations?.join(', ') || 'Aucune'}</span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Ressources:</span>
          <div>
            {action.ressources?.map((res, idx) => (
              <div key={idx}>{res.description} ({res.type})</div>
            )) || 'Aucune'}
          </div>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">KPI:</span>
          <div>
            {action.kpis?.map((kpi, idx) => (
              <div key={idx}>{kpi.nom}: {kpi.valeur_cible} {kpi.unite_mesure}</div>
            )) || 'Aucun'}
          </div>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Créateur:</span>
          <span>{action.createur?.prenom} {action.createur?.nom}</span>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;












/*import React from 'react';



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

export default ActionCard;*/

