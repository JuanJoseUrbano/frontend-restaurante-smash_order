import AboutView from '@/views/General/AboutView.vue'
import HomeView from '@/views/General/HomeView.vue'
import Categories from '@/views/Products/Categories.vue'
import Products from '@/views/Products/Products.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { redirect: '', component: HomeView },
  { path: '/home', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/dashboard-products', name: 'Products', component: Products },
  { path: '/dashboard-categories', name: 'Categories', component: Categories }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
