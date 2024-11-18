// Inicializar variable global para solicitudes
let solicitudesHistorialGlobal = [];

// Cargar solicitudes con técnico asignado al cargar la página
document.addEventListener('DOMContentLoaded', async function () {
    await cargarSolicitudesConTecnico();

    const toggleFilter = document.getElementById('toggleFilterHistorial');
    const filterContainer = document.getElementById('filterContainerHistorial');
    const fechaFiltro = document.getElementById('fechaFiltroHistorial');
    const tipoFiltro = document.getElementById('tipoFiltroHistorial');
    const nombreFiltro = document.getElementById('nombreFiltroHistorial');
    const aplicarFiltro = document.getElementById('aplicarFiltroHistorial');
    const limpiarFiltro = document.getElementById('limpiarFiltroHistorial');

    toggleFilter.addEventListener('click', () => {
        filterContainer.style.display = filterContainer.style.display === 'none' ? 'block' : 'none';
    });

    aplicarFiltro.addEventListener('click', () => {
        const fechaSeleccionada = fechaFiltro.value; // Fecha seleccionada (YYYY-MM-DD)
        const tipoSeleccionado = tipoFiltro.value.toLowerCase();
        const nombreSeleccionado = nombreFiltro.value.trim().toLowerCase();

        const solicitudesFiltradas = solicitudesHistorialGlobal.filter(solicitud => {
            const fechaSolicitud = new Date(solicitud.FECHA_CREACION).toISOString().split('T')[0]; // Normalizar fecha
            const coincideFecha = !fechaSeleccionada || fechaSolicitud === fechaSeleccionada;
            const coincideTipo = !tipoSeleccionado || solicitud.TIPO_SOLICITUD.toLowerCase() === tipoSeleccionado;
            const coincideNombre = !nombreSeleccionado || solicitud.NOMBRE.toLowerCase().includes(nombreSeleccionado);

            return coincideFecha && coincideTipo && coincideNombre;
        });

        renderSolicitudesHistorial(solicitudesFiltradas);
    });

    limpiarFiltro.addEventListener('click', () => {
        fechaFiltro.value = '';
        tipoFiltro.value = '';
        nombreFiltro.value = '';
        renderSolicitudesHistorial(solicitudesHistorialGlobal); // Restaurar lista completa
    });
});

// Función para cargar solicitudes con técnico asignado
async function cargarSolicitudesConTecnico() {
    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/obtenerTodasLasSolicitudes');

        if (!response.ok) {
            throw new Error('Error al obtener las solicitudes asignadas');
        }

        const data = await response.json();
        solicitudesHistorialGlobal = data.solicitudes.filter(solicitud => solicitud.TECNICO_ASIGNADO);

        // Llenar filtros dinámicos
        llenarFiltrosHistorial(solicitudesHistorialGlobal);

        // Renderizar solicitudes asignadas
        renderSolicitudesHistorial(solicitudesHistorialGlobal);
    } catch (error) {
        console.error('Error al cargar solicitudes asignadas:', error);
    }
}

// Función para llenar los filtros dinámicos
function llenarFiltrosHistorial(solicitudes) {
    // Obtener fechas únicas
    const fechasUnicas = [...new Set(solicitudes.map(s => {
        const fecha = new Date(s.FECHA_CREACION);
        return fecha.toISOString().split('T')[0];
    }))];

    fechasUnicas.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = new Date(fecha).toLocaleDateString();
        document.getElementById('fechaFiltroHistorial').appendChild(option);
    });

    // Obtener tipos únicos
    const tiposUnicos = [...new Set(solicitudes.map(s => s.TIPO_SOLICITUD.toLowerCase()))];
    tiposUnicos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = capitalizeWords(tipo);
        document.getElementById('tipoFiltroHistorial').appendChild(option);
    });
}

// Función para renderizar las solicitudes asignadas
function renderSolicitudesHistorial(lista) {
    const solicitudesHistorial = document.getElementById('solicitudes-historial');
    solicitudesHistorial.innerHTML = ''; // Limpiar contenido previo

    lista.forEach(solicitud => {
        const solicitudItem = document.createElement('div');
        solicitudItem.classList.add('solicitud-item');

        const necesitaCompraText = solicitud.NECESITA_COMPRA === 'Y' ? 'Sí' : 'No';

        solicitudItem.innerHTML = `
            <p><strong>Nombre Cliente:</strong> ${solicitud.NOMBRE}</p>
            <p><strong>Tipo de Solicitud:</strong> ${solicitud.TIPO_SOLICITUD}</p>
            <p><strong>Fecha de creación:</strong> ${new Date(solicitud.FECHA_CREACION).toLocaleDateString()}</p>
            <p><strong>Dirección:</strong> ${solicitud.DIRECCION}</p>
            <p><strong>Marca:</strong> ${solicitud.MARCA_PRODUCTO}</p>
            <p><strong>Modelo:</strong> ${solicitud.MODELO_PRODUCTO}</p>
            <p><strong>Necesita Compra:</strong> ${necesitaCompraText}</p>
            <p><strong>Técnico Asignado:</strong> ${solicitud.TECNICO_ASIGNADO}</p>
            <p><strong>Estado:</strong> ${solicitud.ESTADO}</p>
        `;
        solicitudesHistorial.appendChild(solicitudItem);
    });
}

// Función para capitalizar palabras
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
