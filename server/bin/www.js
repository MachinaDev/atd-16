#!/usr/bin/env node

/**
 * Dépendances des modules.
 */

const app = require('../app'); // Importation du module app depuis le fichier 'app.js'
const debug = require('debug')('server:server'); // Importation du module de débogage
const http = require('http'); // Importation du module 'http' pour créer un serveur HTTP
const dotenv = require('dotenv'); // Importation du module 'dotenv' pour charger les variables d'environnement depuis un fichier .env
const mongoose = require('mongoose'); // Importation du module 'mongoose' pour la gestion de la base de données MongoDB

dotenv.config(); // Chargement des variables d'environnement depuis le fichier .env

/**
 * Obtenir le port depuis l'environnement et le stocker dans Express.
 */

// Normalisation du port à partir de la variable d'environnement ou par défaut '3000'
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Créer un serveur HTTP.
 */

// Création du serveur HTTP en utilisant le module 'http' et l'application 'app'
const server = http.createServer(app);

/**
 * Écouter le port fourni, sur toutes les interfaces réseau.
 */

// Connexion à la base de données MongoDB en utilisant la variable d'environnement 'MONGODB_URL'
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => {
		// Écoute du serveur sur le port spécifié
		server.listen(port);
		server.on('error', onError); // Gestionnaire d'erreur en cas d'échec de démarrage du serveur
		server.on('listening', onListening); // Gestionnaire pour l'événement de démarrage du serveur
		console.log(`Connecté sur l'URL de la base MongoDB :  ${process.env.MONGODB_URL}`);
	})
	.catch((err) => {
		console.log(err);
		process.exit(1); // En cas d'erreur lors de la connexion à la base de données, arrêt du processus
	});

/**
 * Normaliser un port en un nombre, une chaîne ou faux.
 */

// Fonction pour normaliser le port en un nombre, une chaîne ou faux
function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Gestionnaire d'événement pour l'événement "error" du serveur HTTP.
 */

// Gestionnaire d'événement pour les erreurs lors du démarrage du serveur
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// Gestion spécifique des erreurs de démarrage du serveur
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' nécessite des privilèges élevés');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + " est déjà en cours d'utilisation");
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Gestionnaire d'événement pour l'événement "listening" du serveur HTTP.
 */

// Gestionnaire d'événement pour l'événement de démarrage du serveur
function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Écoute sur ' + bind);
}
