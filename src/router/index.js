import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "@/views/DashboardLayout.vue";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import Login from "@/views/Login.vue";
import SignIn from "@/views/SignIn.vue";
import Users from "@/views/Users.vue";
import Products from "@/views/Products.vue";
import Categories from "@/views/Categories.vue";
import Tables from "@/views/Tables.vue";
import CustomerMenu from "@/views/CustomerMenu.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/login", component: Login },
  { path: "/signin", component: SignIn },

  {
    path: "/dashboard",
    component: DashboardLayout,
    meta: { requiresAuth: true }, // <-- agregado
    children: [
      { path: "users", component: Users },
      { path: "products", component: Products },
      { path: "categories", component: Categories },
      { path: "tables", component: Tables },
    ],
  },

  { path: "/menu", component: CustomerMenu },
  { path: "/:catchAll(.*)", redirect: "/home" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global para rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const role = localStorage.getItem("role");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.path.startsWith("/dashboard") && role !== "Administrador") {
    next("/menu");
  } else if (to.path === "/menu" && role !== "Cliente") {
    next("/dashboard");
  } else {
    next();
  }
});


export default router;
