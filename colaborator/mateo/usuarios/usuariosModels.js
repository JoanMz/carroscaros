require('dotenv').config();
require('mysql2/promise');


const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    maxIdle: 2
});

// AQUI CREO LOS MODELOS QUE ME TOCAN EJ MODELO CREAR USUARIO MODELO CREAR USUARIO ADMIN