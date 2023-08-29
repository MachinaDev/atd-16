const User = require('../models/User'); // Importation du modèle User depuis le fichier models/User
const CryptoJS = require('crypto-js'); // Module CryptoJS pour le chiffrement
const jsonwebtoken = require('jsonwebtoken'); // Module jsonwebtoken pour la gestion des tokens JWT

/**
 * Fonction pour récupérer tous les utilisateurs (sauf l'utilisateur actuel).
 * @function getAll
 * @middlewareAction - Récupère tous les utilisateurs (hors utilisateur actuel) depuis la base de données.
 * @responseStatus 200 - Statut de la requête en cas de succès.
 * @responseBody users - Liste filtrée des utilisateurs (hors utilisateur actuel).
 */
exports.getAll = async (req, res) => {
	try {
		// Récupération de tous les utilisateurs depuis la base de données
		const users = await User.find();
		// Filtrage pour exclure l'utilisateur actuel de la liste
		const filteredUsers = users.filter((obj) => obj.username !== req.user.username);
		// Réponse avec la liste des utilisateurs filtrée
		res.status(200).json(filteredUsers);
	} catch (err) {
		// En cas d'erreur, réponse avec un code d'état 500 (Internal Server Error)
		res.status(500).json(err);
	}
};

/**
 * Fonction pour l'inscription d'un nouvel utilisateur.
 * @function register
 * @param req.body.password - Mot de passe de l'utilisateur à chiffrer.
 * @middlewareAction - Crée un nouvel utilisateur en chiffrant son mot de passe.
 * @responseStatus 201 - Statut de la requête en cas de succès.
 * @responseBody user - Nouvel utilisateur créé.
 * @responseBody token - Token JWT pour le nouvel utilisateur.
 */
exports.register = async (req, res) => {
	const { password } = req.body;
	try {
		req.body.password = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY);

		const user = await User.create(req.body);
		const token = jsonwebtoken.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
			expiresIn: '24h',
		});
		res.status(201).json({ user, token });
	} catch (err) {
		res.status(500).json(err);
	}
};

/**
 * Fonction pour la connexion d'un utilisateur existant.
 * @function login
 * @param req.body.username - Nom d'utilisateur de l'utilisateur.
 * @param req.body.password - Mot de passe de l'utilisateur.
 * @middlewareAction - Authentifie un utilisateur en vérifiant le nom d'utilisateur et le mot de passe.
 * @responseStatus 200 - Statut de la requête en cas de succès.
 * @responseStatus 401 - Statut de la requête en cas d'échec de l'authentification.
 * @responseBody user - Utilisateur authentifié.
 * @responseBody token - Token JWT pour l'utilisateur authentifié.
 */
exports.login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username }).select('password username');
		if (!user) {
			return res.status(401).json({
				errors: [
					{
						param: 'username',
						msg: "Nom d'utilisateur ou mot de passe invalide",
					},
				],
			});
		}

		const decryptedPass = CryptoJS.AES.decrypt(
			user.password,
			process.env.PASSWORD_SECRET_KEY
		).toString(CryptoJS.enc.Utf8);

		if (decryptedPass !== password) {
			return res.status(401).json({
				errors: [
					{
						param: 'username',
						msg: "Nom d'utilisateur ou mot de passe invalide",
					},
				],
			});
		}

		user.password = undefined;

		const token = jsonwebtoken.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
			expiresIn: '24h',
		});

		res.status(200).json({ user, token });
	} catch (err) {
		res.status(500).json(err);
	}
};
