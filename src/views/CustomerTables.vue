<template>
    <div class="mesas-container">
        <h2 class="mb-5 text-center fw-bold display-6">
            Mesas Disponibles
        </h2>

        <!-- CARGANDO -->
        <div v-if="cargando" class="text-center my-5">
            <div class="spinner-border spinner-lg text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 fs-6 text-muted">Cargando mesas...</p>
        </div>

        <!-- VACÍO -->
        <div v-else-if="mesas.length === 0" class="text-center my-5">
            <p class="fs-5 text-muted">No hay mesas disponibles por el momento.</p>
        </div>

        <!-- LISTADO DE MESAS -->
        <div v-else class="row g-4">
            <div v-for="mesa in mesas" :key="mesa.id" class="col-sm-6 col-md-4 col-lg-3">
                <div class="mesa-card card p-4 shadow-sm text-center" @click="reservarMesa(mesa)">
                    <h5 class="mesa-number mb-3">Mesa {{ mesa.number }}</h5>
                    <p class="mesa-capacidad mb-4">Capacidad: {{ mesa.capacity }} personas</p>
                    <button class="btn btn-primary w-100">
                        Reservar
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL RESERVA -->
        <div class="modal fade" id="modalReserva" tabindex="-1" aria-hidden="true" ref="modalReserva">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal-animate shadow-lg rounded-4">

                    <!-- Encabezado -->
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Reservar Mesa</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <!-- Cuerpo -->
                    <div class="modal-body">
                        <p class="fs-5 mb-2">
                            ¿Deseas reservar la mesa <span class="fw-bold">{{ mesaSeleccionada?.number }}</span>?
                        </p>
                        <p class="text-muted mb-3">Capacidad: {{ mesaSeleccionada?.capacity }} personas</p>

                        <div class="mb-3">
                            <label for="fechaReserva" class="form-label fw-semibold">Fecha y hora de la reserva:</label>
                            <input type="datetime-local" id="fechaReserva" v-model="fechaReserva"
                                class="form-control form-control-lg" />
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-primary" @click="confirmarReserva">
                            Confirmar
                        </button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { getTables } from "@/services/tables";
import { createReservation } from "@/services/reservation";
import Modal from "bootstrap/js/dist/modal";
import { mostrarAlerta } from "@/functions.js"; // Importa tu función de alertas

export default {
    name: "CustomerTables",
    data() {
        return {
            mesas: [],
            cargando: false,
            mesaSeleccionada: null,
            modalReserva: null,
            fechaReserva: null,
            user: JSON.parse(localStorage.getItem("user")) || {}, // Usuario logueado
        };
    },
    async mounted() {
        await this.cargarMesas();
        this.modalReserva = new Modal(this.$refs.modalReserva);
    },
    methods: {
        async cargarMesas() {
            this.cargando = true;
            try {
                const todasMesas = await getTables();
                this.mesas = todasMesas.filter((m) => m.status === "AVAILABLE");
            } catch (error) {
                console.error("Error cargando mesas:", error);
                mostrarAlerta("Error cargando mesas.", "error");
            } finally {
                this.cargando = false;
            }
        },

        reservarMesa(mesa) {
            this.mesaSeleccionada = mesa;
            const ahora = new Date();

            const yyyy = ahora.getFullYear();
            const mm = String(ahora.getMonth() + 1).padStart(2, "0");
            const dd = String(ahora.getDate()).padStart(2, "0");
            const hh = String(ahora.getHours()).padStart(2, "0");
            const min = String(ahora.getMinutes()).padStart(2, "0");

            this.fechaReserva = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
            this.modalReserva.show();
        },

        formatearFecha(fechaStr) {
            const fecha = new Date(fechaStr);
            const opciones = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            };
            return fecha.toLocaleString("es-ES", opciones);
        },

        async confirmarReserva() {
            if (!this.mesaSeleccionada || !this.fechaReserva) {
                mostrarAlerta("Selecciona una fecha y hora para la reserva.", "error");
                return;
            }

            try {
                if (!this.user.id) {
                    throw new Error("Usuario no identificado. Inicia sesión primero.");
                }

                const reserva = {
                    customer: { id: this.user.id },
                    table: { id: this.mesaSeleccionada.id },
                    date: this.fechaReserva + ":00",
                    status: true,
                };

                await createReservation(reserva);

                // Mensaje con saltos de línea
                mostrarAlerta(
                    `Mesa: ${this.mesaSeleccionada.number}\nFecha: ${this.formatearFecha(reserva.date)}`,
                    "success"
                );

                await this.cargarMesas();

            } catch (error) {
                console.error("Error al crear reserva:", error.response ? error.response.data : error);
                mostrarAlerta("No se pudo realizar la reserva. Revisa la consola para más detalles.", "error");
            } finally {
                this.modalReserva.hide();
                this.mesaSeleccionada = null;
                this.fechaReserva = null;
            }
        },

    },
};
</script>


<style>
.mesas-container {
    padding: 3rem 2rem;
    background: #f8f9fa;
    min-height: 100vh;
}

.mesa-card {
    border-radius: 1rem;
    background: #ffffff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    padding: 2rem 1.5rem;
    cursor: pointer;
}

.mesa-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.mesa-number {
    font-size: 1.5rem;
    font-weight: 700;
}

.mesa-capacidad {
    font-size: 1rem;
    color: #6c757d;
}

.btn-primary {
    width: 100%;
    font-weight: 600;
    border-radius: 50px;
    padding: 0.6rem 0;
}

.modal-content {
    border-radius: 1rem;
    border: none;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.modal-header {
    border-bottom: none;
    border-radius: 1rem 1rem 0 0;
}

.modal-footer {
    border-top: none;
    justify-content: flex-end;
    display: flex;       /* Asegura que sea flex */
    gap: 1rem;           /* Espacio entre botones */
}


.modal-animate {
    animation: fadeInUp 0.4s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.spinner-lg {
    width: 3rem;
    height: 3rem;
    border-width: 0.4rem;
}
</style>
