app.controller("ContratoControlador", function($scope, $rootScope, $http, $q, CONFIG, $filter, CONTRATO, DATOSFISCALES, datosUsuario, CocinasKService)
{    
    $scope.pasos = [{nombre:"Datos", numero:1}, {nombre:"Promociones", numero:2}, {nombre:"Plan de pagos", numero:3}, {nombre:"Pagos", numero:4}, {nombre:"Factura", numero:5}, {nombre:"Especificación", numero:6}];
    $scope.mensajeError = [];
    $scope.contrato = new Contrato();
    $scope.catalogos = {paso2: false, paso3: false, paso4:false, paso5: false, paso6: false};
    $scope.iva = 0;    
    
    $scope.hoy = GetHoy();
    
    $scope.$on('AgregarContrato',function(evento, presupuesto)
    {        
        $scope.catalogos = {paso2: false, paso3: false, paso4: false, paso5:false, paso6:false};
        $scope.operacion = "Agregar";
        $scope.usuario = datosUsuario.getUsuario();
        
        $scope.contrato = new Contrato();
        $scope.pasoContrato = 1;
        $scope.presupuesto = presupuesto;
        
        $scope.GetDatosPresupuesto();
        
        $scope.verPlanPago = false;
        //paso 2
        /*$scope.presupuesto.Proyecto.TipoProyecto.IVA = false;
        $scope.contrato.Subtotal = 16853;
        $scope.contrato.SubtotalCubierta = 7694;
        $scope.GetCatalogosPaso2();*/
        $scope.ModificarCompleto = true;
        
        $scope.mensajeError = [];
        
        $('#contratoModal').modal('toggle');
    });
    
    $scope.$on('EditarContrato',function(evento, presupuesto, contrato)
    {        
        $scope.contratoAux = contrato;
        $scope.catalogos = {paso2: false, paso3: false, paso4: false, paso5:false, paso6:false};
        $scope.operacion = "Editar";
        $scope.usuario = datosUsuario.getUsuario();
        
        $scope.contrato = new Contrato();
        $scope.pasoContrato = 1;
        $scope.presupuesto = presupuesto;
        
        $scope.GetPresupuestoPorProyecto(presupuesto.Proyecto.ProyectoId);
        $scope.GetDatosPresupuesto();
        
        $scope.verPlanPago = false;
        
        $scope.mensajeError = [];
        
        if($scope.contratoAux.ModificarCompleto == "0")
        {
            $scope.ModificarCompleto = false;
        }
        else
        {
            $scope.ModificarCompleto = true;
        }
        
        $('#contratoModal').modal('toggle');
    });
    
    $scope.GetDatosPresupuesto = function(opt)
    {
        //Fecha de venta
        $scope.contrato.FechaVenta = GetHoy2();
        
        //Tipo proyecto
        if(opt != "Cambio")
        {
            $scope.GetTipoProyectoId($scope.presupuesto.Proyecto.TipoProyecto.TipoProyectoId);
        }
        
        //Puertas
        for(var k=0; k<$scope.presupuesto.Puerta.length; k++)
        {
            $scope.GetPuertaPorMuestrario($scope.presupuesto.Puerta[k].MuestrarioId, $scope.presupuesto.Puerta[k]);
        }
        
        //Servicio
        for(var k=0; k<$scope.presupuesto.Servicio.length; k++)
        {
            if($scope.operacion == "Editar")
            {
                $scope.presupuesto.Servicio[k].Contrato = false;
            }
            else if($scope.operacion == "Agregar")
            {
                $scope.presupuesto.Servicio[k].Contrato = true;
            }
        }
        
        //Maqueo
        for(var k=0; k<$scope.presupuesto.Maqueo.length; k++)
        {
            $scope.GetGrupoMaqueo($scope.presupuesto.Maqueo[k]);
        }
        
        //Accesorio
        for(var i=0; i<$scope.presupuesto.Accesorio.length; i++)
        {
            for(var j=0; j<$scope.presupuesto.Accesorio[i].Muestrario.length; j++)
            {
                $scope.GetAccesorioPorMuestrario($scope.presupuesto.Accesorio[i].Muestrario[j]);
            }
            
            if($scope.presupuesto.Accesorio[i].Obligatorio == "1")
            {
                $scope.presupuesto.Accesorio[i].Contrato = true;
            }
            else
            {
                $scope.presupuesto.Accesorio[i].Contrato = false;
            }
        }
        
        //cubierta
        for(var i=0; i<$scope.presupuesto.TipoCubierta.length; i++)
        {
            // Ubicacion
            for(var j=0; j<$scope.presupuesto.TipoCubierta[i].Ubicacion.length; j++)
            {
                $scope.presupuesto.TipoCubierta[i].Ubicacion[j].Contrato = false;
            }
            
            //Material
            for(var j=0; j<$scope.presupuesto.TipoCubierta[i].Material.length; j++)
            {
                $scope.presupuesto.TipoCubierta[i].Material[j].PrecioVenta = 0;
                $scope.GetGrupoPorColor($scope.presupuesto.TipoCubierta[i].Material[j]);
            }
        }
        
        //Crear grupos para el manejo de los materiales de cubiertas
        $scope.grupoUbicacion = [];
        $scope.grupoUbicacion[0] = {Nombre:'', MaterialAux:"", MaterialSel:""};
        $scope.grupoUbicacion[1] = {Nombre:'', MaterialAux:"", MaterialSel:""};
        //$scope.grupoUbicacion[1] = {Nombre: "Cubierta", Grupo:"13", MaterialAux:"", MaterialSel:""};
        //$scope.grupoUbicacion[2] = {Nombre: "Backsplash e Isla", Grupo:"24", MaterialAux:"", MaterialSel:""};
        
        if($scope.operacion == "Editar")
        {
            $scope.SetDatosContrato($scope.contratoAux, $scope.contrato, opt);
        }
    };
    
    $scope.SetDatosContrato = function(data, contrato, opt)
    {
        contrato.FechaVenta2 = data.FechaVenta;
        contrato.FechaVenta = data.FechaVentaFormato;
        contrato.NoNotaCargo = data.NoNotaCargo;
        contrato.NoFactura = data.NoFactura;
        contrato.ProyectoNombre = data.ProyectoNombre;
        contrato.ContratoId = data.ContratoId;
        
        //--- Paso 1---
        
            //combinacion
        for(var k=0; k<$scope.presupuesto.CombinacionMaterial.length; k++)
        {
            if($scope.presupuesto.CombinacionMaterial[k].CombinacionMaterialId == data.OpcionContrato.CombinacionMaterialId)
            {
                $scope.SeleccionarCombinacion($scope.presupuesto.CombinacionMaterial[k]);
                break;
            }
        }
        
            //puerta    
        for(var k=0; k<$scope.presupuesto.Puerta.length; k++)
        {
            if($scope.presupuesto.Puerta[k].MuestrarioId == data.OpcionContrato.MuestrarioPuertaId)
            {
                contrato.Puerta = $scope.presupuesto.Puerta[k];
                
                if(data.OpcionContrato.PuertaId)
                {
                    contrato.Puerta.PuertaSeleccionada = {Nombre:data.OpcionContrato.NombrePuerta, PuertaId: data.OpcionContrato.PuertaId}; 
                }
                else
                {
                    contrato.Puerta.PuertaSeleccionada = {Nombre:'Pendiente', PuertaId: null}; 
                }
                break;
            }
        }
        
            //Servicios
        for(var k=0; k<$scope.presupuesto.Servicio.length; k++)
        {            
            for(var i=0; i<data.Servicio.length; i++)
            {
                if($scope.presupuesto.Servicio[k].ServicioId == data.Servicio[i].ServicioId)
                {
                    $scope.presupuesto.Servicio[k].Contrato = true;
                    break;
                }
            }
        }
        
            //Maqueo  
        for(var k=0; k<$scope.presupuesto.Maqueo.length; k++)
        {
            if($scope.presupuesto.Maqueo[k].MaqueoId == data.OpcionContrato.MaqueoId)
            {
                contrato.Maqueo = $scope.presupuesto.Maqueo[k];
                
                if(data.OpcionContrato.ColorMaqueoId)
                {
                    contrato.Maqueo.ColorSel = {Nombre:data.OpcionContrato.NombreColor, ColorId: data.OpcionContrato.ColorMaqueoId}; 
                }
                else
                {
                    contrato.Maqueo.ColorSel = {Nombre:'Pendiente', ColorId: null};    
                }
                
                break;
            }
        }
        
        
            //accesorios
        for(var k=0; k<$scope.presupuesto.Accesorio.length; k++)
        {
            for(var i=0; i<data.Accesorio.length; i++)
            {
                if($scope.presupuesto.Accesorio[k].TipoAccesorioId == data.Accesorio[i].TipoAccesorioId)
                {
                    $scope.presupuesto.Accesorio[k].Contrato = true;

                    for(var j=0; j<$scope.presupuesto.Accesorio[k].Muestrario.length; j++)
                    {
                        if($scope.presupuesto.Accesorio[k].Muestrario[j].MuestrarioId == data.Accesorio[i].MuestrarioId)
                        {
                            $scope.presupuesto.Accesorio[k].MuestrarioSel = $scope.presupuesto.Accesorio[k].Muestrario[j];
                            
                            if(data.Accesorio[i].AccesorioId)
                            {
                                $scope.presupuesto.Accesorio[k].MuestrarioSel.AccesorioSel = {Nombre:data.Accesorio[i].NombreAccesorio, AccesorioId: data.Accesorio[i].AccesorioId};
                            }
                            else
                            {
                                $scope.presupuesto.Accesorio[k].MuestrarioSel.AccesorioSel = {Nombre:'Pendiente', AccesorioId: null};
                            }
                            break;
                        }
                    }
                    
                    

                    break;
                }
            }
        }
        
            //cubierta
        contrato.TipoCubierta = {Nombre: 'No Incluye', TipoCubiertaId: null};
            
        //tipo cubierta
        if(data.Cubierta)
        {
            for(var k=0; k<$scope.presupuesto.TipoCubierta.length; k++)
            {
                if($scope.presupuesto.TipoCubierta[k].TipoCubiertaId == data.Cubierta.TipoCubiertaId)
                {
                    $scope.CambiarTipoCubierta($scope.presupuesto.TipoCubierta[k]);


                    for(var j=0; j<$scope.presupuesto.TipoCubierta[k].Material.length; j++)
                    {
                        if($scope.presupuesto.TipoCubierta[k].Material[j].MaterialId == data.Cubierta.MaterialId && $scope.presupuesto.TipoCubierta[k].Material[j].GrupoId == data.Cubierta.GrupoId )
                        {
                            $scope.contrato.TipoCubierta.GrupoUbicacion[0].MaterialAux = $scope.presupuesto.TipoCubierta[k].Material[j].NombreMaterial;
                            $scope.contrato.TipoCubierta.GrupoUbicacion[0].MaterialSel = $scope.presupuesto.TipoCubierta[k].Material[j];
                            break;
                        }
                    }

                    if(data.Cubierta.AcabadoCubiertaId)
                    {
                        contrato.TipoCubierta.Acabado = {Nombre:data.Cubierta.NombreAcabadoCubierta, AcabadoCubiertaId:data.Cubierta.AcabadoCubiertaId};
                    }
                    else
                    {
                        contrato.TipoCubierta.Acabado = {Nombre:'Pendiente', AcabadoCubiertaId:null};
                    }

                    if(data.Cubierta.ColorId)
                    {
                        $scope.contrato.TipoCubierta.GrupoUbicacion[0].MaterialSel.ColorSel = {Nombre:data.Cubierta.NombreColor, ColorId:data.Cubierta.ColorId}
                    }
                    else
                    {
                        $scope.contrato.TipoCubierta.GrupoUbicacion[0].MaterialSel.ColorSel = {Nombre:'Pendiente', ColorId:null};
                    }


                    break;
                }
            }
        
            //ubicacion
            if($scope.contrato.TipoCubierta.TipoCubiertaId)
            {
                for(var k=0; k<$scope.contrato.TipoCubierta.Ubicacion.length; k++)
                {
                    $scope.contrato.TipoCubierta.Ubicacion[k].Contrato = false;

                    for(var i=0; i<data.UbicacionCubierta.length; i++)
                    {
                        if(data.UbicacionCubierta[i].UbicacionCubiertaId == $scope.contrato.TipoCubierta.Ubicacion[k].UbicacionCubiertaId)
                        {
                            $scope.contrato.TipoCubierta.Ubicacion[k].Contrato = true;
                            $scope.GetPrecioVentaCubierta($scope.contrato.TipoCubierta.Ubicacion[k]);
                            break;
                        }
                    }
                }
            }
        }
        
        //--- Paso 2 ---
        contrato.ConceptoVenta = new ConceptoVenta();
        contrato.ConceptoVenta.Nombre = data.ConceptoVenta.Nombre;
        contrato.ConceptoVenta.ConceptoVentaId = data.ConceptoVenta.ConceptoVentaId;
        contrato.ConceptoVenta.IVA = data.ConceptoVenta.IVA == "1" ? true:false;
        
        $scope.QuitarPromocion('Mueble');
        $scope.QuitarPromocion('Cubierta');
        
        for(var k=0; k<data.Promocion.length; k++)
        {
            if(data.Promocion[k].TipoVentaId == "1")
            {
                contrato.PromocionMueble = $scope.SetPromocionDato(data.Promocion[k]);
            }
            else if(data.Promocion[k].TipoVentaId == "2")
            {
                contrato.PromocionCubierta = $scope.SetPromocionDato(data.Promocion[k]);
            }
        }
        
        //--- Paso 3 --
        if(opt != "Cambio")
        {
            $scope.AbonoContrato = data.Pago.slice(0);
            
            data.Anticipo = 0;

            for(var k=0; k<data.Pago.length; k++)
            {
                if(data.Pago[k].Concepto == "Anticipo" && data.Pago[k].Cancelado == "0")
                {
                    data.Pago[k] = $scope.SetPago(data.Pago[k]);
                    data.Anticipo  +=  data.Pago[k].Pago;
                }
                else
                {
                    data.Pago.splice(k,1);
                    k--;
                }
            }
        }
        
        $scope.contrato.AbonoContrato = $scope.AbonoContrato;
        
        //--- Paso 5 ---
        if(data.DatoFiscal.RFC)
        {
            $scope.CambiarDatoFiscal(data.DatoFiscal);
        }
        else
        {
            $scope.CambiarDatoFiscal('Venta al Publico');
        }
        
         //--- Paso 6 ---
        contrato.Especificacion = data.Especificacion;
    };
    
    $scope.SetPromocionDato = function(data)
    {
        var promocion = new Promocion();
        
        promocion.Descuento = parseInt(data.Descuento);
        promocion.DescuentoMinimo = parseInt(data.DescuentoMinimo);
        promocion.DescuentoMaximo = parseInt(data.DescuentoMaximo);
        promocion.NumeroPagos = parseInt(data.NumeroPagos);
        promocion.FechaLimite2 = data.FechaLimite;
        
        if(data.FechaLimite)
        {
            promocion.FechaLimite = TransformarFecha(data.FechaLimite);
        }
        else
        {
            promocion.FechaLimite  = null;
        }
        
        promocion.TipoVentaId = data.TipoVentaId;
        promocion.TipoPromocionId = data.TipoPromocionId;
        
        return promocion;
    };
    
    $scope.GetIVA = function()
    {
        GetIVA($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.iva = parseFloat(data[0].IVA)/100;
            }
            else
            {
                $scope.iva = 0;
            }
        }).catch(function(error)
        {
            $scope.iva = 0;
            alert(error);
        });
    };
    

    //----------------- Catálogos ----------------
    $scope.GetTipoProyectoId = function(id)      
    {
        GetTipoProyectoId($http, $q, CONFIG, id).then(function(data)
        {
            $scope.presupuesto.Proyecto.TipoProyecto = data[0];
            
            if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
            {
                $scope.GetAcabadoCubierta();
            }
                    
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPuertaPorMuestrario = function(muestrarioId, muestrario)      
    {
        muestrario.Puerta = [];
        GetPuertaPorMuestrario($http, $q, CONFIG, muestrarioId).then(function(data)
        {
            
            muestrario.Puerta = alasql("SELECT * FROM ? WHERE Activo = true", [data]);
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetGrupoMaqueo = function(maqueo)      
    {
        GetGrupoMaqueo($http, $q, CONFIG, maqueo.MaqueoId).then(function(data)
        {
            maqueo.Color = alasql("SELECT * FROM ? WHERE Activo = true", [data]);
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetAccesorioPorMuestrario = function(muestrario)      
    {
        GetAccesorioPorMuestrario($http, $q, CONFIG, muestrario.MuestrarioId).then(function(data)
        {
            muestrario.Accesorio = alasql("SELECT * FROM ? WHERE Activo = true", [data]);
            
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetGrupoPorColor = function(grupo)      
    {
        GetGrupoPorColor($http, $q, CONFIG, grupo.GrupoId).then(function(data)
        {
            grupo.Color = alasql("SELECT * FROM ? WHERE Activo = true", [data]);
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetAcabadoCubierta = function()      
    {
        GetAcabadoCubierta($http, $q, CONFIG).then(function(data)
        {
            $scope.acabado = alasql("SELECT * FROM ? WHERE Activo = true", [data]);
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPresupuestoPorProyecto = function(id)              
    {
        GetPresupuestoPorProyecto($http, $q, CONFIG, id, 0).then(function(data)
        {
            $scope.presupuestoProyecto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
            //------- Catálogos paso 2 --------
    $scope.GetConceptoVenta = function()      
    {
        GetConceptoVenta($http, $q, CONFIG).then(function(data)
        {
            $scope.conceptoVenta = alasql("SELECT * FROM ? WHERE Activo = true", [data]);
            
        }).catch(function(error)
        {
            $scope.conceptoVenta = [];
                
            alert(error);
        });
    };
    
    $scope.GetPlanPago = function()
    {   
        GetPlanPago($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                data = alasql("SELECT * FROM ? WHERE Activo = true", [data]);
                $scope.planPago = data;
                
                var fecha = new Date();
                var fechaEnt; 
                
                for(var k=0; k<data.length; k++)
                {
                    $scope.planPago[k].Abono = [];
                    
                    fechaEnt = new Date();
                    
                    if($scope.operacion == "Editar")
                    {
                        var y = $scope.contratoAux.FechaVenta.slice(0,4);
                        var m = parseInt($scope.contratoAux.FechaVenta.slice(5,7))-1;
                        var d = $scope.contratoAux.FechaVenta.slice(8);

                        fecha = new Date(y, m, d);
                    }
                    
                    fechaEnt.setDate(fecha.getDate()+parseInt($scope.planPago[k].FechaEntrega));

                    $scope.planPago[k].FechaFin = fechaEnt.getDate() + "/" + GetMesNombre(fechaEnt.getMonth()) + "/" + fechaEnt.getFullYear();
                    $scope.planPago[k].FechaFin2 = new Date(fechaEnt.getFullYear(), fechaEnt.getMonth(), fechaEnt.getDate());
                    
                    $scope.planPago[k].Contrato = false;
                }
                
                if($scope.operacion == "Editar")
                {                    
                    var val = $scope.contratoAux.Anticipo;
                    {
                        if(val > $scope.contrato.TotalContrato)
                        {
                            $scope.anticipo.uno = $scope.contrato.TotalContrato.toString();
                        }
                        else
                        {
                            $scope.anticipo.uno = val.toString();
                        }
                    }

                    for(var k=0; k<data.length; k++)
                    {
                        data[k].Contrato = true;
                        if(data[k].PlanPagoId == $scope.contratoAux.PlanPagoId)
                        {
                            $scope.CambiarPlan(data[k]);
                            break;
                        }
                    }
                }
            }
            else
            {
                $scope.planPago = [];
            }
            
        }).catch(function(error)
        {
            $scope.planPago = [];
            //alert(error);
        });
    };
    
        //------------------- catálogos paso 3
    
    $scope.GetPlanPagoAbono = function(dato)
    {
        GetPlanPagoAbono($http, $q, CONFIG, dato.PlanPagoId).then(function(data)
        {   
            dato.Abono = data;
            $scope.CalcularAbono(dato);
        }).catch(function(error)
        {
            dato.Abono = [];
            alert(error);
        });
    };
    
        //------------------- catálogos paso 4
    
    $scope.GetMedioPago = function()      
    {
        GetMedioPago($http, $q, CONFIG).then(function(data)
        {
            $scope.medioPago = alasql("SELECT * FROM ? WHERE Activo = true", [data]);
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
        //-------------------- catálogos paso 5
    $scope.GetParametro = function()
    {
        GetParametro($http, $q, CONFIG, 1).then(function(data)
        {
            $scope.facturar = data[0].Valor == 'Si' ? true : false;
            $scope.SetVarPaso5();
        }).catch(function(error)
        {
            $scope.parametro = [];
            alert(error);
        });
    };
    
    $scope.GetDatosFiscales = function()              
    {
        GetDatosFiscales($http, $q, CONFIG, $scope.presupuesto.Persona.PersonaId).then(function(data)
        {
            $scope.presupuesto.Persona.DatosFiscales = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDireccionPersona = function()              
    {
        GetDireccionPersona($http, $q, CONFIG, $scope.presupuesto.Persona.PersonaId).then(function(data)
        {
            $scope.presupuesto.Persona.Domicilio = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetMedioContactoPersona = function()              
    {
        GetMedioContactoPersona($http, $q, CONFIG, $scope.presupuesto.Persona.PersonaId).then(function(data)
        {
            $scope.presupuesto.Persona.Contacto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
            //------------------------ catálogos paso 6
    $scope.GetDescripcionContrato = function()      
    {
        GetDescripcionContrato($http, $q, CONFIG).then(function(data)
        {
            $scope.descripcion = data;  
            $scope.SetDescripcionContrato();
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetNumeroContrato = function()
    {   
        (self.servicioObj = CocinasKService.Get('Contrato/Numero' )).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.numeroContrato = dataResponse.data[0].Numero;
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede cargar la información.", 'error');
                $scope.encuesta = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
    
    //------- Paso 1 ----------
    $scope.GetDatosPresupuestoServicio = function(presupuesto)              
    {
        GetDatosPresupuesto($http, $q, CONFIG, presupuesto).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.presupuesto = data[1].Presupuesto;
                
                $scope.catalogos = {paso2: false, paso3: false, paso4: false, paso5:false, paso6:false};
                $scope.contrato = new Contrato();
                $scope.GetDatosPresupuesto("Cambio");
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
                $('#mensajePerfil').modal('toggle');
            }
            //proyecto.Presupuesto = data;
        
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    $scope.CambiarPresupuesto = function(presupuesto)
    {
        if(presupuesto.PresupuestoId != $scope.presupuesto.PresupuestoId)
        {
            presupuesto.Proyecto = $scope.presupuesto.Proyecto;
            presupuesto.Persona = $scope.presupuesto.Persona;
            presupuesto.PromocionMueble = $scope.presupuesto.PromocionMueble;
            presupuesto.PromocionCubierta = $scope.presupuesto.PromocionCubierta;
            
            $scope.GetDatosPresupuestoServicio(presupuesto);
        }
    };
    
    $scope.SeleccionarCombinacion = function(combinacion)
    {
        if($scope.contrato.Combinacion.CombinacionMaterialId != combinacion.CombinacionMaterialId)
        {
            $scope.contrato.Combinacion = combinacion;
            $scope.GetPrecioVentaPuerta();
            $scope.GetPrecioVentaAccesorioMadera();
        }
            
    };
    
    $scope.GetPrecioVentaPuerta = function()
    {
        for(var i=0; i<$scope.presupuesto.Puerta.length; i++)
        {  
            for(var j=0; j<$scope.presupuesto.Puerta[i].Combinacion.length; j++)
            {
                if($scope.presupuesto.Puerta[i].Combinacion[j].CombinacionMaterialId == $scope.contrato.Combinacion.CombinacionMaterialId)
                {
                    $scope.presupuesto.Puerta[i].Precio = $scope.presupuesto.Puerta[i].Combinacion[j].PrecioVenta;
                }
            }
        }
    };
    
    $scope.GetPrecioVentaAccesorioMadera = function()
    {
        for(var i=0; i<$scope.presupuesto.Accesorio.length; i++)
        {  
            if($scope.presupuesto.Accesorio[i].ClaseAccesorioId == "2")
            {
                for(var j=0; j<$scope.presupuesto.Accesorio[i].Muestrario.length; j++)
                {
                    for(var k=0; k<$scope.presupuesto.Accesorio[i].Muestrario[j].Combinacion.length; k++)
                    {
                        if($scope.presupuesto.Accesorio[i].Muestrario[j].Combinacion[k].CombinacionMaterialId == $scope.contrato.Combinacion.CombinacionMaterialId)
                        {
                            $scope.presupuesto.Accesorio[i].Muestrario[j].PrecioVenta = $scope.presupuesto.Accesorio[i].Muestrario[j].Combinacion[k].PrecioVenta;
                        }
                    }
                }
            }
        }
    }; 

    $scope.GetPrecioVentaCubierta = function(ubicacion)
    {
        if(ubicacion.UbicacionCubiertaId == "1")
        {
            for(var j=0; j<$scope.contrato.TipoCubierta.Ubicacion.length; j++)
            {
                if($scope.contrato.TipoCubierta.Ubicacion[j].UbicacionCubiertaId == "3")
                {
                    $scope.contrato.TipoCubierta.Ubicacion[j].Contrato = ubicacion.Contrato;
                    break;
                }
            }
        }
        
        for(var i=0; i<$scope.presupuesto.TipoCubierta.length; i++)
        {            
            //Material
            for(var j=0; j<$scope.presupuesto.TipoCubierta[i].Material.length; j++)
            {
                $scope.presupuesto.TipoCubierta[i].Material[j].PrecioVenta = 0;
                
                for(var m=0; m<$scope.presupuesto.TipoCubierta[i].Ubicacion.length; m++)  //Ubicacion seleccionada al presupuestar
                {
                    if($scope.presupuesto.TipoCubierta[i].Ubicacion[m].Contrato)
                    {
                        for(var n=0; n<$scope.presupuesto.TipoCubierta[i].Material[j].Ubicacion.length; n++) //Precio de la ubicacion por el material
                        {
                            if($scope.presupuesto.TipoCubierta[i].Material[j].Ubicacion[n].UbicacionCubiertaId == $scope.presupuesto.TipoCubierta[i].Ubicacion[m].UbicacionCubiertaId)
                            {
                                $scope.presupuesto.TipoCubierta[i].Material[j].PrecioVenta += parseFloat($scope.presupuesto.TipoCubierta[i].Material[j].Ubicacion[n].PrecioVenta);
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        $scope.GetGrupoUbicacionCubierta($scope.contrato.TipoCubierta);
    };
    
    $scope.CambiarTipoCubierta = function(tipo)
    {
        if($scope.contrato.TipoCubierta.TipoCubiertaId != tipo.TipoCubiertaId)
        {
            $scope.contrato.TipoCubierta = tipo;
            $scope.GetGrupoUbicacionCubierta($scope.contrato.TipoCubierta);
            
            if(tipo.TipoCubiertaId == "1")
            {
                $scope.contrato.TipoCubierta.Acabado = new AcabadoCubierta();
                $scope.contrato.TipoCubierta.Acabado.AcabadoCubiertaId = null; 
            }
        }
    };
    
    $scope.GetGrupoUbicacionCubierta = function(tipo)
    {
        var grupo = [];
        
        if(tipo.TipoCubiertaId == "2")
        {
            grupo[0] = $scope.grupoUbicacion[0];
        }
        else if(tipo.TipoCubiertaId == "1")
        {
            grupo[0] = $scope.grupoUbicacion[1];
        }
        /*else if(tipo.TipoCubiertaId == "1")
        {
            var c13 = false; //grupo de ubicacion cubierta y barra
            var c24 = false; //grupo de ubicacion backsplash e isla
            
            for(var k=0; k<tipo.Ubicacion.length; k++)
            {
                if(tipo.Ubicacion[k].Contrato)
                {
                    if(tipo.Ubicacion[k].UbicacionCubiertaId == "1" || tipo.Ubicacion[k].UbicacionCubiertaId == "3")
                    {
                        c13 = true;
                    }
                    else if(tipo.Ubicacion[k].UbicacionCubiertaId == "2" || tipo.Ubicacion[k].UbicacionCubiertaId == "4")
                    {
                        c24 = true;
                    }
                }
            }
            
            if(c13)
            {
               grupo[0] = $scope.grupoUbicacion[1];
            }
            if(c24)
            {
                grupo[grupo.length] = $scope.grupoUbicacion[2];
            }
        }*/
    
        $scope.contrato.TipoCubierta.GrupoUbicacion = grupo;
        
        return grupo;
    };
    
    $scope.ShowMaterial = function(ubicacion, grupo)
    {
        if($scope.contrato.TipoCubierta.TipoCubiertaId == "2")
        {
            return true;
        }
        if($scope.contrato.TipoCubierta.TipoCubiertaId == "1")
        {
            for(var k=0; k<ubicacion.length; k++)
            {
                if(grupo.Grupo == "13")
                {
                    if(ubicacion[k].UbicacionCubiertaId == "1" || ubicacion[k].UbicacionCubiertaId == "3" )
                    {
                        return true;
                    }
                }

                if(grupo.Grupo == "24")
                {
                    if(ubicacion[k].UbicacionCubiertaId == "2" || ubicacion[k].UbicacionCubiertaId == "4" )
                    {
                        return true;
                    }
                }
            }
        }
    };
    
    $scope.ValidarPaso1 = function()
    {
        $scope.mensajeError = [];
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            if($scope.contrato.Combinacion.CombinacionMaterialId.length == 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "Selecciona una combinación"; 
            }
            
            if($scope.contrato.Puerta == null)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un muestrario de puerta."; 
            }
            else
            {
                if($scope.contrato.Puerta.PuertaSeleccionada == null || $scope.contrato.Puerta.PuertaSeleccionada == undefined)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "Selecciona una puerta."; 
                }
            }
            
            if($scope.contrato.Maqueo == null)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un muestrario de maqueo."; 
            }
            else
            {
                if($scope.contrato.Maqueo.ColorSel == null || $scope.contrato.Maqueo.ColorSel == undefined)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un color de maqueo."; 
                }
            }
            
            for(var k=0; k<$scope.presupuesto.Accesorio.length; k++)
            {
                if($scope.presupuesto.Accesorio[k].Contrato)
                {
                    if($scope.presupuesto.Accesorio[k].MuestrarioSel == null || $scope.presupuesto.Accesorio[k].MuestrarioSel == undefined)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un muestrario de " + $scope.presupuesto.Accesorio[k].Nombre + "."; 
                    }
                    else
                    {
                        if($scope.presupuesto.Accesorio[k].MuestrarioSel.AccesorioSel == null || $scope.presupuesto.Accesorio[k].MuestrarioSel.AccesorioSel == undefined)
                        {
                            $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un accesorio de " + $scope.presupuesto.Accesorio[k].Nombre + "."; 
                        }
                    }
                }
            }
        }
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado || $scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            if($scope.contrato.TipoCubierta.Nombre.length == 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un tipo de cubierta."; 
            }
            else if($scope.contrato.TipoCubierta.Nombre != "No Incluye")
            {
                var ubicacion = false;
                
                for(var k=0; k<$scope.contrato.TipoCubierta.Ubicacion.length; k++)
                {
                    if($scope.contrato.TipoCubierta.Ubicacion[k].Contrato)
                    {
                        ubicacion = true;
                    }
                }
                
                if(!ubicacion)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "Selecciona almenos una ubicación de la cubierta."; 
                }
                else
                {
                    for(var k=0; k<$scope.contrato.TipoCubierta.GrupoUbicacion.length; k++)
                    {
                        if($scope.contrato.TipoCubierta.GrupoUbicacion[k].MaterialAux.length == 0)
                        {
                            $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un material para la cubierta."; 
                        }
                        else
                        {
                            if($scope.contrato.TipoCubierta.GrupoUbicacion[k].MaterialSel.MaterialId == null || $scope.contrato.TipoCubierta.GrupoUbicacion[k].MaterialSel.MaterialId == undefined)
                            {
                                $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un muestrario para la cubierta."; 
                            }
                            else
                            {
                                if($scope.contrato.TipoCubierta.GrupoUbicacion[k].MaterialSel.ColorSel == null || $scope.contrato.TipoCubierta.GrupoUbicacion[k].MaterialSel.ColorSel == undefined)
                                {
                                    $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un color para la cubierta."; 
                                }
                            }
                        }
                    }
                }
                
                //acabado
                if($scope.contrato.TipoCubierta.TipoCubiertaId == "2")
                {
                    if($scope.contrato.TipoCubierta.Acabado != null || $scope.contrato.TipoCubierta.Acabado != undefined)
                    {
                        if($scope.contrato.TipoCubierta.Acabado.Nombre.length == 0)
                        {
                            $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un acabado para la cubierta.";
                        }
                    }
                    else
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un acabado para la cubierta.";
                    }
                }
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.CalcularContratoSubtotal = function()
    {
        $scope.contrato.Servicio = [];
        $scope.contrato.Accesorio = [];
        
        $scope.contrato.Subtotal = 0;
        $scope.contrato.SubtotalCubierta = 0;
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            //Combinacion
            $scope.contrato.Subtotal += parseFloat($scope.contrato.Combinacion.PrecioVenta);
            
            //Puerta
            $scope.contrato.Subtotal += parseFloat($scope.contrato.Puerta.Precio);
            
            //Servicio
            for(var k=0; k<$scope.presupuesto.Servicio.length; k++)
            {
                if($scope.presupuesto.Servicio[k].Contrato)
                {
                    $scope.contrato.Subtotal += parseFloat($scope.presupuesto.Servicio[k].PrecioVenta);
                    $scope.contrato.Servicio.push($scope.presupuesto.Servicio[k]);
                }
            }
            
            //Maqueo
            $scope.contrato.Subtotal += parseFloat($scope.contrato.Maqueo.PrecioVenta);
            
            //Accesorios
            for(var k=0; k<$scope.presupuesto.Accesorio.length; k++)
            {
                if($scope.presupuesto.Accesorio[k].Contrato)
                {
                    $scope.contrato.Subtotal += parseFloat($scope.presupuesto.Accesorio[k].MuestrarioSel.PrecioVenta);
                }
                
                $scope.contrato.Accesorio.push($scope.presupuesto.Accesorio[k]);
            }
            
            if($scope.presupuesto.Proyecto.TipoProyecto.IVA)
            {
                $scope.contrato.Subtotal = ($scope.contrato.Subtotal * 100)/116;
            }
        }
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado || $scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            if($scope.contrato.TipoCubierta.Nombre !== "No Incluye")
            {
                for(var k=0; k<$scope.contrato.TipoCubierta.GrupoUbicacion.length; k++)
                {
                    if($scope.contrato.TipoCubierta.TipoCubiertaId == '1')
                    {
                        $scope.contrato.Subtotal += parseFloat($scope.contrato.TipoCubierta.GrupoUbicacion[k].MaterialSel.PrecioVenta);
                    }
                    else if($scope.contrato.TipoCubierta.TipoCubiertaId == '2')
                    {
                        $scope.contrato.SubtotalCubierta += parseFloat($scope.contrato.TipoCubierta.GrupoUbicacion[k].MaterialSel.PrecioVenta);
                    }
                }
            }
            
            if($scope.presupuesto.Proyecto.TipoProyecto.IVA)
            {
                $scope.contrato.SubtotalCubierta = ($scope.contrato.SubtotalCubierta * 100)/116;
            }
        }
    };
    
    //--------------------------- PASO 2 ----------
    $scope.GetCatalogosPaso2 = function()
    {
        if(!$scope.catalogos.paso2)
        {
            $scope.catalogos.paso2 = true;
            
            $scope.GetConceptoVenta();
        }
            
        $scope.CalcularValoresContratoMueble();
        $scope.CalcularValoresContratoCubierta();
        
    };
    
    $scope.CambiarConceptoVenta = function()
    {
        if(!$scope.presupuesto.Proyecto.TipoProyecto.IVA)
        {
            $scope.CalcularValoresContratoMueble();
            $scope.CalcularValoresContratoCubierta();
        }
    };
    
    $scope.CalcularValoresContratoMueble = function()
    {   
        $scope.contrato.TotalMueble = 0;
        $scope.contrato.DescuentoMueble = 0;
        $scope.contrato.IVAMueble = 0;
        $scope.contrato.SubtotalMueble = 0;
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            if($scope.presupuesto.Proyecto.TipoProyecto.IVA || ($scope.contrato.ConceptoVenta.ConceptoVentaId.length > 0 && $scope.contrato.ConceptoVenta.IVA))
            {
                $scope.contrato.TotalMueble = Math.round($scope.contrato.Subtotal + ($scope.contrato.Subtotal*$scope.iva));
            }
            else
            {
                $scope.contrato.TotalMueble = $scope.contrato.Subtotal;
            }
            
            if($scope.contrato.PromocionMueble.TipoPromocionId == "1" || $scope.contrato.PromocionMueble.TipoPromocionId == "3")
            {
                $scope.contrato.DescuentoMueble = Math.ceil(($scope.contrato.TotalMueble*parseFloat($scope.contrato.PromocionMueble.Descuento)/100));
            }
            else
            {
                $scope.contrato.DescuentoMueble = 0;
            }
            
            $scope.contrato.TotalMueble -= $scope.contrato.DescuentoMueble;
            
            if($scope.contrato.PromocionMueble.TipoPromocionId == "1" || $scope.contrato.PromocionMueble.TipoPromocionId == "3")
            {
                $scope.contrato.DescuentoMueble = Math.ceil(($scope.contrato.Subtotal*parseFloat($scope.contrato.PromocionMueble.Descuento)/100));
            }
            else
            {
                $scope.contrato.DescuentoMueble = 0;
            }
            
            if($scope.presupuesto.Proyecto.TipoProyecto.IVA || ($scope.contrato.ConceptoVenta.ConceptoVentaId.length > 0 && $scope.contrato.ConceptoVenta.IVA))
            {
                $scope.contrato.IVAMueble = (($scope.contrato.TotalMueble * $scope.iva)/(1+$scope.iva)).toFixedDown(2);
            }
            else
            {
                $scope.contrato.IVAMueble = 0;
            }
            

            $scope.contrato.SubtotalMueble = $scope.contrato.TotalMueble - $scope.contrato.IVAMueble + $scope.contrato.DescuentoMueble;
        }
        
    };
    
    $scope.CalcularValoresContratoCubierta = function()
    {    
        $scope.contrato.TotalCubierta = 0;
        $scope.contrato.DescuentoCubierta = 0;
        $scope.contrato.IVACubierta = 0;
        $scope.contrato.SubtotalCubierta2 = 0;
        
        if($scope.contrato.SubtotalCubierta > 0)
        {
            if($scope.presupuesto.Proyecto.TipoProyecto.IVA || ($scope.contrato.ConceptoVenta.ConceptoVentaId.length > 0 && $scope.contrato.ConceptoVenta.IVA))
            {
                $scope.contrato.TotalCubierta = Math.round($scope.contrato.SubtotalCubierta + ($scope.contrato.SubtotalCubierta*$scope.iva));
            }
            else
            {
                $scope.contrato.TotalCubierta = $scope.contrato.SubtotalCubierta;
            }
            
            
            if($scope.contrato.PromocionCubierta.TipoPromocionId == "1" || $scope.contrato.PromocionCubierta.TipoPromocionId == "3")
            {
                $scope.contrato.DescuentoCubierta = Math.ceil(($scope.contrato.TotalCubierta*parseFloat($scope.contrato.PromocionCubierta.Descuento)/100));
            }
            else
            {
                $scope.contrato.DescuentoCubierta = 0;
            }
            
            $scope.contrato.TotalCubierta -= $scope.contrato.DescuentoCubierta;
            
            
            if($scope.contrato.PromocionCubierta.TipoPromocionId == "1" || $scope.contrato.PromocionCubierta.TipoPromocionId == "3")
            {
                $scope.contrato.DescuentoCubierta = Math.ceil(($scope.contrato.SubtotalCubierta*parseFloat($scope.contrato.PromocionCubierta.Descuento)/100));
            }
            else
            {
                $scope.contrato.DescuentoCubierta = 0;
            }
            
            if($scope.presupuesto.Proyecto.TipoProyecto.IVA || ($scope.contrato.ConceptoVenta.ConceptoVentaId.length > 0 && $scope.contrato.ConceptoVenta.IVA))
            {
                $scope.contrato.IVACubierta = (($scope.contrato.TotalCubierta * $scope.iva)/(1+$scope.iva)).toFixedDown(2);
            }
            else
            {
                $scope.contrato.IVACubierta = 0;
            }
            

            $scope.contrato.SubtotalCubierta2= $scope.contrato.TotalCubierta - $scope.contrato.IVACubierta + $scope.contrato.DescuentoCubierta;
        }
    };
    
    $scope.CalcularTotalContrato = function()
    {
        var totalP = 0;
        var totalMs = 0;
        
        if($scope.contrato.PromocionMueble.TipoPromocionId != "2")
        {
            totalP += $scope.contrato.TotalMueble;
        }
        else
        {
            totalMs += $scope.contrato.TotalMueble;
        }
        
        if($scope.contrato.PromocionCubierta.TipoPromocionId != "2")
        {
            totalP += $scope.contrato.TotalCubierta;
        }
        else
        {
            totalMs += $scope.contrato.TotalCubierta;
        }
        
        $scope.contrato.TotalPlan = totalP;
        $scope.contrato.TotalMeses = totalMs;
        $scope.contrato.TotalContrato = totalP + totalMs;
    };
    
    $scope.QuitarPromocion = function(promocion)
    {
        if(promocion == 'Mueble')
        {
            $scope.contrato.PromocionMueble = new Promocion();
            $scope.contrato.PromocionMueble.TipoPromocionId = "0";
        
            $scope.CalcularValoresContratoMueble();
        }
        else if(promocion == 'Cubierta')
        {
            $scope.contrato.PromocionCubierta = new Promocion();
            $scope.contrato.PromocionCubierta.TipoPromocionId = "0";
            
            $scope.CalcularValoresContratoCubierta();
        }
    };
    
    $scope.ValidarPaso2 = function()
    {
        $scope.mensajeError = [];
        if($scope.contrato.ConceptoVenta.ConceptoVentaId.length == 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un concepto de venta."; 
        }
        
        if($scope.contrato.PromocionMueble.TipoPromocionId.length == 0 && $scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una promoción para los muebles."; 
        }
        
        if($scope.contrato.PromocionCubierta.TipoPromocionId.length == 0 && $scope.contrato.SubtotalCubierta > 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una promoción para la cubierta de piedra."; 
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
            
    };
    
    $scope.GetDescuentoMinimo = function(promocion)
    {
        if(promocion.FechaLimite2 >= $scope.hoy)
        {
            return promocion.DescuentoMinimo;
        }
        else
        {
            return 0;
        }
    };
    
    //----------------------- PASO 3 ---------------------------
    $scope.GetCatalogosPaso3 = function()
    {
        if(!$scope.catalogos.paso3)
        {
            $scope.catalogos.paso3 = true;
            $scope.GetPlanPago();
            $scope.contrato.PagoAnticipo = 1;
            $scope.anticipo = {uno:"", dos:"", minimo:0};
        }
        else
        {
            $scope.SetAnticipo1();
            /*for(var k=0; k<$scope.planPago.length; k++)
            {
                if($scope.planPago[k].Contrato)
                {
                    $scope.CalcularAbono($scope.planPago[k]);
                    break;
                }
            }*/
        }
    };
    
    $scope.CambiarNumeroAnticipo = function(val)
    {
        if($scope.contrato.PagoAnticipo != val)
        {
            $scope.contrato.PagoAnticipo = val; 
            
            for(var k=0; k<$scope.planPago.length; k++)
            {
                if($scope.planPago[k].Contrato)
                {
                    $scope.CalcularAbono($scope.planPago[k]);
                    break;
                }
            }
        }
    };
    
    $scope.CambiarPlan = function(plan)
    {
        if(plan.Contrato)
        {
            if(plan.Abono.length == 0)
            {
                $scope.GetPlanPagoAbono(plan);
            }
            else
            {
                $scope.CalcularAbono(plan);
            }
            
            for(var k=0; k<$scope.planPago.length; k++)
            {
                if($scope.planPago[k].PlanPagoId != plan.PlanPagoId)
                {
                    $scope.planPago[k].Contrato = false;
                }
            }
        }
        else
        {
            $scope.contrato.PlanPago = new PlanPago();
        }
    };
    
    $scope.SetAnticipo1 = function(ival)
    {
        if(ival)
        {
            $scope.anticipo.uno = "";
        }
        else
        {
            var val = parseInt($scope.anticipo.uno);
            {
                if(val > $scope.contrato.TotalContrato)
                {
                    $scope.anticipo.uno = $scope.contrato.TotalContrato.toString();
                }
            }
        }

        for(var k=0; k<$scope.planPago.length; k++)
        {
            if($scope.planPago[k].Contrato)
            {
                $scope.CalcularAbono($scope.planPago[k]);
                break;
            }
        }
    };
    
    $scope.CalcularAbono = function(planPago)
    {
        var fecha, mes;
        var total = $scope.contrato.TotalContrato;
        var abono;
        var acumulado = 0;
        var sobrante = 0;
        
        var plan = jQuery.extend({}, planPago);
        plan.Abono = [];
        
        for(var k=0; k<planPago.Abono.length; k++)
        {
            plan.Abono[k] = jQuery.extend({}, planPago.Abono[k]);
        }
        
        if(planPago.Abono.length > 1)
        {   
            if($scope.contrato.PagoAnticipo == 2)
            {
                var abono = new Object();
                abono.Abono = 0;
                abono.NumeroAbono = 1;

                for(var k=0; k<plan.Abono.length; k++)
                {
                    if(plan.Abono[k].NumeroAbono == 1)
                    {
                        abono.Dias = Math.ceil(plan.Abono[k].Dias/2); 
                        plan.Abono[k].NumeroAbono++;
                    }
                    else if(plan.Abono[k].NumeroAbono > 0)
                    {
                        plan.Abono[k].NumeroAbono++;
                    }
                }

                plan.Abono.push(abono);
            }
        }
        else
        {
            $scope.contrato.PagoAnticipo = 1;
        }
        
        plan.Abono = alasql("SELECT * FROM ? ORDER BY NumeroAbono ASC", [plan.Abono]);
        
        for(var k=0; k<plan.Abono.length; k++)
        {
            fecha = new Date();
            
            if($scope.operacion == "Editar")
            {
                var y = $scope.contratoAux.FechaVenta.slice(0,4);
                var m = parseInt($scope.contratoAux.FechaVenta.slice(5,7))-1;
                var d = $scope.contratoAux.FechaVenta.slice(8);
                
                fecha = new Date(y, m, d);
            }
            
            fecha.setDate(fecha.getDate() + parseInt(plan.Abono[k].Dias));
            
            mes = parseInt(fecha.getMonth());
            var mes2 = mes + 1;
            if(mes2 < 10)
            {
                mes2 = "0" + mes2;
            }
            
            var dia = parseInt(fecha.getDate());
            if(dia < 10)
            {
                dia = "0" + dia;
            }
            
            plan.Abono[k].FechaCompromiso = dia+ "/" + Month[mes] + "/" + fecha.getFullYear();
            plan.Abono[k].FechaCompromiso2 = fecha.getFullYear()+ "/" + mes2 + "/" + dia;
            
            
            if(k == 0)
            {
                var pago =  Math.round((total*parseFloat(plan.Abono[k].Abono))/100);
                $scope.anticipo.minimo = pago;
                
                $scope.anticipo.mindef = $scope.anticipo.minimo > $scope.contrato.TotalMeses ? $scope.anticipo.minimo : $scope.contrato.TotalMeses;
                
                if($scope.anticipo.uno.length > 0)
                {
                    var val = parseInt($scope.anticipo.uno);
                    
                    if(val < $scope.contrato.TotalMeses && $scope.ModificarCompleto)
                    {
                        $scope.anticipo.uno = $scope.contrato.TotalMeses.toString();
                    }
                    
                    if($scope.anticipo.mindef > parseInt($scope.anticipo.uno))
                    {
                        if($scope.contrato.TotalMeses == $scope.anticipo.mindef && $scope.ModificarCompleto)
                        {
                            if($scope.contrato.PagoAnticipo == 2)
                            {
                                $scope.CambiarNumeroAnticipo(1);
                                return;
                            }
                        }
                        else
                        {   
                            if(planPago.Abono.length > 1)
                            {
                                if( $scope.contrato.PagoAnticipo == 1)
                                {
                                    $scope.CambiarNumeroAnticipo(2);
                                    return;
                                }
                            }
                            else
                            {
                                $scope.anticipo.uno = $scope.anticipo.minimo;
                            }
                        }
                    }
                    
                    plan.Abono[k].Pago = parseFloat($scope.anticipo.uno);
                }
                else
                {
                    if($scope.contrato.PagoAnticipo == 2)
                    {
                        $scope.anticipo.uno = Math.round(pago/2);
                    }
                    else
                    {
                        $scope.anticipo.uno = pago;
                    }
                    
                    if($scope.anticipo.uno < $scope.contrato.TotalMeses)
                    {
                        $scope.anticipo.uno = $scope.contrato.TotalMeses;
                    }
                    
                    plan.Abono[k].Pago = $scope.anticipo.uno;
                }
                
                acumulado += plan.Abono[k].Pago;
                
                var paux = $scope.anticipo.mindef > plan.Abono[k].Pago ? $scope.anticipo.mindef : plan.Abono[k].Pago;
                
                sobrante = paux - $scope.anticipo.minimo;

                if(sobrante < 0) 
                {
                    sobrante = 0;
                }
                
                plan.Abono[k].Concepto = "Anticipo";
            }
            else
            {
                if($scope.contrato.PagoAnticipo == 2 && plan.Abono[k].NumeroAbono == 1)
                {
                    var pago = $scope.anticipo.mindef - parseInt($scope.anticipo.uno);
                    if(pago<=0)
                    {
                        pago = 0;
                        $scope.CambiarNumeroAnticipo(1);
                        return;
                    }
                    
                    plan.Abono[k].Pago = pago;
                    acumulado += pago;
                    $scope.anticipo.dos = pago;
                    
                    plan.Abono[k].Concepto = "Anticipo";
                }
                else
                {
                    var pago = 0;
                    
                    if(k == plan.Abono.length-1)
                    {
                        pago = total - acumulado;
                        if(pago < 0)
                        {
                            pago = 0;
                        }
                    }
                    else
                    {
                        pago =  Math.round((total*parseFloat(plan.Abono[k].Abono))/100);
                        
                        var aux = pago;
                        pago -= sobrante;

                        if(pago < 0)
                        {
                            pago = 0;
                        }

                        sobrante -= (aux - pago);

                        if(sobrante < 0)
                        {
                            sobrante = 0;
                        }
                    }
                    
                    
                    
                    acumulado += pago;
                    plan.Abono[k].Pago = pago;

                    plan.Abono[k].Concepto = "Abono";
                }
                
                
            }
        }
        
        $scope.contrato.PlanPago = plan;
    };
    
    $scope.ValidarPaso3 = function()
    {
        $scope.mensajeError = [];
        
        if($scope.contrato.PlanPago.PlanPagoId.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un plan de pagos.";
        }
        else
        {
            var val = parseInt($scope.anticipo.uno);
            
            if(val === null || val === undefined || val === 0 || isNaN(val))
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El valor del anticipo 1 debe ser válido.";
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
           return true; 
        }
    };
    
    //------------------------- PASO 4 -----------------------------
    $scope.GetCatalogosPaso4 = function()
    {
        $scope.pagos = {meses: $scope.contrato.TotalMeses, contado: (parseInt($scope.anticipo.uno) -  $scope.contrato.TotalMeses)};
        
        if(!$scope.ModificarCompleto)
        {
            $scope.pagos.meses = 0;
            $scope.pagos.contado = 0;
           
            for(var k=0; k<$scope.contratoAux.Pago.length; k++)
            {
                if($scope.contratoAux.Pago[k].TipoPagoId == "1")
                {
                    $scope.pagos.contado += $scope.contratoAux.Pago[k].Pago;
                }
                else if($scope.contratoAux.Pago[k].TipoPagoId == "2")
                {
                    $scope.pagos.meses += $scope.contratoAux.Pago[k].Pago;
                }
            }
        }
        
        if(!$scope.catalogos.paso4)
        {
            $scope.catalogos.paso4 = true;

            $scope.GetMedioPago();
            
            $scope.contrato.PagoMeses = [];
            $scope.contrato.PagoContado = [];
            
            $scope.contrato.PagoMeses[0] = new Pago();
            $scope.contrato.PagoMeses[0].Pago = $scope.pagos.meses;
            
            $scope.contrato.PagoContado[0] = new Pago();
            $scope.contrato.PagoContado[0].Pago = $scope.pagos.contado;
            
            if($scope.operacion == "Editar")
            {
                $scope.SetPagoContrato($scope.contratoAux.Pago);
            }
        }
        else
        {
            if($scope.ModificarCompleto)
            {
                $scope.CalcularUltimoPago($scope.contrato.PagoMeses, $scope.pagos.meses);
                $scope.CalcularUltimoPago($scope.contrato.PagoContado, $scope.pagos.contado);
            }
        }
        
        
    };
    
    $scope.SetPagoContrato = function(pagos)
    {   
        if($scope.pagos.meses > 0)
        {
            $scope.contrato.PagoMeses = alasql("Select * FROM ? WHERE TipoPagoId = '2' ", [pagos]);
            
            if($scope.contrato.PagoMeses.length == 0)
            {
                $scope.contrato.PagoMeses[0] = new Pago();
                $scope.contrato.PagoMeses[0].Pago = -1;
            }
        }
        
        if($scope.pagos.contado > 0)
        {
            $scope.contrato.PagoContado = alasql("Select * FROM ? WHERE TipoPagoId = '1' ", [pagos]);
            
            if($scope.contrato.PagoContado.length == 0)
            {
                $scope.contrato.PagoContado[0] = new Pago();
                $scope.contrato.PagoContado[0].Pago = -1; 
            }
        }
        
        if($scope.ModificarCompleto)
        {
            $scope.CalcularUltimoPago($scope.contrato.PagoMeses, $scope.pagos.meses);
            $scope.CalcularUltimoPago($scope.contrato.PagoContado, $scope.pagos.contado);
        }
    };
    
    $scope.SetPago = function(data)
    {
        var p = new Object();
        
        p.Pago = parseFloat(data.Pago);
        p.TipoPagoId = data.TipoPagoId;
        
        p.MedioPago = new Object();
        p.MedioPago.MedioPagoId = data.MedioPagoId;
        p.MedioPago.Nombre = data.NombreMedioPago;
        
        return p;
    };
    
    $scope.AgregarPago = function(pagos, pagoTotal)
    {
        pagos.push(new Pago());
        
        $scope.CalcularUltimoPago(pagos, pagoTotal);
    };
    
    $scope.QuitarPago = function(pagos, pagoTotal)
    {
        pagos.splice(-1, 1);
        
        $scope.CalcularUltimoPago(pagos, pagoTotal);
    };
    
    $scope.CalcularUltimoPago = function(pagos, pagoTotal)
    {
        var pago = 0;
        
        for(var k=0; k<(pagos.length-1); k++)
        {
            var p =  parseInt(pagos[k].Pago);
            
            if(isNaN(p))
            {
                p = 0;
            }
            
            pago += p;
        }
        
        pago = pagoTotal - pago;
        if(pago < 0)
        {
            pago = 0;
        }
        
        pagos[pagos.length-1].Pago = pago;
    };
    
    $scope.ValidarPaso4 = function()
    {
        $scope.mensajeError = [];
        
        if($scope.ModificarCompleto)
        {
            if($scope.pagos.meses > 0)
            {
                $scope.ValidarPagos($scope.contrato.PagoMeses, $scope.pagos.meses);
            }

            if($scope.pagos.contado > 0)
            {
                $scope.ValidarPagos($scope.contrato.PagoContado, $scope.pagos.contado);
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            $scope.contrato.TotalContado = $scope.pagos.contado;
            return true;
        }
    };
    
    $scope.ValidarPagos = function(pagos, total)
    {
        var t = 0;
        
        for(var k=0; k<pagos.length; k++)
        {
            var pago = parseInt(pagos[k].Pago);
            
            if(isNaN(pago) || pago === 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Indica una cantidad válida para el pago " + (k+1) + ".";
            }
            else
            {
                t  += pago;
            }
            
            if(pagos[k].MedioPago.MedioPagoId.length == 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un medio de pago para el pago " + (k+1) + ".";
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        else
        {
            if(t != total)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*La suma de los pagos debe ser igual al anticipo.";
                return;
            }
            else
            {
                return;
            }
        }
    };
    
    //-------------------------- PASO 5 -----------------------------
    $scope.GetCatalogosPaso5 = function()
    {
        if(!$scope.catalogos.paso5)
        {
            $scope.catalogos.paso5 = true;
            
            $scope.GetParametro();
            $scope.GetDatosFiscales();
            $scope.GetDireccionPersona();
            $scope.GetMedioContactoPersona();
        }
        else
        {
            $scope.SetVarPaso5();
        }
        
        $scope.buscasFiscal = "";
        
        if($scope.operacion == "Agregar")
        {
            $scope.GetNumeroContrato();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.numeroContrato = $scope.contrato.ContratoId;
        }
    };
    
    $scope.SetVarPaso5 = function()
    {
        $scope.docFiscal = {factura: false, nota:false};
        
        if(parseInt($scope.contrato.TotalContrato) == parseInt($scope.anticipo.uno))
        {
            $scope.docFiscal.factura = true;
            $scope.docFiscal.nota = false;
        }
        else if($scope.facturar)
        {
            $scope.docFiscal.factura = true;
            $scope.docFiscal.nota = true;
        }
        else 
        {
            $scope.docFiscal.factura = false;
            $scope.docFiscal.nota = true;
        }
    };
    
    $scope.CambiarDatoFiscal = function(dato)
    {
        if(dato == "Venta al Publico")
        {
            $scope.contrato.DatoFiscal = new DatosFiscales();
            $scope.contrato.DatoFiscal.Nombre = "Venta al Público";
            $scope.contrato.DatoFiscal.DatosFiscalesId = null;
        }
        else
        {
            $scope.contrato.DatoFiscal = dato;
        }  
    };
    
    //------- Datos fiscales -- 
    $scope.AgregarDatosFiscales = function()
    {
        DATOSFISCALES.AgregarDatoFiscal($scope.presupuesto.Persona);
    };
    
    $scope.$on('DatoFiscalTerminado',function(evento, dato)
    {
        $scope.presupuesto.Persona.DatosFiscales.push(dato);
        $scope.contrato.DatoFiscal = dato;
    });
    
    $scope.ValidarPaso5 = function()
    {
        var q = $q.defer();
        var promesa = [];
        
        $scope.mensajeError = [];
        
        if($scope.docFiscal.factura)
        {
            if($scope.contrato.NoFactura === undefined || $scope.contrato.NoFactura === "" || $scope.contrato.NoFactura === null)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un número de factura válido.";
            }
            else
            {
                promesa[promesa.length] = $scope.GetNoFactura($scope.contrato.NoFactura).then(function(data)
                {
                    if(data > 0)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*El número de factura ya existe.";
                    }
                    if(data < 0)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*No se puedo verificar el número de factura.";
                    }
                });
            }
        }
        else
        {
            $scope.contrato.NoFactura = null;
        }
        
        if($scope.docFiscal.nota)
        {
            if($scope.contrato.NoNotaCargo === undefined || $scope.contrato.NoNotaCargo == "" || $scope.contrato.NoNotaCargo === null)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un número de nota de cargo válido.";
            }
            else
            {
                promesa[promesa.length] = $scope.GetNotaCargo($scope.contrato.NoNotaCargo).then(function(data)
                {
                    if(data > 0)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*El número de la nota de cargo ya existe.";
                    }
                    if(data < 0)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*No se puedo verificar el número de la nota de cargo.";
                    }
                });
            }
        }
        else
        {
            $scope.contrato.NoNotaCargo = null;
        }
        
        if($scope.contrato.DatoFiscal.Nombre.length == 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona los datos fiscales.";
        }
        
        $q.all(promesa).then(function()
        {
            if($scope.mensajeError.length > 0)
            {
                 q.resolve(false);
            }
            else
            {
                q.resolve(true);
            }
        });
           
        return q.promise;
    };
    
    $scope.GetNoFactura = function(factura)              
    {
        var q  = $q.defer();
        
        GetNoFactura($http, $q, CONFIG, factura, $scope.contrato.ContratoId).then(function(data)
        {
           q.resolve(data);
        }).catch(function(error)
        {
            q.resolve(-1);
        });
        
        return q.promise;
    };
    
    $scope.GetNotaCargo = function(nota)              
    {
        var q  = $q.defer();
        GetNotaCargo($http, $q, CONFIG, nota, $scope.contrato.ContratoId).then(function(data)
        {
            return q.resolve(data);
        }).catch(function(error)
        {
            return q.resolve(-1);
        });
        
        return q.promise;
    };
    
    //-------------------------- PASO 6 -----------------------------
    $scope.GetCatalogosPaso6 = function()
    {
        $scope.catalogos.paso6 = true;
        
        if($scope.catalogos.paso6)
        {
            $scope.GetDescripcionContrato();
        }
        else
        {
            $scope.SetDescripcionContrato();
        }
        
        $scope.SetEncabezadoContrato();
        $scope.CancelarAnticipo();
    };
    
    $scope.CancelarAnticipo = function()
    {
        $scope.contrato.CancelarAnticipo = false;
        if($scope.operacion == "Editar")
        {
            if(!$scope.ModificarCompleto)
            {
                if($scope.contratoAux.NoNotaCargo != $scope.contrato.NoNotaCargo)
                {
                    $scope.contrato.CancelarAnticipo = true;
                }
            }
            else
            {
                if($scope.contratoAux.NoNotaCargo != $scope.contrato.NoNotaCargo)
                {
                    $scope.contrato.CancelarAnticipo = true;
                    return;    
                }
                for(var k=0; k<$scope.contratoAux.Pago.length; k++)
                {
                    var found = false;
                    if($scope.contratoAux.Pago[k].TipoPagoId == "1")
                    {
                        for(var i=0; i<$scope.contrato.PagoContado.length; i++)
                        {
                            if(parseInt($scope.contrato.PagoContado[i].Pago) == $scope.contratoAux.Pago[k].Pago && parseInt($scope.contrato.PagoContado[i].MedioPago.MedioPagoId) == $scope.contratoAux.Pago[k].MedioPago.MedioPagoId)
                            {
                                found = true;
                                break;
                            }
                        }
                    }
                    if($scope.contratoAux.Pago[k].TipoPagoId == "2")
                    {
                        for(var i=0; i<$scope.contrato.PagoMeses.length; i++)
                        {
                            if(parseInt($scope.contrato.PagoMeses[i].Pago) == $scope.contratoAux.Pago[k].Pago && parseInt($scope.contrato.PagoMeses[i].MedioPago.MedioPagoId) == $scope.contratoAux.Pago[k].MedioPago.MedioPagoId)
                            {
                                found = true;
                                break;
                            }
                        }
                    }
                    
                    if(!found)
                    {
                        $scope.contrato.CancelarAnticipo = true;
                        return;
                    }
                }
            }
        }
    };
    
    $scope.SetDescripcionContrato = function()
    {
        var d = [];
        var piedra = false;
        
        d = alasql("SELECT * FROM ? WHERE Activo = true", [$scope.descripcion]); 
        
        if(!$scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            d = alasql("SELECT * FROM ? WHERE TipoVentaId != '1'", [d]); 
        }
        else if(!$scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra || $scope.contrato.TipoCubierta.TipoCubiertaId != "2")
        {
            d = alasql("SELECT * FROM ? WHERE TipoVentaId != '2'", [d]);
        }
        
        $scope.contrato.Descripcion = d;
    };
    
    $scope.SetEncabezadoContrato = function()
    {
        var enc1 = "La presente es para manifestar el precio total de un(a) ";
        var enc2 = " la(el) cual esta adquiriendo el(la) Sr(a).  ";
        var enc3 = " al precio de  ";
        var enc4 = " con las características siguientes:  ";
        var nombre = $scope.presupuesto.Persona.Nombre.toUpperCase() + " " + $scope.presupuesto.Persona.PrimerApellido.toUpperCase() + " " + $scope.presupuesto.Persona.SegundoApellido.toUpperCase();
        var total = $filter('currency')($scope.contrato.TotalContrato);
        
        var totalStr = $scope.contrato.TotalContrato.toFixed(2);
        var entero = totalStr.substring(0, totalStr.length-3);
        var decimal = totalStr.substring((totalStr.length-2), totalStr.length);
        
        var totalnombre = numeroALetras(entero, 
                        {
                            plural: 'PESOS ',
                            singular: 'PESOS ',
                            centPlural: '',
                            centSingular: ''
                        });
        
        totalnombre += decimal + "/100 M.N. ";
        
        var proyecto = "";
        if($scope.contrato.ProyectoNombre === undefined || $scope.contrato.ProyectoNombre  === "" || $scope.contrato.ProyectoNombre  === null)
        {
            proyecto = "...";
        }
        else
        {
            proyecto =$scope.contrato.ProyectoNombre.toLowerCase();
        }
        
        $scope.contrato.Encabezado = enc1 + proyecto + enc2 + nombre + enc3 + total + " (" + totalnombre + ") " + enc4;
    };
    
    $scope.AbrirDetalleEspecificacion = function(data)
    {
        $scope.detalle = data;
        $('#DetalleEspecificacionModal').modal('toggle');
    };
    
    $scope.AbrirEspecificacion = function(operacion, objeto, indice)
    {
        $scope.operacionEsp = operacion;
        $scope.erroresp = [];
        
        if(operacion == "Agregar")
        {
            $scope.especificacion = new Object();
        }
        else if(operacion == "Editar")
        {
            $scope.especificacion = $scope.SetEspecificacion(objeto);
            $scope.indexesp = indice;
        }
        
        $('#EspecificacionModal').modal('toggle');
    };
    
    $scope.SetEspecificacion = function(data)
    {
        var esp = new Object();
        
        esp.Ubicacion = data.Ubicacion;
        esp.Descripcion = data.Descripcion;
        
        return esp;
    };
    
    $scope.TerminarEspecificaicon = function()
    {
        if(!$scope.ValidarEspecificacion())
        {
            return;
        }
        else
        {
            if($scope.operacionEsp == "Agregar")
            {
                $scope.contrato.Especificacion.push($scope.especificacion);
                $scope.especificacion = new Object();
                document.getElementById("ubicacionEspecificacion").focus();
            }
            else if($scope.operacionEsp == "Editar")
            {
                $scope.contrato.Especificacion[$scope.indexesp] = $scope.SetEspecificacion($scope.especificacion);
                $('#EspecificacionModal').modal('toggle');
            }
        }
    };
    
    $scope.ValidarEspecificacion = function()
    {
        $scope.erroresp = [];
        
        if($scope.especificacion.Ubicacion === "" || $scope.especificacion.Ubicacion === undefined || $scope.especificacion.Ubicacion === null)
        {
            $scope.erroresp[$scope.erroresp.length] = "*Indica la ubicación.";
        }
        
        if($scope.especificacion.Descripcion === "" || $scope.especificacion.Descripcion === undefined || $scope.especificacion.Descripcion === null)
        {
            $scope.erroresp[$scope.erroresp.length] = "*Indica la descripción.";
        }
        
        if($scope.erroresp.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.ValidarPaso6 = function()
    {
        $scope.mensajeError = [];
        
        if($scope.contrato.ProyectoNombre  === undefined || $scope.contrato.ProyectoNombre  === "" || $scope.contrato.ProyectoNombre  === null)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre de proyecto válido.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
        //---- quitar especificacion 
    $scope.QuitarEspecificacion = function(indice)
    {
        $scope.indexesp = indice;
        $scope.mensajeAdvertencia = "¿Estas seguro de eliminar la especificación del contrato?";
        $('#quitarEspecificacionModal').modal('toggle');
    };
    
    $scope.ConfirmarQuitarEspecificacion = function()
    {
        $scope.contrato.Especificacion.splice($scope.indexesp, 1);
    };
    
    //--------------------- PASO 7 -----------------------
    $scope.AgregarContrato = function()
    {
        $scope.SetLastDatas();
        
        AgregarContrato($http, CONFIG, $q, $scope.contrato).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.contrato.ContratoId = data[1].ContratoId;
                
                $scope.pasoContrato = 7;
                $scope.PDFContrato();
                
                CONTRATO.ContratoGuardado($scope.contrato);
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                $('#mensajeContrato').modal('toggle');
            }
            
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeContrato').modal('toggle');
        });
    };
    
    $scope.EditarContrato = function()
    {
        $scope.SetLastDatas();
        
        EditarContrato($http, CONFIG, $q, $scope.contrato).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {                
                $scope.pasoContrato = 7;
                $scope.PDFContrato();
                
                CONTRATO.ContratoEditado($scope.contrato);
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                $('#mensajeContrato').modal('toggle');
            }
            
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeContrato').modal('toggle');
        });
    };
    
    $scope.SetLastDatas = function()
    {
        $scope.contrato.UsuarioId = $scope.usuario.UsuarioId;
        $scope.contrato.PresupuestoId = $scope.presupuesto.PresupuestoId;
        $scope.contrato.ProyectoId = $scope.presupuesto.ProyectoId;
        $scope.contrato.PersonaId = $scope.presupuesto.Persona.PersonaId;
        $scope.contrato.Persona = $scope.presupuesto.Persona;
        $scope.contrato.Proyecto = $scope.presupuesto.Proyecto;
    }
    
    $scope.PDFContrato = function()
    {        
        var doc = new jsPDF(), margins =
        {
            bottom: 92,
        };
        doc.setFontSize(12);
        
        var enc = doc.autoTableHtmlToJson(document.getElementById("encabezado"));
        var comt = doc.autoTableHtmlToJson(document.getElementById("combinaciontit"));
        var comc = doc.autoTableHtmlToJson(document.getElementById("combinacioncar"));
        var ser = doc.autoTableHtmlToJson(document.getElementById("servicio"));
        var acc = doc.autoTableHtmlToJson(document.getElementById("accesorio"));
        var cub = doc.autoTableHtmlToJson(document.getElementById("cubierta"));
        var espt = doc.autoTableHtmlToJson(document.getElementById("especificaciontitulo"));
        var esp = doc.autoTableHtmlToJson(document.getElementById("especificacion"));
        var total = doc.autoTableHtmlToJson(document.getElementById("fechapago"));
        var pago = doc.autoTableHtmlToJson(document.getElementById("pagos"));
        
        var desc = [];
        
        for(var k=0; k<$scope.contrato.Descripcion.length; k++)
        {
            desc[k] = doc.autoTableHtmlToJson(document.getElementById("descripcionContrato" + k));
        }
        
        //encabezado
        var venta = "Venta No. " + $scope.contrato.ContratoId; 
        var fecha = $scope.contrato.FechaVenta;
        
        var pageWidth = doc.internal.pageSize.width;
        var fontSize = 10;
        
        var ventaW = doc.getStringUnitWidth(venta)*fontSize/doc.internal.scaleFactor;
        var dateW = doc.getStringUnitWidth(fecha)*fontSize/doc.internal.scaleFactor;
        
        var w = venta > dateW ? venta : dateW;
        var x = pageWidth - w - 15;
        var lastH = 0;
        
        
        var colaborador = $scope.usuario.NombreCompletoColaborador;
        var cliente = $scope.contrato.Persona.Nombre + " " + $scope.contrato.Persona.PrimerApellido + " " + $scope.contrato.Persona.SegundoApellido;
        var fechaContrato = $scope.usuario.Ciudad.toUpperCase() + ' ' + $scope.usuario.Estado.toUpperCase() + '; A ' + $scope.GetFechaContrato(new Date()).toUpperCase();
        var page = 0;
        
        var pageContent = function (data) 
        {
            if(page < doc.internal.getCurrentPageInfo().pageNumber)
            {
                // HEADER
                if (base64Img) 
                {
                    doc.setFontSize(10);
                    doc.addImage(base64Img, 'JPEG', 15, 10, 30, 10);
                }

                doc.text(venta, x, 13);
                doc.text(fecha, x, 18);

                //footer
                var cols = ["", "", ];
                var datatabla = [
                    ["______________________________________", "______________________________________"],
                    ["Cliente", "Recibimos"],
                    [cliente, "Cocinas k"],
                    ["", colaborador],
                ];

                doc.autoTable(cols, datatabla, 
                {
                    margin: {top: 257},
                    showHeader: 'never',
                    styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0, halign: 'center'},
                    columnStyles: {fillColor: [255, 255, 255]},
                    theme: 'grid',
                    createdCell: function(cell, opts) 
                    {
                        cell.styles.cellPadding = 0;
                    }

                });

                var cols2 = ["" ];
                var datatabla2 = [
                    [fechaContrato]
                ];

                doc.autoTable(cols2, datatabla2, 
                {
                    margin: {top: 257},
                    startY: doc.autoTable.previous.finalY,
                    showHeader: 'never',
                    styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0, halign: 'center'},
                    columnStyles: {fillColor: [255, 255, 255]},
                    theme: 'grid',
                    createdCell: function(cell, opts) 
                    {
                        cell.styles.cellPadding = 0;
                    }
                });

                doc.setFontSize(10);
                
                page = doc.internal.getCurrentPageInfo().pageNumber;
            }
        };
        
        //encabezado
        doc.autoTable(enc.columns, enc.data, {
            margin: {top: 25},
            addPageContent: pageContent,
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, 
            styles: {overflow: 'linebreak'},
            columnStyles: {text: {columnWidth: 'auto'}}
        });
        
        lastH = doc.autoTable.previous.finalY;
        
        if($scope.contrato.Proyecto.TipoProyecto.Mueble)
        {
            //combinacion y proyecto
            doc.autoTable(comt.columns, comt.data, {
                startY: lastH + 5,
                headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'bold'}, 
                styles: { overflow: 'linebreak', fontSize:10},
                columnStyles: {text: {columnWidth: 'auto'}}
            });

            doc.autoTable(comc.columns, comc.data, {
                margin: {top: 25},
                startY: doc.autoTable.previous.finalY,
                showHeader: 'never', 
                headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'left', fontStyle: 'bold'},
                styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0},
                columnStyles: {fillColor: [255, 255, 255]},
                theme: 'grid',
            });

            //servicios
            if($scope.contrato.Servicio.length > 0)
            {
                 doc.autoTable(ser.columns, ser.data,  {
                     margin: {top: 25},
                    startY: doc.autoTable.previous.finalY + 5,
                    headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'left', fontStyle: 'bold'},
                    styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0]},
                    columnStyles: {fillColor: [255, 255, 255]},
                    theme: 'grid',
                });
            }

            //accesorio
            doc.autoTable(acc.columns, acc.data,  {
                margin: {top: 25},
                startY: doc.autoTable.previous.finalY + 5,
               headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'left', fontStyle: 'bold'},
                styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0]},
                columnStyles: {fillColor: [255, 255, 255]},
                theme: 'grid',
            });
        }
        
        if(($scope.contrato.Proyecto.TipoProyecto.CubiertaAglomerado || $scope.contrato.Proyecto.TipoProyecto.CubiertaPiedra ) && $scope.contrato.TipoCubierta.TipoCubiertaId != null)
        {
            //cubierta
            doc.autoTable(cub.columns, cub.data, {
                margin: {top: 25, bottom: 50},
                showHeader: 'firstPage',
                startY: doc.autoTable.previous.finalY + 5,
                headerStyles: {fillColor: [230, 230, 230], textColor: 20, fontStyle: 'bold'}, 
                styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0]},
                columnStyles: {fillColor: [255, 255, 255]},
                theme: 'grid',
            });
        }
        
        lastH = doc.autoTable.previous.finalY;
        
        //Fechas y totales
        doc.autoTable(total.columns, total.data, {
            margin: {top: 25, bottom: 50},
            addPageContent: pageContent,
            startY: lastH +5,
            showHeader: 'never',
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, 
            styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0},
            theme: 'grid',
            pageBreak: 'avoid',
            createdCell: function(cell, data) 
            {
                if (data.row.index === 0 || data.row.index === 2) 
                {
                    cell.styles.fontStyle = 'bold';
                }
            }
        });
        
         lastH = doc.autoTable.previous.finalY;
        
        //pagos
        if(($scope.contrato.TotalMeses + $scope.contrato.TotalContado) < $scope.contrato.TotalMeses + $scope.contrato.TotalContrato)
        {
            doc.autoTable(pago.columns, pago.data,  {
                margin: {top: 25, bottom: 50},
                addPageContent: pageContent,
                startY: lastH + 5,
                headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'left', fontStyle: 'bold'},
                styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0]},
                columnStyles: {2:{fontStyle: 'bold'}},
                theme: 'grid',
                pageBreak: 'avoid',
            });
        }
        
        lastH = doc.autoTable.previous.finalY;
        
        //descripcion
        if($scope.contrato.Descripcion.length > 0)
        {
            var margen = 0;
            for(var k=0; k<$scope.contrato.Descripcion.length; k++)
            {
                margen = k == 0 ? 5 : 0;
                
                doc.autoTable(desc[k].columns, desc[k].data, 
                {
                    margin: {top: 25, bottom: 50},
                    addPageContent: pageContent,
                    startY: lastH + margen,
                    showHeader: 'never',
                    headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, 
                    styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0},
                    theme: 'grid',
                    pageBreak: 'avoid',
                });
                
                lastH = doc.autoTable.previous.finalY;
            }
        }
        
        //pageContent();
        
        //especificaciones
        if($scope.contrato.Especificacion.length > 0)
        {
            var wc = doc.getStringUnitWidth("Ubicación")*fontSize/doc.internal.scaleFactor;
            var wa = 0;
            for(var k=0; k<$scope.contrato.Especificacion.length; k++)
            {
                wa = doc.getStringUnitWidth($scope.contrato.Especificacion[k].Ubicacion)*fontSize/doc.internal.scaleFactor;
                
                if(wa > wc)
                {
                    wc = wa;
                }
            }
            
            wc += 7;
            
            
            doc.autoTable(espt.columns, espt.data, {
            margin: {top: 25,  bottom: 65},
            startY: lastH + 5,
            addPageContent: pageContent,
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'bold', halign:'center', fontSize: 14}, 
            styles: {overflow: 'linebreak'},
                    
            });
            
            lastH = doc.autoTable.previous.finalY;
            
            doc.autoTable(esp.columns, esp.data,  {
                margin: {top: 25, bottom: 50},
                addPageContent: pageContent,
                startY: lastH + 5,
                headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'left', fontStyle: 'bold'},
                styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0]},
                columnStyles: {0: {columnWidth: wc}},
                theme: 'grid',
            });
        }
        
        //Desacargar pdf
        var nombre = 'C_' + $scope.presupuesto.Persona.Nombre + $scope.presupuesto.Persona.PrimerApellido + $scope.contrato.ContratoId + ".pdf";
        
        doc.save(nombre);
    };
    
    $scope.GetTextoAccesorioContrato = function(accesorio)
    {
        var acc = accesorio.Nombre;
        
        if(accesorio.Contrato)
        {
            if(accesorio.Contable == "1")
            {
                acc += " (" + accesorio.Cantidad + "):";
            }
            else
            {
                acc += ":";
            }
            
            acc += accesorio.MuestrarioSel.AccesorioSel.AccesorioId === null ? ' Pendiente (' + accesorio.MuestrarioSel.Nombre + ')' : " " + accesorio.MuestrarioSel.AccesorioSel.Nombre;
        }
        else
        {
            acc += ": No Incluye";
        }
        
        return acc;
    };
    
    $scope.GetFechaContrato = function(fecha)
    {
        if(fecha != null && fecha != undefined)
        {
            var dia = fecha.getDate();
            var mes = fecha.getMonth();
            var year = fecha.getFullYear();

            return dia + " de " + mesesN[mes] + " de " + year;
        }
        else
        {
            return "";
        }
    };
    
    $scope.GetTextoUbicacionContrato = function(ubicacion)
    {
        var texto = "";
        if(ubicacion !== undefined && ubicacion !== null)
        {
            var ub = alasql("SELECT * FROM ? WHERE Contrato = true AND UbicacionCubiertaId != '3'", [ubicacion]);
        
            for(var k=0; k<ub.length; k++)
            {
                if(k == (ub.length-1))
                {
                    texto += ub[k].Nombre + ".";
                }
                else
                {
                    texto += ub[k].Nombre + ", ";
                }
            }
        }
        
        return texto;
    };
    
    $scope.GetTextoAnticipoContrato = function(contrato)
    {
        var texto = "Anticipo con ";
        
        if(contrato.TotalContrato == (contrato.TotalContado + contrato.TotalMeses))
        {
            texto += "factura " + contrato.NoFactura;
        }
        else
        {
            texto += "nota de cargo " + contrato.NoNotaCargo;
        }
        
        return texto;
    };
    
    //------------------ Pasos -------------------
    $scope.SiguientePaso = function()
    {
        switch($scope.pasoContrato)
        {
            case 1:
                if($scope.ValidarPaso1())
                {
                    $scope.CalcularContratoSubtotal();
                    $scope.GetCatalogosPaso2();
                    $scope.pasoContrato++;
                }
                else
                {
                    return;
                }
                break;
                
            case 2:
                if($scope.ValidarPaso2())
                {
                    $scope.CalcularTotalContrato();
                    $scope.GetCatalogosPaso3();
                    $scope.pasoContrato++;
                }
                else
                {
                    return;
                }
                break;
            
            case 3:
                if($scope.ValidarPaso3())
                {
                    $scope.GetCatalogosPaso4();
                    $scope.pasoContrato++;
                }
                else
                {
                    return;
                }
                break;
            
            case 4:
                if($scope.ValidarPaso4())
                {
                    $scope.GetCatalogosPaso5();
                    $scope.pasoContrato++;
                }
                else
                {
                    return;
                }
                break;
                
            case 5:
                $scope.ValidarPaso5().then(function(data)
                {
                    if(data)
                    {
                        $scope.GetCatalogosPaso6();
                        $scope.pasoContrato++;
                    }
                    else
                    {
                        return;
                    }
                });
                break;
                
            default: 
                if($scope.ValidarPaso6())
                {
                    if($scope.operacion == "Agregar")
                    {
                        $scope.AgregarContrato();
                    }
                    else if($scope.operacion == "Editar")
                    {
                        $scope.EditarContrato();
                    }
                }
                break;
        }
        
    };
    
    $scope.AnteriorPaso = function()
    {
        $scope.pasoContrato--;
        $scope.mensajeError = [];
    };
    
    $scope.GetClasePaso = function(paso)
    {   
        if(paso <= $scope.pasoContrato)
        {
            return "active";
        }
        else
        {
            return "";
        }
    };
    
    $scope.GetClaseLineaPaso = function()
    {
        switch($scope.pasoContrato)
        {
            case 1:
                return "paso1";
            case 2:
                return "paso2";
            case 3:
                return "paso3";
            case 4:
                return "paso4";
            case 5:
                return "paso5";
            case 6:
                return "paso6";
            default:
                return "";
        }
        
        
    };
});

app.factory('CONTRATO',function($rootScope)
{
    var service = {};
    service.contrato = null;

    service.AgregarContrato = function(presupuesto)
    {
        $rootScope.$broadcast('AgregarContrato', presupuesto);
    };
    
    service.EditarContrato = function(presupuesto, contrato)
    {
        $rootScope.$broadcast('EditarContrato', presupuesto, contrato);
    };
    
    service.ContratoGuardado = function(contrato)
    {
        $rootScope.$broadcast('ContratoGuardado', contrato);
    };
    
    service.ContratoEditado = function(contrato)
    {
        $rootScope.$broadcast('ContratoEditado', contrato);
    };
    
  return service;
});

var numeroALetras = (function() 
{
    function Unidades(num)
    {

        switch(num)
        {
            case 1: return 'UN';
            case 2: return 'DOS';
            case 3: return 'TRES';
            case 4: return 'CUATRO';
            case 5: return 'CINCO';
            case 6: return 'SEIS';
            case 7: return 'SIETE';
            case 8: return 'OCHO';
            case 9: return 'NUEVE';
        }

        return '';
    }//Unidades()

    function Decenas(num)
    {

        let decena = Math.floor(num/10);
        let unidad = num - (decena * 10);

        switch(decena)
        {
            case 1:
                switch(unidad)
                {
                    case 0: return 'DIEZ';
                    case 1: return 'ONCE';
                    case 2: return 'DOCE';
                    case 3: return 'TRECE';
                    case 4: return 'CATORCE';
                    case 5: return 'QUINCE';
                    default: return 'DIECI' + Unidades(unidad);
                }
            case 2:
                switch(unidad)
                {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + Unidades(unidad);
                }
            case 3: return DecenasY('TREINTA', unidad);
            case 4: return DecenasY('CUARENTA', unidad);
            case 5: return DecenasY('CINCUENTA', unidad);
            case 6: return DecenasY('SESENTA', unidad);
            case 7: return DecenasY('SETENTA', unidad);
            case 8: return DecenasY('OCHENTA', unidad);
            case 9: return DecenasY('NOVENTA', unidad);
            case 0: return Unidades(unidad);
        }
    }//Unidades()

    function DecenasY(strSin, numUnidades) 
    {
        if (numUnidades > 0)
            return strSin + ' Y ' + Unidades(numUnidades)

        return strSin;
    }//DecenasY()

    function Centenas(num) 
    {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);

        switch(centenas)
        {
            case 1:
                if (decenas > 0)
                    return 'CIENTO ' + Decenas(decenas);
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + Decenas(decenas);
            case 3: return 'TRESCIENTOS ' + Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
            case 5: return 'QUINIENTOS ' + Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + Decenas(decenas);
            case 7: return 'SETECIENTOS ' + Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
            case 9: return 'NOVECIENTOS ' + Decenas(decenas);
        }

        return Decenas(decenas);
    }//Centenas()

    function Seccion(num, divisor, strSingular, strPlural) 
    {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    }//Seccion()

    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
        let strCentenas = Centenas(resto);

        if(strMiles == '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    }//Miles()

    function Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
        let strMiles = Miles(resto);

        if(strMillones == '')
            return strMiles;

        return strMillones + ' ' + strMiles;
    }//Millones()

    return function NumeroALetras(num, currency) {
        currency = currency || {};
        let data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: '',
            letrasMonedaPlural: currency.plural || 'PESOS MEXICANOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
            letrasMonedaSingular: currency.singular || 'PESOS MEXICANOS', //'PESO', 'Dólar', 'Bolivar', 'etc'
            letrasMonedaCentavoPlural: currency.centPlural || 'CENTAVOS',
            letrasMonedaCentavoSingular: currency.centSingular || 'CENTAVOS'
        };

        if (data.centavos > 0) {
            data.letrasCentavos = 'CON ' + (function () {
                    if (data.centavos == 1)
                        return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
                    else
                        return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
                })();
        };

        if(data.enteros == 0)
            return 'CERO ' + data.letrasMonedaPlural + '' + data.letrasCentavos;
        if (data.enteros == 1)
            return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + '' + data.letrasCentavos;
        else
            return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + '' + data.letrasCentavos;
    };

})();

Number.prototype.toFixedDown = function(digits) 
{
  var n = this - Math.pow(10, -digits)/2;
  n += n / Math.pow(2, 53); 
  return parseFloat(n.toFixed(digits));
}


