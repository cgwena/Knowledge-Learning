import apiService from './axios'; // Importation du service Axios

// Fonction pour récupérer les informations de l'utilisateur
export const getUserInfo = async () => {

    const response = await apiService.get('/users');
    return response; // Retourne les informations de l'utilisateur

};

// Fonction pour s'inscrire
export const registerUser = async (userData) => {

    const response = await apiService.post('/auth/register', userData);
    return response; // Retourne la réponse de l'inscription

};

// Fonction pour se connecter
export const loginUser = async (email, password) => {

    const response = await apiService.post('/users/authenticate', { email, password });
    return response; // Retourne la réponse de la connexion

};

// Fonction pour mettre à jour les informations utilisateur
export const updateUserInfo = async (userData) => {

    const response = await apiService.put('/user', userData);
    return response; // Retourne la réponse après la mise à jour des informations

};

// Fonction pour supprimer un compte utilisateur
export const deleteUser = async () => {

    const response = await apiService.delete('/user');
    return response; // Retourne la réponse après la suppression du compte

};


