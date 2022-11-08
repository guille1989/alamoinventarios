const express = require('express');
const ruta = express();
const Botellas = require('../model/alamotipoexistencias');
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
    let result = borrarPersonalRevision(body);
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
    result = new Botellas({
        botella: body.botella,
    })

    return await result.save()
}  

async function borrarPersonalRevision(body){
    let result = [];   
    result = Botellas.deleteOne({_id: body.id})

    return await result
}

async function leerExistencias(){
    let result = [];
    
    result = await Botellas.find({})
    
    return result
}
module.exports = ruta;