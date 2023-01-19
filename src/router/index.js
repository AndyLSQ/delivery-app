import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/',
         name: 'home',
         component: HomeView,
      },
      {
         path: '/dashboard',
         name: 'dashboard',
         // route level code-splitting
         // this generates a separate chunk (Dashboard.[hash].js) for this route
         // which is lazy-loaded when the route is visited.
         component: () => import('../views/DashboardView.vue'),
      },
      {
         path: '/restaurants',
         name: 'restaurants',
         component: () => import('../views/RestaurantsView.vue'),
      },
      {
         path: '/form',
         name: 'form',
         component: () => import('../views/FormView.vue'),
      },
      {
         path: '/restaurant/:slug',
         name: 'restaurant',
         component: () => import('../views/RestaurantView.vue'),
      },
   ],
});

export default router;
