import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RestaurantsView from '../views/RestaurantsView.vue';
import RestaurantView from '../views/RestaurantView.vue';
import FormView from '../views/FormView.vue';
import CartView from '../views/CartView.vue';
import AccountView from '../views/AccountView.vue';

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
         component: RestaurantsView,
      },
      {
         path: '/restaurant/:slug',
         name: 'restaurant',
         component: RestaurantView,
      },
      // {
      //    path: '/restaurant/:slug/:menuItemSlug',
      //    name: 'restaurant',
      //    component: RestaurantView,
      // },
      {
         path: '/form',
         name: 'form',
         component: FormView,
      },
      {
         path: '/cart',
         name: 'cart',
         component: CartView,
      },
      {
         path: '/account',
         name: 'account',
         component: AccountView,
      },
   ],
});

export default router;
