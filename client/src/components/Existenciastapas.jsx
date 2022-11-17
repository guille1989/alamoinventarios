import React, { Component } from 'react';
import {FormGroup, Toast, ToastHeader,ToastBody, Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Webcam from "react-webcam";

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class Existenciastapas extends Component {
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
          fetch('http://www.alamoinventario.com:80/api/leerexistenciasitemalamotapas/' + this.props.existenciaItemAlamo, requestOptions)
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
                    </tr>
                    {this.state.data.map((item, index) => {
                        return(
                            <>                            
                                <tr key={index}>
                                    <td>{item.PresentacionInsumo}</td>
                                    <td>{item.ExistenciasLote}</td>
                                    <td>{item.ExistenciasRecepcion.split("T", 1)}</td>
                                    <td>{Number(item.ExistenciasStock).toLocaleString('us')}</td>                                                                                                    
                                </tr>                        
                            </>
                        )                  
                    })}
                  </tbody>  
                  </Table>
            </div>            
            </>
        );
    }
}

export default Existenciastapas;