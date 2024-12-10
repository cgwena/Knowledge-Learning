// src/router.js
import { createRouter, createWebHistory } from 'vue-router'; // Importation des fonctions nécessaires
import Home from './views/Home.vue'; // Importation des vues
//import Dashboard from './views/Dashboard.vue'; // Exemple d'autre vue
//import Login from './views/Login.vue'; // Exemple de vue de connexion
import NotFound from './views/NotFound.vue'; // Vue pour la page 404

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // Composant associé à la route d'accueil
  },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: Dashboard, // Composant associé à la route du tableau de bord
//     meta: { requiresAuth: true }, // Exemple de route protégée
//   },
//   {
//     path: '/login',
//     name: 'Login',
//     component: Login, // Composant associé à la route de connexion
//   },
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
  if (to.meta.requiresAuth && !localStorage.getItem('authToken')) {
    // Si la route nécessite une authentification et qu'il n'y a pas de token d'authentification
    next({ name: 'Login' }); // Rediriger vers la page de login
  } else {
    next(); // Permet de continuer la navigation
  }
});

export default router;
