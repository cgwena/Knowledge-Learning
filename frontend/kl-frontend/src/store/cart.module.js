export default {
  namespaced: true,
  state: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    cartTotal: parseFloat(localStorage.getItem("cartTotal")) || 0, // Convertir en nombre
  },
  mutations: {
    ADD_TO_CART(state, item) {
      state.cartItems.push(item);
      state.cartTotal += parseFloat(item.price); // Assurez-vous que le prix est un nombre
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("cartTotal", state.cartTotal.toFixed(2)); // Stockez une chaîne formatée
    },
    REMOVE_FROM_CART(state, item) {
      const index = state.cartItems.findIndex(
        (cartItem) => cartItem._id === item._id
      );
      if (index !== -1) {
        state.cartItems.splice(index, 1);
        state.cartTotal -= parseFloat(item.price); // Soustrayez le prix comme un nombre
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        localStorage.setItem("cartTotal", state.cartTotal.toFixed(2)); // Stockez une chaîne formatée
      }
    },
    CLEAR_CART(state) {
      state.cartItems = [];
      state.cartTotal = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartTotal");
    },
  },
  actions: {
    addToCart({ commit }, item) {
      console.log("addToCart appelée", item);
      commit("ADD_TO_CART", item);
    },
    removeFromCart({ commit }, item) {
      commit("REMOVE_FROM_CART", item);
    },
    clearCart({ commit }) {
      commit("CLEAR_CART");
    },
  },
  getters: {
    cartItems: (state) => state.cartItems,
    cartTotal: (state) => state.cartTotal.toFixed(2), // Retourne une chaîne formatée pour les affichages
  },
};
