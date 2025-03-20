import axios from "axios";
import store from "@/store";

let csrfToken = null;

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json", 
  },
  withCredentials: true,
});

// Get CSRF token and add it to the headers
const getCsrfToken = async () => {
  try {
    const response = await axiosInstance.get("/csrf-token");
    csrfToken = response.data.csrfToken;

    if (csrfToken) {
      localStorage.setItem("csrfToken", csrfToken);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du token CSRF :", error);
  }
};

getCsrfToken();

axiosInstance.interceptors.request.use(
  async (config) => {
    const csrfToken = document.cookie
    .split("; ")
    .find(row => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
  }

    const token = store.getters["auth/authToken"];
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("Erreur API :", error.response || error);
    return Promise.reject(error);
  }
);

const get = async (url, params = {}) => axiosInstance.get(url, { params });
const post = async (url, data) => axiosInstance.post(url, data);
const put = async (url, data) => axiosInstance.put(url, data);
const patch = async (url, data) => axiosInstance.patch(url, data);
const del = async (url) => axiosInstance.delete(url);

export default { get, post, put, patch, delete: del };
