const { Router } = require('express');
const router = Router();
const client = require('prom-client');
const contratosModel = require('../models/contratosModel');


// Prometheus
const endpointCounter = new client.Counter({
  name: 'contratos_api_requests_total',
  help: 'Total de peticiones al microservicio de contratos',
  labelNames: ['method', 'endpoint', 'status_code'],
});

router.use((req, res, next) => {
  res.on('finish', () => {
    endpointCounter.inc({
      method: req.method,
      endpoint: req.path,
      status_code: res.statusCode,
    });
  });
  next();
});

// Endpoints
router.post('/contratos/create', async (req, res) => {
    const { userId, carId, precioFinal, fechaContrato } = req.body;
    try {
        const result = await contratosModel.crearContrato(userId, carId, precioFinal, fechaContrato);
        res.status(201).json({ message: "Contrato creado", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear contrato" });
    }
});

router.get('/contratos', async (req, res) => {
    try {
        const contratos = await contratosModel.obtenerContratos();
        res.json(contratos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener contratos" });
    }
});

router.get('/contratos/:id', async (req, res) => {
    try {
        const contrato = await contratosModel.obtenerContratoPorId(req.params.id);
        if (!contrato) {
            return res.status(404).json({ error: "Contrato no encontrado" });
        }
        res.json(contrato);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener contrato" });
    }
});

router.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

module.exports = router;
