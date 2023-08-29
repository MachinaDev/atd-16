// Importation des modules nécessaires
const router = require('express').Router(); // Module de routage d'Express
const { param } = require('express-validator'); // Module d'express-validator pour la validation des paramètres
const validation = require('../handlers/validation'); // Gestionnaire de validation
const tokenHandler = require('../handlers/tokenHandler'); // Gestionnaire de tokens
const projectController = require('../controllers/project'); // Contrôleur des projets

/**
 * Route POST '/'
 * Cette route permet de créer un nouveau projet.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.create - Contrôleur pour créer un nouveau projet.
 */
router.post('/', tokenHandler.verifyToken, projectController.create);

/**
 * Route GET '/'
 * Cette route permet d'obtenir la liste de tous les projets de l'utilisateur.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.getAll - Contrôleur pour obtenir la liste de tous les projets.
 */
router.get('/', tokenHandler.verifyToken, projectController.getAll);

/**
 * Route PUT '/'
 * Cette route permet de mettre à jour la position des projets de l'utilisateur.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.updatePosition - Contrôleur pour mettre à jour la position des projets.
 */
router.put('/', tokenHandler.verifyToken, projectController.updatePosition);

/**
 * Route GET '/favourites'
 * Cette route permet d'obtenir la liste des projets favoris de l'utilisateur.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.getFavourites - Contrôleur pour obtenir la liste des projets favoris.
 */
router.get('/favourites', tokenHandler.verifyToken, projectController.getFavourites);

/**
 * Route PUT '/favourites'
 * Cette route permet de mettre à jour la position des projets favoris de l'utilisateur.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.updateFavouritePosition - Contrôleur pour mettre à jour la position des projets favoris.
 */
router.put('/favourites', tokenHandler.verifyToken, projectController.updateFavouritePosition);

/**
 * Route GET '/shared'
 * Cette route permet d'obtenir la liste des projets partagés avec l'utilisateur.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.getShared - Contrôleur pour obtenir la liste des projets partagés.
 */
router.get('/shared', tokenHandler.verifyToken, projectController.getShared);

/**
 * Route PUT '/shared'
 * Cette route permet de mettre à jour la position des projets partagés avec l'utilisateur.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.updateSharedPosition - Contrôleur pour mettre à jour la position des projets partagés.
 */
router.put('/shared', tokenHandler.verifyToken, projectController.updateSharedPosition);

/**
 * Route GET '/:projectId'
 * Cette route permet d'obtenir les détails d'un projet à partir de son ID.
 * Elle effectue une validation sur le paramètre de l'ID du projet avant d'accéder au contrôleur.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware param('projectId') - Validation de l'ID du projet.
 * @middleware validation.validate - Middleware pour la validation.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.getOne - Contrôleur pour obtenir les détails d'un projet.
 */
router.get(
	'/:projectId',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	projectController.getOne
);

/**
 * Route PUT '/:projectId'
 * Cette route permet de mettre à jour les détails d'un projet à partir de son ID.
 * Elle effectue une validation sur le paramètre de l'ID du projet avant d'accéder au contrôleur.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware param('projectId') - Validation de l'ID du projet.
 * @middleware validation.validate - Middleware pour la validation.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.update - Contrôleur pour mettre à jour les détails d'un projet.
 */
router.put(
	'/:projectId',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	projectController.update
);

/**
 * Route DELETE '/:projectId'
 * Cette route permet de supprimer un projet à partir de son ID.
 * Elle effectue une validation sur le paramètre de l'ID du projet avant d'accéder au contrôleur.
 * Elle nécessite la vérification du token avant d'accéder au contrôleur.
 * @middleware param('projectId') - Validation de l'ID du projet.
 * @middleware validation.validate - Middleware pour la validation.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller projectController.delete - Contrôleur pour supprimer un projet.
 */
router.delete(
	'/:projectId',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	projectController.delete
);

// Exportation du routeur configuré
module.exports = router;
