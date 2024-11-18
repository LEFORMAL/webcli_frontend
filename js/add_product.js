document.getElementById('addProductoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Agregar el tipo de usuario como "admin"
    data.user_tipo = 'admin';

    try {
        const response = await fetch('https://webclibackend-production.up.railway.app/add-producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('message').textContent = 'Producto agregado con éxito';
            this.reset(); // Limpiar el formulario
        } else {
            const errorText = await response.text();
            document.getElementById('message').textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        document.getElementById('message').textContent = 'Ocurrió un error al intentar agregar el producto';
    }
});
