import axiosInstance from './axios'; // Importation du service Axios

// Fonction pour récupérer les informations de l'utilisateur
export const getUserInfo = async () => {

    const response = await axiosInstance.get('/users');
    return response; // Retourne les informations de l'utilisateur

};

// Fonction pour s'inscrire
export const registerUser = async (userData) => {

    const response = await axiosInstance.post('/auth/register', userData);
    return response; // Retourne la réponse de l'inscription

};

// Fonction pour se connecter
export const loginUser = async (email, password) => {

    const response = await axiosInstance.post('/api/user/authenticate', { email, password });
    return response; // Retourne la réponse de la connexion
    

};

// Fonction pour mettre à jour les informations utilisateur
export const updateUserInfo = async (userData) => {

    const response = await axiosInstance.put('/user', userData);
    return response; // Retourne la réponse après la mise à jour des informations

};

// Fonction pour supprimer un compte utilisateur
export const deleteUser = async () => {

    const response = await axiosInstance.delete('/user');
    return response; // Retourne la réponse après la suppression du compte

};


