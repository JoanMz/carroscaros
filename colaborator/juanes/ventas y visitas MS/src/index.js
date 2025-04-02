const express = require('express');
const morgan = require('morgan');
const visitasController = require('./controllers/visitasController');
const ventasController = require('./controllers/ventasController');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/visitas', visitasController);
app.use('/ventas', ventasController);

// Puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
