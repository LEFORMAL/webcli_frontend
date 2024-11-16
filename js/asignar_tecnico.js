// Cargar solicitudes y técnicos al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarSolicitudes();
    await cargarTecnicos();
});

// Función para cargar solo las solicitudes sin técnico asignado en la lista
async function cargarSolicitudes() {
    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/obtenerTodasLasSolicitudes');

        if (!response.ok) {
            throw new Error('Error al obtener las solicitudes');
        }

        const data = await response.json();
        const solicitudes = data.solicitudes;

        // Filtrar solo las solicitudes sin técnico asignado
        const solicitudesSinTecnico = solicitudes.filter(solicitud => !solicitud.TECNICO_ASIGNADO);

        // Mostrar las solicitudes sin técnico en la lista
        const solicitudesList = document.getElementById('solicitudes-list');
        solicitudesList.innerHTML = ''; // Limpiar contenido previo

        solicitudesSinTecnico.forEach(solicitud => {
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
            solicitudItem.addEventListener('click', () => openModal(solicitud.ID_SOLICITUD)); // Abrir modal al hacer clic
            solicitudesList.appendChild(solicitudItem);
        });
    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
    }
}

// Función para cargar técnicos en el formulario
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

// Manejar el formulario de asignación
document.getElementById('assignTechnicianForm').addEventListener('submit', async function(event) {
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

// Funciones para abrir y cerrar el modal
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
