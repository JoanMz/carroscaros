const { Router } = require('express');
const router = Router();
const axios = require('axios');
const comprasyvistasModel = require('../models/comprasyvistasModel');

// URL base del servicio de usuarios
const USERS_SERVICE_URL = "http://localhost:3001";

// Helper: obtener el id del usuario a partir del email
async function getUserIdByEmail(email) {
    // Se asume que el servicio de usuarios tiene un endpoint "GET /users/by-email/:email" que devuelve un objeto usuario
    const response = await axios.get(`${USERS_SERVICE_URL}/users/by-email/${email}`);
    const user = response.data;
    if(!user || !user.id) {
        throw new Error("No se encontró el usuario con ese email");
    }
    return user.id;
}

// Endpoint para verificar el estado del servicio
router.get('/comprasyvistas/alive', (req, res) => {
    res.send({ status: 'running' });
});

// Ventas
router.post('/comprasyvistas/venta', async (req, res) => {
    const { usuarioEmail, vehiculoId, metodoPago, total } = req.body;
    if (!usuarioEmail || !vehiculoId || !metodoPago || !total) {
        return res.status(400).json({ error: 'Datos incompletos para venta' });
    }
    try {
        // Se consulta el servicio de usuarios para obtener el id asociado al email
        const userId = await getUserIdByEmail(usuarioEmail);
        const nuevaVenta = comprasyvistasModel.registrarVenta(userId, vehiculoId, metodoPago, total);
        res.status(201).json(nuevaVenta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos de usuario o al registrar la venta" });
    }
});

router.get('/comprasyvistas/ventas', (req, res) => {
    const ventas = comprasyvistasModel.obtenerVentas();
    res.json(ventas);
});

router.get('/comprasyvistas/ventas/:usuarioEmail', async (req, res) => {
    const { usuarioEmail } = req.params;
    try {
        const userId = await getUserIdByEmail(usuarioEmail);
        const ventasUsuario = comprasyvistasModel.obtenerVentasPorUsuario(userId);
        res.json(ventasUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos de usuario o ventas" });
    }
});

// Visitas
router.post('/comprasyvistas/visita', async (req, res) => {
    const { usuarioEmail, vehiculoId, fecha } = req.body;
    if (!usuarioEmail || !vehiculoId || !fecha) {
        return res.status(400).json({ error: 'Datos incompletos para visita' });
    }
    try {
        const userId = await getUserIdByEmail(usuarioEmail);
        const nuevaVisita = comprasyvistasModel.programarVisita(userId, vehiculoId, fecha);
        res.status(201).json(nuevaVisita);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos de usuario o al programar la visita" });
    }
});

router.get('/comprasyvistas/visitas', (req, res) => {
    const visitas = comprasyvistasModel.obtenerVisitas();
    res.json(visitas);
});

router.get('/comprasyvistas/visitas/:usuarioEmail', async (req, res) => {
    const { usuarioEmail } = req.params;
    try {
        const userId = await getUserIdByEmail(usuarioEmail);
        const visitasUsuario = comprasyvistasModel.obtenerVisitasPorUsuario(userId);
        res.json(visitasUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos de usuario o visitas" });
    }
});

module.exports = router;