const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contratosRouter = require('./controllers/contratosController');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(contratosRouter);

app.listen(3005, () => {
    console.log("Microservicio de contratos en puerto 3005");
});
