import '../../App.css';
import {React, Component} from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class AlamoSalidas extends Component {
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
          dataOtros: [],
          tipoSalidaBotella: '',
          cantidadSalidaBotellas: '', 
          tipoSalidaTapas: '',
          cantidadSalidaTapas: '',
          tipoSalidaEtiquetas: '', 
          cantidadSalidaEtiquetas: '',
          cantidadSalidaOtros: '',
          cantidadlimiteBotella: 0,
          cantidadlimiteTapas: 0,
          cantidadlimiteEtiquetas: 0,
          cantidadlimitePyC: 0,
          fechaSalida: '',
          tipoSalidaPyC: '',
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
            this.state.tipoSalidaBotella === '' || 
            this.state.cantidadSalidaBotellas === '' || 
            this.state.tipoSalidaTapas === '' || 
            this.state.cantidadSalidaTapas === '' ||
            this.state.tipoSalidaEtiquetas === '' || 
            this.state.cantidadSalidaEtiquetas === ''
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
                responsableSalida:              this.state.responsableRecepcionExistencia,
                salidaTipoBotellas:             this.state.tipoSalidaBotella,
                salidaNumeroBotellas:           this.state.cantidadSalidaBotellas,
                salidaTipoTapas:                this.state.tipoSalidaTapas,
                salidaNumeroTapas:              this.state.cantidadSalidaTapas,
                salidaTipoEtiquetas:            this.state.tipoSalidaEtiquetas,
                salidaNumeroEtiquetas:          this.state.cantidadSalidaEtiquetas,
                salidaTipoOtros:                this.state.tipoSalidaPyC,
                salidaNumeroOtros:              this.state.cantidadSalidaOtros
                })
          }
      
          fetch('http://www.alamoinventario.com:80/api/leerbotellasdisponiblessalida', requestOptions)
              .then(response => response.json())
              .then(data => {

                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                    localStorage.clear();
                    this.props.logoutHandler();
                  }
                
                //console.log(data)                
                alert('Existencia ingresada !!')
                this.setState({
                  modalAgregarExistencia: !this.state.modalAgregarExistencia
                })  

                //Actualizamos las entradas:
                //Fetch para enviar informacion al backend:
                const requestOptions ={
                  method: 'GET',
                  headers : new Headers({
                    'Authorization': localStorage.getItem( 'token' ),
                    'Content-type':'application/json'
                  }), 
                }
            
                fetch('http://www.alamoinventario.com:80/api/leersalidasalamo/' + 'SinDato', requestOptions)
                    .then(response => response.json())
                    .then(data => {

                        if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                            localStorage.clear();
                            this.props.logoutHandler();
                          }
                          
                        //console.log(data)
                        this.setState({
                            dataExistencias : data.data
                        })
                    })
                    .catch(err => console.log(err))
                    //
                    //ME TRAIGO LAS EXISTENCIAS DISPONIBLES
                    fetch('http://www.alamoinventario.com:80/api/leerbotellasdisponiblessalida', requestOptions)
                    .then(response => response.json())
                    .then(data => { 

                      console.log(data.data)  

                        if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                          localStorage.clear();
                          this.props.logoutHandler();
                        }else{
                            
                        }   
                        this.setState({
                          dataBotellas : data.data.resultAuxB,
                          dataTapas: data.data.resultTapas,
                          dataEtiquetas: data.data.resultEtiquetas,
                          dataOtros: data.data.resultOtros,
                      })   
                                
                    })
                    .catch(err => {                 
                      console.log(err)
                      })
                                        
                      })
                      .catch(err => console.log(err))
        }
      }
    
      componentDidMount(){
        this.setState({
          fechaSalida: new Date().toISOString().split("T", 1)[0]
        })
      //console.log(new Date().toISOString().split("T", 1))
      //Fetch para enviar informacion al backend:
        const requestOptions ={
          method: 'GET',
          headers : new Headers({
            'Authorization': localStorage.getItem( 'token' ),
            'Content-type':'application/json'
          }), 
        }
    
        fetch('http://www.alamoinventario.com:80/api/leersalidasalamo/' + 'SinDato', requestOptions)
            .then(response => response.json())
            .then(data => {

                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                    localStorage.clear();
                    this.props.logoutHandler();
                  }
                  
                //console.log(data)
                this.setState({
                    dataExistencias : data.data
                })
            })
            .catch(err => console.log(err))
      //
      //ME TRAIGO LAS EXISTENCIAS DISPONIBLES
      fetch('http://www.alamoinventario.com:80/api/leerbotellasdisponiblessalida', requestOptions)
      .then(response => response.json())
      .then(data => {  
        console.log(data.data)            
          if(typeof data.err !== 'undefined' && data.err.message.length > 0){
            localStorage.clear();
            this.props.logoutHandler();
          }else{
              
          }   
          this.setState({
            dataBotellas : data.data.resultAuxB,
            dataTapas: data.data.resultTapas,
            dataEtiquetas: data.data.resultEtiquetas,
            dataOtros: data.data.resultOtros,
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
      }

      existenciasAlamoItem(item){
        this.props.existencia(item)
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
    
        fetch('http://www.alamoinventario.com:80/api/leersalidasalamo/' + e.target.value, requestOptions)
            .then(response => response.json())
            .then(data => {

                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                    localStorage.clear();
                    this.props.logoutHandler();
                  }
                  
                //console.log(data)
                this.setState({
                    dataExistencias : data.data
                })
            })
            .catch(err => console.log(err))
      }
    
      render(){
        return (
          <div>
            <div className='tituloDeExistencias'>
              <h3 className='tituloAlamo'>SALIDAS EXISTENCIAS - ALAMO</h3>
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
                        cantidadlimiteEtiquetas: 0
                    })
                    }}>Registrar Nueva Salida</Button>

            <br></br>
            <br></br>
            <br></br>

            <Table    
              bordered   
              borderless
              striped>
            <thead>
              <tr>
                <th>Fecha Registro Salida</th>
                <th>Tipo Botella</th>
                <th>Cantidad Botellas</th>
                <th>Tipo Tapa</th>
                <th>Cantidad Tapas</th>
                <th>Tipo Etiqueta</th>
                <th>Cantidad Etiquetas</th>

                <th>Tipo Otros</th>
                <th>Cantidad Otros</th>
              </tr>
            </thead>
            <tbody>
            {this.state.dataExistencias.map((item, index) => {
              return(
                <>                        
                <tr key={index}>
                  <td>{item.fechaRegistroSalida.split("T", 1)}</td>
                  <td>{item.salidaTipoBotellas}</td>
                  <td className='existenciaSalida'><strong>{Number(item.salidaNumeroBotellas).toLocaleString('us')}</strong>
                  {this.state.dataExistencias[index].InfoRegistroSalidaOrigenBotellas.map((item, index) => {
                      return(
                        <>
                          {item.numero_botellas_salida? (
                          <>
                          <td>Cantidad: {item.numero_botellas_salida}</td> <br></br>
                          <td>&nbsp;&nbsp;Origen Lote: {item.stock_lote_botellas}</td>
                          </>
                          ):(<td></td>)}
                          {/*item.stock_lote_botellas? (<td>&nbsp;&nbsp;Origen Lote: {item.stock_lote_botellas}</td>):(<td></td>)*/}                          
                          <br></br>
                        </>                      
                      )
                    })}
                  </td>
                  <td>{item.salidaTipoTapas}</td>
                  <td className='existenciaSalida'><strong>{Number(item.salidaNumeroTapas).toLocaleString('us')}</strong>
                  {this.state.dataExistencias[index].InfoRegistroSalidaOrigenTapas.map((item, index) => {
                      return(
                        <>
                          {item.numero_tapas_salida? (
                            <>
                            <td>Cantidad: {item.numero_tapas_salida}</td> <br></br>
                            <td>&nbsp;&nbsp;Origen Lote: {item.stock_lote_tapas}</td>
                            </>
                            ):(<td></td>)}
                          {/*item.stock_lote_tapas? (<td>&nbsp;&nbsp;Origen Lote: {item.stock_lote_tapas}</td>):(<td></td>)*/}
                          <br></br>
                        </>                      
                      )
                    })}
                  </td>
                  <td>{item.salidaTipoEtiquetas}</td>
                  <td className='existenciaSalida'><strong>{Number(item.salidaNumeroEtiquetas).toLocaleString('us')}</strong>
                  {this.state.dataExistencias[index].InfoRegistroSalidaOrigenEtiquetas.map((item, index) => {
                      return(
                        <>
                          {item.numero_etiquetas_salida? (
                          <>
                          <td>Cantidad: {item.numero_etiquetas_salida}</td> <br></br>
                          <td>&nbsp;&nbsp;Origen Lote: {item.stock_lote_etiquetas}</td>
                          </>
                          ):(<td></td>)}
                          {/*item.stock_lote_etiquetas? (<td>&nbsp;&nbsp;Origen Lote: {item.stock_lote_etiquetas}</td>):(<td></td>)*/}                          
                          <br></br>
                        </>                      
                      )
                    })}
                  </td>   

                  <td>{item.salidaTipoOtros}</td>
                  <td>{item.salidaNumeroOtros}</td>               
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
                  Responsable Salida de Existencia
                </option>  
                {this.state.dataSalida.map((item, index) => {
                  return(
                    <option>{item.nombre}</option>
                  )
                })} 
                              
              </Input>

              <Label>
                BOTELLAS
              </Label>

              <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={(e) => {
                    //console.log(e.target.value.split(" -", 1).pop())
                    //console.log(parseInt(e.target.value.split(": ").pop().replace(',','')))
                    this.setState({
                        tipoSalidaBotella: e.target.value.split(" -", 1).pop(),
                        cantidadlimiteBotella: parseInt(e.target.value.split(": ").pop().replace(',',''))
                    })
                }}>
                <option>
                  Seleccione tipo Existencia
                </option>                
                {this.state.dataBotellas.map((item, index) => {
                  return(
                    <>
                    <option>{item._id} - Cantidad Disponible: {Number(item.SumSiExistencia).toLocaleString('us')}</option>
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

            <Label>
                TAPAS
            </Label>

            <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={(e) => {
                    //console.log(e.target.value.split(" -", 1).pop())
                    //console.log(parseInt(e.target.value.split(": ").pop().replace(',','')))
                    this.setState({
                        tipoSalidaTapas: e.target.value.split(" -", 1).pop(),
                        cantidadlimiteTapas: parseInt(e.target.value.split(": ").pop().replace(',',''))
                    })
                }}>                
                <option>
                  Seleccione tipo Existencia
                </option>                
                {this.state.dataTapas.map((item, index) => {
                  return(
                    <option>{item._id} - Cantidad Disponible: {Number(item.tapas).toLocaleString('us')}</option>
                  )
                })}  
              </Input>
        
              <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Cantidad Existencias"
                onChange={(e) => {
                    if(e.target.value === ''){
                        document.getElementById('avisoSiDET').style.display = 'none'
                        document.getElementById('avisoNoDET').style.display = 'none'
                    }else{
                        if(Math.abs(e.target.value) > this.state.cantidadlimiteTapas){
                            document.getElementById('avisoNoDET').style.display = 'block'
                            document.getElementById('avisoSiDET').style.display = 'none'
                            this.setState({cantidadSalidaTapas: ''})
                        }else{
                            document.getElementById('avisoNoDET').style.display = 'none'
                            document.getElementById('avisoSiDET').style.display = 'block'
                            this.setState({cantidadSalidaTapas:  Math.abs(e.target.value)})
                        }
                    }
                    
                }}
                type="number"
              />

            <p className='avisoSiDispo' id='avisoSiDET'>Ok !</p>
            <p className='avisoNoDispo' id='avisoNoDET'>Existencias no disponibles, hay: {Number(this.state.cantidadlimiteTapas).toLocaleString('us')}</p>

            <Label>
                ETIQUETAS
            </Label>   

            <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={(e) => {
                    //console.log(e.target.value.split(" -", 1).pop())
                    //console.log(parseInt(e.target.value.split(": ").pop().replace(',','')))
                    this.setState({
                        tipoSalidaEtiquetas: e.target.value.split(" -", 1).pop(),
                        cantidadlimiteEtiquetas: parseInt(e.target.value.split(": ").pop().replace(',',''))
                    })
                }}>
                <option>
                  Seleccione tipo Existencia
                </option>                
                {this.state.dataEtiquetas.map((item, index) => {
                  return(
                    <option>{item._id} - Cantidad Disponible: {Number(item.etiquetas).toLocaleString('us')}</option>
                  )
                })}  
              </Input>
        
              <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Cantidad Existencias"
                onChange={(e) => {
                    if(e.target.value === ''){
                        document.getElementById('avisoSiDEE').style.display = 'none'
                        document.getElementById('avisoNoDEE').style.display = 'none'
                    }else{
                        if(Math.abs(e.target.value) > this.state.cantidadlimiteEtiquetas){
                            document.getElementById('avisoNoDEE').style.display = 'block'
                            document.getElementById('avisoSiDEE').style.display = 'none'
                            this.setState({cantidadSalidaEtiquetas: ''})
                        }else{
                            document.getElementById('avisoNoDEE').style.display = 'none'
                            document.getElementById('avisoSiDEE').style.display = 'block'
                            this.setState({cantidadSalidaEtiquetas:  Math.abs(e.target.value)})
                        }
                    }
                    
                }}
                type="number"
              />

            <p className='avisoSiDispo' id='avisoSiDEE'>Ok !</p>
            <p className='avisoNoDispo' id='avisoNoDEE'>Existencias no disponibles, hay: {Number(this.state.cantidadlimiteEtiquetas).toLocaleString('us')}</p>

            <Label>
                OTROS - PLASTICOS Y CARTONES
            </Label> 


            
            <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={(e) => {

                    //console.log(e.target.value.split(" - C", 1).pop())
                    //console.log(parseInt(e.target.value.split(": ").pop().replace(',','')))
                    
                    this.setState({
                        tipoSalidaPyC: e.target.value.split(" - C", 1).pop(),
                        cantidadlimitePyC: parseInt(e.target.value.split(": ").pop().replace(',',''))
                    })
                }}>
                <option>
                  Seleccione tipo Existencia
                </option>                
                {this.state.dataOtros.map((item, index) => {
                  return(
                    <option>{item._id} - Cantidad Disponible: {Number(item.otros).toLocaleString('us')}</option>
                  )
                })}  
              </Input>            

              <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Cantidad Existencias"
                onChange={(e) => {
                    if(e.target.value === ''){
                        document.getElementById('avisoSiPyC').style.display = 'none'
                        document.getElementById('avisoNoPyC').style.display = 'none'
                    }else{
                        if(Math.abs(e.target.value) > this.state.cantidadlimitePyC){
                            document.getElementById('avisoNoPyC').style.display = 'block'
                            document.getElementById('avisoSiPyC').style.display = 'none'
                            this.setState({cantidadSalidaOtros: ''})
                        }else{
                            document.getElementById('avisoNoPyC').style.display = 'none'
                            document.getElementById('avisoSiPyC').style.display = 'block'
                            this.setState({cantidadSalidaOtros:  Math.abs(e.target.value)})
                        }
                    }
                    
                }}
                type="number"
              />

            <p className='avisoSiDispo' id='avisoSiPyC'>Ok !</p>
            <p className='avisoNoDispo' id='avisoNoPyC'>Existencias no disponibles, hay: {Number(this.state.cantidadlimitePyC).toLocaleString('us')}</p>
              
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.registrarExistenciaAlamo}>
                  Registrar salida existencias
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

export default AlamoSalidas;