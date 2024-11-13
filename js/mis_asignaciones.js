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

            // Crear el dropdown para seleccionar el estado
            const estadoSelect = document.createElement('select');
            estadoSelect.innerHTML = `
                <option value="Pendiente" ${asignacion.ESTADO_SOLICITUD === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="En Proceso" ${asignacion.ESTADO_SOLICITUD === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                <option value="Finalizada" ${asignacion.ESTADO_SOLICITUD === 'Finalizada' ? 'selected' : ''}>Finalizada</option>
            `;

            // Botón para guardar el estado
            const guardarBtn = document.createElement('button');
            guardarBtn.textContent = 'Guardar Estado';
            guardarBtn.classList.add('btn-guardar');
            guardarBtn.addEventListener('click', () => actualizarEstado(asignacion.ID_SOLICITUD, estadoSelect.value));

            // Agregar la información y controles a la solicitud
            asignacionItem.innerHTML = `
                <p><strong>Tipo de Solicitud:</strong> ${asignacion.TIPO_SOLICITUD}</p>
                <p><strong>Dirección:</strong> ${asignacion.DIRECCION}</p>
                <p><strong>Marca:</strong> ${asignacion.MARCA_PRODUCTO}</p>
                <p><strong>Modelo:</strong> ${asignacion.MODELO_PRODUCTO}</p>
                <p><strong>Necesita Compra:</strong> ${necesitaCompraText}</p>
                <p><strong>Estado de la Solicitud:</strong></p>
            `;
            
            // Añadir el selector de estado y el botón al contenedor de asignación
            asignacionItem.appendChild(estadoSelect);
            asignacionItem.appendChild(guardarBtn);
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

// Función para actualizar el estado de una solicitud
async function actualizarEstado(idSolicitud, nuevoEstado) {
    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/api/actualizarEstado', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idSolicitud, nuevoEstado })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el estado');
        }

        const data = await response.json();
        alert(data.message); // Mostrar mensaje de éxito

        // Recargar asignaciones para reflejar los cambios
        await cargarAsignaciones();
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        alert('Error al actualizar el estado');
    }
}
