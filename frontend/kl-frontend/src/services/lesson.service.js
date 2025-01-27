import axios from 'axios';

export const getThemes = async () => {
  try {
    const response = await axios.get('http://localhost:3000/theme');
    return response.data; // Retourne les données des thèmes
  } catch (error) {
    console.error("Erreur lors de la récupération des thèmes", error);
    throw error; // Lance l'erreur pour qu'elle soit gérée par le composant
  }
};

export const fetchThemeById = async(id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:3000/theme/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
      },
  });
  return response.data
}

// Ajouter un thème
export const addTheme = async (themeData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post('http://localhost:3000/theme/add', themeData, {
      headers: {
        Authorization: `Bearer ${token}`, // Envoi du token dans les en-têtes
      },
    });
    return response.data; // Retourne les données du thème créé
  } catch (error) {
    console.error("Erreur lors de l'ajout du thème", error);
    throw error;
  }
};

// Mettre à jour un thème
export const updateTheme = async (id, themeData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`http://localhost:3000/theme/${id}`, themeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retourne les données du thème mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour du thème", error);
    throw error;
  }
};

// Supprimer un thème
export const deleteTheme = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`http://localhost:3000/theme/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retourne la réponse de suppression du thème
  } catch (error) {
    console.error("Erreur lors de la suppression du thème", error);
    throw error;
  }
};

export const fetchCursusById = async(id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:3000/cursus/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
      },
  });
  return response.data
}

// Ajouter un cursus
export const addCursus = async (cursusData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post("http://localhost:3000/cursus/add", cursusData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retourne les données du cursus créé
  } catch (error) {
    console.error("Erreur lors de l'ajout du cursus", error);
    throw error;
  }
};

// Mettre à jour un cursus
export const updateCursus = async (id, cursusData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`http://localhost:3000/cursus/${id}`, cursusData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retourne les données du cursus mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cursus", error);
    throw error;
  }
};

// Supprimer un cursus
export const deleteCursus = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`http://localhost:3000/cursus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retourne la réponse de suppression du cursus
  } catch (error) {
    console.error("Erreur lors de la suppression du cursus", error);
    throw error;
  }
};

export const fetchLessonById = async(id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:3000/lesson/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
      },
  });
  return response.data
}

// Ajouter une leçon
export const addLesson = async (lessonData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post("http://localhost:3000/lesson/add", lessonData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retourne les données de la leçon créée
  } catch (error) {
    console.error("Erreur lors de l'ajout de la leçon", error);
    throw error;
  }
};

// Mettre à jour une leçon
export const updateLesson = async (id, lessonData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`http://localhost:3000/lesson/${id}`, lessonData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retourne les données de la leçon mise à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la leçon", error);
    throw error;
  }
};

// Supprimer une leçon
export const deleteLesson = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`http://localhost:3000/lesson/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retourne la réponse de suppression de la leçon
  } catch (error) {
    console.error("Erreur lors de la suppression de la leçon", error);
    throw error;
  }
};