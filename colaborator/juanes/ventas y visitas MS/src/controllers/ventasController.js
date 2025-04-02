const express = require('express');
const router = express.Router();
const ventaModel = require('../models/ventaModel');

router.post('/', (req, res) => {
    const { usuarioId, vehiculoId, metodoPago } = req.body;
    const nuevaVenta = ventaModel.registrarVenta(usuarioId, vehiculoId, metodoPago);
    res.status(201).json(nuevaVenta);
});

router.get('/', (req, res) => {
    res.json(ventaModel.obtenerVentas());
});

router.get('/:usuarioId', (req, res) => {
    const { usuarioId } = req.params;
    res.json(ventaModel.obtenerVentasPorUsuario(usuarioId));
});

module.exports = router;


