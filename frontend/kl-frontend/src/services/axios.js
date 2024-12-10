import axios from 'axios';

// Créez une instance Axios avec une configuration de base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', 
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes (facultatif)
axiosInstance.interceptors.request.use(
  (config) => {
    // Par exemple, ajouter un token d'authentification
    const token = localStorage.getItem('token'); // Si vous stockez le token dans le localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses (facultatif)
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // Retourne directement les données de la réponse
  },
  (error) => {
    console.error('Erreur lors de la requête API:', error.response || error);
    return Promise.reject(error); // Vous pouvez aussi gérer l'erreur ici, par exemple, afficher un message
  }
);

// Fonction pour effectuer une requête GET
const get = async (url, params = {}) => {

    const response = await axiosInstance.get(url, { params });
    return response;

};

// Fonction pour effectuer une requête POST
const post = async (url, data) => {

    const response = await axiosInstance.post(url, data);
    return response;

};

// Fonction pour effectuer une requête PUT
const put = async (url, data) => {

    const response = await axiosInstance.put(url, data);
    return response;

};

// Fonction pour effectuer une requête DELETE
const del = async (url) => {

    const response = await axiosInstance.delete(url);
    return response;

};

export default {
  get,
  post,
  put,
  delete: del,
};
