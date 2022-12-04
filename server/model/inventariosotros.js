const mongose = require('mongoose');
const inventarioOtrosShema = new mongose.Schema({
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
    FechaRegistroIngresoExistencia: {type: Date}
})
module.exports = mongose.model('inventarios_otros', inventarioOtrosShema)