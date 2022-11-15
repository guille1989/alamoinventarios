import React, { Component } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardText, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Table, Nav, NavLink, NavItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class AlamoConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRecepcion: [],
            dataRevision: [],
            dataBotellas: [],
            modalRecepcion: false,
            nombreRecepcion: '',
            modalRevision: false,
            nombreRevision: '',
            modalBotellas: false,
            nombreBotella: '',
            modalBotellasActualizar: false,
            actualizarBotellas: '',
            botellaActualizar: '',
            botellaActualizarID: '',
            modalTapas: false,
            tapa: '',
            dataTapas: [],
            dataOtros: [],
            otros: '',
            dataEtiquetas: [],
            modalEtiquetas: false,
            etiquetas: ''
        }
    }
    
    componentDidMount(){
       //Fetch para enviar informacion al backend:
       //Leemos primero recepcion
       const requestOptions ={
        method: 'GET',
        headers : new Headers({
          'Authorization': localStorage.getItem( 'token' ),
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-type':'application/json'
        }),

      }
  
      fetch('http://44.201.244.11:80/api/leerpersonalrecepcion', requestOptions)
          .then(response => response.json())
          .then(data => {              
              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                localStorage.clear();
                this.props.logoutHandler();
              }else{
                  
              }   
              this.setState({
                dataRecepcion : data.data
            })   
                      
          })
          .catch(err => {                 
              console.log(err)
          }) 

          //Leemos segundo revision

          fetch('http://44.201.244.11:80/api/leerpersonalrevision', requestOptions)
          .then(response => response.json())
          .then(data => {              
              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                localStorage.clear();
                this.props.logoutHandler();
              }else{
                  
              }   
              this.setState({
                dataRevision : data.data
            })   
                      
          })
          .catch(err => {                 
              console.log(err)
          }) 

          //Leemos tercero botellas

          fetch('http://44.201.244.11:80/api/leerbotellas', requestOptions)
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

        //Tapas
        fetch('http://44.201.244.11:80/api/leertapasalamo', requestOptions)
          .then(response => response.json())
          .then(data => {              
              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                localStorage.clear();
                this.props.logoutHandler();
              }else{
                  
              }   
              //console.log(data)
              this.setState({
                dataTapas : data.data
            })   
                      
          })
          .catch(err => {                 
              console.log(err)
          }) 

          //
          fetch('http://44.201.244.11:80/api/leerotrosalamo', requestOptions)
            .then(response => response.json())
            .then(data => {              
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }else{
                    
                }   
                //console.log(data)
                this.setState({
                  dataOtros : data.data
              })   
                        
            })
            .catch(err => {                 
                console.log(err)
            })

            //Etiquetas
            fetch('http://44.201.244.11:80/api/leeretiquetasalamo', requestOptions)
              .then(response => response.json())
              .then(data => {              
                  if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                    localStorage.clear();
                    this.props.logoutHandler();
                  }else{
                      
                  }   
                  //console.log(data)
                  this.setState({
                    dataEtiquetas : data.data
                })   
                          
              })
              .catch(err => {                 
                  console.log(err)
              })
    }

    insertPersonalRecepcionAlamo = () => {
        if(this.state.nombreRecepcion === ''){
            alert('Por favor ingresar nombre')
        }else{
            const requestOptions ={
                method: 'POST',
                headers : new Headers({
                  'Authorization': localStorage.getItem( 'token' ),
                  'Content-type':'application/json'
                }),
                body: JSON.stringify({
                      nombre: this.state.nombreRecepcion})
              }
          
              fetch('http://44.201.244.11:80/api/insertpersonalrecepcion', requestOptions)
                  .then(response => response.json())
                  .then(data => {
                    if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                      localStorage.clear();
                      this.props.logoutHandler();
                    }
                    
                    alert('Persona ingresada a recepcion !!')
                    this.setState({
                    modalRecepcion: !this.state.modalRecepcion
                    })
                   
                    //Actualizamos DATA   
                    const requestOptions ={
                        method: 'GET',
                        headers : new Headers({
                          'Authorization': localStorage.getItem( 'token' ),
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Content-type':'application/json'
                        }),
                
                      }
                  
                      fetch('http://44.201.244.11:80/api/leerpersonalrecepcion', requestOptions)
                          .then(response => response.json())
                          .then(data => {              
                              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                                localStorage.clear();
                                this.props.logoutHandler();
                              }else{
                                  
                              }   
                              this.setState({
                                dataRecepcion : data.data
                            })   
                                      
                          })
                          .catch(err => {                 
                              console.log(err)
                          }) 
                  })
                  .catch(err => console.log(err)) 
        }
    }

    onChangeRecepcionPersonal = (e) => {
        this.setState({
            nombreRecepcion: e.target.value.toUpperCase()
        })
    }

    elimiarPersonalRecepcion(item, nombre){
        if (window.confirm(`Seguro de eliminar a ${nombre}?`)) {

            const requestOptions ={
                method: 'DELETE',
                headers : new Headers({
                  'Authorization': localStorage.getItem( 'token' ),
                  'Content-type':'application/json'
                }),
                body: JSON.stringify({
                      id: item})
              }
          
              fetch('http://44.201.244.11:80/api/insertpersonalrecepcion', requestOptions)
                  .then(response => response.json())
                  .then(data => {
                    if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                      localStorage.clear();
                      this.props.logoutHandler();
                    }
                    
                    alert('Persona eliminada de recepcion !!')                
                   
                    //Actualizamos DATA   
                    const requestOptions ={
                        method: 'GET',
                        headers : new Headers({
                          'Authorization': localStorage.getItem( 'token' ),
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Content-type':'application/json'
                        }),
                
                      }
                  
                      fetch('http://44.201.244.11:80/api/leerpersonalrecepcion', requestOptions)
                          .then(response => response.json())
                          .then(data => {              
                              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                                localStorage.clear();
                                this.props.logoutHandler();
                              }else{
                                  
                              }   
                              this.setState({
                                dataRecepcion : data.data
                            })   
                                      
                          })
                          .catch(err => {                 
                              console.log(err)
                          }) 
                  })
                  .catch(err => console.log(err))
        }else{

        } 
      }


      insertPersonalRevisionAlamo = () => {
        if(this.state.nombreRevision === ''){
            alert('Por favor ingresar nombre')
        }else{
            const requestOptions ={
                method: 'POST',
                headers : new Headers({
                  'Authorization': localStorage.getItem( 'token' ),
                  'Content-type':'application/json'
                }),
                body: JSON.stringify({
                      nombre: this.state.nombreRevision})
              }
          
              fetch('http://44.201.244.11:80/api/leerpersonalrevision', requestOptions)
                  .then(response => response.json())
                  .then(data => {
                    if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                      localStorage.clear();
                      this.props.logoutHandler();
                    }
                    
                    alert('Persona ingresada a revision !!')
                    this.setState({
                    modalRevision: !this.state.modalRevision
                    })
                   
                    //Actualizamos DATA   
                    const requestOptions ={
                        method: 'GET',
                        headers : new Headers({
                          'Authorization': localStorage.getItem( 'token' ),
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Content-type':'application/json'
                        }),
                
                      }
                  
                      fetch('http://44.201.244.11:80/api/leerpersonalrevision', requestOptions)
                          .then(response => response.json())
                          .then(data => {              
                              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                                localStorage.clear();
                                this.props.logoutHandler();
                              }else{
                                  
                              }   
                              this.setState({
                                dataRevision : data.data
                            })   
                                      
                          })
                          .catch(err => {                 
                              console.log(err)
                          }) 
                  })
                  .catch(err => console.log(err)) 
        }
      }

      onChangeRevisionPersonal = (e) => {
        this.setState({
            nombreRevision: e.target.value.toUpperCase()
        })
      }


      elimiarPersonalRevision = (item, nombre) => {
        if (window.confirm(`Seguro de eliminar a ${nombre}?`)) {

            const requestOptions ={
                method: 'DELETE',
                headers : new Headers({
                  'Authorization': localStorage.getItem( 'token' ),
                  'Content-type':'application/json'
                }),
                body: JSON.stringify({
                      id: item})
              }
          
              fetch('http://44.201.244.11:80/api/leerpersonalrevision', requestOptions)
                  .then(response => response.json())
                  .then(data => {
                    if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                      localStorage.clear();
                      this.props.logoutHandler();
                    }
                    
                    alert('Persona eliminada de revision !!')                
                   
                    //Actualizamos DATA   
                    const requestOptions ={
                        method: 'GET',
                        headers : new Headers({
                          'Authorization': localStorage.getItem( 'token' ),
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Content-type':'application/json'
                        }),
                
                      }
                  
                      fetch('http://44.201.244.11:80/api/leerpersonalrevision', requestOptions)
                          .then(response => response.json())
                          .then(data => {              
                              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                                localStorage.clear();
                                this.props.logoutHandler();
                              }else{
                                  
                              }   
                              this.setState({
                                dataRevision : data.data
                            })   
                                      
                          })
                          .catch(err => {                 
                              console.log(err)
                          }) 
                  })
                  .catch(err => console.log(err))
        }else{

        } 
      }


      insertTapa = () => {
        if(this.state.tapa === ''){
          alert('Por favor ingresar existencia')
      }else{
          const requestOptions ={
              method: 'POST',
              headers : new Headers({
                'Authorization': localStorage.getItem( 'token' ),
                'Content-type':'application/json'
              }),
              body: JSON.stringify({
                    tapa: this.state.tapa})
            }
        
            fetch('http://44.201.244.11:80/api/leertapasalamo', requestOptions)
                .then(response => response.json())
                .then(data => {
                  if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                    localStorage.clear();
                    this.props.logoutHandler();
                  }
                  
                  alert('existencia ingresada !!')
                  this.setState({
                  modalTapas: !this.state.modalTapas
                  })
                 
                  //Actualizamos DATA   
                  const requestOptions ={
                      method: 'GET',
                      headers : new Headers({
                        'Authorization': localStorage.getItem( 'token' ),
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-type':'application/json'
                      }),
              
                    }
                
                    fetch('http://44.201.244.11:80/api/leertapasalamo', requestOptions)
                        .then(response => response.json())
                        .then(data => {              
                            if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                              localStorage.clear();
                              this.props.logoutHandler();
                            }else{
                                
                            }   
                            //console.log(data)
                            this.setState({
                              dataTapas : data.data
                          })   
                                    
                        })
                        .catch(err => {                 
                            console.log(err)
                        }) 
                })
                .catch(err => console.log(err)) 
      }
      }

      insertBotellas = () => {
        if(this.state.nombreBotella === ''){
            alert('Por favor ingresar existencia')
        }else{
            const requestOptions ={
                method: 'POST',
                headers : new Headers({
                  'Authorization': localStorage.getItem( 'token' ),
                  'Content-type':'application/json'
                }),
                body: JSON.stringify({
                      botella: this.state.nombreBotella})
              }
          
              fetch('http://44.201.244.11:80/api/leerbotellas', requestOptions)
                  .then(response => response.json())
                  .then(data => {
                    if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                      localStorage.clear();
                      this.props.logoutHandler();
                    }
                    
                    alert('existencia ingresada !!')
                    this.setState({
                    modalBotellas: !this.state.modalBotellas
                    })
                   
                    //Actualizamos DATA   
                    const requestOptions ={
                        method: 'GET',
                        headers : new Headers({
                          'Authorization': localStorage.getItem( 'token' ),
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Content-type':'application/json'
                        }),
                
                      }
                  
                      fetch('http://44.201.244.11:80/api/leerbotellas', requestOptions)
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
                  })
                  .catch(err => console.log(err)) 
        }
      }

      onChangeBotellasNuevas = (e) => {
        this.setState({
            nombreBotella: e.target.value.toUpperCase()
        })
      }


      onChangeBotellasActualizar = (e) => {
        this.setState({
            actualizarBotellas: e.target.value.toUpperCase()
        })
      }

      actualizarBotellaAlamo = (botella, id) => {

        this.setState({
            modalBotellasActualizar: !this.state.modalBotellasActualizar,
            botellaActualizar: botella,
            botellaActualizarID: id
        })

      }

      eliminarTapaAlamo = (tapa, id) => {

        if (window.confirm(`Seguro de eliminar existencia: ${tapa}?`)) {
          const requestOptions ={
            method: 'DELETE',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),
            body: JSON.stringify({
                  tapa: tapa,
                    id: id})
          }
      
          fetch('http://44.201.244.11:80/api/leertapasalamo', requestOptions)
              .then(response => response.json())
              .then(data => {
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                
                alert('existencia eliminada !!')
               
                //Actualizamos DATA   
                const requestOptions ={
                    method: 'GET',
                    headers : new Headers({
                      'Authorization': localStorage.getItem( 'token' ),
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Content-type':'application/json'
                    }),
            
                  }
              
                  fetch('http://44.201.244.11:80/api/leertapasalamo', requestOptions)
                      .then(response => response.json())
                      .then(data => {              
                          if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                            localStorage.clear();
                            this.props.logoutHandler();
                          }else{
                              
                          }   
                          this.setState({
                            dataTapas : data.data
                        })   
                                  
                      })
                      .catch(err => {                 
                          console.log(err)
                      }) 
              })
              .catch(err => console.log(err))
        }else{

        }
      }

      eliminarOtroAlamo = (otros, id) => {

        if (window.confirm(`Seguro de eliminar existencia: ${otros}?`)) {
          const requestOptions ={
            method: 'DELETE',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),
            body: JSON.stringify({
                    otros: otros,
                    id: id})
          }
      
          fetch('http://44.201.244.11:80/api/leerotrosalamo', requestOptions)
              .then(response => response.json())
              .then(data => {
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                
                alert('existencia eliminada !!')
               
                //Actualizamos DATA   
                const requestOptions ={
                    method: 'GET',
                    headers : new Headers({
                      'Authorization': localStorage.getItem( 'token' ),
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Content-type':'application/json'
                    }),
            
                  }
              
                  fetch('http://44.201.244.11:80/api/leerotrosalamo', requestOptions)
                      .then(response => response.json())
                      .then(data => {              
                          if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                            localStorage.clear();
                            this.props.logoutHandler();
                          }else{
                              
                          }   
                          this.setState({
                            dataOtros : data.data
                        })   
                                  
                      })
                      .catch(err => {                 
                          console.log(err)
                      }) 
              })
              .catch(err => console.log(err))
        }else{

        }
      }

      eliminarBotellaAlamo = (botella, id) => {

        if (window.confirm(`Seguro de eliminar existencia: ${botella}?`)) {
          const requestOptions ={
            method: 'DELETE',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),
            body: JSON.stringify({
                  botella: botella,
                    id: id})
          }
      
          fetch('http://44.201.244.11:80/api/leerbotellas', requestOptions)
              .then(response => response.json())
              .then(data => {
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                
                alert('existencia eliminada !!')
               
                //Actualizamos DATA   
                const requestOptions ={
                    method: 'GET',
                    headers : new Headers({
                      'Authorization': localStorage.getItem( 'token' ),
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Content-type':'application/json'
                    }),
            
                  }
              
                  fetch('http://44.201.244.11:80/api/leerbotellas', requestOptions)
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
              })
              .catch(err => console.log(err))
        }else{

        }
      }


      actualizarBotellasAlamo = () => {

        const requestOptions ={
            method: 'PUT',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),
            body: JSON.stringify({
                  botella: this.state.actualizarBotellas,
                    id: this.state.botellaActualizarID})
          }
      
          fetch('http://44.201.244.11:80/api/leerbotellas', requestOptions)
              .then(response => response.json())
              .then(data => {
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                
                alert('existencia actualizada !!')
                this.setState({
                modalBotellasActualizar: !this.state.modalBotellasActualizar
                })
               
                //Actualizamos DATA   
                const requestOptions ={
                    method: 'GET',
                    headers : new Headers({
                      'Authorization': localStorage.getItem( 'token' ),
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Content-type':'application/json'
                    }),
            
                  }
              
                  fetch('http://44.201.244.11:80/api/leerbotellas', requestOptions)
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
              })
              .catch(err => console.log(err))
      }

    
    onChangeTapasNuevas = (e) =>{
      this.setState({
        tapa: e.target.value.toUpperCase()
      })
    }

    onChangeOtrosNuevas = (e) => {
      this.setState({
        otros: e.target.value.toUpperCase()
      })
    }   
    
    insertOtros = () => {
      if(this.state.otros === ''){
        alert('Por favor ingresar carton o plastico')
    }else{
        const requestOptions ={
            method: 'POST',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),
            body: JSON.stringify({
                  otros: this.state.otros})
          }
      
          fetch('http://44.201.244.11:80/api/leerotrosalamo', requestOptions)
              .then(response => response.json())
              .then(data => {
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                
                alert('carton o plastico ingresado !!')
                this.setState({
                modalOtros: !this.state.modalOtros
                })
               
                //Actualizamos DATA   
                const requestOptions ={
                    method: 'GET',
                    headers : new Headers({
                      'Authorization': localStorage.getItem( 'token' ),
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Content-type':'application/json'
                    }),
            
                  }
              
                  fetch('http://44.201.244.11:80/api/leerotrosalamo', requestOptions)
                      .then(response => response.json())
                      .then(data => {              
                          if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                            localStorage.clear();
                            this.props.logoutHandler();
                          }else{
                              
                          }   
                          //console.log(data)
                          this.setState({
                            dataOtros : data.data
                        })   
                                  
                      })
                      .catch(err => {                 
                          console.log(err)
                      }) 
              })
              .catch(err => console.log(err)) 
    }
    }

    onChangeEtiquetasNuevas = (e) => {
      this.setState({
        etiquetas: e.target.value.toUpperCase()
      })
    }

    insertEtiquetas = () => {
      if(this.state.etiquetas === ''){
        alert('Por favor ingresar etiqueta')
    }else{
        const requestOptions ={
            method: 'POST',
            headers : new Headers({
              'Authorization': localStorage.getItem( 'token' ),
              'Content-type':'application/json'
            }),
            body: JSON.stringify({
                  etiqueta: this.state.etiquetas})
          }
      
          fetch('http://44.201.244.11:80/api/leeretiquetasalamo', requestOptions)
              .then(response => response.json())
              .then(data => {
                if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                  localStorage.clear();
                  this.props.logoutHandler();
                }
                
                alert('etiqueta ingresada !!')
                this.setState({
                  modalEtiquetas: !this.state.modalEtiquetas
                })
               
                //Actualizamos DATA   
                const requestOptions ={
                    method: 'GET',
                    headers : new Headers({
                      'Authorization': localStorage.getItem( 'token' ),
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Content-type':'application/json'
                    }),
            
                  }
              
                  fetch('http://44.201.244.11:80/api/leeretiquetasalamo', requestOptions)
                      .then(response => response.json())
                      .then(data => {              
                          if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                            localStorage.clear();
                            this.props.logoutHandler();
                          }else{
                              
                          }   
                          //console.log(data)
                          this.setState({
                            dataEtiquetas : data.data
                        })   
                                  
                      })
                      .catch(err => {                 
                          console.log(err)
                      }) 
              })
              .catch(err => console.log(err)) 
    }
    }

    eliminarEtiquetaAlamo = (etiqueta, id) => {

      if (window.confirm(`Seguro de eliminar existencia: ${etiqueta}?`)) {
        const requestOptions ={
          method: 'DELETE',
          headers : new Headers({
            'Authorization': localStorage.getItem( 'token' ),
            'Content-type':'application/json'
          }),
          body: JSON.stringify({
                etiqueta: etiqueta,
                  id: id})
        }
    
        fetch('http://44.201.244.11:80/api/leeretiquetasalamo', requestOptions)
            .then(response => response.json())
            .then(data => {
              if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                localStorage.clear();
                this.props.logoutHandler();
              }
              
              alert('existencia eliminada !!')
             
              //Actualizamos DATA   
              const requestOptions ={
                  method: 'GET',
                  headers : new Headers({
                    'Authorization': localStorage.getItem( 'token' ),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-type':'application/json'
                  }),
          
                }
            
                fetch('http://44.201.244.11:80/api/leeretiquetasalamo', requestOptions)
                    .then(response => response.json())
                    .then(data => {              
                        if(typeof data.err !== 'undefined' && data.err.message.length > 0){
                          localStorage.clear();
                          this.props.logoutHandler();
                        }else{
                            
                        }   
                        this.setState({
                          dataEtiquetas : data.data
                      })   
                                
                    })
                    .catch(err => {                 
                        console.log(err)
                    }) 
            })
            .catch(err => console.log(err))
      }else{

      }
    }


    render() {
        return (
            <div>
                <div className='configTablas'>                
                    <br></br>
                    <br></br>                   
                    <Button color='success' onClick={() => this.setState({modalRecepcion: !this.state.modalRecepcion})}>Ingresar Responsable Recepciones</Button>
                    <Table    
                        bordered   
                        borderless
                        striped
                        size="sm">
                        <tbody>
                        <tr>
                            <th>No.</th>
                            <th>Nombre Responsable Recepcion</th>
                            <th></th>
                        </tr>
                        {this.state.dataRecepcion.map((item, index) => {
                        return(
                            <>                        
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.nombre}</td>
                                <td className='titulotabla' onClick={() => this.elimiarPersonalRecepcion(item._id, item.nombre)}>Eliminar</td>
                            </tr>
                            </>
                            
                        )
                        })}   
                        </tbody>
                    </Table>
                    
                    <Button color='success' onClick={() => this.setState({modalRevision: !this.state.modalRevision})}>Ingresar Responsable Revision-Calidad</Button>
                    <Table    
                        bordered   
                        borderless
                        striped
                        size="sm">
                        <tbody>
                        <tr>
                            <th>No.</th>
                            <th>Nombre Responsable Revision - Calidad</th>
                            <th></th>
                        </tr>
                        {this.state.dataRevision.map((item, index) => {
                        return(
                            <>                        
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.nombre}</td>
                                <td className='titulotabla' onClick={() => this.elimiarPersonalRevision(item._id, item.nombre)}>Eliminar</td>
                            </tr>
                            </>
                            
                        )
                        })}   
                        </tbody>
                    </Table>
                    
                    <Button color='success' onClick={() => this.setState({modalBotellas: !this.state.modalBotellas})}>Ingresar Nueva Existencia - Botellas</Button>
                    <Table    
                        bordered   
                        borderless
                        striped
                        size="sm">
                        <tbody>
                        <tr>
                            <th>No.</th>
                            <th>Tipo Existencia</th>
                            <th></th>
                        </tr>
                        {this.state.dataBotellas.map((item, index) => {
                        return(
                            <>                        
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.botella}</td>
                                <td className='titulotabla' onClick={() => {this.eliminarBotellaAlamo(item.botella, item._id)}}>Eliminar</td>
                            </tr>
                            </>
                            
                        )
                        })}   
                        </tbody>
                    </Table>


                    <Button color='success' onClick={() => this.setState({modalTapas: !this.state.modalTapas})}>Ingresar Nueva Existencia - Tapas</Button>
                    <Table    
                        bordered   
                        borderless
                        striped
                        size="sm">
                        <tbody>
                        <tr>
                            <th>No.</th>
                            <th>Tipo Existencia</th>
                            <th></th>
                        </tr>
                        {this.state.dataTapas.map((item, index) => {
                        return(
                            <>                        
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.tapa}</td>
                                <td className='titulotabla' onClick={() => {this.eliminarTapaAlamo(item.tapa, item._id)}}>Eliminar</td>
                            </tr>
                            </>
                            
                        )
                        })}   
                        </tbody>
                    </Table>     


                    <Button color='success' onClick={() => this.setState({modalOtros: !this.state.modalOtros})}>Ingresar Nueva Existencia - Plastico y/o Cartones</Button>
                    <Table    
                        bordered   
                        borderless
                        striped
                        size="sm">
                        <tbody>
                        <tr>
                            <th>No.</th>
                            <th>Tipo Existencia</th>
                            <th></th>
                        </tr>
                        {this.state.dataOtros.map((item, index) => {
                        return(
                            <>                        
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.otros}</td>
                                <td className='titulotabla' onClick={() => {this.eliminarOtroAlamo(item.otros, item._id)}}>Eliminar</td>
                            </tr>
                            </>
                            
                        )
                        })}   
                        </tbody>
                    </Table>  


                    <Button color='success' onClick={() => this.setState({modalEtiquetas: !this.state.modalEtiquetas})}>Ingresar Nueva Existencia - Etiquetas</Button>
                    <Table    
                        bordered   
                        borderless
                        striped
                        size="sm">
                        <tbody>
                        <tr>
                            <th>No.</th>
                            <th>Tipo Existencia</th>
                            <th></th>
                        </tr>
                        {this.state.dataEtiquetas.map((item, index) => {
                        return(
                            <>                        
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.etiqueta}</td>
                                <td className='titulotabla' onClick={() => {this.eliminarEtiquetaAlamo(item.etiqueta, item._id)}}>Eliminar</td>
                            </tr>
                            </>
                            
                        )
                        })}   
                        </tbody>
                    </Table>             
                </div>

                <Modal isOpen={this.state.modalRecepcion}>
                    <ModalHeader>Ingresar personal recepcion existencias - Alamo</ModalHeader>
                    <ModalBody>
                        <Input
                            bsSize="sm"
                            className="mb-3"
                            placeholder="Nombre persona recepcion"
                            onChange={this.onChangeRecepcionPersonal}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.insertPersonalRecepcionAlamo}>
                        Agregar Existencia
                        </Button>
                        <Button color="secondary" onClick={() => this.setState({modalRecepcion: !this.state.modalRecepcion})}>
                        Cancel
                        </Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalRevision}>
                    <ModalHeader>Ingresar personal revision existencias - Alamo</ModalHeader>
                    <ModalBody>
                        <Input
                            bsSize="sm"
                            className="mb-3"
                            placeholder="Nombre persona revision"
                            onChange={this.onChangeRevisionPersonal}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.insertPersonalRevisionAlamo}>
                        Agregar Existencia
                        </Button>
                        <Button color="secondary" onClick={() => this.setState({modalRevision: !this.state.modalRevision})}>
                        Cancel
                        </Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalBotellas}>
                    <ModalHeader>Ingresar existencias - Alamo</ModalHeader>
                    <ModalBody>
                        <Input
                            bsSize="sm"
                            className="mb-3"
                            placeholder="Ingresar nueva existencia"
                            onChange={this.onChangeBotellasNuevas}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.insertBotellas}>
                        Agregar Existencia
                        </Button>
                        <Button color="secondary" onClick={() => this.setState({modalBotellas: !this.state.modalBotellas})}>
                        Cancel
                        </Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalBotellasActualizar}>
                    <ModalHeader>Actualizar existencia - Alamo</ModalHeader>
                    <ModalBody>
                        <p>Existencia: {this.state.botellaActualizar}</p>

                        <h3>Ingrese cambio en la Existencia:</h3>
                        <Input
                            bsSize="sm"
                            className="mb-3"
                            placeholder={this.state.botellaActualizar}
                            onChange={this.onChangeBotellasActualizar}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.actualizarBotellasAlamo}>
                        Actualizar Existencia
                        </Button>
                        <Button color="secondary" onClick={() => this.setState({modalBotellasActualizar: !this.state.modalBotellasActualizar})}>
                        Cancel
                        </Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalTapas}>
                    <ModalHeader>Ingresar tapas - Alamo</ModalHeader>
                    <ModalBody>
                        <Input
                            bsSize="sm"
                            className="mb-3"
                            placeholder="Ingresar nueva existencia"
                            onChange={this.onChangeTapasNuevas}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.insertTapa}>
                        Agregar Existencia
                        </Button>
                        <Button color="secondary" onClick={() => this.setState({modalTapas: !this.state.modalTapas})}>
                        Cancel
                        </Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.modalOtros}>
                    <ModalHeader>Ingresar carton y plasticos - Alamo</ModalHeader>
                    <ModalBody>
                        <Input
                            bsSize="sm"
                            className="mb-3"
                            placeholder="Ingresar nueva existencia"
                            onChange={this.onChangeOtrosNuevas}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.insertOtros}>
                        Agregar Existencia
                        </Button>
                        <Button color="secondary" onClick={() => this.setState({modalOtros: !this.state.modalOtros})}>
                        Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalEtiquetas}>
                    <ModalHeader>Ingresar Etiquetas - Alamo</ModalHeader>
                    <ModalBody>
                        <Input
                            bsSize="sm"
                            className="mb-3"
                            placeholder="Ingresar nueva existencia"
                            onChange={this.onChangeEtiquetasNuevas}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.insertEtiquetas}>
                        Agregar Existencia
                        </Button>
                        <Button color="secondary" onClick={() => this.setState({modalEtiquetas: !this.state.modalEtiquetas})}>
                        Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default AlamoConfig;