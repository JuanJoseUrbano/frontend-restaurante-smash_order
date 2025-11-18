<template>
  <div class="catalogo-container">
    <!-- HEADER -->
    <div class="catalogo-header shadow-sm text-center">
      <h1 class="catalogo-title">Menú Disponible</h1>
      <p class="catalogo-subtitle">Explora nuestra variedad de productos</p>
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
        <div class="col-md-2 d-flex gap-2">
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
        <div class="col-md-2 text-md-end d-flex gap-2">
          <button @click="filtrarPorPrecio" class="btn btn-success">
            Filtrar
          </button>
          <button @click="limpiarFiltros" class="btn btn-outline-secondary">
            Limpiar
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
        <div class="card producto-card h-100 shadow-sm">
          <!-- Imagen del producto -->
          <div class="imagen-container">
            <img
              v-if="p.image"
              :src="p.image.startsWith('data:image') ? p.image : `data:image/png;base64,${p.image}`"
              alt="Imagen del producto"
              class="card-img-top producto-img"
            />
            <div
              v-else
              class="sin-imagen d-flex align-items-center justify-content-center"
            >
              <i class="fas fa-image fa-3x text-muted"></i>
            </div>
          </div>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ p.name }}</h5>
            <p class="card-text text-truncate">{{ p.description }}</p>

            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="badge bg-success fs-6">{{ formatearPrecio(p.price) }}</span>
              <span class="badge bg-secondary">{{ p.category?.name || "Sin Categoría" }}</span>
            </div>

            <button class="btn btn-agregar mt-3 w-100" @click="agregarAlCarrito(p)">
              <i class="fas fa-cart-plus me-1"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CARRITO FLOTANTE -->
    <div v-if="carrito.length > 0" class="carrito-flotante card shadow-sm">
      <div class="carrito-header d-flex justify-content-between align-items-center p-2">
        <h5 class="m-0"><i class="fas fa-shopping-cart me-2"></i> Tu Carrito</h5>
        <button class="btn btn-sm btn-toggle" @click="toggleCarrito">
          <i :class="mostrarCarrito ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
        </button>
      </div>

      <transition name="fade">
        <div v-show="mostrarCarrito" class="card-body">
          <ul class="list-group mb-3">
            <li
              v-for="item in carrito"
              :key="item.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{{ item.name }}</strong><br />
                <small class="text-muted">{{ formatearPrecio(item.price) }} x {{ item.cantidad }}</small>
              </div>
              <div>
                <button class="btn btn-sm btn-outline-secondary me-2" @click="cambiarCantidad(item, -1)">-</button>
                <button class="btn btn-sm btn-outline-secondary me-2" @click="cambiarCantidad(item, 1)">+</button>
                <button class="btn btn-sm btn-outline-danger" @click="eliminarDelCarrito(item)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </li>
          </ul>

          <div class="mb-3">
            <label class="form-label">Selecciona la mesa</label>
            <select class="form-select" v-model="mesaSeleccionada">
              <option value="">-- Selecciona una mesa --</option>
              <option v-for="m in mesas" :key="m.id" :value="m.id">Mesa {{ m.number }}</option>
            </select>
          </div>

          <h5 class="text-end">Total: <span class="text-success">{{ formatearPrecio(totalCarrito) }}</span></h5>

          <button class="btn btn-success w-100 mt-3" @click="abrirModalPago">
            <i class="fas fa-check me-1"></i> Confirmar Pedido
          </button>
        </div>
      </transition>
    </div>

    <!-- MODAL PAGO -->
    <div class="modal fade" :class="{ show: mostrarModalPago }" v-show="mostrarModalPago"
      style="background: rgba(0, 0, 0, 0.5); display: block;">
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title">Realizar Pago</h5>
            <button type="button" class="btn-close" @click="cerrarModalPago"></button>
          </div>
          <div class="modal-body">
            <p>Total a pagar: <strong>{{ formatearPrecio(totalCarrito) }}</strong></p>

            <label class="form-label">Método de pago</label>
            <select v-model="metodoPago" class="form-select">
              <option disabled value="">Seleccione un método</option>
              <option v-for="m in metodos" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarModalPago">Cancelar</button>
            <button class="btn btn-success" :disabled="!metodoPago" @click="crearOrdenYPagar">
              Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta } from "@/functions.js";
import { getProducts, searchProducts, filterByCategory, filterByPrice } from "@/services/products";
import { getCategories } from "@/services/categories";
import { getTables } from "@/services/tables";
import { createOrder } from "@/services/orders";
import { getPayments } from "@/services/paymentMethods.js";

export default {
  name: "CatalogoProductos",
  data() {
    return {
      usuario: JSON.parse(localStorage.getItem("user")) || {},
      roles: JSON.parse(localStorage.getItem("roles")) || [],
      productos: [],
      categorias: [],
      mesas: [],
      mesaSeleccionada: "",
      cargando: false,
      filtro: "",
      filtroCategoria: 0,
      precioMin: 0,
      precioMax: 0,
      carrito: [],
      mostrarModalPago: false,
      metodoPago: 0,
      metodos: [],
      mostrarCarrito: true,
    };
  },
  computed: {
    totalCarrito() {
      return this.carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);
    },
    rolActivo() {
      return this.roles.length > 0 ? this.roles[0].name : null;
    },
  },
  mounted() {
    this.obtenerProductos();
    this.obtenerCategorias();
    this.obtenerMesas();
    this.cargarMetodos();
  },
  methods: {
    formatearPrecio(valor) {
      if (!valor) return "$0";
      return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
    },
    toggleCarrito() {
      this.mostrarCarrito = !this.mostrarCarrito;
    },
    async cargarMetodos() {
      this.cargando = true;
      try {
        this.metodos = await getPayments();
      } catch {
        mostrarAlerta("Error al cargar los métodos de pago", "danger");
      } finally {
        this.cargando = false;
      }
    },
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
    async obtenerMesas() {
      try {
        this.mesas = await getTables();
      } catch {
        mostrarAlerta("Error al cargar las mesas", "danger");
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
    agregarAlCarrito(producto) {
      const existe = this.carrito.find((p) => p.id === producto.id);
      if (existe) existe.cantidad++;
      else this.carrito.push({ ...producto, cantidad: 1 });
    },
    cambiarCantidad(item, delta) {
      item.cantidad += delta;
      if (item.cantidad <= 0) this.eliminarDelCarrito(item);
    },
    eliminarDelCarrito(item) {
      this.carrito = this.carrito.filter((p) => p.id !== item.id);
    },
    abrirModalPago() {
      if (this.carrito.length === 0) return mostrarAlerta("El carrito está vacío", "warning");
      if (!this.mesaSeleccionada) return mostrarAlerta("Debes seleccionar una mesa", "warning");
      this.mostrarModalPago = true;
    },
    prepararPayload(pedido) {
      return {
        customer: { id: pedido.customer.id },
        table: { id: pedido.table.id },
        status: pedido.status,
        orderDetails: pedido.orderDetails.map((d) => ({
          product: { id: d.product.id },
          quantity: d.quantity,
        })),
        invoice: {
          status: pedido.invoice?.status || "PENDING",
          paymentMethod: { id: parseInt(this.metodoPago) },
        },
      };
    },
    async crearOrdenYPagar() {
      try {
        const order = {
          customer: { id: this.usuario.id },
          table: { id: this.mesaSeleccionada },
          status: "PENDING",
          orderDetails: this.carrito.map((item) => ({
            product: { id: item.id },
            quantity: item.cantidad,
          })),
          invoice: {},
        };
        const payload = this.prepararPayload(order);
        await createOrder(payload);
        mostrarAlerta("Pedido y factura generados correctamente.", "success");
        this.resetearCarrito();
        this.cerrarModalPago();
      } catch (error) {
        console.error(error);
        mostrarAlerta(error.response?.data || "Error al procesar el pedido", "danger");
      }
    },
    cerrarModalPago() {
      this.mostrarModalPago = false;
    },
    resetearCarrito() {
      this.carrito = [];
      this.mesaSeleccionada = "";
      this.metodoPago = 0;
    },
    cambiarRol() {
      localStorage.removeItem("activeRole");
      this.$router.push("/select-role");
    },
  },
};
</script>

<style>
.carrito-flotante {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  border-radius: 16px;
  z-index: 1050;
  transition: all 0.3s ease;
  overflow: hidden;
}
.carrito-header {
  background: #580e00;
  color: white;
  border-radius: 12px 12px 0 0;
}
.btn-toggle {
  color: white;
  background: none;
  border: none;
  font-size: 1.1rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.catalogo-container {
  padding: 2rem;
  background: #f8f9fa;
}
.catalogo-header {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}
.catalogo-title {
  color: #580e00;
  font-weight: 700;
  font-size: 2.2rem;
}
.catalogo-subtitle {
  color: #6c757d;
}
.catalogo-filtros {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

/* Imagen del producto */
.imagen-container {
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  overflow: hidden;
}
.producto-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}
.producto-img:hover {
  transform: scale(1.05);
}
.sin-imagen {
  height: 220px;
  background-color: #f0f0f0;
}

/* Botón agregar */
.btn-agregar {
  background-color: #580e00;
  color: white;
  border-radius: 10px;
  transition: 0.3s;
}
.btn-agregar:hover {
  background-color: #71160a;
}
</style>
