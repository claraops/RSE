import React, { useState, useEffect } from "react";
import "./Newsletter.css";

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [form, setForm] = useState({ titre: "", contenu: "", statut: "brouillon" });
  const [editingId, setEditingId] = useState(null); // <- Pour savoir si on édite une newsletter

 /* // Charger les newsletters depuis l’API
  useEffect(() => {
    fetch("http://localhost:5000/api/newsletters") // backend Express/PHP
      .then(res => res.json())
      .then(data => setNewsletters(data))
      .catch(err => console.error(err));
  }, []);
*/

  useEffect(() => {
  fetch("http://localhost:5000/api/newsletters")
    .then(async res => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Réponse invalide du serveur" }));
        throw new Error(err.error || "Erreur serveur");
      }
      return res.json();
    })
    .then(data => setNewsletters(data))
    .catch(err => console.error("Erreur chargement newsletters:", err));
}, []);



  // Ajouter ou modifier une newsletter
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // 🔹 Mode ÉDITION
      await fetch(`http://localhost:5000/api/newsletters/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // 🔹 Mode AJOUT
      await fetch("http://localhost:5000/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    // Recharger après modif
    const res = await fetch("http://localhost:5000/api/newsletters");
    const data = await res.json();
    setNewsletters(data);

    setForm({ titre: "", contenu: "", statut: "brouillon" });
    setEditingId(null);
  };

  // Supprimer une newsletter
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous supprimer cette newsletter ?")) return;

    await fetch(`http://localhost:5000/api/newsletters/${id}`, { method: "DELETE" });

    setNewsletters(prev => prev.filter(n => n.id !== id));
  };

  // Passer en mode édition
  const handleEdit = (newsletter) => {
    setForm({
      titre: newsletter.titre,
      contenu: newsletter.contenu,
      statut: newsletter.statut,
    });
    setEditingId(newsletter.id);
  };

  return (
    <div className="newsletter">
      <h1>Gestion des Newsletters</h1>

      {/* Formulaire ajout / édition */}
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="text"
          placeholder="Titre"
          value={form.titre}
          onChange={(e) => setForm({ ...form, titre: e.target.value })}
          required
        />
        <textarea
          placeholder="Contenu de la newsletter..."
          value={form.contenu}
          onChange={(e) => setForm({ ...form, contenu: e.target.value })}
          rows="5"
          required
        />
        <select
          value={form.statut}
          onChange={(e) => setForm({ ...form, statut: e.target.value })}
        >
          <option value="brouillon">Brouillon</option>
          <option value="publié">Publié</option>
        </select>

        <button type="submit" className="btn btn-primary">
          {editingId ? "Modifier" : "Ajouter"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditingId(null);
              setForm({ titre: "", contenu: "", statut: "brouillon" });
            }}
          >
            Annuler
          </button>
        )}
      </form>

      {/* Liste des newsletters */}
      <div className="newsletter-list">
        {newsletters.map((n) => (
          <div key={n.id} className="newsletter-item">
            <div>
              <h3>{n.titre}</h3>
              <p>{n.contenu}</p>
              <small>
                {n.date_publication
                  ? `Publié le ${new Date(n.date_publication).toLocaleDateString()}`
                  : "Non publié"}
                {" • "}
                Statut : <b>{n.statut}</b>
              </small>
            </div>
            <div className="newsletter-actions">
              <button className="btn btn-secondary" onClick={() => handleEdit(n)}>
                ✏️ Éditer
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(n.id)}>
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Newsletter;


