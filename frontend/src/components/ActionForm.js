import React, { useState, useEffect } from 'react';

const ActionForm = ({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  isEditing,
  populations
}) => {
  const [newRessource, setNewRessource] = useState({ description: '', type: 'matérielle', quantite: 1 });
  const [newKpi, setNewKpi] = useState({ nom: '', valeur_cible: '', unite_mesure: '', periode_mesure: 'mensuel' });

  const handleRessourceChange = (e) => {
    const { name, value } = e.target;
    setNewRessource(prev => ({ ...prev, [name]: value }));
  };

  const handleKpiChange = (e) => {
    const { name, value } = e.target;
    setNewKpi(prev => ({ ...prev, [name]: value }));
  };

  const addRessource = () => {
    if (newRessource.description) {
      onChange({
        target: {
          name: 'ressources',
          value: [...formData.ressources, newRessource]
        }
      });
      setNewRessource({ description: '', type: 'matérielle', quantite: 1 });
    }
  };

  const addKpi = () => {
    if (newKpi.nom) {
      onChange({
        target: {
          name: 'kpis',
          value: [...formData.kpis, newKpi]
        }
      });
      setNewKpi({ nom: '', valeur_cible: '', unite_mesure: '', periode_mesure: 'mensuel' });
    }
  };

  return (
    <div className="form-section">
      <h2 className="form-title">
        {isEditing ? "Modifier l'action RSE" : "Ajouter une nouvelle action RSE"}
      </h2>
      
      <form onSubmit={onSubmit} className="action-form">
        {/* Champs de base */}
        <div className="form-group">
          <label htmlFor="titre">Titre*</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            required
            rows="4"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date_debut">Date de début</label>
            <input
              type="date"
              id="date_debut"
              name="date_debut"
              value={formData.date_debut}
              onChange={onChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date_fin">Date de fin</label>
            <input
              type="date"
              id="date_fin"
              name="date_fin"
              value={formData.date_fin}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="statut">Statut</label>
          <select
            id="statut"
            name="statut"
            value={formData.statut}
            onChange={onChange}
          >
            <option value="planifié">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
        </div>
        
        {/* Populations cibles */}

<div className="form-group">
  <label>Populations cibles</label>
  <div className="checkbox-group">
    {populations.map(pop => (
      <label key={pop.id} className="checkbox-item">
        <input
          type="checkbox"
          name="populations"
          value={pop.type}
          checked={formData.populations.includes(pop.type)}
          onChange={(e) => {
            const newValues = e.target.checked
              ? [...formData.populations, pop.type]
              : formData.populations.filter(v => v !== pop.type);
            onChange({
              target: {
                name: 'populations',
                value: newValues
              }
            });
          }}
        />
        {pop.type}
      </label>
    ))}
  </div>
</div>


       {/* <div className="form-group">
          <label>Populations cibles</label>
          <div className="checkbox-group">
            {populations.map(pop => (
              <label key={pop.id}>
                <input
                  type="checkbox"
                  name="populations"
                  value={pop.type}
                  checked={formData.populations.includes(pop.type)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...formData.populations, pop.type]
                      : formData.populations.filter(v => v !== pop.type);
                    onChange({
                      target: {
                        name: 'populations',
                        value: newValues
                      }
                    });
                  }}
                />
                {pop.type}
              </label>
            ))}
          </div>
        </div> }
        
        {/* Ressources */}
        <div className="form-group">
          <label>Ressources</label>
          {formData.ressources.map((res, index) => (
            <div key={index} className="resource-item">
              <div>{res.description} ({res.type}, quantité: {res.quantite})</div>
            </div>
          ))}
          <div className="form-row">
            <input
              type="text"
              placeholder="Description"
              name="description"
              value={newRessource.description}
              onChange={handleRessourceChange}
            />
            <select
              name="type"
              value={newRessource.type}
              onChange={handleRessourceChange}
            >
              <option value="matérielle">Matérielle</option>
              <option value="humaine">Humaine</option>
              <option value="financière">Financière</option>
            </select>
            <input
              type="number"
              placeholder="Quantité"
              name="quantite"
              value={newRessource.quantite}
              onChange={handleRessourceChange}
              min="1"
            />
            <button type="button" onClick={addRessource}>Ajouter</button>
          </div>
        </div>
        
        {/* KPIs */}
        <div className="form-group">
          <label>Indicateurs KPI</label>
          {formData.kpis.map((kpi, index) => (
            <div key={index} className="kpi-item">
              <div>{kpi.nom} ({kpi.valeur_cible} {kpi.unite_mesure})</div>
            </div>
          ))}
          <div className="form-row">
            <input
              type="text"
              placeholder="Nom"
              name="nom"
              value={newKpi.nom}
              onChange={handleKpiChange}
            />
            <input
              type="number"
              placeholder="Valeur cible"
              name="valeur_cible"
              value={newKpi.valeur_cible}
              onChange={handleKpiChange}
            />
            <input
              type="text"
              placeholder="Unité"
              name="unite_mesure"
              value={newKpi.unite_mesure}
              onChange={handleKpiChange}
            />
            <select
              name="periode_mesure"
              value={newKpi.periode_mesure}
              onChange={handleKpiChange}
            >
              <option value="journalier">Journalier</option>
              <option value="hebdomadaire">Hebdomadaire</option>
              <option value="mensuel">Mensuel</option>
            </select>
            <button type="button" onClick={addKpi}>Ajouter</button>
          </div>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="submit-btn primary-btn">
            {isEditing ? "Mettre à jour" : "Ajouter l'action"}
          </button>
          
          {isEditing && (
            <button type="button" className="cancel-btn secondary-btn" onClick={onCancel}>
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ActionForm;
































/*import React from 'react';

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
export default ActionForm;*/