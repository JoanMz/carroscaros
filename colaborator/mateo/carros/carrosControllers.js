const { Router } = require('express');
const router = Router();
const usuariosModel = require('./carrosModels');

router.get('carros/alive', async(req, res) =>{
    res.send({'status': 'running'});
});

router.post('carros/create', async(req, res) =>{
    const rmake = req.body.make; //Make mean the brand
    const rmodel = req.body.model; 
    const ryear = req.body.year;
    const rprice = req.body.price;
    const rmillage = req.body.millage;
    const rbodyt = req.body.bodyt; //Is the body type like hatcback sedan etc
    const rcilinders = req.body.cilinders;
    const rtransmission = req.body.transmission;
    const rfuelt = req.body.fuelt; //if use fuel, diesel, electric, hybrid
    const rcolor = req.body.color;
    const rdesc = req.body.desc;

    var resutl;

    resutl = await carrossModel.registCar(rmake, rmodel, ryear, rprice, rmillage, rbodyt, rcilinders,
                                          rtransmission, rfuelt, rcolor, rdesc);
    res.send("USER REGISTER SUCCESFULL");
});

