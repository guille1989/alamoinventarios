import React, { Component } from 'react';

import {LineSeries, Highlight,  AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, Inject, AccumulationLegend, PieSeries, AccumulationTooltip, ColumnSeries, SeriesCollectionDirective, SeriesDirective, AccumulationDataLabel, ChartComponent, Legend, Category, Tooltip, DataLabel, SplineAreaSeries, DateTime } from "@syncfusion/ej2-react-charts";

import { DashboardLayoutComponent, PanelsDirective, PanelDirective } from "@syncfusion/ej2-react-layouts";

import { Browser } from '@syncfusion/ej2-base';

import {Container, Row, Col, Input} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import "../dynamic.css"; 

import "../App.css";

import {isMobile, BrowserView, MobileView} from 'react-device-detect';

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
                  position: 'top',
                },
                title: {
                  display: false,
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
            dataBotellasSi: [],
            dataBotellasNo: [],
            dataBotellasRev: [],
            dataporRev: [],
            dataReciboMes: [],
            dataReciboMesItem: [],
            xsSet: "2",
            setYinsumesMesCosto: 0,
            setYrevbno: 0,
            exAux: 'Seleccione Existencia',
            anioAux: 'Seleccione Año',
        }
    }  
  
    componentDidMount(){
          if(isMobile){
            this.setState({
              xsSet: '1'
            })
          }else{
            this.setState({
              xsSet: '2'
            })
          }

          const requestOptions ={
            method: 'GET',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),    
          }
      
          fetch('http://www.alamoinventario.com:80/api/leerexistenciasalamogeneral/'+ this.state.exAux +`/${this.state.anioAux}`, requestOptions)
              .then(response => response.json())
              .then(data => {      
                console.log(data)  
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){                  
                  localStorage.clear();
                  this.props.logoutHandler();
                }

                let dataAux = [];
                
                data.data[0].map((item, index) => {
                  if(item.SumSiExistencia === 0){
                                        
                  }else{
                    dataAux.push(item)
                  }   
                })

                  this.setState({
                      dataExistencias : dataAux,
                      label_barras: data.data[4],
                      dataBotellasSi: data.data[5],
                      dataBotellasNo: data.data[6],
                      dataBotellasRev: data.data[7],
                      setYrevbno: data.data[8],
                  })
                
              })
              .catch(err => console.log(err))

        //
        fetch('http://www.alamoinventario.com:80/api/leerexistenciaporcentajesinrevision/'+ this.state.exAux +`/${this.state.anioAux}`, requestOptions)
              .then(response => response.json())
              .then(data => {       
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }

                this.setState({
                  dataporRev: data.data
                })
                  
              })
              .catch(err => console.log(err))
        
        //

        fetch('http://www.alamoinventario.com:80/api/leerexistenciarecibocostomes/'+ this.state.exAux +`/${this.state.anioAux}`, requestOptions)
              .then(response => response.json())
              .then(data => {  
                   
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                this.setState({
                  dataReciboMes: data.data[0],
                  setYinsumesMesCosto: data.data[1]
                })
              })
              .catch(err => console.log(err))

        fetch('http://www.alamoinventario.com:80/api/leerexistenciascostomesporitem/'+ this.state.exAux +`/${this.state.anioAux}`, requestOptions)
              .then(response => response.json())
              .then(data => {                
                //console.log(data)  
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                this.setState({
                  dataReciboMesItem: data.data
                })
              })
              .catch(err => console.log(err))
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
        
        }
    

    onChartLoad(args) {
      document.getElementById('pie-chart').setAttribute('title', '');
  }

  onChartLoadBar01(args) {
    let chart = document.getElementById('charts');
    chart.setAttribute('title', '');
}

  onChartLoadBar02(args) {
    let chart = document.getElementById('charts2');
    chart.setAttribute('title', '');
  }

  onChartLoadBar03(args) {
    let chart = document.getElementById('charts3');
    chart.setAttribute('title', '');
  }

  handleexAux = (e) => {
    this.setState({
      exAux: e.target.value
    })

    const requestOptions ={
      method: 'GET',
      headers : new Headers({
        'Authorization': localStorage.getItem( 'token' ),
        'Content-type':'application/json'
      }),    
    }

    fetch('http://www.alamoinventario.com:80/api/leerexistenciasalamogeneral/'+ e.target.value +`/${this.state.anioAux}`, requestOptions)
        .then(response => response.json())
        .then(data => {      
          //console.log(data)  
          if(typeof data.err !== 'undefined' && data.err.message.length > 0){                  
            localStorage.clear();
            this.props.logoutHandler();
          }

          let dataAux = [];
                
                data.data[0].map((item, index) => {
                  if(item.SumSiExistencia === 0){
                                        
                  }else{
                    dataAux.push(item)
                  }   
                })

                  this.setState({
                      dataExistencias : dataAux,
                      //label_barras: data.data[4],
                      dataBotellasNo: data.data[6],
                      dataBotellasRev: data.data[7],
                      setYrevbno: data.data[8],
                  })
        })
        .catch(err => console.log(err))


      //
      fetch('http://www.alamoinventario.com:80/api/leerexistenciaporcentajesinrevision/'+ e.target.value +`/${this.state.anioAux}`, requestOptions)
      .then(response => response.json())
      .then(data => {     
        if(typeof data.err !== 'undefined' && data.err.message.length > 0){
          localStorage.clear();
          this.props.logoutHandler();
        }

        this.setState({
          dataporRev: data.data
        })
          
      })
      .catch(err => console.log(err))

      fetch('http://www.alamoinventario.com:80/api/leerexistenciarecibocostomes/'+ e.target.value +`/${this.state.anioAux}`, requestOptions)
              .then(response => response.json())
              .then(data => {   
                
                console.log(data)                    
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }

                this.setState({
                  dataReciboMes: data.data[0],
                  setYinsumesMesCosto: data.data[1]
                })
                
              })
              .catch(err => console.log(err))

        fetch('http://www.alamoinventario.com:80/api/leerexistenciascostomesporitem/'+ e.target.value +`/${this.state.anioAux}`, requestOptions)
              .then(response => response.json())
              .then(data => {  
                
                console.log(data) 
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                this.setState({
                  dataReciboMesItem: data.data
                })
              })
              .catch(err => console.log(err))
  }

  handleAnioAux = (e) => {
    this.setState({
      anioAux: e.target.value
    })

    const requestOptions ={
      method: 'GET',
      headers : new Headers({
        'Authorization': localStorage.getItem( 'token' ),
        'Content-type':'application/json'
      }),    
    }

    fetch('http://www.alamoinventario.com:80/api/leerexistenciasalamogeneral/'+ this.state.exAux +`/${e.target.value}`, requestOptions)
        .then(response => response.json())
        .then(data => {      
          if(typeof data.err !== 'undefined' && data.err.message.length > 0){                  
            localStorage.clear();
            this.props.logoutHandler();
          }
        })
        .catch(err => console.log(err))
  }

  
    render() {
        return (     
                <div>                    
                <h3 className='centroTitulo'>DASHBOARD - BOTELLAS</h3>                
                <br></br>   
                <Container>
                  <Row>
                    <Col className="bg-light border">
                    <br></br> 
                      <div className='centroTituloFiltros'>                     
                        <div>                          
                          <h6>Existencia:</h6>
                          <Input
                            bsSize="sm"
                            className="mb-3"
                            type="select"
                            onChange={this.handleexAux}>
                            <option>
                              Seleccione Existencia
                            </option>
                            {this.state.label_barras.map((item, index) => {
                              return(
                                <option>
                                  {item}
                                </option>
                              )
                            })}
                          </Input>
                        </div>
                        
                        <div>
                          <h6>Año:</h6>
                          <Input
                            bsSize="sm"
                            className="mb-3"
                            type="select"
                            onChange={this.handleAnioAux}>
                            <option>
                              Seleccione Año
                            </option>
                            <option>
                              2021
                            </option>
                            <option>
                              2022
                            </option>
                            <option>
                              2023
                            </option>
                            <option>
                              2024
                            </option>
                          </Input>
                        </div>
                      </div>                      
                      <br></br>
                    </Col>
                  </Row>
                  <Row xs={this.state.xsSet}>
                    <Col className="bg-light border"
                      sm="3">
                      <AccumulationChartComponent 
                          loaded={this.onChartLoad.bind(this)}
                          id="pie-chart" 
                          title='' 
                          center={{ x: '50%', y: '50%' }}
                          enableSmartLabels={true} 
                          enableAnimation={true}
                          legendSettings={{
                            visible: true, 
                            toggleVisibility: false,
                            position: 'Top', 
                            height: '20%', 
                            width: '100%',
                            maximumLabelWidth:100,
                            reverse: true
                          }}
                          useGroupingSeparator={true}
                          tooltip={{ 
                              enable: true, 
                              format: '<b>${point.x}</b><br>Cantidad Existencia: <b>${point.y}</b>' }} 
                              enableBorderOnMouseMove={false}>
                          <Inject services={[PieSeries, AccumulationDataLabel, AccumulationLegend, AccumulationTooltip]}/>
                          <AccumulationSeriesCollectionDirective>
                          <AccumulationSeriesDirective 
                              dataSource={this.state.dataExistencias} 
                              xName='_id' 
                              yName='SumSiExistencia' 
                              innerRadius='40%' 
                              startAngle={0} 
                              endAngle={360} 
                              radius='75%' 
                              explode={true} 
                              explodeOffset='10%' 
                              explodeIndex={0} 
                              dataLabel={{
                                  visible: true,
                                  position: 'Inside', 
                                  name: 'SumSiExistencia',
                              font: {
                                  fontWeight: '600',
                              }
                              }}>
                          </AccumulationSeriesDirective>
                          </AccumulationSeriesCollectionDirective>
                      </AccumulationChartComponent>
                    </Col>
                    <Col className="bg-light border"
                          sm="9"
                          >
                      <ChartComponent                      
                        id="charts2"
                        style={{ textAlign: "center" }} 
                        enableSideBySidePlacement={false}
                        primaryXAxis={{
                          valueType: 'Category',
                          interval: 1,
                          majorGridLines: { width: 0 },
                          labelPosition: 'Outside',
                        }}
                        primaryYAxis={{
                          minimum: 0,
                          maximum: 100,
                          labelFormat: '{value}%',
                          interval: 25,
                          majorTickLines: { width: 0 },
                          lineStyle: { width: 0 },
                        }}
                        chartArea={{ border: { width: 0 } }}
                        title=""
                        legendSettings={{ visible: false }}
                        tooltip={{
                          enable: true,
                          header: '<b>${point.x}</b>',
                          format: '% Existencias con Rev : <b>${point.text}</b>',
                        }}
                        width={Browser.isDevice ? '100%' : '100%'}
                        loaded={this.onChartLoadBar02.bind(this)}
                        //pointRender={pointRender}
                      >
                        <Inject services={[ColumnSeries, DataLabel, Category, Tooltip]} />
                        <SeriesCollectionDirective>
                          <SeriesDirective
                            xName="_id"
                            yName="ExistenciasRate"
                            enableTooltip={false}
                            columnWidth={0.8}
                            opacity={0.3}
                            dataSource={this.state.dataporRev}
                            type="Column"
                            name="Tiger"
                            cornerRadius={{
                              bottomLeft: 0,
                              bottomRight: 0,
                              topLeft: 0,
                              topRight: 0,
                            }}
                          ></SeriesDirective>
                          <SeriesDirective
                            xName="_id"
                            yName="ExistenciaPorcentajeSinRevision"
                            columnWidth={0.8}
                            dataSource={this.state.dataporRev}
                            type="Column"
                            marker={{
                              dataLabel: {
                                visible: true,
                                name: 'ExistenciaPorcentajeSinRevisionText',
                                position: 'Top',
                                font: {
                                  fontWeight: '600',
                                  color: '#ffffff',
                                },
                              },
                            }}
                            name="Tiger"
                            cornerRadius={{
                              bottomLeft: 0,
                              bottomRight: 0,
                              topLeft: 10,
                              topRight: 10,
                            }}
                          ></SeriesDirective>
                        </SeriesCollectionDirective>
                      </ChartComponent>
                    </Col>
                    <Col className="bg-light border"
                    sm="6">
                      <ChartComponent 
                        width={Browser.isDevice ? '100%' : '100%'}
                        loaded={this.onChartLoadBar01.bind(this)}
                        id='charts' 
                        legendSettings={{ enableHighlight: true }} 
                        primaryXAxis={{ 
                            valueType: 'Category', 
                            interval: 1, 
                            majorGridLines: { width: 0 }, 
                            majorTickLines: { width: 0 } }} 
                        primaryYAxis={{
                          //title: 'Medal Count',
                          majorTickLines: { width: 0 }, 
                          lineStyle: { width: 0 }, 
                          maximum: this.state.setYrevbno + this.state.setYrevbno * 0.03, 
                          interval: this.state.setYrevbno/10,
                        }}                         
                        useGroupingSeparator={true}
                        chartArea={{ border: { width: 0 } }} 
                        tooltip={{
                            enable: true, 
                            header: "<b>${point.tooltip}</b>", 
                            shared: true }} 
                        title=''>
                            <Inject services={[ColumnSeries, Legend, Tooltip, Category, DataLabel, Highlight]}/>
                            <SeriesCollectionDirective>     
                                <SeriesDirective marker={{
                                  dataLabel: {
                                    visible: true,
                                    name: 'Existenicia en Revision',
                                    position: 'Bottom',
                                    font: {
                                      fontWeight: '450',
                                      color: '#000000',
                                    },
                                  },
                                }} 
                                dataSource={this.state.dataBotellasRev} 
                                tooltipMappingName='_id' 
                                xName='_id' 
                                columnSpacing={0.1} 
                                yName='SumRevExistencia' 
                                name='Botellas Rev' 
                                type='Column'>
                                </SeriesDirective>
                                <SeriesDirective marker={{
                                  dataLabel: {
                                    visible: true,
                                    name: 'Existenicia no paso Revision',
                                    position: 'Bottom',
                                    font: {
                                      fontWeight: '450',
                                      color: '#ffffff',
                                    },
                                  },
                                }}  
                                dataSource={this.state.dataBotellasNo} 
                                tooltipMappingName='_id' 
                                xName='_id' 
                                columnSpacing={0.1} 
                                yName='SumNoExistencia' 
                                name='Botellas No' 
                                type='Column' >
                                </SeriesDirective>

                            </SeriesCollectionDirective>
                        </ChartComponent>
                    </Col>
                    <Col className="bg-light border"
                          sm="6"
                          >
                            <ChartComponent 
                        loaded={this.onChartLoadBar03.bind(this)}
                        width={Browser.isDevice ? '100%' : '100%'}
                        id="charts3"  
                        primaryXAxis={{
                        valueType: 'Category', 
                        edgeLabelPlacement: 'Shift', 
                        majorGridLines: { width: 0 },
                        }} 
                        primaryYAxis={{
                        rangePadding: 'None', 
                        minimum: 0, 
                        maximum: this.state.setYinsumesMesCosto + this.state.setYinsumesMesCosto*0.03, 
                        interval: this.state.setYinsumesMesCosto/10, 
                        lineStyle: { width: 0 },
                        majorTickLines: { width: 0 }, 
                        minorTickLines: { width: 0 },
                        labelFormat: '${value}'
                        }} 
                        useGroupingSeparator={true}
                        chartArea={{ border: { width: 0 } }} 
                        tooltip={{ enable: true }} 
                        legendSettings={{ enableHighlight: true }} 
                        title="">
                            <Inject services={[LineSeries, Category, Legend, Tooltip, DataLabel, Highlight, ColumnSeries]}/>
                            <SeriesCollectionDirective>

                                <SeriesDirective                                                             
                                dataSource={this.state.dataReciboMes} 

                                marker={{
                                  dataLabel: {
                                    visible: true,
                                    position: 'Top',
                                    font: {
                                      fontWeight: '450',
                                      color: '#ffffff',
                                    },
                                  },
                                }}    

                                xName="_id" 
                                yName="CostoExistencia" 
                                name="Gasto Existencias - Botellas" 
                                columnWidth={0.5}                                 
                                type="Column"
                                cornerRadius={{
                                  bottomLeft: 0,
                                  bottomRight: 0,
                                  topLeft: 10,
                                  topRight: 10,
                                }}>
                                </SeriesDirective>

                                {this.state.dataReciboMesItem.map((item, index) => {
                                  return(
                                    <SeriesDirective 
                                    dataSource={item} 
                                    xName="_id" 
                                    yName="CostoExistencia" 
                                    name={item[0].itemNombre}
                                    width={2} 
                                    marker={{ visible: true, width: 3, height: 3, shape: 'Circle', isFilled: true}} 
                                    type="Line">
                                    </SeriesDirective>
                                  )
                                })}
                                
                            </SeriesCollectionDirective>
                        </ChartComponent>
                    </Col>
                  </Row>                  
                </Container>
                </div>
        );
    }
}

export default AlamoDashboard;