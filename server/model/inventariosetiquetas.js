const mongose = require('mongoose');
const inventarioEtiquetasShema = new mongose.Schema({
PresentacionInsumo:             {type: String},
ProveedorInsumo:                {type: String},
ExistenciasStock:               {type: Number},
ExistenciasLlenado:             {type: String},
ExistenciasProductoTerminado:   {type: String},
ExistenciasDaniadas:            {type: String},
ExistenciasLote:                {type: String},
ExistenciasRecepcion:           {type: Date},
CostoExistencia:                {type: Number},
})
module.exports = mongose.model('inventarios_etiquetas', inventarioEtiquetasShema)