import React, { Component } from 'react';
import { Card, CardSubtitle, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import logoAlamo from '../imagenes/alamologo.png'

class Alamologin extends Component {
    constructor(props) {
        super(props);
        this.state={
            user: '',
            password: ''
        }
    }
    

    handleUser = (e) => {
        this.setState({
            user:e.target.value
        })
    }

    handleContrasenia = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    handleLogin = () => {
        //
        const requestOptions ={
            method: 'POST',
            headers : {'Content-type':'application/json'},
            body: JSON.stringify({user: this.state.user, password: this.state.password})    
          }      
          fetch('http://www.alamoinventario.com:80/api/autenticacionusuario', requestOptions)
              .then(response => response.json())
              .then(data => {
                    if(data.msj==='usuario y/o contraseña incorrectos.'){
                        
                        document.getElementById('avisoFA').style.display = 'block'
                    }else{
                        if(data.user === 'admin'){
                            this.props.loginHandler()
                        }else if(data.user === 'inventario'){
                            this.props.inventarioHandler()
                        }else if(data.user === 'calidad'){
                            this.props.calidadHandler()
                        }else if(data.user === 'salidas'){
                            this.props.salidasHandler()
                        }else if(data.user === 'contabilidad'){
                            this.props.contabilidadHandler()
                        }
                        localStorage.setItem( 'usuario', data.user );
                        localStorage.setItem( 'token', data.token );
                    }
              })
              .catch(err => console.log(err))
    }

    render() {
        return (
            <div className='loginCentro'>
                <Card
                    style={{
                        width: '25rem'
                    }}
                    >
                    <img
                        className='imgLogo'
                        alt="Sample"
                        src={logoAlamo}
                    />
                    <CardBody>
                        <CardTitle tag="h5">
                        </CardTitle>
                        <CardText>
                            <Input
                                bsSize="sm"
                                className="mb-3"
                                type="select"
                                onChange={this.handleUser}
                            >
                                <option>
                                Seleccionar usuario
                                </option>
                                <option>
                                admin
                                </option>
                                <option>
                                inventario
                                </option>
                                <option>
                                calidad
                                </option>
                                <option>
                                salidas
                                </option>
                                <option>
                                contabilidad
                                </option>
                            </Input>
                            <Input 
                                bsSize="sm"
                                placeholder='Contraseña'
                                onChange={this.handleContrasenia}
                                type="password"/>
                        </CardText>
                        <Button 
                            color='success'
                            onClick={this.handleLogin}>
                            INGRESAR
                        </Button>
                        <p className='avisoFalloAutenticacion' id='avisoFA'>Fallo en autenticacion de usuario !!!!</p>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Alamologin;