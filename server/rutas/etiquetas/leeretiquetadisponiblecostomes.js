const express = require('express');
const ruta = express();
const ExistenciasEtiqueta = require('../../model/inventariosetiquetas');
const verificarToken = require('../../middlewares/auth');

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

    result = await ExistenciasEtiqueta.aggregate([  
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
        }]).sort({_id:0})

    let monthAux=['Jan', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let maxValue=0;

    result.map((item, index) => {
        result[index]._id = monthAux[item._id - 1]

        if(item.CostoExistencia > maxValue){
          maxValue = item.CostoExistencia
        }
    })
      
    return [result, maxValue]
}
module.exports = ruta;