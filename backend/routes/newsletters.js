const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Récupérer toutes les newsletters
router.get("/", (req, res) => {
  db.query("SELECT * FROM Newsletter", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ✅ Créer une newsletter
router.post("/", (req, res) => {
  const { titre, contenu, date_publication, statut, action_id, createur_id } = req.body;
  db.query(
    "INSERT INTO Newsletter (titre, contenu, date_publication, statut, action_id, createur_id) VALUES (?, ?, ?, ?, ?, ?)",
    [titre, contenu, date_publication, statut, action_id, createur_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// ✅ Supprimer une newsletter
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM Newsletter WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Newsletter supprimée" });
  });
});

module.exports = router;