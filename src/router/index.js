import { createRouter, createWebHistory } from "vue-router";
import DashboardAdmin from "@/views/DashboardAdmin.vue";
import DashboardEmployee from "@/views/DashboardEmployee.vue";
import DashboardCustomer from "@/views/DashboardCustomer.vue";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import Login from "@/views/Login.vue";
import SignIn from "@/views/SignIn.vue";
import Users from "@/views/Users.vue";
import Products from "@/views/Products.vue";
import Categories from "@/views/Categories.vue";
import Tables from "@/views/Tables.vue";
import Orders from "@/views/Orders.vue";
import SelectRolePage from "@/views/SelectRolePage.vue";
import Menu from "@/views/Menu.vue";
import CustomerTables from "@/views/CustomerTables.vue";
import Reservation from "@/views/Reservation.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/login", component: Login },
  { path: "/signin", component: SignIn },

  { path: "/select-role", component: SelectRolePage },

  // Dashboard Admin
  {
    path: "/dashboard-admin",
    component: DashboardAdmin,
    meta: { requiresAuth: true, role: "ROLE_ADMIN" },
    children: [
      { path: "users", component: Users },
      { path: "products", component: Products },
      { path: "categories", component: Categories },
      { path: "tables", component: Tables },
      { path: "orders", component: Orders },
      {path: "reservations", component: Reservation}
    ],
  },

  // Dashboard Employee
  {
    path: "/dashboard-employee",
    component: DashboardEmployee,
    meta: { requiresAuth: true, role: "ROLE_EMPLOYEE" },
    children: [
      { path: "products", component: Products },
      { path: "tables", component: Tables },
      { path: "orders", component: Orders },
      {path: "reservations", component: Reservation}
    ],
  },

  {
    path: "/dashboard-customer",
    component: DashboardCustomer,
    meta: { requiresAuth: true, role: "ROLE_CUSTOMER" },
    children: [
      { path: "menu", component: Menu },   
      { path: "tables", component: CustomerTables }      
    ],
  },

  // Ruta catch-all
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
  } else if (to.meta.requiresAuth) {
    if (to.meta.role && activeRole !== to.meta.role) {
      // Si el rol no coincide, redirige según rol
      if (activeRole === "ROLE_ADMIN") next("/dashboard-admin");
      else if (activeRole === "ROLE_EMPLOYEE") next("/dashboard-employee");
      else if (activeRole === "ROLE_CUSTOMER") next("/dashboard-customer");
      else next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
