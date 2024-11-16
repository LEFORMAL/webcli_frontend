// Cargar historial de asignaciones al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await cargarHistorial();
});

// Función para cargar el historial de asignaciones del técnico
async function cargarHistorial() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario')); // Obtener datos del usuario desde localStorage
        const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`; // Construir el nombre completo en el formato requerido
        
        const response = await fetch(`https://webclibackend-production.up.railway.app/api/historial_asignaciones?nombre=${encodeURIComponent(nombreCompleto)}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener el historial de asignaciones');
        }

        const data = await response.json();
        const historial = data.solicitudes;
        
        // Mostrar el historial en formato de lista
        const historialList = document.getElementById('historial-list');
        historialList.innerHTML = ''; // Limpiar contenido previo

        historial.forEach(asignacion => {
            const asignacionItem = document.createElement('div');
            asignacionItem.classList.add('asignacion-item');

            asignacionItem.innerHTML = `
                <p><strong>Tipo de Solicitud:</strong> ${asignacion.NOMBRE}</p>
                <p><strong>Tipo de Solicitud:</strong> ${asignacion.TIPO_SOLICITUD}</p>
                <p><strong>Dirección:</strong> ${asignacion.DIRECCION}</p>
                <p><strong>Marca:</strong> ${asignacion.MARCA_PRODUCTO}</p>
                <p><strong>Modelo:</strong> ${asignacion.MODELO_PRODUCTO}</p>
                <p><strong>Estado:</strong> ${asignacion.ESTADO_SOLICITUD}</p>
            `;
            historialList.appendChild(asignacionItem);
        });

        if (historial.length === 0) {
            historialList.innerHTML = `<p>No hay asignaciones finalizadas para el técnico ${nombreCompleto}</p>`;
        }
    } catch (error) {
        console.error('Error al cargar el historial:', error);
    }
}
