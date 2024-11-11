// Intentos fallidos permitidos
let intentosFallidos = 0;
const MAX_INTENTOS = 3;

// Función para capturar los datos del formulario de login
async function loginUsuario(event) {
    event.preventDefault(); // Prevenir que el formulario se envíe de forma tradicional

    // Verificar si ya existe una sesión activa
    if (localStorage.getItem('usuario')) {
        alert('Ya hay una sesión activa. Por favor, cierra la sesión antes de iniciar con otra cuenta.');
        return;
    }

    // Capturar los datos del formulario
    const email = document.querySelector('input[name="email"]').value;
    const contrasena = document.querySelector('input[name="contrasena"]').value;
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; // Limpiar mensaje de error previo

    const data = { email, contrasena };

    try {
        // Enviar los datos al servidor para autenticar
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();

            // Verificar que la dirección esté presente en los datos del usuario
            console.log(result.usuario); // Añadir log para depuración

            // Almacenar los datos del usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify(result.usuario));

            // Almacenar el token en localStorage
            localStorage.setItem('usuarioToken', result.token);
            console.log('Token almacenado:', result.token);

            // Redirigir a la página de solicitudes
            alert('Login exitoso');
            window.location.href = 'index.html';
        } else {
            intentosFallidos += 1;
            const errorMsg = await response.text();
            errorMessage.textContent = `Error: ${errorMsg}`;

            if (intentosFallidos >= MAX_INTENTOS) {
                alert('Demasiados intentos fallidos. Redirigiendo a restablecimiento de contraseña.');
                window.location.href = 'recuperar_contrasena.html';
            } else {
                alert(`Intento fallido ${intentosFallidos} de ${MAX_INTENTOS}`);
            }
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        alert('Ocurrió un error al intentar iniciar sesión. Inténtelo de nuevo más tarde.');
    }
}

// Función para cerrar sesión
function logoutUsuario() {
    console.log("Cerrando sesión..."); // Añadir log para depuración
    // Eliminar datos de usuario en localStorage y redirigir a la página principal
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuarioToken'); // Eliminar el token del localStorage
    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html'; // Redirige a la página principal después de cerrar sesión
}

// Asignar el evento de submit al formulario de login
const loginForm = document.querySelector('#loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', loginUsuario);
}

// Verificar si hay un botón de cierre de sesión y asignar el evento
const logoutBtn = document.querySelector('#logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Evita comportamiento por defecto
        logoutUsuario();
    });
} else {
    console.error("No se encontró el botón de cerrar sesión con el ID 'logoutBtn'");
}