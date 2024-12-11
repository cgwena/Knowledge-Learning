import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Assurez-vous d'importer correctement le store
import router from './router'; // Votre configuration de routes

const app = createApp(App);

app.use(store); // Utilisation de Vuex
app.use(router); // Utilisation de Vue Router
app.mount('#app');