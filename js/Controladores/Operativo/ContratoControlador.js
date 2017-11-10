app.controller("ContratoControlador", function($scope, $rootScope, $http, $q, CONFIG, CONTRATO)
{    
    $scope.pasos = [{nombre:"Datos", numero:1}, {nombre:"Promociones", numero:2}, {nombre:"Plan de pagos", numero:3}, {nombre:"Pagos", numero:4}, {nombre:"Factura", numero:5}];
    $scope.mensajeError = [];
    $scope.contrato = new Contrato();
    $scope.catalogos = {paso2: false, paso3: false, paso4:false, paso5: false};
    $scope.iva = 0;
    
    
    $scope.hoy = GetHoy();
    
    $scope.$on('AgregarContrato',function(evento, presupuesto)
    {        
        console.log(presupuesto);
        $scope.catalogos = {paso2: false, paso3: false, paso4: false, paso5:false};
        
        $scope.contrato = new Contrato();
        $scope.pasoContrato = 2;
        $scope.presupuesto = presupuesto;
        
        $scope.GetDatosPresupuesto();
        
        $scope.verPlanPago = false;
        //paso 2
        $scope.presupuesto.Proyecto.TipoProyecto.IVA = false;
        $scope.contrato.Subtotal = 16853;
        $scope.contrato.SubtotalCubierta = 7694;
        $scope.GetCatalogosPaso2();
        
        $scope.mensajeError = [];
        
        $('#contratoModal').modal('toggle');
    });
    
    $scope.GetDatosPresupuesto = function()
    {
        //Fecha de venta
        $scope.contrato.FechaVenta = GetHoy2();
        
        //Tipo proyecto
        $scope.GetTipoProyectoId($scope.presupuesto.Proyecto.TipoProyecto.TipoProyectoId);
        
        //Puertas
        for(var k=0; k<$scope.presupuesto.Puerta.length; k++)
        {
            $scope.GetPuertaPorMuestrario($scope.presupuesto.Puerta[k].MuestrarioId, $scope.presupuesto.Puerta[k]);
        }
        
        //Servicio
        for(var k=0; k<$scope.presupuesto.Servicio.length; k++)
        {
            $scope.presupuesto.Servicio[k].Contrato = false;
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
        $scope.grupoUbicacion[1] = {Nombre: "Cubierta", Grupo:"13", MaterialAux:"", MaterialSel:""};
        $scope.grupoUbicacion[2] = {Nombre: "Backsplash e Isla", Grupo:"24", MaterialAux:"", MaterialSel:""};
        
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
    
            //------- Catálogos paso 2 --------
    $scope.GetConceptoVenta = function()      
    {
        GetConceptoVenta($http, $q, CONFIG).then(function(data)
        {
            $scope.conceptoVenta = alasql("SELECT * FROM ? WHERE Activo = true", [data]);
            
            console.log($scope.conceptoVenta);
            
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
                    
                    fechaEnt.setDate(fecha.getDate()+parseInt($scope.planPago[k].FechaEntrega));

                    $scope.planPago[k].FechaFin = fechaEnt.getDate() + "/" + GetMesNombre(fechaEnt.getMonth()) + "/" + fechaEnt.getFullYear();
                    $scope.planPago[k].FechaFin2 = new Date(fechaEnt.getFullYear(), fechaEnt.getMonth(), fechaEnt.getDate());
                    
                    $scope.planPago[k].Contrato = false;
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
    
    
    //------- Paso 1 ----------
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
        }
    
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
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado || $scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado)
        {
            if($scope.contrato.TipoCubierta.Nombre.length == 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un tipo de cubierta."; 
            }
            else if($scope.contrato.TipoCubierta.Nombre != "Pendiente")
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
                    $scope.contrato.Accesorio.push($scope.presupuesto.Accesorio[k]);
                }
            }
            
            if($scope.presupuesto.Proyecto.TipoProyecto.IVA)
            {
                $scope.contrato.Subtotal = ($scope.contrato.Subtotal * 100)/116;
            }
        }
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado || $scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            if($scope.contrato.TipoCubierta.Nombre !== "Pendiente")
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
        
        console.log($scope.contrato);
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
                $scope.contrato.IVAMueble = (($scope.contrato.TotalMueble * $scope.iva)/(1+$scope.iva));
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
                $scope.contrato.IVACubierta = (($scope.contrato.TotalCubierta * $scope.iva)/(1+$scope.iva));
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
        
        for(var k=0; k<plan.Abono.length; k++)
        {
            fecha = new Date();
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
                    
                    if(val < $scope.contrato.TotalMeses)
                    {
                        $scope.anticipo.uno = $scope.contrato.TotalMeses.toString();
                    }
                    
                    if($scope.anticipo.mindef > $scope.anticipo.uno)
                    {
                        if($scope.contrato.TotalMeses == $scope.anticipo.mindef)
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
                            
                sobrante = plan.Abono[k].Pago - $scope.anticipo.minimo;

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
                    var pago = $scope.anticipo.minimo - parseInt($scope.anticipo.uno);
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
        }
        else
        {
            $scope.CalcularUltimoPago($scope.contrato.PagoMeses, $scope.pagos.meses);
            $scope.CalcularUltimoPago($scope.contrato.PagoContado, $scope.pagos.contado);
        }
        
        
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
        
        if($scope.pagos.meses > 0)
        {
            $scope.ValidarPagos($scope.contrato.PagoMeses, $scope.pagos.meses);
        }
        
        if($scope.pagos.contado > 0)
        {
            $scope.ValidarPagos($scope.contrato.PagoContado, $scope.pagos.contado);
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
                    //$scope.GetCatalogosPaso5();
                    $scope.pasoContrato++;
                }
                else
                {
                    return;
                }
                break;
                
            default: 
                $scope.pasoContrato++;
                break;
        }
        
    };
    
    $scope.AnteriorPaso = function()
    {
        $scope.pasoContrato--;
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
    
  return service;
});

