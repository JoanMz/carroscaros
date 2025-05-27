const express = requiere('express');
const morgan = require('morgan');
const cors = require('cors');
const creditoController = require('./controllers/creditoController');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use(creditoController);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Servicio Credito corriendo en el puerto ${PORT}`);
});
