import './App.css';
import {React, Component} from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import imgLogo from './imagenes/alamologo.png'
//
import AlamoExistencias from './components/Alamoexistencias';
import Existencias from './components/Existencias';
import AlamoDashboard from './components/AlamoDashboard';
import AlamoLogIn from './components/Alamologin';
import AlamoInventarioUser from './components/inventario/AlamoInventario';
import AlamoExistenciasInventario from './components/inventario/AlamoExistenciasLote';
import AlamoInventarioCalidad from './components/calidad/AlamoInventarioCalidad';
import AlamoExistenciasCalidad from './components/calidad/AlamoExistenciasCalidad';
import AlamoConfiguracion from './components/AlamoConfig';

class App extends Component {
  constructor(props){
    super(props);    
    this.state={
      user: 'LOGIN',
      opcion: 'LOGIN',
      existenciaItem: 'Hola'
    }
  }

  existenciaAlamoRevision(item){
    this.setState({
      opcion: 'EXISTENCIAS',
      user: 'EXISTENCIAS',
      existenciaItem: item
    })
  }

  existenciaAlamoRevisionInventarios(item){
    this.setState({
      opcion: 'INVENTARIO_EXISTENCIAS',
      user: 'INVENTARIO',
      existenciaItem: item
    })
  }

  existenciaAlamoRevisionCalidad(item){
    this.setState({
      opcion: 'CALIDAD_EXISTENCIAS',
      user: 'CALIDAD',
      existenciaItem: item
    })
  }

  handlealamoDashboard(){
    this.setState({
      opcion: 'DASHBOARD',
      user: 'DASHBOARD',
    })
  }

  handleLogInAlamo(){
    this.setState({
      opcion: 'INICIO',
      user: 'INICIO',
    })
  }

  handleInventarioUsuario(){
    this.setState({
      opcion: 'INVENTARIO',
      user: 'INVENTARIO',
    })
  }

  handleCalidadUsuario(){
    this.setState({
      opcion: 'CALIDAD',
      user: 'CALIDAD',
    })
  }

  handleLogOut(){
    this.setState({
      opcion: 'LOGIN',
      user: 'LOGIN',
    })
  }

  handleAlamoConfig(){
    this.setState({
      opcion: 'OPCION',
      user: 'OPCION'
    })
  }

  handleInicioAlamo(){
    this.setState({
      opcion: 'INICIO',
      user: 'INICIO'
    })
  }
  
  componentDidMount(){
    const usertAuth = localStorage.getItem( 'usuario' )
    if(usertAuth === 'admin'){
      this.setState({
        user: 'ADMIN',
      })
      this.handleLogInAlamo()
    }else if(usertAuth === 'inventario'){
      this.setState({
        user: 'INVENTARIO'
      })
      this.handleInventarioUsuario()
    }else if(usertAuth === 'calidad'){
      this.setState({
        user: 'CALIDAD'
      })
      this.handleCalidadUsuario()
    }else{

    }

    ///*
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event){
        window.history.pushState(null, document.title,  window.location.href);
    });
  }

  render(){
    const opcionEstado = () => {
      switch(this.state.opcion){
        case 'LOGIN':                     return <AlamoLogIn logoutHandler={this.handleLogOut.bind(this)} loginHandler={this.handleLogInAlamo.bind(this)} inventarioHandler={this.handleInventarioUsuario.bind(this)} calidadHandler={this.handleCalidadUsuario.bind(this)}/>
        case 'INVENTARIO':                return <AlamoInventarioUser logoutHandler={this.handleLogOut.bind(this)} existencia={this.existenciaAlamoRevisionInventarios.bind(this)}/>
        case 'CALIDAD':                   return <AlamoInventarioCalidad logoutHandler={this.handleLogOut.bind(this)} existencia={this.existenciaAlamoRevisionCalidad.bind(this)} />
        case 'INVENTARIO_EXISTENCIAS':    return <AlamoExistenciasInventario logoutHandler={this.handleLogOut.bind(this)} existenciaItemAlamo={this.state.existenciaItem} />
        case 'CALIDAD_EXISTENCIAS':       return <AlamoExistenciasCalidad logoutHandler={this.handleLogOut.bind(this)} existenciaItemAlamo={this.state.existenciaItem} />
        case 'INICIO':                    return <AlamoExistencias logoutHandler={this.handleLogOut.bind(this)} existencia={this.existenciaAlamoRevision.bind(this)} alamoDash={this.handlealamoDashboard.bind(this)} alamoconfig={this.handleAlamoConfig.bind(this)} alamoInicio={this.handleInicioAlamo.bind(this)}/>      
        case 'EXISTENCIAS':               return <Existencias logoutHandler={this.handleLogOut.bind(this)} existenciaItemAlamo={this.state.existenciaItem} />
        case 'DASHBOARD':                 return <AlamoDashboard logoutHandler={this.handleLogOut.bind(this)} existenciaItemAlamo={this.state.existenciaItem} />
        case 'OPCION':                    return <AlamoConfiguracion />
      }
    }
    return (
      <div>       
        {(() => {
        if (this.state.user === 'LOGIN') {
          return (
            <div>{opcionEstado()}</div>
          )
        } else if (this.state.user === 'CALIDAD') {
            return(
            <>
            <nav className="navbar">
                <div className="navbar-container container">
                    <input type="checkbox" name="" id="" />
                    <div className="hamburger-lines">
                        <span className="line line1"></span>
                        <span className="line line2"></span>
                        <span className="line line3"></span>
                    </div>
                    <ul className="menu-items">
                        <li><a href="#" onClick={() => {this.handleInicioAlamo()}}>Inventario Alamo</a></li>
                        <li><a href="#" onClick={() => {
                                                    if(window.confirm('Seguro quiere salir ?')){
                                                      localStorage.clear();
                                                      this.handleLogOut();
                                                    }else{

                                                    }
                                                  }}>Salir</a></li>
                    </ul>
                    <img className="logo" src={imgLogo}></img>
                </div>
            </nav> 

          <div>{opcionEstado()}</div>
          </>
          )
        } else if(this.state.user === 'INVENTARIO'){
          return(
            <>
            <nav className="navbar">
                <div className="navbar-container container">
                    <input type="checkbox" name="" id="" />
                    <div className="hamburger-lines">
                        <span className="line line1"></span>
                        <span className="line line2"></span>
                        <span className="line line3"></span>
                    </div>
                    <ul className="menu-items">
                        <li><a href="#" onClick={() => {this.handleInicioAlamo()}}>Inventario Alamo</a></li>
                        <li><a href="#" onClick={() => {
                                                    if(window.confirm('Seguro quiere salir ?')){
                                                      localStorage.clear();
                                                      this.handleLogOut();
                                                    }else{

                                                    }
                                                  }}>Salir</a></li>
                    </ul>
                    <img className="logo" src={imgLogo}></img>
                </div>
            </nav> 

          <div>{opcionEstado()}</div>
          </>
          )
        } else {
          return (
            <>
            <nav className="navbar">
                <div className="navbar-container container">
                    <input type="checkbox" name="" id="" />
                    <div className="hamburger-lines">
                        <span className="line line1"></span>
                        <span className="line line2"></span>
                        <span className="line line3"></span>
                    </div>
                    <ul className="menu-items">
                        <li><a href="#" onClick={() => {this.handleInicioAlamo()}}>Inventario Alamo</a></li>
                        <li><a href="#" onClick={() => {this.handlealamoDashboard()}}>Tablero de Datos</a></li>
                        <li><a href="#" onClick={() => {this.handleAlamoConfig()}}>Configuracion</a></li>
                        <li><a href="#" onClick={() => {
                                                    if(window.confirm('Seguro quiere salir ?')){
                                                      localStorage.clear();
                                                      this.handleLogOut();
                                                    }else{

                                                    }
                                                  }}>Salir</a></li>
                    </ul>
                    <img className="logo" src={imgLogo}></img>
                </div>
            </nav> 

          <div>{opcionEstado()}</div>
          </>
          )
        }
      })()}
        
      </div>
    );
  }
}

export default App;
