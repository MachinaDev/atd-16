import authApi from '../api/authApi'; // Importation du module authApi depuis le fichier api/authApi.js

// Objet authUtils contenant des utilitaires liés à l'authentification
const authUtils = {
	// Fonction pour vérifier si l'utilisateur est authentifié
	isAuthenticated: async () => {
		const token = localStorage.getItem('token'); // Récupération du token depuis le stockage local
		if (!token) return false; // Si le token n'existe pas, l'utilisateur n'est pas authentifié
		try {
			// Tentative de vérification du token à l'aide de l'API verifyToken
			const res = await authApi.verifyToken(); // Appel de la fonction verifyToken de authApi
			return res.user; // Retourne les données de l'utilisateur si le token est valide
		} catch {
			return false; // En cas d'erreur, l'utilisateur n'est pas authentifié
		}
	},
};

export default authUtils; // Exportation de l'objet authUtils contenant les utilitaires d'authentification
