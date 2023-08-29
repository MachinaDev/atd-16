const Project = require('../models/Project'); // Importation du modèle Project depuis le fichier models/Project
const Section = require('../models/Section'); // Importation du modèle Section depuis le fichier models/Section
const Task = require('../models/Task'); // Importation du modèle Task depuis le fichier models/Task

/**
 * Fonction pour créer un nouveau projet.
 * @function create
 * @middlewareAction - Crée un nouveau projet avec la position appropriée.
 * @responseStatus 201 - Statut de la requête en cas de succès de la création.
 * @responseBody project - Nouveau projet créé.
 */
exports.create = async (req, res) => {
	try {
		const projectsCount = await Project.find().count();
		const project = await Project.create({
			user: req.user._id,
			position: projectsCount > 0 ? projectsCount : 0,
		});
		res.status(201).json(project);
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour récupérer tous les projets de l'utilisateur actuel.
 * @function getAll
 * @middlewareAction - Récupère tous les projets associés à l'utilisateur actuel.
 * @responseStatus 200 - Statut de la requête en cas de succès de la récupération.
 * @responseBody projects - Liste des projets de l'utilisateur.
 */
exports.getAll = async (req, res) => {
	try {
		const projects = await Project.find({ user: req.user._id }).sort('-position');
		res.status(200).json(projects);
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour mettre à jour les positions des projets lors d'un déplacement.
 * @function updatePosition
 * @param req.body.projects - Liste des projets à mettre à jour.
 * @middlewareAction - Met à jour les positions des projets spécifiés.
 * @responseStatus 200 - Statut de la requête en cas de succès de la mise à jour des positions.
 * @responseBody 'updated' - Message de réponse en cas de succès de la mise à jour.
 */
exports.updatePosition = async (req, res) => {
	const { projects } = req.body;
	try {
		for (const key in projects.reverse()) {
			const project = projects[key];
			await Project.findByIdAndUpdate(project.id, { $set: { position: key } });
		}
		res.status(200).json('updated');
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour récupérer les détails d'un projet spécifique.
 * @function getOne
 * @param req.params.projectId - ID du projet à récupérer.
 * @middlewareAction - Récupère les détails du projet et ses sections ainsi que les tâches associées.
 * @responseStatus 200 - Statut de la requête en cas de succès de la récupération.
 * @responseBody project - Détails du projet, sections et tâches associées.
 */
exports.getOne = async (req, res) => {
	const { projectId } = req.params;
	try {
		const project = await Project.findOne({
			$or: [{ user: req.user._id }, { guest: req.user._id }],
			_id: projectId,
		});
		if (!project) return res.status(404).json('Project not found');
		const sections = await Section.find({ project: projectId });
		for (const section of sections) {
			const tasks = await Task.find({ section: section.id }).populate('section').sort('-position');
			section._doc.tasks = tasks;
		}
		project._doc.sections = sections;
		res.status(200).json(project);
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour mettre à jour les détails d'un projet spécifique.
 * @function update
 * @param req.params.projectId - ID du projet à mettre à jour.
 * @param req.body.title - Titre mis à jour du projet.
 * @param req.body.description - Description mise à jour du projet.
 * @param req.body.favourite - État de favori mis à jour du projet.
 * @middlewareAction - Met à jour les détails du projet et ajuste la position des favoris.
 * @responseStatus 200 - Statut de la requête en cas de succès de la mise à jour.
 * @responseBody project - Projet mis à jour.
 */
exports.update = async (req, res) => {
	const { projectId } = req.params;
	const { title, description, favourite } = req.body;

	try {
		if (title === '') req.body.title = 'Sans titre';
		if (description === '') req.body.description = 'Ajoutez une description ici';
		const currentProject = await Project.findById(projectId);
		if (!currentProject) return res.status(404).json('Project not found');

		if (favourite !== undefined && currentProject.favourite !== favourite) {
			const favourites = await Project.find({
				user: currentProject.user,
				favourite: true,
				_id: { $ne: projectId },
			}).sort('favouritePosition');
			if (favourite) {
				req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0;
			} else {
				for (const key in favourites) {
					const element = favourites[key];
					await Project.findByIdAndUpdate(element.id, { $set: { favouritePosition: key } });
				}
			}
		}

		const project = await Project.findByIdAndUpdate(projectId, { $set: req.body });
		res.status(200).json(project);
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour récupérer tous les projets favoris de l'utilisateur actuel.
 * @function getFavourites
 * @middlewareAction - Récupère tous les projets favoris associés à l'utilisateur actuel.
 * @responseStatus 200 - Statut de la requête en cas de succès de la récupération.
 * @responseBody favourites - Liste des projets favoris de l'utilisateur.
 */
exports.getFavourites = async (req, res) => {
	try {
		const favourites = await Project.find({
			user: req.user._id,
			favourite: true,
		}).sort('-favouritePosition');
		res.status(200).json(favourites);
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour mettre à jour les positions des projets favoris de l'utilisateur actuel.
 * @function updateFavouritePosition
 * @param req.body.projects - Liste des projets favoris à mettre à jour.
 * @middlewareAction - Met à jour les positions des projets favoris spécifiés.
 * @responseStatus 200 - Statut de la requête en cas de succès de la mise à jour des positions des favoris.
 * @responseBody 'Favorite position updated' - Message de confirmation de la mise à jour.
 */
exports.updateFavouritePosition = async (req, res) => {
	const { projects } = req.body;
	try {
		for (const key in projects.reverse()) {
			const project = projects[key];
			await Project.findByIdAndUpdate(project.id, { $set: { favouritePosition: key } });
		}
		res.status(200).json('Favorite position updated');
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour récupérer tous les projets partagés avec l'utilisateur actuel.
 * @function getShared
 * @middlewareAction - Récupère tous les projets partagés associés à l'utilisateur actuel.
 * @responseStatus 200 - Statut de la requête en cas de succès de la récupération.
 * @responseBody shared - Liste des projets partagés avec l'utilisateur.
 */
exports.getShared = async (req, res) => {
	try {
		// Recherche des projets partagés avec l'utilisateur triés par position
		const shared = await Project.find({
			guest: req.user._id,
			shared: true,
		}).sort('-sharedPosition');
		res.status(200).json(shared); // Réponse avec la liste des projets partagés
	} catch (err) {
		res.status(500).json(err); // En cas d'erreur, réponse avec un code d'état 500 (Internal Server Error)
	}
};

/**
 * Fonction pour mettre à jour la position des projets partagés.
 * @function updateSharedPosition
 * @param req.body.projects - Liste des projets partagés à mettre à jour.
 * @middlewareAction - Met à jour les positions des projets partagés spécifiés.
 * @responseStatus 200 - Statut de la requête en cas de succès de la mise à jour des positions.
 * @responseBody 'Shared position updated' - Message de confirmation de la mise à jour.
 */
exports.updateSharedPosition = async (req, res) => {
	const { projects } = req.body;
	try {
		// Mise à jour de la position de chaque projet partagé en inversant l'ordre de la liste
		for (const key in projects.reverse()) {
			const project = projects[key];
			await Project.findByIdAndUpdate(project.id, { $set: { sharedPosition: key } });
		}
		res.status(200).json('Shared position updated'); // Réponse de confirmation
	} catch (err) {
		res.status(500).json(err); // En cas d'erreur, réponse avec un code d'état 500 (Internal Server Error)
	}
};

/**
 * Fonction pour supprimer un projet spécifique.
 * @function delete
 * @param req.params.projectId - ID du projet à supprimer.
 * @middlewareAction - Supprime le projet spécifié ainsi que ses sections et tâches associées.
 * @responseStatus 200 - Statut de la requête en cas de succès de la suppression.
 * @responseBody 'Project deleted' - Message de confirmation de la suppression du projet.
 */
exports.delete = async (req, res) => {
	const { projectId } = req.params;
	try {
		const sections = await Section.find({ project: projectId });
		for (const section of sections) {
			await Task.deleteMany({ section: section.id });
		}
		await Section.deleteMany({ project: projectId });

		const currentProject = await Project.findById(projectId);

		if (currentProject.favourite) {
			const favourites = await Project.find({
				user: currentProject.user,
				favourite: true,
				_id: { $ne: projectId },
			}).sort('favouritePosition');

			for (const key in favourites) {
				const element = favourites[key];
				await Project.findByIdAndUpdate(element.id, { $set: { favouritePosition: key } });
			}
		}

		await Project.deleteOne({ _id: projectId });

		const projects = await Project.find().sort('position');
		for (const key in projects) {
			const project = projects[key];
			await Project.findByIdAndUpdate(project.id, { $set: { position: key } });
		}

		res.status(200).json('Project deleted');
	} catch (err) {
		res.status(500).json(err);
	}
};
