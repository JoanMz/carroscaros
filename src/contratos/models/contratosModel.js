require('dotenv').config();
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
});

async function crearContrato(userId, carId, precioFinal, fechaContrato) {
    const sql = `INSERT INTO contratos (user_id, car_id, precio_final, fecha_contrato) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.query(sql, [userId, carId, precioFinal, fechaContrato]);
    return result;
}

async function obtenerContratos() {
    const sql = `SELECT * FROM contratos ORDER BY fecha_contrato DESC`;
    const [rows] = await connection.query(sql);
    return rows;
}

async function obtenerContratoPorId(id) {
    const sql = `SELECT * FROM contratos WHERE id = ?`;
    const [rows] = await connection.query(sql, [id]);
    return rows[0];
}

module.exports = {
    crearContrato,
    obtenerContratos,
    obtenerContratoPorId
};
