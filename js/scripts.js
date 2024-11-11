// Cargar el navbar y el footer desde archivos externos
window.onload = function() {
    loadComponent("navbar", "components/navbar.html");
    loadComponent("footer", "components/footer.html");

    setupAccordion();

    // Configuración para mostrar u ocultar los botones de sesión según el estado del usuario
    setNavbarButtonsVisibility();

    // Establecer la fecha actual en el campo de fecha "fecha-solicitud"
    const fechaHoy = new Date().toISOString().split('T')[0];
    const fechaSolicitudElement = document.getElementById('fecha-solicitud');

    if (fechaSolicitudElement) {
        fechaSolicitudElement.value = fechaHoy;
    }

    // Obtener el tipo de solicitud desde la URL (si está presente)
    const urlParams = new URLSearchParams(window.location.search);
    const tipoSolicitud = urlParams.get('tipo');

    if (tipoSolicitud) {
        const selectElement = document.getElementById('tipo-solicitud');
        if (selectElement) {
            const optionToSelect = Array.from(selectElement.options).find(
                option => option.value.toLowerCase() === tipoSolicitud.toLowerCase()
            );
            if (optionToSelect) {
                optionToSelect.selected = true;
            }
        }
    }
};

// Función para mostrar u ocultar los botones de sesión según el estado del usuario
function setNavbarButtonsVisibility() {
    // Verificar si el navbar está cargado y seleccionar los botones
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const verSolicitudesBtn = document.getElementById('verSolicitudesBtn');
    const miPerfilBtn = document.getElementById('miPerfilBtn');

    if (loginButton && registerButton && verSolicitudesBtn && miPerfilBtn) {
        // Verificar si el usuario está en localStorage (sesión activa)
        const usuario = localStorage.getItem('usuario');
        
        if (usuario) {
            // Si hay un usuario logueado, ocultamos los botones de Iniciar Sesión y Registrarse
            loginButton.style.display = 'none';
            registerButton.style.display = 'none';
            verSolicitudesBtn.style.display = 'inline-block';
            miPerfilBtn.style.display = 'inline-block';
        } else {
            // Si no hay usuario, mostramos los botones de Iniciar Sesión y Registrarse
            loginButton.style.display = 'inline-block';
            registerButton.style.display = 'inline-block';
            verSolicitudesBtn.style.display = 'none';
            miPerfilBtn.style.display = 'none';
        }
    } else {
        console.error("No se encontraron los botones de sesión en el navbar.");
    }
}

// Función para cerrar sesión y volver a mostrar los botones
function logoutUsuario() {
    localStorage.removeItem('usuario'); // Elimina el usuario de localStorage
    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html'; // Redirige a la página principal

    // Vuelve a mostrar los botones de inicio de sesión y registro
    setNavbarButtonsVisibility();
}

// Función mejorada para cargar componentes externos como navbar y footer
function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el componente: ' + filePath);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                
                // Asegurarse de que los botones de sesión estén visibles o no según el estado del usuario
                setNavbarButtonsVisibility();
            } else {
                console.error('Elemento con ID ' + elementId + ' no encontrado');
            }
        })
        .catch(error => console.error(error));
}

// Configurar el comportamiento del acordeón
function setupAccordion() {
    const accordions = document.querySelectorAll('.accordion-button');
    accordions.forEach(button => {
        button.addEventListener('mouseover', () => {
            const content = button.nextElementSibling;
            button.classList.add('active');
            content.style.maxHeight = content.scrollHeight + "px";
        });
        button.addEventListener('mouseout', () => {
            const content = button.nextElementSibling;
            button.classList.remove('active');
            content.style.maxHeight = "0";
        });
    });
}

// Añadir smooth scroll para los enlaces con anclas
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});