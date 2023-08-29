import React, { useEffect, useRef, useState } from 'react'; // Import de useRef, useEffect et useState
import { CKEditor } from '@ckeditor/ckeditor5-react'; // Composant CKEditor pour l'édition du contenu
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Configuration de CKEditor
import Moment from 'moment'; // Bibliothèque pour la manipulation des dates
import {
	Backdrop,
	Fade,
	IconButton,
	Modal,
	Box,
	TextField,
	Typography,
	Divider,
	useMediaQuery,
	useTheme,
} from '@mui/material'; // Import de composants MUI (Material-UI)
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // Icône de suppression depuis MUI

import taskApi from '../../api/taskApi'; // Import du module pour les requêtes API liées aux tâches

import '../../css/custom-editor.css'; // Import d'une feuille de style personnalisée

// Déclaration de variables et états initiaux
let timer;
const timeout = 500;
let isModalClosed = false;

// Composant pour la fenêtre modale de détails de tâche
const TaskModal = (props) => {
	const projectId = props.projectId; // ID du projet passé en prop
	const theme = useTheme(); // Accès au thème MUI
	const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Vérifie si l'écran est en mode mobile
	const [task, setTask] = useState(props.task); // État pour la tâche actuellement affichée dans la modale
	const [title, setTitle] = useState(''); // État pour le titre de la tâche
	const [content, setContent] = useState(''); // État pour le contenu de la tâche
	const editorWrapperRef = useRef(); // Référence à un élément DOM pour l'éditeur CKEditor

	// Style de la modale
	const modalStyle = {
		outline: 'none',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: isMobile ? '80%' : '50%',
		bgcolor: 'background.paper',
		border: '0px solid #000',
		boxShadow: 24,
		p: 1,
		height: '80%',
	};

	// Effet pour mettre à jour les états lorsque la tâche change
	useEffect(() => {
		setTask(props.task); // Mise à jour de la tâche dans l'état local
		setTitle(props.task !== undefined ? props.task.title : ''); // Mise à jour du titre de la tâche
		setContent(props.task !== undefined ? props.task.content : ''); // Mise à jour du contenu de la tâche
		if (props.task !== undefined) {
			isModalClosed = false;

			updateEditorHeight(); // Met à jour la hauteur de l'éditeur CKEditor
		}
	}, [props.task]);

	// Fonction pour mettre à jour la hauteur de l'éditeur CKEditor
	const updateEditorHeight = () => {
		setTimeout(() => {
			if (editorWrapperRef.current) {
				const box = editorWrapperRef.current;
				box.querySelector('.ck-editor__editable_inline').style.height =
					box.offsetHeight - 50 + 'px';
			}
		}, timeout);
	};

	// Fonction appelée à la fermeture de la modale
	const onClose = () => {
		isModalClosed = true; // Marque la modale comme fermée
		props.onUpdate(task); // Appelle la fonction onUpdate passée en prop
		props.onClose(); // Appelle la fonction onClose passée en prop
	};

	// Fonction pour supprimer une tâche
	const deleteTask = async () => {
		try {
			await taskApi.delete(projectId, task.id); // Appel à l'API pour supprimer la tâche
			props.onDelete(task); // Appelle la fonction onDelete passée en prop
			setTask(undefined); // Met à jour la tâche dans l'état local
		} catch (err) {
			console.log(err); // En cas d'erreur, affichage dans la console
		}
	};

	// Fonction pour mettre à jour le titre d'une tâche
	const updateTitle = async (e) => {
		clearTimeout(timer);
		const newTitle = e.target.value;
		timer = setTimeout(async () => {
			try {
				await taskApi.update(projectId, task.id, { title: newTitle }); // Appel à l'API pour mettre à jour le titre
			} catch (err) {
				console.log(err); // En cas d'erreur, affichage dans la console
			}
		}, timeout);

		task.title = newTitle; // Met à jour le titre dans l'objet tâche
		setTitle(newTitle); // Met à jour le titre dans l'état local
		props.onUpdate(task); // Appelle la fonction onUpdate passée en prop
	};

	// Fonction pour mettre à jour le contenu d'une tâche
	const updateContent = async (event, editor) => {
		clearTimeout(timer);
		const data = editor.getData();

		if (!isModalClosed) {
			timer = setTimeout(async () => {
				try {
					await taskApi.update(projectId, task.id, { content: data }); // Appel à l'API pour mettre à jour le contenu
				} catch (err) {
					console.log(err); // En cas d'erreur, affichage dans la console
				}
			}, timeout);

			task.content = data; // Met à jour le contenu dans l'objet tâche
			setContent(data); // Met à jour le contenu dans l'état local
			props.onUpdate(task); // Appelle la fonction onUpdate passée en prop
		}
	};

	return (
		<Modal
			open={task !== undefined}
			onClose={onClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{ timeout: 500 }}
		>
			<Fade in={task !== undefined}>
				<Box sx={modalStyle}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							width: '100%',
						}}
					>
						<IconButton variant='outlined' color='error' onClick={deleteTask}>
							<DeleteOutlinedIcon />
						</IconButton>
					</Box>
					<Box
						sx={{
							display: 'flex',
							height: '100%',
							flexDirection: 'column',
							padding: isMobile ? '' : '2rem 5rem 5rem',
						}}
					>
						<TextField
							value={title}
							onChange={updateTitle}
							placeholder='Sans titre'
							variant='outlined'
							fullWidth
							sx={{
								width: '100%',
								'& .MuiOutlinedInput-input': { padding: 0 },
								'& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
								'& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
								marginBottom: '10px',
							}}
						/>
						<Typography variant='body2' fontWeight='700'>
							{task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
						</Typography>
						<Divider sx={{ margin: '1.5rem 0' }} />
						<Box
							ref={editorWrapperRef}
							sx={{
								position: 'relative',
								height: '80%',
								overflowX: 'hidden',
								overflowY: 'auto',
							}}
						>
							<CKEditor
								editor={ClassicEditor}
								data={content}
								onChange={updateContent}
								onFocus={updateEditorHeight}
								onBlur={updateEditorHeight}
							/>
						</Box>
					</Box>
				</Box>
			</Fade>
		</Modal>
	);
};

export default TaskModal; // Exporte le composant TaskModal
