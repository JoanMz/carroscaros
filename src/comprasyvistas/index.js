const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const comprasyvistasController = require('./controllers/comprasyvistasController');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use(comprasyvistasController);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servicio Comprasyvistas corriendo en el puerto ${PORT}`);
});