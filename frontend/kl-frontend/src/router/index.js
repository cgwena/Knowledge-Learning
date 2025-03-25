// src/router.js

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
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/confirm/",
    name: "Confirm",
    component: Confirm,
  },
  {
    path: '/themes',
    name: 'ThemesPage',
    component: Themes,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashBoard, 
    // meta: {
    //   requiresAuth: true,
    // },
  },
  {
    path: '/certifications',
    name: 'Certifications',
    component: Certifications, 
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
  },
  {
    path: "/payment/:orderId",
    name: "orderRecap",
    component: OrderRecap,
  },
  {
    path: "/lesson/:id",
    name: "LessonDetails",
    component: LessonDetails,
    props: true,
  },
  {
    path: "/cancel",
    name: "StripeCancel",
    component: StripeCancel,
  },
  {
    path: "/success",
    name: "StripeSuccess",
    component: StripeSuccess,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    // beforeEnter: (to, from, next) => {
    //   if (store.getters.isAdmin) {
    //     next(); 
    //   } else {
    //     next({ name: 'Home' }); 
    //   }
    // },
  }
];

const router = createRouter({
  history: createWebHistory(), 
  routes,
});

router.beforeEach((to, from, next) => {
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
