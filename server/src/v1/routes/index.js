// Importation des modules nécessaires
var router = require('express').Router(); // Module de routage d'Express

// Configuration des sous-routes
router.use('/auth', require('./auth')); // Route pour l'authentification
router.use('/users', require('./user')); // Route pour les utilisateurs
router.use('/projects', require('./project')); // Route pour les projets
router.use('/projects/:projectId/sections', require('./section')); // Route pour les sections liées à un projet
router.use('/projects/:projectId/tasks', require('./task')); // Route pour les tâches liées à un projet

// Exportation du routeur configuré
module.exports = router;
