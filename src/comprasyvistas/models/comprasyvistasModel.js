require('dotenv').config();
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB, // se asume que es "carroscaros"
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function registrarVenta(usuarioId, vehiculoId, metodoPago, total) {
    try {
        const sql = "INSERT INTO ventas (usuario_id, vehiculo_id, metodo_pago, total) VALUES (?, ?, ?, ?)";
        const [result] = await connection.query(sql, [usuarioId, vehiculoId, metodoPago, total]);
        const nuevaVenta = {
            id: result.insertId,
            usuarioId,
            vehiculoId,
            metodoPago,
            total,
            fecha: new Date() // se asigna la fecha actual
        };
        return nuevaVenta;
    } catch (error) {
        console.error("Error al registrar venta:", error);
        throw error;
    }
}

async function obtenerVentas() {
    try {
        const [rows] = await connection.query("SELECT * FROM ventas");
        return rows;
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        throw error;
    }
}

async function obtenerVentasPorUsuario(usuarioId) {
    try {
        const [rows] = await connection.query("SELECT * FROM ventas WHERE usuario_id = ?", [usuarioId]);
        return rows;
    } catch (error) {
        console.error("Error al obtener ventas por usuario:", error);
        throw error;
    }
}

async function programarVisita(usuarioId, vehiculoId, fecha) {
    try {
        const sql = "INSERT INTO visitas (usuario_id, vehiculo_id, fecha_hora) VALUES (?, ?, ?)";
        const [result] = await connection.query(sql, [usuarioId, vehiculoId, fecha]);
        const nuevaVisita = {
            id: result.insertId,
            usuarioId,
            vehiculoId,
            fecha
        };
        return nuevaVisita;
    } catch (error) {
        console.error("Error al programar visita:", error);
        throw error;
    }
}

async function obtenerVisitas() {
    try {
        const [rows] = await connection.query("SELECT * FROM visitas");
        return rows;
    } catch (error) {
        console.error("Error al obtener visitas:", error);
        throw error;
    }
}

async function obtenerVisitasPorUsuario(usuarioId) {
    try {
        const [rows] = await connection.query("SELECT * FROM visitas WHERE usuario_id = ?", [usuarioId]);
        return rows;
    } catch (error) {
        console.error("Error al obtener visitas por usuario:", error);
        throw error;
    }
}

module.exports = {
    registrarVenta,
    obtenerVentas,
    obtenerVentasPorUsuario,
    programarVisita,
    obtenerVisitas,
    obtenerVisitasPorUsuario
};