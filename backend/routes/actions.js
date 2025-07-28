const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all actions
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM actions');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// CREATE new action
router.post('/', async (req, res) => {
  const { title, details, population, ressources, kpi } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO actions (title, details, population, ressources, kpi) VALUES (?, ?, ?, ?, ?)',
      [title, details, population, ressources, kpi]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur création' });
  }
});

// UPDATE action
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, details, population, ressources, kpi } = req.body;
  try {
    await db.query(
      'UPDATE actions SET title=?, details=?, population=?, ressources=?, kpi=? WHERE id=?',
      [title, details, population, ressources, kpi, id]
    );
    res.status(200).json({ message: 'Action mise à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur mise à jour' });
  }
});

// DELETE action
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM actions WHERE id = ?', [id]);
    res.status(200).json({ message: 'Action supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur suppression' });
  }
});

module.exports = router;