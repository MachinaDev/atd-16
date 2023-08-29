import axiosClient from './axiosClient'; // Importe le client axios préconfiguré axiosClient

const authApi = {
	// API pour l'inscription
	signup: (params) => axiosClient.post('auth/signup', params),

	// API pour la connexion
	login: (params) => axiosClient.post('auth/login', params),

	// API pour vérifier le token d'authentification
	verifyToken: () => axiosClient.post('auth/verify-token'),
};

export default authApi; // Exporte l'objet authApi contenant les fonctions d'API liées à l'authentification
