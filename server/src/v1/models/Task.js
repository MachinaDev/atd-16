const mongoose = require('mongoose'); // Module Mongoose pour la modélisation d'objets MongoDB
const Schema = mongoose.Schema; // Classe de schéma Mongoose
const { schemaOptions } = require('./modelOptions'); // Options de schéma du modèle

/**
 * Schéma de tâche pour la base de données.
 * @property section - Référence à la section associée (ID d'objet requis).
 * @property title - Titre de la tâche (chaîne, valeur par défaut : '').
 * @property content - Contenu de la tâche (chaîne, valeur par défaut : '').
 * @property position - Position de la tâche (nombre).
 * @schemaOptions - Options spécifiques du schéma.
 */
const taskSchema = new Schema(
	{
		section: {
			type: Schema.Types.ObjectId,
			ref: 'Section',
			required: true,
		},
		title: {
			type: String,
			default: '',
		},
		content: {
			type: String,
			default: '',
		},
		position: {
			type: Number,
		},
	},
	schemaOptions
);

/**
 * Modèle de tâche basé sur le schéma.
 */
module.exports = mongoose.model('Task', taskSchema);
