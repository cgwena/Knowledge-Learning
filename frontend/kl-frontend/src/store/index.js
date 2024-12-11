import { createStore } from 'vuex';
import auth from './auth.module'; // Importez le module d'authentification

const store = createStore({
  modules: {
    auth, // Enregistrez le module dans votre store
  },
});

export default store;
