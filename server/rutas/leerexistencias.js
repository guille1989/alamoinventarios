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

    let resultAux = [];

    result.map((item, index) => {
        if(item._id.includes('LT')){            
            //console.log(Number(item._id.match(/[+-]?\d+(\.\d+)?/g))*1000)
            resultAux.push({cap: Number(item._id.match(/[+-]?\d+(\.\d+)?/g))*1000, indexA: index});
        }else{
            //console.log(Number(item._id.match(/[+-]?\d+(\.\d+)?/g)))
            resultAux.push({cap: Number(item._id.match(/[+-]?\d+(\.\d+)?/g)), indexA: index});
        }
    })

    resultAux.sort(function(a, b) {
        return parseFloat(a.cap) - parseFloat(b.cap);
    });

    //console.log(resultAux)
    //console.log(resultAux.length)

    let resultAuxB = [];

    for(i=0; i<resultAux.length; i++){
        resultAuxB.push(result[resultAux[i].indexA])
    }

    //console.log(resultAuxB)
    
    return resultAuxB
}
module.exports = ruta;
