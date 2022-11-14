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

    result.map((item, index) => {
        result[index]._id = monthAux[item._id - 1]
        
    })
      
    return result
}
module.exports = ruta;
