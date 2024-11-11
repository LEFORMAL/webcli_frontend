// Función para enviar solicitud de restablecimiento de contraseña
async function solicitarRestablecimiento(event) {
    event.preventDefault(); // Prevenir recarga de página

    const email = document.querySelector('input[name="email"]').value;
    const statusMessage = document.getElementById('status-message');

    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/request-password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            statusMessage.textContent = 'Enlace de restablecimiento enviado a su correo.';
            statusMessage.style.color = 'green';
        } else {
            const errorMsg = await response.text();
            statusMessage.textContent = `Error: ${errorMsg}`;
            statusMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        statusMessage.textContent = 'Hubo un error. Intente nuevamente más tarde.';
        statusMessage.style.color = 'red';
    }
}

// Asignar el evento de submit al formulario
document.getElementById('resetPasswordForm').addEventListener('submit', solicitarRestablecimiento);
