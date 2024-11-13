document.getElementById('addServicioForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Agregar el tipo de usuario como "admin" (puedes modificarlo para que sea dinámico si tienes autenticación)
    data.user_tipo = 'admin';

    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/add-servicio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('message').textContent = 'Servicio agregado con éxito';
            this.reset(); // Limpiar el formulario
        } else {
            const errorText = await response.text();
            document.getElementById('message').textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        console.error('Error al agregar servicio:', error);
        document.getElementById('message').textContent = 'Ocurrió un error al intentar agregar el servicio';
    }
});
