import { useState, useEffect } from 'react'; // Importe des hooks de gestion d'état et d'effet
import { Outlet, useNavigate } from 'react-router-dom'; // Importe des hooks de navigation
import { useDispatch } from 'react-redux'; // Importe le hook de dispatch Redux
import { setUser } from '../../redux/features/userSlice'; // Importe l'action pour définir l'utilisateur

import authUtils from '../../utils/authUtils'; // Importe les fonctions utilitaires d'authentification
import Loading from '../common/Loading'; // Importe le composant de chargement
import Sidebar from '../common/Sidebar'; // Importe le composant de la barre latérale

import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'; // Importe des composants d'interface
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // Importe une icône

const AppLayout = () => {
	const theme = useTheme(); // Récupération du thème actuel de l'application grâce au hook useTheme
	const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Vérifie si l'écran est de type téléphone (small) ou non
	const navigate = useNavigate(); // Utilisation du hook useNavigate pour obtenir une fonction de navigation
	const dispatch = useDispatch(); // Utilisation du hook useDispatch pour obtenir la fonction de dispatch Redux

	const [loading, setLoading] = useState(true); // État local pour contrôler l'affichage de la charge
	const [isSidebarOpen, setIsSidebarOpen] = useState(true); // État initial pour la version desktop

	useEffect(() => {
		const checkAuth = async () => {
			const user = await authUtils.isAuthenticated(); // Vérifie si l'utilisateur est authentifié
			if (!user) {
				navigate('/login'); // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
			} else {
				// Enregistre l'utilisateur dans le store Redux
				dispatch(setUser(user));
				setLoading(false); // Désactive le chargement
			}
		};
		checkAuth(); // Appelle la fonction de vérification d'authentification
	}, [navigate]);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen); // Bascule l'état d'ouverture/fermeture de la barre latérale
	};

	return loading ? (
		<Loading fullHeight /> // Affiche un composant de chargement si l'authentification est en cours
	) : (
		<Box
			sx={{
				display: 'flex',
			}}
		>
			{/* Afficher l'icône de bascule de la barre latérale en version mobile */}
			{isMobile && (
				<IconButton onClick={toggleSidebar}>{!isSidebarOpen && <ChevronRightIcon />}</IconButton>
			)}

			{/* Composant Sidebar pour la navigation */}
			<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

			<Box
				sx={{
					flexGrow: 1,
					p: 1,
					width: 'max-content',
				}}
			>
				{/* Emplacement pour afficher le contenu spécifique de chaque route enfant */}
				<Outlet />
			</Box>
		</Box>
	);
};

export default AppLayout;
