const express = require('express');
const ruta = express();
const Existencias = require('../model/inventarioalamo');
const verificarToken = require('../middlewares/auth');

ruta.get('/:item/:fechai/:fechaf',verificarToken, (req, res) => {
    let item = req.params.item;
    let fechainicio = new Date(req.params.fechai);
    let fechafinal = new Date(req.params.fechaf);
    
    //console.log(fechainicio)
    //console.log(fechafinal)

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

    let labels = [];

    let label_01 = 'Botellas Aprobadas';
    let label_02 = 'Botellas No Aprobadas';
    let label_03 = 'Botellas En Revision';

    let data_01 = [];
    let data_02 = [];
    let data_03 = [];

    //console.log(fechaiAux)
    //console.log(fechafAux)

    if(item === 'TODAS' || item === 'Seleccione tipo Existencia' || item === 'item'){
        if(fechainicio.getTime() === fechaiAux.getTime() && fechafinal.getTime() === fechafAux.getTime()){
            //console.log('condicion uno A')
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
            //console.log('condicion uno B')
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
        //console.log('condicion dos - existencia sin fechas')
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
        //console.log('condicion tres - existencia con fechas')
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

    result.map((item, index) => {
        labels = [...labels, item._id]
        
        data_01 = [...data_01 , item.SumSiExistencia]
        data_02 = [...data_02 , item.SumNoExistencia]
        data_03 = [...data_03 , item.SumRevExistencia]  
        
        })
    
    return [result, data_01, data_02, data_03, labels]
}
module.exports = ruta;
