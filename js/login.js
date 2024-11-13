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
        const response = await fetch('https://webclibackend-production.up.railway.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();

            // Almacenar los datos del usuario y el tipo en localStorage
            localStorage.setItem('usuario', JSON.stringify(result.usuario));
            localStorage.setItem('usuarioToken', result.token);
            localStorage.setItem('usuarioTipo', result.usuario.user_tipo); // Guarda el tipo de usuario

            // Redirigir según el rol del usuario
            if (result.usuario.user_tipo === 'admin') {
                alert('Bienvenido, administrador.');
                window.location.href = 'index.html'; // Vista para administradores
            } else {
                alert('Login exitoso');
                window.location.href = 'index.html'; // Vista estándar para usuarios
            }
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
    // Eliminar datos de usuario en localStorage y redirigir a la página principal
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuarioToken');
    localStorage.removeItem('usuarioTipo'); // Eliminar el tipo de usuario
    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html';
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
        event.preventDefault();
        logoutUsuario();
    });
}

// Función para mostrar u ocultar elementos de la interfaz según el tipo de usuario
function setupInterface() {
    const usuarioTipo = localStorage.getItem('usuarioTipo');
    if (usuarioTipo === 'admin') {
        // Mostrar opciones específicas para el administrador
        document.getElementById('adminOptions').style.display = 'block';
    } else {
        // Ocultar opciones específicas para el administrador
        document.getElementById('adminOptions').style.display = 'none';
    }
}

// Llamar a setupInterface al cargar la página para ajustar la interfaz según el rol
document.addEventListener('DOMContentLoaded', setupInterface);
