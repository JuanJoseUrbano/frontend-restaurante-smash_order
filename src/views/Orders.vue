<template>
    <div class="pedidos-container">
        <!-- HEADER -->
        <div class="pedidos-header shadow-sm">
            <h1 class="pedidos-title">Gestión de Pedidos</h1>
            <p class="pedidos-subtitle">Consulta y administra los pedidos registrados</p>
        </div>

        <!-- ACCIONES -->
        <div class="pedidos-actions card shadow-sm p-3 mb-4 border-0">
            <div class="row g-3 align-items-center">

                <!-- Búsqueda -->
                <div class="input-group">
                    <input type="text" class="form-control search-input" v-model="filtro"
                        placeholder="🔍 Buscar por cliente..." />
                    <button @click="filtrarBusqueda" class="btn btn-search">
                        <i class="fas fa-search"></i>
                    </button>
                </div>

                <!-- Estado -->
                <div class="col-lg-2 col-md-3">
                    <select class="form-select" v-model="filtroEstado" @change="filtrarPorEstado">
                        <option value="0">Todos</option>
                        <option value="PENDING">Pendiente</option>
                        <option value="IN_PROGRESS">En proceso</option>
                        <option value="COMPLETED">Completado</option>
                        <option value="CANCELLED">Cancelado</option>
                    </select>
                </div>

                <!-- Fecha -->
                <div class="col-lg-2 col-md-3">
                    <input type="date" class="form-control" v-model="filtroFecha" @change="filtrarPorFecha" />
                </div>

                <!-- Limpiar -->
                <div class="col-lg-auto col-md-6">
                    <button class="btn btn-outline-secondary w-100" @click="limpiarFiltros">
                        <i class="fas fa-eraser me-1"></i> Limpiar
                    </button>
                </div>

                <!-- Nuevo Pedido -->
                <div class="col-lg-auto col-md-6">
                    <button class="btn btn-success w-100" @click="nuevoPedido">
                        <i class="fas fa-plus me-1"></i> Nuevo Pedido
                    </button>
                </div>

                <!-- Badge resultados -->
                <div class="col-lg-auto ms-lg-auto text-end">
                    <span class="badge bg-info text-dark fs-6 px-3 py-2 shadow-sm">
                        {{ pedidos.length }} Resultados
                    </span>
                </div>
            </div>
        </div>


        <!-- TABLA -->
        <div class="pedidos-table-container shadow-sm">
            <div v-if="cargando" class="loading-spinner">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando Pedidos...</p>
            </div>

            <div v-else-if="pedidos.length === 0" class="empty-state">
                <i class="fas fa-clipboard-list empty-icon"></i>
                <h4>No hay pedidos registrados</h4>
                <p>Cuando se generen pedidos aparecerán aquí</p>
            </div>

            <div v-else class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center">#</th>
                            <th>Cliente</th>
                            <th class="text-center">Mesa</th>
                            <th class="text-center">Fecha</th>
                            <th class="text-center">Estado</th>
                            <th class="text-center">Total</th>
                            <th class="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in pedidos" :key="o.id" class="pedido-row">
                            <td class="text-center">{{ o.id }}</td>
                            <td>{{ o.customer?.name }}</td>
                            <td class="text-center">Mesa {{ o.table?.number }}</td>
                            <td class="text-center">{{ formatDate(o.date) }}</td>
                            <td class="text-center">
                                <span class="badge" :class="badgeClass(o.status)">{{ traducirEstado(o.status) }}</span>
                            </td>
                            <td class="text-center">
                                <span class="badge bg-success fs-6">${{ (o.total || 0).toFixed(2) }}</span>
                            </td>
                            <td class="text-center">
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-outline-info me-2" @click="verDetalle(o)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning me-2" @click="editarPedido(o)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button @click="eliminarPedido(o.id)" class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL DETALLE -->
        <div class="modal fade" id="modalDetallePedido" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content shadow-lg">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title">Detalle del Pedido #{{ pedidoSeleccionado?.id }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="pedidoSeleccionado">
                            <p><strong>Cliente:</strong> {{ pedidoSeleccionado.customer?.name }}</p>
                            <p><strong>Mesa:</strong> {{ pedidoSeleccionado.table?.number }}</p>
                            <hr />
                            <table class="table table-sm table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th class="text-center">Cantidad</th>
                                        <th class="text-center">Precio</th>
                                        <th class="text-center">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="d in pedidoSeleccionado.orderDetails" :key="d.id">
                                        <td>{{ d.product.name }}</td>
                                        <td class="text-center">{{ d.quantity }}</td>
                                        <td class="text-center">${{ (d.product?.price || 0).toFixed(2) }}</td>
                                        <td class="text-center">${{ (d.subtotal || 0).toFixed(2) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="text-end">
                                <strong>Total: ${{ (pedidoSeleccionado.total || 0).toFixed(2) }}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL EDITAR -->
        <div class="modal fade" id="modalEditarPedido" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content shadow-lg">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Pedido #{{ pedidoSeleccionado?.id }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="pedidoSeleccionado">
                        <!-- Cliente -->
                        <div class="mb-3">
                            <label class="form-label">Buscar Cliente</label>
                            <input type="text" class="form-control" v-model="busquedaCliente" @input="buscarClientes"
                                placeholder="Nombre, usuario o email" />
                            <ul class="list-group mt-1" v-if="resultadosCliente.length">
                                <li v-for="c in resultadosCliente" :key="c.id"
                                    class="list-group-item list-group-item-action" @click="seleccionarCliente(c)">
                                    {{ c.name }} ({{ c.email }})
                                </li>
                            </ul>
                        </div>

                        <!-- Mesa (select) -->
                        <div class="mb-3">
                            <label class="form-label">Mesa</label>
                            <select class="form-select" v-model="pedidoSeleccionado.table.id">
                                <option v-for="m in mesasDisponibles" :key="m.id" :value="m.id">
                                    Mesa {{ m.number }}
                                </option>
                            </select>
                        </div>

                        <!-- Estado -->
                        <div class="mb-3">
                            <label class="form-label">Estado</label>
                            <select class="form-select" v-model="pedidoSeleccionado.status">
                                <option value="PENDING">Pendiente</option>
                                <option value="IN_PROGRESS">En proceso</option>
                                <option value="COMPLETED">Completado</option>
                                <option value="CANCELLED">Cancelado</option>
                            </select>
                        </div>

                        <!-- Productos -->
                        <div class="mb-3">
                            <label class="form-label">Productos</label>
                            <table class="table table-sm table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th class="text-center">Cantidad</th>
                                        <th class="text-center">Precio</th>
                                        <th class="text-center">Subtotal</th>
                                        <th class="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(d, index) in pedidoSeleccionado.orderDetails" :key="d.id">
                                        <td>
                                            <select class="form-select" v-model="d.product.id"
                                                @change="actualizarProducto(d, 'editar')">
                                                <option v-for="p in productosDisponibles" :key="p.id" :value="p.id">
                                                    {{ p.name }}
                                                </option>
                                            </select>
                                        </td>
                                        <td class="text-center">
                                            <input type="number" class="form-control form-control-sm text-center"
                                                v-model.number="d.quantity" @input="recalcularSubtotal(d, 'editar')"
                                                min="1" />
                                        </td>
                                        <td class="text-center">${{ (d.product?.price || 0).toFixed(2) }}</td>
                                        <td class="text-center">${{ (d.subtotal || 0).toFixed(2) }}</td>
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-danger"
                                                @click="eliminarProducto(index, 'editar')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button class="btn btn-sm btn-outline-primary mt-2" @click="agregarProducto('editar')">
                                <i class="fas fa-plus me-1"></i> Agregar producto
                            </button>
                        </div>

                        <!-- Total -->
                        <div class="mb-3 text-end">
                            <strong>Total: ${{ (pedidoSeleccionado.total || 0).toFixed(2) }}</strong>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i> Cancelar
                        </button>
                        <button class="btn btn-editar" @click="guardarCambios">
                            <i class="fas fa-save me-1"></i> Guardar cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>



        <!-- MODAL NUEVO + CAMPOS DE PAGO -->
        <div class="modal fade" id="modalNuevoPedido" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content shadow-lg">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">Nuevo Pedido</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="pedidoNuevo">
                        <!-- Cliente -->
                        <div class="mb-3">
                            <label class="form-label">Buscar Cliente</label>
                            <input type="text" class="form-control" v-model="busquedaCliente" @input="buscarClientes"
                                placeholder="Nombre, usuario o email" />
                            <ul class="list-group mt-1" v-if="resultadosCliente.length">
                                <li v-for="c in resultadosCliente" :key="c.id"
                                    class="list-group-item list-group-item-action" @click="seleccionarClienteNuevo(c)">
                                    {{ c.name }} ({{ c.email }})
                                </li>
                            </ul>
                        </div>

                        <!-- Mesa -->
                        <div class="mb-3">
                            <label class="form-label">Mesa</label>
                            <select class="form-select" v-model="pedidoNuevo.table.id">
                                <option v-for="m in mesasDisponibles" :key="m.id" :value="m.id">
                                    Mesa {{ m.number }}
                                </option>
                            </select>
                        </div>

                        <!-- Productos -->
                        <div class="mb-3">
                            <label class="form-label">Productos</label>
                            <table class="table table-sm table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th class="text-center">Cantidad</th>
                                        <th class="text-center">Precio</th>
                                        <th class="text-center">Subtotal</th>
                                        <th class="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(d, index) in (pedidoNuevo?.orderDetails || [])" :key="index">
                                        <td>
                                            <select class="form-select" v-model="d.product.id"
                                                @change="actualizarProducto(d, 'nuevo')">
                                                <option v-for="p in productosDisponibles" :key="p.id" :value="p.id">
                                                    {{ p.name }}
                                                </option>
                                            </select>
                                        </td>
                                        <td class="text-center">
                                            <input type="number" class="form-control form-control-sm text-center"
                                                v-model.number="d.quantity" @input="recalcularSubtotal(d, 'nuevo')"
                                                min="1" />
                                        </td>
                                        <td class="text-center">${{ (d.product?.price || 0).toFixed(2) }}</td>
                                        <td class="text-center">${{ (d.subtotal || 0).toFixed(2) }}</td>
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-danger"
                                                @click="eliminarProducto(index, 'nuevo')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button class="btn btn-sm btn-primary mt-2" @click="agregarProducto('nuevo')">
                                <i class="fas fa-plus me-1"></i> Agregar producto
                            </button>
                        </div>

                        <!-- Total -->
                        <div class="mb-3 text-end">
                            <strong>Total: ${{ (pedidoNuevo?.total || 0).toFixed(2) }}</strong>
                        </div>

                        <!-- CAMPOS DE PAGO -->
                        <hr>
                        <h4>Información de Pago</h4>

                        <!-- Método de Pago -->
                        <div class="mb-3">
                            <label class="form-label">Método de Pago</label>
                            <select v-model="invoice.paymentMethodId" class="form-select">
                                <option disabled value="">Seleccione un método</option>
                                <option v-for="m in metodos" :key="m.id" :value="m.id">{{ m.name }}</option>
                            </select>
                        </div>

                        <!-- Estado -->
                        <div class="mb-3 w-50">
                            <label class="form-label">Estado</label>
                            <select v-model="invoice.status" class="form-select">
                                <option value="PAID">Pagado</option>
                                <option value="PENDING">Pendiente</option>
                                <option value="CANCELLED">Cancelado</option>
                                <option value="REFUNDED">Reembolsado</option>
                            </select>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-success" @click="guardarNuevoPedido">Guardar Pedido</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mostrarAlerta, confirmar } from "@/functions.js";
import Modal from "bootstrap/js/dist/modal";
import { getOrders, deleteOrder, updateOrder, createOrder } from "@/services/orders";
import { getProducts } from "@/services/products";
import { getPayments } from "@/services/paymentMethods.js";
import { getTables } from "@/services/tables";
import { searchUsers } from "@/services/users";
import { nextTick } from "vue";

export default {
    name: "GestionPedidos",
    data() {
        return {
            pedidos: [],
            invoice: { paymentMethodId: "", status: "PENDING" },
            pedidosOriginales: [],
            pedidoSeleccionado: null,
            pedidoNuevo: null,
            cargando: false,
            modalDetalle: null,
            modalEditar: null,
            modalNuevo: null,
            filtro: "",
            filtroEstado: "0",
            filtroFecha: "",
            productosDisponibles: [],
            mesasDisponibles: [],
            busquedaCliente: "",
            resultadosCliente: [],
            actualizandoPedidos: false,
            timeoutBusqueda: null,
            timeoutFiltro: null,
            metodos: []
        };
    },
    mounted() {
        nextTick(() => {
            this.modalDetalle = new Modal(document.getElementById("modalDetallePedido"));
            this.modalEditar = new Modal(document.getElementById("modalEditarPedido"));
            this.modalNuevo = new Modal(document.getElementById("modalNuevoPedido"));
        });
        this.inicializarDatos();
    },
    methods: {
        async inicializarDatos() {
            this.cargando = true;
            try {
                await Promise.all([
                    this.obtenerPedidos(),
                    this.cargarProductos(),
                    this.cargarMesas(),
                    this.cargarMetodos()
                ]);
            } catch (error) {
                console.error('Error inicializando datos:', error);
                mostrarAlerta("Error al cargar los datos iniciales", "danger");
            } finally {
                this.cargando = false;
            }
        },

        async obtenerPedidos() {
            try {
                const pedidos = await getOrders();
                this.pedidosOriginales = pedidos;
                this.pedidos = [...pedidos];
            } catch (error) {
                console.error('Error obteniendo pedidos:', error);
                throw error;
            }
        },
        async cargarMetodos() {
            this.cargando = true;
            try { this.metodos = await getPayments(); }
            catch { mostrarAlerta("Error al cargar los métodos de pago", "danger"); }
            finally { this.cargando = false; }
        },

        async actualizarListaPedidos() {
            if (this.actualizandoPedidos) return;

            this.actualizandoPedidos = true;
            try {
                await this.obtenerPedidos();
                this.aplicarFiltros();
            } catch (error) {
                console.error('Error actualizando pedidos:', error);
            } finally {
                this.actualizandoPedidos = false;
            }
        },

        async cargarProductos() {
            try {
                this.productosDisponibles = await getProducts();
            } catch (error) {
                console.error('Error cargando productos:', error);
                throw error;
            }
        },

        async cargarMesas() {
            try {
                this.mesasDisponibles = await getTables();
            } catch (error) {
                console.error('Error cargando mesas:', error);
                throw error;
            }
        },

        async verDetalle(pedido) {
            this.pedidoSeleccionado = { ...pedido };
            await nextTick();
            this.modalDetalle.show();
        },

        async eliminarPedido(id) {
            try {
                const confirmado = await confirmar("Eliminar pedido", "¿Deseas eliminar este pedido?");
                if (confirmado) {
                    await deleteOrder(id);
                    this.pedidos = this.pedidos.filter(p => p.id !== id);
                    this.pedidosOriginales = this.pedidosOriginales.filter(p => p.id !== id);
                    mostrarAlerta("Pedido eliminado", "success");
                    this.actualizarListaPedidos();
                }
            } catch (error) {
                console.error('Error eliminando pedido:', error);
                mostrarAlerta("Error al eliminar el pedido", "danger");
            }
        },

        async editarPedido(pedido) {
            this.pedidoSeleccionado = JSON.parse(JSON.stringify(pedido));

            if (!Array.isArray(this.pedidoSeleccionado.orderDetails)) {
                this.pedidoSeleccionado.orderDetails = [];
            }

            await this.recalcularTodosSubtotales();
            this.busquedaCliente = this.pedidoSeleccionado.customer?.name || "";

            await nextTick();
            this.modalEditar.show();
        },

        async guardarCambios() {
            if (!this.validarPedido(this.pedidoSeleccionado)) return;

            try {
                this.recalcularTotal();

                const payload = this.prepararPayload(this.pedidoSeleccionado);
                const pedidoActualizado = await updateOrder(this.pedidoSeleccionado.id, payload);

                this.actualizarPedidoEnLista(pedidoActualizado);

                mostrarAlerta("Pedido actualizado correctamente", "success");
                this.modalEditar.hide();
                this.actualizarListaPedidos();
            } catch (error) {
                console.error('Error guardando cambios:', error);
                mostrarAlerta("Error al actualizar el pedido", "danger");
            }
        },

        aplicarFiltros() {
            this.pedidos = this.pedidosOriginales.filter(p => {
                const coincideCliente = !this.filtro.trim() ||
                    (p.customer?.name || "").toLowerCase().includes(this.filtro.toLowerCase());
                const coincideEstado = this.filtroEstado === "0" || p.status === this.filtroEstado;
                const coincideFecha = !this.filtroFecha || (p.date || "").startsWith(this.filtroFecha);
                return coincideCliente && coincideEstado && coincideFecha;
            });
        },

        async filtrarBusqueda() {
            if (this.timeoutFiltro) clearTimeout(this.timeoutFiltro);
            this.timeoutFiltro = setTimeout(() => this.aplicarFiltros(), 300);
        },

        async filtrarPorEstado() {
            if (this.timeoutFiltro) clearTimeout(this.timeoutFiltro);
            this.timeoutFiltro = setTimeout(() => this.aplicarFiltros(), 300);
        },

        async filtrarPorFecha() {
            if (this.timeoutFiltro) clearTimeout(this.timeoutFiltro);
            this.timeoutFiltro = setTimeout(() => this.aplicarFiltros(), 300);
        },

        async limpiarFiltros() {
            this.filtro = "";
            this.filtroEstado = "0";
            this.filtroFecha = "";
            this.pedidos = [...this.pedidosOriginales];
        },

        validarPedido(pedido) {
            if (!pedido.customer?.id) {
                mostrarAlerta("Seleccione un cliente válido.", "warning");
                return false;
            }
            if (!pedido.orderDetails?.length) {
                mostrarAlerta("Agregue al menos un producto.", "warning");
                return false;
            }
            return true;
        },

        prepararPayload(pedido) {
            return {
                customer: { id: pedido.customer.id },
                table: { id: pedido.table.id },
                status: pedido.status,
                orderDetails: pedido.orderDetails.map(d => ({
                    product: { id: d.product.id },
                    quantity: d.quantity
                })),
                invoice: {
                    status: this.invoice.status,
                    paymentMethod: {
                        id: this.invoice.paymentMethodId
                    }
                }
            };
        },

        actualizarPedidoEnLista(pedidoActualizado) {
            const index = this.pedidos.findIndex(p => p.id === pedidoActualizado.id);
            if (index !== -1) {
                this.pedidos[index] = { ...pedidoActualizado };
                this.pedidosOriginales[index] = { ...pedidoActualizado };
            }
        },

        agregarProducto(contexto = 'editar') {
            const pedido = contexto === 'nuevo' ? this.pedidoNuevo : this.pedidoSeleccionado;
            if (!pedido || !this.productosDisponibles.length) return;

            const producto = this.productosDisponibles[0];
            if (!pedido.orderDetails) pedido.orderDetails = [];

            pedido.orderDetails.push({
                id: Date.now(),
                product: { ...producto },
                quantity: 1,
                subtotal: (producto.price || 0) * 1,
            });

            this.recalcularTotalContexto(contexto);
        },

        async eliminarProducto(index, contexto = 'editar') {
            const pedido = contexto === 'nuevo' ? this.pedidoNuevo : this.pedidoSeleccionado;
            if (!pedido?.orderDetails) return;

            pedido.orderDetails.splice(index, 1);
            await this.recalcularTotalContexto(contexto);
        },

        async actualizarProducto(detalle, contexto = 'editar') {
            const prod = this.productosDisponibles.find(p => p.id === detalle.product.id);
            if (prod) {
                detalle.product = { ...prod };
                await this.recalcularSubtotal(detalle, contexto);
            }
        },

        async recalcularSubtotal(detalle, contexto = 'editar') {
            const precio = detalle.product?.price || 0;
            const cantidad = detalle.quantity || 0;
            detalle.subtotal = precio * cantidad;
            await this.recalcularTotalContexto(contexto);
        },

        async recalcularTodosSubtotales() {
            if (!this.pedidoSeleccionado?.orderDetails) return;

            this.pedidoSeleccionado.orderDetails.forEach(detalle => {
                const precio = detalle.product?.price || 0;
                const cantidad = detalle.quantity || 0;
                detalle.subtotal = precio * cantidad;
            });
            this.recalcularTotal();
        },

        recalcularTotal() {
            if (!this.pedidoSeleccionado?.orderDetails) return;

            this.pedidoSeleccionado.total = this.pedidoSeleccionado.orderDetails.reduce(
                (sum, d) => sum + (d.subtotal || (d.quantity * (d.product?.price || 0))),
                0
            );
        },

        async recalcularTotalContexto(contexto = 'editar') {
            const pedido = contexto === 'nuevo' ? this.pedidoNuevo : this.pedidoSeleccionado;
            if (!pedido?.orderDetails) return;

            await nextTick();

            pedido.total = pedido.orderDetails.reduce(
                (sum, d) => sum + (d.subtotal || (d.quantity * (d.product?.price || 0))),
                0
            );
        },

        async nuevoPedido() {
            this.pedidoNuevo = {
                customer: null,
                table: { id: this.mesasDisponibles[0]?.id || null },
                status: "PENDING",
                orderDetails: [],
                total: 0,
            };
            this.busquedaCliente = "";
            this.resultadosCliente = [];

            await nextTick();
            this.modalNuevo.show();
        },

        async guardarNuevoPedido() {
            if (!this.validarPedido(this.pedidoNuevo)) return;

            try {
                await this.recalcularTotalContexto('nuevo');

                const payload = this.prepararPayload(this.pedidoNuevo);
                const nuevoPedido = await createOrder(payload);

                this.pedidos.push(nuevoPedido);
                this.pedidosOriginales.push(nuevoPedido);

                mostrarAlerta("Pedido creado correctamente", "success");
                this.modalNuevo.hide();
                this.actualizarListaPedidos();

                setTimeout(() => {
                    this.pedidoNuevo = null;
                }, 500);

            } catch (error) {
                console.error('Error creando pedido:', error);
                mostrarAlerta("Error al crear el pedido", "danger");
            }
        },

        seleccionarClienteNuevo(cliente) {
            if (!this.pedidoNuevo) return;
            this.pedidoNuevo.customer = { id: cliente.id, name: cliente.name };
            this.busquedaCliente = cliente.name;
            this.resultadosCliente = [];
        },

        async buscarClientes() {
            if (this.timeoutBusqueda) clearTimeout(this.timeoutBusqueda);

            if (!this.busquedaCliente.trim() || this.busquedaCliente.length < 2) {
                this.resultadosCliente = [];
                return;
            }

            this.timeoutBusqueda = setTimeout(async () => {
                try {
                    this.resultadosCliente = await searchUsers(this.busquedaCliente);
                } catch (error) {
                    console.error('Error buscando clientes:', error);
                    mostrarAlerta("Error al buscar clientes", "danger");
                }
            }, 500);
        },

        seleccionarCliente(cliente) {
            if (!this.pedidoSeleccionado) return;
            this.pedidoSeleccionado.customer = { id: cliente.id, name: cliente.name };
            this.busquedaCliente = cliente.name;
            this.resultadosCliente = [];
        },

        formatDate(date) {
            return new Date(date).toLocaleString();
        },

        badgeClass(status) {
            return {
                "bg-warning": status === "PENDING",
                "bg-primary": status === "IN_PROGRESS",
                "bg-success": status === "COMPLETED",
                "bg-danger": status === "CANCELLED",
            };
        },

        traducirEstado(status) {
            switch (status) {
                case "PENDING": return "Pendiente";
                case "IN_PROGRESS": return "En proceso";
                case "COMPLETED": return "Completado";
                case "CANCELLED": return "Cancelado";
                default: return status;
            }
        },
    },
};
</script>

<style>
.pedidos-header {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.pedidos-title {
    color: var(--primary-color);
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 2.2rem;
}

.pedidos-subtitle {
    color: var(--text-light);
    font-size: 1.1rem;
}

.pedidos-actions {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.search-input {
    border-radius: 12px 0 0 12px !important;
    padding: 0.65rem 1rem;
    font-size: 0.95rem;
    border: 1px solid #dee2e6;
    box-shadow: none;
}

.search-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-search {
    border-radius: 0 12px 12px 0 !important;
    padding: 0.65rem 1rem;
    font-size: 1rem;
    background: #0d6efd;
    border: 1px solid #0d6efd;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-search:hover {
    background: #0b5ed7;
    border-color: #0a58ca;
}

.pedidos-actions .row {
    row-gap: 1rem;
    column-gap: 1rem;
}

.pedidos-actions .form-control,
.pedidos-actions .form-select {
    border-radius: 10px;
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
    box-shadow: none;
    transition: all 0.2s ease;
}

.pedidos-actions .form-control:focus,
.pedidos-actions .form-select:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.pedidos-actions .btn {
    border-radius: 10px;
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.pedidos-actions .btn i {
    margin-right: 0.3rem;
}

.pedidos-actions .badge {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    border-radius: 12px;
    background: #e9f5ff;
    color: #0d6efd;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(13, 110, 253, 0.2);
}

.btn-primary,
.btn-outline-primary {
    background-color: #0d6efd !important;
    border-color: #0d6efd !important;
    color: #fff !important;
}

.btn-danger,
.btn-outline-danger {
    background-color: #dc3545 !important;
    border-color: #dc3545 !important;
    color: #fff !important;
}

.btn-success,
.btn-outline-success {
    background-color: #198754 !important;
    border-color: #198754 !important;
    color: #fff !important;
}

.btn-warning,
.btn-outline-warning {
    background-color: #ffc107 !important;
    border-color: #ffc107 !important;
    color: #000 !important;
}

.btn-info,
.btn-outline-info {
    background-color: #0dcaf0 !important;
    border-color: #0dcaf0 !important;
    color: #000 !important;
}

.btn-secondary,
.btn-outline-secondary {
    background-color: #6c757d !important;
    border-color: #6c757d !important;
    color: #fff !important;
}

/* Animación hover */
.btn {
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Tabla de pedidos */
.pedidos-table-container {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
    overflow: hidden;
}

/* Loading spinner */
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

/* Filas de pedidos */
.pedido-row {
    transition: all 0.2s ease;
    border-bottom: 1px solid #eee;
}

.pedido-row:hover {
    background-color: #f8f9fa;
    transform: translateX(4px);
}

/* Botones de acciones */
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

/* Estado vacío */
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

/* --- MODALES --- */
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
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
}

/* --- Botones dentro de modales --- */
.modal-footer .btn {
    border-radius: 10px;
    padding: 0.55rem 1rem;
    font-size: 0.95rem;
    font-weight: 600;
    min-width: auto;
    transition: all 0.25s ease;
}

.modal-footer .btn-primary {
    background: linear-gradient(135deg, #0d6efd, #0a58ca);
    border: none;
    color: #fff;
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

.modal-footer .btn-primary:hover {
    background: linear-gradient(135deg, #0b5ed7, #084298);
    box-shadow: 0 6px 14px rgba(13, 110, 253, 0.4);
    transform: translateY(-2px);
}

.modal-footer .btn-outline-secondary {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
}

.modal-footer .btn-outline-secondary:hover {
    background: #e9ecef;
    border-color: #ced4da;
    transform: translateY(-2px);
}

/* Botón agregar dentro del modal */
.modal-body .btn-primary {
    border-radius: 8px;
    padding: 0.4rem 0.9rem;
    font-size: 0.85rem;
    background: linear-gradient(135deg, #198754, #157347);
    border: none;
    color: #fff;
    box-shadow: 0 3px 8px rgba(25, 135, 84, 0.3);
}

.modal-body .btn-primary:hover {
    background: linear-gradient(135deg, #157347, #0f5132);
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(25, 135, 84, 0.4);
}

/* --- MODAL EDITAR (azul elegante) --- */
#modalEditarPedido .modal-header {
    background: linear-gradient(135deg, #0d6efd, #0a58ca);
    color: #fff;
}

#modalEditarPedido .modal-title {
    font-weight: 600;
}

#modalEditarPedido .btn-editar {
    background: linear-gradient(135deg, #0d6efd, #0a58ca);
    border: none;
    color: #fff !important;
    font-weight: 600;
    padding: 0.6rem 1.4rem;
    border-radius: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

#modalEditarPedido .btn-editar:hover {
    background: linear-gradient(135deg, #0b5ed7, #084298);
    box-shadow: 0 6px 14px rgba(13, 110, 253, 0.4);
    transform: translateY(-2px);
}
</style>
