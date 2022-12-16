const mongose = require('mongoose');
const salidasAlamoShema = new mongose.Schema({
responsableSalida:              {type: String},
tipoexistencia:                 {type: String},
loteExistencia:                 {type: String},
cantidad:                       {type: Number},
numeroRegistroSalida:           {type: String},
fechaRegistroSalida:            {type: Date},

})
module.exports = mongose.model('alamo_salidas_daniadas', salidasAlamoShema)