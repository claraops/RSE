const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

require('dotenv').config();

const db = require('./config/db'); // ⚡ pool.promise()

const jwt = require('jsonwebtoken');

// ========================
// Middleware d’auth
// ========================
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

// ========================
// Middlewares globaux
// ========================
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ========================
// Routes importées
// ========================
const authRouter = require('./routes/auth');
const actionRSERouter = require('./routes/actionRSE');

app.use('/api/auth', authRouter);
app.use('/api/action', actionRSERouter);

// ========================
// Routes test
// ========================
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});


// Exemple en Express
app.get('/api/actions/:id', async (req, res) => {
    const id = req.params.id;
    const action = await db.query('SELECT * FROM actionrse WHERE id = ?', [id]);
    if (!action.length) {
        return res.status(404).json({ error: 'Action non trouvée' });
    }
    res.json(action[0]);
});


// ========================
// ROUTES NEWSLETTERS
// ========================

// GET - Toutes les newsletters
app.get("/api/newsletters", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM newsletter");
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur SQL:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

// POST - Ajouter une newsletter
app.post("/api/newsletters", async (req, res) => {
  try {
    const { titre, contenu, statut, createur_id } = req.body;
    const date_publication = statut === "publié" ? new Date() : null;

    const sql = "INSERT INTO newsletter (titre, contenu, date_publication, statut, createur_id) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [titre, contenu, date_publication, statut, createur_id]);

    res.json({ id: result.insertId, titre, contenu, statut, date_publication, createur_id });
  } catch (err) {
    console.error("❌ Erreur SQL:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

// PUT - Modifier une newsletter
app.put("/api/newsletters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, contenu, statut } = req.body;
    const date_publication = statut === "publié" ? new Date() : null;

    const sql = "UPDATE newsletter SET titre=?, contenu=?, date_publication=?, statut=? WHERE id=?";
    await db.query(sql, [titre, contenu, date_publication, statut, id]);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Erreur SQL:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

// DELETE - Supprimer une newsletter
app.delete("/api/newsletters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM newsletter WHERE id=?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Erreur SQL:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

// ========================
// Lancer le serveur
// ========================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur backend en écoute sur http://0.0.0.0:${PORT}`);
  console.log(`✅ Accessible via http://localhost:${PORT}`);
});














