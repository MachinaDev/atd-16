import React from 'react'; // Importation du module React
import ReactDOM from 'react-dom/client'; // Importation du module ReactDOM pour le rendu côté client
import { store } from './redux/store'; // Importation du magasin Redux depuis le fichier store.js
import { Provider } from 'react-redux'; // Importation du composant Provider depuis le module react-redux
import App from './App'; // Importation du composant App depuis le fichier App.js

// Création d'une racine de rendu ReactDOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendu du composant App enveloppé dans le Provider du store Redux
root.render(
	<Provider store={store}>
		<App />
	</Provider>
);
