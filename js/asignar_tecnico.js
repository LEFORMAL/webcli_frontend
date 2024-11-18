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

    let solicitudes = []; // Variable global para almacenar las solicitudes

    toggleFilter.addEventListener('click', () => {
        filterContainer.style.display = filterContainer.style.display === 'none' ? 'block' : 'none';
    });

    aplicarFiltro.addEventListener('click', () => {
        const fechaSeleccionada = fechaFiltro.value;
        const tipoSeleccionado = tipoFiltro.value.toLowerCase();
        const nombreSeleccionado = nombreFiltro.value.toLowerCase();

        const solicitudesFiltradas = solicitudes.filter(solicitud => {
            const coincideFecha = !fechaSeleccionada || solicitud.FECHA_CREACION === fechaSeleccionada;
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
        renderSolicitudes(solicitudes);
    });

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
        const fechasUnicas = [...new Set(solicitudes.map(s => s.FECHA_CREACION))];
        const tiposUnicos = [...new Set(solicitudes.map(s => s.TIPO_SOLICITUD.toLowerCase()))];

        fechasUnicas.forEach(fecha => {
            const option = document.createElement('option');
            option.value = fecha;
            option.textContent = new Date(fecha).toLocaleDateString();
            fechaFiltro.appendChild(option);
        });

        tiposUnicos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo;
            option.textContent = capitalizeWords(tipo);
            tipoFiltro.appendChild(option);
        });
    }

    function renderSolicitudes(lista) {
        const solicitudesList = document.getElementById('solicitudes-list');
        solicitudesList.innerHTML = ''; // Limpiar contenido previo

        lista.forEach(solicitud => {
            const solicitudItem = document.createElement('div');
            solicitudItem.classList.add('solicitud-item');

            const necesitaCompraText = solicitud.NECESITA_COMPRA === 'Y' ? 'Sí' : 'No';

            solicitudItem.innerHTML = `
                <p><strong>Nombre Cliente:</strong> ${solicitud.NOMBRE}</p>
                <p><strong>Tipo de Solicitud:</strong> ${solicitud.TIPO_SOLICITUD}</p>
                <p><strong>Dirección:</strong> ${solicitud.DIRECCION}</p>
                <p><strong>Marca:</strong> ${solicitud.MARCA_PRODUCTO}</p>
                <p><strong>Modelo:</strong> ${solicitud.MODELO_PRODUCTO}</p>
                <p><strong>Necesita Compra:</strong> ${necesitaCompraText}</p>
            `;
            solicitudItem.addEventListener('click', () => openModal(solicitud.ID_SOLICITUD));
            solicitudesList.appendChild(solicitudItem);
        });
    }

    async function cargarTecnicos() {
        try {
            const response = await fetch('https://webclibackend-production.up.railway.app/api/tecnicos'); // Endpoint para obtener técnicos
            const tecnicos = await response.json();

            const tecnicoSelect = document.getElementById('tecnico');
            tecnicos.forEach(tecnico => {
                const option = document.createElement('option');
                option.value = `${tecnico.nombres} ${tecnico.apellidos}`; // Usar el nombre completo como valor
                option.textContent = `${tecnico.nombres} ${tecnico.apellidos}`;
                tecnicoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar técnicos:', error);
            const messageElement = document.getElementById('message');
            if (messageElement) {
                messageElement.textContent = 'Error al cargar técnicos';
            }
        }
    }

    document.getElementById('assignTechnicianForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const solicitudId = document.getElementById('selectedSolicitud').value; // Ahora usa el campo oculto
        const tecnicoNombre = document.getElementById('tecnico').value; // Nombre completo del técnico
        const fechaRealizacion = document.getElementById('fechaRealizacion').value;

        console.log("Enviando datos:", { solicitudId, tecnicoNombre, fechaRealizacion }); // Depuración

        try {
            const response = await fetch('https://webclibackend-production.up.railway.app/api/solicitud/asignar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ solicitudId, tecnicoNombre, fechaRealizacion }) // Enviar nombre completo
            });

            const messageElement = document.getElementById('message');
            if (response.ok) {
                if (messageElement) {
                    messageElement.textContent = 'Técnico asignado con éxito';
                }
                document.getElementById('assignTechnicianForm').reset();
                closeModal(); // Cerrar modal después de asignar
                await cargarSolicitudes(); // Volver a cargar la lista de solicitudes para reflejar cambios
            } else {
                const errorText = await response.text();
                if (messageElement) {
                    messageElement.textContent = `Error: ${errorText}`;
                }
            }
        } catch (error) {
            console.error('Error al asignar técnico:', error);
            const messageElement = document.getElementById('message');
            if (messageElement) {
                messageElement.textContent = 'Error al asignar técnico';
            }
        }
    });

    function openModal(solicitudId) {
        document.getElementById('assignTechnicianModal').style.display = 'flex';
        const selectedSolicitudElement = document.getElementById('selectedSolicitud');
        if (selectedSolicitudElement) {
            selectedSolicitudElement.value = solicitudId; // Asignar ID de la solicitud al campo oculto
        } else {
            console.error('Campo oculto selectedSolicitud no encontrado.');
        }
    }

    function closeModal() {
        document.getElementById('assignTechnicianModal').style.display = 'none';
    }

    function capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
});
