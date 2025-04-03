const express = require('express');
const usersControllers = require('./controllers/usuariosControllers');
const morgan = require('morgan'); 
const cors = require('cors');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())

app.use(usersControllers);


app.listen(3001, () => {
  console.log('Microservicio Usuarios ejecutandose en el puerto 3001');
});