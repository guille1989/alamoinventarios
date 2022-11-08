const express = require('express');
const ruta = express();
const Existencias = require('../model/inventarioalamo');
const verificarToken = require('../middlewares/auth');

ruta.get('/:key', (req, res) => {
    let key = req.params.key;
    let result = leerExistencias(key)
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

async function leerExistencias(key){
    let result = [];
    result = await Existencias.aggregate([  
        { $match: {PresentacionInsumo: { $regex: key }}},
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            ExistenciaRev: {$cond: [{$eq: ['$AprobadoRechazado', 'En Revision']}, '$ExistenciasStock', 0]},
            ExistenciaSi: {$cond: [{$eq: ['$AprobadoRechazado', 'Ok']}, '$ExistenciasStock', 0]},
            ExistenciaNo: {$cond: [{$eq: ['$AprobadoRechazado', 'Revision no aprobada']}, '$ExistenciasStock', 0]},
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            SumSiExistencia: {$sum: '$ExistenciaSi'},
            SumRevExistencia: {$sum: '$ExistenciaRev'},
            SumNoExistencia: {$sum: '$ExistenciaNo'},
        }}]).sort({_id:0})
    
    return result
}
module.exports = ruta;