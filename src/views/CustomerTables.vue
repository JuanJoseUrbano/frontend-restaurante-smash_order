<template>
    <div class="mesas-container">
        <h2 class="mb-5 text-center fw-bold display-6 titulo-principal">
            Mesas Disponibles
        </h2>

        <!-- CARGANDO -->
        <div v-if="cargando" class="text-center my-5">
            <div class="spinner-border spinner-lg text-acento" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 fs-6 text-muted">Cargando mesas...</p>
        </div>

        <!-- VACÍO -->
        <div v-else-if="mesas.length === 0" class="text-center my-5">
            <p class="fs-5 text-muted">No hay mesas disponibles por el momento.</p>
        </div>

        <!-- LISTADO DE MESAS -->
        <div v-else class="row g-4 justify-content-center">
            <div v-for="mesa in mesas" :key="mesa.id" class="col-sm-6 col-md-4 col-lg-3">
                <div class="mesa-card card text-center shadow-sm" @click="reservarMesa(mesa)">
                    <div class="icono-mesa mb-3">
                        <i class="fas fa-chair"></i>
                    </div>
                    <h5 class="mesa-number mb-2">Mesa {{ mesa.number }}</h5>
                    <p class="mesa-capacidad mb-4">Capacidad: {{ mesa.capacity }} personas</p>
                    <button class="btn btn-acento">
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
                    <div class="modal-header bg-verde text-white">
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
                        <button type="button" class="btn btn-verde" @click="confirmarReserva">
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
import { mostrarAlerta } from "@/functions.js";

export default {
    name: "CustomerTables",
    data() {
        return {
            mesas: [],
            cargando: false,
            mesaSeleccionada: null,
            modalReserva: null,
            fechaReserva: null,
            user: JSON.parse(localStorage.getItem("user")) || {},
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

                mostrarAlerta(
                    `Mesa: ${this.mesaSeleccionada.number}\nFecha: ${this.formatearFecha(reserva.date)}`,
                    "success"
                );

                await this.cargarMesas();

            } catch (error) {
                console.error("Error al crear reserva:", error.response ? error.response.data : error);
                mostrarAlerta("No se pudo realizar la reserva.", "error");
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.mesas-container {
    font-family: 'Poppins', sans-serif;
    padding: 3rem 2rem;
    background: #f7f7f7;
    min-height: 100vh;
}

.titulo-principal {
    color: #580e00;
    letter-spacing: 1px;
}

.mesa-card {
    border-radius: 1.25rem;
    background: #ffffff;
    padding: 2rem 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid rgba(88, 14, 0, 0.08);
}

.mesa-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(88, 14, 0, 0.25);
    border-color: #580e00;
}

.icono-mesa {
    font-size: 2.2rem;
    color: #580e00;
}

.mesa-number {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
}

.mesa-capacidad {
    font-size: 1rem;
    color: #6c757d;
}

.btn-acento {
    background-color: #580e00;
    color: #fff;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    padding: 0.6rem 0;
    transition: background-color 0.3s ease;
}

.btn-acento:hover {
    background-color: #731200;
}

.text-acento {
    color: #580e00 !important;
}

/* VERDE MODAL */
.bg-verde {
    background-color: #1b7b3a !important;
}

.btn-verde {
    background-color: #1b7b3a;
    color: #fff;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    padding: 0.6rem 1.5rem;
    transition: all 0.3s ease;
}

.btn-verde:hover {
    background-color: #23994a;
}

.modal-content {
    border-radius: 1.25rem;
    border: none;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
}

.modal-footer {
    border-top: none;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
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
