import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Importation des composants pour la gestion des routes avec React Router
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Importation des composants ThemeProvider et createTheme de Material-UI pour le thème

import Home from './pages/Home'; // Importation du composant Home depuis le fichier Home.js pour la page d'accueil
import Project from './pages/Project'; // Importation du composant Project depuis le fichier Project.js pour la page de projet
import Signup from './pages/Signup'; // Importation du composant Signup depuis le fichier Signup.js pour la page d'inscription
import Login from './pages/Login'; // Importation du composant Login depuis le fichier Login.js pour la page de connexion

import AppLayout from './components/layout/AppLayout'; // Importation du composant AppLayout pour la mise en page de l'application
import AuthLayout from './components/layout/AuthLayout'; // Importation du composant AuthLayout pour la mise en page de l'authentification

import CssBaseLine from '@mui/material/CssBaseline'; // Importation du composant CssBaseline de Material-UI pour normaliser les styles
import './css/custom-scrollbar.css'; // Importation des styles personnalisés pour la barre de défilement

// Importation des styles de police Roboto avec différentes épaisseurs
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Définition du composant App
function App() {
	// Création du thème Material-UI avec le mode sombre
	const theme = createTheme({
		palette: { mode: 'dark' },
	});

	return (
		// Enveloppement de l'application dans le ThemeProvider avec le thème créé
		<ThemeProvider theme={theme}>
			<CssBaseLine /> {/* Utilisation de CssBaseline pour normaliser les styles */}
			<BrowserRouter>
				{' '}
				{/* Utilisation de BrowserRouter pour gérer les routes */}
				<Routes>
					{' '}
					{/* Utilisation de Routes pour définir les itinéraires */}
					<Route path='/' element={<AuthLayout />}>
						{' '}
						{/* Itinéraire pour les pages d'authentification */}
						<Route path='login' element={<Login />} /> {/* Page de connexion */}
						<Route path='signup' element={<Signup />} /> {/* Page d'inscription */}
					</Route>
					<Route path='/' element={<AppLayout />}>
						{' '}
						{/* Itinéraire pour les pages de l'application */}
						<Route index element={<Home />} /> {/* Page d'accueil */}
						<Route path='projects' element={<Home />} /> {/* Page d'accueil des projets */}
						<Route path='projects/:projectId' element={<Project />} />{' '}
						{/* Page du projet spécifique */}
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App; // Exportation du composant App
