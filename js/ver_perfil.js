document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateProfileForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const nombres = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;

        const data = { email, nombres, apellidos, telefono, direccion, fecha_nacimiento };

        try {
            const response = await fetch('https://webclibackend-production.up.railway.app/actualizarPerfil', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                window.location.href = 'ver_perfil.html'; // Redirige a la página de visualización de perfil
            } else {
                const errorText = await response.text();
                alert(`Error al actualizar perfil: ${errorText}`);
            }
        } catch (error) {
            console.error('Error al enviar los datos de actualización de perfil:', error);
            alert('Error en el servidor. Inténtelo más tarde.');
        }
    });
});
