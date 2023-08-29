const mongoose = require('mongoose'); // Module Mongoose pour la modélisation d'objets MongoDB
const { schemaOptions } = require('./modelOptions'); // Options de schéma du modèle

/**
 * Schéma utilisateur pour la base de données.
 * @property username - Nom d'utilisateur (chaîne requise et unique).
 * @property password - Mot de passe (chaîne requise, non inclus dans les sélections de requêtes).
 * @schemaOptions - Options spécifiques du schéma.
 */
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false, // Ne pas inclure le mot de passe dans les sélections par défaut
		},
	},
	schemaOptions
);

/**
 * Modèle d'utilisateur basé sur le schéma.
 */
module.exports = mongoose.model('User', userSchema);
