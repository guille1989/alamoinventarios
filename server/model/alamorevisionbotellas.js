const mongose = require('mongoose');
const revisionBotellasShema = new mongose.Schema({
nombre:                           {type: String}
})
module.exports = mongose.model('revision_botellas', revisionBotellasShema)