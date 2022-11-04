const express = require('express');
const ruta = express();
const Usuarios = require('../model/alamousuarios');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

ruta.post('/', (req, res) => {

    Usuarios.findOne({user: req.body.user})
        .then(datos => {
            if(datos){
                const passwordValida = bcrypt.compareSync(req.body.password, datos.password);
                if(passwordValida){
                    //var token = jwt.sign({ user: datos.user, type_user: datos.type_user }, 'password');
                    var token = jwt.sign(
                        { user: datos.user, type_user: datos.type_user }, 'password', { expiresIn: "12h" });
                    res.json({
                        token: token,
                        user: datos.user})
                }else{
                    res.status(400).json({
                        error: 'Ok',
                        msj: 'usuario y/o contraseña incorrectos.'
                    })
                }
                
            }else{
                res.status(400).json({
                    error: 'Ok',
                    msj: 'usuario y/o contraseña incorrectos.'
                })
            }
        })
        .catch(err => {
            res.status(400).json({
                error: 'Ok',
                msj: 'Error en el servicio' + err
            })
        })
})

module.exports = ruta;