import React, { useState, useEffect } from 'react';
import { fetchActions, createAction, updateAction, deleteAction } from './services/api';
import ActionCard from './components/ActionCard';
import ActionForm from './components/ActionForm';
import SearchBar from './components/SearchBar';
import './App.css';
import { useAuth } from './context/AuthContext';

function RSEPlatform() {
  const { user } = useAuth();
  const [actions, setActions] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    statut: "planifié",
    createur_id: user?.id || 1,
    populations: [],
    ressources: [],
    kpis: [],
  });
  const [populations] = useState([
    { id: 1, type: "étudiants" },
    { id: 2, type: "enseignants" },
    { id: 3, type: "admin" },
    { id: 4, type: "partenaires" },
    { id: 5, type: "tout" },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchActions();
      setActions(response.data);
      setFilteredActions(response.data);
    } catch (err) {
      console.error("Erreur de chargement des données:", err);
      setError("Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = actions.filter(action =>
      action.titre && action.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description && action.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      } else {
        await createAction(formData);
      }
      resetForm();
      await loadData(); // Recharger les données
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(editingId ? "Erreur de mise à jour" : "Erreur de création");
    }
  };

  const handleEdit = (action) => {
    setFormData({
      titre: action.titre || "",
      description: action.description || "",
      date_debut: action.date_debut || "",
      date_fin: action.date_fin || "",
      statut: action.statut || "planifié",
      createur_id: action.createur_id || user?.id || 1,
      populations: action.populations || [],
      ressources: action.ressources || [],
      kpis: action.kpis || [],
    });
    setEditingId(action.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette action ?")) return;
    try {
      await deleteAction(id);
      await loadData(); // Recharger les données
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur de suppression");
    }
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      date_debut: "",
      date_fin: "",
      statut: "planifié",
      createur_id: user?.id || 1,
      populations: [],
      ressources: [],
      kpis: [],
    });
    setEditingId(null);
  };

  return (
    <div className="app">
     

      <main className="main-container">
        {user?.role === "admin" && (
          <ActionForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isEditing={!!editingId}
            populations={populations}
          />
        )}

        <section className="actions-section">
          <div className="section-header">
            <h2>Actions RSE ({filteredActions.length})</h2>
            <div className="section-actions">
              <button className="refresh-btn" onClick={loadData}>
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
            <div className="empty-state">Aucune action trouvée</div>
          ) : (
            <div className="actions-grid">
              {filteredActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={user?.role === "admin"}
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

export default RSEPlatform;






/*import React, { useState, useEffect } from 'react';
import { fetchActions, createAction, updateAction, deleteAction } from './services/api';
import ActionCard from './components/ActionCard';
import ActionForm from './components/ActionForm';
import SearchBar from './components/SearchBar';
import './App.css';
import { useAuth } from './context/AuthContext';

function RSEPlatform() {
  const { user } = useAuth();
  const [actions, setActions] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    statut: "planifié",
    createur_id: user?.id || 1,
    populations: [],
    ressources: [],
    kpis: [],
  });
  const [populations] = useState([
    { id: 1, type: "étudiants" },
    { id: 2, type: "enseignants" },
    { id: 3, type: "admin" },
    { id: 4, type: "partenaires" },
    { id: 5, type: "tout" },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchActions();
      setActions(response.data);
      setFilteredActions(response.data);
    } catch (err) {
      setError("Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = actions.filter(action =>
      action.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActions(filtered);
  }, [searchTerm, actions]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAction(editingId, formData);
        setActions(actions.map(a => a.id === editingId ? { ...a, ...formData } : a));
      } else {
        const response = await createAction(formData);
        setActions([...actions, response.data]);
      }
      resetForm();
      loadData(); // Recharger les données
    } catch (err) {
      setError(editingId ? "Erreur de mise à jour" : "Erreur de création");
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
      kpis: action.kpis || [],
    });
    setEditingId(action.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette action ?")) return;
    try {
      await deleteAction(id);
      setActions(actions.filter(a => a.id !== id));
    } catch (err) {
      setError("Erreur de suppression");
    }
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      date_debut: "",
      date_fin: "",
      statut: "planifié",
      createur_id: user?.id || 1,
      populations: [],
      ressources: [],
      kpis: [],
    });
    setEditingId(null);
  };

  return (
    <div className="app">

      <main className="main-container">
        {user?.role === "admin" && (
          <ActionForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isEditing={!!editingId}
            populations={populations}
          />
        )}

        <section className="actions-section">
          <div className="section-header">
            <h2>Actions RSE ({filteredActions.length})</h2>
            <div className="section-actions">
              <button className="refresh-btn" onClick={loadData}>
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
            <div className="empty-state">Aucune action trouvée</div>
          ) : (
            <div className="actions-grid">
              {filteredActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={user?.role === "admin"}
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

export default RSEPlatform;*/
