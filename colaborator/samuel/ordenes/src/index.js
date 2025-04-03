const express = require('express');
const morgan = require('morgan');
const ordenesController = require('./controllers/ordenesController');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/ordenes', ordenesController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Microservicio de órdenes corriendo en el puerto ${PORT}`);
});