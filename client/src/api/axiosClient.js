import axios from 'axios'; // Importe la bibliothèque axios pour effectuer des requêtes HTTP
import queryString from 'query-string'; // Importe la bibliothèque query-string pour la gestion des paramètres d'URL

// Définit la base URL en fonction de l'environnement ou utilise une valeur par défaut
const baseUrl = process.env.REACT_APP_BASE_URL || 'http://127.0.0.1:5000/api/v1/';

// Fonction pour obtenir le token d'authentification depuis le stockage local
const getToken = () => localStorage.getItem('token');

// Crée une instance d'axios avec la configuration de base
const axiosClient = axios.create({
	baseURL: baseUrl, // URL de base pour toutes les requêtes
	paramsSerializer: (params) => queryString.stringify({ params }), // Fonction pour sérialiser les paramètres d'URL
});

// Intercepteur de requête pour ajouter les en-têtes nécessaires
axiosClient.interceptors.request.use(async (config) => {
	return {
		...config,
		headers: {
			'Content-Type': 'application/json', // En-tête pour le type de contenu JSON
			authorization: `Bearer ${getToken()}`, // En-tête pour le token d'authentification
		},
	};
});

// Intercepteur de réponse pour gérer les réponses et les erreurs
axiosClient.interceptors.response.use(
	(response) => {
		// Si la réponse contient des données, renvoie ces données
		if (response && response.data) return response.data;
		return response;
	},
	(err) => {
		// Si l'erreur ne provient pas d'une réponse, affiche l'erreur dans la console
		if (!err.response) {
			return console.log(err);
		}
		throw err.response; // Sinon, renvoie l'erreur de la réponse
	}
);

export default axiosClient; // Exporte l'instance axiosClient configurée
