import { useState } from 'react'; // Importation du hook useState de React pour gérer l'état local
import { Link, useNavigate } from 'react-router-dom'; // Composant Link pour la navigation et hook useNavigate pour la gestion de la navigation
import { Box, Button, TextField } from '@mui/material'; // Composants d'interface utilisateur de Material-UI
import LoadingButton from '@mui/lab/LoadingButton'; // Composant LoadingButton de Material-UI Lab pour créer un bouton avec état de chargement
import authApi from '../api/authApi'; // Importation de l'API authApi pour effectuer des opérations d'authentification

// Composant pour l'inscription
const Signup = () => {
	// Utilisation du hook useNavigate pour obtenir la fonction de navigation
	const navigate = useNavigate();

	// Utilisation du hook useState pour gérer l'état des éléments du formulaire
	const [loading, setLoading] = useState(false); // État pour gérer l'état de chargement du bouton
	const [usernameErrText, setUsernameErrText] = useState(''); // État pour gérer le message d'erreur du champ de nom d'utilisateur
	const [passwordErrText, setPasswordErrText] = useState(''); // État pour gérer le message d'erreur du champ de mot de passe
	const [confirmPasswordErrText, setConfirmPasswordErrText] = useState(''); // État pour gérer le message d'erreur du champ de confirmation du mot de passe

	// Fonction pour gérer la soumission du formulaire
	const handleSubmit = async (e) => {
		e.preventDefault(); // Empêche le comportement par défaut du formulaire
		setUsernameErrText(''); // Réinitialise le message d'erreur du nom d'utilisateur
		setPasswordErrText(''); // Réinitialise le message d'erreur du mot de passe
		setConfirmPasswordErrText(''); // Réinitialise le message d'erreur de confirmation du mot de passe

		const data = new FormData(e.target); // Récupère les données du formulaire
		const username = data.get('username').trim(); // Récupère et nettoie la valeur du champ nom d'utilisateur
		const password = data.get('password').trim(); // Récupère et nettoie la valeur du champ mot de passe
		const confirmPassword = data.get('confirmPassword').trim(); // Récupère et nettoie la valeur du champ confirmation du mot de passe

		let err = false; // Variable pour indiquer s'il y a des erreurs de validation

		// Validation des champs et gestion des messages d'erreur
		if (username === '') {
			err = true;
			setUsernameErrText('Veuillez remplir ce champ');
		}
		if (password === '') {
			err = true;
			setPasswordErrText('Veuillez remplir ce champ');
		}
		if (confirmPassword === '') {
			err = true;
			setConfirmPasswordErrText('Veuillez remplir ce champ');
		}
		if (password !== confirmPassword) {
			err = true;
			setConfirmPasswordErrText('Les deux mots de passe ne concordent pas');
		}

		if (err) return; // Si des erreurs sont présentes, arrête la soumission du formulaire

		setLoading(true); // Active l'état de chargement pour le bouton

		try {
			const res = await authApi.signup({
				username,
				password,
				confirmPassword,
			}); // Appelle l'API pour l'inscription avec les données saisies
			setLoading(false); // Désactive l'état de chargement
			localStorage.setItem('token', res.token); // Enregistre le token d'authentification dans le stockage local
			navigate('/'); // Redirige vers la page d'accueil après inscription réussie
		} catch (err) {
			const errors = err.data.errors;
			errors.forEach((e) => {
				if (e.param === 'username') {
					setUsernameErrText(e.msg);
				}
				if (e.param === 'password') {
					setPasswordErrText(e.msg);
				}
				if (e.param === 'confirmPassword') {
					setConfirmPasswordErrText(e.msg);
				}
			});
			setLoading(false);
		}
	};

	// Rendu du composant
	return (
		<>
			<Box component='form' sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
				<TextField
					margin='normal'
					required
					fullWidth
					id='username'
					label="Nom d'utilisateur"
					name='username'
					disabled={loading}
					error={usernameErrText !== ''}
					helperText={usernameErrText}
				/>
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
				<TextField
					margin='normal'
					required
					fullWidth
					id='confirmPassword'
					label='Confirmez le mot de passe'
					name='confirmPassword'
					type='password'
					disabled={loading}
					error={confirmPasswordErrText !== ''}
					helperText={confirmPasswordErrText}
				/>
				<LoadingButton
					sx={{ mt: 3, mb: 2 }}
					variant='outlined'
					fullWidth
					color='success'
					type='submit'
					loading={loading}
				>
					S'enregistrer
				</LoadingButton>
			</Box>
			<Button component={Link} to='/login' sx={{ textTransform: 'none' }}>
				Vous avez déjà un compte ? Connectez-vous
			</Button>
		</>
	);
};

export default Signup; // Exporte le composant Signup
