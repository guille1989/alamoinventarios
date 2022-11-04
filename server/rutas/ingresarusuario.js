const express = require('express');
const ruta = express();
const Usuarios = require('../model/alamousuarios');
const bcrypt = require('bcrypt');

ruta.post('/', (req, res) => {
    let body = req.body;

    let result = IngresarUser(body)
    result.then(dato =>{
        res.json({
            msj: "Usuario Ingresado !",
            user: dato.user,
            type_user: dato.type_user
        })
    }).catch(err => {
        res.json({
            error: err
        })
    })    
})

async function IngresarUser(body){
    let result = [];
    
    result = new Usuarios({ 
        user:                           body.user,
        password:                       bcrypt.hashSync(body.password , 10),
        type_user:                      body.type_user,
     });
    
    return result.save();
}
module.exports = ruta;