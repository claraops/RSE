-- Création de la base
CREATE DATABASE IF NOT EXISTS rse_db;
USE rse_db;

-- Table Etablissement
CREATE TABLE Etablissement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    localisation VARCHAR(255),
    type ENUM('université', 'école', 'organisme') NOT NULL
);

-- Table Utilisateur
CREATE TABLE Utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150),
    role ENUM('étudiant', 'enseignant', 'admin', 'partenaire') NOT NULL,
    departement_id INT,
    FOREIGN KEY (departement_id) REFERENCES Etablissement(id)
);

-- Table PopulationCible
CREATE TABLE PopulationCible (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('étudiants', 'enseignants', 'admin', 'partenaires', 'tout') NOT NULL
);

-- Table Ressource
CREATE TABLE Ressource (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    quantite INT,
    type ENUM('matérielle', 'humaine', 'financière') NOT NULL
);

-- Table IndicateurKPI
CREATE TABLE IndicateurKPI (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    valeur_cible FLOAT,
    unite_mesure VARCHAR(50),
    periode_mesure ENUM('journalier', 'hebdomadaire', 'mensuel')
);

-- Table ActionRSE
CREATE TABLE ActionRSE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255),
    description TEXT,
    date_debut DATE,
    date_fin DATE,
    statut ENUM('planifié', 'en_cours', 'terminé'),
    createur_id INT,
    FOREIGN KEY (createur_id) REFERENCES Utilisateur(id)
);

-- Table de liaison entre ActionRSE et PopulationCible
CREATE TABLE Action_Population (
    action_id INT,
    population_id INT,
    PRIMARY KEY (action_id, population_id),
    FOREIGN KEY (action_id) REFERENCES ActionRSE(id),
    FOREIGN KEY (population_id) REFERENCES PopulationCible(id)
);

-- Table de liaison entre ActionRSE et Ressource
CREATE TABLE Action_Ressource (
    action_id INT,
    ressource_id INT,
    PRIMARY KEY (action_id, ressource_id),
    FOREIGN KEY (action_id) REFERENCES ActionRSE(id),
    FOREIGN KEY (ressource_id) REFERENCES Ressource(id)
);

-- Table de liaison entre ActionRSE et IndicateurKPI
CREATE TABLE Action_KPI (
    action_id INT,
    kpi_id INT,
    PRIMARY KEY (action_id, kpi_id),
    FOREIGN KEY (action_id) REFERENCES ActionRSE(id),
    FOREIGN KEY (kpi_id) REFERENCES IndicateurKPI(id)
);

-- Table MaterielSensibilisation
CREATE TABLE MaterielSensibilisation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fichier_url VARCHAR(255),
    date_creation DATE,
    type ENUM('affiche', 'vidéo', 'brochure', 'présentation'),
    action_id INT,
    FOREIGN KEY (action_id) REFERENCES ActionRSE(id)
);

-- Table Newsletter
CREATE TABLE Newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255),
    contenu TEXT,
    date_publication DATE,
    statut ENUM('brouillon', 'publié'),
    action_id INT,
    FOREIGN KEY (action_id) REFERENCES ActionRSE(id),
    createur_id INT,
    FOREIGN KEY (createur_id) REFERENCES Utilisateur(id)
);