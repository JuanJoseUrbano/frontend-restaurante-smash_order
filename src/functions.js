import Swal from 'sweetalert2'
import axios from 'axios'


export function mostrarAlerta(titulo, icono, mensaje) {
    Swal.fire({
        title: titulo,
        icon: icono,
        text: mensaje,
        customClass: { confirmButtonColor: 'btn btn-primary', popup: 'animated zoomIn' }
    })
}

export function confirmar(url, titulo, mensaje) {
  return Swal.fire({
    title: titulo,
    text: mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      return axios.delete(url)
        .then(() => {
          mostrarAlerta('Eliminado', 'success');
            window.location.reload(); // Recarga la página completa
        })
    } else {
      mostrarAlerta('Operación cancelada', 'info');
    }
  });
}
