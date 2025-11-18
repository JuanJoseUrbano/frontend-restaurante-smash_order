<template>
    <div class="usuarios-container">

        <!-- PERFIL -->
        <div class="usuarios-table-container shadow-sm">
             <h1 class="usuarios-title">Mi Perfil</h1>
            <p class="usuarios-subtitle">Visualiza y actualiza tu información personal</p>
            <div v-if="cargando" class="loading-spinner">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando información...</p>
            </div>

            <div v-else>
                <!-- FORMULARIO -->
                <div class="card-body">
                    <div class="form-floating mb-3">
                        <input v-model="usuario.name" type="text" id="nombre" class="form-control"
                            placeholder="Nombre completo" required />
                        <label for="nombre">Nombre completo</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input v-model="usuario.userName" type="text" id="username" class="form-control"
                            placeholder="Nombre de usuario" required />
                        <label for="username">Usuario</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input v-model="usuario.email" type="email" id="email" class="form-control"
                            placeholder="correo@ejemplo.com" required />
                        <label for="email">Correo electrónico</label>
                    </div>

                    <div class="form-floating mb-3 position-relative">
                        <input :type="showPassword ? 'text' : 'password'" id="password"
                            v-model="usuario.password" class="form-control" placeholder="Contraseña (opcional)" />
                        <label for="password">Contraseña (opcional)</label>
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

                    <!-- BOTONES -->
                    <div class="d-flex justify-content-end mt-4">
                        <button class="btn-outline-secondary me-2" @click="cancelarEdicion">
                            <i class="fas fa-times me-1"></i> Cancelar
                        </button>
                        <button class="btn-guardar" @click="actualizarPerfil">
                            <i class="fas fa-save me-1"></i> Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mostrarAlerta } from "@/functions.js";
import { getProfile, updateProfile } from "@/services/users";

export default {
    name: "UserProfile",
    data() {
        return {
            usuario: {
                id: null,
                name: "",
                userName: "",
                email: "",
                password: "",
                roles: []
            },
            cargando: false,
            showPassword: false,
        };
    },
    mounted() {
        this.obtenerPerfil();
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },

        async obtenerPerfil() {
            this.cargando = true;
            try {
                const userId = JSON.parse(localStorage.getItem("user"))?.id;
                if (!userId) {
                    mostrarAlerta("No se encontró información del usuario", "danger");
                    return;
                }

                const data = await getProfile();
                this.usuario = { 
                    ...data, 
                    password: "", 
                    roles: data.roles || [] 
                };
            } catch (error) {
                mostrarAlerta("Error al cargar la información del usuario", "danger");
            } finally {
                this.cargando = false;
            }
        },

        async actualizarPerfil() {
            if (!this.usuario.name?.trim() || !this.usuario.userName?.trim() || !this.usuario.email?.trim()) {
                mostrarAlerta("Por favor completa todos los campos obligatorios", "info");
                return;
            }

            try {
                const payload = {
                    id: this.usuario.id,
                    name: this.usuario.name,
                    userName: this.usuario.userName,
                    email: this.usuario.email,
                    roles: this.usuario.roles,
                    password: this.usuario.password?.trim() || null
                };

                await updateProfile(payload);

                const usuarioActualizado = { 
                    ...this.usuario, 
                    password: "" 
                };

                localStorage.setItem("user", JSON.stringify(usuarioActualizado));

                await this.obtenerPerfil();

                mostrarAlerta("Perfil actualizado correctamente", "success");
            } catch (error) {
                mostrarAlerta("Error al actualizar el perfil", "danger");
            }
        },

        cancelarEdicion() {
            this.obtenerPerfil();
        },
    },
};
</script>

<style scoped>
.usuarios-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}

.usuarios-title {
    color: var(--primary-color, #8B0000);
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 2.2rem;
}

.usuarios-subtitle {
    color: var(--text-light, #6c757d);
    font-size: 1.1rem;
}

.usuarios-table-container {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.card-body {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
}

.form-floating {
    position: relative;
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
    border-color: var(--primary-color, #8B0000);
    box-shadow: 0 0 0 3px rgba(88, 14, 0, 0.1);
}

.form-label {
    font-weight: 600;
    color: var(--text-dark, #212529);
    margin-bottom: 0.5rem;
}

.form-text {
    font-size: 0.9rem;
    color: #6c757d;
}

.btn-guardar {
    background-color: var(--primary-color, #8B0000) !important;
    border-color: var(--primary-color, #8B0000) !important;
    color: #fff !important;
    font-weight: 600;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    transition: all 0.3s ease;
}

.btn-guardar:hover {
    background-color: var(--primary-dark, #5e0000) !important;
    border-color: var(--primary-dark, #5e0000) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(88, 14, 0, 0.2);
}

.btn-outline-secondary {
    background-color: transparent;
    border: 2px solid #6c757d;
    color: #6c757d;
    font-weight: 600;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    color: #fff;
    transform: translateY(-2px);
}

.btn-outline-secondary.position-absolute {
    border: none !important;
    background: transparent !important;
    color: #6c757d;
    padding: 0.4rem;
    transition: all 0.3s ease;
}

.btn-outline-secondary.position-absolute:hover {
    color: var(--primary-color, #8B0000);
}

.loading-spinner {
    text-align: center;
    padding: 3rem;
    color: var(--text-light, #6c757d);
}

.loading-spinner .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    .usuarios-container {
        padding: 1rem;
    }

    .card-body {
        padding: 1rem;
    }

    .usuarios-title {
        font-size: 1.8rem;
    }

    .usuarios-subtitle {
        font-size: 1rem;
    }

    .btn-guardar,
    .btn-outline-secondary {
        width: 100%;
        margin-bottom: 0.5rem;
    }

    .d-flex.justify-content-end {
        flex-direction: column;
    }
}
</style>
