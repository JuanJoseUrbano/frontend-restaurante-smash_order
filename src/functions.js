import Swal from 'sweetalert2';

export function mostrarAlerta(titulo, icono, mensaje) {
  const validIcons = ["success", "error", "warning", "info", "question"];
  const safeIcon = validIcons.includes(icono) ? icono : "info";

  return Swal.fire({
    title: titulo,
    icon: safeIcon,
    text: mensaje,
    confirmButtonText: "OK",
    customClass: {
      confirmButtonColor: 'btn btn-primary',
      popup: 'animated zoomIn'
    }
  });
}

export function confirmar(titulo, mensaje) {
  return Swal.fire({
    title: titulo,
    text: mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `Sí, ${titulo}`,
    cancelButtonText: 'Cancelar',
  }).then((resultado) => resultado.isConfirmed);
}

/**
 * Valida que los precios mínimo y máximo sean válidos.
 * @param {number|string} precioMin
 * @param {number|string} precioMax
 * @returns {boolean} true si es válido, false si no.
 */
export function validarRangoDePrecio(precioMin, precioMax) {
  if (
    precioMin == null ||
    precioMax == null ||
    precioMin === '' ||
    precioMax === ''
  ) {
    mostrarAlerta("Campos vacíos", "warning", "Debe ingresar un precio mínimo y máximo");
    return false;
  }

  const min = parseFloat(precioMin);
  const max = parseFloat(precioMax);

  if (isNaN(min) || isNaN(max)) {
    mostrarAlerta("Valores inválidos", "warning", "Los valores ingresados deben ser números válidos");
    return false;
  }

  if (min <= 0 || max <= 0) {
    mostrarAlerta("Precios no válidos", "warning", "Los precios deben ser mayores que cero");
    return false;
  }

  if (min > max) {
    mostrarAlerta("Rango incorrecto", "warning", "El precio mínimo no puede ser mayor que el máximo");
    return false;
  }

  return true;
}
