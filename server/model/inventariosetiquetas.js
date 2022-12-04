const mongose = require('mongoose');
const inventarioEtiquetasShema = new mongose.Schema({
    ResponsableRecepcionExistencia: {type: String},
    PresentacionInsumo:             {type: String},
    ProveedorInsumo:                {type: String},
    ExistenciasStock:               {type: Number},
    ExistenciasLlenado:             {type: Number},
    ExistenciasProductoTerminado:   {type: Number},
    ExistenciasDaniadas:            {type: Number},
    ExistenciasLote:                {type: String},
    ExistenciasRecepcion:           {type: Date},
    CostoExistencia:                {type: Number},
    FechaRegistroIngresoExistencia: {type: Date},
    InfoRegistroSalidaOrigen:       {type: String},
})
module.exports = mongose.model('inventarios_etiquetas', inventarioEtiquetasShema)