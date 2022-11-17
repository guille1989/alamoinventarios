import React, { Component } from 'react';
import {FormGroup, Toast, ToastHeader,ToastBody, Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Webcam from "react-webcam";

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class existencias extends Component {
    constructor(props){
        super(props);    
        this.state={
            data: [],
            modalFoto: false,
            modalInfoRevExistencia: false,
            revExistencia: false,
            existenciaLote: '',
            existenciasAlamo: '',
            NumeroMuestrasExistencias: '',
            olorExtranio: true,
            apariencia: true,
            contaminacionInterna: true,
            acabadoEnvasedaniado: true,
            diametroExteriorAcabado: true,
            contaminacionExterna: true,
            presenciaAbolladuras: true,
            marcasRalladuras: true,
            desgaste: true,
            burbujas: true,
            perlesencia: true,
            materialExtranio: true,
            puntoinyecciondesentrado: true,
            alturaOk: true,
            pesoOk: true,
            tapaLiner: true,
            roscaBotella: true,
            AlturaMilimetrosExistencia: '',
            GramosExistenciaAlamo: '',
            ResponsableRevisionAlamo: '',
            observacionRevisionExistencia: '',
            dataRev: [],
            fotoParametros: {
                                width: 1280,
                                height: 720,
                                facingMode: "user"
                            },
            tituloFotoExistencia: '',
            PresentacionInsumoFoto: '',
            ExistenciasLoteFoto: '',
            rechazar_inspeccion_s4Foto: '',
            contFotosAuz: 1,
            fotoArchivo: '',
            arrayFotosAuz: [],
            dataRevision: []

        }
    }

    componentDidMount(){
        //Fetch para enviar informacion al backend:
        const requestOptions ={
            method: 'GET',
            headers : new Headers({
                'Authorization': localStorage.getItem( 'token' ),
                'Content-type':'application/json'
              }),    
          }      
          fetch('http://www.alamoinventario.com:80/api/leerexistenciasitemalamo/' + this.props.existenciaItemAlamo, requestOptions)
              .then(response => response.json())
              .then(data => {
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                    localStorage.clear();
                    this.props.logoutHandler();
                  }

                this.setState({
                    data: data.data
                })
              })
              .catch(err => console.log(err))
        //
        //TRAIGO LOS QUE HACEN LA REVISION
        fetch('http://www.alamoinventario.com:80/api/leerpersonalrevision', requestOptions)
          .then(response => response.json())
          .then(data => {              
              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                localStorage.clear();
                this.props.logoutHandler();
              }else{
                  
              }   
              this.setState({
                dataRevision : data.data
            })   
                      
          })
          .catch(err => {                 
              console.log(err)
          })
    }

    //
    onChangeAlturaMilimetros = (e) => {
        //console.log('Lote: ' + e.target.value.toUpperCase())
        this.setState({
          AlturaMilimetrosExistencia: e.target.value.toUpperCase()
        })
        }

    onChangeGramosExistencia = (e) => {
        //console.log('Lote: ' + e.target.value.toUpperCase())
        this.setState({
            GramosExistenciaAlamo: e.target.value.toUpperCase()
        })
        }
    
    onChangeObservacionRevisionE = (e) => {
        //console.log('Observacion: ' + e.target.value.toUpperCase())
        this.setState({
            observacionRevisionExistencia: e.target.value.toUpperCase()
        })
        }

    onChangeTituloFotoExistencia = (e) => {
        //console.log('Observacion: ' + e.target.value.toUpperCase())
        this.setState({
            tituloFotoExistencia: e.target.value.toUpperCase()
        })
        }

    onChangeResponsableRevision = (e) => {
        //console.log('Lote: ' + e.target.value.toUpperCase())
        this.setState({
            ResponsableRevisionAlamo: e.target.value.toUpperCase()
        })
        }

    onChangeNumeroMuestras = (e) => {
        //console.log('Lote: ' + e.target.value.toUpperCase())
        this.setState({
            NumeroMuestrasExistencias: e.target.value.toUpperCase()
        })
        }

    handleInfoRevExistencia = (existencia, lote) => {
        //Fetch para enviar informacion al backend:
        const requestOptions ={
            method: 'GET',
            headers : new Headers({
                'Authorization': localStorage.getItem( 'token' ),
                'Content-type':'application/json'
              }),    
          }      
          fetch('http://www.alamoinventario.com:80/api/leerexistenciasalamorevision/' + existencia +'/'+ lote, requestOptions)
              .then(response => response.json())
              .then(data => {

                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                    localStorage.clear();
                    this.props.logoutHandler();
                  }

                this.setState({
                    dataRev: data.data
                })
              })
              .catch(err => console.log(err))
        //

        this.setState({
            modalInfoRevExistencia: !this.state.modalInfoRevExistencia,
        })
    }

    handleRevisionesExistencias = (item, existencia, lote, codigoMuestra, muestra, apro, recha) => {
        if(item === "Ok"){            
            return(
                <td onClick={() => {
                    this.setState({
                        existenciaLote: lote,
                        existenciasAlamo: existencia
                    })
                    this.handleInfoRevExistencia(existencia, lote)}} className='infoRevisionExistencia'>Existencia ya Revisada</td>
            )
        }

        if(item === "Revision no aprobada"){
            return(
                <td onClick={() => {
                    this.setState({
                        existenciaLote: lote,
                        existenciasAlamo: existencia
                    })
                    this.handleInfoRevExistencia(existencia, lote)}} className='infoRevisionExistencia'>Existencia ya Revisada</td>
            )
        }

        if(item === "En Revision"){
            return(
                <td 
                        className='infoRevisionExistencia'
                        //className='infoRevisionExistencia'
                        //color="warning"
                        //size="sm"
                        onClick={() => {
                            this.setState({
                                revExistencia: !this.state.revExistencia,
                                existenciaLote: lote,
                                existenciasAlamo: existencia,
                                NumeroMuestrasExistencias: muestra
                            })
                        }}>Hacer Revision Existencia</td>
            )
        }
        
    }

    handleFotosExistencias = (PresentacionInsumo, ExistenciasLote, rechazar_inspeccion_s4) => {
        return(
            <td 
                    className='infoRevisionExistencia'
                    //className='infoRevisionExistencia'
                    //color="warning"
                    //size="sm"
                    onClick={() => {
                        this.setState({
                            modalFoto: !this.state.modalFoto,
                            PresentacionInsumoFoto: PresentacionInsumo,
                            ExistenciasLoteFoto: ExistenciasLote,
                            rechazar_inspeccion_s4Foto: rechazar_inspeccion_s4,
                        })
                    }}>Tomar registro fotografico</td>
            )
    }

    handleNumeroFotos = () => {  
         
    }

    handleRevisionExistencia = () => {
        if(this.state.ResponsableRevisionAlamo === '' ||
            this.state.NumeroMuestrasExistencias === '' ||
            //this.state.AlturaMilimetrosExistencia === '' ||
            this.state.GramosExistenciaAlamo === '')
        {
            alert('Por favor diligenciar todos los campos !')
        }else{
            if( this.state.olorExtranio === false ||
                this.state.apariencia === false ||
                this.state.contaminacionInterna === false ||
                this.state.acabadoEnvasedaniado === false ||
                this.state.diametroExteriorAcabado === false ||
                this.state.contaminacionExterna === false ||
                this.state.presenciaAbolladuras === false ||
                this.state.marcasRalladuras === false ||
                this.state.desgaste === false ||
                this.state.burbujas === false ||
                this.state.perlesencia === false ||
                this.state.puntoinyecciondesentrado === false ||
                this.state.alturaOk === false ||
                this.state.pesoOk === false ||
                this.state.roscaBotella === false ||
                this.state.tapaLiner === false ||
                this.state.materialExtranio === false
                )
            {
                if(window.confirm("Lote no cumple con Revision")){
                    //Aqui enviamos informacion al backend
                const requestOptions ={
                    method: 'POST',
                    headers : new Headers({
                        'Authorization': localStorage.getItem( 'token' ),
                        'Content-type':'application/json'
                      }),
                    body: JSON.stringify({
                        ResponsableRevision:            this.state.ResponsableRevisionAlamo,
                        NoMuestras:                     this.state.NumeroMuestrasExistencias,
                        Altura_mm:                      this.state.AlturaMilimetrosExistencia,
                        Peso_g:                         this.state.GramosExistenciaAlamo,                
                        OlorExtraño:                    this.state.olorExtranio,
                        Apariencia:                     this.state.apariencia,
                        ContaminacionInterna:           this.state.contaminacionInterna,                        
                        AcabadoDaniadoEnvaseRoto:       this.state.acabadoEnvasedaniado,                        
                        RevadasDiametroExteriorAcabado: this.state.diametroExteriorAcabado,                        
                        ContaminacionAparienciaExterna: this.state.contaminacionExterna,
                        BotellasAbulladuras:            this.state.presenciaAbolladuras,
                        MarcasRalladuras:               this.state.marcasRalladuras,                        
                        Desgaste:                       this.state.desgaste,
                        Burbujas:                       this.state.burbujas,
                        Perlesencia:                    this.state.perlesencia,
                        PuntoInyeccionDecentrado:       this.state.puntoinyecciondesentrado, 

                        Rosca_ok:                       this.state.roscaBotella,              
                        Material_Extranio:              this.state.materialExtranio,
                        tapa_liner:                     this.state.tapaLiner,

                        AprobadoRechazado:              "Revision no aprobada",
                        ExistenciasLote:                this.state.existenciaLote,
                        PresentacionInsumo:             this.state.existenciasAlamo,

                        ObservacionesRevision:          this.state.observacionRevisionExistencia

                    })
                  }
              
                  fetch('http://www.alamoinventario.com:80/api/insertrevisionexistencias', requestOptions)
                    .then(response => response.json())
                    .then(data => {

                        if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                            localStorage.clear();
                            this.props.logoutHandler();
                          }

                        this.setState({
                            revExistencia: !this.state.revExistencia
                        }) 
                        
                        //
                        //Fetch para enviar informacion al backend:
                        const requestOptions ={
                            method: 'GET',
                            headers : new Headers({
                                'Authorization': localStorage.getItem( 'token' ),
                                'Content-type':'application/json'
                              })    
                        }      
                        fetch('http://www.alamoinventario.com:80/api/leerexistenciasitemalamo/' + this.props.existenciaItemAlamo, requestOptions)
                            .then(response => response.json())
                            .then(data => {

                                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                                    localStorage.clear();
                                    this.props.logoutHandler();
                                  }


                                this.setState({
                                    data: data.data
                                })
                            })
                            .catch(err => console.log(err))
                        //
                        })
                    .catch(err => console.log(err))
                }else{

                }
            }else{
                //Aqui enviamos informacion al backend
                const requestOptions ={
                    method: 'POST',
                    headers : new Headers({
                        'Authorization': localStorage.getItem( 'token' ),
                        'Content-type':'application/json'
                      }),
                    body: JSON.stringify({
                        ResponsableRevision:            this.state.ResponsableRevisionAlamo,
                        NoMuestras:                     this.state.NumeroMuestrasExistencias,
                        Altura_mm:                      this.state.AlturaMilimetrosExistencia,
                        Peso_g:                         this.state.GramosExistenciaAlamo,                
                        OlorExtraño:                    this.state.olorExtranio,
                        Apariencia:                     this.state.apariencia,
                        ContaminacionInterna:           this.state.contaminacionInterna,                        
                        AcabadoDaniadoEnvaseRoto:       this.state.acabadoEnvasedaniado,                        
                        RevadasDiametroExteriorAcabado: this.state.diametroExteriorAcabado,                        
                        ContaminacionAparienciaExterna: this.state.contaminacionExterna,
                        BotellasAbulladuras:            this.state.presenciaAbolladuras,
                        MarcasRalladuras:               this.state.marcasRalladuras,                        
                        Desgaste:                       this.state.desgaste,
                        Burbujas:                       this.state.burbujas,
                        Perlesencia:                    this.state.perlesencia,
                        PuntoInyeccionDecentrado:       this.state.puntoinyecciondesentrado, 

                        Rosca_ok:                       this.state.roscaBotella,              
                        Material_Extranio:              this.state.materialExtranio,
                        tapa_liner:                     this.state.tapaLiner,

                        AprobadoRechazado:              "Ok",
                        ExistenciasLote:                this.state.existenciaLote,
                        PresentacionInsumo:             this.state.existenciasAlamo,

                        ObservacionesRevision:          this.state.observacionRevisionExistencia

                    })
                  }
              
                  fetch('http://www.alamoinventario.com:80/api/insertrevisionexistencias', requestOptions)
                    .then(response => response.json())
                    .then(data => {

                        if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                            localStorage.clear();
                            this.props.logoutHandler();
                          }

                            this.setState({
                                revExistencia: !this.state.revExistencia
                            }) 
                            //Fetch para enviar informacion al backend:
                            const requestOptions ={
                                method: 'GET',
                                headers : new Headers({
                                    'Authorization': localStorage.getItem( 'token' ),
                                    'Content-type':'application/json'
                                  })    
                            }      
                            fetch('http://www.alamoinventario.com:80/api/leerexistenciasitemalamo/' + this.props.existenciaItemAlamo, requestOptions)
                                .then(response => response.json())
                                .then(data => {

                                    if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                                        localStorage.clear();
                                        this.props.logoutHandler();
                                      }

                                    this.setState({
                                        data: data.data
                                    })
                                })
                                .catch(err => console.log(err))
                            //                       
                        })
                    .catch(err => console.log(err))  
            }
        }        
        
    }

    handlreRegistroFotografico = () => {
        this.setState({
            modalFoto: !this.state.modalFoto
        })
    }

    handlefoto = (getScreenshot) => {  

        console.log(getScreenshot)         
    }

    handleTakePhoto (dataUri) {
        // Do stuff with the photo...
        this.setState({
            contFotosAuz: this.state.contFotosAuz + 1,
            fotoArchivo: dataUri
        })
        console.log(this.state.contFotosAuz);
      }

    render() {
        return (
            <>
            <div>                
                {/*<h1 className='tituloAlamo'>Alamo</h1>*/}
                <h1 className='tituloAlamo'><strong>Item: {this.props.existenciaItemAlamo}</strong></h1>
            </div>
            <div>
                <Table
                    bordered   
                    borderless
                    striped
                    size="sm">
                <tbody>
                    <tr>
                        <th>Item Existencia</th>
                        <th>Existencia Lote</th>
                        <th>Fecha de Recepcion</th>
                        <th>Cantidad en Stock</th>
                        <th>Existencia Aprobada</th>
                        <th>Nivel de Inspeccion Especial</th>
                        <th>Tamaño de la Muestra</th>
                        <th>Numero de Aceptacion</th>
                        <th>Numero de Rechazo</th>
                        <th>Existencia Estado</th>
                        <th>Registro Fotos</th>
                    </tr>
                    {this.state.data.map((item, index) => {
                        return(
                            <>                            
                                <tr key={index}>
                                    <td>{item.PresentacionInsumo}</td>
                                    <td>{item.ExistenciasLote}</td>
                                    <td>{item.ExistenciasRecepcion.split("T", 1)}</td>
                                    <td>{Number(item.ExistenciasStock).toLocaleString('us')}</td>
                                    <td>{item.AprobadoRechazado}</td>
                                    <td>{item.nivel_inspeccion_s4}</td>
                                    <td>{item.tamanio_muestra}</td>
                                    <td>{item.aceptar_inspeccion_s4}</td>
                                    <td>{item.rechazar_inspeccion_s4}</td>
                                    {this.handleRevisionesExistencias(item.AprobadoRechazado, item.PresentacionInsumo, item.ExistenciasLote, item.nivel_inspeccion_s4, item.tamanio_muestra, item.aceptar_inspeccion_s4, item.rechazar_inspeccion_s4)}    
                                    {this.handleFotosExistencias(item.PresentacionInsumo, item.ExistenciasLote, item.rechazar_inspeccion_s4)}                                  
                                </tr>                        
                            </>
                        )                  
                    })}
                  </tbody>  
                  </Table>
            </div>
            <Modal isOpen={this.state.revExistencia}>
            <ModalHeader>Revision de Existencia {this.state.existenciasAlamo}  Lote {this.state.existenciaLote}</ModalHeader>
            <ModalBody>
            {/*
            <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Responsable Revision"
                onChange={this.onChangeResponsableRevision}                
              />
            */}

            <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={this.onChangeResponsableRevision}>
                <option>
                  Responsable Revision Existencia
                </option>  
                {this.state.dataRevision.map((item, index) => {
                  return(
                    <option>{item.nombre}</option>
                  )
                })}          
              </Input>

            {/*<Input
                bsSize="sm"
                className="mb-3"
                placeholder="Numero de Muestras"
                type="number"
                onChange={this.onChangeNumeroMuestras}
                value={this.state.NumeroMuestrasExistencias}
                />*/}            
            
            <p>Muestras para la revision: {this.state.NumeroMuestrasExistencias}</p>
          
            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.materialExtranio}
                onClick={() => {
                    this.setState({
                        materialExtranio: !this.state.materialExtranio
                    })
                }}
                />
                <Label check>Material Extraño ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.olorExtranio}
                onClick={() => {
                    this.setState({
                        olorExtranio: !this.state.olorExtranio
                    })
                }}
                />
                <Label check>Olor Extraño ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.tapaLiner}
                onClick={() => {
                    this.setState({
                        tapaLiner: !this.state.tapaLiner
                    })
                }}
                />
                <Label check>Tapa con Liner ?</Label>
            </FormGroup>


            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.roscaBotella}
                onClick={() => {
                    this.setState({
                        roscaBotella: !this.state.roscaBotella
                    })
                }}
                />
                <Label check>Rosca OK ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.apariencia}
                onClick={() => {
                    this.setState({
                        apariencia: !this.state.apariencia
                    })
                }}
                />
                <Label check>Apariencia ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.contaminacionInterna}
                onClick={() => {
                    this.setState({
                        contaminacionInterna: !this.state.contaminacionInterna
                    })
                }}
                />
                <Label check>Contaminacion Interna ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.contaminacionExterna}
                onClick={() => {
                    this.setState({
                        contaminacionExterna: !this.state.contaminacionExterna
                    })
                }}
                />
                <Label check>Contaminacion Externa ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.acabadoEnvasedaniado}
                onClick={() => {
                    this.setState({
                        acabadoEnvasedaniado: !this.state.acabadoEnvasedaniado
                    })
                }}
                />
                <Label check>Acabado y/o Envase Dañado ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.diametroExteriorAcabado}
                onClick={() => {
                    this.setState({
                        diametroExteriorAcabado: !this.state.diametroExteriorAcabado
                    })
                }}
                />
                <Label check>Diametro exterior acabado ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.presenciaAbolladuras}
                onClick={() => {
                    this.setState({
                        presenciaAbolladuras: !this.state.presenciaAbolladuras
                    })
                }}
                />
                <Label check>Presencia abolladuras ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.marcasRalladuras}
                onClick={() => {
                    this.setState({
                        marcasRalladuras: !this.state.marcasRalladuras
                    })
                }}
                />
                <Label check>Marcas ralladuras ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.desgaste}
                onClick={() => {
                    this.setState({
                        desgaste: !this.state.desgaste
                    })
                }}
                />
                <Label check>Desgaste ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.burbujas}
                onClick={() => {
                    this.setState({
                        burbujas: !this.state.burbujas
                    })
                }}
                />
                <Label check>Burbujas ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.perlesencia}
                onClick={() => {
                    this.setState({
                        perlesencia: !this.state.perlesencia
                    })
                }}
                />
                <Label check>Perlesencia ?</Label>
            </FormGroup>

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.puntoinyecciondesentrado}
                onClick={() => {
                    this.setState({
                        puntoinyecciondesentrado: !this.state.puntoinyecciondesentrado
                    })
                }}
                />
                <Label check>Punto de inyeccion desentrado ?</Label>
            </FormGroup>

            
            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.alturaOk}
                onClick={() => {
                    this.setState({
                        alturaOk: !this.state.alturaOk
                    })
                }}
                />
                <Label check>Altura OK ?</Label>
            </FormGroup>

            {/*<Input
                bsSize="sm"
                className="mb-3"
                placeholder="Altura en milimetros"
                onChange={this.onChangeAlturaMilimetros}
                type="number"
              />*/}            

            <FormGroup switch>
                <Input
                onChange={e => {}}
                type="switch"
                checked={this.state.pesoOk}
                onClick={() => {
                    this.setState({
                        pesoOk: !this.state.pesoOk
                    })
                }}
                />
                <Label check>Peso OK ?</Label>
            </FormGroup>
            <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Peso en gramos"
                onChange={this.onChangeGramosExistencia}
                type="number"
              />           
            
            <Input
                id="exampleText"
                name="text"
                type="textarea"
                onChange={this.onChangeObservacionRevisionE}
            />

            {/* REGISTRO FOTOGRAFICO */}
            {/*<Button color="warning" onClick={this.handlreRegistroFotografico}>hacer registro FOTO</Button>*/}

            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={this.handleRevisionExistencia}>
                Aceptar
            </Button>
            <Button color="secondary" onClick={() => this.setState({
                                                revExistencia: !this.state.revExistencia
                                            })}>
                Cancel
            </Button>
            </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInfoRevExistencia}>
            <ModalHeader>Existencia {this.state.existenciasAlamo}  Lote {this.state.existenciaLote}</ModalHeader>
            <ModalBody>
                {this.state.dataRev.map((item, index) => {
                    return(
                        <div>
                        <h2 className='resultadoRevisionTitulo'>Resultado Revision: {item.AprobadoRechazado}</h2>
                        <p className='resultadoRevision'>Existencia: <strong className='resultadoItemRevision'>{item.PresentacionInsumo}</strong></p>
                        <p className='resultadoRevision'>Lote: <strong className='resultadoItemRevision'>{item.ExistenciasLote}</strong></p>
                        <p className='resultadoRevision'>Existencias Stock: <strong className='resultadoItemRevision'>{item.ExistenciasStock}</strong></p>
                        <p className='resultadoRevision'>Costo Existencias: <strong className='resultadoItemRevision'>{Number(item.CostoExistencia).toLocaleString('es')} COP</strong></p>
                        <p className='resultadoRevision'>Responsable Revision: <strong className='resultadoItemRevision'>{item.ResponsableRevision}</strong></p>
                        <p className='resultadoRevision'>Fecha Revision: <strong className='resultadoItemRevision'>{item.ExistenciasRecepcion.split("T", 1)}</strong></p>
                        
                        
                        <p className='resultadoRevision'>Numero de Muestras: <strong className='resultadoItemRevision'>{item.NoMuestras}</strong></p>
                        <p className='resultadoRevision'>Acabado dañado, envase roto: <strong className='resultadoItemRevision'>{item.AcabadoDaniadoEnvaseRoto}</strong></p>
                        <p className='resultadoRevision'>Apariencia: <strong className='resultadoItemRevision'>{item.Apariencia}</strong></p>

                        <p className='resultadoRevision'>Material Extraño: <strong className='resultadoItemRevision'>{item.Material_Extranio}</strong></p>
                        <p className='resultadoRevision'>Tapa con Liner: <strong className='resultadoItemRevision'>{item.tapa_liner}</strong></p>
                        <p className='resultadoRevision'>Rosca OK: <strong className='resultadoItemRevision'>{item.Rosca_ok}</strong></p>

                        <p className='resultadoRevision'>Abolladuras en botella: <strong className='resultadoItemRevision'>{item.BotellasAbulladuras}</strong></p>
                        <p className='resultadoRevision'>Burbujas en botella: <strong className='resultadoItemRevision'>{item.Burbujas}</strong></p>
                        <p className='resultadoRevision'>Contaminacion apariencia externa: <strong className='resultadoItemRevision'>{item.ContaminacionAparienciaExterna}</strong></p>
                        <p className='resultadoRevision'>Contaminacion interna: <strong className='resultadoItemRevision'>{item.ContaminacionInterna}</strong></p>
                        <p className='resultadoRevision'>Desgaste: <strong className='resultadoItemRevision'>{item.Desgaste}</strong></p>
                        <p className='resultadoRevision'>Marcas de ralladuras: <strong className='resultadoItemRevision'>{item.MarcasRalladuras}</strong></p>
                        <p className='resultadoRevision'>Olores extraños: <strong className='resultadoItemRevision'>{item.OlorExtraño}</strong></p>
                        <p className='resultadoRevision'>Perlesencia: <strong className='resultadoItemRevision'>{item.Perlesencia}</strong></p>
                        <p className='resultadoRevision'>Punto de inyeccion no centrado: <strong className='resultadoItemRevision'>{item.PuntoInyeccionDecentrado}</strong></p>
                        <p className='resultadoRevision'>Revision de diametro y acabados: <strong className='resultadoItemRevision'>{item.RevadasDiametroExteriorAcabado}</strong></p>
                        <p>Observaciones de la revision: <strong className='resultadoItemRevision'>{item.ObservacionesRevision}</strong></p>
                        </div>                        
                    )                    
                })}
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={() => this.setState({
                                                modalInfoRevExistencia: !this.state.modalInfoRevExistencia
                                            })}>
                Aceptar
            </Button>
            </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalFoto}>
            <ModalHeader>Fotos muestras</ModalHeader>
            <ModalBody>

                <div>
                    <p className='menuFoto'>Presentacion: <strong>{this.state.PresentacionInsumoFoto}</strong> Existencia: <strong>{this.state.ExistenciasLoteFoto}</strong></p>    
                    <p className='menuFoto'>Numero de fotos: <strong>{this.state.rechazar_inspeccion_s4Foto}</strong></p> 
                </div>                          

                <br></br>                
              
                <Camera
                    onTakePhoto = { (dataUri) => { this.handleTakePhoto(dataUri); } }
                />                         

            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={() => this.setState({
                                                modalFoto: !this.state.modalFoto
                                            })}>
                Aceptar
            </Button>
            <Button color="secondary" onClick={() => this.setState({
                                                modalFoto: !this.state.modalFoto
                                            })}>
                Cancel
            </Button>
            </ModalFooter>
        </Modal>
            </>
        );
    }
}

export default existencias;