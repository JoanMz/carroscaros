const express = require('express'); 
const usersControllers = require('./controllers/carrosControllers'); 
const morgan = require('morgan');  
const app = express(); 
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(usersControllers);


app.listen(3003, () => { 
    console.log('Carroscaros ejecutandose en el puerto 3003'); 
  });