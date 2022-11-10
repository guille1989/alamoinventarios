const express = require('express');
const ruta = express();
const ExistenciasTapas = require('../model/inventarioalamotapas');
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

async function insertExistencias(body){
    let result = [];
    let resultValidacion  = [];
    
    resultValidacion = await ExistenciasTapas.find({ExistenciasLote: body.tapa_lote, PresentacionInsumo: body.tapa})
    
    if(resultValidacion.length != 0){
        return "Lote ya registrado"
    }else{
        
        result = new ExistenciasTapas({
        FechaRegistroIngresoExistencia:     new Date(),
        ResponsableRecepcionExistencia:     body.ResponsableRecepcionExistencia,
        PresentacionInsumo:                 body.tapa,
        //ProveedorInsumo:                  body.ProveedorInsumo,
        CostoExistencia:                    parseInt(body.tapa_costo),
        ExistenciasStock:                   parseInt(body.tapa_cantidad),
        ExistenciasLote:                    body.tapa_lote,    
        ExistenciasRecepcion:               body.tapa_fecha_recepcion,

        ExistenciasLlenado:                 0,
        ExistenciasProductoTerminado:       0,
    })

        return await result.save()
    }
}

async function leerExistencias(){
    let result = [];
    
    result = await ExistenciasTapas.aggregate([  
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            Existencia: '$ExistenciasStock'
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            tapas: {$sum: '$Existencia'}
        }}]).sort({_id:0})
    
    return result
}
module.exports = ruta;