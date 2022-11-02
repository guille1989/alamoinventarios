import React, { Component } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(ArcElement, Tooltip, Legend);

class AlamoDashboard extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataExistencias: [],
            fechaInicio: '1900-01-01',
            fechaFinal: '1900-01-01',
            itemFiltro: 'item'

        }
    }

    handlreFiltro = () => {
        console.log(this.state.itemFiltro)
        console.log(this.state.fechaInicio)
        console.log(this.state.fechaFinal)

        const requestOptions ={
            method: 'GET',
            headers : {'Content-type':'application/json'}    
          }
      
          fetch('http://44.202.85.162:80/api/leerexistenciasalamofiltro/'+ this.state.itemFiltro + '/' + this.state.fechaInicio + '/' + this.state.fechaFinal, requestOptions)
              .then(response => response.json())
              .then(data => {
                  this.setState({
                    dataExistencias : data.data
                })
              })
              .catch(err => console.log(err))
    }
    
    //Funciones del formulario para agregar existencias
    onChangeFiltroExistencias = (e) => {
        this.setState({
            itemFiltro: e.target.value
        })
        /*
        const requestOptions ={
            method: 'GET',
            headers : {'Content-type':'application/json'}    
          }
      
          fetch('http://44.202.85.162:80/api/leerexistenciasalamofiltro/'+ e.target.value, requestOptions)
              .then(response => response.json())
              .then(data => {
                  console.log(data)
                  this.setState({
                    dataExistencias : data.data
                })
              })
              .catch(err => console.log(err))
        */
    }

    onChangeFechaInicio = (e) => {
        //console.log('Fecha: ' + e.target.value)f
        this.setState({
          fechaInicio: e.target.value
        })
      }

      onChangeFechaFinal = (e) => {
        //console.log('Fecha: ' + e.target.value)f
        this.setState({
          fechaFinal: e.target.value
        })
      }

    
    componentDidMount(){
        //Fetch para enviar informacion al backend:
          const requestOptions ={
            method: 'GET',
            headers : {'Content-type':'application/json'}    
          }
      
          fetch('http://44.202.85.162:80/api/leerexistenciasalamogeneral', requestOptions)
              .then(response => response.json())
              .then(data => {
                  this.setState({
                      dataExistencias : data.data
                  })
                  console.log(data.data)
              })
              .catch(err => console.log(err))
        //
        }
    
    pieChartBotellas(){  
        this.state.dataExistencias.map((item, index) => {
            console.log(item._id)
            return(
            <>
                <p>{item._id}</p>
            </>)   
        })  
    }

    render() {
        return (
            <div>
                <h1 className='tituloAlamo'>Alamo - Inventario E. - Dashboard</h1> 
                <br></br>  
                <div className='cuadroFiltroBotellas'>
                <div style={{width:'25%'}}>
                <Input
                    id="exampleSelect"
                    name="select"
                    type="select"
                    onChange={this.onChangeFiltroExistencias}
                >
                    <option>
                    Seleccione tipo Existencia
                    </option>          
                    <option>TODAS</option>      
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
                </div> 
                <div style={{width:'15%'}}> 
                <Input
                    id="exampleDate"
                    name="date"
                    type="date"
                    onChange={this.onChangeFechaInicio}
                    />
                </div>
                <div style={{width:'15%'}}> 
                <Input
                    id="exampleDate"
                    name="date"
                    type="date"
                    onChange={this.onChangeFechaFinal}
                    /> 
                </div>  
                <Button color="success" onClick={this.handlreFiltro}>Buscar</Button>           
                </div>
                <h3 className='tituloPieBotellas'>Estado recepcion existencias - Alamo</h3>
                {this.state.dataExistencias.map((item, index) => {
                    let dataAux = []
                    dataAux = [...dataAux, item.SumNoExistencia, item.SumSiExistencia, item.SumRevExistencia]            
                    const data = {
                        labels: ['B. No A.', 'B. A.', 'B. R.'],
                        datasets: [
                          {
                            width: 200,
                            height: 200,
                            label: '# of Votes',
                            data: dataAux,
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',
                              'rgba(147, 250, 165, 0.2)',
                              'rgba(255, 206, 86, 0.2)',
                            ],
                            borderColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(147, 250, 165, 1)',
                              'rgba(255, 206, 86, 1)',
                            ],
                            borderWidth: 2,
                          },
                        ],
                      }

                    return(                        
                            <div className='pieGraficasenColumna'> 
                                <div className='pieGraficaAlamoBotellas'>
                                    <h4>{item._id}</h4>
                                    <Pie data={data} width={600} height={250} />
                                </div>
                            </div>
                                                
                    )
                })}                
            </div>
        );
    }
}

export default AlamoDashboard;