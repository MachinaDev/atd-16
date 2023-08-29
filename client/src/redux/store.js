// Importation de la fonction configureStore depuis Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';

// Importation des reducers depuis leurs fichiers respectifs
import userReducer from './features/userSlice';
import projectReducer from './features/projectSlice';
import favouriteReducer from './features/favouriteSlice';
import sharedReducer from './features/sharedSlice';

// Configuration du store Redux à l'aide de configureStore
export const store = configureStore({
	// Associe chaque reducer à un champ spécifique du store
	reducer: {
		user: userReducer, // Reducer pour gérer les données de l'utilisateur, associé au champ 'user'
		project: projectReducer, // Reducer pour gérer les données des projets, associé au champ 'project'
		favourites: favouriteReducer, // Reducer pour gérer les données des favoris, associé au champ 'favourites'
		shared: sharedReducer, // Reducer pour gérer les données des projets partagés, associé au champ 'shared'
	},
});
