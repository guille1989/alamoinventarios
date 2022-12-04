const express = require('express');
const ruta = express();
const SalidasPersonal = require('../../model/alamosalidabotellas');
const verificarToken = require('../../middlewares/auth');

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

async function leerExistencias(){
    let result = [];
    
    result = await SalidasPersonal.find({})
    
    return result

}

async function insertExistencias(body){
    let result = [];   
    result = new SalidasPersonal({
        nombre: body.nombre,
    })

    return await result.save()
}  

async function borrarPersonalRecepcion(body){
    let result = [];   
    result = SalidasPersonal.deleteOne({_id: body.id})

    return await result
}


module.exports = ruta;