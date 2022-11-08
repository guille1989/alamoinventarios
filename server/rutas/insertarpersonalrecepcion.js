const express = require('express');
const ruta = express();
const RecepcionPersonal = require('../model/alamorecepcionbotellas');
const verificarToken = require('../middlewares/auth');

ruta.post('/',verificarToken, (req, res) => {
    let body = req.body;

    let result = insertExistencias(body);

    result.then(data => {
        res.json({
            dato: data
        })
    }).catch(err => {
        res.json({
            error: err
        })
    })
})

ruta.delete('/',verificarToken, (req, res) => {
    let body = req.body;
    let result = borrarPersonalRecepcion(body);
    result.then(data => {
        res.json({
            dato: data
        })
    }).catch(err => {
        res.json({
            error: err
        })
    })
})

async function insertExistencias(body){
    let result = [];   
    result = new RecepcionPersonal({
        nombre: body.nombre,
    })

    return await result.save()
}  

async function borrarPersonalRecepcion(body){
    let result = [];   
    result = RecepcionPersonal.deleteOne({_id: body.id})

    return await result
}


module.exports = ruta;