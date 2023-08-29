import React, { useState, useEffect } from 'react'; // Importe les modules React, useState et useEffect
import { Picker } from 'emoji-mart'; // Importe le composant Picker de la librairie emoji-mart
import { Box, Typography } from '@mui/material'; // Importe les composants Box et Typography de Material-UI

import 'emoji-mart/css/emoji-mart.css'; // Importe les styles CSS pour le composant emoji-mart

// Composant EmojiPicker pour la sélection d'emoji
const EmojiPicker = (props) => {
	// Utilisation du hook useState pour gérer l'état de l'emoji sélectionné et de l'affichage du picker
	const [selectedEmoji, setSelectedEmoji] = useState(); // État pour l'emoji sélectionné
	const [isShowPicker, setIsShowPicker] = useState(false); // État pour l'affichage du picker

	// Utilisation du hook useEffect pour mettre à jour l'emoji sélectionné lorsqu'il change dans les props
	useEffect(() => {
		setSelectedEmoji(props.icon);
	}, [props.icon]);

	// Fonction pour gérer la sélection d'un emoji
	const selectEmoji = (e) => {
		const sym = e.unified.split('-'); // Découpe le code Unicode de l'emoji en parties
		let codesArray = [];
		sym.forEach((el) => codesArray.push('0x' + el)); // Convertit chaque partie en code hexadécimal
		const emoji = String.fromCodePoint(...codesArray); // Convertit les codes en caractère emoji
		setIsShowPicker(false); // Ferme le picker d'emoji
		props.onChange(emoji); // Appelle la fonction onChange avec l'emoji sélectionné
	};

	// Fonction pour afficher ou masquer le picker d'emoji
	const showPicker = () => setIsShowPicker(!isShowPicker);

	// Rendu du composant EmojiPicker
	return (
		<Box sx={{ position: 'relative', width: 'max-content' }}>
			{/* Affiche l'emoji sélectionné avec un style de curseur pointer */}
			<Typography variant='h3' fontWeight='700' sx={{ cursor: 'pointer' }} onClick={showPicker}>
				{selectedEmoji}
			</Typography>
			{/* Affiche le picker d'emoji dans une boîte absolue en-dessous de l'emoji */}
			<Box
				sx={{
					display: isShowPicker ? 'block' : 'none', // Affiche ou masque le picker en fonction de l'état
					position: 'absolute',
					top: '100%', // Position en-dessous de l'emoji
					zIndex: '9999', // Z-index pour superposer au contenu
				}}
			>
				{/* Utilisation du composant Picker pour afficher le picker d'emoji */}
				<Picker theme='dark' locale={'fr'} onSelect={selectEmoji} showPreview={false} />
			</Box>
		</Box>
	);
};

export default EmojiPicker; // Exporte le composant EmojiPicker
