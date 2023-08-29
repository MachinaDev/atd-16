// Importation du module mongoose pour la gestion des modèles et schémas de données
const mongoose = require('mongoose');
// Importation du constructeur Schema de mongoose
const Schema = mongoose.Schema;
// Importation des options de schéma définies dans le fichier modelOptions
const { schemaOptions } = require('./modelOptions');

/**
 * Schéma de données pour les projets.
 * @property user - Référence à l'utilisateur propriétaire (ID d'objet requis).
 * @property guest - Référence à l'utilisateur invité (ID d'objet).
 * @property icon - Icône du projet (chaîne, valeur par défaut : '📃').
 * @property title - Titre du projet (chaîne, valeur par défaut : 'Sans titre').
 * @property description - Description du projet (chaîne, valeur par défaut : texte multiligne).
 * @property position - Position du projet (nombre).
 * @property favourite - État "favori" du projet (booléen, valeur par défaut : false).
 * @property favouritePosition - Position dans les favoris (nombre, valeur par défaut : 0).
 * @property shared - État "partagé" du projet (booléen, valeur par défaut : false).
 * @property sharedPosition - Position dans les projets partagés (nombre, valeur par défaut : 0).
 * @schemaOptions - Options spécifiques du schéma.
 */
const projectSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User', // Référence au modèle 'User'
			required: true, // Champ requis
		},
		guest: {
			type: Schema.Types.ObjectId,
			ref: 'User', // Référence au modèle 'User' pour les invités
		},
		icon: {
			type: String,
			default: '📃', // Valeur par défaut pour l'icône du projet
		},
		title: {
			type: String,
			default: 'Sans titre', // Valeur par défaut pour le titre du projet
		},
		description: {
			type: String,
			default: `Ajoutez une description ici
    🟢 Cela peut peut être une description multiligne
    🟢 Commencez par remplacer ce texte...`, // Valeur par défaut pour la description du projet
		},
		position: {
			type: Number, // Champ de type nombre pour la position du projet
		},
		favourite: {
			type: Boolean,
			default: false, // Valeur par défaut pour l'état "favori" du projet
		},
		favouritePosition: {
			type: Number,
			default: 0, // Valeur par défaut pour la position dans les favoris
		},
		shared: {
			type: Boolean,
			default: false, // Valeur par défaut pour l'état "partagé" du projet
		},
		sharedPosition: {
			type: Number,
			default: 0, // Valeur par défaut pour la position dans les projets partagés
		},
	},
	schemaOptions
);

// Création d'un modèle 'Project' à partir du schéma défini
const Project = mongoose.model('Project', projectSchema);

// Exportation du modèle de projet
module.exports = Project;
