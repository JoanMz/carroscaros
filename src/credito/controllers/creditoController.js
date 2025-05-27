const { Router } = require('express');

const roruter = Router();
const axios = require('axios');
const creditoModel = require('../models/creditoModel.js');
const router = require('../../comprasyvistas/controllers/comprasyvistasController.js');
const USERS_SERVICE_URL = "http://localhost:3001";



router.get('', (req, res) => {
    
})