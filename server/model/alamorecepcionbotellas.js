const mongose = require('mongoose');
const recepcionBotellasShema = new mongose.Schema({
nombre:                           {type: String}
})
module.exports = mongose.model('recepcion_botellas', recepcionBotellasShema)