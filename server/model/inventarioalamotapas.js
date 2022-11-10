const mongose = require('mongoose');
const inventarioTapasShema = new mongose.Schema({
ResponsableRecepcionExistencia: {type: String},
PresentacionInsumo:             {type: String},
ProveedorInsumo:                {type: String},
ExistenciasStock:               {type: Number},
ExistenciasLlenado:             {type: String},
ExistenciasProductoTerminado:   {type: String},
ExistenciasDaniadas:            {type: String},
ExistenciasLote:                {type: String},
ExistenciasRecepcion:           {type: Date},
CostoExistencia:                {type: Number},
FechaRegistroIngresoExistencia: {type: Date}
})
module.exports = mongose.model('inventarios_tapas', inventarioTapasShema)