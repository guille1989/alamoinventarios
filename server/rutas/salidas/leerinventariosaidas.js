const express = require('express');
const ruta = express();
const Existencias = require('../../model/inventarioalamo');
const TapasEx = require('../../model/inventarioalamotapas');
const EtiquetasEx = require('../../model/inventariosetiquetas');
const OtrosEx = require('../../model/inventariosotros');
const RegSalida = require('../../model/alamosalidasregistro');
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
            ExistenciaSi: {$cond: [{$eq: ['$AprobadoRechazado', 'Ok']}, '$ExistenciasStock', 0]},
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            SumSiExistencia: {$sum: '$ExistenciaSi'},
        }}]).sort({_id:0})

    let resultAux = [];

    result.map((item, index) => {
        if(item._id.includes('LT')){            
            //console.log(Number(item._id.match(/[+-]?\d+(\.\d+)?/g))*1000)
            resultAux.push({cap: Number(item._id.match(/[+-]?\d+(\.\d+)?/g))*1000, indexA: index});
        }else{
            //console.log(Number(item._id.match(/[+-]?\d+(\.\d+)?/g)))
            resultAux.push({cap: Number(item._id.match(/[+-]?\d+(\.\d+)?/g)), indexA: index});
        }
    })

    resultAux.sort(function(a, b) {
        return parseFloat(a.cap) - parseFloat(b.cap);
    });

    let resultAuxB = [];

    for(i=0; i<resultAux.length; i++){
        resultAuxB.push(result[resultAux[i].indexA])
    }

    let resultTapas = [];

    resultTapas = await TapasEx.aggregate([  
        { $project: {
            _id: 0,
            PresentacionInsumo: 1,
            Existencia: '$ExistenciasStock'
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
            Existencia: '$ExistenciasStock'
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
            Existencia: '$ExistenciasStock'
        }},
        { $group: {
            _id: "$PresentacionInsumo",
            otros: {$sum: '$Existencia'}
        }}]).sort({_id:0})
    
    return {resultAuxB, resultTapas, resultEtiquetas, resultOtros}


}

async function registrarSalida(body){  
    
    let fechaRegistroSalidaAlamo = new Date();
    //Toca hacer la resta
    //Registro salida Botellas
    let resultBAux = [];
    resultBAux = await Existencias.find({
        PresentacionInsumo: body.salidaTipoBotellas,
        AprobadoRechazado: 'Ok',
        ExistenciasStock: {$ne: 0}
    }).sort({"ExistenciasRecepcion":1})
    
    let countSaludaAux = body.salidaNumeroBotellas;
    let countResiduo = body.salidaNumeroBotellas;
    let salidaAux = [];
    //Rstamos existencias en base de datos:
    let actuAuxBotellas= [];    
    salidaAux.push({numero_botellas_total:body.salidaNumeroBotellas})
    
    resultBAux.map(async (item, index) => {          
        if(countSaludaAux != 0){
            if( parseInt(item.ExistenciasStock) >=  parseInt(countSaludaAux)){                
                countSaludaAux = countSaludaAux - countResiduo    
                salidaAux.push({numero_botellas_salida: (countResiduo), stock_lote_botellas: item.ExistenciasLote})  
                actuAuxBotellas = await Existencias.updateOne({PresentacionInsumo: body.salidaTipoBotellas, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasLlenado: parseInt(countResiduo) + parseInt(item.ExistenciasLlenado), ExistenciasStock: parseInt(item.ExistenciasStock) - parseInt(countResiduo)}})
            }else{
                countSaludaAux = countSaludaAux - item.ExistenciasStock
                countResiduo = countResiduo - item.ExistenciasStock
                salidaAux.push({numero_botellas_salida: (item.ExistenciasStock), stock_lote_botellas: item.ExistenciasLote}) 
                actuAuxBotellas = await Existencias.updateOne({PresentacionInsumo: body.salidaTipoBotellas, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasLlenado: parseInt(item.ExistenciasLlenado)  + parseInt(item.ExistenciasStock), ExistenciasStock: 0}})
            }
        }           
    })

    //Toca hacer la resta
    //Registro salida Tapas
    let resultTAux = [];
    resultTAux = await TapasEx.find({
        PresentacionInsumo: body.salidaTipoTapas,
        ExistenciasStock: {$ne: 0}
    }).sort({"ExistenciasRecepcion":1})

    let countSalidaTAux = body.salidaNumeroTapas;
    let countResiduoT = body.salidaNumeroTapas;
    let salidaAuxT = [];    

    let actuAuxTapas= [];   
    salidaAuxT.push({numero_tapas_total:body.salidaNumeroTapas})
    resultTAux.map(async (item, index) => { 

        if(countSalidaTAux != 0){
            if( parseInt(item.ExistenciasStock) >=  parseInt(countSalidaTAux)){
                countSalidaTAux = countSalidaTAux - countResiduoT       
                salidaAuxT.push({numero_tapas_salida: (countResiduoT), stock_lote_tapas: item.ExistenciasLote})  
                actuAuxTapas = await TapasEx.updateOne({PresentacionInsumo: body.salidaTipoTapas, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasLlenado: parseInt(countResiduoT) + parseInt(item.ExistenciasLlenado), ExistenciasStock: parseInt(item.ExistenciasStock) - parseInt(countResiduoT)}})
            }else{
                countSalidaTAux = countSalidaTAux - item.ExistenciasStock
                countResiduoT = countResiduoT - item.ExistenciasStock
                salidaAuxT.push({numero_tapas_salida: (item.ExistenciasStock), stock_lote_tapas: item.ExistenciasLote}) 
                actuAuxTapas = await TapasEx.updateOne({PresentacionInsumo: body.salidaTipoTapas, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasLlenado: parseInt(item.ExistenciasLlenado)  + parseInt(item.ExistenciasStock), ExistenciasStock: 0}})
            }
        }  
    })

    //Toca hacer la resta
    //Registro salida Etiquetas
    let resultEAux = [];
    resultEAux = await EtiquetasEx.find({
        PresentacionInsumo: body.salidaTipoEtiquetas,
        ExistenciasStock: {$ne: 0}
    }).sort({"ExistenciasRecepcion":1})

    let countSalidaEAux = body.salidaNumeroEtiquetas;
    let countResiduoE = body.salidaNumeroEtiquetas;

    let actuAuxEtiquetas= [];  
    let salidaAuxE = [];
    salidaAuxE.push({numero_tapas_total:body.salidaNumeroEtiquetas})
    resultEAux.map(async (item, index) => { 

        if(countSalidaEAux != 0){
            if( parseInt(item.ExistenciasStock) >=  parseInt(countSalidaEAux)){
                countSalidaEAux = countSalidaEAux - countResiduoE           
                salidaAuxE.push({numero_etiquetas_salida: (countResiduoE), stock_lote_etiquetas: item.ExistenciasLote})  
                actuAuxEtiquetas = await EtiquetasEx.updateOne({PresentacionInsumo: body.salidaTipoEtiquetas, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasLlenado: parseInt(countResiduoE) + parseInt(item.ExistenciasLlenado), ExistenciasStock: parseInt(item.ExistenciasStock) - parseInt(countResiduoE)}})
            }else{
                countSalidaEAux = countSalidaEAux - item.ExistenciasStock
                countResiduoE = countResiduoE - item.ExistenciasStock
                salidaAuxE.push({numero_etiquetas_salida: (item.ExistenciasStock), stock_lote_etiquetas: item.ExistenciasLote}) 
                actuAuxEtiquetas = await EtiquetasEx.updateOne({PresentacionInsumo: body.salidaTipoEtiquetas, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasLlenado: parseInt(item.ExistenciasLlenado)  + parseInt(item.ExistenciasStock), ExistenciasStock: 0}})
            }
        }  
    })


    console.log('******RESULTADO OPERACION DE SALIDA BOTELLAS********', salidaAux)    
    console.log('******RESULTADO OPERACION DE SALIDA TAPAS********', salidaAuxT) 
    console.log('******RESULTADO OPERACION DE SALIDA ETIQUETAS********', salidaAuxE)   

    //Restamos otros....
    //Toca hacer la resta
    //Registro salida Otros
    let resultPyCAux = [];
    resultPyCAux = await OtrosEx.find({
        PresentacionInsumo: body.salidaTipoOtros,
        ExistenciasStock: {$ne: 0}
    }).sort({"ExistenciasRecepcion":1})

    let countSalidaPyCAux = body.salidaNumeroOtros;
    let countResiduoPyC = body.salidaNumeroOtros;

    let actuAuxOtros= [];  
    let salidaAuxPyC = [];

    salidaAuxPyC.push({numero_tapas_total:body.salidaNumeroOtros})
    resultPyCAux.map(async (item, index) => { 

        if(countSalidaPyCAux != 0){
            if( parseInt(item.ExistenciasStock) >=  parseInt(countSalidaPyCAux)){
                countSalidaPyCAux = countSalidaPyCAux - countResiduoPyC           
                salidaAuxPyC.push({numero_etiquetas_salida: (countResiduoPyC), stock_lote_etiquetas: item.ExistenciasLote})  
                actuAuxOtros = await OtrosEx.updateOne({PresentacionInsumo: body.salidaTipoOtros, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasLlenado: parseInt(countResiduoPyC) + parseInt(item.ExistenciasLlenado), ExistenciasStock: parseInt(item.ExistenciasStock) - parseInt(countResiduoPyC)}})
            }else{
                countSalidaPyCAux = countSalidaPyCAux - item.ExistenciasStock
                countResiduoPyC = countResiduoPyC - item.ExistenciasStock
                salidaAuxPyC.push({numero_etiquetas_salida: (item.ExistenciasStock), stock_lote_etiquetas: item.ExistenciasLote}) 
                actuAuxOtros = await OtrosEx.updateOne({PresentacionInsumo: body.salidaTipoOtros, ExistenciasLote: item.ExistenciasLote},{$set:{ExistenciasLlenado: parseInt(item.ExistenciasLlenado)  + parseInt(item.ExistenciasStock), ExistenciasStock: 0}})
            }
        }  
    })


    //Guardamos la info
    let result = [];
    result = new RegSalida({
        responsableSalida:                      body.responsableSalida,
        salidaTipoBotellas:                     body.salidaTipoBotellas,
        salidaNumeroBotellas:                   body.salidaNumeroBotellas,
        salidaTipoTapas:                        body.salidaTipoTapas,
        salidaNumeroTapas:                      body.salidaNumeroTapas,
        salidaTipoEtiquetas:                    body.salidaTipoEtiquetas,
        salidaNumeroEtiquetas:                  body.salidaNumeroEtiquetas,
        numeroRegistroSalida:                   body.responsableSalida + new Date(),
        fechaRegistroSalida:                    fechaRegistroSalidaAlamo,
        InfoRegistroSalidaOrigenBotellas:       salidaAux,
        InfoRegistroSalidaOrigenTapas:          salidaAuxT,
        InfoRegistroSalidaOrigenEtiquetas:      salidaAuxE,
        salidaTipoOtros:                        body.salidaTipoOtros,
        salidaNumeroOtros:                      body.salidaNumeroOtros,

    })    

    return await result.save()
}

module.exports = ruta;