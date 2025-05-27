const { Router, application } = require('express');
const router = Router();
const carrosModels = require('../models/carrosModels');
const client = require('prom-client');

const endpointCounter = new client.Counter({
  name: 'carros_api_requests_total',
  help: 'Conteo total de peticiones a la API de carros',
  labelNames: ['method', 'endpoint', 'status_code'],
});

// Middleware para contar cada request
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

router.get('/carros/alive', async(req, res) =>{
    res.send({'status': 'running'});
});


router.post('/carros/create', async (req, res) => {
    try {
        const { make, model, year, price, millage, bodyt, cilinders, transmission, fuelt, color, desc } = req.body;

        if (!make || !model || !year || !price || !millage || !bodyt || !cilinders || !transmission || !fuelt || !color || !desc) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const result = await carrosModels.registCar(make, model, year, price, millage, bodyt, cilinders, transmission, fuelt, color, desc);

        res.status(201).json({ message: "Carro registrado con éxito", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el carro" });
    }
});

router.put('/carros/change_state', async(req, res) => {
    try{
        const {car_id, status} = req.body;
        
        if (!car_id || !status){
            res.status(400).json({error: "Falta algun campo obligatorio"});
        }
        if (!["disponible", "no_disponible"].includes(status)){
            res.status(400).json({error: "Status incorrecto"})
        }
        const result = await carrosModels.editCarSaleStatus(car_id, status);
        res.status(201).json({message: "Estado de venta actualizado con exito", id: result.insertId});

    } catch (error){
        res.status(500).json({ error: "Error al cambiar el status del vehiculo" });
    }
});

router.get('/carros/buscar', async (req, res) => {
    try {
        const filters = {
            make: req.query.make,
            model: req.query.model,
            year: req.query.year,
            priceMin: req.query.priceMin,  // Se corrigió "priecMin"
            priceMax: req.query.priceMax,
            millageMin: req.query.millageMin,  // Se corrigió "millageMine"
            millageMax: req.query.millageMax,
        };


        const cars = await carrosModels.filterByFeatures(filters);
        res.json(cars);
    } catch (error) {
        console.error("Error al buscar vehículos:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

router.get("/carros/mostrar", async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const cars = await carrosModels.getCars(limit, offset);
        res.json(cars);
    } catch (error) {
        console.error("Error al obtener vehículos:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

router.post('/carros/lote', async (req, res) => {
    try {
        const carros = req.body.carros;

        if (!Array.isArray(carros) || carros.length === 0) {
            return res.status(400).json({ error: "Debe enviar una lista de carros válida" });
        }

        const resultados = [];
        for (const carro of carros) {
            const { make, model, year, price, millage, bodyt, cilinders, transmission, fuelt, color, desc } = carro;

            if (!make || !model || !year || !price || !millage || !bodyt || !cilinders || !transmission || !fuelt || !color || !desc) {
                return res.status(400).json({ error: "Faltan campos en uno o más carros" });
            }

            const result = await carrosModels.registCar(make, model, year, price, millage, bodyt, cilinders, transmission, fuelt, color, desc);
            resultados.push(result.insertId);
        }

        res.status(201).json({ message: "Carros registrados con éxito", ids: resultados });
    } catch (error) {
        console.error("Error en carga por lotes:", error);
        res.status(500).json({ error: "Error al registrar los carros en lote" });
    }
});


router.get('/metrics', async(req, res)=>{
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

module.exports = router;
