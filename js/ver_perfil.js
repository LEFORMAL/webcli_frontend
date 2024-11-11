document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Obtener la información del usuario desde el servidor
        const response = await fetch('https://webclibackend-production.up.railway.app/obtenerPerfil', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('usuarioToken') // Enviar solo el email o token
            }
        });

        if (response.ok) {
            const usuario = await response.json();

            // Mostrar la información en el HTML
            document.getElementById('nombres').textContent = usuario.nombres || '';
            document.getElementById('apellidos').textContent = usuario.apellidos || '';
            document.getElementById('email').textContent = usuario.email || '';
            document.getElementById('telefono').textContent = usuario.telefono || '';
            document.getElementById('direccion').textContent = usuario.direccion || '';
            document.getElementById('fecha_nacimiento').textContent = usuario.fecha_nacimiento || '';
        } else {
            alert('Hubo un problema al obtener la información del perfil.');
            console.error('Error:', await response.text());
        }
    } catch (error) {
        console.error('Error al cargar la información del perfil:', error);
        alert('Ocurrió un error al cargar la información del perfil. Inténtelo más tarde.');
    }
});
