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

    let label_01 = 'Botellas Aprobadas';
    let label_02 = 'Botellas No Aprobadas';
    let label_03 = 'Botellas En Revision';

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
    
    return [result, data_01, data_02, data_03, labels, resultSI, resultNO, resultREV]
}
module.exports = ruta;
