import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RestaurantsView from '../views/RestaurantsView.vue';
import RestaurantView from '../views/RestaurantView.vue';
import FormView from '../views/FormView.vue';
import CartView from '../views/CartView.vue';
import AccountView from '../views/AccountView.vue';
import ProfileView from '../views/ProfileView.vue';
import AddressView from '../views/AddressView.vue';
import BillingView from '../views/BillingView.vue';
import FavoritesView from '../views/FavoritesView.vue';
import SignOutView from '../views/SignOutView.vue';
import NotFoundView from '../views/NotFoundView.vue';
// import DishView from '../views/DishView.vue';
import WelcomeView from '../views/WelcomeView.vue';
import { useCurrentUser, getCurrentUser } from 'vuefire';

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/',
         name: 'home',
         component: RestaurantsView,
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
         path: '/welcome',
         name: 'welcome',
         component: WelcomeView,
      },
      {
         path: '/account',
         name: 'account',
         component: AccountView,
         meta: { requiresAuth: true },
         children: [
            {
               path: '/account/',
               name: 'profile',
               component: ProfileView,
            },
            {
               path: '/account/billing',
               name: 'billing',
               component: BillingView,
            },
            {
               path: '/account/address',
               name: 'address',
               component: AddressView,
            },
            {
               path: '/account/favorites',
               name: 'favorites',
               component: FavoritesView,
            },
         ],
      },
      {
         path: '/signout',
         name: 'signout',
         component: SignOutView,
      },
      {
         path: '/:pathMatch(.*)*',
         name: 'NotFound',
         component: NotFoundView,
      },
      // {
      //    path: '/dish',
      //    name: 'dish',
      //    component: DishView,
      // },
      // {
      //    path: '/sign-in',
      //    name: 'sign-in',
      //    component: DishView,
      // },
   ],
});

router.beforeEach(async (to) => {
   // routes with `meta: { requiresAuth: true }` will check for the users, others won't
   if (to.meta.requiresAuth) {
      const currentUser = await getCurrentUser();
      console.log('run router.beforeEach. user: ', getCurrentUser());
      // if the user is not logged in, redirect to the welcome page
      if (!currentUser) {
         return {
            path: '/welcome',
            query: {
               // we keep the current path in the query so we can redirect to it after login
               // with `router.push(route.query.redirect || '/')`
               redirect: to.fullPath,
            },
         };
      }
   }
});

export default router;
