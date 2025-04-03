require('dotenv').config();
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    maxIdle: 2,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    acquireTimeout: 10000
});

async function crearOrden(usuarioId, total, metodoPago) {
    try {
        const [result] = await connection.query(
            'INSERT INTO ordenes (usuario_id, total, metodo_pago) VALUES (?, ?, ?)',
            [usuarioId, total, metodoPago]
        );
        return { id: result.insertId, usuarioId, total, metodoPago };
    } catch (error) {
        console.error('Error al crear orden:', error);
        throw error;
    }
}

async function traerOrdenes() {
    try {
        const [rows] = await connection.query('SELECT * FROM ordenes');
        return rows;
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        throw error;
    }
}

async function traerOrden(id) {
    try {
        const [rows] = await connection.query('SELECT * FROM ordenes WHERE id = ?', [id]);
        return rows;
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        throw error;
    }
}

module.exports = { crearOrden, traerOrdenes, traerOrden };
