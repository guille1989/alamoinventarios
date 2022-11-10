const mongose = require('mongoose');
const recepcionTapasShema = new mongose.Schema({
tapa:                           {type: String}
})
module.exports = mongose.model('recepcion_tapas', recepcionTapasShema)