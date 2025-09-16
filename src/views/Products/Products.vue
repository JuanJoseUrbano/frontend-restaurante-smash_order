<template>
  <div class="productos-container">
    <!-- HEADER -->
    <div class="productos-header shadow-sm">
      <h1 class="productos-title">Gestión de Productos</h1>
      <p class="productos-subtitle">Administra, busca y organiza tus productos</p>
    </div>

    <!-- ACCIONES -->
    <div class="productos-actions card p-3 mb-4 shadow-sm">
      <div class="row g-3 align-items-center">
        <!-- Botón agregar -->
        <div class="col-md-auto">
          <button class="btn btn-guardar d-flex align-items-center" @click="modalAgregar.show()">
            <i class="fas fa-plus-circle me-2"></i> Nuevo Producto
          </button>
        </div>

        <!-- Búsqueda -->
        <div class="col-md">
          <div class="input-group">
            <input type="text" class="form-control search-input" v-model="filtro" placeholder="Buscar por nombre..." />
            <button @click="filtrarBusqueda" class="btn btn-primary">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Categoría -->
        <div class="col-md-auto">
          <select class="form-select" v-model="filtroCategoria" @change="filtrarPorCategoria">
            <option value="0">Todas las categorías</option>
            <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <!-- Precio -->
        <div class="col-md-auto">
          <div class="input-group price-filter">
            <input type="number" class="form-control input-precio" placeholder="Mín" v-model="precioMin" min="0" />
            <input type="number" class="form-control input-precio" placeholder="Máx" v-model="precioMax" min="0" />
            <button @click="filtrarPorPrecio" class="btn btn-success btn-precio">Filtrar</button>
          </div>
        </div>


        <!-- Limpiar -->
        <div class="col-md-auto">
          <button class="btn btn-outline-secondary" @click="limpiarFiltros">
            <i class="fas fa-eraser me-1"></i> Limpiar
          </button>
        </div>

        <!-- Badge resultados -->
        <div class="col-md-auto ms-auto text-end">
          <span class="badge bg-info fs-6">{{ productos.length }} Resultados</span>
        </div>
      </div>
    </div>

    <!-- TABLA -->
    <div class="productos-table-container shadow-sm">
      <div v-if="cargando" class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando Productos...</p>
      </div>

      <div v-else-if="productos.length === 0" class="empty-state">
        <i class="fas fa-box-open empty-icon"></i>
        <h4>No hay productos disponibles</h4>
        <p>Agrega un producto para empezar</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th class="text-center">#</th>
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
    </div>

    <!-- MODALES -->
    <!-- Modal Agregar -->
    <div class="modal fade" id="modalGuardarProducto" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Agregar Producto</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
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

    <!-- Modal Editar -->
    <div class="modal fade" id="modalEditarProducto" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">Editar Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
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
import { mostrarAlerta, confirmar } from '@/functions.js';
import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';

export default {
  name: 'GestionProductos',
  data() {
    return {
      urlApi: 'http://localhost:8080/smash-order/api',
      productos: [],
      categorias: [],
      productoNuevo: {
        name: '',
        description: '',
        price: 0,
        category: { id: 0 }
      },
      productoEditado: {
        id: 0,
        name: '',
        description: '',
        price: 0,
        category: { id: 0 }
      },
      cargando: false,
      modalAgregar: null,
      modalEditar: null,
      precioMin: 0,
      precioMax: 0
    };
  },
  mounted() {
    this.modalAgregar = new Modal(document.getElementById('modalGuardarProducto'));
    this.modalEditar = new Modal(document.getElementById('modalEditarProducto'));
    this.obtenerProductos();
    this.obtenerCategorias();
  },
  methods: {
    validarProducto(producto) {
      if (!producto.name || producto.name.trim() === '') {
        mostrarAlerta('Información inválida', 'info', 'Ingrese el nombre');
        return false;
      } else if (!producto.description || producto.description.trim() === '') {
        mostrarAlerta('Información inválida', 'info', 'Ingrese la descripción');
        return false;
      } else if (isNaN(producto.price) || producto.price <= 0) {
        mostrarAlerta('Información inválida', 'info', 'Ingrese el precio correctamente');
        return false;
      } else if (!producto.category || producto.category.id === 0) {
        mostrarAlerta('Información incompleta', 'info', 'Seleccione una categoría');
        return false;
      }
      return true;
    },

    async obtenerProductos() {
      this.cargando = true;
      try {
        const res = await axios.get(this.urlApi + '/products');
        this.productos = res.data;
      } catch (error) {
        mostrarAlerta('Error al cargar los productos', 'danger');
      } finally {
        this.cargando = false;
      }
    },

    async obtenerCategorias() {
      try {
        const res = await axios.get(this.urlApi + '/categories');
        this.categorias = res.data;
      } catch (error) {
        mostrarAlerta('Error al cargar las categorías', 'danger');
      }
    },

    async filtrarBusqueda() {
      if (!this.filtro.trim()) return this.obtenerProductos();
      try {
        const res = await axios.get(`${this.urlApi}/products/search?name=${this.filtro}`, {
          params: { q: this.filtro }
        });
        this.productos = res.data;
      } catch {
        mostrarAlerta('Error en la búsqueda', 'danger');
      }
    },

    async filtrarPorCategoria() {
      if (this.filtroCategoria == 0) return this.obtenerProductos();
      try {
        const res = await axios.get(`${this.urlApi}/products/category/${this.filtroCategoria}`);
        this.productos = res.data;
      } catch {
        mostrarAlerta('Error al filtrar por categoría', 'danger');
      }
    },

    async filtrarPorPrecio() {
      try {
        const res = await axios.get(`${this.urlApi}/products/price-range?minPrice=${this.precioMin}&maxPrice=${this.precioMax}`)
        this.productos = res.data;
      } catch {
        mostrarAlerta('Error al filtrar por precio', 'danger');
      }
    },

    limpiarFiltros() {
      this.filtro = '';
      this.filtroCategoria = 0;
      this.precioMin = '';
      this.precioMax = '';
      this.obtenerProductos();
    },

    async guardarProducto() {
      if (!this.validarProducto(this.productoNuevo)) return;
      try {
        await axios.post(this.urlApi + '/products', this.productoNuevo);
        this.productoNuevo = { name: '', description: '', price: 0, category: { id: 0 } };
        mostrarAlerta('Producto guardado exitosamente', 'success');
        this.obtenerProductos();
        this.modalAgregar.hide();
      } catch (error) {
        mostrarAlerta('Error al guardar el producto', 'danger');
      }
    },

    async obtenerPorId(id) {
      try {
        const res = await axios.get(`${this.urlApi}/products/${id}`);
        this.productoEditado = res.data;
        this.modalEditar.show();
      } catch (error) {
        mostrarAlerta('Error al obtener los datos para editar', 'danger');
      }
    },

    async actualizarProducto() {
      if (!this.validarProducto(this.productoEditado)) return;
      try {
        await axios.put(`${this.urlApi}/products/${this.productoEditado.id}`, this.productoEditado);
        mostrarAlerta('Producto actualizado correctamente', 'success');
        this.obtenerProductos();
        this.modalEditar.hide();
      } catch (error) {
        mostrarAlerta('Error al actualizar el producto', 'danger');
      }
    },

    async eliminarProducto(id) {
      try {
        confirmar(`${this.urlApi}/products/${id}`, 'Eliminar producto', '¿Estás seguro de eliminar este producto?');
        this.obtenerProductos();
      } catch (error) {
        mostrarAlerta('Error al eliminar el producto', 'danger');
      }
    }
  }
};
</script>
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  --primary-color: #580E00;
  --primary-light: #7a2c1a;
  --primary-dark: #3d0900;
  --accent-color: #FF8C00;
  --text-dark: #2C3E50;
  --text-light: #7F8C8D;
  --background-light: #FFF9F0;
}

.productos-container {
  padding: 2rem;
  background-color: var(--background-light);
  min-height: 100vh;
}

.productos-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
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

.productos-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.btn-primary {
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.3);
}

.results-badge .badge {
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
  border-radius: 20px;
}

.productos-table-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
  overflow: hidden;
}

.loading-spinner {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.loading-spinner .spinner-border {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
}

.productos-table {
  border-radius: 12px;
  overflow: hidden;
}

.productos-table thead {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.productos-table th {
  font-weight: 600;
  padding: 1rem;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.producto-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid #eee;
}

.producto-row:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

.producto-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.producto-name {
  font-weight: 600;
  color: var(--text-dark);
}

.producto-descripcion {
  color: var(--text-light);
  font-size: 0.9rem;
  max-width: 250px;
}

.precio-badge {
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-buttons .btn {
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  transition: all 0.2s ease;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
}

.empty-state {
  text-align: center;
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

.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-radius: 16px 16px 0 0;
  padding: 1.2rem 1.5rem;
}

.modal-title {
  font-weight: 600;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  border-radius: 0 0 16px 16px;
  padding: 1.2rem 1.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(88, 14, 0, 0.1);
}

.input-group-text {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-right: none;
}

.btn-guardar {
  background-color: #580E00 !important;
  /* tu color */
  border-color: #580E00 !important;
  color: #fff !important;
  /* texto blanco */
}

.btn-guardar:hover {
  background-color: #3d0900 !important;
  /* un poco más oscuro al pasar el mouse */
  border-color: #3d0900 !important;
}

.input-precio {
  max-width: 80px;
  flex: none;
  text-align: center;
}

/* Botón del filtro */
.btn-precio {
  white-space: nowrap;
  /* evita que se parta el texto */
}




@media (max-width: 768px) {
  .productos-container {
    padding: 1rem;
  }

  .productos-actions {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .producto-descripcion {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .modal-dialog {
    margin: 1rem;
  }
}
</style>
