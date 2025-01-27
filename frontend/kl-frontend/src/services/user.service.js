import axios from "axios";

export const getUsers = async() => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:3000/users/`, {
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
  const response = await axios.get(`http://localhost:3000/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// Fonction pour s'inscrire
export const registerUser = async (userData) => {
  const response = await axios.post("http://localhost:3000/user/add", userData);
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
  console.log('token', token)
  try {
    const response = await axios.post("http://localhost:3000/users/add", userData, {
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
export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`http://localhost:3000/users/delete/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response; // Retourne la réponse après la suppression du compte
};
