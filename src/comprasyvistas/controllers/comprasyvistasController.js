const { Router } = require('express');
const router = Router();
const axios = require('axios');
const comprasyvistasModel = require('../models/comprasyvistasModel');

const USERS_SERVICE_URL = "http://localhost:3001";

async function getUserIdByEmail(email) {
    const response = await axios.get(`${USERS_SERVICE_URL}/users/by-email/${email}`);
    const user = response.data;
    if(!user || !user.id) {
        throw new Error("No se encontró el usuario con ese email");
    }
    return user.id;
}

router.get('/comprasyvistas/alive', (req, res) => {
    res.send({ status: 'running' });
});

router.post('/comprasyvistas/venta', async (req, res) => {
    const { usuarioEmail, vehiculoId, metodoPago, total } = req.body;
    if (!usuarioEmail || !vehiculoId || !metodoPago || !total) {
        return res.status(400).json({ error: 'Datos incompletos para venta' });
    }
    try {
        const userId = await getUserIdByEmail(usuarioEmail);
        const nuevaVenta = await comprasyvistasModel.registrarVenta(userId, vehiculoId, metodoPago, total);
        res.status(201).json(nuevaVenta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos de usuario o al registrar la venta" });
    }
});

router.post('/solicitar-credito', async (req, res) => {
    const { usuarioId, vehiculoId } = req.body;

    try {
        if (!usuarioId || !vehiculoId) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        const aprobado = Math.random() < 0.5; 
        const estado = aprobado ? 'aprobado' : 'rechazado';

        const result = await comprasModel.registrarSolicitudCredito(usuarioId, vehiculoId, estado);

        res.status(200).json({
            mensaje: `La solicitud fue ${estado}`,
            resultado: result
        });

    } catch (error) {
        console.error('Error al procesar solicitud de crédito:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud de crédito' });
    }
});

router.get('/comprasyvistas/ventas', async (req, res) => {
    const ventas = await comprasyvistasModel.obtenerVentas();
    res.json(ventas);
});

router.get('/comprasyvistas/ventas/:usuarioEmail', async (req, res) => {
    const { usuarioEmail } = req.params;
    try {
        const userId = await getUserIdByEmail(usuarioEmail);
        const ventasUsuario = await comprasyvistasModel.obtenerVentasPorUsuario(userId);
        res.json(ventasUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos de usuario o ventas" });
    }
});

router.post('/comprasyvistas/visita', async (req, res) => {
    const { usuarioEmail, vehiculoId, fecha } = req.body;
    if (!usuarioEmail || !vehiculoId || !fecha) {
        return res.status(400).json({ error: 'Datos incompletos para visita' });
    }
    try {
        const userId = await getUserIdByEmail(usuarioEmail);
        const nuevaVisita = await comprasyvistasModel.programarVisita(userId, vehiculoId, fecha);
        res.status(201).json(nuevaVisita);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos de usuario o al programar la visita" });
    }
});

router.get('/comprasyvistas/visitas', async (req, res) => {
    const visitas = await comprasyvistasModel.obtenerVisitas();
    res.json(visitas);
});

router.get('/comprasyvistas/visitas/:usuarioEmail', async (req, res) => {
    const { usuarioEmail } = req.params;
    try {
        const userId = await getUserIdByEmail(usuarioEmail);
        const visitasUsuario = await comprasyvistasModel.obtenerVisitasPorUsuario(userId);
        res.json(visitasUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos de usuario o visitas" });
    }
});

module.exports = router;