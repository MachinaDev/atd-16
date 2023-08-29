// Importation des modules nécessaires
const router = require('express').Router({ mergeParams: true }); // Module de routage d'Express avec option mergeParams activée
const { param, body } = require('express-validator'); // Importe les méthodes de validation de express-validator
const tokenHandler = require('../handlers/tokenHandler'); // Gestionnaire de tokens
const validation = require('../handlers/validation'); // Gestionnaire de validation
const taskController = require('../controllers/task'); // Contrôleur des tâches

/**
 * Route POST '/'
 * Cette route permet de créer une nouvelle tâche dans une section spécifique d'un projet.
 * @param projectId - Identifiant du projet auquel appartient la section.
 * @param sectionId - Identifiant de la section dans laquelle la tâche sera créée.
 * @middleware param('projectId') - Validation de l'identifiant du projet.
 * @middleware body('sectionId') - Validation de l'identifiant de la section.
 * @middleware validation.validate - Middleware de validation générale.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller taskController.create - Contrôleur pour créer une nouvelle tâche.
 */
router.post(
	'/',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid project id');
		} else return Promise.resolve();
	}),
	body('sectionId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid section id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	taskController.create
);

/**
 * Route PUT '/update-position'
 * Cette route permet de mettre à jour la position d'une tâche au sein d'une section.
 * @param projectId - Identifiant du projet auquel appartient la section.
 * @middleware param('projectId') - Validation de l'identifiant du projet.
 * @middleware validation.validate - Middleware de validation générale.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller taskController.updatePosition - Contrôleur pour mettre à jour la position d'une tâche.
 */
router.put(
	'/update-position',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid project id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	taskController.updatePosition
);

/**
 * Route DELETE '/:taskId'
 * Cette route permet de supprimer une tâche spécifique.
 * @param projectId - Identifiant du projet auquel appartient la tâche.
 * @param taskId - Identifiant de la tâche à supprimer.
 * @middleware param('projectId') - Validation de l'identifiant du projet.
 * @middleware param('taskId') - Validation de l'identifiant de la tâche.
 * @middleware validation.validate - Middleware de validation générale.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller taskController.delete - Contrôleur pour supprimer une tâche.
 */
router.delete(
	'/:taskId',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid project id');
		} else return Promise.resolve();
	}),
	param('taskId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid task id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	taskController.delete
);

/**
 * Route PUT '/:taskId'
 * Cette route permet de mettre à jour une tâche spécifique.
 * @param projectId - Identifiant du projet auquel appartient la tâche.
 * @param taskId - Identifiant de la tâche à mettre à jour.
 * @middleware param('projectId') - Validation de l'identifiant du projet.
 * @middleware param('taskId') - Validation de l'identifiant de la tâche.
 * @middleware validation.validate - Middleware de validation générale.
 * @middleware tokenHandler.verifyToken - Middleware pour vérifier le token.
 * @controller taskController.update - Contrôleur pour mettre à jour une tâche.
 */
router.put(
	'/:taskId',
	param('projectId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid project id');
		} else return Promise.resolve();
	}),
	param('taskId').custom((value) => {
		if (!validation.isObjectId(value)) {
			return Promise.reject('invalid task id');
		} else return Promise.resolve();
	}),
	validation.validate,
	tokenHandler.verifyToken,
	taskController.update
);

// Exportation du routeur configuré
module.exports = router;
