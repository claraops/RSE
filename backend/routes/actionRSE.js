const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

// GET toutes les actions
router.get("/", authMiddleware(["admin", "etudiant", "enseignant"]), async (req, res) => {
  try {
    // Modifier la requête pour inclure les informations de l'établissement
    const [actions] = await db.query(`
      SELECT a.*, e.nom AS etablissement_nom, e.localisation AS etablissement_localisation, e.type AS etablissement_type
      FROM actionrse a
      LEFT JOIN etablissement e ON a.etablissement_id = e.id
    `);

    //const [actions] = await db.query("SELECT * FROM actionrse");

    for (const action of actions) {
      // Populations
      const [populations] = await db.query(`
        SELECT pc.type 
        FROM action_population ap
        JOIN populationcible pc ON ap.population_id = pc.id
        WHERE ap.action_id = ?`, [action.id]);
      action.populations = populations.map(p => p.type);

      // Ressources
      const [ressources] = await db.query(`
        SELECT r.description, r.type, ar.quantite_utilisee 
        FROM action_ressource ar
        JOIN ressource r ON ar.ressource_id = r.id
        WHERE ar.action_id = ?`, [action.id]);
      action.ressources = ressources;

      // KPI
      const [kpis] = await db.query(`
        SELECT ik.nom, ik.valeur_cible, ik.unite_mesure 
        FROM action_kpi ak
        JOIN indicateurkpi ik ON ak.kpi_id = ik.id
        WHERE ak.action_id = ?`, [action.id]);
      action.kpis = kpis;

      // Créateur
      const [createur] = await db.query(
        "SELECT nom, prenom FROM utilisateur WHERE id = ?",
        [action.createur_id]
      );
      action.createur = createur[0];
    }

    res.json(actions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET une action spécifique
router.get("/:id", authMiddleware(["admin", "etudiant", "enseignant"]), async (req, res) => {
  try {
    // Ajouter le filtre WHERE pour l'ID spécifique
    const [actions] = await db.query(`
      SELECT a.*, e.nom AS etablissement_nom, e.localisation AS etablissement_localisation, e.type AS etablissement_type
      FROM actionrse a
      LEFT JOIN etablissement e ON a.etablissement_id = e.id
      WHERE a.id = ?
    `, [req.params.id]);
    
    if (!actions.length) return res.status(404).json({ error: "Action non trouvée" });

    const action = actions[0];

    /*const [actions] = await db.query("SELECT * FROM actionrse WHERE id = ?", [req.params.id]);
    if (!actions.length) return res.status(404).json({ error: "Action non trouvée" });*/

    // Populations
    const [populations] = await db.query(`
      SELECT pc.type 
      FROM action_population ap
      JOIN populationcible pc ON ap.population_id = pc.id
      WHERE ap.action_id = ?`, [action.id]);
    action.populations = populations.map(p => p.type);

    // Ressources
    const [ressources] = await db.query(`
      SELECT r.description, r.type, ar.quantite_utilisee 
      FROM action_ressource ar
      JOIN ressource r ON ar.ressource_id = r.id
      WHERE ar.action_id = ?`, [action.id]);
    action.ressources = ressources;

    // KPI
    const [kpis] = await db.query(`
      SELECT ik.nom, ik.valeur_cible, ik.unite_mesure 
      FROM action_kpi ak
      JOIN indicateurkpi ik ON ak.kpi_id = ik.id
      WHERE ak.action_id = ?`, [action.id]);
    action.kpis = kpis;

    res.json(action);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 📌 POST créer une action (admin uniquement)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
  const { 
    titre, 
    description, 
    date_debut, 
    date_fin, 
    statut = "planifié", 
    populations, 
    ressources, 
    kpis, 
    etablissement 
  } = req.body;

  const connection = await db.getConnection(); // on ouvre une transaction sécurisée
  await connection.beginTransaction();

  try {
    let etablissement_id = null;

    // 1️⃣ Gestion de l'établissement
    if (etablissement && etablissement.nom) {
      const [exist] = await connection.query(
        "SELECT id FROM etablissement WHERE nom = ? AND localisation = ? AND type = ?",
        [etablissement.nom, etablissement.localisation || null, etablissement.type || null]
      );

      if (exist.length > 0) {
        etablissement_id = exist[0].id; // déjà existant
      } else {
        const [etabResult] = await connection.query(
          "INSERT INTO etablissement (nom, localisation, type) VALUES (?, ?, ?)",
          [etablissement.nom, etablissement.localisation || null, etablissement.type || null]
        );
        etablissement_id = etabResult.insertId;
      }
    }

    // 2️⃣ Insertion de l’action RSE
    const [result] = await connection.query(
      "INSERT INTO actionrse (titre, description, date_debut, date_fin, statut, createur_id, etablissement_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [titre, description, date_debut, date_fin, statut, req.user.id, etablissement_id]
    );
    const actionId = result.insertId;

    // 3️⃣ Populations
    if (populations && populations.length > 0) {
      for (const population of populations) {
        const [pop] = await connection.query("SELECT id FROM populationcible WHERE type = ?", [population]);
        if (pop.length > 0) {
          await connection.query("INSERT INTO action_population (action_id, population_id) VALUES (?, ?)", [actionId, pop[0].id]);
        }
      }
    }

    // 4️⃣ Ressources
    if (ressources && ressources.length > 0) {
      for (const ressource of ressources) {
        const [resResult] = await connection.query(
          "INSERT INTO ressource (description, type, quantite) VALUES (?, ?, ?)",
          [ressource.description, ressource.type, ressource.quantite]
        );
        const resId = resResult.insertId;

        await connection.query(
          "INSERT INTO action_ressource (action_id, ressource_id, quantite_utilisee) VALUES (?, ?, ?)",
          [actionId, resId, ressource.quantite_utilisee || ressource.quantite]
        );
      }
    }

    // 5️⃣ KPI
    if (kpis && kpis.length > 0) {
      for (const kpi of kpis) {
        const [kpiResult] = await connection.query(
          "INSERT INTO indicateurkpi (nom, valeur_cible, unite_mesure, periode_mesure) VALUES (?, ?, ?, ?)",
          [kpi.nom, kpi.valeur_cible, kpi.unite_mesure, kpi.periode_mesure]
        );
        const kpiId = kpiResult.insertId;

        await connection.query("INSERT INTO action_kpi (action_id, kpi_id) VALUES (?, ?)", [actionId, kpiId]);
      }
    }

    // ✅ Validation transaction
    await connection.commit();
    connection.release();

    res.status(201).json({ message: "✅ Action créée avec succès", id: actionId, etablissement_id });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("❌ Erreur création action:", err);
    res.status(500).json({ error: "Erreur lors de la création de l'action" });
  }
});



/* POST créer une action
router.post("/", authMiddleware(["admin"]), async (req, res) => {
  const { titre, description, date_debut, date_fin, populations, ressources, kpis, etablissement } = req.body;

  try {
    /*const [result] = await db.query(
      "INSERT INTO actionrse (titre, description, date_debut, date_fin, statut, createur_id) VALUES (?, ?, ?, ?, 'planifié', ?)",
      [titre, description, date_debut, date_fin, req.user.id]
    );*
    const [result] = await db.query(
      "INSERT INTO action (titre, description, date_debut, date_fin, statut, createur_id, etablissement_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [titre, description, date_debut, date_fin, statut, createur_id, etablissement_id]
    );
    const actionId = result.insertId;

    // Populations
    if (populations) {
      for (const population of populations) {
        const [pop] = await db.query("SELECT id FROM populationcible WHERE type = ?", [population]);
        if (pop.length > 0) {
          await db.query("INSERT INTO action_population (action_id, population_id) VALUES (?, ?)", [actionId, pop[0].id]);
        }
      }
    }

    // Ressources
    if (ressources) {
      for (const ressource of ressources) {
        await db.query(
          "INSERT INTO ressource (description, type, quantite) VALUES (?, ?, ?)",
          [ressource.description, ressource.type, ressource.quantite]
        );
        const [resResult] = await db.query("SELECT LAST_INSERT_ID() as id");
        await db.query(
          "INSERT INTO action_ressource (action_id, ressource_id, quantite_utilisee) VALUES (?, ?, ?)",
          [actionId, resResult[0].id, ressource.quantite_utilisee]
        );
      }
    }

    // KPI
    if (kpis) {
      for (const kpi of kpis) {
        await db.query(
          "INSERT INTO indicateurkpi (nom, valeur_cible, unite_mesure, periode_mesure) VALUES (?, ?, ?, ?)",
          [kpi.nom, kpi.valeur_cible, kpi.unite_mesure, kpi.periode_mesure]
        );
        const [kpiResult] = await db.query("SELECT LAST_INSERT_ID() as id");
        await db.query("INSERT INTO action_kpi (action_id, kpi_id) VALUES (?, ?)", [actionId, kpiResult[0].id]);
      }
    }

    res.status(201).json({ message: "Action créée avec succès", id: actionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});*/


// PUT modifier une action
router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { titre, description, date_debut, date_fin, statut, populations, ressources, kpis, etablissement } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    let etablissement_id = null;

    // 1️⃣ Gestion de l'établissement (identique à la route POST)
    if (etablissement && etablissement.nom) {
      const [exist] = await connection.query(
        "SELECT id FROM etablissement WHERE nom = ? AND localisation = ? AND type = ?",
        [etablissement.nom, etablissement.localisation || null, etablissement.type || null]
      );

      if (exist.length > 0) {
        etablissement_id = exist[0].id;
      } else {
        const [etabResult] = await connection.query(
          "INSERT INTO etablissement (nom, localisation, type) VALUES (?, ?, ?)",
          [etablissement.nom, etablissement.localisation || null, etablissement.type || null]
        );
        etablissement_id = etabResult.insertId;
      }
    }

    // 2️⃣ Mise à jour de l'action avec l'établissement
    await connection.query(
      "UPDATE actionrse SET titre=?, description=?, date_debut=?, date_fin=?, statut=?, etablissement_id=? WHERE id=?",
      [titre, description, date_debut, date_fin, statut, etablissement_id, id]
    );

    // Le reste du code pour populations, ressources, kpis reste inchangé...

    
    // Supprimer les associations existantes
    await db.query("DELETE FROM action_population WHERE action_id = ?", [id]);
    await db.query("DELETE FROM action_ressource WHERE action_id = ?", [id]);
    await db.query("DELETE FROM action_kpi WHERE action_id = ?", [id]);

    // Populations
    if (populations) {
      for (const population of populations) {
        const [pop] = await db.query("SELECT id FROM populationcible WHERE type = ?", [population]);
        if (pop.length > 0) {
          await db.query("INSERT INTO action_population (action_id, population_id) VALUES (?, ?)", [id, pop[0].id]);
        }
      }
    }

    router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, e.nom AS etablissement_nom, e.localisation AS etablissement_localisation, e.type AS etablissement_type
      FROM action a
      LEFT JOIN etablissement e ON a.etablissement_id = e.id
    `);

    res.json(rows);
  } catch (err) {
    console.error("Erreur récupération actions:", err);
    res.status(500).json({ error: err.message });
  }
});


    // Ressources
    if (ressources) {
      for (const ressource of ressources) {
        const [existingRes] = await db.query("SELECT id FROM ressource WHERE description=? AND type=?", [ressource.description, ressource.type]);
        let resId;
        if (existingRes.length) {
          resId = existingRes[0].id;
        } else {
          const [resResult] = await db.query(
            "INSERT INTO ressource (description, type, quantite) VALUES (?, ?, ?)",
            [ressource.description, ressource.type, ressource.quantite]
          );
          resId = resResult.insertId;
        }
        await db.query("INSERT INTO action_ressource (action_id, ressource_id, quantite_utilisee) VALUES (?, ?, ?)", [id, resId, ressource.quantite_utilisee]);
      }
    }

    // KPI
    if (kpis) {
      for (const kpi of kpis) {
        const [existingKpi] = await db.query("SELECT id FROM indicateurkpi WHERE nom=? AND unite_mesure=?", [kpi.nom, kpi.unite_mesure]);
        let kpiId;
        if (existingKpi.length) {
          kpiId = existingKpi[0].id;
        } else {
          const [kpiResult] = await db.query(
            "INSERT INTO indicateurkpi (nom, valeur_cible, unite_mesure, periode_mesure) VALUES (?, ?, ?, ?)",
            [kpi.nom, kpi.valeur_cible, kpi.unite_mesure, kpi.periode_mesure]
          );
          kpiId = kpiResult.insertId;
        }
        await db.query("INSERT INTO action_kpi (action_id, kpi_id) VALUES (?, ?)", [id, kpiId]);
      }
    }

    await connection.commit();
    connection.release();
    res.json({ message: "Action mise à jour" });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

/*PUT modifier une action
router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { titre, description, date_debut, date_fin, statut, populations, ressources, kpis } = req.body;

  try {
    await db.query(
      "UPDATE actionrse SET titre=?, description=?, date_debut=?, date_fin=?, statut=? WHERE id=?",
      [titre, description, date_debut, date_fin, statut, id]
    );

    // Supprimer les associations existantes
    await db.query("DELETE FROM action_population WHERE action_id = ?", [id]);
    await db.query("DELETE FROM action_ressource WHERE action_id = ?", [id]);
    await db.query("DELETE FROM action_kpi WHERE action_id = ?", [id]);

    // Populations
    if (populations) {
      for (const population of populations) {
        const [pop] = await db.query("SELECT id FROM populationcible WHERE type = ?", [population]);
        if (pop.length > 0) {
          await db.query("INSERT INTO action_population (action_id, population_id) VALUES (?, ?)", [id, pop[0].id]);
        }
      }
    }

    router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, e.nom AS etablissement_nom, e.localisation AS etablissement_localisation, e.type AS etablissement_type
      FROM action a
      LEFT JOIN etablissement e ON a.etablissement_id = e.id
    `);

    res.json(rows);
  } catch (err) {
    console.error("Erreur récupération actions:", err);
    res.status(500).json({ error: err.message });
  }
});


    // Ressources
    if (ressources) {
      for (const ressource of ressources) {
        const [existingRes] = await db.query("SELECT id FROM ressource WHERE description=? AND type=?", [ressource.description, ressource.type]);
        let resId;
        if (existingRes.length) {
          resId = existingRes[0].id;
        } else {
          const [resResult] = await db.query(
            "INSERT INTO ressource (description, type, quantite) VALUES (?, ?, ?)",
            [ressource.description, ressource.type, ressource.quantite]
          );
          resId = resResult.insertId;
        }
        await db.query("INSERT INTO action_ressource (action_id, ressource_id, quantite_utilisee) VALUES (?, ?, ?)", [id, resId, ressource.quantite_utilisee]);
      }
    }

    // KPI
    if (kpis) {
      for (const kpi of kpis) {
        const [existingKpi] = await db.query("SELECT id FROM indicateurkpi WHERE nom=? AND unite_mesure=?", [kpi.nom, kpi.unite_mesure]);
        let kpiId;
        if (existingKpi.length) {
          kpiId = existingKpi[0].id;
        } else {
          const [kpiResult] = await db.query(
            "INSERT INTO indicateurkpi (nom, valeur_cible, unite_mesure, periode_mesure) VALUES (?, ?, ?, ?)",
            [kpi.nom, kpi.valeur_cible, kpi.unite_mesure, kpi.periode_mesure]
          );
          kpiId = kpiResult.insertId;
        }
        await db.query("INSERT INTO action_kpi (action_id, kpi_id) VALUES (?, ?)", [id, kpiId]);
      }
    }

    res.json({ message: "Action mise à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});*/

// DELETE supprimer une action
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await db.query("DELETE FROM actionrse WHERE id = ?", [req.params.id]);
    res.json({ message: "Action supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

module.exports = router;
















