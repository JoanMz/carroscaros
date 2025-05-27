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
        // Verificamos si el vehículo existe y está disponible
        const [carros] = await connection.query("SELECT * FROM carros WHERE id = ?", [vehiculoId]);

        if (carros.length === 0) {
            throw new Error("El vehículo no existe");
        }

        const estado = carros[0].salestatus;
        if (estado !== 'disponible') {
            throw new Error("El vehículo no está disponible para la venta");
        }

        const sql = "INSERT INTO ventas (usuario_id, vehiculo_id, metodo_pago, total) VALUES (?, ?, ?, ?)";
        const [result] = await connection.query(sql, [usuarioId, vehiculoId, metodoPago, total]);

        // Llamamos al endpoint
        await axios.put('http://localhost:3003/carros/change_state', {
            car_id: vehiculoId,
            status: 'no_disponible'
        });

    
        const nuevaVenta = {
            id: result.insertId,
            usuarioId,
            vehiculoId,
            metodoPago,
            total,
            fecha: new Date()
        };

        return nuevaVenta;
    } catch (error) {
        console.error("Error al registrar venta:", error.message || error);
        throw error;
    }
}

async function obtenerVentas() {
    try {
        const [rows] = await connection.query("SELECT * FROM comprasyvistas.ventas");
        return rows;
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        throw error;
    }
}

async function obtenerVentasPorUsuario(usuarioId) {
    try {
        const [rows] = await connection.query("SELECT * FROM comprasyvistas.ventas WHERE usuario_id = ?", [usuarioId]);
        return rows;
    } catch (error) {
        console.error("Error al obtener ventas por usuario:", error);
        throw error;
    }
}


//SEPARARLO EN OTRO MICROSERVICIO
async function programarVisita(usuarioId, vehiculoId, fecha) {
    // Validar que la fecha sea real
    // vehiculoId debe existir y el estado del vehiculo debe ser "disponible"
    // usuarioId debe existir
    try {
        const sql = "INSERT INTO comprasyvistas.visitas (usuario_id, vehiculo_id, fecha_hora) VALUES (?, ?, ?)";
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
        const [rows] = await connection.query("SELECT * FROM comprasyvistas.visitas");
        return rows;
    } catch (error) {
        console.error("Error al obtener visitas:", error);
        throw error;
    }
}

async function obtenerVisitasPorUsuario(usuarioId) {
    try {
        const [rows] = await connection.query("SELECT * FROM comprasyvistas.visitas WHERE usuario_id = ?", [usuarioId]);
        return rows;
    } catch (error) {
        console.error("Error al obtener visitas por usuario:", error);
        throw error;
    }
}

async function solicitarCredito(usuarioId, vehiculoId) {
    try {
        // Simular respuesta de entidad financiera
        const estado = Math.random() < 0.5 ? 'aprobado' : 'rechazado';

        const sql = "INSERT INTO solicitudes_credito (usuario_id, vehiculo_id, estado) VALUES (?, ?, ?)";
        const [result] = await connection.query(sql, [usuarioId, vehiculoId, estado]);

        return {
            id: result.insertId,
            usuarioId,
            vehiculoId,
            estado,
            fecha: new Date()
        };
    } catch (error) {
        console.error("Error al solicitar crédito:", error);
        throw error;
    }
}

module.exports = {
    registrarVenta,
    obtenerVentas,
    obtenerVentasPorUsuario,
    programarVisita,
    obtenerVisitas,
    obtenerVisitasPorUsuario,
    solicitarCredito 
};