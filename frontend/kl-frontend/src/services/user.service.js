import axios from "axios";

export const getUsers = async() => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:3000/user/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

// Fonction pour récupérer les informations de l'utilisateur
export const getUserInfo = async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  if (!token || !userId) {
    throw new Error("Jeton ou ID utilisateur manquant.");
  }

  // Requête pour récupérer les leçons
  const response = await axios.get(`http://localhost:3000/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// Fonction pour s'inscrire
export const registerUser = async (userData) => {
  const response = await axios.post("http://localhost:3000/user/register", userData);
  return response; // Retourne la réponse de l'inscription
};

export const confirmRegistration = async (token) => {
  const response = await axios.get(`http://localhost:3000/user/confirm/${token}`);
  return response.data;
};

// Fonction pour se connecter
export const loginUser = async (email, password) => {
  const response = await axios.post("http://localhost:3000/user/authenticate", {
    email,
    password,
  });
  return response; // Retourne la réponse de la connexion
};

export const addUser = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post("http://localhost:3000/user/add", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur'", error);
    throw error;
  }
};

// Fonction pour mettre à jour les informations utilisateur
export const updateUserInfo = async (userId, userData) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `http://localhost:3000/user/update/${userId}`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export async function updateUserLessonsAndCursus(userId, items) {
  const token = localStorage.getItem("token");
  try {
    // Récupérer les leçons et cursus séparément
    const newLessons = items
      .filter((item) => item.type === "lesson")
      .map((item) => ({
        id: item.id,
        data: item.data, // Remplacez par le vrai titre si disponible
        isCompleted: false, // Définir un état par défaut ou selon votre logique
      }));

    const newCursus = items
      .filter((item) => item.type === "cursus")
      .map((item) => ({
        id: item.id,
        data: item.data, // Remplacez par le vrai titre si disponible
        isCompleted: false, // Définir un état par défaut ou selon votre logique
        lessons: item.data.lessons, // Ajoutez les leçons associées si nécessaire
      }));

    const userResponse = await axios.get(`http://localhost:3000/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const existingLessons = userResponse.data.lessons || [];
    const existingCursus = userResponse.data.cursus || [];

    // Fusionner les anciennes et nouvelles données
    const updatedLessons = [...existingLessons, ...newLessons];
    const updatedCursus = [...existingCursus, ...newCursus];

    // Requête API pour mettre à jour l'utilisateur
    const response = await axios.patch(
      `http://localhost:3000/user/update/${userId}`,
      {
        lessons: updatedLessons,
        cursus: updatedCursus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Retourne l'utilisateur mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour des données utilisateur :", error);
    throw error;
  }
}

export async function markLessonAsCompleted(lessonId) {
  const token = localStorage.getItem("token");
  console.log(lessonId)
  try {
    const response = await axios.patch(`http://localhost:3000/user/lessons/${lessonId}/complete`
      ,{},
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la leçon :", error);
    throw error;
  }
}

// Fonction pour supprimer un compte utilisateur
export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`http://localhost:3000/user/delete/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response; // Retourne la réponse après la suppression du compte
};
