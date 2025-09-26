<template>
  <HeaderAuthenticatedCustomer :usuario="usuario" />

  <div class="text-end mt-3 me-3" v-if="roles.length > 1">
    <button class="btn btn-outline-dark btn-sm" @click="cambiarRol">
      <i class="fas fa-exchange-alt me-1"></i> Cambiar Rol
    </button>
  </div>

  <div class="catalogo-container">

    <div class="catalogo-header shadow-sm text-center">
      <h1 class="catalogo-title">Menú Disponible</h1>
      <p class="catalogo-subtitle">Explora nuestra variedad de productos</p>
    </div>

    <div class="catalogo-filtros card p-3 mb-4 shadow-sm">
      <div class="row g-3 align-items-center">
        <div class="col-md">
          <div class="input-group">
            <input type="text" class="form-control search-input" v-model="filtro" placeholder="Buscar por nombre..." />
            <button @click="filtrarBusqueda" class="btn btn-primary">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div class="col-md-auto">
          <select class="form-select" v-model="filtroCategoria" @change="filtrarPorCategoria">
            <option value="0">Todas las categorías</option>
            <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="col-md-auto">
          <div class="input-group price-filter">
            <input type="number" class="form-control input-precio" placeholder="Mín" v-model="precioMin" min="0" />
            <input type="number" class="form-control input-precio" placeholder="Máx" v-model="precioMax" min="0" />
            <button @click="filtrarPorPrecio" class="btn btn-success btn-precio">Filtrar</button>
          </div>
        </div>

        <div class="col-md-auto">
          <button class="btn btn-outline-secondary" @click="limpiarFiltros">
            <i class="fas fa-eraser me-1"></i> Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- CATÁLOGO -->
    <div v-if="cargando" class="loading-spinner text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando Productos...</p>
    </div>

    <div v-else-if="productos.length === 0" class="empty-state text-center">
      <i class="fas fa-box-open empty-icon"></i>
      <h4>No hay productos disponibles</h4>
      <p>Vuelve más tarde</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="p in productos" :key="p.id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ p.name }}</h5>
            <p class="card-text text-truncate">{{ p.description }}</p>

            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="badge bg-success fs-6">${{ p.price }}</span>
              <span class="badge bg-secondary">{{ p.category?.name || 'Sin Categoría' }}</span>
            </div>

            <button class="btn btn-agregar mt-3 w-100" @click="agregarAlCarrito(p)">
              <i class="fas fa-cart-plus me-1"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Carrito de compras flotante -->
    <div class="carrito-flotante card shadow-sm" v-if="carrito.length > 0">
      <div class="card-body">
        <h5 class="mb-3"><i class="fas fa-shopping-cart me-2"></i> Tu Carrito</h5>

        <ul class="list-group mb-3">
          <li v-for="item in carrito" :key="item.id"
              class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ item.name }}</strong> <br />
              <small class="text-muted">${{ item.price }} x {{ item.cantidad }}</small>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-2"
                      @click="cambiarCantidad(item, -1)">-</button>
              <button class="btn btn-sm btn-outline-secondary me-2"
                      @click="cambiarCantidad(item, 1)">+</button>
              <button class="btn btn-sm btn-outline-danger" @click="eliminarDelCarrito(item)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </li>
        </ul>

        <h5 class="text-end">Total: <span class="text-success">${{ totalCarrito }}</span></h5>

        <button class="btn btn-success w-100 mt-3" @click="confirmarPedido">
          <i class="fas fa-check me-1"></i> Confirmar Pedido
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mostrarAlerta } from "@/functions.js";
import { getProducts, searchProducts, filterByCategory, filterByPrice } from "@/services/products";
import { getCategories } from "@/services/categories";
import HeaderAuthenticatedCustomer from "@/components/HeaderAuthenticatedCustomer.vue";

export default {
  name: "CatalogoProductos",
  components: { HeaderAuthenticatedCustomer },
  data() {
    return {
      usuario: JSON.parse(localStorage.getItem("user")) || {}, // 🔹 Aquí guardamos al usuario completo
      productos: [],
      categorias: [],
      cargando: false,
      filtro: "",
      filtroCategoria: 0,
      precioMin: 0,
      precioMax: 0,
      carrito: [],
      roles: JSON.parse(localStorage.getItem("roles")) || [],
    };
  },
  computed: {
    totalCarrito() {
      return this.carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);
    },
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
      } catch (error) {
        mostrarAlerta("Error al cargar los productos", "danger");
      } finally {
        this.cargando = false;
      }
    },
    async obtenerCategorias() {
      try {
        this.categorias = await getCategories();
      } catch (error) {
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
    limpiarFiltros() {
      this.filtro = "";
      this.filtroCategoria = 0;
      this.precioMin = "";
      this.precioMax = "";
      this.obtenerProductos();
    },
    // Carrito
    agregarAlCarrito(producto) {
      const existe = this.carrito.find((p) => p.id === producto.id);
      if (existe) {
        existe.cantidad++;
      } else {
        this.carrito.push({ ...producto, cantidad: 1 });
      }
    },
    cambiarCantidad(item, delta) {
      item.cantidad += delta;
      if (item.cantidad <= 0) {
        this.eliminarDelCarrito(item);
      }
    },
    eliminarDelCarrito(item) {
      this.carrito = this.carrito.filter((p) => p.id !== item.id);
    },
    confirmarPedido() {
      if (this.carrito.length === 0) return;

      const listaProductos = this.carrito
        .map(item => `${item.name} x${item.cantidad} - $${item.price * item.cantidad}`)
        .join('\n');

      const total = this.totalCarrito;

      mostrarAlerta(
        `Pedido confirmado con éxito 🎉\n\nProductos:\n${listaProductos}\n\nTotal: $${total}`,
        "success"
      );

      this.carrito = [];
    },
    cambiarRol() {
      localStorage.removeItem("activeRole");
      this.$router.push("/select-role");
    },
  },
};
</script>

<style>
.catalogo-container {
  padding: 2rem;
}

.catalogo-header {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.catalogo-title {
  color: var(--primary-color);
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.catalogo-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

/* Filtros */
.catalogo-filtros {
  border-radius: 16px;
  background: #fff;
}

.search-input {
  border-radius: 8px 0 0 8px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(88, 14, 0, 0.1);
}

.price-filter .input-precio {
  max-width: 90px;
  text-align: center;
}

.btn-agregar {
  background: #580e00;
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
}
.btn-agregar:hover {
  background: #7a2c1a;
  color: white;
}

.btn-precio {
  white-space: nowrap;
}

/* Spinner */
.loading-spinner {
  padding: 3rem;
  color: var(--text-light);
}

/* Estado vacío */
.empty-state {
  padding: 3rem;
  color: var(--text-light);
}

.empty-icon {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.empty-state h4 {
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

/* Cards */
.card {
  border-radius: 16px;
  border: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(88, 14, 0, 0.2);
}

.card-title {
  font-weight: 700;
  color: #580E00;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: black;
  min-height: 40px; /* asegura altura uniforme */
}

.badge {
  border-radius: 12px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

/* Carrito flotante */
.carrito-flotante {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 16px;
  z-index: 1050;
  transition: transform 0.3s ease;
}

.carrito-flotante:hover {
  transform: translateY(-5px);
}

/* Responsivo */
@media (max-width: 576px) {
  .carrito-flotante {
    width: 90%;
    right: 5%;
  }

  .catalogo-container {
    padding: 1rem;
  }

  .catalogo-filtros .row {
    flex-direction: column;
    gap: 1rem;
  }

  .catalogo-filtros .col-md-auto {
    width: 100%;
  }

  .catalogo-filtros .input-group,
  .catalogo-filtros select {
    width: 100%;
  }

  .badge {
    display: inline-block;
    margin-top: 0.5rem;
  }
}
</style>
