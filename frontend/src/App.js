import React, { useState, useEffect } from 'react';
import { 
  fetchActions, 
  createAction, 
  updateAction, 
  deleteAction 
} from './services/api';
import ActionCard from './components/ActionCard';
import ActionForm from './components/ActionForm';
import SearchBar from './components/SearchBar';
import './App.css';


function App() {
  const [actions, setActions] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    population: '',
    ressources: '',
    kpi: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les actions au démarrage
  useEffect(() => {
    const loadActions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchActions();
        setActions(data);
        setFilteredActions(data);
      } catch (err) {
        setError('Erreur de chargement des actions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActions();
  }, []);

  // Filtrer les actions
  useEffect(() => {
    const filtered = actions.filter(action => 
      action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActions(filtered);
  }, [searchTerm, actions]);

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateAction(editingId, formData);
        setActions(actions.map(a => 
          a.id === editingId ? { ...a, ...formData } : a
        ));
      } else {
        const newAction = await createAction(formData);
        setActions([...actions, newAction]);
      }
      
      resetForm();
    } catch (err) {
      setError(editingId 
        ? 'Erreur de mise à jour' 
        : 'Erreur de création');
      console.error(err);
    }
  };

  // Édition d'une action
  const handleEdit = (action) => {
    setFormData(action);
    setEditingId(action.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Suppression d'une action
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette action?')) return;
    
    try {
      await deleteAction(id);
      setActions(actions.filter(a => a.id !== id));
    } catch (err) {
      setError('Erreur de suppression');
      console.error(err);
    }
  };

  // Annulation de l'édition
  const handleCancel = () => {
    resetForm();
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      title: '',
      details: '',
      population: '',
      ressources: '',
      kpi: ''
    });
    setEditingId(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Plateforme RSE - ECE Paris</h1>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </header>

      <main className="main-container">
        <ActionForm 
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={!!editingId}
        />
        
        <section className="actions-section">
          <div className="section-header">
            <h2>Actions RSE ({filteredActions.length})</h2>
            <div className="section-actions">
              <button 
                className="refresh-btn"
                onClick={() => window.location.reload()}
              >
                🔄 Actualiser
              </button>
            </div>
          </div>
          
          {error && <div className="error-banner">{error}</div>}
          
          {isLoading ? (
            <div className="loading">Chargement en cours...</div>
          ) : filteredActions.length === 0 ? (
            <div className="empty-state">
              Aucune action trouvée. Essayez une autre recherche.
            </div>
          ) : (
            <div className="actions-grid">
              {filteredActions.map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <footer className="footer">
        <p>© {new Date().getFullYear()} ECE Paris - Projet RSE</p>
      </footer>
    </div>
  );
} 

export default App;