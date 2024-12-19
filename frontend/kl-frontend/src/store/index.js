import { createStore } from 'vuex';
import auth from './auth.module'; // Importez le module d'authentification
import cart from './cart.module'

const store = createStore({
  modules: {
    auth,
    cart,
  },
});

export default store;
