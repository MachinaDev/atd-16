// Importation de la fonction createSlice depuis Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// État initial du slice
const initialState = { value: [] };

// Création du slice pour gérer les données partagées
export const sharedSlice = createSlice({
	name: 'shared', // Nom du slice
	initialState, // État initial
	reducers: {
		setSharedList: (state, action) => {
			state.value = action.payload; // Action pour définir les données partagées
		},
	},
});

// Exportation de l'action setSharedList
export const { setSharedList } = sharedSlice.actions;

// Exportation du reducer associé au slice
export default sharedSlice.reducer;
