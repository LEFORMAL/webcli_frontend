// Cargar solicitudes y técnicos al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarSolicitudes();
    await cargarTecnicos();
});

// Función para cargar solicitudes en la lista
async function cargarSolicitudes() {
    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/obtenerTodasLasSolicitudes');

        if (!response.ok) {
            throw new Error('Error al obtener las solicitudes');
        }

        const data = await response.json();
        const solicitudes = data.solicitudes;
        
        // Mostrar las solicitudes en formato de lista
        const solicitudesList = document.getElementById('solicitudes-list');
        solicitudesList.innerHTML = ''; // Limpiar contenido previo

        solicitudes.forEach(solicitud => {
            const solicitudItem = document.createElement('div');
            solicitudItem.classList.add('solicitud-item');
            solicitudItem.innerHTML = `
                <p><strong>Tipo de Solicitud:</strong> ${solicitud.TIPO_SOLICITUD}</p>
                <p><strong>Dirección:</strong> ${solicitud.DIRECCION}</p>
                <p><strong>Marca:</strong> ${solicitud.MARCA_PRODUCTO}</p>
                <p><strong>Modelo:</strong> ${solicitud.MODELO_PRODUCTO}</p>
                <p><strong>Necesita Compra:</strong> ${solicitud.NECESITA_COMPRA ? 'Sí' : 'No'}</p>
            `;
            solicitudItem.addEventListener('click', () => openModal(solicitud.ID_SOLICITUD)); // Abrir modal al hacer clic
            solicitudesList.appendChild(solicitudItem);
        });
    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
    }
}

// Función para cargar técnicos en el formulario del modal
async function cargarTecnicos() {
    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/tecnicos');
        const tecnicos = await response.json();

        const tecnicoSelect = document.getElementById('tecnico');
        tecnicoSelect.innerHTML = ''; // Limpiar opciones previas
        tecnicos.forEach(tecnico => {
            const option = document.createElement('option');
            option.value = tecnico.rut; // RUT del técnico
            option.textContent = `${tecnico.nombres} ${tecnico.apellidos}`;
            tecnicoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar técnicos:', error);
        document.getElementById('message').textContent = 'Error al cargar técnicos';
    }
}

// Manejar el formulario de asignación en el modal
document.getElementById('assignTechnicianForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const solicitudId = document.getElementById('selectedSolicitud').value; // ID de solicitud seleccionada
    const tecnicoRut = document.getElementById('tecnico').value;
    const fechaRealizacion = document.getElementById('fechaRealizacion').value;
    const estado = document.getElementById('estado').value;

    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/asignar-tecnico', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ solicitudId, tecnicoRut, fechaRealizacion, estado })
        });

        if (response.ok) {
            document.getElementById('message').textContent = 'Técnico asignado con éxito';
            document.getElementById('assignTechnicianForm').reset();
            closeModal(); // Cerrar el modal después de asignar
        } else {
            const errorText = await response.text();
            document.getElementById('message').textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        console.error('Error al asignar técnico:', error);
        document.getElementById('message').textContent = 'Error al asignar técnico';
    }
});

// Funciones para abrir y cerrar el modal
function openModal(solicitudId) {
    document.getElementById('assignTechnicianModal').style.display = 'flex';
    document.getElementById('selectedSolicitud').value = solicitudId; // Asignar ID de la solicitud al campo oculto
}

function closeModal() {
    document.getElementById('assignTechnicianModal').style.display = 'none';
}
