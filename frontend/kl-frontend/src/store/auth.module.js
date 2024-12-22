import axiosInstance from "axios";

const state = {
  token: localStorage.getItem("token") || "", // Récupérer le token de localStorage si existant
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
    try {
      const response = await axiosInstance.post("/api/user/authenticate", { email, password });

      if (response && response.data) {
        const token = response.data.token;
        const user = response.data.user;

        if (token) {
          localStorage.setItem("token", token);
          commit("SET_TOKEN", token);
          commit("SET_USER", user);
          console.log("Token stocké avec succès :", token);

          // Vérifier que le token est stocké
          const storedToken = localStorage.getItem("token");
          if (storedToken) {
            console.log("Vérification réussie : Token trouvé dans localStorage !");
          } else {
            console.error("Vérification échouée : Aucun token trouvé dans localStorage.");
          }
        } else {
          console.error("Token non fourni par l'API.");
        }
      } else {
        console.error("Réponse de l'API invalide", response);
      }
      return response
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      // Vous pouvez gérer les erreurs spécifiques comme les erreurs de réseau ou d'authentification ici
    }
  },
  logout({ commit }) {
    localStorage.removeItem("authToken"); 
    localStorage.removeItem("cartItems")
    localStorage.removeItem("cartTotal")
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
