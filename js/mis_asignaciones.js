// Función para cargar asignaciones del técnico
async function cargarAsignaciones() {
    try {
        const tecnico = JSON.parse(localStorage.getItem('usuario')).nombre;
        console.log("Nombre del técnico enviado en la solicitud:", tecnico); // Depuración

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

        // Verifica si no se encontraron asignaciones
        if (asignaciones.length === 0) {
            asignacionesList.innerHTML = `<p>No se encontraron asignaciones para el técnico ${tecnico}</p>`;
        }
    } catch (error) {
        console.error('Error al cargar asignaciones:', error);
    }
}
