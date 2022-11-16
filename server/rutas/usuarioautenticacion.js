const express = require('express');
const ruta = express();
const Usuarios = require('../model/alamousuarios');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

ruta.post('/', (req, res) => {

    Usuarios.find({user: req.body.user})
        .then(datos => {            
            if(datos){ 
                let resultLogIn = false;               
                for(var i=0; i<datos.length; i++){
                    const passwordValida = bcrypt.compareSync(req.body.password, datos[i].password);
                    if(passwordValida){                       
                        var token = jwt.sign({ user: datos.user, type_user: datos.type_user }, 'password', { expiresIn: "12h" });
                        res.json({
                            token: token,
                            user: datos[i].user})
                        resultLogIn = true;
                        break;
                    }
                }    
                
            if(resultLogIn === false){
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