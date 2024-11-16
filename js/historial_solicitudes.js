// Cargar solicitudes con técnico asignado al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarSolicitudesConTecnico();
});

// Función para cargar solicitudes con técnico asignado
async function cargarSolicitudesConTecnico() {
    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/obtenerTodasLasSolicitudes');

        if (!response.ok) {
            throw new Error('Error al obtener las solicitudes asignadas');
        }

        const data = await response.json();
        const solicitudes = data.solicitudes;

        // Filtrar las solicitudes que tienen un técnico asignado
        const solicitudesAsignadas = solicitudes.filter(solicitud => solicitud.TECNICO_ASIGNADO);

        const solicitudesHistorial = document.getElementById('solicitudes-historial');
        solicitudesHistorial.innerHTML = ''; // Limpiar contenido previo

        solicitudesAsignadas.forEach(solicitud => {
            const solicitudItem = document.createElement('div');
            solicitudItem.classList.add('solicitud-item');

            const necesitaCompraText = solicitud.NECESITA_COMPRA === 'Y' ? 'Sí' : 'No';

            solicitudItem.innerHTML = `
                <p><strong>Tipo de Solicitud:</strong> ${solicitud.NOMBRE}</p>
                <p><strong>Tipo de Solicitud:</strong> ${solicitud.TIPO_SOLICITUD}</p>
                <p><strong>Dirección:</strong> ${solicitud.DIRECCION}</p>
                <p><strong>Marca:</strong> ${solicitud.MARCA_PRODUCTO}</p>
                <p><strong>Modelo:</strong> ${solicitud.MODELO_PRODUCTO}</p>
                <p><strong>Necesita Compra:</strong> ${necesitaCompraText}</p>
                <p><strong>Técnico Asignado:</strong> ${solicitud.TECNICO_ASIGNADO}</p>
                <p><strong>Estado:</strong> ${solicitud.ESTADO}</p>
            `;
            solicitudesHistorial.appendChild(solicitudItem);
        });
    } catch (error) {
        console.error('Error al cargar solicitudes asignadas:', error);
    }
}
