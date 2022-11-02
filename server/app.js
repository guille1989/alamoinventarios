const express = require('express');
const app = express();
const mongose = require('mongoose');
//
const path = require('path');
//
const LeerExistenciasAlamo = require('./rutas/leerexistencias');
const InsertExistenciasAlamo = require('./rutas/insertexistencias');
const LeerExistenciasItemAlamo = require('./rutas/leerexistenciasitem');
const InsertRevisionExistenciasAlamo = require('./rutas/realizarrevision');
const LeerExistenciasRevisionAlamo = require('./rutas/leerexistenciaitemalamorev');
const LeerExistenciasAlamoG = require('./rutas/leerexistenciasalamo');
const LeerExistenciasAlamoFiltro = require('./rutas/leerexistenciaslamofiltros');
//
//middlewares
const corse = require('cors');
const bodyParser = require("body-parser");
app.use(corse());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Conectamos con Data Base
mongose.connect('mongodb+srv://root:123@cluster0.jwxt0.mongodb.net/alamo?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado con DB'))
    .catch(() => console.log('No se puedo conectar con DB'))

//
app.use('/api/leerexistenciasalamo', LeerExistenciasAlamo);
app.use('/api/insertarexistenciasalamo', InsertExistenciasAlamo);
app.use('/api/leerexistenciasitemalamo', LeerExistenciasItemAlamo);
app.use('/api/insertrevisionexistencias', InsertRevisionExistenciasAlamo);
app.use('/api/leerexistenciasalamorevision', LeerExistenciasRevisionAlamo);
app.use('/api/leerexistenciasalamogeneral', LeerExistenciasAlamoG);
app.use('/api/leerexistenciasalamofiltro', LeerExistenciasAlamoFiltro);

//Iniciamos Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`BackEnd escuchando por puerto ${port}....`)
})