const express = require('express');
const router = express.Router();
const visitaModel = require('../models/visitaModel');

router.post('/', (req, res) => {
    const { usuarioId, vehiculoId, fecha } = req.body;
    const nuevaVisita = visitaModel.programarVisita(usuarioId, vehiculoId, fecha);
    res.status(201).json(nuevaVisita);
});

router.get('/', (req, res) => {
    res.json(visitaModel.obtenerVisitas());
});

router.get('/:usuarioId', (req, res) => {
    const { usuarioId } = req.params;
    res.json(visitaModel.obtenerVisitasPorUsuario(usuarioId));
});

module.exports = router;


