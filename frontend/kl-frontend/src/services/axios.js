import axios from "axios";
import store from '@/store'

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Vérifiez le token dans le store
    const token = store.getters['auth/authToken'];
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Ajoutez le token à la requête
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
    console.error("Erreur lors de la requête API:", error.response || error);
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
