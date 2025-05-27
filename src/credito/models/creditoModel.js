require('dotenv').config();
const msysql = require('mysql2/promise');
const amqp = requiere('ampqlib');

const connection = msysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
});

async function crearCredito(userId, carId, monto, fechaSolicitud) {
    const sql = `INSERT INTO creditos (user_id, car_id, monto, fecha_solicitud) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.query(sql, [userId, carId, monto, fechaSolicitud]);
    return result;
}
async function solicitudCredito(userId, carId, monto, fechaSolicitud) {
    sendMessageToQueue('credito_solicitudes', JSON.stringify({
        userId,
        carId,
        monto,
        fechaSolicitud
    }));
    return { mensaje: 'Solicitud de crédito enviada a la cola', userId, carId, monto, fechaSolicitud };
}


async function sendMessageToQueue(queue, message) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
        
        console.log(`Mensaje enviado a la cola ${queue}:`, message);
        
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error al enviar mensaje a la cola:', error);
    }
}

module.exports = {
    crearCredito,
    solicitudCredito,
    sendMessageToQueue
}