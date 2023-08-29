/**
 * Options de schéma utilisées pour la conversion en JSON, en objet et pour les horodatages.
 * @property toJSON.virtuals - Inclut les champs virtuels lors de la conversion en JSON.
 * @property toObject.virtuals - Inclut les champs virtuels lors de la conversion en objet.
 * @property timestamp - Active les horodatages automatiques.
 */
exports.schemaOptions = {
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
	timestamp: true,
};
