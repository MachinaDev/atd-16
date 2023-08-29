import axiosClient from './axiosClient'; // Importe le client axios configuré

// API pour les opérations liées aux tâches
const taskApi = {
	// Fonction pour créer une nouvelle tâche dans un projet spécifique
	create: (projectId, params) => axiosClient.post(`projects/${projectId}/tasks`, params),

	// Fonction pour mettre à jour la position d'une tâche dans un projet
	updatePosition: (projectId, params) =>
		axiosClient.put(`projects/${projectId}/tasks/update-position`, params),

	// Fonction pour supprimer une tâche d'un projet
	delete: (projectId, taskId) => axiosClient.delete(`projects/${projectId}/tasks/${taskId}`),

	// Fonction pour mettre à jour les détails d'une tâche dans un projet
	update: (projectId, taskId, params) =>
		axiosClient.put(`projects/${projectId}/tasks/${taskId}`, params),
};

export default taskApi; // Exporte l'objet taskApi contenant les fonctions liées aux tâches
