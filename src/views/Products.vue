<template>
  <div class="productos-container">
    <!-- HEADER -->
    <div class="productos-header shadow-sm">
      <h1 class="productos-title">Gestión de Productos</h1>
      <p class="productos-subtitle">Administra, busca y organiza tus productos</p>
    </div>

    <!-- ACCIONES / FILTROS -->
    <div class="productos-filtros card p-3 mb-4 shadow-sm">
      <div class="row g-3 align-items-center flex-wrap">
        <!-- Botón agregar -->
        <div class="col-md-auto">
          <button class="btn btn-guardar d-flex align-items-center gap-2" @click="modalAgregar.show()">
            <i class="fas fa-plus-circle"></i> Nuevo Producto
          </button>
        </div>

        <!-- Buscar por nombre -->
        <div class="col-md-4">
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

        <!-- Botones de acción -->
        <div class="col-md-2 d-flex gap-2 justify-content-end">
          <button @click="filtrarPorPrecio" class="btn btn-success flex-grow-1">
            <i class="fas fa-filter me-1"></i> Filtrar
          </button>
          <button @click="limpiarFiltros" class="btn btn-secondary flex-grow-1">
            <i class="fas fa-eraser me-1"></i> Limpiar
          </button>
        </div>

        <!-- Contador de resultados -->
        <div class="col-12 text-end mt-2">
          <span class="badge bg-info fs-6">
            {{ productos.length }} Resultados
          </span>
        </div>
      </div>
    </div>


    <!-- TABLA -->
    <div class="productos-table-container shadow-sm">
      <!-- SPINNER DE CARGA con mismo estilo que categorías -->
      <div v-if="cargando" class="loading-overlay">
        <div class="spinner"></div>
        <p class="mt-2 text-dark">Cargando Productos...</p>
      </div>

      <div v-else-if="productos.length === 0" class="empty-state">
        <i class="fas fa-box-open empty-icon"></i>
        <h4>No hay productos disponibles</h4>
        <p>Agrega un producto para empezar</p>
      </div>

      <div v-else class="table-responsive">
        <!-- tu tabla original -->
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th class="text-center">#</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th class="text-center">Precio</th>
              <th class="text-center">Categoría</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in productos" :key="p.id" class="producto-row">
              <td class="text-center">{{ p.id }}</td>
              <td class="text-center">
                <img v-if="p.image" :src="p.image" alt="Imagen" class="img-thumbnail" width="60" height="60" />
                <img v-else src="https://cdn-icons-png.flaticon.com/128/7887/7887812.png" class="img-thumbnail"
                  width="60" height="60" />
              </td>
              <td class="producto-name">{{ p.name }}</td>
              <td class="producto-descripcion">{{ p.description }}</td>
              <td class="text-center">
                <span class="badge bg-success fs-6">${{ p.price }}</span>
              </td>
              <td class="text-center">{{ p.category?.name || 'Sin Categoría' }}</td>
              <td class="text-center">
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline-warning me-2" @click="obtenerPorId(p.id)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="eliminarProducto(p.id)" class="btn btn-sm btn-outline-danger">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      <!-- PAGINACIÓN -->
      <nav class="d-flex justify-content-center mt-4">
        <ul class="pagination">
          <!-- Botón Anterior -->
          <li class="page-item" :class="{ disabled: paginaActual === 0 }">
            <button class="page-link" @click="cambiarPagina(paginaActual - 1)">
              <i class="fas fa-chevron-left me-1"></i> Anterior
            </button>
          </li>

          <!-- Botones numéricos -->
          <li v-for="n in totalPaginas" :key="n" class="page-item" :class="{ active: paginaActual === n - 1 }">
            <button class="page-link" @click="cambiarPagina(n - 1)">
              {{ n }}
            </button>
          </li>

          <!-- Botón Siguiente -->
          <li class="page-item" :class="{ disabled: paginaActual >= totalPaginas - 1 }">
            <button class="page-link" @click="cambiarPagina(paginaActual + 1)">
              Siguiente <i class="fas fa-chevron-right ms-1"></i>
            </button>
          </li>
        </ul>
      </nav>

    </div>

    <!-- MODAL AGREGAR -->
    <div class="modal fade" id="modalGuardarProducto" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Agregar Producto</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-3">
              <img v-if="productoNuevo.image" :src="productoNuevo.image" class="img-thumbnail" width="120" />
              <img v-else src="https://cdn-icons-png.flaticon.com/128/7887/7887812.png" class="img-thumbnail"
                width="120" />
              <input type="file" class="form-control mt-2" @change="previsualizarFoto('nuevo', $event)"
                accept="image/png, image/jpeg" />
            </div>
            <input v-model="productoNuevo.name" class="form-control mb-2" placeholder="Nombre" />
            <input v-model="productoNuevo.description" class="form-control mb-2" placeholder="Descripción" />
            <input v-model.number="productoNuevo.price" type="number" class="form-control mb-2" placeholder="Precio" />
            <select v-model="productoNuevo.category.id" class="form-select">
              <option value="0">Seleccione categoría</option>
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-success" @click="guardarProducto">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDITAR -->
    <div class="modal fade" id="modalEditarProducto" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">Editar Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-3">
              <img v-if="productoEditado.image" :src="productoEditado.image" class="img-thumbnail" width="120" />
              <img v-else src="https://cdn-icons-png.flaticon.com/128/7887/7887812.png" class="img-thumbnail"
                width="120" />
              <input type="file" class="form-control mt-2" @change="previsualizarFoto('editado', $event)"
                accept="image/png, image/jpeg" />
            </div>
            <input v-model="productoEditado.name" class="form-control mb-2" placeholder="Nombre" />
            <input v-model="productoEditado.description" class="form-control mb-2" placeholder="Descripción" />
            <input v-model.number="productoEditado.price" type="number" class="form-control mb-2"
              placeholder="Precio" />
            <select v-model="productoEditado.category.id" class="form-select">
              <option value="0">Seleccione categoría</option>
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-warning" @click="actualizarProducto">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta, confirmar, validarRangoDePrecio } from "@/functions.js";
import Modal from "bootstrap/js/dist/modal";
import {
  getProductsPaginated,
  getProductById,
  searchProductsPaginated,
  createProduct,
  updateProduct,
  deleteProduct,
  filterByCategoryPaginated,
  filterByPricePaginated,
} from "@/services/products";
import { getCategories } from "@/services/categories";

export default {
  name: "GestionProductos",
  data() {
    return {
      productos: [],
      categorias: [],
      productoNuevo: { name: "", description: "", price: 0, image: "", category: { id: 0 } },
      productoEditado: { id: 0, name: "", description: "", price: 0, image: "", category: { id: 0 } },
      cargando: false,
      modalAgregar: null,
      modalEditar: null,
      filtro: "",
      filtroCategoria: 0,
      precioMin: "",
      precioMax: "",
      paginaActual: 0,
      tamañoPagina: 4,
      totalPaginas: 0,
      modoFiltro: null,
    };
  },

  mounted() {
    this.modalAgregar = new Modal(document.getElementById("modalGuardarProducto"));
    this.modalEditar = new Modal(document.getElementById("modalEditarProducto"));
    this.obtenerProductos();
    this.obtenerCategorias();
  },

  methods: {
    previsualizarFoto(tipo, event) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        const base64 = reader.result;
        if (tipo === "nuevo") this.productoNuevo.image = base64;
        else this.productoEditado.image = base64;
      };
    },

    validarProducto(producto) {
      if (!producto.name?.trim()) return mostrarAlerta("Ingrese el nombre", "warning");
      if (!producto.description?.trim()) return mostrarAlerta("Ingrese la descripción", "warning");
      if (!producto.price || producto.price <= 0) return mostrarAlerta("Ingrese un precio válido", "warning");
      if (producto.category.id === 0) return mostrarAlerta("Seleccione una categoría", "warning");
      return true;
    },

    async obtenerProductos() {
      this.cargando = true;
      try {
        const data = await getProductsPaginated(this.paginaActual, this.tamañoPagina);
        this.productos = data.content;
        this.totalPaginas = data.totalPages;
        this.modoFiltro = null;
      } catch {
        mostrarAlerta("Error al cargar los productos", "danger");
      } finally {
        this.cargando = false;
      }
    },

    async cambiarPagina(nuevaPagina) {
      if (nuevaPagina < 0 || nuevaPagina >= this.totalPaginas) return;
      this.paginaActual = nuevaPagina;

      switch (this.modoFiltro) {
        case "nombre":
          await this.filtrarBusqueda(false);
          break;
        case "categoria":
          await this.filtrarPorCategoria(false);
          break;
        case "precio":
          await this.filtrarPorPrecio(false);
          break;
        default:
          await this.obtenerProductos();
      }
    },

    async filtrarBusqueda(reset = true) {
      if (!this.filtro.trim()) {
        this.modoFiltro = null;
        return this.obtenerProductos();
      }

      if (reset) this.paginaActual = 0;
      this.cargando = true;

      try {
        const data = await searchProductsPaginated(this.filtro, this.paginaActual, this.tamañoPagina);
        this.productos = data.content;
        this.totalPaginas = data.totalPages;
        this.modoFiltro = "nombre";
      } catch {
        mostrarAlerta("Error al filtrar por nombre", "danger");
      } finally {
        this.cargando = false;
      }
    },

    async filtrarPorCategoria(reset = true) {
      if (this.filtroCategoria == 0) {
        this.modoFiltro = null;
        return this.obtenerProductos();
      }

      if (reset) this.paginaActual = 0;
      this.cargando = true;

      try {
        const data = await filterByCategoryPaginated(this.filtroCategoria, this.paginaActual, this.tamañoPagina);
        this.productos = data.content;
        this.totalPaginas = data.totalPages;
        this.modoFiltro = "categoria";
      } catch {
        mostrarAlerta("Error al filtrar por categoría", "danger");
      } finally {
        this.cargando = false;
      }
    },

    async filtrarPorPrecio() {
      if (!validarRangoDePrecio(this.precioMin, this.precioMax)) return;

      try {
        this.productos = await filterByPricePaginated(this.precioMin, this.precioMax);
      } catch {
        mostrarAlerta("Error", "error", "Error al filtrar por precio");
      }
    },

    limpiarFiltros() {
      this.filtro = "";
      this.filtroCategoria = 0;
      this.precioMin = "";
      this.precioMax = "";
      this.paginaActual = 0;
      this.modoFiltro = null;
      this.obtenerProductos();
    },

    async guardarProducto() {
      if (!this.validarProducto(this.productoNuevo)) return;

      try {
        await createProduct(this.productoNuevo);
        mostrarAlerta("Producto guardado exitosamente", "success");
        this.obtenerProductos();
        this.modalAgregar.hide();

        this.productoNuevo = {
          name: "",
          description: "",
          price: null,
          image: "",
          category: { id: 0 },
        };
      } catch (error) {
        mostrarAlerta("Error al guardar el producto", "danger");
      }
    },

    async obtenerPorId(id) {
      this.productoEditado = await getProductById(id);
      this.modalEditar.show();
    },

    async actualizarProducto() {
      if (!this.validarProducto(this.productoEditado)) return;
      await updateProduct(this.productoEditado);
      mostrarAlerta("Producto actualizado correctamente", "success");
      this.obtenerProductos();
      this.modalEditar.hide();
    },

    async eliminarProducto(id) {
      const confirmado = await confirmar("Eliminar producto", "¿Estás seguro de eliminar este producto?");
      if (confirmado) {
        await deleteProduct(id);
        mostrarAlerta("Eliminado correctamente", "success");
        this.obtenerProductos();
      }
    },

    async obtenerCategorias() {
      this.categorias = await getCategories();
    },
  },
};
</script>


<style>
/* === ENCABEZADO DE PRODUCTOS === */
.productos-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.productos-title {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.productos-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

/* === SPINNER DE CARGA === */
.loading-overlay {
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* === PAGINACIÓN === */
.pagination-container .btn-pagination {
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pagination-container .btn-pagination:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-container .btn-pagination:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.3);
}

/* === MODAL === */
.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* === FILTROS DE PRODUCTOS === */
.productos-filtros {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* === INPUT DE BÚSQUEDA === */
.search-input {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.btn-buscar {
  background-color: var(--primary-color);
  color: #fff;
  transition: 0.3s;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.btn-buscar:hover {
  background-color: var(--primary-dark);
}

/* === BOTONES === */
.btn-guardar,
.btn-success,
.btn-secondary {
  border-radius: 12px;
  font-weight: 600;
  transition: 0.3s ease;
}

/* Botón principal */
.btn-guardar {
  background-color: var(--primary-color);
  color: #fff;
}

.btn-guardar:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

/* Botones de acción */
.btn-success {
  background-color: #28a745;
  color: #fff;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

/* === CAMPOS Y ETIQUETAS === */
.input-precio {
  border-radius: 12px;
}

.badge {
  padding: 0.6rem 1rem;
  font-weight: 600;
  border-radius: 12px;
}
</style>
