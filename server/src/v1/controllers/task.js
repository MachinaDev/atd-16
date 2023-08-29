const Task = require('../models/Task'); // Importation du modèle Task depuis le fichier models/Task
const Section = require('../models/Section'); // Importation du modèle Section depuis le fichier models/Section

/**
 * Fonction pour créer une nouvelle tâche dans une section spécifique.
 * @function create
 * @param req.body.sectionId - ID de la section dans laquelle créer la tâche.
 * @middlewareAction - Crée une nouvelle tâche avec la position appropriée et la lie à la section.
 * @responseStatus 201 - Statut de la requête en cas de succès de la création.
 * @responseBody task - Nouvelle tâche créée.
 */
exports.create = async (req, res) => {
	const { sectionId } = req.body;
	try {
		const section = await Section.findById(sectionId);
		const tasksCount = await Task.find({ section: sectionId }).count();
		const task = await Task.create({
			section: sectionId,
			position: tasksCount > 0 ? tasksCount : 0,
		});
		task._doc.section = section;
		res.status(201).json(task);
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour mettre à jour une tâche spécifique.
 * @function update
 * @param req.params.taskId - ID de la tâche à mettre à jour.
 * @middlewareAction - Met à jour les données de la tâche spécifiée.
 * @responseStatus 200 - Statut de la requête en cas de succès de la mise à jour.
 * @responseBody task - Tâche mise à jour.
 */
exports.update = async (req, res) => {
	const { taskId } = req.params;
	try {
		const task = await Task.findByIdAndUpdate(taskId, { $set: req.body });
		res.status(200).json(task);
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour supprimer une tâche spécifique.
 * @function delete
 * @param req.params.taskId - ID de la tâche à supprimer.
 * @middlewareAction - Supprime la tâche spécifiée et ajuste les positions des autres tâches.
 * @responseStatus 200 - Statut de la requête en cas de succès de la suppression.
 * @responseBody 'Task deleted' - Message de réponse en cas de succès de la suppression.
 */
exports.delete = async (req, res) => {
	const { taskId } = req.params;
	try {
		const currentTask = await Task.findById(taskId);
		await Task.deleteOne({ _id: taskId });
		const tasks = await Task.find({ section: currentTask.section }).sort('postition');
		for (const key in tasks) {
			await Task.findByIdAndUpdate(tasks[key].id, { $set: { position: key } });
		}
		res.status(200).json('Task deleted');
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour mettre à jour les positions des tâches lors d'un déplacement.
 * @function updatePosition
 * @param req.body.resourceList - Liste des tâches à déplacer.
 * @param req.body.destinationList - Liste de destination pour les tâches déplacées.
 * @param req.body.resourceSectionId - ID de la section source des tâches.
 * @param req.body.destinationSectionId - ID de la section de destination des tâches.
 * @middlewareAction - Met à jour les positions et les sections des tâches déplacées.
 * @responseStatus 200 - Statut de la requête en cas de succès de la mise à jour des positions.
 * @responseBody 'Position updated' - Message de réponse en cas de succès de la mise à jour.
 */
exports.updatePosition = async (req, res) => {
	const { resourceList, destinationList, resourceSectionId, destinationSectionId } = req.body;
	const resourceListReverse = resourceList.reverse();
	const destinationListReverse = destinationList.reverse();
	try {
		if (resourceSectionId !== destinationSectionId) {
			for (const key in resourceListReverse) {
				await Task.findByIdAndUpdate(resourceListReverse[key].id, {
					$set: {
						section: resourceSectionId,
						position: key,
					},
				});
			}
		}
		for (const key in destinationListReverse) {
			await Task.findByIdAndUpdate(destinationListReverse[key].id, {
				$set: {
					section: destinationSectionId,
					position: key,
				},
			});
		}
		res.status(200).json('Position updated');
	} catch (err) {
		res.status(500).json(err);
	}
};
