const express = require('express');
const ruta = express();
const ExistenciasOtros = require('../model/inventariosotros');
const verificarToken = require('../middlewares/auth');

ruta.get('/:item', verificarToken,  (req, res) => {
    let itemAlamo = req.params.item
    //console.log(itemAlamo)

    let result = leerExistencias(itemAlamo)
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

async function leerExistencias(itemAlamo){
    let result = [];

    result = await ExistenciasOtros.find({PresentacionInsumo: itemAlamo})
    //result = await Existencias.aggregate([{$group: {_id:"$PresentacionInsumo", sum_val:{$sum:"$ExistenciasStock"}}}]).sort({sum_val:0})
    return result
}

module.exports = ruta;