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
import Payments from "@/views/Invoices.vue";
import ReservationHistory from "@/views/ReservationHistory.vue";
import Notifications from "@/views/Notifications.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/login", component: Login },
  { path: "/signin", component: SignIn },
  { path: "/select-role", component: SelectRolePage },

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
      { path: "reservations", component: Reservation },
      { path: "payments", component: Payments },
    ],
  },

  {
    path: "/dashboard-employee",
    component: DashboardEmployee,
    meta: { requiresAuth: true, role: "ROLE_EMPLOYEE" },
    children: [
      { path: "products", component: Products },
      { path: "tables", component: Tables },
      { path: "orders", component: Orders },
      { path: "reservations", component: Reservation },
      { path: "payments", component: Payments },
    ],
  },

  {
    path: "/dashboard-customer",
    component: DashboardCustomer,
    meta: { requiresAuth: true, role: "ROLE_CUSTOMER" },
    children: [
      { path: "menu", component: Menu },
      { path: "tables", component: CustomerTables },
      { path: "reservations", component: ReservationHistory},
      { path: "notifications", component: Notifications},
      
    ],
  },

  // Ruta por defecto
  { path: "/:catchAll(.*)", redirect: "/home" },
];

// ✅ Crear instancia del router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Middleware de autenticación y roles
router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/signin", "/home", "/about"];
  const authRequired = to.meta.requiresAuth;
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const activeRole = localStorage.getItem("activeRole");

  // 🔓 Si la ruta es pública, no se aplica control
  if (publicPages.includes(to.path)) {
    return next();
  }

  // 🚫 Si requiere autenticación y no hay sesión activa
  if (authRequired && !isAuthenticated) {
    return next("/login");
  }

  // 🧭 Si requiere rol específico
  if (authRequired && to.meta.role && activeRole !== to.meta.role) {
    if (activeRole === "ROLE_ADMIN") return next("/dashboard-admin");
    if (activeRole === "ROLE_EMPLOYEE") return next("/dashboard-employee");
    if (activeRole === "ROLE_CUSTOMER") return next("/dashboard-customer");
    return next("/login");
  }

  // ✅ Continuar navegación
  next();
});

export default router;
