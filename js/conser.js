window.onload = function() {
    // Llenar los selectores de marca y modelo cuando se cargue la página
    llenarSelectores();

    // Llenar el selector de tipos de solicitud
    llenarTiposSolicitud();

    // Establecer la fecha actual en el campo de fecha "fecha-solicitud"
    const fechaHoy = new Date().toISOString().split('T')[0];
    const fechaSolicitudElement = document.getElementById('fecha-solicitud');

    if (fechaSolicitudElement) {
        fechaSolicitudElement.value = fechaHoy;
    }

    // Precargar los datos del usuario en el formulario
    precargarDatosUsuario();

    // Obtener el tipo de solicitud desde la URL (si está presente)
    const urlParams = new URLSearchParams(window.location.search);
    const tipoSolicitud = urlParams.get('tipo');

    if (tipoSolicitud) {
        const selectElement = document.getElementById('tipo-solicitud');
        if (selectElement) {
            const optionToSelect = Array.from(selectElement.options).find(
                option => option.value.toLowerCase() === tipoSolicitud.toLowerCase()
            );
            if (optionToSelect) {
                optionToSelect.selected = true;
            }
        }
    }
};

function llenarSelectores() {
    const marcaSelect = document.getElementById('marca');
    const modeloSelect = document.getElementById('modelo_producto');

    if (!marcaSelect || !modeloSelect) {
        console.error("No se encontraron los elementos de selección de marca o modelo en el DOM.");
        return;
    }

    fetch('https://webclibackend-production.up.railway.app/api/productos')
        .then(response => response.json())
        .then(data => {
            const marcas = new Set();
            const modelosPorMarca = {};

            data.forEach(producto => {
                const marca = producto.MARCA_PRODUCTO;
                const modelo = producto.MODELO_PRODUCTO;
                const precio = producto.VALOR_PRODUCTO; // Valor del producto (precio)

                marcas.add(marca);

                if (!modelosPorMarca[marca]) {
                    modelosPorMarca[marca] = [];
                }

                modelosPorMarca[marca].push({ modelo, precio });
            });

            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                marcaSelect.appendChild(option);
            });

            marcaSelect.addEventListener('change', function () {
                const marcaSeleccionada = marcaSelect.value;
                modeloSelect.innerHTML = '<option value="" disabled selected>Seleccionar Modelo</option>';

                if (modelosPorMarca[marcaSeleccionada]) {
                    modelosPorMarca[marcaSeleccionada].forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.modelo;
                        option.textContent = item.modelo;
                        option.setAttribute('data-precio', item.precio); // Agregar el precio a data-precio
                        modeloSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

function llenarTiposSolicitud() {
    const tipoSolicitudSelect = document.getElementById('tipo-solicitud');

    if (!tipoSolicitudSelect) {
        console.error("No se encontró el elemento de selección de tipo de solicitud en el DOM.");
        return;
    }

    // Limpiar el selector antes de agregar nuevas opciones
    tipoSolicitudSelect.innerHTML = '<option value="" disabled selected>Seleccionar Tipo</option>';

    fetch('https://webclibackend-production.up.railway.app/api/tipos_solicitud')
        .then(response => response.json())
        .then(data => {
            data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.nombre.toLowerCase();
                option.textContent = tipo.nombre;
                tipoSolicitudSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los tipos de solicitud:', error));
}

function calcularCostoTotal() {
    const necesitaCompra = document.getElementById('compra').checked;
    const tipoSolicitud = document.getElementById('tipo-solicitud').value;
    const modeloSelect = document.getElementById('modelo_producto');
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    let costoTotal = 0;

    // Obtener el valor del producto seleccionado
    let valorProducto = 0;
    if (modeloSelect && modeloSelect.value) {
        const modeloOption = modeloSelect.options[modeloSelect.selectedIndex];
        valorProducto = parseFloat(modeloOption.getAttribute('data-precio')) || 0;
    }

    console.log('Tipo de Solicitud:', tipoSolicitud); // Depuración
    console.log('Valor del Producto:', valorProducto); // Depuración

    // 1. Añadir el costo del producto si es necesario comprarlo
    if (necesitaCompra) {
        costoTotal += valorProducto * cantidad;
    }

    // 2. Ajustar el costo según el tipo de solicitud
    switch (tipoSolicitud.toLowerCase()) {
        case "instalación":
            costoTotal += valorProducto * 0.15 * cantidad;
            break;
        case "remoción":
            costoTotal += valorProducto * 0.10 * cantidad;
            break;
        case "mantenimiento":
            costoTotal += valorProducto * 0.12 * cantidad;
            break;
        case "reparación":
            costoTotal = 0;
            break;
        default:
            break;
    }

    // Actualizar el DOM para mostrar el costo total en el nuevo elemento "costoTotal"
    const costoElement = document.getElementById('costoTotal');
    if (costoElement) {
        costoElement.textContent = `$${costoTotal.toFixed(2)}`;
    } else {
        console.error("No se encontró el elemento para mostrar el costo total.");
    }

    return costoTotal;
}

// Precargar los datos del usuario en el formulario
function precargarDatosUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        document.getElementById('nombre').value = usuario.nombres;
        document.getElementById('rut').value = usuario.rut;
        document.getElementById('telefono').value = usuario.telefono;
        document.getElementById('email').value = usuario.email;
        // No precargar la dirección
    }
}

// Eventos para recalcular el costo cada vez que cambie algún valor
document.getElementById('solicitudForm').addEventListener('input', calcularCostoTotal);
document.getElementById('tipo-solicitud').addEventListener('change', calcularCostoTotal);
document.getElementById('modelo_producto').addEventListener('change', calcularCostoTotal);
document.getElementById('cantidad').addEventListener('input', calcularCostoTotal);
document.getElementById('compra').addEventListener('change', calcularCostoTotal);

// Función para enviar los datos del formulario al servidor
function enviarSolicitud(event) {
    event.preventDefault(); // Prevenir el envío normal del formulario

    // Recoger los datos del formulario
    const datosFormulario = {
        nombre: document.getElementById('nombre').value,
        rut: document.getElementById('rut').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value,
        cantidad: parseInt(document.getElementById('cantidad').value) || 1,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo_producto').value,
        necesitaCompra: document.getElementById('compra').checked ? 'Y' : 'N',
        tipoSolicitud: document.getElementById('tipo-solicitud').value,
        fechaSolicitud: document.getElementById('fecha-solicitud').value,
        fechaRealizacion: document.getElementById('fecha-realizacion').value,
        descripcion: document.getElementById('descripcion').value,
        medioPago: document.getElementById('pago').value,
        costoTotal: calcularCostoTotal()
    };

    console.log('Datos del formulario:', datosFormulario); // Depuración

    if (datosFormulario.medioPago === 'transferencia') {
        // Enviar los datos al servidor para guardar la solicitud y enviar el correo
    fetch('https://webclibackend-production.up.railway.app/api/solicitud_transferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFormulario)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor (transferencia):', data); // Depuración

        if (data.message === 'Solicitud creada con éxito') {
            alert('Solicitud creada con éxito. Revisa tu correo para la información de transferencia.');
            window.location.href = 'pagar_transferencia.html'; // Redirige a la página de confirmación
        } else {
            alert(`Hubo un problema al crear la solicitud: ${data.details || 'Error desconocido'}`);
        }
    })
    .catch(error => {
        console.error('Error al crear la solicitud:', error);
        alert('Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.');
    });
    } else {
        // Enviar los datos al servidor para crear la preferencia de pago
        fetch('https://webclibackend-production.up.railway.app/api/solicitud', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosFormulario)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor (pago):', data); // Depuración

            if (data.message === 'Preferencia de pago creada con éxito' && data.init_point) {
                // Redirigir al enlace de pago
                window.location.href = data.init_point;
            } else {
                alert(`Hubo un problema al crear la preferencia de pago: ${data.details || 'Error desconocido'}`);
            }
        })
        .catch(error => {
            console.error('Error al crear la preferencia de pago:', error);
            alert('Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.');
        });
    }
}

// Asignar la función de envío al botón de "Continuar al pago"
document.getElementById('solicitudForm').addEventListener('submit', enviarSolicitud);