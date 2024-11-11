document.addEventListener('DOMContentLoaded', async function() {
    try {
        const token = localStorage.getItem('usuarioToken');
        console.log('Token:', token); // Verificar el token en la consola

        const response = await fetch('https://webclibackend-production.up.railway.app/obtenerSolicitudes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Verificar los datos recibidos

            if (data.newToken) {
                localStorage.setItem('usuarioToken', data.newToken); // Guardar el nuevo token
            }

            const solicitudes = data.solicitudes || data;
            console.log('Solicitudes recibidas:', solicitudes); // Verificar las solicitudes recibidas

            const solicitudesContainer = document.getElementById('solicitudesContainer');

            solicitudes.forEach((solicitud, index) => {
                const card = document.createElement('div');
                card.className = 'solicitud-card';
                card.id = `solicitud-${index}`;
                card.innerHTML = `
                    <p><strong>ID:</strong> ${solicitud.ID_SOLICITUD}</p>
                    <p><strong>Servicio:</strong> ${capitalizeWords(solicitud.TIPO_SOLICITUD)}</p>
                    <p><strong>Fecha:</strong> ${new Date(solicitud.FECHA_SOLICITUD).toLocaleDateString()}</p>
                    <p><strong>Dirección:</strong> ${capitalizeWords(solicitud.DIRECCION)}</p>
                    <p><strong>Comuna:</strong> ${capitalizeWords(solicitud.COMUNA || '')}</p>
                    <p><strong>Región:</strong> ${capitalizeWords(solicitud.REGION || '')}</p>
                    <p><strong>RUT Usuario:</strong> ${solicitud.RUT_USUARIO}</p>
                    <p><strong>Nombre:</strong> ${capitalizeWords(solicitud.NOMBRE)}</p>
                    <p><strong>RUT/NIT:</strong> ${solicitud.RUT_NIT}</p>
                    <p><strong>Teléfono:</strong> ${solicitud.TELEFONO}</p>
                    <p><strong>Email:</strong> ${solicitud.EMAIL}</p>
                    <p><strong>Cantidad de Productos:</strong> ${solicitud.CANTIDAD_PRODUCTOS}</p>
                    <p><strong>Marca del Producto:</strong> ${capitalizeWords(solicitud.MARCA_PRODUCTO)}</p>
                    <p><strong>Modelo del Producto:</strong> ${capitalizeWords(solicitud.MODELO_PRODUCTO)}</p>
                    <p><strong>Necesita Compra:</strong> ${solicitud.NECESITA_COMPRA === 'Y' ? 'Sí' : 'No'}</p>
                    <p><strong>Fecha de Realización:</strong> ${new Date(solicitud.FECHA_REALIZACION).toLocaleDateString()}</p>
                    <p><strong>Medio de Pago:</strong> ${capitalizeWords(solicitud.MEDIO_PAGO)}</p>
                    <p><strong>Costo Total:</strong> ${solicitud.COSTO_TOTAL}</p>
                    <p><strong>Fecha de Creación:</strong> ${new Date(solicitud.FECHA_CREACION).toLocaleString()}</p>
                `;
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

// Función para capitalizar la primera letra de cada palabra
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Función para buscar solicitudes
function buscarSolicitudes() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const cards = document.getElementsByClassName('solicitud-card');

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const textContent = card.textContent || card.innerText;
        if (textContent.toLowerCase().indexOf(filter) > -1) {
            card.style.display = '';
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            break; // Desplazarse a la primera coincidencia y detener la búsqueda
        } else {
            card.style.display = 'none';
        }
    }
}