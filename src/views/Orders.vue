<template>
    <div class="pedidos-container">
        <!-- HEADER -->
        <div class="pedidos-header shadow-sm">
            <h1 class="pedidos-title">Gestión de Pedidos</h1>
            <p class="pedidos-subtitle">Consulta y administra los pedidos registrados</p>
        </div>

        <!-- ACCIONES -->
        <div class="pedidos-actions card p-3 mb-4 shadow-sm">
            <div class="row g-3 align-items-center">
                <!-- Búsqueda -->
                <div class="col-md">
                    <div class="input-group">
                        <input type="text" class="form-control search-input" v-model="filtro"
                            placeholder="Buscar por cliente..." />
                        <button @click="filtrarBusqueda" class="btn btn-primary">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <!-- Estado -->
                <div class="col-md-auto">
                    <select class="form-select" v-model="filtroEstado" @change="filtrarPorEstado">
                        <option value="0">Todos los estados</option>
                        <option value="PENDING">Pendiente</option>
                        <option value="IN_PROGRESS">En proceso</option>
                        <option value="COMPLETED">Completado</option>
                        <option value="CANCELLED">Cancelado</option>
                    </select>
                </div>

                <!-- Fecha -->
                <div class="col-md-auto">
                    <input type="date" class="form-control" v-model="filtroFecha" @change="filtrarPorFecha" />
                </div>

                <!-- Limpiar -->
                <div class="col-md-auto">
                    <button class="btn btn-outline-secondary" @click="limpiarFiltros">
                        <i class="fas fa-eraser me-1"></i> Limpiar
                    </button>
                </div>

                <!-- Nuevo Pedido -->
                <div class="col-md-auto">
                    <button class="btn btn-success" @click="nuevoPedido">
                        <i class="fas fa-plus me-1"></i> Nuevo Pedido
                    </button>
                </div>

                <!-- Badge resultados -->
                <div class="col-md-auto ms-auto text-end">
                    <span class="badge bg-info fs-6">{{ pedidos.length }} Resultados</span>
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
                            <th>Empleado</th>
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
                            <td>{{ o.employee?.name || "Sin asignar" }}</td>
                            <td class="text-center">Mesa {{ o.table?.number }}</td>
                            <td class="text-center">{{ formatDate(o.date) }}</td>
                            <td class="text-center">
                                <span class="badge" :class="badgeClass(o.status)">{{ traducirEstado(o.status) }}</span>
                            </td>
                            <td class="text-center">
                                <span class="badge bg-success fs-6">${{ o.total.toFixed(2) }}</span>
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
                            <p><strong>Empleado:</strong> {{ pedidoSeleccionado.employee?.name || "Sin asignar" }}</p>
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
                                        <td class="text-center">${{ d.product.price }}</td>
                                        <td class="text-center">${{ d.subtotal }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="text-end">
                                <strong>Total: ${{ pedidoSeleccionado.total.toFixed(2) }}</strong>
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
                    <div class="modal-header bg-dark text-white">
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

                        <!-- Empleado (NO editable) -->
                        <div class="mb-3">
                            <label class="form-label">Empleado asignado</label>
                            <input type="text" class="form-control" v-model="busquedaEmpleado" disabled />
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
                                                @change="actualizarProducto(d)">
                                                <option v-for="p in productosDisponibles" :key="p.id" :value="p.id">
                                                    {{ p.name }}
                                                </option>
                                            </select>
                                        </td>
                                        <td class="text-center">
                                            <input type="number" class="form-control form-control-sm text-center"
                                                v-model.number="d.quantity" @input="recalcularSubtotal(d)" min="1" />
                                        </td>
                                        <td class="text-center">${{ d.product.price.toFixed(2) }}</td>
                                        <td class="text-center">${{ d.subtotal.toFixed(2) }}</td>
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-danger" @click="eliminarProducto(index)">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button class="btn btn-sm btn-primary mt-2" @click="agregarProducto">
                                <i class="fas fa-plus me-1"></i> Agregar producto
                            </button>
                        </div>

                        <!-- Total -->
                        <div class="mb-3 text-end">
                            <strong>Total: ${{ pedidoSeleccionado.total.toFixed(2) }}</strong>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-primary" @click="guardarCambios">Guardar cambios</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL NUEVO -->
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
                                    <tr v-for="(d, index) in pedidoNuevo.orderDetails" :key="index">
                                        <td>
                                            <select class="form-select" v-model="d.product.id"
                                                @change="actualizarProductoNuevo(d)">
                                                <option v-for="p in productosDisponibles" :key="p.id" :value="p.id">
                                                    {{ p.name }}
                                                </option>
                                            </select>
                                        </td>
                                        <td class="text-center">
                                            <input type="number" class="form-control form-control-sm text-center"
                                                v-model.number="d.quantity" @input="recalcularSubtotalNuevo(d)" min="1" />
                                        </td>
                                        <td class="text-center">${{ d.product.price.toFixed(2) }}</td>
                                        <td class="text-center">${{ d.subtotal.toFixed(2) }}</td>
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-danger" @click="eliminarProductoNuevo(index)">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button class="btn btn-sm btn-primary mt-2" @click="agregarProductoNuevo">
                                <i class="fas fa-plus me-1"></i> Agregar producto
                            </button>
                        </div>

                        <!-- Total -->
                        <div class="mb-3 text-end">
                            <strong>Total: ${{ pedidoNuevo.total.toFixed(2) }}</strong>
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
import { getTables } from "@/services/tables";
import { searchUsers } from "@/services/users";
import { nextTick } from "vue";

export default {
    name: "GestionPedidos",
    data() {
        return {
            pedidos: [],
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
            busquedaEmpleado: "",
        };
    },
    mounted() {
        nextTick(() => {
            this.modalDetalle = new Modal(document.getElementById("modalDetallePedido"));
            this.modalEditar = new Modal(document.getElementById("modalEditarPedido"));
            this.modalNuevo = new Modal(document.getElementById("modalNuevoPedido"));
        });
        this.obtenerPedidos();
        this.cargarProductos();
        this.cargarMesas();
    },
    methods: {
        async obtenerPedidos() {
            this.cargando = true;
            try {
                const pedidos = await getOrders();
                this.pedidosOriginales = pedidos;
                this.pedidos = [...pedidos];
            } catch {
                mostrarAlerta("Error al cargar los pedidos", "danger");
            } finally {
                this.cargando = false;
            }
        },
        async cargarProductos() {
            try {
                this.productosDisponibles = await getProducts();
            } catch {
                mostrarAlerta("Error al cargar productos", "danger");
            }
        },
        async cargarMesas() {
            try {
                this.mesasDisponibles = await getTables();
            } catch {
                mostrarAlerta("Error al cargar mesas", "danger");
            }
        },
        verDetalle(pedido) {
            this.pedidoSeleccionado = pedido;
            this.modalDetalle.show();
        },
        async eliminarPedido(id) {
            try {
                const confirmado = await confirmar("Eliminar pedido", "¿Deseas eliminar este pedido?");
                if (confirmado) {
                    await deleteOrder(id);
                    // ✅ Actualizamos listas sin recargar
                    this.pedidos = this.pedidos.filter(p => p.id !== id);
                    this.pedidosOriginales = this.pedidosOriginales.filter(p => p.id !== id);
                    mostrarAlerta("Pedido eliminado", "success");
                }
            } catch {
                mostrarAlerta("Error al eliminar el pedido", "danger");
            }
        },
        editarPedido(pedido) {
            this.pedidoSeleccionado = JSON.parse(JSON.stringify(pedido));
            if (Array.isArray(this.pedidoSeleccionado.orderDetails)) {
                this.pedidoSeleccionado.orderDetails.forEach(d => {
                    d.subtotal = (d.subtotal !== undefined) ? d.subtotal : (d.quantity * (d.product?.price || 0));
                });
            } else {
                this.pedidoSeleccionado.orderDetails = [];
            }
            this.busquedaCliente = this.pedidoSeleccionado.customer?.name || "";
            this.busquedaEmpleado = this.pedidoSeleccionado.employee?.name || "";
            this.modalEditar.show();
        },
        async guardarCambios() {
            try {
                if (!this.pedidoSeleccionado.customer?.id) {
                    mostrarAlerta("Seleccione un cliente válido.", "warning");
                    return;
                }
                if (!this.pedidoSeleccionado.orderDetails?.length) {
                    mostrarAlerta("Agregue al menos un producto.", "warning");
                    return;
                }
                this.recalcularTotal();

                const user = JSON.parse(localStorage.getItem("user")) || null;
                const employeePayload = user?.id ? { id: user.id } : null;

                const payload = {
                    customer: { id: this.pedidoSeleccionado.customer.id },
                    employee: employeePayload,
                    table: { id: this.pedidoSeleccionado.table.id },
                    status: this.pedidoSeleccionado.status,
                    orderDetails: this.pedidoSeleccionado.orderDetails.map(d => ({
                        product: { id: d.product.id },
                        quantity: d.quantity
                    }))
                };

                await updateOrder(this.pedidoSeleccionado.id, payload);

                // ✅ Actualizamos en memoria
                const index = this.pedidos.findIndex(p => p.id === this.pedidoSeleccionado.id);
                if (index !== -1) {
                    this.pedidos[index] = { ...this.pedidoSeleccionado };
                    this.pedidosOriginales[index] = { ...this.pedidoSeleccionado };
                }

                mostrarAlerta("Pedido actualizado correctamente", "success");
                this.modalEditar.hide();
            } catch {
                mostrarAlerta("Error al actualizar el pedido", "danger");
            }
        },

        aplicarFiltros() {
            this.pedidos = this.pedidosOriginales.filter(p => {
                const coincideCliente = !this.filtro.trim() || (p.customer?.name || "").toLowerCase().includes(this.filtro.toLowerCase());
                const coincideEstado = this.filtroEstado === "0" || p.status === this.filtroEstado;
                const coincideFecha = !this.filtroFecha || (p.date || "").startsWith(this.filtroFecha);
                return coincideCliente && coincideEstado && coincideFecha;
            });
        },
        filtrarBusqueda() { this.aplicarFiltros(); },
        filtrarPorEstado() { this.aplicarFiltros(); },
        filtrarPorFecha() { this.aplicarFiltros(); },
        limpiarFiltros() {
            this.filtro = "";
            this.filtroEstado = "0";
            this.filtroFecha = "";
            this.pedidos = [...this.pedidosOriginales];
        },

        formatDate(date) { return new Date(date).toLocaleString(); },
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

        agregarProducto() {
            if (!this.productosDisponibles.length) return;
            const producto = this.productosDisponibles[0];
            if (!this.pedidoSeleccionado.orderDetails) this.pedidoSeleccionado.orderDetails = [];
            this.pedidoSeleccionado.orderDetails.push({
                id: 0,
                product: { ...producto },
                quantity: 1,
                subtotal: producto.price,
            });
            this.recalcularTotal();
        },
        eliminarProducto(index) {
            this.pedidoSeleccionado.orderDetails.splice(index, 1);
            this.recalcularTotal();
        },
        actualizarProducto(detalle) {
            const prod = this.productosDisponibles.find((p) => p.id === detalle.product.id);
            if (prod) {
                detalle.product = { ...prod };
                this.recalcularSubtotal(detalle);
            }
        },
        recalcularSubtotal(detalle) {
            detalle.subtotal = detalle.quantity * detalle.product.price;
            this.recalcularTotal();
        },
        recalcularTotal() {
            if (!this.pedidoSeleccionado?.orderDetails) return;
            this.pedidoSeleccionado.total = this.pedidoSeleccionado.orderDetails.reduce(
                (sum, d) => sum + (d.subtotal || (d.quantity * (d.product?.price || 0))),
                0
            );
        },

        // === NUEVO PEDIDO ===
        nuevoPedido() {
            this.pedidoNuevo = {
                customer: null,
                table: { id: this.mesasDisponibles[0]?.id || null },
                status: "PENDING",
                orderDetails: [],
                total: 0,
            };
            this.busquedaCliente = "";
            this.resultadosCliente = [];
            this.modalNuevo.show();
        },
        async guardarNuevoPedido() {
            try {
                if (!this.pedidoNuevo.customer?.id) {
                    mostrarAlerta("Seleccione un cliente para el pedido.", "warning");
                    return;
                }
                if (!this.pedidoNuevo.table?.id) {
                    mostrarAlerta("Seleccione una mesa.", "warning");
                    return;
                }
                if (!this.pedidoNuevo.orderDetails?.length) {
                    mostrarAlerta("Agregue al menos un producto.", "warning");
                    return;
                }

                this.recalcularTotalNuevo();

                const user = JSON.parse(localStorage.getItem("user")) || null;
                const employeePayload = user?.id ? { id: user.id } : null;

                const payload = {
                    customer: { id: this.pedidoNuevo.customer.id },
                    employee: employeePayload,
                    table: { id: this.pedidoNuevo.table.id },
                    status: this.pedidoNuevo.status,
                    orderDetails: this.pedidoNuevo.orderDetails.map(d => ({
                        product: { id: d.product.id },
                        quantity: d.quantity
                    }))
                };

                const nuevoPedido = await createOrder(payload);

                // ✅ Insertar directamente en memoria
                this.pedidos.push(nuevoPedido);
                this.pedidosOriginales.push(nuevoPedido);

                mostrarAlerta("Pedido creado correctamente", "success");
                this.modalNuevo.hide();
            } catch (err) {
                console.error(err);
                mostrarAlerta("Error al crear el pedido", "danger");
            }
        },
        seleccionarClienteNuevo(cliente) {
            if (!this.pedidoNuevo) return;
            this.pedidoNuevo.customer = { id: cliente.id, name: cliente.name };
            this.busquedaCliente = cliente.name;
            this.resultadosCliente = [];
        },
        agregarProductoNuevo() {
            if (!this.productosDisponibles.length) return;
            const producto = this.productosDisponibles[0];
            this.pedidoNuevo.orderDetails.push({
                product: { ...producto },
                quantity: 1,
                subtotal: producto.price,
            });
            this.recalcularTotalNuevo();
        },
        eliminarProductoNuevo(index) {
            this.pedidoNuevo.orderDetails.splice(index, 1);
            this.recalcularTotalNuevo();
        },
        actualizarProductoNuevo(detalle) {
            const prod = this.productosDisponibles.find((p) => p.id === detalle.product.id);
            if (prod) {
                detalle.product = { ...prod };
                this.recalcularSubtotalNuevo(detalle);
            }
        },
        recalcularSubtotalNuevo(detalle) {
            detalle.subtotal = detalle.quantity * detalle.product.price;
            this.recalcularTotalNuevo();
        },
        recalcularTotalNuevo() {
            if (!this.pedidoNuevo?.orderDetails) return;
            this.pedidoNuevo.total = this.pedidoNuevo.orderDetails.reduce(
                (sum, d) => sum + (d.subtotal || (d.quantity * (d.product?.price || 0))),
                0
            );
        },

        // === BUSCAR CLIENTE ===
        async buscarClientes() {
            if (!this.busquedaCliente.trim() || this.busquedaCliente.length < 2) {
                this.resultadosCliente = [];
                return;
            }
            try {
                this.resultadosCliente = await searchUsers(this.busquedaCliente);
            } catch {
                mostrarAlerta("Error al buscar clientes", "danger");
            }
        },
        seleccionarCliente(cliente) {
            if (!this.pedidoSeleccionado) return;
            this.pedidoSeleccionado.customer = { id: cliente.id, name: cliente.name };
            this.busquedaCliente = cliente.name;
            this.resultadosCliente = [];
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
}

/* ✅ Restauramos colores normales de Bootstrap */
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

/* Animación al pasar el mouse */
.btn {
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.pedidos-table-container {
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

.pedido-row {
    transition: all 0.2s ease;
    border-bottom: 1px solid #eee;
}

.pedido-row:hover {
    background-color: #f8f9fa;
    transform: translateX(4px);
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
</style>

