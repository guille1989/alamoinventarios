const express = require('express');
const ruta = express();
const Existencias = require('../model/inventarioalamo');

ruta.get('/:item/:lote', (req, res) => {
    let itemAlamo = req.params.item
    let loteAlamo = req.params.lote

    let result = leerExistencias(itemAlamo, loteAlamo)
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

async function leerExistencias(itemAlamo, loteAlamo){
    let result = [];
    result = await Existencias.find({PresentacionInsumo: itemAlamo, ExistenciasLote: loteAlamo})
    return result
}

module.exports = ruta;
