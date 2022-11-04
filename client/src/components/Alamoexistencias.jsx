import '../App.css';
import {React, Component} from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table, Nav, NavLink, NavItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


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
          token: ''
        }
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
        if(this.state.tipoExistencia === '' || this.state.ExistenciasCantidad === '' || this.state.ExistenciasLote === '' || this.state.ExistenciasFecha === ''){
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
                  PresentacionInsumo: this.state.tipoExistencia, 
                  //ProveedorInsumo: this.state.tipoExistenciaProveedor, 
                  CostoExistencia: this.state.ExistenciaCosto,
                  ExistenciasStock: this.state.ExistenciasCantidad, 
                  ExistenciasLote: this.state.ExistenciasLote, 
                  ExistenciasRecepcion: this.state.ExistenciasFecha})
          }
      
          fetch('http://localhost:3001/api/insertarexistenciasalamo', requestOptions)
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
            
                fetch('http://localhost:3001/api/leerexistenciasalamo', requestOptions)
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
    
        fetch('http://localhost:3001/api/leerexistenciasalamo', requestOptions)
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
      //
      }

      existenciasAlamoItem(item){
        this.props.existencia(item)
      }
    
      render(){
        return (
          <div>
            <h1 className='tituloAlamo'>Alamo - Inventario E.</h1>   

            <br></br>

            <Button className='botonAgregarExistencia' color="success" onClick={() => {this.setState({modalAgregarExistencia: !this.state.modalAgregarExistencia})}}>Ingresar Existencia</Button>
            <Button className='botonAgregarExistencia' color="warning" onClick={() => {this.props.alamoDash()}}>Dashboard</Button>
            <Button className='botonAgregarExistenciaSalir' color="danger" onClick={() => {
              if(window.confirm('Seguro quiere salir ?')){
                localStorage.clear();
                this.props.logoutHandler();
              }else{

              }
            }}>Salir</Button>

            <br></br>
            <br></br>

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
                onChange={this.onChangeExistenciaAlamo}>
                <option>
                  Seleccione tipo Existencia
                </option>                
                <option>350 ML - ENVASE</option>
                <option>500 ML - ALAMO</option>
                <option>500 ML - GOTA</option>
                <option>600 ML - ALAMO</option>
                <option>600 ML - GOTA</option>
                <option>600 ML - CLARITY</option>
                <option>600 ML - GLACIARES</option>
                <option>600 ML - CILINDRO</option>
                <option>1 LT - ENVASE</option>
                <option>1.1 LT - ENVASE</option>
                <option>1.1 LT - GLACIARES</option>
                <option>5 LT - MAS ASA OMI</option>
                <option>5 LT - MAS ASA TECPACK</option>
                <option>5 LT - MAS ASA CLARITY</option>
                <option>5 LT - PETCARIBE</option>
                <option>5 LT - OCCIDENTAL PLASTICOS</option>
                <option>18.9 LT - BOTELLONES</option>
                <option>1.5	LT - CLARITY</option>
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