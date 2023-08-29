import axiosClient from './axiosClient'; // Importe le client axios configuré

// API pour les opérations liées aux sections
const sectionApi = {
	// Fonction pour créer une nouvelle section dans un projet spécifique
	create: (projectId) => axiosClient.post(`projects/${projectId}/sections`),

	// Fonction pour mettre à jour les détails d'une section dans un projet
	update: (projectId, sectionId, params) =>
		axiosClient.put(`projects/${projectId}/sections/${sectionId}`, params),

	// Fonction pour supprimer une section d'un projet
	delete: (projectId, sectionId) => axiosClient.delete(`projects/${projectId}/sections/${sectionId}`),
};

export default sectionApi; // Exporte l'objet sectionApi contenant les fonctions liées aux sections
