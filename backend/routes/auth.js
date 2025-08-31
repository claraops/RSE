// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/*
router.post("/login", async (req, res) => {
  const { email, password } = req.body;  // ✅ ici on prend "password"

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe obligatoires" });
  }

  const [users] = await db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);

  if (users.length === 0) {
    return res.status(401).json({ error: "❌ Utilisateur introuvable" });
  }

  const user = users[0];
  const hash = user.password; // ta colonne doit bien s’appeler "password"

  const isMatch = await bcrypt.compare(password, hash);
  if (!isMatch) {
    return res.status(401).json({ error: "❌ Mot de passe incorrect" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "✅ Connexion réussie", token, role: user.role });
});


/* 📌 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
    if (!user.length) return res.status(401).json({ error: "Utilisateur non trouvé" });

    const match = await bcrypt.compare(password, user[0].motdepasse);
    if (!match) return res.status(401).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user[0].role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }

});
*/


/**
 * REGISTER
 */
router.post('/register', async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;

  try {
    // Vérification email existant
    const [existing] = await db.query(
      'SELECT id FROM utilisateur WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    // Hachage mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création utilisateur
    const [result] = await db.query(
      'INSERT INTO utilisateur (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, email, hashedPassword, role || 'user']
    );

    // Génération token
    const token = jwt.sign(
      { id: result.insertId, email, role: role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: { id: result.insertId, nom, prenom, email, role: role || 'user' }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * LOGIN
 */
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

module.exports = router;








/*const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/register', async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;

  try {
    // Vérification email existant
    const [existing] = await db.query(
      'SELECT id FROM utilisateur WHERE email = ?', 
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    // Hachage mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création utilisateur
    const [result] = await db.query(
      'INSERT INTO utilisateur (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, email, hashedPassword, role || 'user']
    );

    // Génération token (identique au login)
    const token = jwt.sign(
      { 
        id: result.insertId, 
        email: email,
        role: role || 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Réponse standardisée comme le login
    res.status(201).json({ 
      token,
      user: {
        id: result.insertId,
        email,
        nom,
        prenom,
        role: role || 'user'
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;













/*const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


// routes/auth.js
router.post('/register', async (req, res) => {
  console.log('Requête d\'inscription reçue:', req.body);

  // Ajout du champ 'role' dans la déstructuration
  const { nom, prenom, email, password, role } = req.body;

  // Validation des données
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  try {
    // Vérifier si l'email existe déjà
    const [existing] = await db.query(
      'SELECT id FROM utilisateur WHERE email = ?', 
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertion dans la base de données AVEC le rôle
    const [result] = await db.query(
      'INSERT INTO utilisateur (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [nom || null, prenom || null, email, hashedPassword, role || 'user'] // Ajout du rôle
    );

    // Génération du token JWT
    const token = jwt.sign(
      { 
        id: result.insertId, 
        email: email,
        role: role || 'user' // Ajout du rôle dans le token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Réponse enrichie avec le rôle
    res.status(201).json({ 
      message: 'Compte créé avec succès',
      token,
      userId: result.insertId,
      user: { // Nouvelle structure
        id: result.insertId,
        email,
        nom,
        prenom,
        role: role || 'user'
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'inscription',
      error: error.message
    });
  }
});

module.exports = router; 





















/*
// Inscription
router.post('/register', async (req, res) => {
  console.log('Requête d\'inscription reçue:', req.body);

  const { nom, prenom, email, password } = req.body;

  // Validation des données
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  try {
    // Vérifier si l'email existe déjà
    const [existing] = await db.query(
      'SELECT id FROM utilisateur WHERE email = ?', 
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertion dans la base de données
    const [result] = await db.query(
      'INSERT INTO utilisateur (nom, prenom, email, password) VALUES (?, ?, ?, ?)',
      [nom || null, prenom || null, email, hashedPassword]
    );

    // Génération du token JWT
    const token = jwt.sign(
      { 
        id: result.insertId, 
        email: email,
        role: 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'Compte créé avec succès',
      token,
      userId: result.insertId,
      email,
      nom,
      prenom
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'inscription',
      error: error.message
    });
  }
});

module.exports = router;*/





























/*// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Inscription
router.post('/register', async (req, res) => {
  console.log('Requête d\'inscription reçue:', req.body);
  
  const { email, password, nom, prenom } = req.body;
  
  // Validation des données
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  try {
    // Vérifier si l'email existe déjà
    const [existing] = await db.query(
      'SELECT id FROM utilisateur WHERE email = ?', 
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insertion dans la base de données
  

    const [result] = await db.query(
  'INSERT INTO utilisateur (nom, prenom, email, password) VALUES (?, ?, ?, ?)',
  [nom || null, prenom || null, email, hashedPassword]
);

    
    // Génération du token JWT
    const token = jwt.sign(
      { 
        id: result.insertId, 
        email: email,
        role: 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ 
      message: 'Compte créé avec succès',
      token,
      userId: result.insertId,
      email: email,
      nom: nom,
      prenom: prenom
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    // Envoyez le message d'erreur complet pour le débogage
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'inscription',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;*/






/*const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Inscription
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Vérification si l'email existe déjà
    const [existing] = await db.query('SELECT * FROM utilisateur WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Insertion du nouvel utilisateur
    await db.query(
      'INSERT INTO utilisateur (nom, prenom, email, password) VALUES (?, SHA2(?, 256))',
      [email, password]
    );
    
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Recherche de l'utilisateur
    const [users] = await db.query(
      'SELECT * FROM utilisateur WHERE email = ? AND password = SHA2(?, 256)',
      [email, password]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = users[0];
    
    // Génération du token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;*/