const mongose = require('mongoose');
const botellasShema = new mongose.Schema({
botella:    {type: String}
})
module.exports = mongose.model('alamo_existencias', botellasShema)