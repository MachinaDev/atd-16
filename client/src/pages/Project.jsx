import { useEffect, useState } from 'react'; // Importation du hook useEffect de React pour les effets et du hook useState pour gérer l'état local
import { useDispatch, useSelector } from 'react-redux'; // Importation du hook useDispatch pour dispatcher des actions et du hook useSelector pour accéder au store Redux
import { useNavigate, useParams } from 'react-router-dom'; // Composant useNavigate pour la gestion de la navigation et hook useParams pour accéder aux paramètres de l'URL
import { Box, IconButton, TextField, useMediaQuery, useTheme } from '@mui/material'; // Composants d'interface utilisateur et hooks utilitaires

import EmojiPicker from '../components/common/EmojiPicker'; // Composant EmojiPicker pour la sélection d'émoticônes
import Kanban from '../components/common/Kanban'; // Composant Kanban pour afficher un tableau kanban interactif
import ListModal from '../components/common/ListModal'; // Composant ListModal pour afficher une fenêtre modale de liste

import { setProjects } from '../redux/features/projectSlice'; // Action pour mettre à jour la liste de projets dans le store
import { setFavouriteList } from '../redux/features/favouriteSlice'; // Action pour mettre à jour la liste de favoris dans le store

import projectApi from '../api/projectApi'; // Importation de l'API projectApi pour les opérations liées aux projets

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // Icône de suppression
import ShareIcon from '@mui/icons-material/Share'; // Icône de partage
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'; // Icône d'étoile avec bords
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'; // Icône d'étoile pleine

// Déclaration d'une variable timer pour gérer le délai
let timer;
// Durée du délai en millisecondes
const timeout = 500;

// Composant Project
const Project = () => {
	// Utilisation du hook useTheme pour accéder au thème actuel
	const theme = useTheme();
	// Utilisation du hook useMediaQuery pour vérifier si l'écran est de type téléphone (small) ou non
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	// État pour gérer l'ouverture/fermeture de la fenêtre modale
	const [modalOpen, setModalOpen] = useState(false);
	// Utilisation du hook useDispatch pour dispatcher des actions
	const dispatch = useDispatch();
	// Utilisation du composant useNavigate pour gérer la navigation
	const navigate = useNavigate();
	// Utilisation du hook useParams pour accéder aux paramètres de l'URL
	const { projectId } = useParams();
	// États pour gérer le titre, la description, les sections, les favoris, les icônes.
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [sections, setSections] = useState([]);
	const [isFavourite, setIsFavourite] = useState(false);
	const [icon, setIcon] = useState('');

	// Sélection des valeurs du store à l'aide du hook useSelector
	const projects = useSelector((state) => state.project.value);
	const favouriteList = useSelector((state) => state.favourites.value);

	// Styles pour personnaliser l'apparence du composant Box
	const boxStyles = {
		padding: isMobile ? '' : '10px 50px',
	};

	// Styles pour personnaliser l'apparence du composant de titre
	const titleStyles = {
		'& .MuiOutlinedInput-input': isMobile ? { padding: '16px 2px 16px 0px' } : { padding: 0 },

		'& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
		'& .MuiOutlinedInput-root': isMobile
			? { fontSize: '1.5rem', fontWeight: '700' }
			: { fontSize: '2rem', fontWeight: '700' },
	};

	// Fonction pour ouvrir la fenêtre modale
	const handleOpenModal = () => {
		setModalOpen(true);
	};

	// Fonction pour fermer la fenêtre modale
	const handleCloseModal = () => {
		setModalOpen(false);
	};

	// Utilisation du hook useEffect pour exécuter une fonction à chaque changement de projectId
	useEffect(() => {
		// Fonction pour obtenir les détails du projet
		const getProject = async () => {
			try {
				// Appel à l'API pour obtenir les informations du projet
				const res = await projectApi.getOne(projectId);
				// Mise à jour des états avec les données du projet
				setTitle(res.title);
				setDescription(res.description);
				setSections(res.sections);
				setIsFavourite(res.favourite);
				setIcon(res.icon);
			} catch (err) {
				console.log(err);
			}
		};
		// Appel de la fonction pour obtenir les informations du projet
		getProject();
	}, [projectId]); // Le useEffect se déclenchera chaque fois que projectId change

	// Fonction appelée lorsque l'icône du projet change
	const onIconChange = async (newIcon) => {
		// Copie de la liste des projets
		let temp = [...projects];
		// Recherche de l'index du projet courant dans la liste
		const index = temp.findIndex((e) => e.id === projectId);
		// Mise à jour de l'icône du projet dans la copie
		temp[index] = { ...temp[index], icon: newIcon };

		// Si le projet est en favori
		if (isFavourite) {
			// Copie de la liste des projets favoris
			let tempFavourite = [...favouriteList];
			// Recherche de l'index du projet dans la liste des favoris
			const favouriteIndex = tempFavourite.findIndex((e) => e.id === projectId);
			// Mise à jour de l'icône du projet favori dans la copie
			tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon };
			// Mise à jour de la liste des favoris dans le store Redux
			dispatch(setFavouriteList(tempFavourite));
		}

		// Mise à jour de l'icône du projet dans l'état local
		setIcon(newIcon);
		// Mise à jour de la liste des projets dans le store Redux
		dispatch(setProjects(temp));
		try {
			// Appel à l'API pour mettre à jour l'icône du projet dans la base de données
			await projectApi.update(projectId, { icon: newIcon });
		} catch (err) {
			console.log(err);
		}
	};

	// Fonction appelée lors de la mise à jour du titre du projet
	const updateTitle = async (e) => {
		// Efface le timer précédent pour éviter des appels inutiles à l'API
		clearTimeout(timer);

		// Récupère le nouveau titre depuis l'événement de changement
		const newTitle = e.target.value;
		// Met à jour le titre dans l'état local
		setTitle(newTitle);

		// Copie de la liste des projets
		let temp = [...projects];
		// Recherche de l'index du projet courant dans la liste
		const index = temp.findIndex((e) => e.id === projectId);
		// Mise à jour du titre du projet dans la copie
		temp[index] = { ...temp[index], title: newTitle };

		// Si le projet est en favori
		if (isFavourite) {
			// Copie de la liste des projets favoris
			let tempFavourite = [...favouriteList];
			// Recherche de l'index du projet dans la liste des favoris
			const favouriteIndex = tempFavourite.findIndex((e) => e.id === projectId);
			// Mise à jour du titre du projet favori dans la copie
			tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle };
			// Mise à jour de la liste des favoris dans le store Redux
			dispatch(setFavouriteList(tempFavourite));
		}

		// Mise à jour de la liste des projets dans le store Redux
		dispatch(setProjects(temp));

		// Utilisation d'un timer pour éviter des appels trop fréquents à l'API
		timer = setTimeout(async () => {
			try {
				// Appel à l'API pour mettre à jour le titre du projet dans la base de données
				await projectApi.update(projectId, { title: newTitle });
			} catch (err) {
				console.log(err);
			}
		}, timeout);
	};

	// Fonction appelée lors de la mise à jour de la description du projet
	const updateDescription = async (e) => {
		// Efface le timer précédent pour éviter des appels inutiles à l'API
		clearTimeout(timer);

		// Récupère la nouvelle description depuis l'événement de changement
		const newDescription = e.target.value;
		// Met à jour la description dans l'état local
		setDescription(newDescription);

		// Utilisation d'un timer pour éviter des appels trop fréquents à l'API
		timer = setTimeout(async () => {
			try {
				// Appel à l'API pour mettre à jour la description du projet dans la base de données
				await projectApi.update(projectId, { description: newDescription });
			} catch (err) {
				console.log(err);
			}
		}, timeout);
	};

	// Fonction appelée lors de l'ajout ou de la suppression du projet en favori
	const addFavourite = async () => {
		try {
			// Appel à l'API pour mettre à jour le statut de favori du projet
			const project = await projectApi.update(projectId, { favourite: !isFavourite });
			// Copie de la liste des projets favoris
			let newFavouriteList = [...favouriteList];
			// Si le projet était en favori
			if (isFavourite) {
				// Suppression du projet de la liste des favoris
				newFavouriteList = newFavouriteList.filter((e) => e.id !== projectId);
			} else {
				// Ajout du projet en haut de la liste des favoris
				newFavouriteList.unshift(project);
			}
			// Mise à jour de la liste des favoris dans le store Redux
			dispatch(setFavouriteList(newFavouriteList));
			// Mise à jour du statut de favori dans l'état local
			setIsFavourite(!isFavourite);
		} catch (err) {
			console.log(err);
		}
	};

	// Fonction appelée lors de la suppression du projet
	const deleteProject = async () => {
		try {
			// Appel à l'API pour supprimer le projet
			await projectApi.delete(projectId);

			// Si le projet était en favori
			if (isFavourite) {
				// Suppression du projet de la liste des favoris
				const newFavouriteList = favouriteList.filter((e) => e.id !== projectId);
				// Mise à jour de la liste des favoris dans le store Redux
				dispatch(setFavouriteList(newFavouriteList));
			}

			// Mise à jour de la liste des projets dans le store Redux
			const newList = projects.filter((e) => e.id !== projectId);
			// Si la liste de projets est vide, rediriger vers la page des projets
			if (newList.length === 0) {
				navigate('/projects');
			} else {
				// Sinon, rediriger vers la page du premier projet de la nouvelle liste
				navigate(`/projects/${newList[0].id}`);
			}
			// Mise à jour de la liste des projets dans le store Redux
			dispatch(setProjects(newList));
		} catch (err) {
			console.log(err);
		}
	};

	// Rendu du composant
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					width: '100%',
				}}
			>
				{/* Bouton pour ajouter/retirer des favoris */}
				<IconButton variant='outlined' onClick={addFavourite}>
					{isFavourite ? <StarOutlinedIcon color='warning' /> : <StarBorderOutlinedIcon />}
				</IconButton>

				<div>
					{/* Bouton pour ouvrir la fenêtre modale de partage */}
					<IconButton variant='outlined' color='default' onClick={handleOpenModal}>
						<ShareIcon />
					</IconButton>
					{/* Composant modale pour le partage */}
					<ListModal open={modalOpen} onClose={handleCloseModal} projectId={projectId} />
					{/* Bouton pour supprimer le projet */}
					<IconButton variant='outlined' color='error' onClick={deleteProject}>
						<DeleteOutlinedIcon />
					</IconButton>
				</div>
			</Box>

			{/* Conteneur principal avec style de boîte */}
			<Box sx={boxStyles}>
				<Box>
					{/* Sélecteur d'emoji avec fonction de mise à jour */}
					<EmojiPicker icon={icon} onChange={onIconChange} />

					{/* Champ de texte pour le titre du projet */}
					<TextField
						value={title}
						onChange={updateTitle}
						placeholder='Sans titre'
						variant='outlined'
						fullWidth
						sx={{
							...titleStyles,
						}}
					/>

					{/* Champ de texte pour la description du projet */}
					<TextField
						value={description}
						onChange={updateDescription}
						placeholder='Ecrivez une description'
						variant='outlined'
						multiline
						fullWidth
						sx={{
							'& .MuiOutlinedInput-input': { padding: 0 },
							'& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
							'& .MuiOutlinedInput-root': { fontSize: '0.8rem' },
						}}
					/>
				</Box>

				<Box>
					{/* Composant Kanban pour afficher les sections du projet */}
					<Kanban data={sections} projectId={projectId} />
				</Box>
			</Box>
		</>
	);
};

export default Project; // Exporte le composant Project
