import React, { Component } from 'react';

import {LineSeries, Highlight,  AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, Inject, AccumulationLegend, PieSeries, AccumulationTooltip, ColumnSeries, SeriesCollectionDirective, SeriesDirective, AccumulationDataLabel, ChartComponent, Legend, Category, Tooltip, DataLabel, SplineAreaSeries, DateTime } from "@syncfusion/ej2-react-charts";

import { DashboardLayoutComponent, PanelsDirective, PanelDirective } from "@syncfusion/ej2-react-layouts";

import { Browser } from '@syncfusion/ej2-base';

import {Container, Row, Col} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import "../dynamic.css"; 

import "../App.css";

import {isMobile, BrowserView, MobileView} from 'react-device-detect';

class AlamoDashboardEtiquetasAlamo extends Component {
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
      
          fetch('http://www.alamoinventario.com:80/api/leeretiquetasalamogeneral', requestOptions)
              .then(response => response.json())
              .then(data => {      
                console.log(data)
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){                  
                  localStorage.clear();
                  this.props.logoutHandler();
                }

                let dataAux = [];
                
                data.data.map((item, index) => {
                  if(item.etiquetas === 0){
                                        
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

        fetch('http://www.alamoinventario.com:80/api/leerexistenciasetiquetascostomesgeneral', requestOptions)
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
                

        fetch('http://www.alamoinventario.com:80/api/leerexistenciasetiquetascostomesitem', requestOptions)
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
                <h3 className='centroTitulo'>DASHBOARD - ETIQUETAS</h3>
                
                <br></br>   
                <Container>
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
                          tooltip={{ 
                              enable: true, 
                              format: '<b>${point.x}</b><br>Cantidad Existencia: <b>${point.y}</b>' }} 
                              enableBorderOnMouseMove={false}>
                          <Inject services={[PieSeries, AccumulationDataLabel, AccumulationLegend, AccumulationTooltip]}/>
                          <AccumulationSeriesCollectionDirective>
                          <AccumulationSeriesDirective 
                              dataSource={this.state.dataExistencias} 
                              xName='_id' 
                              yName='etiquetas' 
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
                          sm="9">
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
                        maximum: this.state.setYinsumesMesCosto + this.state.setYinsumesMesCosto*0.03, 
                        interval: this.state.setYinsumesMesCosto/10,
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
                                name="Gasto Existencias - Etiquetas" 
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

export default AlamoDashboardEtiquetasAlamo;