import axiosInstance from 'axios';

const apiUrl = 'http://localhost:3000/theme'; // Remplacez par votre URL d'API

export const getThemes = async () => {
  try {
    const response = await axiosInstance.get(apiUrl);
    return response.data; // Retourne les données des thèmes
  } catch (error) {
    console.error("Erreur lors de la récupération des thèmes", error);
    throw error; // Lance l'erreur pour qu'elle soit gérée par le composant
  }
};

export const fetchCursusById = async(id) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get(`http://localhost:3000/cursus/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
      },
  });
  return response.data
}

export const fetchLessonById = async(id) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get(`http://localhost:3000/lesson/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
      },
  });
  return response.data
}
