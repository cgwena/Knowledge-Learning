import { createRouter, createWebHistory } from 'vue-router';
import store from '../store'; 
import Home from '@/views/Home.vue'; 
import DashBoard from '@/views/DashBoard.vue';
import NotFound from '@/views/NotFound.vue'; 
import Themes from '@/views/Themes.vue';
import Login from '@/views/Login.vue';
import Cart from '@/views/Cart.vue';
import OrderRecap from '@/views/Payment.vue'
import LessonDetails from '@/views/LessonDetails.vue'
import Register from '@/views/RegisterUser.vue'
import Confirm from '@/views/ConfirmUser.vue'
import AdminDashboard from '@/views/AdminDashboard.vue';
import Certifications from '@/views/UserCertifications.vue';
import StripeSuccess from '@/views/StripeSuccess.vue';
import StripeCancel from '@/views/StripeCancel.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Accueil - Knowledge Learning' }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { title: 'Inscription - Knowledge Learning' }
  },
  {
    path: "/confirm/",
    name: "Confirm",
    component: Confirm,
    meta: { title: 'Confirmation de compte - Knowledge Learning' }
  },
  {
    path: '/themes',
    name: 'ThemesPage',
    component: Themes,
    meta: { title: 'Nos Thèmes - Knowledge Learning' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashBoard, 
    meta: {
      requiresAuth: true,
      title: 'Mon tableau de bord - Knowledge Learning'
    },
  },
  {
    path: '/certifications',
    name: 'Certifications',
    component: Certifications, 
    meta: {
      requiresAuth: true,
      title: 'Mes certifications - Knowledge Learning'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Connexion - Knowledge Learning' }
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
    meta: {
      requiresAuth: true,
      title: 'Mon panier - Knowledge Learning'
    },
  },
  {
    path: "/payment/:orderId",
    name: "orderRecap",
    component: OrderRecap,
    meta: {
      requiresAuth: true,
      title: 'Paiement - Knowledge Learning'
    },
  },
  {
    path: "/lesson/:id",
    name: "LessonDetails",
    component: LessonDetails,
    props: true,
    meta: {
      requiresAuth: true,
      title: 'Détail de la leçon - Knowledge Learning'
    },
  },
  {
    path: "/cancel",
    name: "StripeCancel",
    component: StripeCancel,
    meta: { title: 'Paiement annulé - Knowledge Learning' }
  },
  {
    path: "/success",
    name: "StripeSuccess",
    component: StripeSuccess,
    meta: { title: 'Paiement réussi - Knowledge Learning' }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page non trouvée - Knowledge Learning' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: {
      title: 'Administration - Knowledge Learning'
    },
    beforeEnter: (to, from, next) => {
      // Check if the user is authenticated and has admin role      
      if (store.getters["auth/isAdmin"]) {
        next();
      } else {
        next({ name: 'Home' });
      }
    },
  }
];

const router = createRouter({
  history: createWebHistory(), 
  routes,
});

router.beforeEach((to, from, next) => {
  
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'Knowledge Learning';
  }

  if (to.meta.requiresAuth) {
    const user = store.state.user; 

    if (user && user.isActive) {
      next(); 
    } else {
      next({ name: "Login" }); 
    }
  } else {
    next();
  }
});

export default router;