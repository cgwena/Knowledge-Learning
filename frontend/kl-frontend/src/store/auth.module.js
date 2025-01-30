import axios from "axios";

const state = {
  token: localStorage.getItem("token") || "", // Récupérer le token de localStorage si existant
  user: JSON.parse(localStorage.getItem("user")) || null, 
};

const getters = {
  isAuthenticated: (state) => !!state.token, // Vérifie si l'utilisateur est authentifié
  isAdmin: (state) => {
    return state.user?.role === "admin";
  },
  getUser: (state) => state.user, // Récupère l'utilisateur
  userLessons: (state) => state.user?.lessons || [],
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER(state, user) {
    state.user = user;
    localStorage.setItem("user", JSON.stringify(user)); // Stockage direct en mutation
  },
  
  LOGOUT(state) {
    state.token = "";
    state.user = null;
  },
  SET_USER_LESSONS(state, lessons) {
    if (state.user) {
      state.user.lessons = lessons;
    }
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/authenticate",
        { email, password }
      );
      if (response && response.data) {
        const token = response.data.token;
        const user = response.data.user;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          commit("SET_TOKEN", token);
          commit("SET_USER", user);

          // Vérifier que le token est stocké
          const storedToken = localStorage.getItem("token");
          if (storedToken) {
            console.log(
              "Vérification réussie : Token trouvé dans localStorage !"
            );
          } else {
            console.error(
              "Vérification échouée : Aucun token trouvé dans localStorage."
            );
          }
        } else {
          console.error("Token non fourni par l'API.");
        }
      } else {
        console.error("Réponse de l'API invalide", response);
      }
      return response;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      // Vous pouvez gérer les erreurs spécifiques comme les erreurs de réseau ou d'authentification ici
    }
  },
  logout({ commit }) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartTotal");
    commit("LOGOUT");
  },
  async fetchUserById({ commit }, userId) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:3000/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      commit("SET_USER", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      throw error;
    }
  },
  async fetchUserLessons({ commit }) {
    try {
      // Récupération du jeton d'authentification et de l'ID utilisateur
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      if (!token || !userId) {
        throw new Error("Jeton ou ID utilisateur manquant.");
      }

      // Requête pour récupérer les leçons
      const response = await axios.get(
        `http://localhost:3000/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Vérification de la réponse
      if (response.data && response.data.lessons) {
        const lessons = response.data.lessons;
        commit("SET_USER_LESSONS", lessons); // Assurez-vous que les leçons sont bien envoyées au store
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des leçons :", error);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
