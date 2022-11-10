import React, { Component } from 'react';
import { Chart as 
  ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title, } from 'chart.js';

import { Pie } from 'react-chartjs-2';

import { Bar } from 'react-chartjs-2';

import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,);

class AlamoDashboard extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataExistencias: [],
            fechaInicio: '1900-01-01',
            fechaFinal: '1900-01-01',
            itemFiltro: 'item',
            options : {              
              plugins: {
                legend: {
                  display: false,
                  position: 'bottom',
                },
                title: {
                  display: true,
                  text: 'Estado llegada existencias',
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
              },
              responsive: true,
            },
            label_barras: [],
            data_barras_aux_01: [],
            data_barras_aux_02: [],
            data_barras_aux_03: [],
            data_barras: [],
            dataBotellas: [],
        }
    }

    handlreFiltro = () => {

        const requestOptions ={
            method: 'GET',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),    
          }
      
          fetch('http://44.201.109.181:80/api/leerexistenciasalamofiltro/'+ this.state.itemFiltro + '/' + this.state.fechaInicio + '/' + this.state.fechaFinal, requestOptions)
              .then(response => response.json())
              .then(data => {
                console.log(data)
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }

                  this.setState({
                      dataExistencias : data.data[0],
                      label_barras: data.data[4],
                      data_barras_aux_01: data.data[1],
                      data_barras_aux_02: data.data[2],
                      data_barras_aux_03: data.data[3],
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
      
          fetch('http://44.201.109.181:80/api/leerexistenciasalamofiltro/'+ e.target.value, requestOptions)
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
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),    
          }
      
          fetch('http://44.201.109.181:80/api/leerexistenciasalamogeneral', requestOptions)
              .then(response => response.json())
              .then(data => {
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }

                  this.setState({
                      dataExistencias : data.data[0],
                      label_barras: data.data[4],
                      data_barras_aux_01: data.data[1],
                      data_barras_aux_02: data.data[2],
                      data_barras_aux_03: data.data[3],
                  })
                  
              })
              .catch(err => console.log(err))
        
        //ME TRAIGO LAS EXISTENCIAS DISPONIBLES
        fetch('http://44.201.109.181:80/api/leerbotellas', requestOptions)
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

    handleGraficaBarras = () => {
      let labels = this.state.label_barras

      const data = {
        labels,
        datasets: [
          {
            label: 'Botellas Aprobadas',
            data: this.state.data_barras_aux_01,
            backgroundColor: 'rgba(60, 179, 113, 1)',
          },
          {
            label: 'Botellas No Aprobadas',
            data: this.state.data_barras_aux_02,
            backgroundColor: 'rgba(255, 99, 132, 1)',
          },
          {
            label: 'Botellas En Revision',
            data: this.state.data_barras_aux_03,
            backgroundColor: 'rgba(255, 165, 0, 1)',
          },
        ],
      };

      let wh = 100;
      let ht = 30;

      if(window.matchMedia("(min-width: 768px)").matches){

      }else{
        wh = 100;
        ht = 100;
      }

      return(<Bar width={wh}
        height={ht} options={this.state.options} data={data} />)
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
                    {this.state.dataBotellas.map((item, index) => {
                      return(
                        <option>{item.botella}</option>
                      )
                    })}  
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
                 
            <div>
              {this.handleGraficaBarras()}
            </div>      
            </div>
        );
    }
}

export default AlamoDashboard;