const express = require('express');
const ruta = express();
const Existencias = require('../model/inventariosetiquetas');
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
            Existencia: '$ExistenciasStock'
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            etiquetas: {$sum: '$Existencia'}
        }}]).sort({_id:0})
    
    return result
}
module.exports = ruta;