const express = require('express');
const ruta = express();
const Existencias = require('../model/inventarioalamo');

ruta.post('/', (req, res) => {
    let body = req.body;
    let result = insertExistencias(body);

    result.then(data => {
        res.json({
            dato: data
        })
    }).catch(err => {
        res.json({
            error: err
        })
    })
})

async function insertExistencias(body){
    let result = [];
    let resultValidacion  = [];
    
    resultValidacion = await Existencias.find({ExistenciasLote: body.ExistenciasLote, PresentacionInsumo: body.PresentacionInsumo})
    
    if(resultValidacion.length != 0){
        return "Lote ya registrado"
    }else{
        //
        let nivel_inspeccion_s4 = ''
        let tamanio_muestra = ''
        let aceptar_inspeccion_s4 = ''
        let rechazar_inspeccion_s4 = ''

        if(parseInt(body.ExistenciasStock) >= 2 && parseInt(body.ExistenciasStock) <= 8){
            nivel_inspeccion_s4 = 'A'
            tamanio_muestra = '2'
            aceptar_inspeccion_s4 = '0'
            rechazar_inspeccion_s4 = '1'
        }else if(parseInt(body.ExistenciasStock) >= 9 && parseInt(body.ExistenciasStock) <= 15){
            nivel_inspeccion_s4 = 'A'
            tamanio_muestra = '2'
            aceptar_inspeccion_s4 = '0'
            rechazar_inspeccion_s4 = '1'
        }else if(parseInt(body.ExistenciasStock) >= 16 && parseInt(body.ExistenciasStock) <= 25){
            nivel_inspeccion_s4 = 'B'
            tamanio_muestra = '3'
            aceptar_inspeccion_s4 = '0'
            rechazar_inspeccion_s4 = '1'
        }else if(parseInt(body.ExistenciasStock) >= 26 && parseInt(body.ExistenciasStock) <= 50){
            nivel_inspeccion_s4 = 'C'
            tamanio_muestra = '5'
            aceptar_inspeccion_s4 = '0'
            rechazar_inspeccion_s4 = '1'
        }else if(parseInt(body.ExistenciasStock) >= 51 && parseInt(body.ExistenciasStock) <= 90){
            nivel_inspeccion_s4 = 'C'
            tamanio_muestra = '5'
            aceptar_inspeccion_s4 = '0'
            rechazar_inspeccion_s4 = '1'
        }else if(parseInt(body.ExistenciasStock) >= 91 && parseInt(body.ExistenciasStock) <= 150){
            nivel_inspeccion_s4 = 'D'
            tamanio_muestra = '8'
            aceptar_inspeccion_s4 = '0'
            rechazar_inspeccion_s4 = '1'
        }else if(parseInt(body.ExistenciasStock) >= 151 && parseInt(body.ExistenciasStock) <= 280){
            nivel_inspeccion_s4 = 'E'
            tamanio_muestra = '13'
            aceptar_inspeccion_s4 = '0'
            rechazar_inspeccion_s4 = '2'
        }else if(parseInt(body.ExistenciasStock) >= 281 && parseInt(body.ExistenciasStock) <= 500){
            nivel_inspeccion_s4 = 'E'
            tamanio_muestra = '13'
            aceptar_inspeccion_s4 = '0'
            rechazar_inspeccion_s4 = '2'
        }else if(parseInt(body.ExistenciasStock) >= 501 && parseInt(body.ExistenciasStock) <= 1200){
            nivel_inspeccion_s4 = 'F'
            tamanio_muestra = '20'
            aceptar_inspeccion_s4 = '0'
            rechazar_inspeccion_s4 = '2'
        }else if(parseInt(body.ExistenciasStock) >= 1201 && parseInt(body.ExistenciasStock) <= 3200){
            nivel_inspeccion_s4 = 'G'
            tamanio_muestra = '32'
            aceptar_inspeccion_s4 = '2'
            rechazar_inspeccion_s4 = '3'
        }else if(parseInt(body.ExistenciasStock) >= 3201 && parseInt(body.ExistenciasStock) <= 10000){
            nivel_inspeccion_s4 = 'G'
            tamanio_muestra = '32'
            aceptar_inspeccion_s4 = '2'
            rechazar_inspeccion_s4 = '3'
        }else if(parseInt(body.ExistenciasStock) >= 10001 && parseInt(body.ExistenciasStock) <= 35000){
            nivel_inspeccion_s4 = 'H'
            tamanio_muestra = '50'
            aceptar_inspeccion_s4 = '2'
            rechazar_inspeccion_s4 = '4'
        }else if(parseInt(body.ExistenciasStock) >= 35001 && parseInt(body.ExistenciasStock) <= 150000){
            nivel_inspeccion_s4 = 'J'
            tamanio_muestra = '80'
            aceptar_inspeccion_s4 = '3'
            rechazar_inspeccion_s4 = '5'
        }else if(parseInt(body.ExistenciasStock) >= 150001 && parseInt(body.ExistenciasStock) <= 500000){
            nivel_inspeccion_s4 = 'J'
            tamanio_muestra = '80'
            aceptar_inspeccion_s4 = '3'
            rechazar_inspeccion_s4 = '5'
        }else if(parseInt(body.ExistenciasStock) >= 500001){
            nivel_inspeccion_s4 = 'K'
            tamanio_muestra = '125'
            aceptar_inspeccion_s4 = '4'
            rechazar_inspeccion_s4 = '6'
        }


        result = new Existencias({
            PresentacionInsumo:     body.PresentacionInsumo,
            //ProveedorInsumo:        body.ProveedorInsumo,
            CostoExistencia:        parseInt(body.CostoExistencia),
            ExistenciasStock:       parseInt(body.ExistenciasStock),
            ExistenciasLote:        body.ExistenciasLote,    
            ExistenciasRecepcion:   body.ExistenciasRecepcion,

            ExistenciasLlenado:             0,
            ExistenciasProductoTerminado:   0,

            nivel_inspeccion_s4:    nivel_inspeccion_s4,
            tamanio_muestra:        tamanio_muestra,
            aceptar_inspeccion_s4:  aceptar_inspeccion_s4,
            rechazar_inspeccion_s4: rechazar_inspeccion_s4,

            AprobadoRechazado: "En Revision"
        })

        return await result.save()
    }    
    
}


module.exports = ruta;