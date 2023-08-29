import { useState } from 'react'; // Hook pour gérer l'état local
import { useDispatch } from 'react-redux'; // Hook permettant d'utiliser le store Redux
import { useNavigate } from 'react-router-dom'; // Hook pour la navigation
import { setProjects } from '../redux/features/projectSlice'; // Action pour mettre à jour la liste des projets dans le store Redux
import projectApi from '../api/projectApi'; // API pour les opérations liées aux projets

import LoadingButton from '@mui/lab/LoadingButton'; // Composant de bouton avec état de chargement

import { Box } from '@mui/material';

const Home = () => {
	const navigate = useNavigate(); // Hook pour la navigation
	const dispatch = useDispatch(); // Récupère la fonction de dispatch du store Redux
	const [loading, setLoading] = useState(false); // État local pour le chargement

	// Fonction pour créer un nouveau projet
	const createProject = async () => {
		setLoading(true); // Active le chargement

		try {
			// Appel à l'API pour créer un nouveau projet
			const res = await projectApi.create();

			// Mise à jour de la liste des projets dans le store Redux
			dispatch(setProjects([res]));

			// Redirection vers la page du nouveau projet créé
			navigate(`/projects/${res.id}`);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false); // Désactive le chargement une fois l'opération terminée
		}
	};

	return (
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{/* Bouton pour créer un projet */}
			<LoadingButton variant='outlined' color='success' onClick={createProject} loading={loading}>
				Cliquez ici pour créer votre premier tableau
			</LoadingButton>
		</Box>
	);
};

export default Home;
