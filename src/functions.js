import Swal from "sweetalert2";
import axios from "axios";

export function mostrarAlerta(titulo, icono, mensaje) {
  return Swal.fire({
    title: titulo,
    icon: icono,
    text: mensaje,
    confirmButtonText: "OK",
    customClass: {
      confirmButtonColor: "btn btn-primary",
      popup: "animated zoomIn",
    },
  });
}

export async function confirmar(titulo, mensaje, url) {
  const resultado = await Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (resultado.isConfirmed && url) {
    try {
      await axios.delete(url);
      mostrarAlerta("Eliminado", "success", "El elemento ha sido eliminado correctamente.");
      window.location.reload();
    } catch (error) {
      mostrarAlerta("Error", "error", "No se pudo eliminar el elemento.");
    }
  } else if (resultado.dismiss) {
    mostrarAlerta("Operación cancelada", "info", "La acción fue cancelada por el usuario.");
  }

  return resultado.isConfirmed;
}