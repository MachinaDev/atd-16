import { useEffect, useState } from 'react'; // Importe les modules React, useEffect et useState
import { Modal, Backdrop, Fade, ListItemButton, Typography, Box } from '@mui/material'; // Importation des dépendances nécessaires depuis MUI (Material-UI)
import projectApi from '../../api/projectApi';

// Composant pour afficher une liste modale des utilisateurs pour le partage de projet
const ListModal = ({ open, onClose, projectId }) => {
	// État pour stocker la liste de tous les invités
	const [allGuests, setAllGuests] = useState([]);

	// Utilisation d'un effet pour récupérer la liste de tous les invités depuis l'API
	useEffect(() => {
		const fetchAllGuests = async () => {
			try {
				const fetchedUsers = await projectApi.getGuest(); // Appel à l'API pour obtenir la liste des invités
				setAllGuests(fetchedUsers); // Met à jour l'état avec la liste des invités récupérée depuis l'API
			} catch (err) {
				console.log(err);
			}
		};
		fetchAllGuests(); // Appel de la fonction pour récupérer la liste des invités
	}, []);

	// Fonction pour partager le projet avec un invité spécifique
	const shareProject = async (guestId) => {
		try {
			// Appel à l'API pour mettre à jour le projet avec le statut partagé et l'ID de l'invité
			await projectApi.update(projectId, { shared: true, guest: guestId });
			onClose(); // Fermez la modal après la mise à jour
		} catch (err) {
			console.log(err);
		}
	};

	// Style pour la modal
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		bottom: '5%',
		transform: 'translate(-50%, -50%)',
		overflow: 'scroll',
		width: 400,
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
	};

	// Rendu de la modal
	return (
		<Modal
			open={open}
			onClose={onClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					TransitionComponent: Fade,
				},
			}}
		>
			<Fade in={open}>
				<Box sx={style}>
					{/* Boucle à travers la liste de tous les invités */}
					{allGuests.map((user) => (
						<div
							className='text'
							style={{
								padding: 5,
								fontSize: 15,
								color: 'white',
								margin: 1,
								borderColor: 'green',
								borderWidth: '10px',
							}}
							key={user.id}
						>
							{/* Utilisation de ListItemButton pour afficher chaque invité */}
							<ListItemButton>
								<Typography
									variant='body2'
									fontWeight='700'
									sx={{
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
									}}
									onClick={() => shareProject(user.id)} // Appel à shareProject avec l'ID de l'utilisateur
								>
									{user.username}
								</Typography>
							</ListItemButton>
						</div>
					))}
				</Box>
			</Fade>
		</Modal>
	);
};

export default ListModal; // Exporte le composant ListModal
