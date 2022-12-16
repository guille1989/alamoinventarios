const mongose = require('mongoose');
const isalidasAlamoShema = new mongose.Schema({
responsableSalida:              {type: String},

salidaTipoBotellas:             {type: String},
salidaNumeroBotellas:           {type: Number},
salidaTipoTapas:                {type: String},
salidaNumeroTapas:              {type: Number},
salidaTipoEtiquetas:            {type: String},
salidaNumeroEtiquetas:          {type: Number},

salidaTipoOtros:            {type: String},
salidaNumeroOtros:          {type: Number},

numeroRegistroSalida:           {type: String},
fechaRegistroSalida:            {type: Date},

InfoRegistroSalidaOrigenBotellas:       {type: Array},
InfoRegistroSalidaOrigenTapas:          {type: Array},
InfoRegistroSalidaOrigenEtiquetas:      {type: Array},
})
module.exports = mongose.model('alamo_salidas', isalidasAlamoShema)