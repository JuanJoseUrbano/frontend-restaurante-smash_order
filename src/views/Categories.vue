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
          <button class="btn-custom btn-agregar" @click="mostrarModalAgregar = true">
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

    <!-- Modal para agregar categoría -->
    <div v-if="mostrarModalAgregar" class="modal-backdrop">
      <div class="modal-custom">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">Nueva Categoría</h5>
          <button class="btn-close btn-close-white" @click="mostrarModalAgregar = false"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" v-model="categoriaNueva.name" required>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-custom btn-limpiar" @click="mostrarModalAgregar = false">Cerrar</button>
          <button class="btn-custom btn-agregar" @click="guardarCategoria">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Modal para editar categoría -->
    <div v-if="mostrarModalEditar" class="modal-backdrop">
      <div class="modal-custom">
        <div class="modal-header bg-warning text-dark">
          <h5 class="modal-title">Editar Categoría</h5>
          <button class="btn-close" @click="mostrarModalEditar = false"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" v-model="categoriaEditada.name" required>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-custom btn-limpiar" @click="mostrarModalEditar = false">Cerrar</button>
          <button class="btn-custom btn-buscar" @click="actualizarCategoria">Editar</button>
        </div>
      </div>
    </div>

    <!-- Tabla de categorías -->
    <div class="categorias-table-container mt-4">
      <div v-if="cargando" class="loading-spinner text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando Categorías...</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Nombre</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in categorias" :key="c.id">
              <td class="text-center">{{ c.id }}</td>
              <td class="text-center">{{ c.name }}</td>
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
      </div>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta, confirmar } from '@/functions.js';
import { getCategories, searchCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '@/services/categories';

export default {
  name: 'GestionCategorias',
  data() {
    return {
      categorias: [],
      categoriaNueva: { name: '' },
      categoriaEditada: { id: 0, name: '' },
      cargando: false,
      filtro: '',
      mostrarModalAgregar: false,
      mostrarModalEditar: false
    };
  },
  mounted() {
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
        this.categorias = await getCategories();
      } catch {
        mostrarAlerta('Error al cargar las categorías', 'danger');
      } finally {
        this.cargando = false;
      }
    },

    async filtrarBusqueda() {
      if (!this.filtro || this.filtro.trim() === '') {
        this.obtenerCategorias();
        return;
      }
      try {
        this.categorias = await searchCategories(this.filtro);
      } catch {
        mostrarAlerta('Error en la búsqueda', 'danger');
      }
    },

    limpiarFiltros() {
      this.filtro = '';
      this.obtenerCategorias();
    },

    async guardarCategoria() {
      if (!this.validarCategoria(this.categoriaNueva)) return;
      try {
        await createCategory(this.categoriaNueva);
        this.categoriaNueva = { name: '' };
        mostrarAlerta('Categoría guardada exitosamente', 'success');
        this.obtenerCategorias();
        this.mostrarModalAgregar = false;
      } catch {
        mostrarAlerta('Error al guardar la categoría', 'danger');
      }
    },

    async editarCategoria(id) {
      try {
        this.categoriaEditada = await getCategoryById(id);
        this.mostrarModalEditar = true;
      } catch {
        mostrarAlerta('Error al obtener los datos para editar', 'danger');
      }
    },

    async actualizarCategoria() {
      if (!this.validarCategoria(this.categoriaEditada)) return;
      try {
        await updateCategory(this.categoriaEditada);
        mostrarAlerta('Categoría actualizada correctamente', 'success');
        this.obtenerCategorias();
        this.mostrarModalEditar = false;
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
          this.obtenerCategorias();
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
/* Estilos botones */
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

/* Estilos búsqueda */
.search-container {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.search-input {
  flex: 1;
  padding: 0.55rem 1rem;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 8px 0 0 8px;
}

/* Modal personalizado */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}

.modal-custom {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
}

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
</style>
