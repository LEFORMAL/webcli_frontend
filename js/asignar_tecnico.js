// Cargar solicitudes y técnicos al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarSolicitudes();
    await cargarTecnicos();
});

// Función para cargar solicitudes en el formulario
async function cargarSolicitudes() {
    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/obtenerTodasLasSolicitudes');

        if (!response.ok) {
            throw new Error('Error al obtener las solicitudes');
        }

        const data = await response.json();
        const solicitudes = data.solicitudes;
        
        // Procesar y mostrar las solicitudes
        console.log(solicitudes);

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
            option.value = tecnico.rut; // RUT del técnico
            option.textContent = `${tecnico.nombres} ${tecnico.apellidos}`;
            tecnicoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar técnicos:', error);
        document.getElementById('message').textContent = 'Error al cargar técnicos';
    }
}

// Manejar el formulario de asignación
document.getElementById('assignTechnicianForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const solicitudId = document.getElementById('solicitud').value;
    const tecnicoRut = document.getElementById('tecnico').value;
    const fechaRealizacion = document.getElementById('fechaRealizacion').value;

    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/asignar-tecnico', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ solicitudId, tecnicoRut, fechaRealizacion })
        });

        if (response.ok) {
            document.getElementById('message').textContent = 'Técnico asignado con éxito';
            document.getElementById('assignTechnicianForm').reset();
        } else {
            const errorText = await response.text();
            document.getElementById('message').textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        console.error('Error al asignar técnico:', error);
        document.getElementById('message').textContent = 'Error al asignar técnico';
    }
});
