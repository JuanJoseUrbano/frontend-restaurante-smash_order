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
    formatDate(fecha) {
      return new Date(fecha).toLocaleString();
    }
  }
};
</script>

<style>
.pagos-container {
  padding: 1.5rem 2rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.pagos-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 1rem;
  background: linear-gradient(90deg, #fff, #f7f3f2);
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(88, 14, 0, 0.12);
}

.pagos-title {
  color: #580e00;
  font-weight: 800;
  margin-bottom: 0.4rem;
  font-size: 2.4rem;
  letter-spacing: 0.5px;
}

.pagos-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.pagos-actions {
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  padding: 1.2rem 1.8rem !important;
  margin-bottom: 2rem;
}

.btn-guardar {
  background: #580e00;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.25s ease;
  padding: 0.65rem 1.3rem;
}

.btn-guardar:hover {
  background: #761f11;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(88, 14, 0, 0.25);
}

.btn-buscar {
  background: #580e00;
  color: white;
  border: none;
  transition: all 0.2s ease;
  border-radius: 0 8px 8px 0;
}

.btn-buscar:hover {
  background: #761f11;
}

.search-input {
  border-radius: 8px 0 0 8px;
  border: 1px solid #ddd;
  box-shadow: none;
  transition: border 0.2s ease;
}

.search-input:focus {
  border-color: #580e00;
}

.state-select {
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: border 0.2s ease;
}

.state-select:focus {
  border-color: #580e00;
  box-shadow: none;
}

.pagos-table-container {
  background: white;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
}

.table {
  border-collapse: separate;
  border-spacing: 0 8px;
}

.table thead {
  background: #faf7f7;
  border-bottom: 2px solid #ddd;
}

.table thead th {
  color: #580e00;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.table tbody tr {
  background: #fff;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background: #fff8f6;
  transform: scale(1.005);
}

.table td {
  vertical-align: middle;
  padding: 0.9rem;
  border-top: none;
}

.action-buttons .btn {
  border-radius: 6px;
  padding: 0.45rem 0.75rem;
  transition: all 0.25s ease;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: #999;
}

.empty-icon {
  font-size: 3.5rem;
  color: #580e00;
  margin-bottom: 1rem;
}
.loading-spinner {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-spinner p {
  margin-top: 1rem;
  color: #580e00;
  font-weight: 600;
}
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.modal-header {
  border-bottom: none;
}

.modal-footer {
  border-top: none;
}

.modal-body label {
  font-weight: 600;
  color: #333;
}

.modal-body .form-control,
.modal-body .form-select {
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border 0.2s ease;
}

.modal-body .form-control:focus,
.modal-body .form-select:focus {
  border-color: #580e00;
  box-shadow: none;
}

.list-group-item-action {
  cursor: pointer;
  transition: background 0.2s ease;
}

.list-group-item-action:hover {
  background: #fff3ef;
}
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #c1b0ad;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a58a86;
}
</style>
