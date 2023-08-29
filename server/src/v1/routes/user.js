// Importation des modules nécessaires
const router = require('express').Router(); // Module de routage d'Express
const tokenHandler = require('../handlers/tokenHandler'); // Gestionnaire de tokens
const userController = require('../controllers/user'); // Contrôleur des utilisateurs

/**
 * Route GET '/'
 * Cette route permet d'obtenir la liste de tous les utilisateurs.
 * Elle nécessite une vérification de token avant d'accéder au contrôleur.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller userController.getAll - Contrôleur pour obtenir la liste de tous les utilisateurs.
 */
router.get('/', tokenHandler.verifyToken, userController.getAll);

// Exportation du routeur configuré
module.exports = router;
