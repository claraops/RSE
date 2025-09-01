import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";


const ActionDetail = () => {
  const { id } = useParams();
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAction = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/actions/${id}`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();

        // Mapping backend -> frontend
        setAction({
          id: data.id,
          title: data.titre,
          description: data.description,
          startDate: data.date_debut,
          endDate: data.date_fin,
          status: data.statut,
          target: data.populations?.join(", ") || "Non défini",
          actors: data.createur ? `${data.createur.prenom} ${data.createur.nom}` : "Non défini",
          resources: data.ressources?.map(
            (r) => `${r.description} (${r.type}, ${r.quantite_utilisee})`
          ).join(", ") || "Non défini",
          kpis: data.kpis?.map(
            (k) => `${k.nom} : ${k.valeur_cible} ${k.unite_mesure}`
          ) || [],
          materials: data.ressources?.map((r) => r.description) || [],
          etablissement: data.etablissement_nom
            ? `${data.etablissement_nom} (${data.etablissement_type}, ${data.etablissement_localisation})`
            : "Non défini"
        });

      } catch (error) {
        console.error("❌ Erreur fetch action:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAction();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!action) return <div>Action non trouvée</div>;

  return (
    <div className="action-detail">
      <Link to="/dashboard" className="back-link">← Retour au tableau de bord</Link>

      <div className="action-header">
        <h1>{action.title}</h1>
        <span className={`status-badge ${action.status}`}>
          {action.status === "planifié" ? "Planifiée" :
           action.status === "en_cours" ? "En cours" : "Terminée"}
        </span>
      </div>

      <p className="action-description">{action.description}</p>

      <div className="action-info-grid">
        <div className="info-card">
          <h3>Dates</h3>
          <p>Du {action.startDate} au {action.endDate}</p>
        </div>

        <div className="info-card">
          <h3>Population cible</h3>
          <p>{action.target}</p>
        </div>

        <div className="info-card">
          <h3>Créateur</h3>
          <p>{action.actors}</p>
        </div>

        <div className="info-card">
          <h3>Établissement</h3>
          <p>{action.etablissement}</p>
        </div>

        <div className="info-card">
          <h3>Ressources nécessaires</h3>
          <p>{action.resources}</p>
        </div>
      </div>

      <div className="kpi-section">
        <h2>Indicateurs de performance (KPI)</h2>
        {action.kpis.length > 0 ? (
          <ul>
            {action.kpis.map((kpi, index) => (
              <li key={index}>{kpi}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun KPI défini</p>
        )}
      </div>

      <div className="materials-section">
        <h2>Matériel de sensibilisation</h2>
        {action.materials.length > 0 ? (
          <div className="materials-list">
            {action.materials.map((material, index) => (
              <div key={index} className="material-item">
                <span>{material}</span>
                <button className="download-btn">Télécharger</button>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun matériel disponible</p>
        )}
      </div>

      <div className="action-actions">
        <Link to={`/edit-action/${action.id}`} className="btn btn-primary">Modifier</Link>
        <button className="btn btn-secondary">Exporter</button>
      </div>
    </div>
  );
};

export default ActionDetail;















/*import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ActionDetail = () => {
  const { id } = useParams();
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAction = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/actionrse/${id}`, {
          credentials: "include", // si ton authMiddleware attend un token/session
        });

        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();

        // 🟢 Adapter les champs SQL → React
        setAction({
          id: data.id,
          title: data.titre,
          description: data.description,
          startDate: data.date_debut,
          endDate: data.date_fin,
          status: data.statut, // planifié / en_cours / terminé
          target: data.target || "Non défini",   // si tu ajoutes une table cible plus tard
          actors: data.actors || "Non défini",
          resources: data.resources || "Non défini",
          kpis: data.kpis || [],
          materials: data.materials || []
        });

      } catch (error) {
        console.error("❌ Erreur fetch action:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAction();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!action) return <div>Action non trouvée</div>;

  return (
    <div className="action-detail">
      <Link to="/dashboard" className="back-link">← Retour au tableau de bord</Link>

      <div className="action-header">
        <h1>{action.title}</h1>
        <span className={`status-badge ${action.status}`}>
          {action.status === "planifié" ? "Planifiée" :
           action.status === "en_cours" ? "En cours" : "Terminée"}
        </span>
      </div>

      <p className="action-description">{action.description}</p>

      <div className="action-info-grid">
        <div className="info-card">
          <h3>Dates</h3>
          <p>Du {action.startDate} au {action.endDate}</p>
        </div>

        <div className="info-card">
          <h3>Population cible</h3>
          <p>{action.target}</p>
        </div>

        <div className="info-card">
          <h3>Acteurs impliqués</h3>
          <p>{action.actors}</p>
        </div>

        <div className="info-card">
          <h3>Ressources nécessaires</h3>
          <p>{action.resources}</p>
        </div>
      </div>

      <div className="kpi-section">
        <h2>Indicateurs de performance (KPI)</h2>
        {action.kpis.length > 0 ? (
          <ul>
            {action.kpis.map((kpi, index) => (
              <li key={index}>{kpi}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun KPI défini</p>
        )}
      </div>

      <div className="materials-section">
        <h2>Matériel de sensibilisation</h2>
        {action.materials.length > 0 ? (
          <div className="materials-list">
            {action.materials.map((material, index) => (
              <div key={index} className="material-item">
                <span>{material}</span>
                <button className="download-btn">Télécharger</button>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun matériel disponible</p>
        )}
      </div>

      <div className="action-actions">
        <Link to={`/edit-action/${action.id}`} className="btn btn-primary">Modifier</Link>
        <button className="btn btn-secondary">Exporter</button>
      </div>
    </div>
  );
};

export default ActionDetail;*/
