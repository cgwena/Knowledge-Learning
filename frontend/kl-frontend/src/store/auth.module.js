import axiosInstance from "axios";

const state = {
  token: localStorage.getItem("authToken") || "", // Récupérer le token de localStorage si existant
  user: null, // Vous pouvez stocker les informations de l'utilisateur ici si nécessaire
};

const getters = {
  isAuthenticated: (state) => !!state.token, // Vérifie si l'utilisateur est authentifié
  getUser: (state) => state.user, // Récupère l'utilisateur
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  LOGOUT(state) {
    state.token = "";
    state.user = null;
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    const response = await axiosInstance.post("/api/users/authenticate", { email, password });
    
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token); // Sauvegarder le token dans localStorage
      commit("SET_TOKEN", response.data.token); // Mettre à jour l'état du token dans Vuex

      // Optionnel : récupérer les informations de l'utilisateur
      commit("SET_USER", response.data.user); // Vous pouvez ajuster cette ligne selon votre API

      return response;
    }
  },
  logout({ commit }) {
    localStorage.removeItem("authToken"); // Supprimer le token de localStorage
    commit("LOGOUT"); // Réinitialiser l'état de l'authentification dans Vuex
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
