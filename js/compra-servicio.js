document.addEventListener('DOMContentLoaded', function () {
    // Obtén la información del equipo y servicio desde localStorage o URL
    const marca = localStorage.getItem('marcaSeleccionada') || 'N/A';
    const modelo = localStorage.getItem('modeloSeleccionada') || 'N/A';
    const tipoServicio = localStorage.getItem('tipoServicioSeleccionado') || 'N/A';
    const valorEquipo = parseFloat(localStorage.getItem('valorEquipo')) || 0;
    const valorServicio = parseFloat(localStorage.getItem('valorServicio')) || 0;

    // Mostrar la información seleccionada
    document.getElementById('marca-seleccionada').textContent = marca;
    document.getElementById('modelo-seleccionado').textContent = modelo;
    document.getElementById('tipo-servicio-seleccionado').textContent = tipoServicio;

    const valorEquipoElement = document.getElementById('valor-equipo');
    const yaLoTengoCheckbox = document.getElementById('ya-lo-tengo');
    const valorTotalElement = document.getElementById('valor-total');

    // Mostrar valor del equipo solo para instalación
    if (tipoServicio.toLowerCase() === 'instalación') {
        valorEquipoElement.textContent = `Valor del equipo: $${valorEquipo.toFixed(2)}`;
    } else {
        valorEquipoElement.textContent = 'No aplica';
    }

    // Mostrar el valor del servicio
    document.getElementById('valor-servicio').textContent = `Valor del servicio: $${valorServicio.toFixed(2)}`;

    // Calcular el valor total (incluye el equipo si no está marcado "Ya lo tengo")
    function calcularValorTotal() {
        let total = valorServicio;

        if (!yaLoTengoCheckbox.checked && tipoServicio.toLowerCase() === 'instalación') {
            total += valorEquipo;
        }

        valorTotalElement.textContent = `Total a pagar: $${total.toFixed(2)}`;
    }

    // Actualiza el valor total cuando el usuario selecciona "Ya lo tengo"
    yaLoTengoCheckbox.addEventListener('change', calcularValorTotal);

    // Calcular el valor total por primera vez
    calcularValorTotal();

    // Acciones al hacer clic en "Proceder al Pago"
    document.getElementById('pagar-btn').addEventListener('click', function () {
        // Aquí puedes integrar tu pasarela de pago (por ejemplo, MercadoPago)
        alert('Redirigiendo a la pasarela de pago...');
        // Redirige o realiza la operación de pago
    });
});
