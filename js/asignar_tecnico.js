// Inicializar variable global para solicitudes
let solicitudes = [];

// Cargar solicitudes y técnicos al cargar la página
document.addEventListener('DOMContentLoaded', async function () {
    await cargarSolicitudes();
    await cargarTecnicos();

    const toggleFilter = document.getElementById('toggleFilter');
    const filterContainer = document.getElementById('filterContainer');
    const fechaFiltro = document.getElementById('fechaFiltro');
    const tipoFiltro = document.getElementById('tipoFiltro');
    const nombreFiltro = document.getElementById('nombreFiltro');
    const aplicarFiltro = document.getElementById('aplicarFiltro');
    const limpiarFiltro = document.getElementById('limpiarFiltro');

    toggleFilter.addEventListener('click', () => {
        filterContainer.style.display = filterContainer.style.display === 'none' ? 'block' : 'none';
    });

    aplicarFiltro.addEventListener('click', () => {
        const fechaSeleccionada = fechaFiltro.value; // Fecha seleccionada en formato YYYY-MM-DD local
        const tipoSeleccionado = tipoFiltro.value.toLowerCase();
        const nombreSeleccionado = nombreFiltro.value.trim().toLowerCase();
    
        const solicitudesFiltradas = solicitudes.filter(solicitud => {
            const fechaSolicitud = new Date(solicitud.FECHA_CREACION).toLocaleDateString('en-CA'); // Convertir a YYYY-MM-DD local
    
            const coincideFecha = !fechaSeleccionada || fechaSolicitud === fechaSeleccionada;
            const coincideTipo = !tipoSeleccionado || solicitud.TIPO_SOLICITUD.toLowerCase() === tipoSeleccionado;
            const coincideNombre = !nombreSeleccionado || solicitud.NOMBRE.toLowerCase().includes(nombreSeleccionado);
    
            return coincideFecha && coincideTipo && coincideNombre;
        });
    
        renderSolicitudes(solicitudesFiltradas);
    });
    
    

    limpiarFiltro.addEventListener('click', () => {
        fechaFiltro.value = '';
        tipoFiltro.value = '';
        nombreFiltro.value = '';
        renderSolicitudes(solicitudes); // Restaurar lista completa
    });
});

// Función para cargar las solicitudes desde el backend
async function cargarSolicitudes() {
    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/obtenerTodasLasSolicitudes');

        if (!response.ok) {
            throw new Error('Error al obtener las solicitudes');
        }

        const data = await response.json();
        solicitudes = data.solicitudes;

        // Filtrar solo las solicitudes sin técnico asignado
        const solicitudesSinTecnico = solicitudes.filter(solicitud => !solicitud.TECNICO_ASIGNADO);

        // Llenar filtros dinámicos
        llenarFiltrosDinamicos(solicitudesSinTecnico);

        // Renderizar solicitudes inicialmente
        renderSolicitudes(solicitudesSinTecnico);
    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
    }
}

function llenarFiltrosDinamicos(solicitudes) {
    // Obtener fechas únicas en formato YYYY-MM-DD local
    const fechasUnicas = [...new Set(solicitudes.map(s => {
        const fecha = new Date(s.FECHA_CREACION);
        return fecha.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
    }))];

    fechasUnicas.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha; // Fecha en formato local YYYY-MM-DD
        option.textContent = new Date(fecha).toLocaleDateString(); // Mostrar fecha en formato legible
        document.getElementById('fechaFiltro').appendChild(option);
    });

    // Obtener tipos únicos
    const tiposUnicos = [...new Set(solicitudes.map(s => s.TIPO_SOLICITUD.toLowerCase()))];
    tiposUnicos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = capitalizeWords(tipo);
        document.getElementById('tipoFiltro').appendChild(option);
    });
}



// Filtro con normalización de fechas
aplicarFiltro.addEventListener('click', () => {
    const fechaSeleccionada = fechaFiltro.value; // Fecha en formato ISO (YYYY-MM-DD)
    const tipoSeleccionado = tipoFiltro.value.toLowerCase();
    const nombreSeleccionado = nombreFiltro.value.trim().toLowerCase();

    const solicitudesFiltradas = solicitudes.filter(solicitud => {
        const fechaSolicitud = new Date(solicitud.FECHA_CREACION).toISOString().split('T')[0]; // Normalizar fecha
        const coincideFecha = !fechaSeleccionada || fechaSolicitud === fechaSeleccionada;
        const coincideTipo = !tipoSeleccionado || solicitud.TIPO_SOLICITUD.toLowerCase() === tipoSeleccionado;
        const coincideNombre = !nombreSeleccionado || solicitud.NOMBRE.toLowerCase().includes(nombreSeleccionado);

        return coincideFecha && coincideTipo && coincideNombre;
    });

    renderSolicitudes(solicitudesFiltradas);
});


// Función para renderizar las solicitudes en la lista
function renderSolicitudes(lista) {
    const solicitudesList = document.getElementById('solicitudes-list');
    solicitudesList.innerHTML = ''; // Limpiar contenido previo

    lista.forEach(solicitud => {
        const solicitudItem = document.createElement('div');
        solicitudItem.classList.add('solicitud-item');

        // Formatear la fecha para que sea más legible
        const fechaFormateada = new Date(solicitud.FECHA_CREACION).toLocaleDateString();

        const necesitaCompraText = solicitud.NECESITA_COMPRA === 'Y' ? 'Sí' : 'No';

        solicitudItem.innerHTML = `
            <p><strong>Nombre Cliente:</strong> ${solicitud.NOMBRE}</p>
            <p><strong>Tipo de Solicitud:</strong> ${solicitud.TIPO_SOLICITUD}</p>
            <p><strong>Fecha de solicitud:</strong> ${fechaFormateada}</p>
            <p><strong>Dirección:</strong> ${solicitud.DIRECCION}</p>
            <p><strong>Marca:</strong> ${solicitud.MARCA_PRODUCTO}</p>
            <p><strong>Modelo:</strong> ${solicitud.MODELO_PRODUCTO}</p>
            <p><strong>Necesita Compra:</strong> ${necesitaCompraText}</p>
        `;
        solicitudItem.addEventListener('click', () => openModal(solicitud.ID_SOLICITUD));
        solicitudesList.appendChild(solicitudItem);
    });
}


// Función para cargar los técnicos disponibles
async function cargarTecnicos() {
    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/tecnicos');
        const tecnicos = await response.json();

        const tecnicoSelect = document.getElementById('tecnico');
        tecnicos.forEach(tecnico => {
            const option = document.createElement('option');
            option.value = `${tecnico.nombres} ${tecnico.apellidos}`;
            option.textContent = `${tecnico.nombres} ${tecnico.apellidos}`;
            tecnicoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar técnicos:', error);
    }
}

// Función para abrir el modal
function openModal(solicitudId) {
    document.getElementById('assignTechnicianModal').style.display = 'flex';
    const selectedSolicitudElement = document.getElementById('selectedSolicitud');
    if (selectedSolicitudElement) {
        selectedSolicitudElement.value = solicitudId;
    }
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('assignTechnicianModal').style.display = 'none';
}

// Función para capitalizar palabras
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
