const Section = require('../models/Section'); // Importation du modèle Section depuis le fichier models/Section
const Task = require('../models/Task'); // Importation du modèle Task depuis le fichier models/Task

/**
 * Fonction pour créer une nouvelle section dans un projet spécifique.
 * @function create
 * @param req.params.projectId - ID du projet auquel ajouter la section.
 * @middlewareAction - Crée une nouvelle section associée au projet spécifié.
 * @responseStatus 201 - Statut de la requête en cas de succès de la création.
 * @responseBody section - Nouvelle section créée.
 */
exports.create = async (req, res) => {
	const { projectId } = req.params;
	try {
		const section = await Section.create({ project: projectId });
		section._doc.tasks = [];
		res.status(201).json(section);
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour mettre à jour une section spécifique.
 * @function update
 * @param req.params.sectionId - ID de la section à mettre à jour.
 * @middlewareAction - Met à jour les données de la section spécifiée.
 * @responseStatus 200 - Statut de la requête en cas de succès de la mise à jour.
 * @responseBody section - Section mise à jour.
 */
exports.update = async (req, res) => {
	const { sectionId } = req.params;
	try {
		const section = await Section.findByIdAndUpdate(sectionId, { $set: req.body });
		section._doc.tasks = [];
		res.status(200).json(section);
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour supprimer une section spécifique.
 * @function delete
 * @param req.params.sectionId - ID de la section à supprimer.
 * @middlewareAction - Supprime la section spécifiée ainsi que toutes les tâches associées.
 * @responseStatus 200 - Statut de la requête en cas de succès de la suppression.
 * @responseBody 'Section deleted' - Message de réponse en cas de succès de la suppression.
 */
exports.delete = async (req, res) => {
	const { sectionId } = req.params;
	try {
		await Task.deleteMany({ section: sectionId });
		await Section.deleteOne({ _id: sectionId });
		res.status(200).json('Section deleted');
	} catch (err) {
		res.status(500).json(err);
	}
};
