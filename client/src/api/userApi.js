import axiosClient from './axiosClient'; // Importe le client axios configuré

// API pour les opérations liées aux utilisateurs
const userApi = {
	// Fonction pour récupérer tous les utilisateurs
	getAll: () => axiosClient.get('user'),
};

export default userApi; // Exporte l'objet userApi contenant les fonctions liées aux utilisateurs
