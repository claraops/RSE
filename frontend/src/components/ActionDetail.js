import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ActionDetail.css";

const ActionDetail = () => {
  const { id } = useParams();
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAction = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Utilisateur non connecté");
        }

        const response = await fetch(`http://localhost:5000/api/action/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();

        setAction({
          id: data.id,
          title: data.titre || "Titre non disponible",
          description: data.description || "Description non disponible",
          startDate: data.date_debut || "Date non définie",
          endDate: data.date_fin || "Date non définie",
          status: data.statut || "inconnu",
          actors: data.createur
            ? `${data.createur.prenom} ${data.createur.nom}`
            : "Non défini",
          resources: data.ressources
            ? data.ressources.map(
                (r) => `${r.description} (${r.type}, ${r.quantite_utilisee})`
              )
            : [],
          kpis: data.kpis
            ? data.kpis.map(
                (k) => `${k.nom} : ${k.valeur_cible} ${k.unite_mesure}`
              )
            : [],
          materials: data.ressources
            ? data.ressources.map((r) => r.description)
            : [],
          etablissement: data.etablissement_nom
            ? `${data.etablissement_nom} (${data.etablissement_type}, ${data.etablissement_localisation})`
            : "Non défini",
        });
      } catch (error) {
        console.error("❌ Erreur fetch action:", error);
        setError("Impossible de charger les détails de l'action");
      } finally {
        setLoading(false);
      }
    };

    fetchAction();
  }, [id]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!action) return <div className="error">Action non trouvée</div>;

  return (
    <div className="action-detail-container">
      <div className="action-detail">
        <Link to="/dashboard" className="back-link">
          ← Retour au tableau de bord
        </Link>

        <div className="action-header">
          <h1>{action.title}</h1>
          <span className={`status-badge ${action.status}`}>
            {action.status === "planifié"
              ? "Planifiée"
              : action.status === "en_cours"
              ? "En cours"
              : action.status === "terminé"
              ? "Terminée"
              : "Inconnu"}
          </span>
        </div>

        <div className="action-content">
          <div className="main-info">
            <div className="description-section">
              <h2>Description</h2>
              <p>{action.description}</p>
            </div>

            <div className="timeline-section">
              <h2>Calendrier</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <span className="timeline-label">Début:</span>
                  <span className="timeline-value">{action.startDate}</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">Fin:</span>
                  <span className="timeline-value">{action.endDate}</span>
                </div>
              </div>
            </div>

            <div className="resources-section">
              <h2>Ressources nécessaires</h2>
              {action.resources.length > 0 ? (
                <ul className="resources-list">
                  {action.resources.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              ) : (
                <p>Aucune ressource définie</p>
              )}
            </div>
          </div>

          <div className="sidebar">
            <div className="info-box">
              <h3>Responsable</h3>
              <p>{action.actors}</p>
            </div>

            <div className="info-box">
              <h3>Établissement</h3>
              <p>{action.etablissement}</p>
            </div>

            <div className="info-box">
              <h3>Statut</h3>
              <p className={`status-text ${action.status}`}>
                {action.status === "planifié"
                  ? "Planifiée"
                  : action.status === "en_cours"
                  ? "En cours"
                  : action.status === "terminé"
                  ? "Terminée"
                  : "Inconnu"}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-section">
          <h2>Indicateurs de performance (KPI)</h2>
          {action.kpis.length > 0 ? (
            <div className="kpi-grid">
              {action.kpis.map((kpi, index) => (
                <div key={index} className="kpi-item">
                  {kpi}
                </div>
              ))}
            </div>
          ) : (
            <p>Aucun KPI défini</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionDetail;
















/*
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ActionDetail.css";

const ActionDetail = () => {
  const { id } = useParams();
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAction = async () => {
      try {
        const token = localStorage.getItem("token"); // récupère le token JWT
        if (!token) {
          throw new Error("Utilisateur non connecté");
        }

        const response = await fetch(`http://localhost:5000/api/action/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔑 ajoute le token JWT
          },
        });

        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();

        setAction({
          id: data.id,
          title: data.titre || "Titre non disponible",
          description: data.description || "Description non disponible",
          startDate: data.date_debut || "Date non définie",
          endDate: data.date_fin || "Date non définie",
          status: data.statut || "inconnu",
          target: data.populations ? data.populations.join(", ") : "Non défini",
          actors: data.createur
            ? `${data.createur.prenom} ${data.createur.nom}`
            : "Non défini",
          resources: data.ressources
            ? data.ressources.map(
                (r) => `${r.description} (${r.type}, ${r.quantite_utilisee})`
              ).join(", ")
            : "Non défini",
          kpis: data.kpis
            ? data.kpis.map(
                (k) => `${k.nom} : ${k.valeur_cible} ${k.unite_mesure}`
              )
            : [],
          materials: data.ressources
            ? data.ressources.map((r) => r.description)
            : [],
          etablissement: data.etablissement_nom
            ? `${data.etablissement_nom} (${data.etablissement_type}, ${data.etablissement_localisation})`
            : "Non défini",
        });
      } catch (error) {
        console.error("❌ Erreur fetch action:", error);
        setError("Impossible de charger les détails de l'action");
      } finally {
        setLoading(false);
      }
    };

    fetchAction();
  }, [id]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!action) return <div className="error">Action non trouvée</div>;

  return (
    <div className="action-detail">
      <Link to="/dashboard" className="back-link">← Retour au tableau de bord</Link>

      <div className="action-header">
        <h1>{action.title}</h1>
        <span className={`status-badge ${action.status}`}>
          {action.status === "planifié" ? "Planifiée" :
           action.status === "en_cours" ? "En cours" :
           action.status === "terminé" ? "Terminée" : "Inconnu"}
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
    </div>
  );
};

export default ActionDetail;






*/

