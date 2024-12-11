import axios from 'axios';

const apiUrl = 'http://localhost:3000/theme/'; // Remplacez par votre URL d'API

export const getThemes = async () => {
  try {
    const response = await axios.get(apiUrl);
    console.log(response)
    return response.data; // Retourne les données des thèmes
  } catch (error) {
    console.error("Erreur lors de la récupération des thèmes", error);
    throw error; // Lance l'erreur pour qu'elle soit gérée par le composant
  }
};
