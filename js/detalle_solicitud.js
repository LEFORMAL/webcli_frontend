document.addEventListener('DOMContentLoaded', function() {
    const solicitudDetalle = JSON.parse(localStorage.getItem('solicitudDetalle'));

    if (solicitudDetalle) {
        const detalleContainer = document.getElementById('detalleSolicitud');
        detalleContainer.innerHTML = `
            <p><strong>ID:</strong> ${solicitudDetalle.ID_SOLICITUD}</p>
            <p><strong>Servicio:</strong> ${capitalizeWords(solicitudDetalle.TIPO_SOLICITUD)}</p>
            <p><strong>Fecha:</strong> ${new Date(solicitudDetalle.FECHA_SOLICITUD).toLocaleDateString()}</p>
            <p><strong>Dirección:</strong> ${capitalizeWords(solicitudDetalle.DIRECCION)}</p>
            <p><strong>Comuna:</strong> ${capitalizeWords(solicitudDetalle.COMUNA || '')}</p>
            <p><strong>Región:</strong> ${capitalizeWords(solicitudDetalle.REGION || '')}</p>
            <p><strong>RUT Usuario:</strong> ${solicitudDetalle.RUT_USUARIO}</p>
            <p><strong>Nombre:</strong> ${capitalizeWords(solicitudDetalle.NOMBRE)}</p>
            <p><strong>RUT/NIT:</strong> ${solicitudDetalle.RUT_NIT}</p>
            <p><strong>Teléfono:</strong> ${solicitudDetalle.TELEFONO}</p>
            <p><strong>Email:</strong> ${solicitudDetalle.EMAIL}</p>
            <p><strong>Cantidad de Productos:</strong> ${solicitudDetalle.CANTIDAD_PRODUCTOS}</p>
            <p><strong>Marca del Producto:</strong> ${capitalizeWords(solicitudDetalle.MARCA_PRODUCTO)}</p>
            <p><strong>Modelo del Producto:</strong> ${capitalizeWords(solicitudDetalle.MODELO_PRODUCTO)}</p>
            <p><strong>Necesita Compra:</strong> ${solicitudDetalle.NECESITA_COMPRA === 'Y' ? 'Sí' : 'No'}</p>
            <p><strong>Fecha de Realización:</strong> ${new Date(solicitudDetalle.FECHA_REALIZACION).toLocaleDateString()}</p>
            <p><strong>Medio de Pago:</strong> ${capitalizeWords(solicitudDetalle.MEDIO_PAGO)}</p>
            <p><strong>Costo Total:</strong> ${solicitudDetalle.COSTO_TOTAL}</p>
            <p><strong>Fecha de Creación:</strong> ${new Date(solicitudDetalle.FECHA_CREACION).toLocaleString()}</p>
        `;
    } else {
        alert('No se encontraron detalles para esta solicitud.');
        window.history.back(); // Regresar si no hay detalles disponibles
    }
});

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
