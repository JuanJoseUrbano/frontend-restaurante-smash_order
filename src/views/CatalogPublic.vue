<template>
  <PublicHeader />
  <div class="catalogo-publico-container">
    <!-- HEADER -->
    <div class="catalogo-header text-center shadow-sm">
      <h1 class="catalogo-title">Nuestro Menú</h1>
      <p class="catalogo-subtitle">Descubre los productos disponibles</p>
    </div>

    <!-- FILTROS -->
    <div class="catalogo-filtros card p-3 mb-4 shadow-sm">
      <div class="row g-2 align-items-center flex-wrap">
        <!-- Buscar por nombre -->
        <div class="col-md-5">
          <div class="input-group">
            <input
              type="text"
              class="form-control search-input"
              v-model="filtro"
              placeholder="Buscar por nombre..."
            />
            <button @click="filtrarBusqueda" class="btn btn-buscar">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Categorías -->
        <div class="col-md-3">
          <select
            class="form-select"
            v-model="filtroCategoria"
            @change="filtrarPorCategoria"
          >
            <option value="0">Todas las categorías</option>
            <option v-for="c in categorias" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>

        <!-- Precio mínimo y máximo -->
        <div class="col-md-3 d-flex gap-2">
          <input
            type="number"
            class="form-control input-precio"
            placeholder="Mín"
            v-model="precioMin"
            min="0"
          />
          <input
            type="number"
            class="form-control input-precio"
            placeholder="Máx"
            v-model="precioMax"
            min="0"
          />
        </div>

        <!-- Botones -->
        <div class="col-md-1 text-md-end">
          <button @click="filtrarPorPrecio" class="btn btn-success w-100">
            Filtrar
          </button>
        </div>
      </div>
    </div>

    <!-- LISTA DE PRODUCTOS -->
    <div v-if="cargando" class="loading-spinner text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando productos...</p>
    </div>

    <div v-else-if="productos.length === 0" class="empty-state text-center">
      <i class="fas fa-box-open empty-icon"></i>
      <h4>No hay productos disponibles</h4>
      <p>Intenta más tarde o ajusta los filtros</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="p in productos" :key="p.id" class="col">
        <div class="card producto-card h-100 shadow-sm">
          <!-- Imagen del producto -->
          <div class="imagen-container">
            <img
              v-if="p.imageUrl"
              :src="p.imageUrl"
              alt="Imagen del producto"
              class="card-img-top producto-img"
            />
            <div v-else class="sin-imagen d-flex align-items-center justify-content-center">
              <i class="fas fa-image fa-3x text-muted"></i>
            </div>
          </div>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark">{{ p.name }}</h5>
            <p class="card-text descripcion-texto">{{ p.description }}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
              <span class="precio-texto">${{ p.price }}</span>
              <span class="categoria-badge">
                {{ p.category?.name || "Sin Categoría" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta } from "@/functions.js";
import PublicHeader from "@/components/PublicHeader.vue";
import {
  getProducts,
  searchProducts,
  filterByCategory,
  filterByPrice,
} from "@/services/products";
import { getCategories } from "@/services/categories";

export default {
  name: "CatalogoPublico",
  components: {
    PublicHeader,
  },
  data() {
    return {
      productos: [],
      categorias: [],
      cargando: false,
      filtro: "",
      filtroCategoria: 0,
      precioMin: "",
      precioMax: "",
    };
  },
  mounted() {
    this.obtenerProductos();
    this.obtenerCategorias();
  },
  methods: {
    async obtenerProductos() {
      this.cargando = true;
      try {
        this.productos = await getProducts();
      } catch {
        mostrarAlerta("Error al cargar los productos", "danger");
      } finally {
        this.cargando = false;
      }
    },
    async obtenerCategorias() {
      try {
        this.categorias = await getCategories();
      } catch {
        mostrarAlerta("Error al cargar las categorías", "danger");
      }
    },
    async filtrarBusqueda() {
      if (!this.filtro.trim()) return this.obtenerProductos();
      try {
        this.productos = await searchProducts(this.filtro);
      } catch {
        mostrarAlerta("Error en la búsqueda", "danger");
      }
    },
    async filtrarPorCategoria() {
      if (this.filtroCategoria == 0) return this.obtenerProductos();
      try {
        this.productos = await filterByCategory(this.filtroCategoria);
      } catch {
        mostrarAlerta("Error al filtrar por categoría", "danger");
      }
    },
    async filtrarPorPrecio() {
      try {
        this.productos = await filterByPrice(this.precioMin, this.precioMax);
      } catch {
        mostrarAlerta("Error al filtrar por precio", "danger");
      }
    },
  },
};
</script>

<style scoped>
.catalogo-publico-container {
  padding: 2rem;
  background: #f8f9fa;
}

/* HEADER */
.catalogo-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}
.catalogo-title {
  color: #580e00;
  font-weight: 700;
  font-size: 2.4rem;
}
.catalogo-subtitle {
  color: #6c757d;
  font-size: 1.2rem;
}

/* FILTROS */
.catalogo-filtros {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* PRODUCTOS */
.producto-card {
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fff;
}
.producto-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(88, 14, 0, 0.15);
}

.producto-img {
  height: 220px;
  width: 100%;
  object-fit: cover;
}

.card-body {
  padding: 1.2rem 1.5rem;
}

.descripcion-texto {
  font-size: 1rem;
  color: #5a5a5a;
  margin-top: 0.5rem;
  flex-grow: 1;
  white-space: pre-wrap;
}

.precio-texto {
  font-size: 1.2rem;
  font-weight: bold;
  color: #28a745;
}

.categoria-badge {
  background: #580e00;
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
}

/* BOTÓN DE BÚSQUEDA */
.btn-buscar {
  background-color: #580e00;
  color: white;
  transition: 0.3s;
}
.btn-buscar:hover {
  background-color: #71160a;
}

/* ESTADOS */
.loading-spinner {
  margin-top: 2rem;
}
.empty-icon {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.btn-outline-primary {
  border-radius: 12px;
  font-weight: 600;
}
</style>
