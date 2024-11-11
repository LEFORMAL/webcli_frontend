// Validación en tiempo real y verificación de duplicados para el formulario de registro
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#registerForm');
    const emailField = registerForm.querySelector('input[name="email"]');
    const rutField = registerForm.querySelector('input[name="rut"]');
    const passwordField = registerForm.querySelector('input[name="contrasena"]');
    const confirmPasswordField = registerForm.querySelector('input[name="confirmar_contrasena"]');

    const emailError = document.getElementById('email-error');
    const rutError = document.getElementById('rut-error');
    const passwordError = document.getElementById('password-error');

    // Función para validar RUT en tiempo real
    rutField.addEventListener('input', () => {
        const rutValue = rutField.value;
        if (!/^\d{1,8}-[kK0-9]$/.test(rutValue)) {
            rutError.textContent = 'RUT inválido. Formato esperado: 12345678-K';
        } else {
            rutError.textContent = '';
        }
    });

    // Verificación de email en tiempo real y duplicado en la base de datos
    emailField.addEventListener('blur', async () => {
        const email = emailField.value;
        if (!/\S+@\S+\.\S+/.test(email)) {
            emailError.textContent = 'Formato de email inválido';
            return;
        }

        // Verificación de duplicados en el servidor
        try {
            const response = await fetch(`https://webclibackend-production.up.railway.app/check-email?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const { exists } = await response.json();
                emailError.textContent = exists ? 'Este email ya está registrado' : '';
            }
        } catch (error) {
            console.error('Error al verificar el email:', error);
        }
    });

    // Validación de contraseña en tiempo real
    passwordField.addEventListener('input', () => {
        const password = passwordField.value;
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números';
        } else {
            passwordError.textContent = '';
        }
    });

    // Validación de coincidencia de contraseñas
    confirmPasswordField.addEventListener('input', () => {
        if (confirmPasswordField.value !== passwordField.value) {
            passwordError.textContent = 'Las contraseñas no coinciden';
        } else {
            passwordError.textContent = '';
        }
    });

    // Función para enviar datos de registro al servidor
    async function registrarUsuario(event) {
        event.preventDefault(); // Evita el refresco de la página

        // Validar que los errores estén vacíos antes de enviar
        if (rutError.textContent || emailError.textContent || passwordError.textContent) {
            alert('Por favor, corrige los errores antes de continuar');
            return;
        }

        // Capturar datos del formulario
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://webclibackend-production.up.railway.app/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Usuario registrado con éxito');
                registerForm.reset(); // Limpiar formulario
                window.location.href = 'index.html'; // Redirigir al inicio
            } else {
                const errorMsg = await response.text();
                alert(`Error: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            alert('Ocurrió un error al intentar registrar el usuario. Por favor, inténtelo de nuevo más tarde.');
        }
    }

    // Asignar el evento de submit al formulario de registro
    registerForm.addEventListener('submit', registrarUsuario);
});
