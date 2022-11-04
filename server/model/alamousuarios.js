const mongose = require('mongoose');
const usuariosShema = new mongose.Schema({
user:                           {type: String},
password:                       {type: String},
type_user:                      {type: String},
})
module.exports = mongose.model('usuarios', usuariosShema)