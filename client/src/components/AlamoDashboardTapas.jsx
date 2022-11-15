import React, { Component } from 'react';

import {LineSeries, Highlight,  AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, Inject, AccumulationLegend, PieSeries, AccumulationTooltip, ColumnSeries, SeriesCollectionDirective, SeriesDirective, AccumulationDataLabel, ChartComponent, Legend, Category, Tooltip, DataLabel, SplineAreaSeries, DateTime } from "@syncfusion/ej2-react-charts";

import { DashboardLayoutComponent, PanelsDirective, PanelDirective } from "@syncfusion/ej2-react-layouts";

import { Browser } from '@syncfusion/ej2-base';

import {Container, Row, Col} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import "../dynamic.css"; 

import "../App.css";



class AlamoDashboardTapas extends Component {
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
            dataReciboMesItem: []
        }
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
          const requestOptions ={
            method: 'GET',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),    
          }
      
          fetch('http://44.201.244.11:80/api/leerexistenciastapasalamo', requestOptions)
              .then(response => response.json())
              .then(data => {      
                //console.log(data)
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){                  
                  localStorage.clear();
                  this.props.logoutHandler();
                }

                let dataAux = [];
                
                data.data.map((item, index) => {
                  if(item.tapas === 0){
                                        
                  }else{
                    dataAux.push(item)
                  }   
                })

                  this.setState({
                      dataExistencias : dataAux,                      
                  })
                
              })
              .catch(err => console.log(err))
        
        //

        fetch('http://44.201.244.11:80/api/leerexistenciastapascostomesgeneral', requestOptions)
              .then(response => response.json())
              .then(data => {  
                //console.log(data)     
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                this.setState({
                  dataReciboMes: data.data
                })
              })
              .catch(err => console.log(err))
                

        fetch('http://44.201.244.11:80/api/leerexistenciastapascostomesitem', requestOptions)
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

    onChartLoad(args) {
        document.getElementById('pie-chart').setAttribute('title', '');
    }

    onChartLoadBar03(args) {
        document.getElementById('charts3').setAttribute('title', '');
    }

  //Funciones Graficas
  
    render() {
        return (     
                <div>      
                <h3>DASHBOARD - TAPAS</h3>    
                <br></br>
                <br></br>   
                <Container>
                  <Row xs="3">
                    <Col className="bg-light border">
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
                          tooltip={{ 
                              enable: true, 
                              format: '<b>${point.x}</b><br>Cantidad Existencia: <b>${point.y}</b>' }} 
                              enableBorderOnMouseMove={false}>
                          <Inject services={[PieSeries, AccumulationDataLabel, AccumulationLegend, AccumulationTooltip]}/>
                          <AccumulationSeriesCollectionDirective>
                          <AccumulationSeriesDirective 
                              dataSource={this.state.dataExistencias} 
                              xName='_id' 
                              yName='tapas' 
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
                          xs="8">
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
                        title: '', 
                        rangePadding: 'None', 
                        minimum: 0, 
                        maximum: 500000, 
                        interval: 50000, 
                        lineStyle: { width: 0 },
                        majorTickLines: { width: 0 }, 
                        minorTickLines: { width: 0 },
                        }} 
                        chartArea={{ border: { width: 0 } }} 
                        tooltip={{ enable: true }} 
                        legendSettings={{ enableHighlight: true }} 
                        title="">
                            <Inject services={[LineSeries, Category, Legend, Tooltip, Highlight, ColumnSeries]}/>
                            <SeriesCollectionDirective>

                                <SeriesDirective                                 
                                dataSource={this.state.dataReciboMes} 
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

export default AlamoDashboardTapas;