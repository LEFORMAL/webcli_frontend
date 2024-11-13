// Cargar asignaciones del técnico al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarAsignaciones();
});

// Función para cargar asignaciones del técnico
async function cargarAsignaciones() {
    try {
        // Obtener el nombre del técnico desde el localStorage
        const tecnico = JSON.parse(localStorage.getItem('usuario')).nombre;

        const response = await fetch(`https://webclibackend-production.up.railway.app/api/mis_asignaciones?nombre=${encodeURIComponent(tecnico)}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener las asignaciones');
        }

        const data = await response.json();
        const asignaciones = data.solicitudes;
        
        // Mostrar las asignaciones en formato de lista
        const asignacionesList = document.getElementById('asignaciones-list');
        asignacionesList.innerHTML = ''; // Limpiar contenido previo

        asignaciones.forEach(asignacion => {
            const asignacionItem = document.createElement('div');
            asignacionItem.classList.add('asignacion-item');

            const necesitaCompraText = asignacion.NECESITA_COMPRA === 'Y' ? 'Sí' : 'No';

            asignacionItem.innerHTML = `
                <p><strong>Tipo de Solicitud:</strong> ${asignacion.TIPO_SOLICITUD}</p>
                <p><strong>Dirección:</strong> ${asignacion.DIRECCION}</p>
                <p><strong>Marca:</strong> ${asignacion.MARCA_PRODUCTO}</p>
                <p><strong>Modelo:</strong> ${asignacion.MODELO_PRODUCTO}</p>
                <p><strong>Necesita Compra:</strong> ${necesitaCompraText}</p>
                <p><strong>Estado de la Solicitud:</strong> ${asignacion.ESTADO_SOLICITUD}</p>
            `;
            asignacionesList.appendChild(asignacionItem);
        });
    } catch (error) {
        console.error('Error al cargar asignaciones:', error);
    }
}
