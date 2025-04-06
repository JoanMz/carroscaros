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
    connectTimeout: 10000
});

// AQUI CREO LOS MODELOS QUE ME TOCAN EJ MODELO CREAR USUARIO MODELO CREAR USUARIO ADMIN

//rmake, rmodel, ryear, rprice, rmillage, rbodyt, rcilinders, rtransmission, rfuelt, rcolor, rdesc

async function registCar(make, model, year, price, millage, bodyt, cilinders, transmission, fuelt, color, desc){
    try {
        const sql = "INSERT INTO carros (`Make`, `Model`, `Year`, `Price`, `Mileage`, `Body Type`, `Cylinders`, `Transmission`, `Fuel Type`, `Color`, `Description`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        const [result] = await connection.query(sql, [make, model, year, price, millage, bodyt, cilinders, transmission, fuelt, color, desc]);
        return result;
    } catch (error) {
        console.error("Error al registrar el carro:", error);
        throw error; 
    }
}

async function editCarSaleStatus(car_id, status){
    try{
        const sql = "UPDATE carroscaros.carros SET salestatus = ? WHERE id = ?; ";
        const [result] = await connection.query(sql, [status, car_id]);
        
        if (result.affectedRows === 0) {
            throw new Error("No se encontró el vehículo o el estado ya estaba actualizado.");
        }
        console.log("Filas afectadas:", result.affectedRows);      
        
        return result;
    } catch (error){
        console.error("Error al cambiar el estado del vehiculo:", error);
        throw error;
    }
}

//router.get("/buscar", async (req, res) =>
async function filterByFeatures(filters) {
    try {
        const { make, model, year, priceMin, priceMax, millageMin, millageMax } = filters;
        let sql = "SELECT * FROM carroscaros.carros WHERE 1=1";
        let values = [];

        if (make) {
            sql += " AND Make = ?";
            values.push(make);
        }
        if (model) {
            sql += " AND Model = ?";
            values.push(model);
        }
        if (year) {
            sql += " AND Year = ?";
            values.push(year);
        }
        if (priceMin) {
            sql += " AND Price >= ?";
            values.push(priceMin);
        }
        if (priceMax) {
            sql += " AND Price <= ?";
            values.push(priceMax);
        }
        if (millageMin) {
            sql += " AND Mileage >= ?";
            values.push(millageMin);
        }
        if (millageMax) {
            sql += " AND Mileage <= ?";
            values.push(millageMax);
        }

        sql += " AND salestatus = 'disponible'";

        const [rows] = await connection.query(sql, values);
        return rows;
    } catch (error) {
        console.error("Error al buscar vehículos:", error);
        throw error;
    }
}

async function getCars() {
    sql = "SELECT * FROM carroscaros.carros ORDER BY Year DESC;"
    const [rows] = await connection.query(sql);
    return rows;
}

module.exports = {
    registCar, editCarSaleStatus, filterByFeatures, getCars
};
