import Swal from 'sweetalert2'


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