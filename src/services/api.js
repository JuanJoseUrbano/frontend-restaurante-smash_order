import axios from "axios";
import router from "@/router";
import { mostrarAlerta } from "@/functions";

const api = axios.create({
  baseURL: "http://localhost:8080/smash-order/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const publicEndpoints = ["/auth/login", "/auth/register"];

    // Solo agregar token si la URL NO es pública
    if (token && !publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
      config.headers.Authorization = token;
    } else if (!token && !publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
      console.warn("No se encontró token en localStorage al enviar la petición");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 🔹 Detectar fallo de conexión (backend apagado)
    if (!error.response && error.request) {
      console.error("❌ No se pudo conectar con el backend");

      // Limpiar datos de sesión
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("activeRole");

      await mostrarAlerta(
        "Conexión perdida",
        "warning",
        "No se pudo conectar con el servidor. Se cerrará la sesión."
      );

      router.push("/login");
      return Promise.reject(error);
    }

    // 🔹 Mantener toda tu lógica actual de 401
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Error 401 detectado");

      const currentPath = router.currentRoute.value.path;
      const excepciones = ["/login", "/select-role"];
      if (excepciones.includes(currentPath)) {
        return Promise.reject(error);
      }

      const token = localStorage.getItem("token");
      if (token) {
        console.warn("Token presente; posible error temporal del backend, no cerrar sesión");
        return Promise.reject(error);
      }

      await mostrarAlerta("Sesión expirada", "warning", "Tu sesión ha caducado. Inicia sesión nuevamente.");

      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("activeRole");

      router.push("/login");
    } else if (error.response && error.response.status >= 400) {
      const mensaje = error.response.data?.message || "Ocurrió un error inesperado";
      mostrarAlerta("Error", "error", mensaje);
    }

    return Promise.reject(error);
  }
);

export default api;
