// Importation de la fonction createSlice depuis Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// État initial du slice
const initialState = { value: {} };

// Création du slice pour gérer les données utilisateur
export const userSlice = createSlice({
	name: 'user', // Nom du slice
	initialState, // État initial
	reducers: {
		setUser: (state, action) => {
			state.value = action.payload; // Action pour définir les données utilisateur
		},
	},
});

// Exportation des actions et du reducer associés au slice
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
