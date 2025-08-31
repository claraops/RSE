// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();

// REGISTER - Version corrigée avec le nom de table correct
router.post("/register", async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    if (!nom || !prenom || !email || !password || !role) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    // Vérifier si l'utilisateur existe déjà - Utilisation de la table "utilisateur"
    const [existing] = await db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer dans la DB - Utilisation de la table "utilisateur"
    const [result] = await db.query(
      "INSERT INTO utilisateur (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [nom, prenom, email, hashedPassword, role]
    );

    // Générer un token JWT
    const token = jwt.sign(
      { id: result.insertId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: result.insertId,
        nom,
        prenom,
        email,
        role
      }
    });
  } catch (err) {
    console.error("❌ Erreur register:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

// LOGIN - Version corrigée avec le nom de table correct
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe - Utilisation de la table "utilisateur"
    const [rows] = await db.query(
      'SELECT * FROM utilisateur WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const user = rows[0];

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Génération token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      message: "✅ Connexion réussie",
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;













/*// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();

// REGISTER - Version corrigée
router.post("/register", async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    if (!nom || !prenom || !email || !password || !role) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    // Vérifier si l'utilisateur existe déjà
    const [existing] = await db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer dans la DB
    const [result] = await db.query(
      "INSERT INTO utilisateur (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [nom, prenom, email, hashedPassword, role]
    );

    // Générer un token JWT
    const token = jwt.sign(
      { id: result.insertId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: result.insertId,
        nom,
        prenom,
        email,
        role
      }
    });
  } catch (err) {
    console.error("❌ Erreur register:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

// LOGIN - Version corrigée
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const [rows] = await db.query(
      'SELECT * FROM utilisateur WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const user = rows[0];

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Génération token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      message: "✅ Connexion réussie",
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;*/