const express = require('express');
const ruta = express();
const Existencias = require('../model/inventarioalamo');
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

async function leerExistencias(){
    let result = [];

    let resultSI = [];
    let resultNO = [];
    let resultREV = [];

    let labels = [];

    let data_01 = [];
    let data_02 = [];
    let data_03 = [];
        
    result = await Existencias.aggregate([  
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

    result.map((item, index) => {
        labels = [...labels, item._id]
        
        data_01 = [...data_01 , item.SumSiExistencia]
        data_02 = [...data_02 , item.SumNoExistencia]
        data_03 = [...data_03 , item.SumRevExistencia]  
        
        })

    resultSI = await Existencias.aggregate([  
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            ExistenciaSi: {$cond: [{$eq: ['$AprobadoRechazado', 'Ok']}, '$ExistenciasStock', 0]},
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            SumSiExistencia: {$sum: '$ExistenciaSi'}
        }}])

    resultNO = await Existencias.aggregate([  
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            ExistenciaNo: {$cond: [{$eq: ['$AprobadoRechazado', 'Revision no aprobada']}, '$ExistenciasStock', 0]},
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            SumNoExistencia: {$sum: '$ExistenciaNo'}
        }}])

    let maxYAuxNoRev = 0;
    resultNO.map((item, index) => {
        if(item.SumNoExistencia > maxYAuxNoRev){
            maxYAuxNoRev = item.SumNoExistencia
        }
    })

    resultREV = await Existencias.aggregate([  
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            ExistenciaRev: {$cond: [{$eq: ['$AprobadoRechazado', 'En Revision']}, '$ExistenciasStock', 0]},
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            SumRevExistencia: {$sum: '$ExistenciaRev'}
        }}])


    let maxYAuxSinRev = 0;
    resultREV.map((item, index) => {
        if(item.SumRevExistencia > maxYAuxSinRev){
            maxYAuxSinRev = item.SumRevExistencia
        }
    })

    let maxYaux = 0;
    if(maxYAuxNoRev > maxYAuxSinRev){
        maxYaux = maxYAuxNoRev;
    }else{
        maxYaux = maxYAuxSinRev;
    }
    
    return [result, data_01, data_02, data_03, labels, resultSI, resultNO, resultREV, maxYaux]
}
module.exports = ruta;
