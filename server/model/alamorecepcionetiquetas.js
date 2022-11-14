const mongose = require('mongoose');
const recepcionEtiquetaShema = new mongose.Schema({
etiqueta:                           {type: String}
})
module.exports = mongose.model('recepcion_etiquetas', recepcionEtiquetaShema)