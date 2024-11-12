document.addEventListener('DOMContentLoaded', async function() {
    try {
        const token = localStorage.getItem('usuarioToken');
        console.log('Token:', token);

        const response = await fetch('https://webclibackend-production.up.railway.app/obtenerSolicitudes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.newToken) {
                localStorage.setItem('usuarioToken', data.newToken);
            }

            const solicitudes = data.solicitudes || data;
            const solicitudesContainer = document.getElementById('solicitudesContainer');

            solicitudes.forEach((solicitud, index) => {
                const card = document.createElement('div');
                card.className = 'solicitud-card';
                card.id = `solicitud-${index}`;
                card.innerHTML = `
                    <p><strong>ID:</strong> ${solicitud.ID_SOLICITUD}</p>
                    <p><strong>Servicio:</strong> ${capitalizeWords(solicitud.TIPO_SOLICITUD)}</p>
                    <p><strong>Dirección:</strong> ${capitalizeWords(solicitud.DIRECCION)}</p>
                    <p><strong>Fecha:</strong> ${new Date(solicitud.FECHA_SOLICITUD).toLocaleDateString()}</p>
                `;
                // Agregar un evento de clic para redireccionar a la página de detalles
                card.addEventListener('click', () => {
                    // Guardar la solicitud en el localStorage para acceder desde la página de detalles
                    localStorage.setItem('solicitudDetalle', JSON.stringify(solicitud));
                    // Redirigir a la página de detalles
                    window.location.href = 'detalle_solicitud.html';
                });
                solicitudesContainer.appendChild(card);
            });
        } else {
            console.error('Error al cargar las solicitudes:', response.statusText);
            alert('Ocurrió un error al cargar las solicitudes. Inténtelo más tarde.');
        }
    } catch (error) {
        console.error('Error al cargar las solicitudes:', error);
        alert('Ocurrió un error al cargar las solicitudes. Inténtelo más tarde.');
    }
});

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Función para buscar solicitudes solo por ID
function buscarSolicitudes() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const cards = document.getElementsByClassName('solicitud-card');

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const solicitudId = card.querySelector('p strong').nextSibling.textContent.trim().toLowerCase();

        if (solicitudId.includes(filter)) {
            card.style.display = ''; // Mostrar la tarjeta si el ID coincide
            card.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Desplazarse a la coincidencia
            break; // Detener la búsqueda después de encontrar la primera coincidencia
        } else {
            card.style.display = 'none'; // Ocultar la tarjeta si no coincide
        }
    }
}

