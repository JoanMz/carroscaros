require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

const users = {}; // Simulación de BD

app.post("/usuarios/recuperar-password", (req, res) => {
    const { correo } = req.body;
    if (!users[correo]) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    
    const token = jwt.sign({ correo }, process.env.JWT_SECRET, { expiresIn: "15m" });
    console.log(`Token: ${token}`);
    res.json({ mensaje: "Correo enviado" });
});

app.post("/usuarios/restablecer-password", (req, res) => {
    const { token, nuevaContraseña } = req.body;
    try {
        const { correo } = jwt.verify(token, process.env.JWT_SECRET);
        users[correo] = bcrypt.hashSync(nuevaContraseña, 10);
        res.json({ mensaje: "Contraseña actualizada" });
    } catch {
        res.status(400).json({ mensaje: "Token inválido" });
    }
});

app.listen(3000, () => console.log("Servidor en puerto 3000"));

