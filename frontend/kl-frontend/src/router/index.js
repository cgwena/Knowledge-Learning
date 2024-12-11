// src/router.js

import { createRouter, createWebHistory } from 'vue-router'; // Importation des fonctions nécessaires
import store from '../store'; 
import Home from '@/views/Home.vue'; 
import DashBoard from '@/views/DashBoard.vue';
//import Login from './views/Login.vue';
import NotFound from '@/views/NotFound.vue'; 
import Themes from '@/views/Themes.vue';
import Login from '@/views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // Composant associé à la route d'accueil
  },
  {
    path: '/themes',
    name: 'ThemesPage',
    component: Themes, // Lien vers la page des thèmes
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashBoard, // Composant associé à la route du tableau de bord
    //meta: { requiresAuth: true }, // Exemple de route protégée
  },
  {
    path: '/login',
    name: 'Login',
    component: Login, // Composant associé à la route de connexion
  },
  {
    path: '/:catchAll(.*)', // Route pour toutes les autres pages non trouvées
    name: 'NotFound',
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHistory(), // Utilisation de l'historique du navigateur pour la gestion des URL
  routes, // Les routes définies plus haut
});

// Ajout d'un garde de navigation pour gérer les routes protégées
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.getters['auth.isAuthenticated']) {
      next({ name: 'Login' }); // Rediriger vers la page de login si l'utilisateur n'est pas authentifié
    } else {
      next(); // Permet de continuer la navigation
    }
  });

export default router;
