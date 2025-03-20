import axiosInstance from "../services/axios";

export const getThemes = async () => {
  try {
    const response = await axiosInstance.get('http://localhost:3000/themes');
    return response; 
  } catch (error) {
    console.error("Erreur lors de la récupération des thèmes", error);
    throw error;
  }
};

export const fetchThemeById = async(id) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get(`http://localhost:3000/themes/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return response.data
}

// Add a theme
export const addTheme = async (themeData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post('http://localhost:3000/themes/add', themeData, {
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

// Update a theme
export const updateTheme = async (id, themeData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`http://localhost:3000/themes/${id}`, themeData, {
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

// Delete a theme
export const deleteTheme = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.del(`http://localhost:3000/themes/${id}`, {
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
  const response = await axiosInstance.get(`http://localhost:3000/cursus/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
      },
  });
  return response
}

// Add a cursus
export const addCursus = async (cursusData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("http://localhost:3000/cursus/add", cursusData, {
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

// Update a cursus
export const updateCursus = async (id, cursusData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`http://localhost:3000/cursus/${id}`, cursusData, {
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

// Delete a cursus
export const deleteCursus = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.del(`http://localhost:3000/cursus/${id}`, {
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

// Get a lesson by ID
export const fetchLessonById = async(id) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get(`http://localhost:3000/lessons/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
      },
  });
  return response
}

// Add a lesson
export const addLesson = async (lessonData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("http://localhost:3000/lessons/add", lessonData, {
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

// Update a lesson
export const updateLesson = async (id, lessonData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`http://localhost:3000/lessons/${id}`, lessonData, {
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

// Delete a lesson
export const deleteLesson = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.del(`http://localhost:3000/lessons/${id}`, {
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