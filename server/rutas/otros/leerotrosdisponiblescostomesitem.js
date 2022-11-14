const express = require('express');
const ruta = express();
const ExistenciasOtros = require('../../model/inventariosotros');
const verificarToken = require('../../middlewares/auth');

ruta.get('/', (req, res) => {
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
    let monthAux=['Jan', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];    

    //Sacar existencias por mes
    let resultAux = [];
    let resultItemsUnicos = [];
    let dobleAux = [];

    resultItemsUnicos = await ExistenciasOtros.distinct("PresentacionInsumo");

    for(var i=0; i<resultItemsUnicos.length; i++){
        resultAux = await ExistenciasOtros.aggregate([  
            {
              $match: {PresentacionInsumo: resultItemsUnicos[i]}
            },
            { 
              $project: 
              {
                _id: 0,
                PresentacionInsumo: 1,
                ExistenciaCosto: '$CostoExistencia',
                ExistenciaFechaRecibo: '$ExistenciasRecepcion'
              }
            },
            { 
              $group: 
              {
                _id: {$month : '$ExistenciaFechaRecibo' },            
                CostoExistencia: {$sum: '$ExistenciaCosto'},
              }
            },
            {
                $addFields: {
                    itemNombre: resultItemsUnicos[i]
                }
            }]).sort({_id:0})

            resultAux.map((item, index) => {
                resultAux[index]._id = monthAux[item._id - 1]
                
            })

            dobleAux = [...dobleAux, resultAux]
    }
      
    return dobleAux
}
module.exports = ruta;