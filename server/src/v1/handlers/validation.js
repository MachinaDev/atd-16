// Importation du module validationResult du package express-validator
const { validationResult } = require('express-validator');
// Importation du module mongoose pour la validation des ObjectIds
const mongoose = require('mongoose');

/**
 * Middleware pour la validation des résultats des validations express-validator.
 * @function validate
 * @middlewareAction - Vérifie les erreurs de validation et renvoie une réponse appropriée.
 * @responseStatus 400 - Statut de la requête en cas d'erreurs de validation.
 * @responseBody errors - Liste des erreurs de validation.
 */
exports.validate = (req, res, next) => {
	// Récupération des erreurs de validation
	const errors = validationResult(req);
	// Vérification s'il y a des erreurs de validation
	if (!errors.isEmpty()) {
		// Réponse avec un code d'état 400 (Bad Request) et la liste des erreurs
		return res.status(400).json({ errors: errors.array() });
	}
	// Si aucune erreur de validation, passez au prochain middleware
	next();
};

/**
 * Fonction pour vérifier si une valeur est un ObjectId valide.
 * @function isObjectId
 * @param value - Valeur à vérifier.
 * @returns {boolean} - True si la valeur est un ObjectId valide, sinon False.
 */
exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
