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
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    statut: 'planifié',
    createur_id: 1,
    populations: [],
    ressources: [],
    kpis: []
  });
  const [populations, setPopulations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const actionsData = await fetchActions();
        setActions(actionsData);
        setFilteredActions(actionsData);
        
        setPopulations([
          { id: 1, type: 'étudiants' },
          { id: 2, type: 'enseignants' },
          { id: 3, type: 'admin' },
          { id: 4, type: 'partenaires' },
          { id: 5, type: 'tout' }
        ]);
        
      } catch (err) {
        setError('Erreur de chargement des données');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const filtered = actions.filter(action => 
      action.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActions(filtered);
  }, [searchTerm, actions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateAction(editingId, formData);
        setActions(actions.map(a => a.id === editingId ? { ...a, ...formData } : a));
      } else {
        const newAction = await createAction(formData);
        setActions([...actions, newAction]);
      }
      
      resetForm();
    } catch (err) {
      setError(editingId ? 'Erreur de mise à jour' : 'Erreur de création');
      console.error(err);
    }
  };

  const handleEdit = (action) => {
    setFormData({
      titre: action.titre,
      description: action.description,
      date_debut: action.date_debut,
      date_fin: action.date_fin,
      statut: action.statut,
      createur_id: action.createur_id,
      populations: action.populations || [],
      ressources: action.ressources || [],
      kpis: action.kpis || []
    });
    setEditingId(action.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette action?')) return;
    
    try {
      await deleteAction(id);
      setActions(actions.filter(a => a.id !== id));
    } catch (err) {
      setError('Erreur de suppression');
      console.error(err);
      
      // Effacer l'erreur après 3 secondes
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      statut: 'planifié',
      createur_id: 1,
      populations: [],
      ressources: [],
      kpis: []
    });
    setEditingId(null);
  };

  return (
    <div className="app">   

      <header className="header">
  <div className="header-content">
    <div className="logo-container">
      <img 
        src="/ECE.png" 
        alt="ECE Paris" 
        className="logo"
      />
    </div>
    <h1 className="header-title">Plateforme RSE - ECE Paris</h1>
    <div className="user-avatar-container">
      <div className="user-avatar">
        <span>U</span>
      </div>
    </div>
  </div>
</header>

      {/*<header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src="ECE.png" 
              alt="ECE Paris" 
              className="logo"
            />
            <h1>Plateforme RSE - ECE Paris</h1>
          </div>
          
          <div className="header-right">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <div className="user-avatar">
              <span>U</span>
            </div>
          </div>
        </div>
      </header> */} 


      <main className="main-container">
        <ActionForm 
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingId}
          populations={populations}
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

           <div className="action-search-container">
    <SearchBar value={searchTerm} onChange={setSearchTerm} />
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






































































































































/*import React, { useState, useEffect } from 'react';
import { fetchActions, createAction } from './services/api';
import ActionCard from './components/ActionCard';
import ActionForm from './components/ActionForm';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [actions, setActions] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    statut: 'planifié',
    createur_id: 1, // ID par défaut
    populations: [],
    ressources: [],
    kpis: []
  });
  const [populations, setPopulations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les actions et les populations au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Charger les actions
        const actionsData = await fetchActions();
        setActions(actionsData);
        setFilteredActions(actionsData);
        
        // Charger les populations (normalement depuis une API)
        // Pour l'exemple, on utilise des données statiques
        setPopulations([
          { id: 1, type: 'étudiants' },
          { id: 2, type: 'enseignants' },
          { id: 3, type: 'admin' },
          { id: 4, type: 'partenaires' },
          { id: 5, type: 'tout' }
        ]);
        
      } catch (err) {
        setError('Erreur de chargement des données');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filtrer les actions
  useEffect(() => {
    const filtered = actions.filter(action => 
      action.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          // Mettre à jour l'état local
          setActions(actions.map(a => a.id === editingId ? { ...a, ...formData } : a));
        } else {
          const newAction = await createAction(formData);
          setActions([...actions, newAction]);
        }
      /*if (editingId) {
        // Mise à jour (à implémenter)
        // await updateAction(editingId, formData);
      } else {
        const newAction = await createAction(formData);
        setActions([...actions, newAction]);
      }
      
      resetForm();
    } catch (err) {
      setError(editingId ? 'Erreur de mise à jour' : 'Erreur de création');
      console.error(err);
    }
  };

  // Édition d'une action
  const handleEdit = (action) => {
    setFormData({
      titre: action.titre,
      description: action.description,
      date_debut: action.date_debut,
      date_fin: action.date_fin,
      statut: action.statut,
      createur_id: action.createur_id,
      populations: action.populations || [],
      ressources: action.ressources || [],
      kpis: action.kpis || []
    });
    setEditingId(action.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Suppression d'une action
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette action?')) return;
    
    try {
      await deleteAction(id);
      // Implémenter la suppression dans l'API
      // await deleteAction(id);
      setActions(actions.filter(a => a.id !== id));
    } catch (err) {
      setError('Erreur de suppression');
      console.error(err);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      statut: 'planifié',
      createur_id: 1,
      populations: [],
      ressources: [],
      kpis: []
    });
    setEditingId(null);
  };

  return (
    <div className="app">
      <header className="header">
        <header className="header">
  <div className="header-content">
    <div className="logo-container">
      <img 
        src="/ece-logo.png" 
        alt="ECE Paris Logo" 
        className="logo"
      />
      <h1>Plateforme RSE - ECE Paris</h1>
    </div>
    

    <div className="user-avatar">
      <span>U</span>
    </div>
  </div>
</header>
          {/* 
        <div className="header-content">
          <h1>Plateforme RSE - ECE Paris</h1>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </header> }

      <main className="main-container">
        <ActionForm 
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingId}
          populations={populations}
        />


         <div className="header-content">
          <h1>Plateforme RSE - ECE Paris</h1>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

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












































/*import React, { useState, useEffect } from 'react';
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

export default App;*/