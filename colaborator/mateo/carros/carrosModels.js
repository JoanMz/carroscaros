require('dotenv').config();
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    maxIdle: 2
});

// AQUI CREO LOS MODELOS QUE ME TOCAN EJ MODELO CREAR USUARIO MODELO CREAR USUARIO ADMIN

//rmake, rmodel, ryear, rprice, rmillage, rbodyt, rcilinders, rtransmission, rfuelt, rcolor, rdesc

async function registCar(make, model, year, price, millage, bodyt, cilinders, transmission, fuelt, color, desc){
    const result = await connection.query('INSERT INTO carros(Make,Model,Year,Price,Mileage,Body Type,Cylinders,Transmission,Fuel Type,Color,Description) VALUES(?,?,?,?)', [make, model, year, price, millage, bodyt, cilinders, transmission, fuelt, color, desc]);
    return result;
}

module.exports = {
    registCar
};