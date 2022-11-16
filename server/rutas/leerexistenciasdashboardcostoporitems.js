const express = require('express');
const ruta = express();
const Existencias = require('../model/inventarioalamo');
const verificarToken = require('../middlewares/auth');

ruta.get('/:existencia/:anio', (req, res) => {
    let exAux = req.params.existencia;
    let anioAux = req.params.anio;

    let result = leerExistencias(exAux, anioAux)
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

async function leerExistencias(exAux, anioAux){
    let result = [];  
    let monthAux=['Jan', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];    

    //Sacar existencias por mes
    let resultAux = [];
    let resultItemsUnicos = [];
    let dobleAux = [];

    if(exAux === 'Seleccione Existencia'){
      resultItemsUnicos = await Existencias.distinct("PresentacionInsumo");
    }else{
      resultItemsUnicos = [exAux]
    }
    

    for(var i=0; i<resultItemsUnicos.length; i++){
      if(exAux === 'Seleccione Existencia'){
        resultAux = await Existencias.aggregate([  
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
      }else{

        resultAux = await Existencias.aggregate([  
          {
            $match: {
                PresentacionInsumo: exAux
            }
          },
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

      }
        resultAux.map((item, index) => {
            resultAux[index]._id = monthAux[item._id - 1]
            
        })

        dobleAux = [...dobleAux, resultAux]
    }
      
    return dobleAux
}
module.exports = ruta;
