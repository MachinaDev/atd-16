import { useEffect, useState } from 'react'; // Import des hooks de gestion d'état depuis React
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'; // Import des composants pour la bibliothèque de glisser-déposer réactif
import {
	Box,
	Button,
	Typography,
	Divider,
	TextField,
	IconButton,
	Card,
	useMediaQuery,
	useTheme,
} from '@mui/material'; // Import depuis le module MUI (Material-UI)

// Import du composant TaskModal depuis le fichier local
import TaskModal from './TaskModal';

// Import des API pour les sections et les tâches
import sectionApi from '../../api/sectionApi'; // Import d'un module pour les requêtes API liées aux sections
import taskApi from '../../api/taskApi'; // Import d'un module pour les requêtes API liées aux tâches

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // Icône de suppression depuis MUI
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'; // Icône d'ajout depuis MUI

// Déclaration d'une variable pour le timer
let timer;

// Définition de la durée limite pour le délai
const timeout = 500;

// Définition du composant fonctionnel Kanban avec des props en entrée
const Kanban = (props) => {
	// Récupération de l'ID du projet à partir des props
	const projectId = props.projectId;

	// Récupération du thème actuel et utilisation du hook useTheme pour gérer les médias
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	// Déclaration d'un état pour stocker les données du composant
	const [data, setData] = useState([]);

	// Déclaration d'un état pour stocker la tâche sélectionnée
	const [selectedTask, setSelectedTask] = useState(undefined);

	// Utilisation du hook useEffect pour mettre à jour les données lorsque les props.data changent
	useEffect(() => {
		setData(props.data);
	}, [props.data]);

	// Fonction de gestion de fin de glisser-déposer
	const onDragEnd = async ({ source, destination }) => {
		// Si la destination est nulle, ne rien faire
		if (!destination) return;

		// Recherche de l'index de la colonne source et de la colonne de destination dans les données
		const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
		const destinationColIndex = data.findIndex((e) => e.id === destination.droppableId);
		const sourceCol = data[sourceColIndex];
		const destinationCol = data[destinationColIndex];

		// Récupération des identifiants de section source et de section de destination
		const sourceSectionId = sourceCol.id;
		const destinationSectionId = destinationCol.id;

		// Création de copies des listes de tâches de la source et de la destination
		const sourceTasks = [...sourceCol.tasks];
		const destinationTasks = [...destinationCol.tasks];

		// Si la source et la destination sont différentes
		if (source.droppableId !== destination.droppableId) {
			// Retrait de la tâche de la source et ajout à la destination
			const [removed] = sourceTasks.splice(source.index, 1);
			destinationTasks.splice(destination.index, 0, removed);
			data[sourceColIndex].tasks = sourceTasks;
			data[destinationColIndex].tasks = destinationTasks;
		} else {
			// Si la source et la destination sont identiques, réarrangement de la liste de tâches dans la même colonne
			const [removed] = destinationTasks.splice(source.index, 1);
			destinationTasks.splice(destination.index, 0, removed);
			data[destinationColIndex].tasks = destinationTasks;
		}

		try {
			// Appel à l'API pour mettre à jour la position des tâches
			await taskApi.updatePosition(projectId, {
				resourceList: sourceTasks,
				destinationList: destinationTasks,
				resourceSectionId: sourceSectionId,
				destinationSectionId: destinationSectionId,
			});
			setData(data); // Mise à jour des données après le déplacement des tâches
		} catch (err) {
			console.log(err);
		}
	};

	// Fonction pour créer une nouvelle section
	const createSection = async () => {
		try {
			// Appel à l'API pour créer une nouvelle section associée au projet
			const section = await sectionApi.create(projectId);
			setData([...data, section]); // Ajout de la nouvelle section aux données existantes
		} catch (err) {
			console.log(err); // En cas d'erreur, affichage dans la console
		}
	};

	// Fonction pour supprimer une section existante
	const deleteSection = async (sectionId) => {
		try {
			// Appel à l'API pour supprimer une section spécifique du projet
			await sectionApi.delete(projectId, sectionId);
			const newData = [...data].filter((e) => e.id !== sectionId); // Création d'une nouvelle liste de données sans la section supprimée
			setData(newData); // Mise à jour des données après la suppression de la section
		} catch (err) {
			console.log(err); // En cas d'erreur, affichage dans la console
		}
	};

	// Fonction pour mettre à jour le titre d'une section
	const updateSectionTitle = async (e, sectionId) => {
		clearTimeout(timer); // Efface le timer existant
		const newTitle = e.target.value; // Nouveau titre saisi
		const newData = [...data]; // Crée une copie des données
		const index = newData.findIndex((e) => e.id === sectionId); // Trouve l'index de la section à mettre à jour
		newData[index].title = newTitle; // Met à jour le titre dans la copie des données
		setData(newData); // Met à jour les données avec le nouveau titre

		// Initialise un nouveau timer pour déclencher la mise à jour après un délai
		timer = setTimeout(async () => {
			try {
				await sectionApi.update(projectId, sectionId, { title: newTitle }); // Appel à l'API pour mettre à jour le titre de la section
			} catch (err) {
				console.log(err); // En cas d'erreur, affichage dans la console
			}
		}, timeout); // Délai défini précédemment
	};

	// Fonction pour créer une nouvelle tâche dans une section donnée
	const createTask = async (sectionId) => {
		try {
			// Appel à l'API pour créer une nouvelle tâche associée à la section et au projet
			const task = await taskApi.create(projectId, { sectionId });
			const newData = [...data]; // Crée une copie des données
			const index = newData.findIndex((e) => e.id === sectionId); // Trouve l'index de la section à mettre à jour
			newData[index].tasks.unshift(task); // Ajoute la nouvelle tâche en haut de la liste des tâches
			setData(newData); // Met à jour les données avec la nouvelle tâche ajoutée
		} catch (err) {
			console.log(err); // En cas d'erreur, affichage dans la console
		}
	};

	// Fonction pour mettre à jour les détails d'une tâche
	const onUpdateTask = (task) => {
		const newData = [...data]; // Crée une copie des données
		const sectionIndex = newData.findIndex((e) => e.id === task.section.id); // Trouve l'index de la section de la tâche
		const taskIndex = newData[sectionIndex].tasks.findIndex((e) => e.id === task.id); // Trouve l'index de la tâche dans la section
		newData[sectionIndex].tasks[taskIndex] = task; // Remplace la tâche existante par la nouvelle dans la copie des données
		setData(newData); // Met à jour les données avec la tâche mise à jour
	};

	// Fonction pour supprimer une tâche
	const onDeleteTask = (task) => {
		const newData = [...data]; // Crée une copie des données
		const sectionIndex = newData.findIndex((e) => e.id === task.section.id); // Trouve l'index de la section de la tâche
		const taskIndex = newData[sectionIndex].tasks.findIndex((e) => e.id === task.id); // Trouve l'index de la tâche dans la section
		newData[sectionIndex].tasks.splice(taskIndex, 1); // Supprime la tâche de la liste des tâches de la section
		setData(newData); // Met à jour les données après la suppression de la tâche
	};

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Button onClick={createSection}>Ajoutez une section</Button>
				<Typography variant='body2' fontWeight='700'>
					{data.length} Sections
				</Typography>
			</Box>
			<Divider sx={{ margin: '10px 0' }} />
			<DragDropContext onDragEnd={onDragEnd}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'flex-start',
						flexDirection: isMobile ? 'column' : 'row', // Affichage en colonne sur Mobile et ligne sur Dekstop
						overflowX: isMobile ? 'visible' : 'auto', // Ajuste l'overflow en mobile
						width: isMobile ? '100%' : 'calc(100vw - 400px)', // Ajuste la taille en fonction du screen
					}}
				>
					{data.map((section) => (
						<div key={section.id} style={{ width: '300px' }}>
							<Droppable key={section.id} droppableId={section.id}>
								{(provided) => (
									<Box
										ref={provided.innerRef}
										{...provided.droppableProps}
										sx={{ width: '300px', padding: '10px', marginRight: '10px' }}
									>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												marginBottom: '10px',
											}}
										>
											<TextField
												value={section.title}
												onChange={(e) => updateSectionTitle(e, section.id)}
												placeholder='Sans titre'
												variant='outlined'
												sx={{
													flexGrow: 1,
													'& .MuiOutlinedInput-input': { padding: 0 },
													'& .MuiOutlinedInput-notchedOutline': {
														border: 'unset ',
													},
													'& .MuiOutlinedInput-root': {
														fontSize: '1rem',
														fontWeight: '700',
													},
												}}
											/>
											<IconButton
												variant='outlined'
												size='small'
												sx={{
													color: 'gray',
													'&:hover': { color: 'green' },
												}}
												onClick={() => createTask(section.id)}
											>
												<AddOutlinedIcon />
											</IconButton>
											<IconButton
												variant='outlined'
												size='small'
												sx={{
													color: 'gray',
													'&:hover': { color: 'red' },
												}}
												onClick={() => deleteSection(section.id)}
											>
												<DeleteOutlinedIcon />
											</IconButton>
										</Box>
										{/* tasks */}
										{section.tasks.map((task, index) => (
											<Draggable key={task.id} draggableId={task.id} index={index}>
												{(provided, snapshot) => (
													<Card
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														sx={{
															padding: '10px',
															marginBottom: '10px',
															cursor: snapshot.isDragging
																? 'grab'
																: 'pointer!important',
														}}
														onClick={() => setSelectedTask(task)}
													>
														<Typography>
															{task.title === ''
																? 'Sans titre'
																: task.title}
														</Typography>
													</Card>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</Box>
								)}
							</Droppable>
						</div>
					))}
				</Box>
			</DragDropContext>
			<TaskModal
				task={selectedTask}
				projectId={projectId}
				onClose={() => setSelectedTask(undefined)}
				onUpdate={onUpdateTask}
				onDelete={onDeleteTask}
			/>
		</>
	);
};

export default Kanban; // Exporte le composant Kanban
