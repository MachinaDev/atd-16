const router = require('express').Router(); // Module de routage d'Express
const userController = require('../controllers/user'); // Contrôleur des utilisateurs
const { body } = require('express-validator'); // Importe les méthodes de validation de express-validator
const validation = require('../handlers/validation'); // Gestionnaire de validation
const tokenHandler = require('../handlers/tokenHandler'); // Gestionnaire de tokens
const User = require('../models/User'); // Modèle d'utilisateur

/**
 * Route POST '/signup'
 * Cette route permet à un utilisateur de s'inscrire.
 * @param username - Nom d'utilisateur (minimum 8 caractères).
 * @param password - Mot de passe (minimum 8 caractères).
 * @param confirmPassword - Mot de passe confirmé (minimum 8 caractères).
 * @bodyValidation username - Validation de la longueur minimale du nom d'utilisateur.
 * @bodyValidation password - Validation de la longueur minimale du mot de passe.
 * @bodyValidation confirmPassword - Validation de la longueur minimale du mot de passe confirmé.
 * @bodyValidation username.custom - Validation de l'existence préalable de l'utilisateur.
 * @middleware validation.validate - Middleware de validation générale.
 * @controller userController.register - Contrôleur pour l'inscription d'un utilisateur.
 */
router.post(
	'/signup',
	body('username')
		.isLength({ min: 8 })
		.withMessage("Le nom d'utilisateur doit contenir au moins 8 caractères"),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Le mot de passe doit contenir au moins 8 caractères'),
	body('confirmPassword')
		.isLength({ min: 8 })
		.withMessage('Le mot de passe confirmé doit contenir au moins 8 caractères'),
	body('username').custom((value) => {
		return User.findOne({ username: value }).then((user) => {
			if (user) {
				return Promise.reject("L'utilisateur existe déjà");
			}
		});
	}),
	validation.validate,
	userController.register
);

/**
 * Route POST '/login'
 * Cette route permet à un utilisateur de se connecter.
 * @param username - Nom d'utilisateur (minimum 8 caractères).
 * @param password - Mot de passe (minimum 8 caractères).
 * @bodyValidation username - Validation de la longueur minimale du nom d'utilisateur.
 * @bodyValidation password - Validation de la longueur minimale du mot de passe.
 * @middleware validation.validate - Middleware de validation générale.
 * @controller userController.login - Contrôleur pour la connexion d'un utilisateur.
 */
router.post(
	'/login',
	body('username')
		.isLength({ min: 8 })
		.withMessage("Le nom d'utilisateur doit contenir au moins 8 caractères"),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Le mot de passe doit contenir au moins 8 caractères'),
	validation.validate,
	userController.login
);

/**
 * Route POST '/verify-token'
 * Cette route permet de vérifier un token d'utilisateur.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @responseStatus 200 - Statut de succès.
 * @responseBody user - Utilisateur extrait du token.
 */
router.post('/verify-token', tokenHandler.verifyToken, (req, res) => {
	res.status(200).json({ user: req.user });
});

module.exports = router; // Exportation du routeur configuré
