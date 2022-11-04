const express = require('express');
const ruta = express();
const Usuarios = require('../model/alamousuarios');
const verificarToken = require('../middlewares/auth');

ruta.get('/', verificarToken, (req, res) => {
    let result = leerExistencias()
    result.then(dato =>{
        res.json({
            data: dato
        })
    }).catch(err => {
        res.json({
            error: err
        })
    })    
})

async function leerExistencias(){
    let result = [];
    
    result = await Usuarios.find({}).select({user: 1, type_user: 1})
    
    return result
}
module.exports = ruta;