const express = require('express');
const ruta = express();
const ExistenciasOtros = require('../model/inventariosotros');
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
    
    resultValidacion = await ExistenciasOtros.find({ExistenciasLote: body.otros_lote, PresentacionInsumo: body.otros})
    
    if(resultValidacion.length != 0){
        return "Lote ya registrado"
    }else{
        
        result = new ExistenciasOtros({
        FechaRegistroIngresoExistencia:     new Date(),
        ResponsableRecepcionExistencia:     body.ResponsableRecepcionExistencia,
        PresentacionInsumo:                 body.otros,
        //ProveedorInsumo:                  body.ProveedorInsumo,
        CostoExistencia:                    parseInt(body.otros_costo),
        ExistenciasStock:                   parseInt(body.otros_cantidad),
        ExistenciasLote:                    body.otros_lote,    
        ExistenciasRecepcion:               body.otros_fecha_recepcion,

        ExistenciasLlenado:                 0,
        ExistenciasProductoTerminado:       0,
        ExistenciasDaniadas:                0,
        ExistenciasDefectuosas:             0,
    })

        return await result.save()
    }
}

async function leerExistencias(){
    let result = [];
    
    result = await ExistenciasOtros.aggregate([  
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            Existencia: '$ExistenciasStock'
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            otros: {$sum: '$Existencia'}
        }}]).sort({_id:0})
    
    return result
}
module.exports = ruta;