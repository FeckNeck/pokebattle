import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AccountView from "../views/AccountView.vue";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "homeview",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/pokedex",
    name: "pokedex",
    component: () =>
      import(/* webpackChunkName: "pokedex" */ "../views/PokedexView.vue"),
  },
  {
    path: "/pokedex/:id",
    name: "pokemonDetails",
    component: () =>
      import(
        /* webpackChunkName: "details" */ "@/components/PokemonDetails.vue"
      ),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/account",
    name: "account",
    component: AccountView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            window.scroll({
              top: savedPosition.top,
              left: 0,
              behavior: "smooth",
            })
          );
        }, 1000);
      });
    }
  },
});

router.beforeEach((to, from, next) => {
  if (!store.getters.isLoggedIn && to.meta.requiresAuth) {
    next("/login");
  } else if (store.getters.isLoggedIn && to.meta.requiresAuth == false) {
    next("/account");
  } else {
    next();
  }
});

export default router;
