import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Assurez-vous d'importer correctement le store
import router from './router'; // Votre configuration de routes
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: "bottom-right",
  });

app.mount('#app');