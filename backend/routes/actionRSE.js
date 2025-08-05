const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all RSE actions with related data
router.get('/', async (req, res) => {
  try {
    // Récupérer les actions de base
    const [actions] = await db.query('SELECT * FROM actionrse');
    
    // Pour chaque action, récupérer les données associées
    for (const action of actions) {
      // Populations cibles
      const [populations] = await db.query(`
        SELECT pc.type 
        FROM action_population ap
        JOIN populationcible pc ON ap.population_id = pc.id
        WHERE ap.action_id = ?
      `, [action.id]);
      action.populations = populations.map(p => p.type);
      
      // Ressources
      const [ressources] = await db.query(`
        SELECT r.description, r.type, ar.quantite_utilisee 
        FROM action_ressource ar
        JOIN ressource r ON ar.ressource_id = r.id
        WHERE ar.action_id = ?
      `, [action.id]);
      action.ressources = ressources;
      
      // Indicateurs KPI
      const [kpis] = await db.query(`
        SELECT ik.nom, ik.valeur_cible, ik.unite_mesure 
        FROM action_kpi ak
        JOIN indicateurkpi ik ON ak.kpi_id = ik.id
        WHERE ak.action_id = ?
      `, [action.id]);
      action.kpis = kpis;
      
      // Créateur
      const [createur] = await db.query(
        'SELECT nom, prenom FROM utilisateur WHERE id = ?', 
        [action.createur_id]
      );
      action.createur = createur[0];
    }
    
    res.json(actions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// CREATE new RSE action
router.post('/', async (req, res) => {
  const { titre, description, date_debut, date_fin, statut, createur_id, populations, ressources, kpis } = req.body;
  
  try {
    // Insertion de l'action de base
    const [result] = await db.query(
      'INSERT INTO actionrse (titre, description, date_debut, date_fin, statut, createur_id) VALUES (?, ?, ?, ?, ?, ?)',
      [titre, description, date_debut, date_fin, statut || 'planifié', createur_id]
    );
    const actionId = result.insertId;
    
    // Insertion des populations cibles
    for (const population of populations) {
      const [pop] = await db.query('SELECT id FROM populationcible WHERE type = ?', [population]);
      if (pop.length > 0) {
        await db.query(
          'INSERT INTO action_population (action_id, population_id) VALUES (?, ?)',
          [actionId, pop[0].id]
        );
      }
    }
    
    // Insertion des ressources
    for (const ressource of ressources) {
      await db.query(
        'INSERT INTO ressource (description, type, quantite) VALUES (?, ?, ?)',
        [ressource.description, ressource.type, ressource.quantite]
      );
      const [resResult] = await db.query('SELECT LAST_INSERT_ID() as id');
      await db.query(
        'INSERT INTO action_ressource (action_id, ressource_id, quantite_utilisee) VALUES (?, ?, ?)',
        [actionId, resResult[0].id, ressource.quantite_utilisee]
      );
    }
    
    // Insertion des KPIs
    for (const kpi of kpis) {
      await db.query(
        'INSERT INTO indicateurkpi (nom, valeur_cible, unite_mesure, periode_mesure) VALUES (?, ?, ?, ?)',
        [kpi.nom, kpi.valeur_cible, kpi.unite_mesure, kpi.periode_mesure]
      );
      const [kpiResult] = await db.query('SELECT LAST_INSERT_ID() as id');
      await db.query(
        'INSERT INTO action_kpi (action_id, kpi_id) VALUES (?, ?)',
        [actionId, kpiResult[0].id]
      );
    }
    
    res.status(201).json({ id: actionId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur création' });
  }
});

/* UPDATE RSE action
router.put('/:id', async (req, res) => {
  // Implémentation similaire à POST mais avec mise à jour
  // (omise pour la brièveté)
});*/

// UPDATE RSE action
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titre, description, date_debut, date_fin, statut, createur_id, populations, ressources, kpis } = req.body;
  
  try {
    // Mise à jour de l'action de base
    await db.query(
      'UPDATE actionrse SET titre=?, description=?, date_debut=?, date_fin=?, statut=?, createur_id=? WHERE id=?',
      [titre, description, date_debut, date_fin, statut, createur_id, id]
    );
    
    // Supprimer les anciennes associations
    await db.query('DELETE FROM action_population WHERE action_id = ?', [id]);
    await db.query('DELETE FROM action_ressource WHERE action_id = ?', [id]);
    await db.query('DELETE FROM action_kpi WHERE action_id = ?', [id]);
    
    // Insertion des populations cibles
    for (const population of populations) {
      const [pop] = await db.query('SELECT id FROM populationcible WHERE type = ?', [population]);
      if (pop.length > 0) {
        await db.query(
          'INSERT INTO action_population (action_id, population_id) VALUES (?, ?)',
          [id, pop[0].id]
        );
      }
    }
    
    // Insertion des ressources
    for (const ressource of ressources) {
      // Vérifier si la ressource existe déjà
      const [existingRes] = await db.query('SELECT id FROM ressource WHERE description = ? AND type = ?', 
        [ressource.description, ressource.type]);
      
      let resId;
      if (existingRes.length > 0) {
        resId = existingRes[0].id;
      } else {
        const [resResult] = await db.query(
          'INSERT INTO ressource (description, type, quantite) VALUES (?, ?, ?)',
          [ressource.description, ressource.type, ressource.quantite]
        );
        resId = resResult.insertId;
      }
      
      await db.query(
        'INSERT INTO action_ressource (action_id, ressource_id, quantite_utilisee) VALUES (?, ?, ?)',
        [id, resId, ressource.quantite_utilisee]
      );
    }
    
    // Insertion des KPIs
    for (const kpi of kpis) {
      // Vérifier si le KPI existe déjà
      const [existingKpi] = await db.query('SELECT id FROM indicateurkpi WHERE nom = ? AND unite_mesure = ?', 
        [kpi.nom, kpi.unite_mesure]);
      
      let kpiId;
      if (existingKpi.length > 0) {
        kpiId = existingKpi[0].id;
      } else {
        const [kpiResult] = await db.query(
          'INSERT INTO indicateurkpi (nom, valeur_cible, unite_mesure, periode_mesure) VALUES (?, ?, ?, ?)',
          [kpi.nom, kpi.valeur_cible, kpi.unite_mesure, kpi.periode_mesure]
        );
        kpiId = kpiResult.insertId;
      }
      
      await db.query(
        'INSERT INTO action_kpi (action_id, kpi_id) VALUES (?, ?)',
        [id, kpiId]
      );
    }
    
    res.json({ message: 'Action mise à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur mise à jour' });
  }
});

// DELETE RSE action
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM actionrse WHERE id = ?', [id]);
    res.status(200).json({ message: 'Action supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur suppression' });
  }
});

module.exports = router;



























































/*const express = require('express');
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

module.exports = router;*/