import '../../App.css';
import {React, Component} from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class alamoExistenciasDaniadas extends Component {
    constructor(props){
        super(props);    
        this.state={
          dataExistencias: [],
          dataExistenciasEnRev: [],
          modalAgregarExistencia: false,
          tipoExistencia: '',
          tipoExistenciaProveedor: '',
          ExistenciasCantidad: '',
          ExistenciasLote: '',
          ExistenciasFecha: '',
          loteRepetido: 'none',
          ExistenciaCosto: '',
          responsableRecepcionExistencia: '',
          dataRecepcion: [],
          dataBotellas: [],
          dataSalida: [],
          botellasDisponibles: '',
          tapasDisponibles: '',
          etiquetasDisponibles: '',
          dataTapas: [],
          dataEtiquetas: [],
          tipoSalidaBotella: '',
          cantidadSalidaBotellas: '', 
          tipoSalidaTapas: '',
          cantidadSalidaTapas: '',
          tipoSalidaEtiquetas: '', 
          cantidadSalidaEtiquetas: '',
          cantidadlimiteBotella: 0,
          cantidadlimiteTapas: 0,
          cantidadlimiteEtiquetas: 0,
          fechaSalida: '',
          dataLotedaniadas: [],
          loteBotellaRdaniadas: '',
          dataAuxRdaniadas: [],
          datoExistenciasRdaniadasTio: "",
          tipoExistenciaAlamo: "",
          loteExistenciaAlamo: "",
          cantidadExistenciaAlamo: "",
          dataOtros: []

        }
      }

      onChangeExistenciaAlamoResponsable = (e) => {
        this.setState({
          responsableRecepcionExistencia: e.target.value
        })
      }
    
      //Funciones del formulario para agregar existencias
      onChangeExistenciaAlamo = (e) => {
        //console.log('Existencia: ' + e.target.value)
        this.setState({
          tipoExistencia: e.target.value
        })
      }
    
      onChangeExistenciaAlamoProveedor = (e) => {
        //console.log('Proveedor: ' + e.target.value)
        this.setState({
          tipoExistenciaProveedor: e.target.value
        })
      }
    
      onChangeExistenciaAlamoCantidad = (e) => {
        //console.log('Cantidad: ' + e.target.value)
        this.setState({
          ExistenciasCantidad: e.target.value
        })
      }

      onChangeExistenciaAlamoCosto = (e) => {
        this.setState({
          ExistenciaCosto: e.target.value
        })
      }
    
      onChangeExistenciaAlamoLote = (e) => {
        //console.log('Lote: ' + e.target.value.toUpperCase())
        this.setState({
          ExistenciasLote: e.target.value.toUpperCase()
        })
      }
    
      onChangeExistenciaAlamoFecha = (e) => {
        //console.log('Fecha: ' + e.target.value)f
        this.setState({
          ExistenciasFecha: e.target.value
        })
      }
    
      //Agregar nueva existencia
      registrarExistenciaAlamo = () => {
        if(this.state.responsableRecepcionExistencia === '' || 
            this.state.tipoExistenciaAlamo === '' || 
            this.state.loteExistenciaAlamo === '' || 
            this.state.cantidadSalidaBotellas === ''
            ){
          alert('Ingresar todos los CAMPOS !')
        }else{
     
          const requestOptions ={
            method: 'POST',
            headers : new Headers({
                'Authorization': localStorage.getItem( 'token' ),
                'Content-type':'application/json'
              }),
            body: JSON.stringify({    
                existenciatipo:                 this.state.datoExistenciasRdaniadasTio,            
                responsableSalida:              this.state.responsableRecepcionExistencia,
                tipoexistencia:                 this.state.tipoExistenciaAlamo,
                loteExistencia:                 this.state.loteExistenciaAlamo,
                cantidad:                       this.state.cantidadSalidaBotellas
                })
          }

           //POST RESTA
           fetch('http://www.alamoinventario.com:80/api/leerellenado', requestOptions)
           .then(response => response.json())
           .then(data => {

             if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                 localStorage.clear();
                 this.props.logoutHandler();
               }       
               
               alert('Existencia registrada !!')

               //Aqui hay que hacer el recargue de las daniadas:
               const requestOptions ={
                method: 'GET',
                headers : new Headers({
                  'Authorization': localStorage.getItem( 'token' ),
                  'Content-type':'application/json'
                }), 
              }
          
              fetch('http://www.alamoinventario.com:80/api/leerregistrodaniados/' + 'SinDato', requestOptions)
                  .then(response => response.json())
                  .then(data => {
      
                      if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                          localStorage.clear();
                          this.props.logoutHandler();
                        }
                        
                      
                      this.setState({
                          dataExistencias : data.data
                      })
                  })
                  .catch(err => console.log(err))
              
              //Actualizamos cantidades
              fetch('http://www.alamoinventario.com:80/api/leerellenado', requestOptions)
              .then(response => response.json())
              .then(data => {  

                  if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                  }else{
                      
                  }   
                  this.setState({
                      dataBotellas : data.data.result,
                      dataTapas: data.data.resultTapas,
                      dataEtiquetas: data.data.resultEtiquetas,
                      dataOtros: data.data.resultOtros
                    })   
                          
              })
              .catch(err => {                 
              console.log(err)
              })
               
               this.setState({
                 modalAgregarExistencia: !this.state.modalAgregarExistencia})  
       
             })
             .catch(err => console.log(err))


            
              }
      }
    
      componentDidMount(){
        this.setState({
          fechaSalida: new Date().toISOString().split("T", 1)[0]
        })
        const requestOptions ={
            method: 'GET',
            headers : new Headers({
            'Authorization': localStorage.getItem( 'token' ),
            'Content-type':'application/json'
            }), 
        }       

        //ME TRAIGO LAS EXISTENCIAS DISPONIBLES
        fetch('http://www.alamoinventario.com:80/api/leerellenado', requestOptions)
        .then(response => response.json())
        .then(data => {  

            if(typeof data.err !== 'undefined' && data.err.message.length > 0){
            localStorage.clear();
            this.props.logoutHandler();
            }else{
                
            }   
            this.setState({
                dataBotellas : data.data.result,
                dataTapas: data.data.resultTapas,
                dataEtiquetas: data.data.resultEtiquetas,
                dataOtros: data.data.resultOtros
              })   
                    
        })
        .catch(err => {                 
        console.log(err)
        })
      
    //LOS QUE RECEPCION
    fetch('http://www.alamoinventario.com:80/api/crudsalidaexistenciasalamo', requestOptions)
        .then(response => response.json())
        .then(data => {     

            if(typeof data.err !== 'undefined' && data.err.message.length > 0){

            localStorage.clear();
            this.props.logoutHandler();

            }else{
                
            }   
            this.setState({
            dataSalida : data.data
        })   
                    
        })
        .catch(err => {                 
            console.log(err)
        })

        //Traeno los registros de dañados
        fetch('http://www.alamoinventario.com:80/api/leerregistrodaniados/' + 'SinDato', requestOptions)
                .then(response => response.json())
                .then(data => {     
                    if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                      
                    localStorage.clear();
                    this.props.logoutHandler();

                    }else{
                        
                    }   
                    this.setState({
                      dataExistencias : data.data
                  })
                            
                })
                .catch(err => {                 
                    console.log(err)
                })

      }

      handleFechaSalidas = (e) => {
        this.setState({
          fechaSalida: e.target.value
        })
        //mandamos a leer lo que tenemos
        const requestOptions ={
          method: 'GET',
          headers : new Headers({
            'Authorization': localStorage.getItem( 'token' ),
            'Content-type':'application/json'
          }), 
        }
    
        fetch('http://www.alamoinventario.com:80/api/leerregistrodaniados/' + e.target.value, requestOptions)
            .then(response => response.json())
            .then(data => {

                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                    localStorage.clear();
                    this.props.logoutHandler();
                  }
                  
                this.setState({
                    dataExistencias : data.data
                })
            })
            .catch(err => console.log(err))
      }

      handleRLlotebotellas = (existencia, tipoe) => {
        this.setState({
            tipoExistenciaAlamo: existencia
        })
        //mandamos a leer lo que tenemos
        const requestOptions ={
            method: 'GET',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }), 
          }
      
          fetch('http://www.alamoinventario.com:80/api/leerRlotebotellasdaniadas/' + existencia + '/' + tipoe, requestOptions)
              .then(response => response.json())
              .then(data => {
  
                  if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                      localStorage.clear();
                      this.props.logoutHandler();
                    }
                    

                  this.setState({
                    dataLotedaniadas: data.data
                  })
              })
              .catch(err => console.log(err))
      }

      handletipoERdaniadas(dato){

        this.setState({
            datoExistenciasRdaniadasTio: dato
        })
        
        if(dato === "Botellas"){            
            this.setState({
                dataAuxRdaniadas: this.state.dataBotellas
            })
        }else if(dato === "Tapas"){
            this.setState({
                dataAuxRdaniadas: this.state.dataTapas
            })
        }else if(dato === "Etiquetas"){
            this.setState({
                dataAuxRdaniadas: this.state.dataEtiquetas
            })
        }else{
            this.setState({
              dataAuxRdaniadas: [],
                dataBotellas : [],
                dataTapas: [],
                dataEtiquetas: [],
                dataOtros: []}) 
        }
      }
    
      render(){
        return (
          <div>
            <div className='tituloDeExistencias'>
              <h3 className='tituloAlamo'>REGISTRO EXISTENCIAS DAÑADAS - ALAMO</h3>
            </div>

            <div className='fechasalida'>
              <Label><strong>Fecha de Salida: </strong></Label>
              <Input
                id="exampleDate"
                name="date"
                placeholder="date placeholder"
                type="date"
                onChange={this.handleFechaSalidas}
                value={this.state.fechaSalida}
              />
            </div>  

            <Button className='botonAgregarExistencia' color="success" 
                onClick={() => {
                    this.setState({
                        modalAgregarExistencia: !this.state.modalAgregarExistencia,
                        responsableRecepcionExistencia: '',
                        cantidadSalidaBotellas: '',
                        cantidadSalidaTapas: '',
                        cantidadSalidaEtiquetas: '',
                        cantidadlimiteBotella: 0,
                        cantidadlimiteTapas: 0,
                        cantidadlimiteEtiquetas: 0,
                        tipoExistenciaAlamo: '', 
                        loteExistenciaAlamo: ''
                    })                    
                    }}>Registrar Existencias Dañandas</Button>
          
            <br></br>
            <br></br>
            <br></br>
          
            <Table    
              bordered   
              borderless
              striped>
            <thead>
              <tr>
                <th>Fecha Registro Existencia Dañada</th>
                <th>Tipo Existencia</th>
                <th>Lote Existencia</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
            {this.state.dataExistencias.map((item, index) => {
              return(
                <>                        
                <tr key={index}>
                  <td>{item.fechaRegistroSalida.split("T", 1)}</td>
                  <td>{item.tipoexistencia}</td>
                  <td>{item.loteExistencia}</td>
                  <td>{item.cantidad}</td>
                </tr>  
                </>    
                )   
            })}   
            </tbody>
            </Table>
            <Modal isOpen={this.state.modalAgregarExistencia}>
              <ModalHeader>Registrar Salida de Existencias</ModalHeader>
              <ModalBody>

              <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={this.onChangeExistenciaAlamoResponsable}>
                <option>
                  Responsable Registro
                </option>  
                {this.state.dataSalida.map((item, index) => {
                  return(
                    <option>{item.nombre}</option>
                  )
                })} 
                              
              </Input>

            <Label>
                Registro Existencias Dañadas
            </Label>

              <Input
                    bsSize="sm"
                    className="mb-3"
                    type="select"
                    onChange={(e) => {
                      document.getElementById("sTipoExistencia").value = "Seleccione tipo Existencia"
                      document.getElementById("sLoteExistencia").value = "Seleccione Lote de Existencia"
                      this.handletipoERdaniadas(e.target.value)
                    }}
                >
                    <option>
                    Seleccione Tipo Existencia
                    </option>
                    <option>
                    Botellas
                    </option>
                    <option>
                    Tapas
                    </option>
                    <option>
                    Etiquetas
                    </option>
                </Input>


                <Input
                id="sTipoExistencia"
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={(e) => {    
                  document.getElementById("sLoteExistencia").value = "Seleccione Lote de Existencia"  
                    this.setState({
                        tipoSalidaBotella: e.target.value.split(" - C", 1).pop(),                        
                    })
                    this.handleRLlotebotellas(e.target.value.split(" :", 1).pop(), this.state.datoExistenciasRdaniadasTio)
                }}>
                <option>
                  Seleccione tipo Existencia
                </option>                
                {this.state.dataAuxRdaniadas.map((item, index) => {
                    if(this.state.datoExistenciasRdaniadasTio === "Botellas"){                  
                        return(
                            <>
                            <option>{item._id} : {Number(item.SumSiExistencia).toLocaleString('us')}</option>
                            </>                    
                            )
                    }else if(this.state.datoExistenciasRdaniadasTio === "Tapas"){                           
                        return(
                            <>
                            <option>{item._id} : {Number(item.tapas).toLocaleString('us')}</option>
                            </>                    
                            )
                    }else if(this.state.datoExistenciasRdaniadasTio === "Etiquetas"){                            
                        return(
                            <>
                            <option>{item._id} : {Number(item.etiquetas).toLocaleString('us')}</option>
                            </>                    
                            )
                    }               
                })}
              </Input>

              <Input
                id="sLoteExistencia"
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={(e) => {
                    
                    this.setState({
                        loteBotellaRdaniadas: e.target.value,
                        cantidadlimiteBotella: parseInt(e.target.value.split(": ").pop().replace(',','')),
                        loteExistenciaAlamo: e.target.value.split(":", 1).pop(),
                    })
                }}
                >
                <option>
                  Seleccione Lote de Existencia
                </option>                
                {this.state.dataLotedaniadas.map((item, index) => {
                  return(
                    <>
                    <option>{item.ExistenciasLote}: {Number(item.ExistenciasLlenado).toLocaleString('us')}</option>
                    </>                    
                    )
                })}
              </Input>
        
              <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Cantidad Existencias"
                onChange={(e) => {
                    if(e.target.value === ''){
                        document.getElementById('avisoSiDE').style.display = 'none'
                        document.getElementById('avisoNoDE').style.display = 'none'
                    }else{
                        if(Math.abs(e.target.value) > this.state.cantidadlimiteBotella){
                            document.getElementById('avisoNoDE').style.display = 'block'
                            document.getElementById('avisoSiDE').style.display = 'none'
                            this.setState({cantidadSalidaBotellas: ''})
                        }else{
                            document.getElementById('avisoNoDE').style.display = 'none'
                            document.getElementById('avisoSiDE').style.display = 'block'
                            this.setState({cantidadSalidaBotellas: Math.abs(e.target.value)})
                        }
                    }
                    
                }}
                type="number"
              />
            <p className='avisoSiDispo' id='avisoSiDE'>Ok !</p>
            <p className='avisoNoDispo' id='avisoNoDE'>Existencias no disponibles, hay: {Number(this.state.cantidadlimiteBotella).toLocaleString('us')}</p>
                          
            </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.registrarExistenciaAlamo}>
                  Registrar Existencias Dañadas
                </Button>
                <Button color="secondary" onClick={() => this.setState({modalAgregarExistencia: !this.state.modalAgregarExistencia})}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        );
      }
};

export default alamoExistenciasDaniadas;