const mongose = require('mongoose');
const recepcionOtrosShema = new mongose.Schema({
otros:                           {type: String}
})
module.exports = mongose.model('recepcion_otros', recepcionOtrosShema)