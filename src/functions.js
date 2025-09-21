import Swal from 'sweetalert2'


export function mostrarAlerta(titulo, icono, mensaje) {
  return Swal.fire({
    title: titulo,
    icon: icono,
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
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((resultado) => resultado.isConfirmed);
}