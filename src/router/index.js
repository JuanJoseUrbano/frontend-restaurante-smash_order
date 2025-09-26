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
import Orders from "@/views/Orders.vue"; // 👈 importar aquí
import CustomerMenu from "@/views/CustomerMenu.vue";
import SelectRolePage from "@/views/SelectRolePage.vue"; // 👈 importar aquí

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/login", component: Login },
  { path: "/signin", component: SignIn },

  // 👇 nueva ruta pública para elegir rol
  { path: "/select-role", component: SelectRolePage },

  {
    path: "/dashboard",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "users", component: Users },
      { path: "products", component: Products },
      { path: "categories", component: Categories },
      { path: "tables", component: Tables },
      { path: "orders", component: Orders }, // 👈 nueva ruta
    ],
  },

  { path: "/menu", component: CustomerMenu },
  { path: "/:catchAll(.*)", redirect: "/home" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const activeRole = localStorage.getItem("activeRole");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.path.startsWith("/dashboard") && activeRole !== "ROLE_ADMIN") {
    next("/menu");
  } else if (to.path === "/menu" && activeRole !== "ROLE_CUSTOMER") {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
