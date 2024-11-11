document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resetPasswordForm');
    const statusMessage = document.getElementById('status-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        const newPassword = form.newPassword.value;
        const confirmPassword = form.confirmPassword.value;

        console.log('Token:', token);
        console.log('Email:', email);
        console.log('Nueva Contraseña:', newPassword);

        if (newPassword !== confirmPassword) {
            statusMessage.textContent = 'Las contraseñas no coinciden';
            statusMessage.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('https://webclibackend-production.up.railway.app/nueva_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, email, newPassword })
            });

            console.log('Respuesta del servidor:', response);

            if (response.ok) {
                statusMessage.textContent = 'Contraseña actualizada con éxito';
                statusMessage.style.color = 'green';
                form.reset();
            } else {
                const errorText = await response.text();
                console.error('Error del servidor:', errorText);
                statusMessage.textContent = `Error: ${errorText}`;
                statusMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            statusMessage.textContent = 'Error en el servidor. Intente más tarde';
            statusMessage.style.color = 'red';
        }
    });
});