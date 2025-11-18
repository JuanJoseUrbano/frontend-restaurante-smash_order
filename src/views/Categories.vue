<template>
  <div class="categorias-container">
    <!-- Header -->
    <div class="categorias-header">
      <h1 class="categorias-title">Gestión de Categorías</h1>
      <p class="categorias-subtitle">Información acerca de las categorías del restaurante</p>

      <!-- Acciones organizadas -->
      <div class="row g-3 align-items-center categorias-actions">
        <!-- Botón Agregar -->
        <div class="col-md-auto">
          <button class="btn-custom btn-agregar" @click="modalAgregar.show()">
            <i class="fas fa-plus-circle me-2"></i>Agregar
          </button>
        </div>

        <!-- Búsqueda -->
        <div class="col-md-6">
          <div class="search-container">
            <input type="text" class="search-input" v-model="filtro" placeholder="Buscar por nombre..." />
            <button @click="filtrarBusqueda" class="btn-custom btn-buscar">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Botón limpiar -->
        <div class="col-md-auto">
          <button class="btn-custom btn-limpiar" @click="limpiarFiltros">
            <i class="fas fa-eraser me-1"></i> Limpiar
          </button>
        </div>

        <!-- Resultados -->
        <div class="col-md-auto results-badge">
          <span class="badge bg-info">{{ categorias.length }} Resultados</span>
        </div>
      </div>
    </div>

    <!-- Spinner de carga global -->
    <div v-if="cargando" class="loading-overlay">
      <div class="spinner"></div>
      <p class="mt-2 text-dark">Cargando Categorías...</p>
    </div>

    <!-- Tabla de categorías -->
    <div v-else class="categorias-table-container mt-4">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th class="text-center">#</th>
            <th class="text-center">Nombre</th>
            <th class="text-center">Descripción</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in categorias" :key="c.id">
            <td class="text-center">{{ c.id }}</td>
            <td class="text-center">{{ c.name }}</td>
            <td class="text-center">{{ c.description }}</td>
            <td class="text-center">
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline-warning me-2" @click="editarCategoria(c.id)">
                  <i class="fas fa-edit me-1"></i>
                </button>
                <button @click="eliminarCategoria(c.id)" class="btn btn-sm btn-outline-danger">
                  <i class="fas fa-trash-alt me-1"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

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

    <!-- Modal para agregar categoría -->
    <div class="modal fade" id="modalGuardarCategoria" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Nueva Categoría</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control mb-2" v-model="categoriaNueva.name" required>

            <label class="form-label">Descripción</label>
            <input type="text" class="form-control" v-model="categoriaNueva.description">
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button class="btn btn-success" @click="guardarCategoria">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para editar categoría -->
    <div class="modal fade" id="modalEditarCategoria" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">Editar Categoría</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control mb-2" v-model="categoriaEditada.name" required>

            <label class="form-label">Descripción</label>
            <input type="text" class="form-control" v-model="categoriaEditada.description">
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button class="btn btn-warning" @click="actualizarCategoria">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta, confirmar } from '@/functions.js';
import Modal from 'bootstrap/js/dist/modal';
import { searchCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getCategoriesPaginated } from '@/services/categories';

export default {
  name: 'GestionCategorias',
  data() {
    return {
      categorias: [],
      categoriaNueva: { name: '', description: '' },
      categoriaEditada: { id: 0, name: '', description: '' },
      cargando: false,
      filtro: '',
      modalAgregar: null,
      modalEditar: null,
      paginaActual: 0,
      tamañoPagina: 5,
      totalPaginas: 0
    };
  },
  mounted() {
    this.modalAgregar = new Modal(document.getElementById('modalGuardarCategoria'));
    this.modalEditar = new Modal(document.getElementById('modalEditarCategoria'));
    this.obtenerCategorias();
  },
  methods: {
    validarCategoria(categoria) {
      if (!categoria.name || categoria.name.trim() === '') {
        mostrarAlerta('Información inválida', 'info', 'Ingrese el nombre de la categoría');
        return false;
      }
      return true;
    },

    async obtenerCategorias() {
      this.cargando = true;
      try {
        const data = await getCategoriesPaginated(this.paginaActual, this.tamañoPagina);
        this.categorias = data.content;
        this.totalPaginas = data.totalPages;
      } catch {
        mostrarAlerta('Error al cargar las categorías', 'danger');
      } finally {
        this.cargando = false;
      }
    },

    async cambiarPagina(nuevaPagina) {
      if (nuevaPagina < 0 || nuevaPagina >= this.totalPaginas) return;
      this.paginaActual = nuevaPagina;

      if (this.filtro && this.filtro.trim() !== '') {
        await this.filtrarBusqueda();
      } else {
        await this.obtenerCategorias();
      }
    },


    async filtrarBusqueda() {
      if (!this.filtro || this.filtro.trim() === '') {
        this.paginaActual = 0;
        this.obtenerCategorias();
        return;
      }
      try {
        this.cargando = true;
        const data = await searchCategories(this.filtro, this.paginaActual, this.tamañoPagina);
        this.categorias = data.content;
        this.totalPaginas = data.totalPages;
      } catch (error) {
        console.error('Error en la búsqueda:', error);
        mostrarAlerta('Error en la búsqueda', 'danger');
      } finally {
        this.cargando = false;
      }
    },


    limpiarFiltros() {
      this.filtro = '';
      this.paginaActual = 0;
      this.obtenerCategorias();
    },

    async guardarCategoria() {
      if (!this.validarCategoria(this.categoriaNueva)) return;
      try {
        await createCategory(this.categoriaNueva);
        this.categoriaNueva = { name: '', description: '' };
        mostrarAlerta('Categoría guardada exitosamente', 'success');
        await this.obtenerCategorias();
        if (this.modalAgregar) this.modalAgregar.hide();
      } catch (error) {
        console.error('Error al crear categoría:', error.response || error);
        mostrarAlerta('Error al guardar la categoría', 'danger');
      }
    },

    async editarCategoria(id) {
      try {
        this.categoriaEditada = await getCategoryById(id);
        this.modalEditar.show();
      } catch {
        mostrarAlerta('Error al obtener los datos para editar', 'danger');
      }
    },

    async actualizarCategoria() {
      if (!this.validarCategoria(this.categoriaEditada)) return;
      try {
        await updateCategory(this.categoriaEditada);
        mostrarAlerta('Categoría actualizada correctamente', 'success');
        await this.obtenerCategorias();
        this.modalEditar.hide();
      } catch {
        mostrarAlerta('Error al actualizar la categoría', 'danger');
      }
    },

    async eliminarCategoria(id) {
      try {
        const confirmado = await confirmar(
          "Eliminar categoría",
          "¿Estás seguro de eliminar esta categoría?"
        );
        if (confirmado) {
          await deleteCategory(id);
          mostrarAlerta("Categoría eliminada correctamente", "success");
          await this.obtenerCategorias();
        } else {
          mostrarAlerta("Operación cancelada", "info");
        }
      } catch {
        mostrarAlerta("Error al eliminar la categoría", "danger");
      }
    }
  }
};
</script>


<style>
/* Botones personalizados */
.btn-custom {
  border: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-agregar {
  background-color: var(--primary-color);
  color: #fff;
}

.btn-agregar:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.3);
}

.btn-buscar {
  background-color: var(--secondary-color, #4caf50);
  color: #fff;
  padding: 0.55rem 1rem;
  border-radius: 0 8px 8px 0;
}

.btn-buscar:hover {
  background-color: #3e8e41;
}

.btn-limpiar {
  background-color: #f0f0f0;
  color: #333;
}

.btn-limpiar:hover {
  background-color: #e0e0e0;
}

/* Búsqueda */
.search-container {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 0.55rem 1rem;
  border: 1px solid #ccc;
  border-right: none;
}

/* Header */
.categorias-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.categorias-title {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.categorias-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.categorias-actions {
  margin-top: 1.5rem;
}

/* Tabla */
.categorias-table-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
  overflow: hidden;
}

.action-buttons .btn {
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  transition: all 0.2s ease;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
}

/* Spinner */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(108, 27, 0, 0.2);
  border-top: 3px solid #6c1b00;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Modales estilo mesas */
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

/* Responsivo */
@media (max-width: 768px) {
  .categorias-container {
    padding: 1rem;
  }

  .categorias-actions {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-dialog {
    margin: 1rem;
  }
}
</style>
