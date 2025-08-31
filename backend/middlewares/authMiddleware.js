const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (roles = []) => {
  return (req, res, next) => {
    try {
      // Vérifie si un header existe
      if (!req.headers.authorization) {
        return res.status(401).json({ error: "⚠️ Pas de token, accès refusé" });
      }

      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "⚠️ Token manquant" });
      }

      // Décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Vérifie les rôles si précisés
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "🚫 Accès interdit" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "⚠️ Token invalide" });
    }
  };
};













/*const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  // Vérifie que headers existe
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).json({ error: "⚠️ Pas de token, accès refusé" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "⚠️ Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // tu ajoutes l’utilisateur décodé dans la requête
    next();
  } catch (err) {
    return res.status(401).json({ error: "⚠️ Token invalide" });
  }
};



/*
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};*/