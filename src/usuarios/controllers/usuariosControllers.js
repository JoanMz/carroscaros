const { Router } = require('express');
const router = Router();
const usuariosModel = require('../models/usuariosModels');

router.get('/users/status', async(req, res) =>{
    res.send({'status': 'running'});
});

router.post('/users/create', async(req, res) =>{
    console.log('Body recibido:', req.body);
    const rname = req.body.name;
    const remail = req.body.email;
    const rdate_birth = req.body.date_birth;
    const rpassword = req.body.password;
    console.log(rname, remail, rdate_birth, rpassword)

    var resutl;
    resutl = await usuariosModel.createUser(rname, remail, rdate_birth, rpassword);
    res.send("USER REGISTER SUCCESFULL");
});


module.exports = router;