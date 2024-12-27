import axios from "axios";
import axiosInstance from "./axios"; // Importation du service Axios

// Fonction pour récupérer les informations de l'utilisateur
export const getUserInfo = async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  if (!token || !userId) {
    throw new Error("Jeton ou ID utilisateur manquant.");
  }

  // Requête pour récupérer les leçons
  const response = await axios.get(`http://localhost:3000/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// Fonction pour s'inscrire
export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response; // Retourne la réponse de l'inscription
};

// Fonction pour se connecter
export const loginUser = async (email, password) => {
  const response = await axiosInstance.post("/api/user/authenticate", {
    email,
    password,
  });
  return response; // Retourne la réponse de la connexion
};

// Fonction pour mettre à jour les informations utilisateur
export const updateUserInfo = async (userId, userData) => {
  console.log("update appelée");
  console.log("userId", userId);
  console.log("userData", userData);
  const token = localStorage.getItem("token");
  const response = await axios.patch(
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

// Fonction pour supprimer un compte utilisateur
export const deleteUser = async () => {
  const response = await axiosInstance.delete("/user");
  return response; // Retourne la réponse après la suppression du compte
};
