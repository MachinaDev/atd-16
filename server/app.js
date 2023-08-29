// Importation des modules nécessaires
const express = require('express'); // Framework d'application web Express
const path = require('path'); // Module pour la gestion des chemins de fichiers
const cookieParser = require('cookie-parser'); // Module pour la gestion des cookies
const logger = require('morgan'); // Module pour le logging des requêtes HTTP
const cors = require('cors'); // Middleware pour gérer les CORS (Cross-Origin Resource Sharing)

// Création de l'application Express
const app = express();

const corsOptions = {
	origin: true, // Accepter toutes les origines
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Méthodes HTTP autorisées
	credentials: true, // Autoriser l'envoi de cookies et d'en-têtes d'authentification
};

// Utilisation des middlewares et de la configuration
app.use(cors(corsOptions)); // Activation du middleware de gestion des CORS
app.use(logger('dev')); // Utilisation du middleware de logging en mode "dev"
app.use(express.json()); // Middleware pour analyser le corps des requêtes au format JSON
app.use(express.urlencoded({ extended: false })); // Middleware pour analyser le corps des requêtes au format URL-encoded
app.use(cookieParser()); // Utilisation du middleware pour gérer les cookies
app.use(express.static(path.join(__dirname, 'public'))); // Middleware pour servir des fichiers statiques depuis le dossier 'public'

// Utilisation des routes de l'API version 1 à partir du chemin '/api/v1'
app.use('/api/v1', require('./src/v1/routes'));

// Exportation de l'application configurée
module.exports = app;
