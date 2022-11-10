const express = require('express');
const ruta = express();
const ExistenciasTapas = require('../model/alamorecepciontapas');
const verificarToken = require('../middlewares/auth');

ruta.get('/',verificarToken, (req, res) => {
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
    let result = borrarexistencia(body);
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

async function leerExistencias(){
    let result = [];
    
    result = await ExistenciasTapas.find({})
    
    return result
}

async function insertExistencias(body){
    let result = [];   
    result = new ExistenciasTapas({
        tapa: body.tapa,
    })

    return await result.save()
}

async function borrarexistencia(body){
    let result = [];   

    result = ExistenciasTapas.deleteOne({_id: body.id})
    return await result
}

module.exports = ruta;