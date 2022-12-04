const mongose = require('mongoose');
const salidaBotellasShema = new mongose.Schema({
nombre:                           {type: String}
})
module.exports = mongose.model('salida_botellas', salidaBotellasShema)