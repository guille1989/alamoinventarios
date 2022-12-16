const express = require('express');
const ruta = express();
const Existencias = require('../../model/inventarioalamo');
const TapasEx = require('../../model/inventarioalamotapas');
const EtiquetasEx = require('../../model/inventariosetiquetas')
const RegDaniado = require('../../model/alamosalidaregistrodaniados');
const OtrosEx = require('../../model/inventariosotros');
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

ruta.post('/', verificarToken, (req, res) => {
    let body = req.body;

    let result = registrarSalida(body);

    result
        .then(msj => {
            res.json({
                data: msj
            })
        })
        .catch(err => {
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
            ExistenciaSi: {$cond: [{$eq: ['$AprobadoRechazado', 'Ok']}, '$ExistenciasLlenado', 0]},
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            SumSiExistencia: {$sum: '$ExistenciaSi'},
        }}]).sort({_id:0})

    let resultTapas = [];

    resultTapas = await TapasEx.aggregate([  
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            Existencia: '$ExistenciasLlenado'
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            tapas: {$sum: '$Existencia'}
        }}]).sort({_id:0})

    let resultEtiquetas = [];

    resultEtiquetas = await EtiquetasEx.aggregate([  
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            Existencia: '$ExistenciasLlenado'
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            etiquetas: {$sum: '$Existencia'}
        }}]).sort({_id:0})


    let resultOtros = [];

    resultOtros = await OtrosEx.aggregate([  
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            Existencia: '$ExistenciasLlenado'
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            etiquetas: {$sum: '$Existencia'}
        }}]).sort({_id:0})
    
    return {result, resultTapas, resultEtiquetas, resultOtros}


}

async function registrarSalida(body){  
    
    let fechaRegistroSalidaAlamo = new Date();
    //Toca hacer la resta
    //Registro salida Botellas
    let resultBAux = [];
    
    
    let countSaludaAux = body.cantidad;
    let countResiduo = body.cantidad;
    
    let salidaAux = [];
    //Rstamos existencias en base de datos:
    let actuAuxBotellas= [];  

    salidaAux.push({numero_botellas_total:body.cantidad})

    //Aqui es donde se hace el if para hacer actualizacion botellas, tapas o etiquetas.

    console.log(body.existenciatipo)
    if(body.existenciatipo === "Botellas"){ 

        resultBAux = await Existencias.find({
            PresentacionInsumo: body.tipoexistencia,
            ExistenciasLote: body.loteExistencia,
            AprobadoRechazado: 'Ok',
            ExistenciasLlenado: {$ne: 0}
        }).sort({"ExistenciasRecepcion":1})

        resultBAux.map(async (item, index) => {          
            if(countSaludaAux != 0){
                if( parseInt(item.ExistenciasLlenado) >=  parseInt(countSaludaAux)){                
                    countSaludaAux = countSaludaAux - countResiduo    
                    salidaAux.push({numero_botellas_salida: (countResiduo), stock_lote_botellas: item.ExistenciasLote})  

                    actuAuxBotellas = await Existencias.updateOne({PresentacionInsumo: body.tipoexistencia, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasDaniadas: parseInt(countResiduo) + item.ExistenciasDaniadas, ExistenciasLlenado: parseInt(item.ExistenciasLlenado) - parseInt(countResiduo)}})
                }else{
                    countSaludaAux = countSaludaAux - item.ExistenciasLlenado
                    countResiduo = countResiduo - item.ExistenciasLlenado
                    salidaAux.push({numero_botellas_salida: (item.ExistenciasLlenado), stock_lote_botellas: item.ExistenciasLote}) 

                    actuAuxBotellas = await Existencias.updateOne({PresentacionInsumo: body.tipoexistencia, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasDaniadas: item.ExistenciasDaniadas  + parseInt(item.ExistenciasLlenado), ExistenciasLlenado: 0}})
                }
            }           
        })
    }else if(body.existenciatipo === "Tapas"){
        
        resultBAux = await TapasEx.find({
            PresentacionInsumo: body.tipoexistencia,
            ExistenciasLote: body.loteExistencia,
            AprobadoRechazado: 'Ok',
            ExistenciasLlenado: {$ne: 0}
        }).sort({"ExistenciasRecepcion":1})

        resultBAux.map(async (item, index) => {          
            if(countSaludaAux != 0){
                if( parseInt(item.ExistenciasLlenado) >=  parseInt(countSaludaAux)){                
                    countSaludaAux = countSaludaAux - countResiduo    
                    salidaAux.push({numero_botellas_salida: (countResiduo), stock_lote_botellas: item.ExistenciasLote})  

                    actuAuxBotellas = await TapasEx.updateOne({PresentacionInsumo: body.tipoexistencia, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasDaniadas: parseInt(countResiduo) + item.ExistenciasDaniadas, ExistenciasLlenado: parseInt(item.ExistenciasLlenado) - parseInt(countResiduo)}})
                }else{
                    countSaludaAux = countSaludaAux - item.ExistenciasLlenado
                    countResiduo = countResiduo - item.ExistenciasLlenado
                    salidaAux.push({numero_botellas_salida: (item.ExistenciasLlenado), stock_lote_botellas: item.ExistenciasLote}) 

                    actuAuxBotellas = await TapasEx.updateOne({PresentacionInsumo: body.tipoexistencia, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasDaniadas: item.ExistenciasDaniadas  + parseInt(item.ExistenciasLlenado), ExistenciasLlenado: 0}})
                }
            }           
        })

    }else if(body.existenciatipo === "Etiquetas"){

        resultBAux = await EtiquetasEx.find({
            PresentacionInsumo: body.tipoexistencia,
            ExistenciasLote: body.loteExistencia,
            AprobadoRechazado: 'Ok',
            ExistenciasLlenado: {$ne: 0}
        }).sort({"ExistenciasRecepcion":1})

        resultBAux.map(async (item, index) => {          
            if(countSaludaAux != 0){
                if( parseInt(item.ExistenciasLlenado) >=  parseInt(countSaludaAux)){                
                    countSaludaAux = countSaludaAux - countResiduo    
                    salidaAux.push({numero_botellas_salida: (countResiduo), stock_lote_botellas: item.ExistenciasLote})  

                    actuAuxBotellas = await EtiquetasEx.updateOne({PresentacionInsumo: body.tipoexistencia, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasDaniadas: parseInt(countResiduo) + item.ExistenciasDaniadas, ExistenciasLlenado: parseInt(item.ExistenciasLlenado) - parseInt(countResiduo)}})
                }else{
                    countSaludaAux = countSaludaAux - item.ExistenciasLlenado
                    countResiduo = countResiduo - item.ExistenciasLlenado
                    salidaAux.push({numero_botellas_salida: (item.ExistenciasLlenado), stock_lote_botellas: item.ExistenciasLote}) 

                    actuAuxBotellas = await EtiquetasEx.updateOne({PresentacionInsumo: body.tipoexistencia, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasDaniadas: item.ExistenciasDaniadas  + parseInt(item.ExistenciasLlenado), ExistenciasLlenado: 0}})
                }
            }           
        })
    }    

    //Guardamos la info
    let result = [];
    result = new RegDaniado({
        responsableSalida:              body.responsableSalida,
        tipoexistencia:                 body.tipoexistencia,
        loteExistencia:                 body.loteExistencia,
        cantidad:                       body.cantidad,
        fechaRegistroSalida:            fechaRegistroSalidaAlamo,
    })    

    return await result.save()
}

module.exports = ruta;