import { useEffect, useState } from 'react'; // Import des hooks useEffect et useState de React
import { useSelector, useDispatch } from 'react-redux'; // Import des hooks useSelector et useDispatch de Redux pour gérer l'état global
import { Link, useNavigate, useParams } from 'react-router-dom'; // Import des composants de navigation de React Router
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'; // Import de composants pour la gestion du glisser-déposer
import {
	Box,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'; // Import des composants MUI (Material-UI) pour la mise en page et les éléments visuels

import projectApi from '../../api/projectApi'; // Import du module pour les requêtes API liées aux projets
import { setProjects } from '../../redux/features/projectSlice'; // Import d'une action Redux pour mettre à jour les projets
import SearchBar from './SearchBar'; // Import du composant pour la barre de recherche
import FavouriteList from './FavouriteList'; // Import du composant pour la liste des projets favoris
import SharedList from './SharedList'; // Import du composant pour la liste des projets partagés

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'; // Icône de déconnexion depuis MUI
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'; // Icône d'ajout depuis MUI
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Icône de chevron pour fermer une barre latérale depuis MUI

import assets from '../../assets/index'; // Import d'un module d'assets (peut contenir des images, icônes, etc.)

// Importation des dépendances nécessaires depuis React et d'autres modules
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
	const theme = useTheme(); // Accès au thème MUI
	const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Vérifie si l'écran est en mode mobile
	const user = useSelector((state) => state.user.value); // Récupération de l'utilisateur à partir du state global Redux
	const projects = useSelector((state) => state.project.value); // Récupération des projets à partir du state global Redux
	const navigate = useNavigate(); // Fonction de navigation de React Router
	const dispatch = useDispatch(); // Fonction de dispatch Redux pour effectuer des actions
	const { projectId } = useParams(); // Récupération des paramètres d'URL
	const [activeIndex, setActiveIndex] = useState(0); // État pour gérer l'index actif dans la barre latérale

	// Fonction pour basculer l'état de la barre latérale (ouvrir/fermer)
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// Largeur de la barre latérale en mode mobile
	const sidebarWidth = 250;

	// Styles pour la barre latérale
	const drawerStyles = {
		width: isMobile ? (isSidebarOpen ? sidebarWidth : 50) : sidebarWidth,
		height: isMobile ? '100vh' : '100%',
		'& > div': { borderRight: 'none' },
		display: isMobile && !isSidebarOpen ? 'none' : 'block',
		position: isMobile && isSidebarOpen ? 'absolute' : 'relative',
		transition: 'width 0.2s ease-out',
	};

	// Styles pour l'icône de chevron (pour fermer la barre latérale en mode mobile)
	const chevronIconStyles = {
		position: 'absolute',
		top: '50%',
		right: isSidebarOpen ? '0' : '-15px', // Position de l'icône en fonction de l'état de la barre latérale
		transform: 'translateY(-50%)',
		transition: 'right 0.2s ease-out',
		zIndex: 2,
	};

	// Utilisation de useEffect pour récupérer les projets depuis l'API lors du montage initial du composant
	useEffect(() => {
		const getProjects = async () => {
			try {
				const res = await projectApi.getAll(); // Appel à l'API pour récupérer la liste des projets
				dispatch(setProjects(res)); // Mise à jour du state global Redux avec les projets récupérés
			} catch (err) {
				console.log(err); // En cas d'erreur, affichage dans la console
			}
		};
		getProjects(); // Appelle la fonction getProjects pour récupérer les projets au montage initial
	}, [dispatch]); // La dépendance dispatch garantit que l'effet sera réexécuté si dispatch change

	// Utilisation de useEffect pour gérer l'index actif et la redirection en fonction du projet sélectionné
	useEffect(() => {
		const activeItem = projects.findIndex((e) => e.id === projectId); // Recherche de l'index du projet actif
		if (projects.length > 0 && projectId === undefined) {
			navigate(`/projects/${projects[0].id}`); // Redirection vers le premier projet s'il n'y en a pas de sélectionné
		}
		setActiveIndex(activeItem); // Mise à jour de l'index actif dans l'état local
	}, [projects, projectId, navigate]); // Les dépendances projects, projectId et navigate garantissent que l'effet sera réexécuté lorsque ces valeurs changent

	// Fonction pour gérer la déconnexion de l'utilisateur
	const logout = () => {
		localStorage.removeItem('token'); // Suppression du token d'authentification du localStorage
		navigate('/login'); // Redirection vers la page de connexion
	};

	// Fonction pour gérer le glisser-déposer des projets dans la barre latérale
	const onDragEnd = async ({ source, destination }) => {
		const newList = [...projects]; // Crée une nouvelle liste de projets en copiant l'ancienne
		const [removed] = newList.splice(source.index, 1); // Supprime l'élément déplacé de la source
		newList.splice(destination.index, 0, removed); // Insère l'élément à la destination

		const activeItem = newList.findIndex((e) => e.id === projectId); // Recherche de l'index du projet actif
		setActiveIndex(activeItem); // Mise à jour de l'index actif dans l'état local
		dispatch(setProjects(newList)); // Mise à jour du state global Redux avec la nouvelle liste de projets

		try {
			await projectApi.updatePosition({ projects: newList }); // Appel à l'API pour mettre à jour la position des projets
		} catch (err) {
			console.log(err); // En cas d'erreur, affichage dans la console
		}
	};

	// Fonction pour ajouter un nouveau projet
	const addProject = async () => {
		try {
			const res = await projectApi.create(); // Appel à l'API pour créer un nouveau projet
			const newList = [res, ...projects]; // Ajoute le nouveau projet à la liste existante
			dispatch(setProjects(newList)); // Mise à jour du state global Redux avec la nouvelle liste de projets
			navigate(`/projects/${res.id}`); // Redirection vers la page du nouveau projet
		} catch (err) {
			console.log(err); // En cas d'erreur, affichage dans la console
		}
	};

	return (
		<Drawer
			container={window.document.body}
			variant='permanent'
			open={isSidebarOpen}
			sx={drawerStyles}
		>
			<Box>
				{/* Icône de chevron pour fermer la barre latérale en mode mobile */}
				{isMobile && isSidebarOpen && (
					<IconButton onClick={toggleSidebar} sx={chevronIconStyles}>
						<ChevronLeftIcon fontSize='small' />
					</IconButton>
				)}
			</Box>
			<List
				disablePadding
				sx={{
					width: sidebarWidth,
					height: '100vh',
					backgroundColor: assets.colors.secondary,
				}}
			>
				<ListItem>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography variant='body2' fontWeight='700'>
							{user.username}
						</Typography>
						<IconButton onClick={logout}>
							<LogoutOutlinedIcon fontSize='small' />
						</IconButton>
					</Box>
				</ListItem>
				<SearchBar />
				<FavouriteList />
				<SharedList />
				<Box sx={{ paddingTop: '10px' }} />
				<ListItem>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography variant='body2' fontWeight='700'>
							Liste Privée
						</Typography>
						<IconButton onClick={addProject}>
							<AddBoxOutlinedIcon fontSize='small' />
						</IconButton>
					</Box>
				</ListItem>
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable key={'list-project-droppable-key'} droppableId={'list-project-droppable'}>
						{(provided) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{projects.map((item, index) => (
									<Draggable key={item.id} draggableId={item.id} index={index}>
										{(provided, snapshot) => (
											<ListItemButton
												ref={provided.innerRef}
												{...provided.dragHandleProps}
												{...provided.draggableProps}
												selected={index === activeIndex}
												component={Link}
												to={`/projects/${item.id}`}
												sx={{
													pl: '20px',
													cursor: snapshot.isDragging
														? 'grab'
														: 'pointer!important',
												}}
											>
												<Typography
													variant='body2'
													fontWeight='700'
													sx={{
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
												>
													{item.icon} {item.title}
												</Typography>
											</ListItemButton>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</List>
		</Drawer>
	);
};

export default Sidebar; // Exporte le composant Sidebar
