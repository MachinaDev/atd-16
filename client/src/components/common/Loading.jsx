import { Box, CircularProgress } from '@mui/material'; // Importation des composants Box et CircularProgress depuis Material-UI

// Définition du composant Loading
const Loading = (props) => {
	return (
		// Crée un composant Box pour contenir l'indicateur de chargement
		<Box
			sx={{
				display: 'flex', // Définit l'affichage en mode flex
				alignItems: 'center', // Centre les éléments verticalement
				justifyContent: 'center', // Centre les éléments horizontalement
				width: '100%', // Définit la largeur à 100%
				height: props.fullHeight ? '100vh' : '100%', // La hauteur dépend de la prop fullHeight (soit 100vh ou 100%)
			}}
		>
			<CircularProgress /> {/* Affiche l'icône de chargement */}
		</Box>
	);
};

export default Loading; // Exporte le composant Loading
