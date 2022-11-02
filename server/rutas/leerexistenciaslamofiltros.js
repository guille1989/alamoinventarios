const express = require('express');
const ruta = express();
const Existencias = require('../model/inventarioalamo');

ruta.get('/:item/:fechai/:fechaf', (req, res) => {
    let item = req.params.item;
    let fechainicio = new Date(req.params.fechai);
    let fechafinal = new Date(req.params.fechaf);
    
    console.log(fechainicio)
    console.log(fechafinal)

    let result = leerExistencias(item, fechainicio, fechafinal)
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

async function leerExistencias(item, fechainicio, fechafinal){
    let result = [];
    let fechaiAux = new Date("1900-01-01");
    let fechafAux = new Date("1900-01-01");

    console.log(fechaiAux)
    console.log(fechafAux)

    if(item === 'TODAS' || item === 'Seleccione tipo Existencia' || item === 'item'){
        if(fechainicio.getTime() === fechaiAux.getTime() && fechafinal.getTime() === fechafAux.getTime()){
            console.log('condicion uno A')
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
        }else{
            console.log('condicion uno B')
            result = await Existencias.aggregate([  
                { $match: {ExistenciasRecepcion: {$gte: fechainicio, $lt: fechafinal}}},
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
        }
        
    }else if(fechainicio.getTime() === fechaiAux.getTime() && fechafinal.getTime() === fechafAux.getTime()){
        console.log('condicion dos - existencia sin fechas')
        result = await Existencias.aggregate([  
            { $match: {PresentacionInsumo: item}},
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
    }else{
        console.log('condicion tres - existencia con fechas')
        result = await Existencias.aggregate([  
            { $match: {PresentacionInsumo: item, ExistenciasRecepcion: {$gte: fechainicio, $lt: fechafinal}}},
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
    } 
    
    return result
}
module.exports = ruta;
