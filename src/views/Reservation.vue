<template>
  <div class="reservas-container">
    <!-- HEADER -->
    <div class="reservas-header shadow-sm">
      <h1 class="reservas-title">Gestión de Reservas</h1>
      <p class="reservas-subtitle">Administra y organiza las reservas del restaurante</p>
    </div>

    <!-- ACCIONES -->
    <div class="reservas-actions card p-3 mb-4 shadow-sm">
      <div class="row g-3 align-items-center">
        <div class="col-md-auto">
          <button class="btn btn-guardar d-flex align-items-center" @click="abrirModalAgregar()">
            <i class="fas fa-plus-circle me-2"></i> Nueva Reserva
          </button>
        </div>

        <!-- BUSCAR -->
        <div class="col-md-auto">
          <div class="input-group search-small">
            <input type="date" class="form-control search-input" v-model="filtroFecha"
              placeholder="Buscar por cliente" />
            <button @click="filtrarPorFecha" class="btn btn-buscar">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- FILTRO ESTADO -->
        <div class="col-md-auto">
          <select class="form-select state-select" v-model="filtroEstado" @change="filtrarPorEstado">
            <option value="">Estados</option>
            <option :value="true">Confirmadas</option>
            <option :value="false">Pendientes</option>
          </select>
        </div>

        <!-- LIMPIAR -->
        <div class="col-md-auto">
          <button class="btn btn-outline-secondary" @click="limpiarFiltros">
            <i class="fas fa-eraser me-1"></i> Limpiar
          </button>
        </div>

        <!-- TOTAL -->
        <div class="col-md-auto ms-auto text-end">
          <span class="badge bg-info fs-6">{{ totalElementos }} Resultados</span>
        </div>
      </div>
    </div>

    <!-- TABLA RESERVAS -->
    <div class="reservas-table-container shadow-sm">
      <div v-if="cargando" class="loading-overlay">
        <div class="spinner" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando Reservas...</p>
      </div>

      <div v-else-if="reservas.length === 0" class="empty-state">
        <i class="fas fa-calendar-alt empty-icon"></i>
        <h4>No hay reservas registradas</h4>
        <p>Agrega una reserva para empezar</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Cliente</th>
              <th class="text-center">Mesa</th>
              <th class="text-center">Fecha / Hora</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in reservas" :key="r.id" class="reserva-row">
              <td class="text-center">{{ r.id }}</td>
              <td class="text-center">{{ r.customer?.name || 'Sin cliente' }}</td>
              <td class="text-center">{{ r.table?.number || '-' }}</td>
              <td class="text-center">{{ formatDate(r.date) }}</td>
              <td class="text-center">
                <span :class="['badge fs-6', r.status ? 'bg-success' : 'bg-warning']">
                  {{ r.status ? 'Confirmada' : 'Pendiente' }}
                </span>
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline-warning me-2" @click="obtenerPorId(r.id)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="eliminarReserva(r.id)" class="btn btn-sm btn-outline-danger">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- PAGINACIÓN (estilo de categorías) -->
        <nav class="d-flex justify-content-center mt-4" v-if="totalPaginas > 0">
          <ul class="pagination">
            <!-- Botón Anterior -->
            <li class="page-item" :class="{ disabled: page === 0 }">
              <button class="page-link" @click="cambiarPagina(page - 1)">
                <i class="fas fa-chevron-left me-1"></i> Anterior
              </button>
            </li>

            <!-- Botones numéricos -->
            <li v-for="n in totalPaginas" :key="n" class="page-item" :class="{ active: page === n - 1 }">
              <button class="page-link" @click="cambiarPagina(n - 1)">
                {{ n }}
              </button>
            </li>

            <!-- Botón Siguiente -->
            <li class="page-item" :class="{ disabled: page >= totalPaginas - 1 }">
              <button class="page-link" @click="cambiarPagina(page + 1)">
                Siguiente <i class="fas fa-chevron-right ms-1"></i>
              </button>
            </li>
          </ul>
        </nav>

      </div>
    </div>

    <!-- Modal Agregar -->
    <div class="modal fade" id="modalGuardarReserva" tabindex="-1" aria-hidden="true" ref="modalAgregar">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Agregar Reserva</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Cliente -->
            <div class="mb-3">
              <label class="form-label">Buscar Cliente</label>
              <input type="text" class="form-control" v-model="busquedaCliente" @input="buscarClientes"
                placeholder="Nombre, usuario o email" />
              <ul class="list-group mt-1" v-if="resultadosCliente.length">
                <li v-for="c in resultadosCliente" :key="c.id" class="list-group-item list-group-item-action"
                  @click="seleccionarClienteNuevo(c)">
                  {{ c.name }} ({{ c.email }})
                </li>
              </ul>
            </div>

            <!-- Mesa -->
            <label class="form-label">Mesa</label>
            <select v-model="reservaNueva.table" class="form-select mb-3">
              <option v-for="mesa in mesasDisponibles" :key="mesa.id" :value="mesa">
                Mesa {{ mesa.number }} - Capacidad: {{ mesa.capacity }}
              </option>
            </select>

            <!-- Fecha -->
            <label class="form-label">Fecha y Hora</label>
            <input v-model="reservaNueva.date" type="datetime-local" class="form-control mb-3" />

            <!-- Estado -->
            <label class="form-label">Estado</label>
            <select v-model="reservaNueva.status" class="form-select mb-3 w-50">
              <option :value="true">Confirmada</option>
              <option :value="false">Pendiente</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-success" @click="guardarReserva">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <div class="modal fade" id="modalEditarReserva" tabindex="-1" aria-hidden="true" ref="modalEditar">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">Editar Reserva</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Cliente -->
            <div class="mb-3">
              <label class="form-label">Buscar Cliente</label>
              <input type="text" class="form-control" v-model="busquedaClienteEdit" @input="buscarClientesEdit"
                placeholder="Nombre" />
              <ul class="list-group mt-1" v-if="resultadosClienteEdit.length">
                <li v-for="c in resultadosClienteEdit" :key="c.id" class="list-group-item list-group-item-action"
                  @click="seleccionarClienteEdit(c)">
                  {{ c.name }} ({{ c.email }})
                </li>
              </ul>
            </div>

            <!-- Mesa -->
            <label class="form-label">Mesa</label>
            <select v-model="reservaEditada.table" class="form-select mb-3">
              <option v-for="m in mesas" :key="m.id" :value="m">
                Mesa {{ m.number }} - Estado: {{ m.status }}
              </option>
            </select>

            <!-- Fecha -->
            <label class="form-label">Fecha y Hora</label>
            <input v-model="reservaEditada.date" type="datetime-local" class="form-control mb-3" />

            <!-- Estado -->
            <label class="form-label">Estado</label>
            <select v-model="reservaEditada.status" class="form-select mb-3 w-50">
              <option :value="true">Confirmada</option>
              <option :value="false">Pendiente</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-warning" @click="actualizarReserva">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta, confirmar } from "@/functions.js";
import Modal from "bootstrap/js/dist/modal";
import {
  getReservationsPaginated,
  getReservationsByStatusPaginated,
  getReservationsByDatePaginated,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} from "@/services/reservation.js";
import { getTables } from "@/services/tables.js";

export default {
  name: "GestionReserva",
  data() {
    return {
      reservas: [],
      mesas: [],
      mesasDisponibles: [],
      reservaNueva: { customer: null, table: null, date: "", status: true },
      reservaEditada: { id: null, customer: null, table: null, date: "", status: true },
      cargando: false,
      modalAgregar: null,
      modalEditar: null,
      filtroFecha: "",
      filtroEstado: "",
      busquedaCliente: "",
      resultadosCliente: [],
      busquedaClienteEdit: "",
      resultadosClienteEdit: [],
      page: 0,
      size: 4,
      totalPaginas: 0,
      totalElementos: 0,
    };
  },
  async mounted() {
    this.modalAgregar = new Modal(this.$refs.modalAgregar);
    this.modalEditar = new Modal(this.$refs.modalEditar);
    await this.obtenerReservasPaginadas();
    await this.cargarMesasDisponibles();
  },
  methods: {
    async obtenerReservasPaginadas() {
      this.cargando = true;
      try {
        const data = await getReservationsPaginated(this.page, this.size);
        this.reservas = data.content;
        this.totalPaginas = data.totalPages;
        this.totalElementos = data.totalElements;
      } catch {
        mostrarAlerta("Error al cargar reservas", "danger");
      } finally {
        this.cargando = false;
      }
    },

    async cambiarPagina(nuevaPagina) {
      if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas) {
        this.page = nuevaPagina;

        if (this.filtroFecha) {
          await this.filtrarPorFecha();
        } else if (this.filtroEstado !== "") {
          await this.filtrarPorEstado();
        } else {
          await this.obtenerReservasPaginadas();
        }
      }
    },

    async filtrarPorEstado() {
      if (this.filtroEstado === "") {
        await this.obtenerReservasPaginadas();
        return;
      }

      try {
        const data = await getReservationsByStatusPaginated(this.filtroEstado, this.page, this.size);
        this.reservas = data.content;
        this.totalPaginas = data.totalPages;
        this.totalElementos = data.totalElements;
      } catch {
        mostrarAlerta("Error al filtrar por estado", "danger");
      }
    },

    async filtrarPorFecha() {
      if (!this.filtroFecha) {
        await this.obtenerReservasPaginadas();
        return;
      }

      if (this.filtroFecha.length !== 10) {
        return;
      }

      this.cargando = true;
      try {
        const data = await getReservationsByDatePaginated(this.filtroFecha, this.page, this.size);

        this.reservas = data?.content || [];
        this.totalPaginas = data?.totalPages || 0;
        this.totalElementos = data?.totalElements || 0;

        if (this.reservas.length === 0) {
          mostrarAlerta("No se encontraron reservas para esta fecha", "info");
        }

      } catch (error) {
        console.error("Error filtrando por fecha:", error);
        mostrarAlerta("Error al filtrar por fecha", "danger");
      } finally {
        this.cargando = false;
      }
    },

    limpiarFiltros() {
      this.filtroFecha = "";
      this.filtroEstado = "";
      this.page = 0;
      this.obtenerReservasPaginadas();
    },

    async cargarMesasDisponibles() {
      try {
        this.mesas = await getTables();
        this.mesasDisponibles = this.mesas.filter((m) => m.status === "AVAILABLE");
      } catch {
        mostrarAlerta("Error cargando mesas.", "danger");
      }
    },

    abrirModalAgregar() {
      this.reservaNueva = { customer: null, table: null, date: "", status: true };
      this.busquedaCliente = "";
      this.resultadosCliente = [];
      this.modalAgregar.show();
    },

    async guardarReserva() {
      if (!this.reservaNueva.customer || !this.reservaNueva.table || !this.reservaNueva.date)
        return mostrarAlerta("Completa todos los campos", "warning");

      try {
        const payload = {
          customer: { id: this.reservaNueva.customer.id },
          table: { id: this.reservaNueva.table.id },
          date: this.reservaNueva.date,
          status: this.reservaNueva.status,
        };
        await createReservation(payload);
        mostrarAlerta("Reserva creada correctamente", "success");
        await this.obtenerReservasPaginadas();
        this.modalAgregar.hide();
      } catch {
        mostrarAlerta("Error al crear la reserva", "danger");
      }
    },

    async obtenerPorId(id) {
      try {
        const r = await getReservationById(id);
        this.reservaEditada = { ...r, date: r.date.slice(0, 16) };
        this.modalEditar.show();
      } catch {
        mostrarAlerta("Error al obtener la reserva", "danger");
      }
    },

    async actualizarReserva() {
      try {
        await updateReservation({
          id: this.reservaEditada.id,
          customer: { id: this.reservaEditada.customer.id },
          table: { id: this.reservaEditada.table.id },
          date: this.reservaEditada.date,
          status: this.reservaEditada.status,
        });
        mostrarAlerta("Reserva actualizada", "success");
        await this.obtenerReservasPaginadas();
        this.modalEditar.hide();
      } catch {
        mostrarAlerta("Error al actualizar la reserva", "danger");
      }
    },

    async eliminarReserva(id) {
      const confirmado = await confirmar("Eliminar reserva", "¿Estás seguro?");
      if (!confirmado) return;
      try {
        await deleteReservation(id);
        mostrarAlerta("Reserva eliminada", "success");
        await this.obtenerReservasPaginadas();
      } catch {
        mostrarAlerta("Error al eliminar la reserva", "danger");
      }
    },

    formatDate(fecha) {
      return new Date(fecha).toLocaleString();
    },
  },
};
</script>


<style>
.reservas-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.reservas-title {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.reservas-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

.reservas-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.btn-guardar,
.btn-buscar {
  cursor: pointer;
}

.reservas-table-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
  overflow: hidden;
}

.reserva-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid #eee;
}

.reserva-row:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

.badge {
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
}


.empty-icon {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1rem;
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

@media (max-width: 768px) {
  .reservas-container {
    padding: 1rem;
  }

  .reservas-actions {
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
