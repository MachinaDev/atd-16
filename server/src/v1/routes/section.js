// Importation des modules nécessaires
const router = require('express').Router({ mergeParams: true }); // Module de routage d'Express avec option mergeParams activée
const { param } = require('express-validator'); // Importe les méthodes de validation de express-validator
const tokenHandler = require('../handlers/tokenHandler'); // Gestionnaire de tokens
const sectionController = require('../controllers/section'); // Contrôleur des sections
const validation = require('../handlers/validation'); // Gestionnaire de validation

/**
 * Route POST '/'
 * Cette route permet de créer une nouvelle section dans un projet spécifique.
 * @param projectId - Identifiant du projet auquel la section sera ajoutée.
 * @middleware param('projectId') - Validation de l'identifiant du projet.
 * @middleware validation.validate - Middleware de validation générale.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller sectionController.create - Contrôleur pour créer une nouvelle section.
 */
router.post(
	'/',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	sectionController.create
);

/**
 * Route PUT '/:sectionId'
 * Cette route permet de mettre à jour une section spécifique.
 * @param projectId - Identifiant du projet auquel appartient la section.
 * @param sectionId - Identifiant de la section à mettre à jour.
 * @middleware param('projectId') - Validation de l'identifiant du projet.
 * @middleware param('sectionId') - Validation de l'identifiant de la section.
 * @middleware validation.validate - Middleware de validation générale.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller sectionController.update - Contrôleur pour mettre à jour une section.
 */
router.put(
	'/:sectionId',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid project id');
		} else return Promise.resolve();
	}),
	param('sectionId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid section id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	sectionController.update
);

/**
 * Route DELETE '/:sectionId'
 * Cette route permet de supprimer une section spécifique.
 * @param projectId - Identifiant du projet auquel appartient la section.
 * @param sectionId - Identifiant de la section à supprimer.
 * @middleware param('projectId') - Validation de l'identifiant du projet.
 * @middleware param('sectionId') - Validation de l'identifiant de la section.
 * @middleware validation.validate - Middleware de validation générale.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller sectionController.delete - Contrôleur pour supprimer une section.
 */
router.delete(
	'/:sectionId',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid project id');
		} else return Promise.resolve();
	}),
	param('sectionId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid section id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	sectionController.delete
);

// Exportation du routeur configuré
module.exports = router;
