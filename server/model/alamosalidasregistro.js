const mongose = require('mongoose');
const isalidasAlamoShema = new mongose.Schema({
responsableSalida:              {type: String},

salidaTipoBotellas:             {type: String},
salidaNumeroBotellas:           {type: String},
salidaTipoTapas:                {type: String},
salidaNumeroTapas:              {type: String},
salidaTipoEtiquetas:            {type: String},
salidaNumeroEtiquetas:          {type: String},

numeroRegistroSalida:           {type: String},
fechaRegistroSalida:            {type: Date},

InfoRegistroSalidaOrigenBotellas:       {type: Array},
InfoRegistroSalidaOrigenTapas:          {type: Array},
InfoRegistroSalidaOrigenEtiquetas:      {type: Array},
})
module.exports = mongose.model('alamo_salidas', isalidasAlamoShema)