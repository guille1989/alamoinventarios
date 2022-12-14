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
const IngresarUsuariosAlamo = require('./rutas/ingresarusuario');
const LeerusuariosAlamo = require('./rutas/leerusuarios');
const AutenticacionusuarioAlamo = require('./rutas/usuarioautenticacion');
const LeerExistenciasFiltroKeyWord = require('./rutas/leerexistenciakeyword');
const LeerAlamoRecepcionBotellasPersonal = require('./rutas/leerrecepcionpersonal');
const LeerAlamoRevisionBotellasPersonal = require('./rutas/leerrevisionpersonal');
const LeerAlamoBotellas = require('./rutas/leerbotellasalamo');
const InsertPersonalRecepcion = require('./rutas/insertarpersonalrecepcion');
const LeerTapasAlamo = require('./rutas/crudtapas');
const LeerExistenciasTapasAlamo = require('./rutas/leertapasalamo');
const LeerExistenciasTapasGeneral = require('./rutas/leertapasitem');
const LeerExistenciasOtrosGeneral = require('./rutas/leerotrositem');
const LeerExistenciasTapasFiltro = require('./rutas/leerexistenciakeywordtapas');
const LeerOtrosAlamo = require('./rutas/crudotros');
const LeerOtrosAlamoPrincipal = require('./rutas/leerotrosalamo');
const LeerOtrosAlamoFiltroKeyWord = require('./rutas/leerexistenciaskeywordotros');
const LeerEtiquetasAlamo = require('./rutas/crudetiquetas');
const LeerEtiquetasAlamoPrincipal = require('./rutas/leeretiquetasalamo');
const LeerExistenciasEtiquetasGeneral = require('./rutas/leeretiquetasitem');
const LeerEtiquetasAlamoFiltroKeyWord = require('./rutas/leerexistenciakeywordetiquetas');
const LeerPorcentajeSinRevision = require('./rutas/leerexistenciasdashporrevision');
const LeerReciboCostoMesExistencia = require('./rutas/leerexistenciasdashboardcostomes');
const LeerExistenciasCostoMesPorItemR = require('./rutas/leerexistenciasdashboardcostoporitems');
const LeerExistenciasTapasCostoMesGeneral = require('./rutas/tapas/leertapasdisponiblescostomes');
const LeerExistenciasTapasCostoMesItem = require('./rutas/tapas/leertapasdisponiblescostomesitem');

const LeerExistenciasEtiquetasCostoMesGeneral = require('./rutas/etiquetas/leeretiquetadisponiblecostomes');
const LeerExistenciasEtiquetasCostoMesItem = require('./rutas/etiquetas/leeretiquetasdisponiblescostomesitem');

const LeerExistenciasOtrosCostoMesGeneral = require('./rutas/otros/leerotrosdisponiblecostomes');
const LeerExistenciasOtrosCostoMesItem = require('./rutas/otros/leerotrosdisponiblescostomesitem');

const CrudPersonalSalidas = require('./rutas/salidas/crudpersonalsalidas');
const leerBotellasDisponiblesSalida = require('./rutas/salidas/leerinventariosaidas');

const LeerSalidasAlamo = require('./rutas/salidas/leersalidasinventario');

const CrudSalidasDaniadasAlamo = require('./rutas/salidas_daniadas/crudregistrodaniadas');
const LeerBotellasenLLenado = require('./rutas/salidas_daniadas/leersalidasdaniadasbotellas');
const LeerRegistroDaniados = require('./rutas/salidas_daniadas/leerexistenciasenllenado');


const CrudSalidasDefectuosasAlamo = require('./rutas/salidas_defectuosas/crudregistrodefectuosas');
const LeerBotellasenLLenadoDefectuosas = require('./rutas/salidas_defectuosas/leersalidadefectuosos');
const LeerRegistroDefectuosas = require('./rutas/salidas_defectuosas/leerexistenciasllenado');
//
//middlewares
const corse = require('cors');
const bodyParser = require("body-parser");
const { application } = require('express');
//
app.use(corse());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/*
//Conectamos con DB local mongodb://localhost:27017/alamo
mongose.connect('mongodb://localhost:27017/alamo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado con DB'))
    .catch(() => console.log('No se puedo conectar con DB'))

//
*/

//Conectamos con Data Base
mongose.connect('mongodb+srv://root:123@cluster0.jwxt0.mongodb.net/alamo?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado con DB'))
    .catch(() => console.log('No se puedo conectar con DB'))

//
app.use('/api/autenticacionusuario', AutenticacionusuarioAlamo)
app.use('/api/leerexistenciasalamo', LeerExistenciasAlamo);
app.use('/api/insertarexistenciasalamo', InsertExistenciasAlamo);
app.use('/api/leerexistenciasitemalamo', LeerExistenciasItemAlamo);
app.use('/api/insertrevisionexistencias', InsertRevisionExistenciasAlamo);
app.use('/api/leerexistenciasalamorevision', LeerExistenciasRevisionAlamo);
app.use('/api/leerexistenciasalamogeneral', LeerExistenciasAlamoG);
app.use('/api/leerexistenciasalamofiltro', LeerExistenciasAlamoFiltro);
app.use('/api/leerusuariosalamo', LeerusuariosAlamo);
app.use('/api/ingresarusuarioalamo', IngresarUsuariosAlamo);
app.use('/api/leerexistenciasfiltro', LeerExistenciasFiltroKeyWord);
app.use('/api/leerpersonalrecepcion', LeerAlamoRecepcionBotellasPersonal);
app.use('/api/leerpersonalrevision', LeerAlamoRevisionBotellasPersonal);
app.use('/api/leerbotellas', LeerAlamoBotellas);
app.use('/api/insertpersonalrecepcion', InsertPersonalRecepcion);
app.use('/api/leertapasalamo', LeerTapasAlamo);
app.use('/api/leerexistenciastapasalamo', LeerExistenciasTapasAlamo)
app.use('/api/leerexistenciasitemalamotapas', LeerExistenciasTapasGeneral)
app.use('/api/leerexistenciastapasfiltro', LeerExistenciasTapasFiltro)
app.use('/api/leerotrosalamo', LeerOtrosAlamo)
app.use('/api/leerotrosalamogeneral', LeerOtrosAlamoPrincipal)
app.use('/api/leerexistenciasotrosfiltro', LeerOtrosAlamoFiltroKeyWord)
app.use('/api/leeralamootrosexistencias', LeerExistenciasOtrosGeneral)
app.use('/api/leeretiquetasalamo', LeerEtiquetasAlamo)
app.use('/api/leeretiquetasalamogeneral', LeerEtiquetasAlamoPrincipal)
app.use('/api/leeralamoetiquetasexistencias', LeerExistenciasEtiquetasGeneral)
app.use('/api/leerexistenciasetiquetasfiltro', LeerEtiquetasAlamoFiltroKeyWord)
app.use('/api/leerexistenciaporcentajesinrevision', LeerPorcentajeSinRevision)
app.use('/api/leerexistenciarecibocostomes', LeerReciboCostoMesExistencia)
app.use('/api/leerexistenciascostomesporitem', LeerExistenciasCostoMesPorItemR)
app.use('/api/leerexistenciastapascostomesgeneral', LeerExistenciasTapasCostoMesGeneral)
app.use('/api/leerexistenciastapascostomesitem', LeerExistenciasTapasCostoMesItem)
app.use('/api/leerexistenciasetiquetascostomesgeneral', LeerExistenciasEtiquetasCostoMesGeneral)
app.use('/api/leerexistenciasetiquetascostomesitem', LeerExistenciasEtiquetasCostoMesItem)
app.use('/api/leerexistenciasotroscostomesgeneral', LeerExistenciasOtrosCostoMesGeneral)
app.use('/api/leerexistenciasotroscostomesitem', LeerExistenciasOtrosCostoMesItem)
app.use('/api/crudsalidaexistenciasalamo', CrudPersonalSalidas)
app.use('/api/leerbotellasdisponiblessalida', leerBotellasDisponiblesSalida)
app.use('/api/leersalidasalamo', LeerSalidasAlamo);

app.use('/api/leerRlotebotellasdaniadas', CrudSalidasDaniadasAlamo);
app.use('/api/leerellenado', LeerBotellasenLLenado);
app.use('/api/leerregistrodaniados', LeerRegistroDaniados);

app.use('/api/leerRlotebotellasdefectuosas', CrudSalidasDefectuosasAlamo);
app.use('/api/leerellenadodefectuosas', LeerBotellasenLLenadoDefectuosas);
app.use('/api/leerregistrodefectuosas', LeerRegistroDefectuosas);

//Iniciamos Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`BackEnd escuchando por puerto ${port}....`)
}) 