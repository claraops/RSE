import React from 'react';

const ActionForm = ({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  isEditing 
}) => {
  return (
    <div className="form-section">
      <h2 className="form-title">
        {isEditing ? "Modifier l'action" : "Ajouter une nouvelle action"}
      </h2>
      
      <form onSubmit={onSubmit} className="action-form">
        <div className="form-group">
          <label htmlFor="title">Titre*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            placeholder="Titre de l'action RSE"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="details">Détails*</label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={onChange}
            required
            placeholder="Description détaillée de l'action"
            rows="4"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="population">Population cible</label>
            <input
              type="text"
              id="population"
              name="population"
              value={formData.population}
              onChange={onChange}
              placeholder="Qui est concerné?"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ressources">Ressources nécessaires</label>
            <input
              type="text"
              id="ressources"
              name="ressources"
              value={formData.ressources}
              onChange={onChange}
              placeholder="Matériel, budget, personnel..."
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="kpi">Indicateur KPI</label>
          <input
            type="text"
            id="kpi"
            name="kpi"
            value={formData.kpi}
            onChange={onChange}
            placeholder="Comment mesurer le succès?"
          />
        </div>
        
        <div className="form-buttons">
          <button 
            type="submit" 
            className="submit-btn primary-btn"
          >
            {isEditing ? "Mettre à jour" : "Ajouter l'action"}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              className="cancel-btn secondary-btn"
              onClick={onCancel}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Export par défaut obligatoire
export default ActionForm;