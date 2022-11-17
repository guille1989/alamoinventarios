import '../App.css';
import {React, Component} from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table, Nav, NavLink, NavItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import imgLogo from '../imagenes/alamologo.png'

class Alamoexistenciasetiquetas extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataExistencias: [],
            modalAgregarExistencia: false,
            dataRecepcion: [],
            dataTapas: [],
            responsableRecepcionExistencia: '',
            etiquetas: '',
            etiquetas_cantidad: '',
            etiquetas_costo: '',
            etiquetas_lote: '',
            etiquetas_fecha_recepcion: '',
            loteRepetido: 'none',
            dataEtiquetas: []
        }
    }

    onChangeExistenciaAlamoResponsable = (e) => {
        this.setState({
          responsableRecepcionExistencia: e.target.value
        })
      }

    onChangeExistenciaAlamo = (e) => {
        this.setState({
            etiquetas: e.target.value
        })
    }

    onChangeExistenciaAlamoCantidad = (e) => {
        this.setState({
            etiquetas_cantidad: e.target.value
        })
    }

    onChangeExistenciaAlamoCosto = (e) => {
        this.setState({
            etiquetas_costo: e.target.value
        })
    }

    onChangeExistenciaAlamoLote = (e) => {
        this.setState({
            etiquetas_lote: e.target.value
        })
    }

    onChangeExistenciaAlamoFecha = (e) => {
        this.setState({
            etiquetas_fecha_recepcion: e.target.value
        })
    }

    componentDidMount(){
        //Fetch para enviar informacion al backend:
        const requestOptions ={
            method: 'GET',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-type':'application/json'
            }),
  
          }
        //Traemos existencias
        fetch('http://www.alamoinventario.com:80/api/leeretiquetasalamogeneral', requestOptions)
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
            .catch(err => console.log(err))

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

          //ME TRAIGO LAS EXISTENCIAS DISPONIBLES
        fetch('http://www.alamoinventario.com:80/api/leeretiquetasalamo', requestOptions)
            .then(response => response.json())
            .then(data => {            
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                localStorage.clear();
                this.props.logoutHandler();
                }else{
                    
                }   
                this.setState({
                    dataEtiquetas : data.data
            })   
                        
            })
            .catch(err => {                 
            console.log(err)
        })

    }

    //Agregar nueva existencia
    insertExistenciaAlamo = () => {
        if(this.state.responsableRecepcionExistencia === '' || this.state.etiquetas === '' || this.state.etiquetas_cantidad === '' || this.state.etiquetas_lote === '' || this.state.etiquetas_fecha_recepcion === '' || this.state.etiquetas_costo === ''){
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
                  etiquetas: this.state.etiquetas, 
                  //ProveedorInsumo: this.state.tipoExistenciaProveedor, 
                  etiquetas_costo: this.state.etiquetas_costo,
                  etiquetas_cantidad: this.state.etiquetas_cantidad, 
                  etiquetas_lote: this.state.etiquetas_lote, 
                  etiquetas_fecha_recepcion: this.state.etiquetas_fecha_recepcion})
          }
      
          fetch('http://www.alamoinventario.com:80/api/leeretiquetasalamogeneral', requestOptions)
              .then(response => response.json())
              .then(data => {

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
            
                fetch('http://www.alamoinventario.com:80/api/leeretiquetasalamogeneral', requestOptions)
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
    
        fetch('http://www.alamoinventario.com:80/api/leeretiquetasalamogeneral', requestOptions)
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
          fetch('http://www.alamoinventario.com:80/api/leerexistenciasetiquetasfiltro/' + e.target.value.toUpperCase(), requestOptions)
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
          
    render() {
        return (
            <div>
                <h3>INVENTARIO ETIQUETAS</h3>
                <Button className='botonAgregarExistencia' color="success" onClick={() => {this.setState({modalAgregarExistencia: !this.state.modalAgregarExistencia})}}>Ingresar Existencia</Button>
            
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
                        </tr>
                        {this.state.dataExistencias.map((item, index) => {
                        return(
                            <>                        
                            <tr key={index}>
                            <td className='tituloExistencia' onClick={() => this.existenciasAlamoItem(item._id)}>{item._id}</td>
                            <td><strong style={{color: 'green'}}>{Number(item.etiquetas ).toLocaleString('us')}</strong></td>
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
                            {this.state.dataEtiquetas.map((item, index) => {
                            return(
                                <option>{item.etiqueta}</option>
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
}

export default Alamoexistenciasetiquetas;