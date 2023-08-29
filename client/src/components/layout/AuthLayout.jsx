import { useState, useEffect } from 'react'; // Importe les hooks de gestion d'état et d'effet
import { Outlet, useNavigate } from 'react-router-dom'; // Importe des hooks de navigation

import authUtils from '../../utils/authUtils'; // Importe les fonctions utilitaires d'authentification
import Loading from '../common/Loading'; // Importe le composant de chargement

import { Container, Box } from '@mui/material'; // Importe des composants d'interface

import assets from '../../assets'; // Importe les ressources (images, etc.)

const AuthLayout = () => {
	const navigate = useNavigate(); // Hook de navigation
	const [loading, setLoading] = useState(true); // État local pour le chargement

	useEffect(() => {
		const checkAuth = async () => {
			const isAuth = await authUtils.isAuthenticated(); // Vérifie si l'utilisateur est authentifié
			if (!isAuth) {
				setLoading(false); // Si non authentifié, désactive le chargement
			} else {
				navigate('/'); // Si authentifié, redirige vers la page d'accueil
			}
		};
		checkAuth(); // Appelle la fonction de vérification de l'authentification
	}, [navigate]); // Déclenche l'effet à chaque changement de navigation

	return loading ? (
		<Loading fullHeight /> // Affiche un composant de chargement si l'authentification est en cours
	) : (
		<Container component='main' maxWidth='xs'>
			{' '}
			{/* Conteneur principal */}
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				{/* Titre et logo */}
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<h2>Test Pratique</h2>
					<img
						src={assets.images.logoATD} // Affiche le logo
						style={{
							backgroundColor: 'white',
							width: '50px',
							height: '50px',
							marginLeft: '8px',
						}}
						alt='Atd16 logo'
					/>
				</div>
				<Outlet /> {/* Point d'insertion pour les routes enfants */}
			</Box>
		</Container>
	);
};

export default AuthLayout;
