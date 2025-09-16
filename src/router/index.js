import AboutView from "@/views/General/AboutView.vue";
import HomeView from "@/views/General/HomeView.vue";
import SignIn from "@/views/General/SignIn.vue";
import Categories from "@/views/Products/Categories.vue";
import Products from "@/views/Products/Products.vue";
import Tables from "@/views/Tables/Tables.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { redirect: "", component: HomeView },
  { path: "/home", name: "Home", component: HomeView },
  { path: "/about", name: "About", component: AboutView },
  { path: "/signin", name: "Signin", component: SignIn },
  { path: "/dashboard-products", name: "Products", component: Products },
  { path: "/dashboard-categories", name: "Categories", component: Categories },
  { path: "/dashboard-tables", name: "Tables", component: Tables },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
