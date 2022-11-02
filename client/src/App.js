import './App.css';
import {React, Component} from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//
import AlamoExistencias from './components/Alamoexistencias';
import Existencias from './components/Existencias';
import AlamoDashboard from './components/AlamoDashboard';

class App extends Component {
  constructor(props){
    super(props);    
    this.state={
      opcion: 'INICIO',
      existenciaItem: 'Hola'
    }
  }

  existenciaAlamoRevision(item){
    this.setState({
      opcion: 'EXISTENCIAS',
      existenciaItem: item
    })
  }

  handlealamoDashboard(){
    this.setState({
      opcion: 'DASHBOARD'
    })
  }
  
  render(){
    const opcionEstado = () => {
      switch(this.state.opcion){
        case 'INICIO':        return <AlamoExistencias existencia={this.existenciaAlamoRevision.bind(this)} alamoDash={this.handlealamoDashboard.bind(this)}/>      
        case 'EXISTENCIAS':   return <Existencias existenciaItemAlamo={this.state.existenciaItem} />
        case 'DASHBOARD':     return <AlamoDashboard existenciaItemAlamo={this.state.existenciaItem} />
      }
    }
    return (
      <div>{opcionEstado()}</div>
    );
  }
}

export default App;
