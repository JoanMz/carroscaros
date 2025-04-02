const visitas = []; // Almacén temporal

function programarVisita(usuarioId, vehiculoId, fecha) {
    const nuevaVisita = { id: visitas.length + 1, usuarioId, vehiculoId, fecha };
    visitas.push(nuevaVisita);
    return nuevaVisita;
}

function obtenerVisitas() {
    return visitas;
}

function obtenerVisitasPorUsuario(usuarioId) {
    return visitas.filter(visita => visita.usuarioId === usuarioId);
}

module.exports = { programarVisita, obtenerVisitas, obtenerVisitasPorUsuario };
