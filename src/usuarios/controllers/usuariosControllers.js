const { Router } = require('express');
const router = Router();
const usuariosModel = require('../models/usuariosModels');

router.get('/users/alive', async (req, res) => {
    res.send({ status: 'running' });
});

router.post('/users/create', async (req, res) => {
    console.log('Body recibido:', req.body);
    const rname = req.body.name;
    const remail = req.body.email;
    const rdate_birth = req.body.date_birth;
    const rpassword = req.body.password;
    console.log(rname, remail, rdate_birth, rpassword);

    try {
        const result = await usuariosModel.createUser(rname, remail, rdate_birth, rpassword);
        res.status(201).send("USER REGISTER SUCCESFULL");
    } catch (error) {
        res.status(500).json({ error: "Error al crear el usuario" });
    }
});

// Obtiene todos los usuarios
router.get('/users/all', async (req, res) => {
    try {
        const users = await usuariosModel.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});

// Obtiene la información de un usuario por id
router.get('/users/info/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await usuariosModel.getUserInfo(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la información del usuario" });
    }
});

// Obtiene la información de un usuario por email
router.get('/users/by-email/:email', async (req, res) => {
    const { email } = req.params;
    console.log("Email recibido:", email);
    console.log("params", req.params);
    try {
        const result = await usuariosModel.getUserByEmail(email);
        // El método getUserByEmail retorna un arreglo en result[0]
        const user = result[0][0];
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error al obtener usuario por email:", error);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
});

// Actualiza la información de un usuario
router.put('/users/update', async (req, res) => {
    try {
        const updates = req.body; // Se espera { email, name, date_birth, password, role }
        const result = await usuariosModel.editUser(updates);
        res.json({ message: "Usuario actualizado correctamente", result });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
});

// Autentica un usuario
router.post('/users/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await usuariosModel.authenticateUser(email, password);
        const usersFound = result[0];
        if (usersFound.length > 0) {
            res.json({ message: "Autenticación exitosa", user: usersFound[0] });
        } else {
            res.status(401).json({ message: "Credenciales inválidas" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al autenticar el usuario" });
    }
});

module.exports = router;