import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Assurez-vous d'importer correctement le store
import router from './router'; // Votre configuration de routes
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);

app.use(store); // Utilisation de Vuex
app.use(router); // Utilisation de Vue Router
app.use(Vue3Toastify, {
    autoClose: 3000, // Durée de la notification en millisecondes
    position: "bottom-right", // Position du toaster
  });

app.mount('#app');