const mongoose = require('mongoose'); // Module Mongoose pour la modélisation d'objets MongoDB
const Schema = mongoose.Schema; // Classe de schéma Mongoose
const { schemaOptions } = require('./modelOptions'); // Options de schéma du modèle

/**
 * Schéma de section pour la base de données.
 * @property project - Référence au projet associé (ID d'objet requis).
 * @property title - Titre de la section (chaîne, valeur par défaut : '').
 * @schemaOptions - Options spécifiques du schéma.
 */
const sectionSchema = new Schema(
	{
		project: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
			required: true,
		},
		title: {
			type: String,
			default: '',
		},
	},
	schemaOptions
);

/**
 * Modèle de section basé sur le schéma.
 */
module.exports = mongoose.model('Section', sectionSchema);
