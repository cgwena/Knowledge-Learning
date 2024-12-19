export default {
  namespaced: true,
  state: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    cartTotal: localStorage.getItem("cartTotal"),
  },
  mutations: {
    ADD_TO_CART(state, item) {
      state.cartItems.push(item);
      state.cartTotal += item.price;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Sauvegarde dans localStorage
      localStorage.setItem("cartTotal", state.cartTotal);
    },
    REMOVE_FROM_CART(state, item) {
      const index = state.cartItems.findIndex(
        (cartItem) => cartItem._id === item._id
      );
      if (index !== -1) {
        state.cartItems.splice(index, 1);
        state.cartTotal -= item.price;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Sauvegarde après suppression
        localStorage.setItem("cartTotal", state.cartTotal);
      }
    },
  },
  actions: {
    addToCart({ commit }, item) {
      commit("ADD_TO_CART", item);
    },
    removeFromCart({ commit }, item) {
      commit("REMOVE_FROM_CART", item);
    },
  },
  getters: {
    cartItems: (state) => state.cartItems,
    cartTotal: (state) => state.cartTotal,
  },
};
