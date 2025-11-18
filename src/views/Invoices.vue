<template>
  <div class="pagos-container">
    <!-- HEADER -->
    <div class="pagos-header shadow-sm">
      <h1 class="pagos-title">Gestión de Pagos</h1>
      <p class="pagos-subtitle">Administra los pagos registrados en el sistema</p>
    </div>

    <!-- ACCIONES -->
    <div class="pagos-actions card p-3 mb-4 shadow-sm">
      <div class="row g-3 align-items-center">
        <div class="col-md-auto">
          <button class="btn btn-guardar d-flex align-items-center" @click="abrirModalAgregar()">
            <i class="fas fa-plus-circle me-2"></i> Nuevo Pago
          </button>
        </div>
        <div class="col-md-auto">
          <div class="input-group search-small">
            <input type="text" class="form-control search-input" v-model="filtroRecibo" placeholder="Buscar recibo" />
            <button @click="buscarPorRecibo" class="btn btn-buscar">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="col-md-auto">
          <select class="form-select state-select" v-model="filtroEstado" @change="filtrarPorEstado">
            <option value="">Estados</option>
            <option value="PAID">Pagados</option>
            <option value="PENDING">Pendientes</option>
            <option value="CANCELLED">Cancelados</option>
            <option value="REFUNDED">Reembolsados</option>
          </select>
        </div>
        <div class="col-md-auto">
          <button class="btn btn-outline-secondary" @click="limpiarFiltros">
            <i class="fas fa-eraser me-1"></i> Limpiar
          </button>
        </div>
        <div class="col-md-auto ms-auto text-end">
          <span class="badge bg-info fs-6">{{ pagos.length }} Resultados</span>
        </div>
      </div>
    </div>

    <!-- TABLA PAGOS -->
    <div class="pagos-table-container shadow-sm">
      <div v-if="cargando" class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando Pagos...</p>
      </div>
      <div v-else-if="pagos.length === 0" class="empty-state">
        <i class="fas fa-money-check-alt empty-icon"></i>
        <h4>No hay pagos registrados</h4>
        <p>Agrega un pago para empezar</p>
      </div>
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th class="text-center"># Pedido</th>
              <th class="text-center">Cliente</th>
              <th class="text-center">Mesa</th>
              <th class="text-center">Estado Pedido</th>
              <th class="text-center">Método Pago</th>
              <th class="text-center">Monto</th>
              <th class="text-center">Fecha Pago</th>
              <th class="text-center">Recibo</th>
              <th class="text-center">Estado Pago</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pagos" :key="p.id" class="pago-row">
              <td class="text-center">{{ p.order.id }}</td>
              <td class="text-center">{{ p.order?.customer?.name }}</td>
              <td class="text-center">Mesa {{ p.order?.table?.number }}</td>
              <td class="text-center">{{ traducirEstadoPedido(p.order?.status) }}</td>
              <td class="text-center">{{ p.paymentMethod?.name }}</td>
              <td class="text-center">${{ p.total.toLocaleString() }}</td>
              <td class="text-center">{{ !p.paymentDate || p.paymentDate.startsWith('1969-12-31') ? 'Sin pago' : formatDate(p.paymentDate) }}</td>
              <td class="text-center">{{ p.receiptNumber }}</td>
              <td class="text-center">
                <span :class="['badge fs-6',
                  p.status === 'PAID' ? 'bg-success' :
                    p.status === 'PENDING' ? 'bg-warning text-dark' :
                      p.status === 'CANCELLED' ? 'bg-danger' :
                        'bg-secondary']">
                  {{ traducirEstado(p.status) }}
                </span>
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline-warning me-2" @click="obtenerPorId(p.id)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-info me-2" @click="generarPDF(p)">
                    <i class="fas fa-file-pdf"></i>
                  </button>

                  <button class="btn btn-sm btn-outline-danger" @click="eliminarPago(p.id)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL AGREGAR -->
    <div class="modal fade" id="modalAgregarPago" tabindex="-1" aria-hidden="true" ref="modalAgregar">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Agregar Pago</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Pedido autocomplete -->
            <div class="mb-3">
              <label class="form-label">Pedido</label>
              <input type="text" class="form-control" v-model="busquedaPedido"
                placeholder="Buscar pedido por # o cliente" @input="filtrarPedidos" />
              <ul class="list-group mt-1" v-if="resultadosPedido.length">
                <li v-for="o in resultadosPedido" :key="o.id" class="list-group-item list-group-item-action"
                  @click="seleccionarPedidoNuevo(o)">
                  #{{ o.id }} - {{ o.customer?.name }} - Mesa {{ o.table?.number }}
                </li>
              </ul>
            </div>

            <!-- Método -->
            <label class="form-label">Método de Pago</label>
            <select v-model="pagoNuevo.paymentMethodId" class="form-select mb-3">
              <option disabled value="">Seleccione un método</option>
              <option v-for="m in metodos" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>

            <!-- Estado -->
            <label class="form-label">Estado</label>
            <select v-model="pagoNuevo.status" class="form-select mb-3 w-50">
              <option value="PAID">Pagado</option>
              <option value="PENDING">Pendiente</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-success" @click="guardarPago">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDITAR -->
    <div class="modal fade" id="modalEditarPago" tabindex="-1" aria-hidden="true" ref="modalEditar">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title">Editar Pago</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Pedido autocomplete en edición -->
            <div class="mb-3">
              <label class="form-label">Pedido / Mesa</label>
              <input type="text" class="form-control" v-model="busquedaPedidoEdit"
                placeholder="Buscar pedido por # o cliente" @input="filtrarPedidosEdit" />
              <ul class="list-group mt-1" v-if="resultadosPedidoEdit.length">
                <li v-for="o in resultadosPedidoEdit" :key="o.id" class="list-group-item list-group-item-action"
                  @click="seleccionarPedidoEdit(o)">
                  #{{ o.id }} - {{ o.customer?.name }} - Mesa {{ o.table?.number }}
                </li>
              </ul>
            </div>

            <!-- Método -->
            <label class="form-label">Método de Pago</label>
            <select v-model="pagoEditado.paymentMethodId" class="form-select mb-3">
              <option disabled value="">Seleccione un método</option>
              <option v-for="m in metodos" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>

            <!-- Recibo -->
            <label class="form-label">Número de Recibo</label>
            <input v-model="pagoEditado.receiptNumber" type="text" class="form-control mb-3" />

            <!-- Estado -->
            <label class="form-label">Estado</label>
            <select v-model="pagoEditado.status" class="form-select mb-3 w-50">
              <option value="PAID">Pagado</option>
              <option value="PENDING">Pendiente</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-warning" @click="actualizarPago">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta, confirmar } from "@/functions.js";
import { jsPDF } from "jspdf";
import Modal from "bootstrap/js/dist/modal";
import { getInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice } from "@/services/invoices.js";
import { getPayments } from "@/services/paymentMethods.js";
import { getOrdersWithoutInvoice } from "@/services/orders.js";

export default {
  name: "GestionPagos",
  data() {
    return {
      pagos: [],
      pagosOriginales: [],
      pedidos: [],
      metodos: [],
      pagoNuevo: { orderId: "", paymentMethodId: "", status: "PENDING" },
      pagoEditado: { id: null, orderId: "", paymentMethodId: "", receiptNumber: "", status: "PENDING" },
      cargando: false,
      modalAgregar: null,
      modalEditar: null,
      filtroRecibo: "",
      filtroEstado: "",
      busquedaPedido: "",
      resultadosPedido: [],
      busquedaPedidoEdit: "",
      resultadosPedidoEdit: [],
    };
  },
  async mounted() {
    this.modalAgregar = new Modal(this.$refs.modalAgregar);
    this.modalEditar = new Modal(this.$refs.modalEditar);
    await this.obtenerPagos();
    await this.cargarMetodos();
    await this.cargarPedidos();
  },
  methods: {

    async obtenerPagos() {
      this.cargando = true;
      try {
        const data = await getInvoices();
        this.pagosOriginales = data;
        this.pagos = [...data];
      } catch {
        mostrarAlerta("Error al cargar los pagos", "danger");
      } finally {
        this.cargando = false;
      }
    },

    async cargarMetodos() {
      this.cargando = true;
      try { this.metodos = await getPayments(); }
      catch { mostrarAlerta("Error al cargar los métodos de pago", "danger"); }
      finally { this.cargando = false; }
    },

    async cargarPedidos() {
      this.cargando = true;
      try { this.pedidos = await getOrdersWithoutInvoice(); }
      catch { mostrarAlerta("Error al cargar los pedidos", "danger"); }
      finally { this.cargando = false; }
    },

    abrirModalAgregar() {
      this.pagoNuevo = { orderId: "", paymentMethodId: "", status: "PENDING" };
      this.busquedaPedido = "";
      this.resultadosPedido = [];
      this.modalAgregar.show();
    },

    async guardarPago() {
      if (!this.pagoNuevo.orderId || !this.pagoNuevo.paymentMethodId) {
        mostrarAlerta("Completa todos los campos", "warning");
        return;
      }

      const body = {
        order: { id: this.pagoNuevo.orderId },
        status: this.pagoNuevo.status,
        paymentMethod: { id: this.pagoNuevo.paymentMethodId }
      };

      try {
        await createInvoice(body);
        mostrarAlerta("Pago creado correctamente", "success");
        await this.obtenerPagos();
        this.modalAgregar.hide();
      } catch (error) {
        console.error(error);
        mostrarAlerta("Error al crear el pago", "danger");
      }
    },

    async obtenerPorId(id) {
      try {
        const p = await getInvoiceById(id);
        this.pagoEditado = {
          id: p.id,
          orderId: p.order?.id || "",
          paymentMethodId: p.paymentMethod?.id,
          receiptNumber: p.receiptNumber,
          status: p.status
        };
        this.busquedaPedidoEdit = `#${p.order?.id} - ${p.order?.customer?.name} - Mesa ${p.order?.table?.number}`;
        this.resultadosPedidoEdit = [];
        this.modalEditar.show();
      } catch { mostrarAlerta("Error al obtener el pago", "danger"); }
    },

    async actualizarPago() {
      // Validación básica de campos requeridos
      if (!this.pagoEditado.orderId || !this.pagoEditado.paymentMethodId || !this.pagoEditado.receiptNumber) {
        mostrarAlerta("Completa todos los campos", "warning");
        return;
      }

      const body = {
        order: { id: this.pagoEditado.orderId },
        receiptNumber: this.pagoEditado.receiptNumber,
        status: this.pagoEditado.status,
        paymentMethod: { id: this.pagoEditado.paymentMethodId }
      };

      try {
        console.log("Body enviado:", body);
        await updateInvoice(this.pagoEditado.id, body);


        mostrarAlerta("Pago actualizado correctamente", "success");

        // Actualiza la lista en segundo plano sin duplicar llamadas
        await this.actualizarListaPagos();

        // Cierra el modal después de actualizar
        this.modalEditar.hide();
      } catch (error) {
        console.error("Error al actualizar el pago:", error);
        mostrarAlerta("Error al actualizar el pago", "danger");
      }
    },

    async actualizarListaPagos() {
      if (this.actualizandoPagos) return; // Previene ejecuciones múltiples simultáneas

      this.actualizandoPagos = true;
      try {
        // Obtiene los pagos actualizados desde el backend
        await this.obtenerPagos();

        // Aplica filtros si el usuario está filtrando por estado o método
        if (typeof this.aplicarFiltros === "function") {
          this.aplicarFiltros();
        }
      } catch (error) {
        console.error("Error actualizando la lista de pagos:", error);
        mostrarAlerta("No se pudo actualizar la lista de pagos", "danger");
      } finally {
        this.actualizandoPagos = false;
      }
    },

    async eliminarPago(id) {
      try {
        const confirmado = await confirmar("Eliminar pago", "¿Estás seguro?");
        if (confirmado) {
          await deleteInvoice(id);
          mostrarAlerta("Pago eliminado correctamente", "success");
          await this.obtenerPagos();
        }
      } catch { mostrarAlerta("Error al eliminar el pago", "danger"); }
    },
    generarPDF(pago) {
      const doc = new jsPDF();

      const img = new Image();
      img.src = require("../assets/logo_smash_order.png");
      img.onload = () => {
        doc.addImage(img, 'PNG', 20, 10, 40, 20);

        doc.setTextColor("#580e00");
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Comprobante de Pago", 105, 40, null, null, "center");

        doc.setDrawColor("#580e00");
        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`# Pedido: ${pago.order.id}`, 20, 55);
        doc.text(`Cliente: ${pago.order?.customer?.name || "-"}`, 20, 65);
        doc.text(`Mesa: ${pago.order?.table?.number || "-"}`, 20, 75);
        doc.text(`Estado Pedido: ${this.traducirEstadoPedido(pago.order?.status)}`, 20, 85);

        doc.text(`Método de Pago: ${pago.paymentMethod?.name || "-"}`, 20, 105);
        doc.text(`Monto: $${pago.total.toLocaleString()}`, 20, 115);
        doc.text(`Fecha Pago: ${this.formatDate(pago.paymentDate)}`, 20, 125);
        doc.text(`Número de Recibo: ${pago.receiptNumber}`, 20, 135);
        doc.text(`Estado Pago: ${this.traducirEstado(pago.status)}`, 20, 145);

        doc.setDrawColor("#580e00");
        doc.line(20, 150, 190, 150);

        doc.setFontSize(10);
        doc.setTextColor("#580e00");
        doc.text("Gracias por tu compra. Smash Order", 105, 160, null, null, "center");

        doc.save(`comprobante_pago_${pago.receiptNumber}.pdf`);
      };
    },

    buscarPorRecibo() { this.aplicarFiltros(); },
    filtrarPorEstado() { this.aplicarFiltros(); },
    limpiarFiltros() { this.filtroRecibo = ""; this.filtroEstado = ""; this.pagos = [...this.pagosOriginales]; },
    aplicarFiltros() {
      let filtrados = [...this.pagosOriginales];
      if (this.filtroRecibo) filtrados = filtrados.filter(p => p.receiptNumber.toLowerCase().includes(this.filtroRecibo.toLowerCase()));
      if (this.filtroEstado) filtrados = filtrados.filter(p => p.status === this.filtroEstado);
      this.pagos = filtrados;
    },

    filtrarPedidos() {
      const busq = this.busquedaPedido.toLowerCase();
      this.resultadosPedido = this.pedidos.filter(p =>
        String(p.id).includes(busq) ||
        p.customer?.name?.toLowerCase().includes(busq)
      );
    },
    seleccionarPedidoNuevo(pedido) {
      this.pagoNuevo.orderId = pedido.id;
      this.busquedaPedido = `#${pedido.id} - ${pedido.customer?.name} - Mesa ${pedido.table?.number}`;
      this.resultadosPedido = [];
    },

    filtrarPedidosEdit() {
      const busq = this.busquedaPedidoEdit.toLowerCase();
      this.resultadosPedidoEdit = this.pedidos.filter(p =>
        String(p.id).includes(busq) ||
        p.customer?.name?.toLowerCase().includes(busq)
      );
    },
    seleccionarPedidoEdit(pedido) {
      this.pagoEditado.orderId = pedido.id;
      this.busquedaPedidoEdit = `#${pedido.id} - ${pedido.customer?.name} - Mesa ${pedido.table?.number}`;
      this.resultadosPedidoEdit = [];
    },

    traducirEstado(estado) {
      if (estado === "PAID") return "Pagado";
      if (estado === "PENDING") return "Pendiente";
      if (estado === "CANCELLED") return "Cancelado";
      if (estado === "REFUNDED") return "Reembolsado";
      return estado;
    },
    traducirEstadoPedido(estado) {
      if (estado === "PENDING") return "Pendiente";
      if (estado === "IN_PROGRESS") return "En progreso";
      if (estado === "COMPLETED") return "Completado";
      if (estado === "CANCELLED") return "Cancelado";
      return estado;
    },
    formatDate(fecha) {
      return new Date(fecha).toLocaleString();
    }
  }
};
</script>

<style>
.pagos-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.pagos-title {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.pagos-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

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
  background-color: var(--primary-color, #e63946);
  color: #fff;
}

.btn-agregar:hover {
  background-color: var(--primary-dark, #c62828);
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: var(--primary-color, #e63946);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.categorias-subtitle {
  color: var(--text-light, #777);
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
