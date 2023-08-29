import { useEffect, useState } from 'react'; // Import des hooks depuis React
import { useParams, Link } from 'react-router-dom'; // Import du composant de lien pour la navigation
import { useDispatch, useSelector } from 'react-redux'; // Import des hooks de gestion de l'état Redux
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'; // Import des composants pour le glisser-déposer
import { Box, ListItem, ListItemButton, Typography } from '@mui/material'; // Import de composants MUI (Material-UI)
import projectApi from '../../api/projectApi'; // Import du module pour les requêtes API liées aux projets
import { setSharedList } from '../../redux/features/sharedSlice'; // Import d'une action Redux

// Composant pour la liste des projets partagés
const SharedList = () => {
	const dispatch = useDispatch(); // Accès au dispatch Redux
	const list = useSelector((state) => state.shared.value); // Récupération de la liste des projets partagés depuis le store Redux
	const [activeIndex, setActiveIndex] = useState(0); // État pour l'index actif
	const { projectId } = useParams(); // Récupération du paramètre projectId depuis l'URL

	// Effet de chargement initial pour récupérer les projets partagés
	useEffect(() => {
		const getProjects = async () => {
			try {
				const res = await projectApi.getShared(); // Appel à l'API pour récupérer la liste des projets partagés
				dispatch(setSharedList(res)); // Mise à jour du state Redux avec la liste des projets partagés
			} catch (err) {
				console.log(`err:`, err); // En cas d'erreur, affichage dans la console
			}
		};
		getProjects();
	}, [dispatch]);

	// Mise à jour de l'index actif en fonction du projet sélectionné
	useEffect(() => {
		const index = list.findIndex((e) => e.id === projectId);
		setActiveIndex(index);
	}, [list, projectId]);

	// Fonction appelée lors de la fin du glisser-déposer
	// Fonction appelée lors de la fin du glisser-déposer
	const onDragEnd = async ({ source, destination }) => {
		const newList = [...list]; // Crée une copie de la liste actuelle de projets partagés
		const [removed] = newList.splice(source.index, 1); // Supprime l'élément déplacé de l'ancien emplacement
		newList.splice(destination.index, 0, removed); // Insère l'élément déplacé à la nouvelle position

		const activeItem = newList.findIndex((e) => e.id === projectId); // Trouve l'index du projet actif
		setActiveIndex(activeItem); // Met à jour l'index actif dans le state local

		dispatch(setSharedList(newList)); // Met à jour la liste de projets partagés dans le store Redux

		try {
			await projectApi.updateSharedPosition({ projects: newList }); // Appelle l'API pour mettre à jour la position des projets partagés
		} catch (err) {
			console.log(`err:`, err); // En cas d'erreur, affichage dans la console
		}
	};

	// Rendu de la liste des projets partagés
	return (
		<>
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
						Projets partagés avec vous
					</Typography>
				</Box>
			</ListItem>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable key={'list-project-droppable-key'} droppableId={'list-project-droppable'}>
					{(provided) => (
						<div ref={provided.innerRef} {...provided.droppableProps}>
							{list.map((item, index) => (
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
		</>
	);
};

export default SharedList; // Exporte le composant SharedList
