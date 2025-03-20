import axiosInstance from "../services/axios";

export const getUsers = async() => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get(`http://localhost:3000/users/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

// Get user information
export const getUserInfo = async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  if (!token || !userId) {
    throw new Error("Jeton ou ID utilisateur manquant.");
  }

  const response = await axiosInstance.get(`http://localhost:3000/users/${userId}`);
  return response;
};

// Register a new user
export const registerUser = async (userData) => {
  const response = await axiosInstance.post("http://localhost:3000/users/register", userData);
  return response; // Retourne la réponse de l'inscription
};

export const confirmRegistration = async (token) => {
  const response = await axiosInstance.get(`http://localhost:3000/users/confirm/${token}`);
  return response.data;
};

// Login user
export const loginUser = async (email, password) => {
  const response = await axiosInstance.post("http://localhost:3000/users/authenticate", {
    email,
    password,
  });
  return response;
};

export const addUser = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.post("http://localhost:3000/users/add", userData, {
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

// Update user information
export const updateUserInfo = async (userId, userData) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.patch(
    `http://localhost:3000/users/update/${userId}`,
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
        data: item.data, 
        isCompleted: false, 
      }));

    const newCursus = items
      .filter((item) => item.type === "cursus")
      .map((item) => ({
        id: item.id,
        data: item.data, 
        isCompleted: false, 
        lessons: item.data.lessons, 
      }));

    const userResponse = await axiosInstance.get(`http://localhost:3000/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const existingLessons = userResponse.lessons || [];
    const existingCursus = userResponse.cursus || [];

    const updatedLessons = [...existingLessons, ...newLessons];
    const updatedCursus = [...existingCursus, ...newCursus];

    const response = await axiosInstance.patch(
      `http://localhost:3000/users/update/${userId}`,
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
    return response;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des données utilisateur :", error);
    throw error;
  }
}

// Mark a lesson as completed
export async function markLessonAsCompleted(lessonId) {
  const token = localStorage.getItem("token");
  console.log(lessonId)
  try {
    const response = await axiosInstance.patch(`http://localhost:3000/users/lessons/${lessonId}/complete`
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

// Delete a user
export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.del(`http://localhost:3000/users/delete/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
