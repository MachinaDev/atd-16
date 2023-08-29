// Importation du module jsonwebtoken pour la gestion des tokens JWT
const jsonwebtoken = require('jsonwebtoken');
// Importation du modèle User depuis le fichier models/User
const User = require('../models/User');

/**
 * Fonction pour décoder un token JWT.
 * @function tokenDecode
 * @param req - Objet de la requête contenant les en-têtes.
 * @returns {Object|boolean} - Données du token décodé ou False si le décodage échoue.
 */
const tokenDecode = (req) => {
	// Récupération de l'en-tête 'Authorization' de la requête
	const bearerHeader = req.headers['authorization'];
	if (bearerHeader) {
		// Extraction du token du format 'Bearer <token>'
		const bearer = bearerHeader.split(' ')[1];
		try {
			// Vérification et décodage du token en utilisant la clé secrète
			const tokenDecoded = jsonwebtoken.verify(bearer, process.env.TOKEN_SECRET_KEY);
			return tokenDecoded; // Retourne les données du token décodé
		} catch {
			return false; // Retourne faux si le décodage échoue
		}
	} else {
		return false; // Retourne faux si l'en-tête 'Authorization' est absent
	}
};

/**
 * Middleware pour vérifier le token JWT.
 * @middleware verifyToken
 * @middlewareAction - Vérifie le token et autorise l'accès ou renvoie un statut Unauthorized.
 * @responseStatus 401 - Statut de la requête en cas de token invalide ou absent.
 * @responseBody 'Unauthorized' - Message de réponse en cas de token invalide ou absent.
 */
exports.verifyToken = async (req, res, next) => {
	// Décodage du token en utilisant la fonction tokenDecode
	const tokenDecoded = tokenDecode(req);
	if (tokenDecoded) {
		// Recherche de l'utilisateur correspondant à l'ID du token décodé
		const user = await User.findById(tokenDecoded.id);
		if (!user) {
			// Si l'utilisateur n'est pas trouvé, renvoie un code d'état 401 (Unauthorized)
			return res.status(401).json('Unauthorized');
		}
		// Si l'utilisateur est trouvé, ajoute les informations utilisateur à l'objet req
		req.user = user;
		next(); // Passe au prochain middleware
	} else {
		// Si le token n'est pas décodé ou absent, renvoie un code d'état 401 (Unauthorized)
		res.status(401).json('Unauthorized');
	}
};
