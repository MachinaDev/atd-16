import { useState } from 'react'; // Importe useState du module React
import { Link, useNavigate } from 'react-router-dom'; // Importe Link et useNavigate du module react-router-dom

import LoadingButton from '@mui/lab/LoadingButton'; // Importe le composant LoadingButton du module MUI
import { Box, Button, TextField } from '@mui/material'; // Importe des composants depuis le module MUI

import authApi from '../api/authApi'; // Importe le module pour les opérations d'authentification

const Login = () => {
	const navigate = useNavigate(); // Initialise la fonction de navigation
	const [loading, setLoading] = useState(false); // État pour le chargement
	const [usernameErrText, setUsernameErrText] = useState(''); // État pour le message d'erreur du nom d'utilisateur
	const [passwordErrText, setPasswordErrText] = useState(''); // État pour le message d'erreur du mot de passe

	// Fonction appelée lors de la soumission du formulaire
	const handleSubmit = async (e) => {
		e.preventDefault(); // Empêche le comportement par défaut du formulaire
		// Réinitialise les messages d'erreur
		setUsernameErrText('');
		setPasswordErrText('');

		const data = new FormData(e.target); // Récupère les données du formulaire
		const username = data.get('username').trim(); // Extrait le nom d'utilisateur et le nettoie
		const password = data.get('password').trim(); // Extrait le mot de passe et le nettoie

		let err = false; // Variable pour suivre les erreurs

		if (username === '') {
			err = true;
			setUsernameErrText('Merci de remplir ce champ'); // Définit un message d'erreur si le nom d'utilisateur est vide
		}
		if (password === '') {
			err = true;
			setPasswordErrText('Merci de remplir ce champ'); // Définit un message d'erreur si le mot de passe est vide
		}

		if (err) return; // Si des erreurs sont présentes, interrompt la soumission

		setLoading(true); // Active l'indicateur de chargement

		try {
			const res = await authApi.login({ username, password }); // Appel à l'API pour la connexion
			setLoading(false); // Désactive l'indicateur de chargement
			localStorage.setItem('token', res.token); // Stocke le token dans le local storage
			navigate('/'); // Redirige l'utilisateur vers la page d'accueil
		} catch (err) {
			const errors = err.data.errors; // Récupère les erreurs de l'API
			errors.forEach((e) => {
				if (e.param === 'username') {
					setUsernameErrText(e.msg); // Affiche les messages d'erreur associés aux champs
				}
				if (e.param === 'password') {
					setPasswordErrText(e.msg);
				}
			});
			setLoading(false); // Désactive l'indicateur de chargement
		}
	};

	return (
		<>
			<Box component='form' sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
				{/* Champ pour le nom d'utilisateur */}
				<TextField
					margin='normal'
					required
					fullWidth
					id='username'
					label="Email ou nom d'utilisateur"
					name='username'
					disabled={loading}
					error={usernameErrText !== ''}
					helperText={usernameErrText}
				/>
				{/* Champ pour le mot de passe */}
				<TextField
					margin='normal'
					required
					fullWidth
					id='password'
					label='Mot de passe'
					name='password'
					type='password'
					disabled={loading}
					error={passwordErrText !== ''}
					helperText={passwordErrText}
				/>
				{/* Bouton de soumission avec indication de chargement */}
				<LoadingButton
					sx={{ mt: 3, mb: 2 }}
					variant='outlined'
					fullWidth
					color='success'
					type='submit'
					loading={loading}
				>
					Se connecter
				</LoadingButton>
			</Box>
			{/* Lien vers la page d'inscription */}
			<Button component={Link} to='/signup' sx={{ textTransform: 'none' }}>
				Vous n'avez pas de compte ? Créer un compte.
			</Button>
		</>
	);
};

export default Login; // Exporte le composant Login
