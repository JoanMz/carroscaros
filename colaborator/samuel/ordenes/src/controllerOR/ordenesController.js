const express = require('express');
const router = express.Router();
const ordenesModel = require('../models/ordenesModel');

router.post('/', async (req, res) => {
    const { usuarioId, vehiculoId, metodoPago, total } = req.body;
    
    if (!usuarioId || !vehiculoId || !metodoPago || !total) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        const nuevaOrden = await ordenesModel.crearOrden(usuarioId, vehiculoId, metodoPago, total);
        res.status(201).json(nuevaOrden);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la orden' });
    }
});

router.get('/', async (req, res) => {
    try {
        const ordenes = await ordenesModel.obtenerOrdenes();
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
});

router.get('/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const ordenesUsuario = await ordenesModel.obtenerOrdenesPorUsuario(usuarioId);
        res.json(ordenesUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes del usuario' });
    }
});

module.exports = router;
