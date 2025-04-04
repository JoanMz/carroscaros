require('dotenv').config();
const mysql = require('mysql2/promise');
const { get } = require('../controllers/usuariosControllers');


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
    connectTimeout: 10000
});

//async function traerUsuarios

async function createUser(name, email, date_birth, password){
    console.log(name, email, date_birth, password)
    const result = await connection.query('INSERT INTO carroscaros.users(name, email, date_birth, password) VALUES(?,?,?,?)', [name, email, date_birth, password]);
    return result;
}

async function getUserInfo(id_user){
    const result = await connection.query('SELECT * FROM carroscaros.users WHERE id = ?', [id_user]);
    return result;
}

async function getUserInfoByEmail(email){
    const result = await connection.query('SELECT * FROM carroscaros.users WHERE email = ?', [email]);
    return result;
}

async function getUserByEmail(email){
    const result = await connection.query('SELECT * FROM carroscaros.users WHERE email = ?', [email]);
    return result;
}

async function authenticateUser(email, password){
    const result = await connection.query('SELECT * FROM carroscaros.users WHERE email = ? AND password = ?', [email, password]);
    return result;
}

async function editUser(updates){
    try{
        const { name, email, date_birth, password, role } = updates;
        let sql = "UPDATE carroscaros.users SET";
        let values = [];
        if (!email){
            throw new Error("El email es obligatorio");
        }

        if (name) {
            sql += " name = ?";
            values.push(name);
        }
        if (date_birth){
            sql += " date_birth = ?";
            values.push(date_birth);
        }
        if (password){
            sql += " password = ?";
            values.push(password);
        }
        if (role){
            if (!["adm", "usr"].includes(role)){
                throw new Error("El rol debe ser 'admin' o 'user'");
            }
            sql += " role = ?";
            values.push(role);
        }
        sql += " WHERE email = ?";
        values.push(email);
        const [result] = await connection.query(sql, values);
        return result;

    } catch (error){
        console.error("Error al editar el usuario:", error);
        throw error;
    }
}

async function getAllUsers(){
    try {
        const sql = "SELECT * FROM carroscaros.users";
        const [result] = await connection.query(sql);
        return result;
    } catch (error) {
        console.error("Error al obtener todos los usuarios:", error);
        throw error;
    }
}    

module.exports = {
    createUser, getUserInfo, getUserByEmail, authenticateUser, editUser, getAllUsers, getUserInfoByEmail
};