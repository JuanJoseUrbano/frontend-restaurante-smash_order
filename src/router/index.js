import AboutView from "@/views/AboutView.vue";
import HomeView from "@/views/HomeView.vue";
import Login from "@/views/Login.vue";
import SignIn from "@/views/SignIn.vue";
import Categories from "@/views/Categories.vue";
import Products from "@/views/Products.vue";
import Tables from "@/views/Tables.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { redirect: "", component: HomeView },
  { path: "/home", name: "Home", component: HomeView },
  { path: "/about", name: "About", component: AboutView },
  { path: "/signin", name: "Signin", component: SignIn },
  { path: "/login", name: "LogIn", component: Login },
  { path: "/dashboard-products", name: "Products", component: Products },
  { path: "/dashboard-categories", name: "Categories", component: Categories },
  { path: "/dashboard-tables", name: "Tables", component: Tables },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
