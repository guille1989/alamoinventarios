const express = require('express');
const ruta = express();
const Existencias = require('../../model/inventarioalamo');
const TapasEx = require('../../model/inventarioalamotapas');
const EtiquetasEx = require('../../model/inventariosetiquetas')
const RegSalida = require('../../model/alamosalidasregistro');
const verificarToken = require('../../middlewares/auth');

ruta.get('/:fechaAux',verificarToken, (req, res) => {
    let fechaAux = req.params.fechaAux

    let result = leerExistencias(fechaAux)
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

async function leerExistencias(fechaAux){
    let result = [];

    if(fechaAux === "SinDato"){
        let start = new Date();
        start.setHours(0,0,0,0);
    
        let end = new Date();
        end.setHours(23,59,59,999);
    
        result = await RegSalida.find({ fechaRegistroSalida: {$gte: start, $lt: end}})
    }else{
        let startAux = new Date(fechaAux);
        //startAux.setHours(0,0,0,0);
    
        let endAux = new Date(fechaAux);
        endAux.setDate(endAux.getDate() + 1);
        //endAux.setHours(23,59,59,999);

        result = await RegSalida.find({ fechaRegistroSalida: {$gte: startAux, $lt: endAux}})
    }       

    return result
}

module.exports = ruta;