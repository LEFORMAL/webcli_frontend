// Cargar asignaciones del técnico al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarAsignaciones();
});

// Función para cargar asignaciones del técnico
async function cargarAsignaciones() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario')); // Obtener datos del usuario desde localStorage
        const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`; // Construir el nombre completo en el formato requerido
        console.log("Nombre del técnico enviado en la solicitud:", nombreCompleto); // Depuración

        const response = await fetch(`https://webclibackend-production.up.railway.app/api/mis_asignaciones?nombre=${encodeURIComponent(nombreCompleto)}`);
        
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

        // Verifica si no se encontraron asignaciones
        if (asignaciones.length === 0) {
            asignacionesList.innerHTML = `<p>No se encontraron asignaciones para el técnico ${nombreCompleto}</p>`;
        }
    } catch (error) {
        console.error('Error al cargar asignaciones:', error);
    }
}
