const express = require('express');
const ruta = express();
const PersonalRecepcion = require('../model/alamorecepcionbotellas');
const verificarToken = require('../middlewares/auth');

ruta.get('/',verificarToken, (req, res) => {
    let result = leerExistencias()
    result.then(dato =>{
        console.log('aqui')
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
    
    result = await PersonalRecepcion.find({})
    
    return result
}
module.exports = ruta;