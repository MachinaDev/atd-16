// Importation de la fonction createSlice depuis Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// État initial du slice
const initialState = { value: [] };

// Création du slice pour gérer les données des favoris
export const favouriteSlice = createSlice({
	name: 'favourites', // Nom du slice
	initialState, // État initial
	reducers: {
		setFavouriteList: (state, action) => {
			state.value = action.payload; // Action pour définir les données des favoris
		},
	},
});

// Exportation de l'action setFavouriteList
export const { setFavouriteList } = favouriteSlice.actions;

// Exportation du reducer associé au slice
export default favouriteSlice.reducer;
