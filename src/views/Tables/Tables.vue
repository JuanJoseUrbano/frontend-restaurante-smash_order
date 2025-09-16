<template>
  <div class="mesas-container">
    <!-- HEADER -->
    <div class="mesas-header shadow-sm">
      <h1 class="mesas-title">Gestión de Mesas</h1>
      <p class="mesas-subtitle">Administra y organiza las mesas del restaurante</p>
    </div>

    <!-- ACCIONES -->
    <div class="mesas-actions card p-3 mb-4 shadow-sm">
      <div class="row g-3 align-items-center">
        <!-- Botón agregar -->
        <div class="col-md-auto">
          <button class="btn btn-guardar d-flex align-items-center" @click="modalAgregar.show()">
            <i class="fas fa-plus-circle me-2"></i> Nueva Mesa
          </button>
        </div>

        <!-- Buscar por número -->
        <div class="col-md-auto">
          <div class="input-group search-small">
            <input type="number" min="1" class="form-control search-input" v-model="filtroNumero"
              placeholder="Buscar" />
            <button @click="buscarPorNumero" class="btn btn-primary">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Filtrar por estado -->
        <div class="col-md-auto">
          <select class="form-select state-select" v-model="filtroEstado" @change="filtrarPorEstado">
            <option value="">Estados</option>
            <option value="AVAILABLE">Disponibles</option>
            <option value="OCCUPIED">Ocupadas</option>
            <option value="RESERVED">Reservadas</option>
          </select>
        </div>

        <!-- Limpiar -->
        <div class="col-md-auto">
          <button class="btn btn-outline-secondary" @click="limpiarFiltros">
            <i class="fas fa-eraser me-1"></i> Limpiar
          </button>
        </div>

        <!-- Badge resultados -->
        <div class="col-md-auto ms-auto text-end">
          <span class="badge bg-info fs-6">{{ mesas.length }} Resultados</span>
        </div>
      </div>
    </div>

<!-- TABLA MESAS -->
<div class="mesas-table-container shadow-sm">
  <div v-if="cargando" class="loading-spinner">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p>Cargando Mesas...</p>
  </div>

  <div v-else-if="mesas.length === 0" class="empty-state">
    <i class="fas fa-chair empty-icon"></i>
    <h4>No hay mesas registradas</h4>
    <p>Agrega una mesa para empezar</p>
  </div>

  <div v-else class="table-responsive">
    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Número</th>
          <th class="text-center">Capacidad</th>
          <th class="text-center">Estado</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in mesas" :key="m.id" class="mesa-row">
          <td class="text-center">{{ m.id }}</td>
          <td class="text-center mesa-numero">{{ m.number }}</td>
          <td class="text-center mesa-capacidad">{{ m.capacity }}</td>
          <td class="text-center">
            <span :class="['badge fs-6',
              m.status === 'AVAILABLE' ? 'bg-success' :
              m.status === 'OCCUPIED' ? 'bg-danger' :
              'bg-warning']">
              {{ m.status }}
            </span>
          </td>
          <td class="text-center">
            <div class="action-buttons">
              <button class="btn btn-sm btn-outline-warning me-2" @click="obtenerPorId(m.id)">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="eliminarMesa(m.id)" class="btn btn-sm btn-outline-danger">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    <!-- Modal Agregar -->
    <div class="modal fade" id="modalGuardarMesa" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Agregar Mesa</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Número de mesa -->
            <label for="numeroMesaNueva" class="form-label">Número de mesa</label>
            <input id="numeroMesaNueva" v-model.number="mesaNueva.number" type="number" min="1"
              class="form-control mb-3" placeholder="Ej: 5" />

            <!-- Capacidad -->
            <label for="capacidadMesaNueva" class="form-label">Capacidad</label>
            <input id="capacidadMesaNueva" v-model.number="mesaNueva.capacity" type="number" min="1"
              class="form-control mb-3" placeholder="Ej: 4 personas" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-success" @click="guardarMesa">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <div class="modal fade" id="modalEditarMesa" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">Editar Mesa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Número de mesa -->
            <label for="numeroMesaEditada" class="form-label">Número de mesa</label>
            <input id="numeroMesaEditada" v-model.number="mesaEditada.number" type="number" min="1"
              class="form-control mb-3" placeholder="Ej: 5" />

            <!-- Capacidad -->
            <label for="capacidadMesaEditada" class="form-label">Capacidad</label>
            <input id="capacidadMesaEditada" v-model.number="mesaEditada.capacity" type="number" min="1"
              class="form-control mb-3" placeholder="Ej: 4 personas" />

            <!-- Estado -->
            <label for="estadoMesaEditada" class="form-label">Estado</label>
            <select id="estadoMesaEditada" v-model="mesaEditada.status" class="form-select mb-3 w-75">
              <option value="AVAILABLE">Disponible</option>
              <option value="OCCUPIED">Ocupada</option>
              <option value="RESERVED">Reservada</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-warning" @click="actualizarMesa">Actualizar</button>
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
  name: 'GestionMesas',
  data() {
    return {
      urlApi: 'http://localhost:8080/smash-order/api/tables',
      mesas: [],
      mesaNueva: {
        number: 0,
        capacity: 0,
        status: 'AVAILABLE'
      },
      mesaEditada: {
        id: 0,
        number: 0,
        capacity: 0,
        status: ''
      },
      cargando: false,
      modalAgregar: null,
      modalEditar: null,
      filtroNumero: '',
      filtroEstado: ''
    };
  },
  mounted() {
    this.modalAgregar = new Modal(document.getElementById('modalGuardarMesa'));
    this.modalEditar = new Modal(document.getElementById('modalEditarMesa'));
    this.obtenerMesas();
  },
  methods: {
    async obtenerMesas() {
      this.cargando = true;
      try {
        const res = await axios.get(this.urlApi);
        this.mesas = res.data;
      } catch {
        mostrarAlerta('Error al cargar las mesas', 'danger');
      } finally {
        this.cargando = false;
      }
    },

    async buscarPorNumero() {
      if (!this.filtroNumero) return this.obtenerMesas();
      try {
        const res = await axios.get(`${this.urlApi}/number/${this.filtroNumero}`);
        this.mesas = [res.data];
      } catch {
        mostrarAlerta('Mesa no encontrada', 'warning');
      }
    },

    async filtrarPorEstado() {
      if (!this.filtroEstado) return this.obtenerMesas();
      try {
        const res = await axios.get(`${this.urlApi}/status/${this.filtroEstado}`);
        this.mesas = res.data;
      } catch {
        mostrarAlerta('Error al filtrar por estado', 'danger');
      }
    },

    limpiarFiltros() {
      this.filtroNumero = '';
      this.filtroEstado = '';
      this.obtenerMesas();
    },

    async guardarMesa() {
      try {
        await axios.post(this.urlApi, this.mesaNueva);
        this.mesaNueva = { number: 0, capacity: 0, status: 'AVAILABLE' };
        mostrarAlerta('Mesa guardada exitosamente', 'success');
        this.obtenerMesas();
        this.modalAgregar.hide();
      } catch {
        mostrarAlerta('Error al guardar la mesa', 'danger');
      }
    },

    async obtenerPorId(id) {
      try {
        const res = await axios.get(`${this.urlApi}/${id}`);
        this.mesaEditada = res.data;
        this.modalEditar.show();
      } catch {
        mostrarAlerta('Error al obtener la mesa', 'danger');
      }
    },

    async actualizarMesa() {
      try {
        await axios.put(`${this.urlApi}/${this.mesaEditada.id}`, this.mesaEditada);
        mostrarAlerta('Mesa actualizada correctamente', 'success');
        this.obtenerMesas();
        this.modalEditar.hide();
      } catch {
        mostrarAlerta('Error al actualizar la mesa', 'danger');
      }
    },

    async eliminarMesa(id) {
      try {
        confirmar(`${this.urlApi}/${id}`, 'Eliminar mesa', '¿Estás seguro de eliminar esta mesa?');
        this.obtenerMesas();
      } catch {
        mostrarAlerta('Error al eliminar la mesa', 'danger');
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

/* === Contenedor General === */
.mesas-container {
  padding: 2rem;
  background-color: var(--background-light);
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* === Encabezado === */
.mesas-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.mesas-title {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.mesas-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

/* === Acciones === */
.mesas-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.btn-guardar {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: #fff !important;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-guardar:hover {
  background-color: var(--primary-dark) !important;
  border-color: var(--primary-dark) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.3);
}

/* === Tabla Mesas === */
.mesas-table-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
  overflow: hidden;
}

.mesas-table {
  border-radius: 12px;
  overflow: hidden;
}

.mesas-table thead {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.mesas-table th {
  font-weight: 600;
  padding: 1rem;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.mesa-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid #eee;
}

.mesa-row:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

/* === Estados === */
.badge {
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
}

/* === Loading Spinner === */
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

/* === Empty State === */
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

/* === Botones de acción === */
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

/* === Modales === */
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

/* === Responsivo === */
@media (max-width: 768px) {
  .mesas-container {
    padding: 1rem;
  }

  .mesas-actions {
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
