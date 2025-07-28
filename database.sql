-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 17 juil. 2025 à 11:05
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `rse_db`
--
CREATE DATABASE IF NOT EXISTS `rse_db`;
USE `rse_db`;

-- --------------------------------------------------------

--
-- Structure de la table `actions`
--

DROP TABLE IF EXISTS `actions`;
CREATE TABLE IF NOT EXISTS `actions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `details` text NOT NULL,
  `population` varchar(100) NOT NULL,
  `ressources` varchar(255) NOT NULL,
  `kpi` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `actions`
--

INSERT INTO `actions` (`id`, `title`, `details`, `population`, `ressources`, `kpi`, `created_at`) VALUES
(1, 'Tri sélectif', 'installation de poubelles de tri dans les couloirs', 'Étudiants', 'Bacs de tri, affiches', 'Taux de déchets recyclés', '2025-07-17 06:45:46'),
(2, 'Sensibilisation numérique', 'ateliers sur l\'empreinte carbone du numérique', 'Personnel administratif', 'Intervenant, salle', 'Nombre de participants', '2025-07-17 06:45:46'),
(3, 'Covoiturage', 'mise en place d\'une plateforme de covoiturage pour les étudiants', 'Étudiants et personnel', 'Application web, communication', 'Nombre de trajets partagés', '2025-07-17 06:45:46'),
(4, 'Végétalisation', 'création d\'espaces verts sur le campus', 'Toute l\'école', 'Plantes, jardinières, terreau', 'Surface végétalisée (m²)', '2025-07-17 06:45:46');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

