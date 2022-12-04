import '../App.css';
import {React, Component} from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table, Nav, NavLink, NavItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import imgLogo from '../imagenes/alamologo.png'


class Alamoexistencias extends Component {
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
          token: '',
          responsableRecepcionExistencia: '',
          dataBotellas: [],
          dataRecepcion: [],
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
      insertExistenciaAlamo = () => {
        if(this.state.responsableRecepcionExistencia === '' || this.state.tipoExistencia === '' || this.state.ExistenciasCantidad === '' || this.state.ExistenciasLote === '' || this.state.ExistenciasFecha === ''){
          alert('Ingresar todos los CAMPOS !')
        }else{
          //
          const requestOptions ={
            method: 'POST',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),
            body: JSON.stringify({
                  ResponsableRecepcionExistencia: this.state.responsableRecepcionExistencia,
                  PresentacionInsumo: this.state.tipoExistencia, 
                  //ProveedorInsumo: this.state.tipoExistenciaProveedor, 
                  CostoExistencia: this.state.ExistenciaCosto,
                  ExistenciasStock: this.state.ExistenciasCantidad, 
                  ExistenciasLote: this.state.ExistenciasLote, 
                  ExistenciasRecepcion: this.state.ExistenciasFecha})
          }
      
          fetch('http://www.alamoinventario.com:80/api/insertarexistenciasalamo', requestOptions)
              .then(response => response.json())
              .then(data => {
                console.log(data)

                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }

                if(data.dato === 'Lote ya registrado'){
                  //alert('Existencia con LOTE ya ingresado, Revisar !!')
                  this.setState({
                    loteRepetido: 'block'
                  })
                }else{
                  alert('Existencia ingresada !!')
                  this.setState({
                    modalAgregarExistencia: !this.state.modalAgregarExistencia
                  })
                }    

                //Actualizamos DATA
                const requestOptions ={
                  method: 'GET',
                  headers : new Headers({
                    'Authorization': localStorage.getItem( 'token' ),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-type':'application/json'
                  }),    
                }
            
                fetch('http://www.alamoinventario.com:80/api/leerexistenciasalamo', requestOptions)
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
                    .catch(err => console.log(err))
              })
              .catch(err => console.log(err))
        }
      }
    
      componentDidMount(){
      //Traemos el token
      this.setState({
        token: localStorage.getItem( 'token' ) 
      })
      //Fetch para enviar informacion al backend:
        const requestOptions ={
          method: 'GET',
          headers : new Headers({
            'Authorization': localStorage.getItem( 'token' ),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-type':'application/json'
          }),

        }
    
        fetch('http://www.alamoinventario.com:80/api/leerexistenciasalamo', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
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
      //**********
      //ME TRAIGO LAS EXISTENCIAS DISPONIBLES
        fetch('http://www.alamoinventario.com:80/api/leerbotellas', requestOptions)
            .then(response => response.json())
            .then(data => {              
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }else{
                    
                }   
                this.setState({
                  dataBotellas : data.data
              })   
                        
            })
            .catch(err => {                 
              console.log(err)
          })
        //LOS QUE RECEPCION
        fetch('http://www.alamoinventario.com:80/api/leerpersonalrecepcion', requestOptions)
          .then(response => response.json())
          .then(data => {              
              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                localStorage.clear();
                this.props.logoutHandler();
              }else{
                  
              }   
              this.setState({
                dataRecepcion : data.data
            })   
                      
          })
          .catch(err => {                 
              console.log(err)
          }) 
      }

      existenciasAlamoItem(item){
        this.props.existencia(item)
      }

      onChangeFiltroKeyWord = (e) => {
        //Fetch para enviar informacion al backend:
        if(e.target.value === ''){
          //Fetch para enviar informacion al backend:
        const requestOptions ={
          method: 'GET',
          headers : new Headers({
            'Authorization': localStorage.getItem( 'token' ),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-type':'application/json'
          }),

        }
    
        fetch('http://www.alamoinventario.com:80/api/leerexistenciasalamo', requestOptions)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
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
        }else{
          const requestOptions ={
            method: 'GET',
            headers : new Headers({
                'Authorization': localStorage.getItem( 'token' ),
                'Content-type':'application/json'
              }),    
          }      
          fetch('http://www.alamoinventario.com:80/api/leerexistenciasfiltro/' + e.target.value.toUpperCase(), requestOptions)
              .then(response => response.json())
              .then(data => {
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                    localStorage.clear();
                    this.props.logoutHandler();
                  }
  
                this.setState({
                    dataExistencias: data.data
                })
              })
              .catch(err => console.log(err))
        }
      }
    
      render(){
        return (
          <div>
            <div className='tituloDeExistencias'>
              <h3>INVENTARIO BOTELLAS</h3>
            </div>
            {/*<h1 className='tituloAlamo'>Alamo - Inventario E.</h1>*/}   
            {/*   
            <nav class="navbar">
                <div class="navbar-container container">
                    <input type="checkbox" name="" id="" />
                    <div class="hamburger-lines">
                        <span class="line line1"></span>
                        <span class="line line2"></span>
                        <span class="line line3"></span>
                    </div>
                    <ul class="menu-items">
                        <li><a href="#" onClick={() => {this.props.alamoInicio()}}>Inventario Alamo</a></li>
                        <li><a href="#" onClick={() => {this.props.alamoDash()}}>Tablero de Datos</a></li>
                        <li><a href="#" onClick={() => {this.props.alamoconfig()}}>Configuracion</a></li>
                        <li><a href="#" onClick={() => {
                                                    if(window.confirm('Seguro quiere salir ?')){
                                                      localStorage.clear();
                                                      this.props.logoutHandler();
                                                    }else{

                                                    }
                                                  }}>Salir</a></li>
                    </ul>
                    <img class="logo" src={imgLogo}></img>
                </div>
            </nav>
          */}

          <Button className='botonAgregarExistencia' color="success" onClick={() => {this.setState({modalAgregarExistencia: !this.state.modalAgregarExistencia})}}>Ingresar Existencia</Button>

           {/*
            <Button className='botonAgregarExistencia' color="success" onClick={() => {this.setState({modalAgregarExistencia: !this.state.modalAgregarExistencia})}}>Ingresar Existencia</Button>
            <Button className='botonAgregarExistencia' color="warning" onClick={() => {this.props.alamoDash()}}>Dashboard</Button>           
  
            <Button className='botonAgregarExistenciaSalir' color="danger" onClick={() => {
              if(window.confirm('Seguro quiere salir ?')){
                localStorage.clear();
                this.props.logoutHandler();
              }else{

              }
            }}>Salir</Button>

            <Button className='botonAgregarExistenciaSalir' color="info">Config</Button>

          */}

          <br></br>          
          <br></br> 
          <br></br> 

            <div className='filtroKeyWord'>  
            <p className='resultadoRevision'><strong>Filtro por palabra clave:</strong></p>          
            <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Filtro Key Word"
                onChange={this.onChangeFiltroKeyWord}
              />
            </div>

            <Table    
              bordered   
              borderless
              striped
              size="sm">
            <tbody>
              <tr>
                  <th>Item Existencia</th>
                  <th>Existencias Disponibles</th>
                  <th>Existencia Aprobadas</th>
                  <th>Existencia en Revision</th>
                  <th>Existencia no Aprobadas</th>
              </tr>
            {this.state.dataExistencias.map((item, index) => {
              return(
                <>                        
                <tr key={index}>
                  <td className='tituloExistencia' onClick={() => this.existenciasAlamoItem(item._id)}>{item._id}</td>
                  <td>{Number(item.SumSiExistencia).toLocaleString('us')}</td>
                  <td><strong style={{color: 'green'}}>{Number(item.SumSiExistencia).toLocaleString('us')}</strong></td>
                  <td><strong style={{color: 'blue'}}>{Number(item.SumRevExistencia).toLocaleString('us')}</strong></td>
                  <td><strong style={{color: 'red'}}>{Number(item.SumNoExistencia).toLocaleString('us')}</strong></td>
                </tr>
                </>
                
              )
            })}   
            </tbody>
            </Table>
            <Modal isOpen={this.state.modalAgregarExistencia}>
              <ModalHeader>Agregar Existencias</ModalHeader>
              <ModalBody>
              <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={this.onChangeExistenciaAlamoResponsable}>
                <option>
                  Responsable Recepcion Existencia
                </option>  
                {this.state.dataRecepcion.map((item, index) => {
                  return(
                    <option>{item.nombre}</option>
                  )
                })} 
                              
              </Input>


              <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                onChange={this.onChangeExistenciaAlamo}>
                <option>
                  Seleccione tipo Existencia
                </option> 
                {this.state.dataBotellas.map((item, index) => {
                  return(
                    <option>{item.botella}</option>
                  )
                })}                                 
              </Input>
        
              <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Cantidad Existencias"
                onChange={this.onChangeExistenciaAlamoCantidad}
                type="number"
              />

              <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Costo Existencias"
                onChange={this.onChangeExistenciaAlamoCosto}
                type="number"
              />
    
              <Input
                bsSize="sm"
                className="mb-3"
                placeholder="Lote Existencias"
                onChange={this.onChangeExistenciaAlamoLote}
              />
              <p style={{display : this.state.loteRepetido}} className='loteRegistrado'>Lote ya se encuentra registrado...</p>
    
    
              <Label for="exampleDatetime">
                Fecha llegada Existencias
              </Label>
              <Input
                bsSize="sm"
                id="exampleDatetime"
                className="mb-3"
                name="date"
                placeholder="date placeholder"
                type="date"
                onChange={this.onChangeExistenciaAlamoFecha}
              />
              
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.insertExistenciaAlamo}>
                  Agregar Existencia
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

export default Alamoexistencias;