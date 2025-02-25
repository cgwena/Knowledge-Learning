import axiosInstance from "../services/axios";

const state = {
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  isAdmin: (state) => state.user?.role === "admin",
  getUser: (state) => state.user,
  userLessons: (state) => state.user?.lessons || [],
  authToken: (state) => state.token,
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem("token", token);
  },
  SET_USER(state, user) {
    state.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  },
  LOGOUT(state) {
    state.token = "";
    state.user = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  SET_USER_LESSONS(state, lessons) {
    if (state.user) {
      state.user.lessons = lessons;
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    try {
      const response = await axiosInstance.post("http://localhost:3000/users/authenticate", { email, password });
      if (response) {
        const token = response.token;
        const user = response.user;

        if (token) {
          commit("SET_TOKEN", token);
          commit("SET_USER", user);
        } else {
          console.error("Token non fourni par l'API.");
        }
      } else {
        console.error("Réponse de l'API invalide", response);
      }
      return response;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  },
  logout({ commit }) {
    commit("LOGOUT");
  },
  async fetchUserById({ commit }, userId) {
    try {
      const response = await axiosInstance.get(`http://localhost:3000/users/${userId}`);
      commit("SET_USER", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      throw error;
    }
  },
  async fetchUserLessons({ commit }) {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      if (!token || !userId) {
        throw new Error("Jeton ou ID utilisateur manquant.");
      }

      const response = await axiosInstance.get(`http://localhost:3000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.lessons) {
        const lessons = response.data.lessons;
        commit("SET_USER_LESSONS", lessons);
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
