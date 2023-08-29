import { useEffect, useState } from 'react'; // Import des hooks de gestion d'état depuis React
import { Link } from 'react-router-dom'; // Import du composant de lien pour la navigation
import { useDispatch, useSelector } from 'react-redux'; // Import des hooks de gestion de l'état Redux
import { setProjects } from '../../redux/features/projectSlice'; // Import d'une action Redux

import projectApi from '../../api/projectApi'; // Import du module pour les requêtes API liées aux projets

import { Box, ListItem, ListItemButton, Typography } from '@mui/material'; // Import de composants MUI (Material-UI)

import SearchIcon from '@mui/icons-material/Search'; // Icône de recherche depuis MUI
import TextField from '@mui/material/TextField'; // Composant de champ de texte depuis MUI
import InputAdornment from '@mui/material/InputAdornment'; // Adornment pour le champ de texte depuis MUI

// Définition du composant fonctionnel SearchBar
const SearchBar = () => {
	// Déclaration de l'état pour la requête de recherche
	const [searchQuery, setSearchQuery] = useState('');

	// Accès au dispatch Redux
	const dispatch = useDispatch();

	// Récupération de la liste des projets depuis le store Redux
	const projects = useSelector((state) => state.project.value);

	// Effet de chargement initial pour récupérer les projets
	useEffect(() => {
		const getProjects = async () => {
			try {
				const res = await projectApi.getAll(); // Appel à l'API pour récupérer la liste des projets
				dispatch(setProjects(res)); // Mise à jour du state Redux avec la liste des projets
			} catch (err) {
				console.log(err); // En cas d'erreur, affichage dans la console
			}
		};
		getProjects();
	}, [dispatch]);

	// Fonction pour filtrer les projets en fonction de la requête de recherche
	const filterData = (query) => {
		if (!query) {
			return [];
		} else {
			return projects.filter((project) =>
				project.title.toLowerCase().includes(query.toLowerCase())
			);
		}
	};

	// Liste des projets filtrés en fonction de la requête de recherche
	const dataFiltered = filterData(searchQuery);

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
						Rechercher un projet
					</Typography>
				</Box>
			</ListItem>
			<form style={{ display: 'flex' }}>
				<TextField
					id='search-bar'
					className='text'
					onInput={(e) => {
						setSearchQuery(e.target.value); // Met à jour la requête de recherche
					}}
					label='Chercher un projet'
					variant='outlined'
					placeholder='Nom du projet'
					size='small'
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<SearchIcon /> {/* Icône de recherche à la fin du champ de texte */}
							</InputAdornment>
						),
					}}
				/>
			</form>

			<div style={{ padding: 3 }}>
				{dataFiltered.map((project, index) => (
					<div
						className='text'
						style={{
							padding: 5,
							fontSize: 15,
							color: 'white',
							margin: 1,
							BorderColor: 'green',
							borderWidth: '10px',
						}}
						key={project.id}
					>
						{/* Affichage des projets filtrés avec un lien vers la page du projet */}
						<ListItemButton component={Link} to={`/projects/${project.id}`}>
							<Typography
								variant='body2'
								fontWeight='700'
								sx={{
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
							>
								{project.title}
							</Typography>
						</ListItemButton>
					</div>
				))}
			</div>
		</>
	);
};

export default SearchBar; // Exporte le composant SearchBar
