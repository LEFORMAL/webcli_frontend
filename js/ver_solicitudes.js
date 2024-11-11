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
            const solicitudes = await response.json();
            console.log('Solicitudes recibidas:', solicitudes); // Verificar los datos recibidos

            const solicitudesContainer = document.getElementById('solicitudesContainer');

            solicitudes.forEach((solicitud, index) => {
                const card = document.createElement('div');
                card.className = 'solicitud-card';
                card.id = `solicitud-${index}`;
                card.innerHTML = `
                    <p><strong>ID:</strong> ${solicitud[0]}</p>
                    <p><strong>Servicio:</strong> ${capitalizeWords(solicitud[1])}</p>
                    <p><strong>Fecha:</strong> ${new Date(solicitud[2]).toLocaleDateString()}</p>
                    <p><strong>Dirección:</strong> ${capitalizeWords(solicitud[3])}</p>
                    <p><strong>Comuna:</strong> ${capitalizeWords(solicitud[4] || '')}</p>
                    <p><strong>Región:</strong> ${capitalizeWords(solicitud[5] || '')}</p>
                    <p><strong>RUT Usuario:</strong> ${solicitud[6]}</p>
                    <p><strong>Nombre:</strong> ${capitalizeWords(solicitud[7])}</p>
                    <p><strong>RUT/NIT:</strong> ${solicitud[8]}</p>
                    <p><strong>Teléfono:</strong> ${solicitud[9]}</p>
                    <p><strong>Email:</strong> ${solicitud[10]}</p>
                    <p><strong>Cantidad de Productos:</strong> ${solicitud[11]}</p>
                    <p><strong>Marca del Producto:</strong> ${capitalizeWords(solicitud[12])}</p>
                    <p><strong>Modelo del Producto:</strong> ${capitalizeWords(solicitud[13])}</p>
                    <p><strong>Necesita Compra:</strong> ${solicitud[14] === 'Y' ? 'Sí' : 'No'}</p>
                    <p><strong>Fecha de Realización:</strong> ${new Date(solicitud[15]).toLocaleDateString()}</p>
                    <p><strong>Medio de Pago:</strong> ${capitalizeWords(solicitud[16])}</p>
                    <p><strong>Costo Total:</strong> ${solicitud[17]}</p>
                    <p><strong>Fecha de Creación:</strong> ${new Date(solicitud[18]).toLocaleString()}</p>
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