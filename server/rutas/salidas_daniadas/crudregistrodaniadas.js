const express = require('express');
const ruta = express();
const SalidasDaniadas = require('../../model/alamosalidaregistrodaniados');
const Existencias = require('../../model/inventarioalamo'); 
const ExistenciasTapas = require('../../model/inventarioalamotapas'); 
const ExistenciasEtiquetas = require('../../model/inventariosetiquetas'); 
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

ruta.get('/:existencia/:texistencia',verificarToken, (req, res) => {
    let existencia = req.params.existencia
    let texistencia = req.params.texistencia

    let result = leerExistencias(existencia, texistencia)
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

async function leerExistencias(existencia, texistencia){
    let result = [];
    
    if(texistencia === "Botellas"){
        result = await Existencias.find({PresentacionInsumo: existencia, AprobadoRechazado: 'Ok', ExistenciasLlenado: {$ne: 0}})
    }else if(texistencia === "Tapas"){
        result = await ExistenciasTapas.find({PresentacionInsumo: existencia, AprobadoRechazado: 'Ok', ExistenciasLlenado: {$ne: 0}})
    }else if(texistencia === "Etiquetas"){
        result = await ExistenciasEtiquetas.find({PresentacionInsumo: existencia, AprobadoRechazado: 'Ok', ExistenciasLlenado: {$ne: 0}})
    }
    
    
    return result

}

async function insertExistencias(body){
    let result = [];   
    result = new SalidasDaniadas({
        responsableSalida:              body.responsableSalida,
        tipoexistencia:                 body.tipoexistencia,
        loteExistencia:                 body.loteExistencia,
        cantidad:                       parseInt(body.cantidad),
        fechaRegistroSalida:            new Date()
    })

    return await result.save()
}  

async function borrarPersonalRecepcion(body){
    let result = [];   
    result = SalidasPersonal.deleteOne({_id: body.id})

    return await result
}


module.exports = ruta;