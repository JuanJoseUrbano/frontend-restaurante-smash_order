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
            <input type="text" class="form-control search-input" v-model="filtro" placeholder="Buscar por nombre..." />
            <button @click="filtrarBusqueda" class="btn btn-buscar">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Categorías -->
        <div class="col-md-3">
          <select class="form-select" v-model="filtroCategoria" @change="filtrarPorCategoria">
            <option value="0">Todas las categorías</option>
            <option v-for="c in categorias" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>

        <!-- Precio mínimo y máximo -->
        <div class="col-md-3 d-flex gap-2">
          <input type="number" class="form-control input-precio" placeholder="Mín" v-model="precioMin" min="0" />
          <input type="number" class="form-control input-precio" placeholder="Máx" v-model="precioMax" min="0" />
        </div>

        <!-- Botones -->
        <div class="col-md-1 d-flex flex-column gap-2">
          <button @click="filtrarPorPrecio" class="btn btn-success w-100">
            Filtrar
          </button>
          <button @click="limpiarFiltros" class="btn btn-secondary w-100">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- SPINNER DE CARGA -->
    <div v-if="cargando" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- LISTA DE PRODUCTOS -->
    <div v-else-if="productos.length === 0" class="empty-state text-center">
      <i class="fas fa-box-open empty-icon"></i>
      <h4>No hay productos disponibles</h4>
      <p>Intenta más tarde o ajusta los filtros</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="p in productos" :key="p.id" class="col">
        <div class="card producto-card h-100 shadow-sm">
          <div class="imagen-container">
            <img v-if="p.image" :src="p.image" alt="Imagen del producto" class="card-img-top producto-img" />
            <div v-else class="sin-imagen d-flex align-items-center justify-content-center">
              <i class="fas fa-image fa-3x text-muted"></i>
            </div>
          </div>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark">{{ p.name }}</h5>
            <p class="card-text descripcion-texto">{{ p.description }}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
              <span class="precio-texto">{{ formatearPrecio(p.price) }}</span>
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
import { mostrarAlerta,validarRangoDePrecio } from "@/functions.js";
import PublicHeader from "@/components/PublicHeader.vue";
import {
  getProducts,
  searchProductsByName,
  getProductsByCategory,
  filterProductsByPrice,
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
        this.productos = await searchProductsByName(this.filtro);
      } catch {
        mostrarAlerta("Error en la búsqueda", "danger");
      }
    },
    async filtrarPorCategoria() {
      if (this.filtroCategoria == 0) return this.obtenerProductos();
      try {
        this.productos = await getProductsByCategory(this.filtroCategoria);
      } catch {
        mostrarAlerta("Error al filtrar por categoría", "danger");
      }
    },
    async filtrarPorPrecio() {
  if (!validarRangoDePrecio(this.precioMin, this.precioMax)) return;

  try {
    this.productos = await filterProductsByPrice(this.precioMin, this.precioMax);
  } catch {
    mostrarAlerta("Error", "error", "Error al filtrar por precio");
  }
},
    limpiarFiltros() {
      this.filtro = "";
      this.filtroCategoria = 0;
      this.precioMin = "";
      this.precioMax = "";
      this.obtenerProductos();
    },
    formatearPrecio(valor) {
      if (!valor) return "$0";
      return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
    },
  },
};
</script>


<style scoped>
.catalogo-publico-container {
  padding: 2rem;
  background: #f8f9fa;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Spinner circular elegante */
.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(108, 27, 0, 0.2);
  border-top: 3px solid #6c1b00;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

/* Animación suave */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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
  object-fit: contain;
  background-color: #f8f9fa;
  padding: 8px;
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

/* ESTADO VACÍO */
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
