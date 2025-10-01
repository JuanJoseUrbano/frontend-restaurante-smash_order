<template>
    <div class="usuarios-container">
        <!-- HEADER -->
        <div class="usuarios-header shadow-sm">
            <h1 class="usuarios-title">Gestión de Usuarios</h1>
            <p class="usuarios-subtitle">Administra y gestiona los usuarios del sistema</p>
        </div>
        <!-- ACCIONES -->
        <div class="usuarios-actions card p-3 mb-4 shadow-sm">
            <div class="row g-3 align-items-center">
                <!-- Botón agregar -->
                <div class="col-md-auto">
                    <button class="btn-guardar d-flex align-items-center" @click="modalAgregar.show()">
                        <i class="fas fa-plus-circle me-2"></i> Agregar Usuario
                    </button>
                </div>
                <!-- Búsqueda -->
                <div class="col-md">
                    <div class="input-group">
                        <input type="text" class="form-control search-input" v-model="filtro"
                            placeholder="Buscar usuario por email..." />
                        <button @click="filtrarBusqueda" class="btn-guardar">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <!-- Limpiar -->
                <div class="col-md-auto">
                    <button class="btn-outline-secondary" @click="limpiarFiltros">
                        <i class="fas fa-eraser me-1"></i> Limpiar
                    </button>
                </div>

                <!-- Badge resultados -->
                <div class="col-md-auto ms-auto text-end">
                    <span class="badge bg-info fs-6">{{ usuarios.length }} Resultados</span>
                </div>
            </div>
        </div>

        <!-- TABLA -->
        <div class="usuarios-table-container shadow-sm">
            <div v-if="cargando" class="loading-spinner">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando Usuarios...</p>
            </div>

            <div v-else-if="usuarios.length === 0" class="empty-state">
                <i class="fas fa-user-slash empty-icon"></i>
                <h4>No hay usuarios disponibles</h4>
                <p>Agrega un usuario para empezar</p>
            </div>

            <div v-else class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="text-center">#</th>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th class="text-center">Roles</th>
                            <th class="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in usuarios" :key="u.id" class="usuario-row">
                            <td class="text-center">{{ u.id }}</td>
                            <td class="usuario-name">{{ u.name }}</td>
                            <td>{{ u.userName }}</td>
                            <td>{{ u.email }}</td>
                            <td class="text-center">
                                <span v-for="r in u.roles" :key="r.id" class="badge me-1" :class="{
                                    'bg-danger': r.name === 'ROLE_ADMIN',
                                    'bg-primary': r.name === 'ROLE_CUSTOMER',
                                    'bg-success': r.name === 'ROLE_EMPLOYEE'
                                }">
                                    <span v-if="r.name === 'ROLE_ADMIN'">Administrador</span>
                                    <span v-else-if="r.name === 'ROLE_CUSTOMER'">Cliente</span>
                                    <span v-else-if="r.name === 'ROLE_EMPLOYEE'">Empleado</span>
                                    <span v-else>{{ r.name }}</span>
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="action-buttons">
                                    <button class="btn-outline-warning me-2" @click="obtenerPorId(u.id)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button @click="eliminarUsuario(u.id)" class="btn-outline-danger">
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
        <div class="modal fade" id="modalGuardarUsuario" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-user-plus me-2"></i> Agregar Usuario
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input v-model="usuarioNuevo.name" type="text" id="nombre" class="form-control"
                                placeholder="Nombre completo" required />
                            <label for="nombre">Nombre completo</label>
                        </div>

                        <div class="form-floating mb-3">
                            <input v-model="usuarioNuevo.userName" type="text" id="username" class="form-control"
                                placeholder="Nombre de usuario" required />
                            <label for="username">Usuario</label>
                        </div>

                        <div class="form-floating mb-3">
                            <input v-model="usuarioNuevo.email" type="email" id="email" class="form-control"
                                placeholder="correo@ejemplo.com" required />
                            <label for="email">Email</label>
                        </div>

                        <div class="form-floating mb-3 position-relative">
                            <input :type="showPassword ? 'text' : 'password'" id="contrasenia"
                                v-model="usuarioNuevo.password" class="form-control" placeholder="Contraseña segura"
                                required
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" />
                            <label for="contrasenia">Contraseña</label>
                            <button type="button"
                                class="btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                                @click="togglePasswordVisibility"
                                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                                <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
                            </button>
                        </div>
                        <div class="form-text mb-3">
                            Mínimo 8 caracteres, con mayúscula, número y símbolo especial.
                        </div>

                        <!-- Roles -->
                        <div class="mb-3">
                            <label for="roles" class="form-label">Roles del usuario</label>
                            <select id="roles" v-model="usuarioNuevo.roles" class="form-select" multiple>
                                <option v-for="r in rolesDisponibles" :key="r.id" :value="r.id">
                                    {{ r.name }}
                                </option>
                            </select>
                            <div class="form-text">
                                Mantén presionada la tecla <strong>Ctrl</strong> (o <strong>Cmd</strong> en Mac) para
                                seleccionar varios.
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="modal-footer">
                        <button class="btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i> Cancelar
                        </button>
                        <button class="btn-guardar" @click="guardarUsuario">
                            <i class="fas fa-save me-1"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Editar -->
        <div class="modal fade" id="modalEditarUsuario" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title">
                            <i class="fas fa-user-edit me-2"></i> Editar Usuario
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input v-model="usuarioEditado.name" type="text" id="editNombre" class="form-control"
                                placeholder="Nombre completo" required />
                            <label for="editNombre">Nombre completo</label>
                        </div>

                        <div class="form-floating mb-3">
                            <input v-model="usuarioEditado.userName" type="text" id="editUserName" class="form-control"
                                placeholder="Nombre de usuario" required />
                            <label for="editUserName">Nombre de usuario</label>
                        </div>

                        <div class="form-floating mb-3">
                            <input v-model="usuarioEditado.email" type="email" id="editEmail" class="form-control"
                                placeholder="correo@ejemplo.com" required />
                            <label for="editEmail">Email</label>
                        </div>

                        <div class="form-floating mb-3 position-relative">
                            <input :type="showPassword ? 'text' : 'password'" id="editContrasenia"
                                v-model="usuarioEditado.password" class="form-control" placeholder="Nueva contraseña" />
                            <label for="editContrasenia">Contraseña (opcional)</label>
                            <button type="button"
                                class="btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                                @click="togglePasswordVisibility"
                                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                                <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
                            </button>
                        </div>
                        <div class="form-text mb-3">
                            Si no deseas cambiar la contraseña, deja este campo vacío.
                        </div>

                        <div class="mb-3">
                            <label for="editRoles" class="form-label">Roles del usuario</label>
                            <select id="editRoles" v-model="usuarioEditado.roles" class="form-select" multiple>
                                <option v-for="r in rolesDisponibles" :key="r.id" :value="r.id">
                                    {{ r.name }}
                                </option>
                            </select>
                            <div class="form-text">
                                Mantén presionada la tecla <strong>Ctrl</strong> (o <strong>Cmd</strong> en Mac) para
                                seleccionar varios.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i> Cancelar
                        </button>
                        <button class="btn-warning" @click="actualizarUsuario">
                            <i class="fas fa-save me-1"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.usuarios-header {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.usuarios-title {
    color: var(--primary-color);
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 2.2rem;
}

.usuarios-subtitle {
    color: var(--text-light);
    font-size: 1.1rem;
}

.usuarios-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.usuarios-actions button {
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.usuarios-actions button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(88, 14, 0, 0.2);
}

.search-input {
    border: 2px solid #e9ecef;
    border-radius: 8px 0 0 8px;
    padding: 0.75rem;
}

.usuarios-table-container {
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

.usuario-row {
    transition: all 0.2s ease;
    border-bottom: 1px solid #eee;
}

.usuario-row:hover {
    background-color: #f8f9fa;
    transform: translateX(4px);
}

.usuario-name {
    font-weight: 600;
    color: var(--text-dark);
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.action-buttons button {
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    transition: all 0.2s ease;
}

.action-buttons button:hover {
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

.btn-guardar {
    background-color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
    color: #fff !important;
}

.btn-guardar:hover {
    background-color: var(--primary-dark) !important;
    border-color: var(--primary-dark) !important;
}

.btn-outline-secondary {
    background-color: transparent;
    border: 2px solid #6c757d;
    color: #6c757d;
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    color: #fff;
}

.btn-warning {
    background-color: #ffc107;
    border: 2px solid #ffc107;
    color: #212529;
}

.btn-warning:hover {
    background-color: #e0a800;
    border-color: #e0a800;
}

.btn-outline-warning {
    background-color: transparent;
    border: 2px solid #ffc107;
    color: #ffc107;
}

.btn-outline-warning:hover {
    background-color: #ffc107;
    color: #212529;
}

.btn-outline-danger {
    background-color: transparent;
    border: 2px solid #dc3545;
    color: #dc3545;
}

.btn-outline-danger:hover {
    background-color: #dc3545;
    color: #fff;
}

@media (max-width: 768px) {
    .usuarios-container {
        padding: 1rem;
    }

    .usuarios-actions {
        flex-direction: column;
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


<script>
import { mostrarAlerta, confirmar } from "@/functions.js";
import Modal from "bootstrap/js/dist/modal";

import {
    getUsers,
    getUserById,
    getUserByEmail,
    registerUser,
    updateUser,
    deleteUser
} from "@/services/users";

import { getRoles } from "@/services/roles";

export default {
    name: "GestionUsuarios",
    data() {
        return {
            usuarios: [],
            rolesDisponibles: [],
            usuarioNuevo: {
                name: "",
                userName: "",
                email: "",
                password: "",
                roles: []
            },
            usuarioEditado: {
                id: 0,
                name: "",
                userName: "",
                email: "",
                password: "",
                roles: []
            },
            cargando: false,
            modalAgregar: null,
            modalEditar: null,
            filtro: "",
            showPassword: false,
        };
    },
    mounted() {
        this.modalAgregar = new Modal(document.getElementById("modalGuardarUsuario"));
        this.modalEditar = new Modal(document.getElementById("modalEditarUsuario"));
        this.obtenerUsuarios();
        this.obtenerRoles();
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        validarUsuario(usuario) {
            if (!usuario.name?.trim()) {
                mostrarAlerta("Información inválida", "info", "Ingrese el nombre");
                return false;
            } else if (!usuario.userName?.trim()) {
                mostrarAlerta("Información inválida", "info", "Ingrese el nombre de usuario");
                return false;
            } else if (!usuario.email?.trim()) {
                mostrarAlerta("Información inválida", "info", "Ingrese el email");
                return false;
            } else if (!usuario.roles || usuario.roles.length === 0) {
                mostrarAlerta("Información incompleta", "info", "Seleccione al menos un rol");
                return false;
            }
            return true;
        },

        async obtenerUsuarios() {
            this.cargando = true;
            try {
                this.usuarios = await getUsers();
            } catch (error) {
                mostrarAlerta("Error al cargar los usuarios", "danger");
            } finally {
                this.cargando = false;
            }
        },

        async obtenerRoles() {
            try {
                this.rolesDisponibles = await getRoles();
            } catch (error) {
                mostrarAlerta("Error al cargar los roles", "danger");
            }
        },

        async filtrarBusqueda() {
            if (!this.filtro.trim()) return this.obtenerUsuarios();
            try {
                const usuario = await getUserByEmail(this.filtro);
                this.usuarios = usuario ? [usuario] : [];
            } catch {
                mostrarAlerta("Error en la búsqueda", "danger");
            }
        },

        limpiarFiltros() {
            this.filtro = "";
            this.obtenerUsuarios();
        },

        async guardarUsuario() {
            if (!this.validarUsuario(this.usuarioNuevo)) return;

            try {
                let payload = {
                    ...this.usuarioNuevo,
                    roles: this.usuarioNuevo.roles.map(id => {
                        let roleObj = this.rolesDisponibles.find(r => r.id === id);
                        return { id: roleObj.id, name: roleObj.name };
                    })
                };

                await registerUser(payload);
                this.usuarioNuevo = { name: "", userName: "", email: "", password: "", roles: [] };

                mostrarAlerta("Usuario guardado exitosamente", "success");
                this.obtenerUsuarios();
                this.modalAgregar.hide();
            } catch (error) {
                console.error("Error al guardar:", error.response?.data || error.message);
                mostrarAlerta("Error al guardar el usuario", "danger");
            }
        },

        async obtenerPorId(id) {
            try {
                const usuario = await getUserById(id);
                this.usuarioEditado = {
                    ...usuario,
                    roles: usuario.roles.map(r => r.id)
                };

                this.modalEditar.show();
            } catch (error) {
                mostrarAlerta("Error al obtener los datos para editar", "danger");
            }
        },

        async actualizarUsuario() {
            if (!this.validarUsuario(this.usuarioEditado)) return;
            try {
                // Reconstruimos los roles en formato {id, name} para enviar al backend
                const payload = {
                    ...this.usuarioEditado,
                    roles: this.usuarioEditado.roles.map(id => {
                        const roleObj = this.rolesDisponibles.find(r => r.id === id);
                        return { id: roleObj.id, name: roleObj.name };
                    })
                };

                await updateUser(payload);
                mostrarAlerta("Usuario actualizado correctamente", "success");
                this.obtenerUsuarios();
                this.modalEditar.hide();
            } catch (error) {
                mostrarAlerta("Error al actualizar el usuario", "danger");
            }
        },

        async eliminarUsuario(id) {
            try {
                const confirmado = await confirmar("Eliminar usuario", "¿Estás seguro de eliminar este usuario?");
                if (confirmado) {
                    await deleteUser(id);
                    mostrarAlerta("Eliminado", "success");
                    this.obtenerUsuarios();
                } else {
                    mostrarAlerta("Operación cancelada", "info");
                }
            } catch (error) {
                mostrarAlerta("Error al eliminar el usuario", "danger");
            }
        }
    }
};
</script>