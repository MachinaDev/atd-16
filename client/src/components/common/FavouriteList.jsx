import { useEffect, useState } from 'react'; // Importe les modules React, useEffect et useState
import { useDispatch, useSelector } from 'react-redux'; // Importe les hooks useDispatch et useSelector de Redux
import { useParams, Link } from 'react-router-dom'; // Importe le hook useParams pour obtenir les paramètres d'URL et le composant Link pour la navigation
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'; // Importe les composants DragDropContext, Draggable et Droppable de react-beautiful-dnd

import projectApi from '../../api/projectApi'; // Importe l'API projectApi pour les opérations liées aux projets
import { setFavouriteList } from '../../redux/features/favouriteSlice'; // Importe l'action setFavouriteList du slice favouriteSlice

import { Box, ListItem, ListItemButton, Typography } from '@mui/material'; // Importe les composants Box, ListItem, ListItemButton et Typography de Material-UI

// Composant FavouriteList pour afficher la liste des favoris
const FavouriteList = () => {
	const dispatch = useDispatch(); // Récupère la fonction dispatch de Redux
	const list = useSelector((state) => state.favourites.value); // Récupère la liste des favoris depuis le store Redux
	const [activeIndex, setActiveIndex] = useState(0); // État pour gérer l'index actif
	const { projectId } = useParams(); // Récupère l'ID de projet depuis les paramètres d'URL

	// Utilisation du hook useEffect pour obtenir la liste des favoris depuis l'API
	useEffect(() => {
		const getProjects = async () => {
			try {
				const res = await projectApi.getFavourites();
				dispatch(setFavouriteList(res));
			} catch (err) {
				console.log(err);
			}
		};
		getProjects();
	}, []); // La dépendance vide signifie que cette effect ne sera exécutée qu'une fois après le montage

	// Utilisation du hook useEffect pour mettre à jour l'index actif en fonction de la liste et de l'ID de projet
	useEffect(() => {
		const index = list.findIndex((e) => e.id === projectId);
		setActiveIndex(index);
	}, [list, projectId]);

	// Fonction appelée lorsqu'un élément est déplacé dans la liste (Drag and Drop)
	const onDragEnd = async ({ source, destination }) => {
		const newList = [...list];
		const [removed] = newList.splice(source.index, 1);
		newList.splice(destination.index, 0, removed);

		const activeItem = newList.findIndex((e) => e.id === projectId);
		setActiveIndex(activeItem);

		dispatch(setFavouriteList(newList)); // Met à jour la liste des favoris dans le store Redux

		try {
			await projectApi.updateFavouritePosition({ projects: newList }); // Met à jour la position des favoris via l'API
		} catch (err) {
			console.log(err);
		}
	};

	// Rendu du composant FavouriteList
	return (
		<>
			{/* Affiche le titre de la liste des favoris */}
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
						Favoris
					</Typography>
				</Box>
			</ListItem>
			{/* Utilisation du composant DragDropContext pour gérer le glisser-déposer */}
			<DragDropContext onDragEnd={onDragEnd}>
				{/* Utilisation du composant Droppable pour envelopper la liste */}
				<Droppable key={'list-project-droppable-key'} droppableId={'list-project-droppable'}>
					{(provided) => (
						<div ref={provided.innerRef} {...provided.droppableProps}>
							{/* Boucle à travers la liste des favoris et utilise le composant Draggable */}
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
											{/* Affiche l'icône et le titre du projet favori */}
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

export default FavouriteList; // Exporte le composant FavouriteList
