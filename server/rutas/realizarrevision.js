const express = require('express');
const ruta = express();
const Existencias = require('../model/inventarioalamo');
const verificarToken = require('../middlewares/auth');

ruta.post('/',verificarToken, (req, res) => {
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
    result = await Existencias.updateMany({ExistenciasLote: body.ExistenciasLote, PresentacionInsumo: body.PresentacionInsumo}, 
        {$set: {
        FechaRevisionExistencia:        new Date(),
        ResponsableRevision:            body.ResponsableRevision,
        Altura_mm:                      body.Altura_mm,
        Peso_g:                         body.Peso_g,                
        OlorExtraño:                    body.OlorExtraño,
        Apariencia:                     body.Apariencia,
        ContaminacionInterna:           body.ContaminacionInterna,
        AcabadoDaniadoEnvaseRoto:       body.AcabadoDaniadoEnvaseRoto,
        RevadasDiametroExteriorAcabado: body.RevadasDiametroExteriorAcabado,
        ContaminacionAparienciaExterna: body.ContaminacionAparienciaExterna,
        BotellasAbulladuras:            body.BotellasAbulladuras,
        MarcasRalladuras:               body.MarcasRalladuras,
        Desgaste:                       body.Desgaste,
        Burbujas:                       body.Burbujas,
        Perlesencia:                    body.Perlesencia,
        PuntoInyeccionDecentrado:       body.PuntoInyeccionDecentrado,      
        AprobadoRechazado:              body.AprobadoRechazado,
        ObservacionesRevision:          body.ObservacionesRevision,
        Rosca_ok:                       body.Rosca_ok,                       
        Material_Extranio:              body.Material_Extranio,
        tapa_liner:                     body.tapa_liner
    }})

    return result     
}
module.exports = ruta;