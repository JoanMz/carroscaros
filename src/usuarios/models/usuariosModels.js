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
    connectTimeout: 10000,  // Espera 10s antes de marcar error
    acquireTimeout: 10000 
});

//async function traerUsuarios

async function createUser(name, email, date_birth, password){
    console.log(name, email, date_birth, password)
    const result = await connection.query('INSERT INTO users(name, email, date_birth, password) VALUES(?,?,?,?)', [name, email, date_birth, password]);
    return result;
}

module.exports = {
    createUser
};