const express = require('express'); 
const usersControllers = require('./carrosControllers'); 
const morgan = require('morgan');  
const app = express(); 
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(usersControllers);


app.listen(3000, () => { 
    console.log('Carroscaros ejecutandose en el puerto 3003'); 
  });