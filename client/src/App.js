import './App.css';
import {React, Component} from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//
import AlamoExistencias from './components/Alamoexistencias';
import Existencias from './components/Existencias';
import AlamoDashboard from './components/AlamoDashboard';
import AlamoLogIn from './components/Alamologin';
import AlamoInventarioUser from './components/inventario/AlamoInventario';
import AlamoExistenciasInventario from './components/inventario/AlamoExistenciasLote';
import AlamoInventarioCalidad from './components/calidad/AlamoInventarioCalidad';
import AlamoExistenciasCalidad from './components/calidad/AlamoExistenciasCalidad';

class App extends Component {
  constructor(props){
    super(props);    
    this.state={
      opcion: 'LOGIN',
      existenciaItem: 'Hola'
    }
  }

  existenciaAlamoRevision(item){
    this.setState({
      opcion: 'EXISTENCIAS',
      existenciaItem: item
    })
  }

  existenciaAlamoRevisionInventarios(item){
    this.setState({
      opcion: 'INVENTARIO_EXISTENCIAS',
      existenciaItem: item
    })
  }

  existenciaAlamoRevisionCalidad(item){
    this.setState({
      opcion: 'CALIDAD_EXISTENCIAS',
      existenciaItem: item
    })
  }

  handlealamoDashboard(){
    this.setState({
      opcion: 'DASHBOARD'
    })
  }

  handleLogInAlamo(){
    this.setState({
      opcion: 'INICIO'
    })
  }

  handleInventarioUsuario(){
    this.setState({
      opcion: 'INVENTARIO'
    })
  }

  handleCalidadUsuario(){
    this.setState({
      opcion: 'CALIDAD'
    })
  }

  handleLogOut(){
    this.setState({
      opcion: 'LOGIN'
    })
  }
  
  componentDidMount(){
    const usertAuth = localStorage.getItem( 'usuario' )
    if(usertAuth === 'admin'){
      this.handleLogInAlamo()
    }else if(usertAuth === 'inventario'){
      this.handleInventarioUsuario()
    }else if(usertAuth === 'calidad'){
      this.handleCalidadUsuario()
    }else{

    }
  }

  render(){
    const opcionEstado = () => {
      switch(this.state.opcion){
        case 'LOGIN':                     return <AlamoLogIn logoutHandler={this.handleLogOut.bind(this)} loginHandler={this.handleLogInAlamo.bind(this)} inventarioHandler={this.handleInventarioUsuario.bind(this)} calidadHandler={this.handleCalidadUsuario.bind(this)}/>
        case 'INVENTARIO':                return <AlamoInventarioUser logoutHandler={this.handleLogOut.bind(this)} existencia={this.existenciaAlamoRevisionInventarios.bind(this)}/>
        case 'CALIDAD':                   return <AlamoInventarioCalidad logoutHandler={this.handleLogOut.bind(this)} existencia={this.existenciaAlamoRevisionCalidad.bind(this)} />
        case 'INVENTARIO_EXISTENCIAS':    return <AlamoExistenciasInventario logoutHandler={this.handleLogOut.bind(this)} existenciaItemAlamo={this.state.existenciaItem} />
        case 'CALIDAD_EXISTENCIAS':       return <AlamoExistenciasCalidad logoutHandler={this.handleLogOut.bind(this)} existenciaItemAlamo={this.state.existenciaItem} />
        case 'INICIO':                    return <AlamoExistencias logoutHandler={this.handleLogOut.bind(this)} existencia={this.existenciaAlamoRevision.bind(this)} alamoDash={this.handlealamoDashboard.bind(this)}/>      
        case 'EXISTENCIAS':               return <Existencias logoutHandler={this.handleLogOut.bind(this)} existenciaItemAlamo={this.state.existenciaItem} />
        case 'DASHBOARD':                 return <AlamoDashboard logoutHandler={this.handleLogOut.bind(this)} existenciaItemAlamo={this.state.existenciaItem} />
      }
    }
    return (
      <div>{opcionEstado()}</div>
    );
  }
}

export default App;
