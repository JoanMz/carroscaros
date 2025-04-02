const ventas = []; // Almacén temporal de ventas

function registrarVenta(usuarioId, vehiculoId, metodoPago) {
    const nuevaVenta = { id: ventas.length + 1, usuarioId, vehiculoId, metodoPago, fecha: new Date() };
    ventas.push(nuevaVenta);
    return nuevaVenta;
}

function obtenerVentas() {
    return ventas;
}

function obtenerVentasPorUsuario(usuarioId) {
    return ventas.filter(venta => venta.usuarioId === usuarioId);
}

module.exports = { registrarVenta, obtenerVentas, obtenerVentasPorUsuario };
