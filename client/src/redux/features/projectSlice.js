// Importation de la fonction createSlice depuis Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// État initial du slice
const initialState = { value: [] };

// Création du slice pour gérer les données de projet
export const projectSlice = createSlice({
	name: 'project', // Nom du slice
	initialState, // État initial
	reducers: {
		setProjects: (state, action) => {
			state.value = action.payload; // Action pour définir les données de projet
		},
	},
});

// Exportation de l'action setProjects
export const { setProjects } = projectSlice.actions;

// Exportation du reducer associé au slice
export default projectSlice.reducer;
