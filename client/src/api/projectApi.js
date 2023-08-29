import axiosClient from './axiosClient'; // Importe le client axios configuré

// API pour les opérations liées aux projets
const projectApi = {
	// Fonction pour créer un nouveau projet
	create: () => axiosClient.post('projects'),

	// Fonction pour obtenir tous les projets
	getAll: () => axiosClient.get('projects'),

	// Fonction pour obtenir les projets de l'utilisateur invité
	getGuest: () => axiosClient.get('users'),

	// Fonction pour mettre à jour la position des projets
	updatePosition: (params) => axiosClient.put('projects', params),

	// Fonction pour obtenir un projet spécifique par son ID
	getOne: (id) => axiosClient.get(`projects/${id}`),

	// Fonction pour supprimer un projet par son ID
	delete: (id) => axiosClient.delete(`projects/${id}`),

	// Fonction pour mettre à jour les détails d'un projet par son ID
	update: (id, params) => axiosClient.put(`projects/${id}`, params),

	// Fonction pour obtenir les projets favoris
	getFavourites: () => axiosClient.get('projects/favourites'),

	// Fonction pour mettre à jour la position des projets favoris
	updateFavouritePosition: (params) => axiosClient.put('projects/favourites', params),

	// Fonction pour obtenir les projets partagés
	getShared: () => axiosClient.get('projects/shared'),

	// Fonction pour mettre à jour la position des projets partagés
	updateSharedPosition: (params) => axiosClient.put('projects/shared', params),
};

export default projectApi; // Exporte l'objet projectApi contenant les fonctions liées aux projets
