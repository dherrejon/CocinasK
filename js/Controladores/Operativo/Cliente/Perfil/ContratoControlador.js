app.controller("ContratoClienteControlador", function($scope, $rootScope, CITA, $http, $q, CONFIG, $filter, datosUsuario, md5, CONTRATO, datosUsuario)
{   
    $scope.contrato = [];
    $scope.hoy = GetHoyEng();
    $scope.estatus = GetEstatusContrato();
    
    $scope.contratoDetalle = "";
    $scope.usuario =  datosUsuario.getUsuario(); 
    
    $scope.GetContrato = function(contratoId)
    {
        var idc = contratoId ? contratoId : -1;
        GetContrato($http, $q, CONFIG, $rootScope.personaId, idc).then(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                 data[k].EstatusContrato = $scope.CambiarEstatusPagado(data[k].EstatusContrato, data[k].FechaEntrega);
            }
            
            if(!contratoId)
            {
                if(!$rootScope.permisoOperativo.verTodosCliente)
                {
                    $scope.contrato = [];
                    for(var k=0; k<data.length; k++)
                    {
                        if(data[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                        {
                            $scope.contrato.push(data[k]);
                        }
                    }
                }
                else
                {
                    $scope.contrato = data;
                }
            }
            else
            {
                for(var k=0; k<$scope.contrato.length; k++)
                {
                    if($scope.contrato[k].ContratoId == contratoId)
                    {
                        $scope.contrato[k] = data[0];
                        
                        if( $scope.contratoDetalle == contratoId)
                        {
                            $scope.CambiarContratoDetalle($scope.contrato[k], true);   
                        }
                        
                        break;
                    }
                }
            }
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.CambiarEstatusPagado = function(estatus, fecha)
    {   
        if(estatus.EstatusContratoId == "2" && fecha < $scope.hoy)
        {
            estatus.EstatusContratoId = "0";
            estatus.Nombre = "Atrasado";
        }
        
        return estatus;
    };
    
    //------------- Vista -----------------------------
    $scope.CambiarContratoDetalle = function(contrato, recalcular)
    {
        if($scope.contratoDetalle == contrato.ContratoId && !recalcular)
        {
            $scope.contratoDetalle = "";
        }
        else
        {
            $scope.contratoDetalle = contrato.ContratoId;
            $scope.GetEstadoCuenta(contrato);
        }
    };
    
    $scope.MostrarEstatus = function(actualId, cambiarId)
    {
        if(actualId == cambiarId || cambiarId=="2" || actualId=="3")
        {
            return false;
        }
        
        if(actualId == "0" || actualId == "2")
        {
            if(cambiarId == "3")
            {
                return true;
            }
            else
            {
                 return false;
            }
            
        }
        else if(actualId == "1" )
        {
            if(cambiarId == "4")
            {
                return true;
            }
            else
            {
                 return false;
            }
            
        }
        else if(actualId == "4" )
        {
            if(cambiarId == "1")
            {
                return true;
            }
            else
            {
                 return false;
            }
        }
      
    };
    
    $scope.GetEstatusContrato = function(id)
    {
        switch(id)
        {
            case "1":
                return "EnProgreso";
            case "2":
                return "Pagado";
            case "3":
                return "Entregado";
            case "4":
                return "Detenido";
            case "0":
                return "Atrasado";
                
            default: 
                return "";
        }
    };
    
    
    //-------------- DETALLES PRESUPUESTO ------------------
    $scope.GetProyecto = function(id)              
    {
        GetProyecto($http, $q, CONFIG, id).then(function(data)
        {
            $scope.detalle.Proyecto = data[0];
            $scope.GetPromocionPersona($scope.detalle.Persona.PersonaId);        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPresupuestoPorProyecto = function(presupuestoId, proyectoId)              
    {
        GetPresupuestoPorProyecto($http, $q, CONFIG, proyectoId, presupuestoId).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.detalle = data[0];
                $scope.detalle.Persona = $rootScope.persona;
                $scope.GetProyecto(proyectoId); 
            }
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPromocionPersona = function(id)              
    {
        GetPromocionPersona($http, $q, CONFIG, id).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.detalle.PromocionCubierta = data[1].Promocion.PromocionCubierta;
                $scope.detalle.PromocionMueble = data[1].Promocion.PromocionMueble;
            }
            else
            {
                $scope.detalle.PromocionCubierta = [];
                $scope.detalle.PromocionMueble = [];
            }
            
            $scope.GetDatosPresupuesto();
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDatosPresupuesto = function()              
    {
        GetDatosPresupuesto($http, $q, CONFIG, $scope.detalle).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                if($scope.optPresupuesto == "Detalle")
                {
                    $scope.detalle = data[1].Presupuesto;
                    $scope.VerTipoCubierta(data[1].Presupuesto);
                }
                else if($scope.optPresupuesto == "EditarContrato")
                {
                    $scope.presupuestoContrato = data[1].Presupuesto;
                    $scope.GetDatosContrato($scope.optContrato, "Editar");
                }
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
                $('#mensajePerfil').modal('toggle');
            }
        
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
            $('#mensajePerfil').modal('toggle');
        });
    };

    $scope.VerTipoCubierta = function(data)
    {
        $scope.verTipoCubierta = {aglomerado: false, piedra: false};
        for(var k=0; k<data.TipoCubierta.length; k++)
        {
            if(data.TipoCubierta[k].TipoCubiertaId == "1")
            {
                $scope.verTipoCubierta.aglomerado = true;
                
                $scope.SetUbicacionMaterialCubierta(data.TipoCubierta[k]);
            }
            else if(data.TipoCubierta[k].TipoCubiertaId == "2")
            {
                $scope.verTipoCubierta.piedra = true;
            }
        }
    };
    
    $scope.SetUbicacionMaterialCubierta = function(data)
    {
        for(var i=0; i<data.Material.length; i++)
        {
            for(var k=0; k<data.Ubicacion.length; k++)
            {
                var ubicado = false;
                for(var j=0; j<data.Material[i].Ubicacion.length; j++)
                {
                    if(data.Material[i].Ubicacion[j].UbicacionCubiertaId == data.Ubicacion[k].UbicacionCubiertaId)
                    {
                        ubicado = true;
                        break;
                    }
                }
                
                if(!ubicado)
                {
                    var ubicacion = new Object();
                    ubicacion.UbicacionCubiertaId = data.Ubicacion[k].UbicacionCubiertaId;
                    ubicacion.PrecioVenta = "No Disponible";
                    
                    data.Material[i].Ubicacion.push(ubicacion);
                }
            }
        }
    
    };
    
    $scope.VerDetallePresupuesto = function(presupuestoId, proyectoId)
    {
        $scope.verDetalle = {desCliente: false, desInterna: false, combinacion: false, modulo: false, puerta: false, servicio: false, maqueo: false, accesorio: false, cubiertaAglomerado: false, cubiertaPiedra: false, promocion: false};
        $scope.detalle = new Object();
        
        
        $scope.optPresupuesto = "Detalle";
        $scope.GetPresupuestoPorProyecto(presupuestoId, proyectoId);
        
        //$scope.GetDatosPresupuesto(presupuestoId);
        
        $('#presupuestoDetalleModal').modal('toggle');
    };
    
    //---------------------------------------------------- FACTURAR ----------------------------------------------
    $scope.GetNoFactura = function(factura)              
    {
        GetNoFactura($http, $q, CONFIG, factura).then(function(data)
        {

            if(data > 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El número de la factura ya existe.";
            }
            else if(data < 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*No se pudo validar el número de factura.";
                $rootScope.mensaje = "No se pudo validar el número de factura";
                $('#mensajePerfil').modal('toggle');
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.Facturar = function(contrato)
    {
        $scope.optContrato = contrato;
        $scope.noFactura = "";
        $scope.mensajeError = [];
        
        $('#FacturaModal').modal('toggle');
    };
    
    $scope.TerminarFacturar = function(invalid)
    {
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        else
        {
            var fac = new Object();
            fac.NoFactura = $scope.noFactura;
            fac.ContratoId = $scope.optContrato.ContratoId;
            
            $scope.UpdateNumeroFactura(fac);
        }
    };
    
    $scope.ValidarNumeroFactura = function(invalid)
    {
        $scope.mensajeError = [];
        
        if(invalid)
        {
            $scope.mensajeError[0] = "*Escribe un número de factura.";
            return;
        }
        else
        {
            $scope.GetNoFactura($scope.noFactura);
        }
    }
    
    $scope.UpdateNumeroFactura = function(fac)              
    {
        UpdateNumeroFactura($http, CONFIG, $q, fac).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.optContrato.NoFactura = fac.NoFactura;
                $('#FacturaModal').modal('toggle');
                
                $rootScope.mensaje = "El número de factura se ha guardado.";  
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
            }
            $('#mensajePerfil').modal('toggle');
        
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    //-------------------- Cargar Contrato PDF ---------------------------------
    $scope.CargarContrato = function(contratoId)
    {
        $scope.optContrato = contratoId;
        $scope.archivoSel = false;
        $scope.contratoPDF = "";
        
        document.getElementById('contratopdf').value = "";
        
        $('#CargarContratoModal').modal('toggle');
    };
    
    $scope.ContratoCargado = function(file) 
    {
        $scope.$apply(function($scope) 
        {
             $scope.contratoPDF = file;
             $scope.archivoSel = true;
        });
    };
    
    $scope.GuardarContratoPDF = function() 
    {
        $scope.mensajeError = [];
        if($scope.archivoSel)
        {
            GuardarContratoPDF($http, $q, CONFIG, $scope.contratoPDF ,$scope.optContrato).then(function(data)
            {
                if(data[0].Estatus == "Exitoso")
                {
                    $rootScope.mensaje = "El contrato se ha guardado.";
                    $('#mensajePerfil').modal('toggle');
                    $('#CargarContratoModal').modal('toggle');
                }
                else
                {
                    $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
                    $('#mensajePerfil').modal('toggle');
                }
            }).catch(function(error)
            {
                $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
                $('#mensajePerfil').modal('toggle');
            });
        }
        else
        {
            $scope.mensajeError[0] = "Selecciona un archivo PDF";
        }
    };
    
    function ArchivoCargado(evt) 
    {
        var files = evt.target.files;

        for (var i = 0, f; f = files[i]; i++) 
        {
            if (!f.type.match('pdf.*')) 
            {
                continue;
            }
            
            $scope.ContratoCargado(f);

            var reader = new FileReader();

            reader.onload = (function(theFile) 
            {
                return function(e) 
                {
                };
            })(f);

            reader.readAsDataURL(f);
        }
    }
 
    document.getElementById('contratopdf').addEventListener('change', ArchivoCargado, false);
    
    //_---------------- Descargar contrato --------------
    $scope.DescargarContrato = function(contrato)
    {
        DescargarContrato($http, $q, CONFIG, contrato.ContratoId).then(function(data)
        {
            if(data != [])
            {
                if(data.Archivo.length > 0)
                {
                    var file = 'data:application/PDF;base64,' + data.Archivo;
                    var link = document.createElement('a');

                    link.href = file;
                    link.setAttribute('target','_blank');

                    link.download = "C_" + $rootScope.persona.Nombre + $rootScope.persona.PrimerApellido + $rootScope.persona.SegundoApellido + contrato.ContratoId;

                    var e = document.createEvent('MouseEvents');
                    e.initEvent('click', true, true);
                    link.dispatchEvent(e);
                }
                else
                {
                    $rootScope.mensaje = "Aun no haz cargado el contrato.";
                    $('#mensajePresupuesto').modal('toggle');
                }
            }

        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //-------------------------- Cambiar de Estatus contrato ----------------------
    $scope.CambiarEstatus = function(contrato, estatus)
    {
        $scope.optContrato = contrato;
        $scope.estatusActualizar = estatus;
        
        $scope.mensajeAdvertencia = "¿Estas seguro de cambiar el estatus del contrato a " + estatus.Nombre + "?";
        
        $("#modalEstatusContrato").modal('toggle');
    };
    
    $scope.CancelarEstatusContrato = function()
    {
        $scope.optContrato = null;
        $scope.estatusActualizar = null;
    };
    
    $scope.ConfirmarActualizarContrato = function()
    {        
        var datos = new Object();
        datos.ContratoId = $scope.optContrato.ContratoId;
        datos.EstatusContratoId = $scope.estatusActualizar.EstatusContratoId;
        
        
        CambiarEstatusContrato($http, $q, CONFIG, datos).then(function(data)
        {
            if(data == "Exitoso")
            {
                $rootScope.mensaje = "El estatus del contrato se ha actualizado correctamente.";
                 
                $scope.optContrato.EstatusContrato = $scope.CambiarEstatusPagado($scope.estatusActualizar, $scope.optContrato.FechaEntrega);
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajePerfil').modal('toggle');
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
            $('#mensajePerfil').modal('toggle');
        });
        
    };
    
    //--------------------- Estado de Cuenta del contrato --------------------
    $scope.GetEstadoCuenta = function(contrato, val)              
    {
        var datos = new Object();
        datos.ContratoId = contrato.ContratoId;
        datos.PlanPagos = [];
        datos.Pagos = [];
        
        GetEstadoCuenta($http, $q, CONFIG, datos).then(function(data)
        {
            contrato.EstadoCuenta = $scope.GetEstadoCuentaContrato(data.Pagos, data.PlanPagos, contrato.TotalContrato);
            
            if(val == "Recibo")
            {
                $scope.$apply();
                $scope.ReciboPagoPDF();
            }
                
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetEstadoCuentaContrato = function(pagos, planPagos, total)
    {
        var cuenta = new Object();
        var pagado = 0;
        
        cuenta.PagoVencido = [];
        
        for(var k=0; k<pagos.length; k++)
        {
            pagos[k].FechaFormato = TransformarFecha(pagos[k].Fecha);
            pagos[k].Pago  = parseFloat(pagos[k].Pago);
            
            pagado += pagos[k].Pago;
        }
        
        if(pagado == parseFloat(total))
        {
            cuenta.SaldoPendiente = 0;
            cuenta.FechaCompromiso = "";
            cuenta.ProximoPago = 0;
            cuenta.PagoVencido = false;
        }
        else
        {
            cuenta.SaldoPendiente = total - pagado;
            
            var plan = 0;
            var fechacompromiso = false;
          
            for(var k=0; k<planPagos.length; k++)
            {
                planPagos[k].FechaCompromiso2 = GetFechaEng(planPagos[k].FechaCompromiso);
                plan += parseFloat(planPagos[k].Pago);
                
                
                if(plan > pagado && planPagos[k].FechaCompromiso2 < $scope.hoy)
                {
                    var ven = new Object();
                    
                    ven.FechaCompromiso =  planPagos[k].FechaCompromiso;
                    ven.FechaCompromiso2 =  planPagos[k].FechaCompromiso2;
                    
                    if(!fechacompromiso)
                    {
                        ven.Pago = plan - pagado;
                        
                        fechacompromiso = true;
                        cuenta.FechaCompromiso = planPagos[k].FechaCompromiso;
                        
                        cuenta.PagoVencido.push(ven);
                    }
                    else
                    {
                        ven.Pago = parseFloat(planPagos[k].Pago);
                        cuenta.PagoVencido.push(ven);
                    }
                }
                
                if((planPagos[k].FechaCompromiso2 >= $scope.hoy && plan > pagado) || k==(planPagos.length-1))
                {
                    cuenta.ProximoPago = plan - pagado;
                    
                    if($scope.hoy <= planPagos[k].FechaCompromiso2)
                    {
                        cuenta.Vencido = cuenta.ProximoPago - parseFloat(planPagos[k].Pago);
                    }
                    else
                    {
                         cuenta.Vencido = cuenta.ProximoPago;
                    }
                    
                    if( cuenta.Vencido <= 0)
                    {
                        cuenta.FechaCompromiso = planPagos[k].FechaCompromiso;
                    }
                    
                    break;
                }
                
            }
        }
    
        cuenta.PlanPagos = planPagos;    
        
        cuenta.Pago = alasql( "SELECT *, SUM(Pago) as Total FROM ? GROUP BY NoNotaCargo, Concepto, Cancelado", [pagos]);
        
        for(var k=0; k<cuenta.Pago.length; k++)
        {
            cuenta.Pago[k].Pago = alasql("SELECT * FROM ? WHERE Cancelado = '" + cuenta.Pago[k].Cancelado + "' AND NoNotaCargo = '" + cuenta.Pago[k].NoNotaCargo + "' AND Concepto = '" + cuenta.Pago[k].Concepto + "'", [pagos]);
        }
        
        return cuenta;
    };
    
    //----- Pago
    $scope.medioPago = [];
    
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
    
    $scope.GetNotaCargo = function(nota)              
    {
        GetNotaCargo($http, $q, CONFIG, nota).then(function(data)
        {
            if(data == 0)
            {
                $scope.nuevoPago.NoNotaCargoVal = true;
            }
            else if(data > 0)
            {
                $scope.nuevoPago.NoNotaCargoVal = false;
                $scope.mensajeError[$scope.mensajeError.length] = "*El número de la nota de cargo ya existe.";
            }
            else
            {
                $scope.nuevoPago.NoNotaCargoVal = false;
                $rootScope.mensaje = "No se pudo validar la nota de cargo";
                $('#mensajePerfil').modal('toggle');
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.AbrirPago = function(contrato)
    {
        if($scope.medioPago.length == 0)
        {
            $scope.GetMedioPago();
        }
        
        $scope.pagoContrato = contrato;
        $scope.mensajeError = [];
        
        $scope.nuevoPago = new Object();
        $scope.nuevoPago.ContratoId = contrato.ContratoId;
        $scope.nuevoPago.NoNotaCargo = "";
        $scope.nuevoPago.Total = "";
        $scope.nuevoPago.NoNotaCargoVal = false;
        
        $scope.nuevoPago.Pago = [new Pago()];

        $('#PagoModal').modal('toggle');
    };
    
    $scope.TerminarPago = function(notaInvalid, totalInvalid)
    {
        if(!$scope.ValidarPago(notaInvalid, totalInvalid))
        {
            return;
        }
        else
        {
            $scope.AgregarPago();
        }
        
    };
    
    $scope.AgregarPago = function()
    {   
        AgregarPago($http, $q, CONFIG, $scope.nuevoPago).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                //$rootScope.mensaje = "El pago se ha guardado.";
                
                $scope.GetEstadoCuenta($scope.pagoContrato, "Recibo");
                
                $scope.nuevoPago.NumeroPago = numeroALetras($scope.nuevoPago.Total, 
                                    {
                                        plural: 'PESOS 00/100 M.N.',
                                        singular: 'PESOS 00/100 M.N.',
                                        centPlural: '',
                                        centSingular: ''
                                    });
                
                $scope.usuario = datosUsuario.getUsuario();
                
                if($scope.nuevoPago.Pagado)
                {
                    $scope.pagoContrato.EstatusContrato.EstatusContratoId = "2";
                    $scope.pagoContrato.EstatusContrato.Nombre = "Pagado";
                    
                    $scope.pagoContrato.EstatusContrato = $scope.CambiarEstatusPagado($scope.pagoContrato.EstatusContrato, $scope.pagoContrato.FechaEntrega);
                }
                
                $('#PagoModal').modal('toggle');
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                $('#mensajePerfil').modal('toggle');
            }
            
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
            $('#mensajePerfil').modal('toggle');
        });
        
    };
    
    $scope.ValidarPago = function(notaInvalid, totalInvalid)
    {
        $scope.mensajeError = [];
        
        if(totalInvalid)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El pago total debe ser un número entero.";
        }
        else
        {
            var p = parseInt($scope.nuevoPago.Total);
            
            if(p > $scope.pagoContrato.EstadoCuenta.SaldoPendiente)
            {
                var pendiente = $filter('currency')($scope.pagoContrato.EstadoCuenta.SaldoPendiente);
                
                $scope.mensajeError[$scope.mensajeError.length] = "*El pago total no debe ser mayor a " + pendiente + ".";
            }
            else 
            {
                if(p == $scope.pagoContrato.EstadoCuenta.SaldoPendiente)
                {
                    $scope.nuevoPago.Pagado = true;
                }
                else
                {
                    $scope.nuevoPago.Pagado = false;
                }
            }
            
            $scope.ValidarPagos($scope.nuevoPago.Pago, $scope.nuevoPago.Total);
        }
        
        if(notaInvalid)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El número de la nota de cargo debe ser válido.";
        }
        else if(!$scope.nuevoPago.NoNotaCargoVal)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El número de la nota de cargo ya existe.";
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
    
    $scope.ValidarNotaCargo = function(notaInvalid)
    {
        $scope.mensajeError = [];
        
        if(notaInvalid)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El número de la nota de cargo debe ser válido.";
        }
        else
        {
            $scope.GetNotaCargo($scope.nuevoPago.NoNotaCargo);
        }
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
    
    $scope.hoyFormato = $scope.GetFechaContrato (new Date());
    
    $scope.ReciboPagoPDF = function()
    {
        var doc = new jsPDF();
        
        var datos = doc.autoTableHtmlToJson(document.getElementById("datos"));
        var pago = doc.autoTableHtmlToJson(document.getElementById("pago"));
        var usuario = doc.autoTableHtmlToJson(document.getElementById("usuarioRecibo"));
        
        var pageContent = function (data) 
        {
            // HEADER
            if (base64Img) 
            {
                doc.setFontSize(10);
                doc.addImage(base64Img, 'JPEG', 150, 10, 45, 15);
            }
            
            doc.setFontType("bold");
            doc.setFontSize(16);
            doc.text("Recibo de Pago", 17, 20);

            
        };
        
        doc.autoTable(datos.columns, datos.data, {
            margin: {top: 30},
            addPageContent: pageContent,
            showHeader: 'never',
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, 
            styles: { overflow: 'linebreak', fontSize:12, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0},
            columnStyles: {0: {columnWidth: 34}},
            theme: 'grid',
            createdCell: function(cell, opts) 
                    {
                        cell.styles.cellPadding = 3;
                    }
        });
        
        if($scope.pagoContrato.EstadoCuenta.SaldoPendiente > 0)
        {
            doc.autoTable(pago.columns, pago.data, {
                margin: {top: 30},
                startY: doc.autoTable.previous.finalY,
                showHeader: 'never',
                headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, 
                styles: { overflow: 'linebreak', fontSize:12, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0},
                columnStyles: {0: {columnWidth: 34}, 2: {columnWidth: 34}},
                theme: 'grid',
                createdCell: function(cell, opts) 
                        {
                            cell.styles.cellPadding = 3;
                        }
            });
        }
        
        doc.autoTable(usuario.columns, usuario.data, {
            margin: {top: 30},
            startY: doc.autoTable.previous.finalY + 13,
            showHeader: 'never',
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, 
            styles: { overflow: 'linebreak', fontSize:12, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0, halign:'center'},
            theme: 'grid',
            createdCell: function(cell, opts) 
                    {
                        cell.styles.cellPadding = 0;
                    }
        });

        
        var name = "Pago_" + $scope.hoy + "_" + $scope.pagoContrato.ContratoId + $scope.persona.Nombre +  $scope.persona.PrimerApellido + $scope.persona.SegundoApellido;
        doc.save(name);
    }; 
    
    //---- control de número de pagos ----
    $scope.AgregarPagoNuevoPago = function()
    {
        $scope.nuevoPago.Pago.push(new Pago());
        
        $scope.CalcularUltimoPago($scope.nuevoPago.Pago, $scope.nuevoPago.Total);
    };
    
    $scope.QuitarPagoNuevoPago = function(pagos, pagoTotal)
    {
        $scope.nuevoPago.Pago.splice(-1, 1);
        
        $scope.CalcularUltimoPago($scope.nuevoPago.Pago, $scope.nuevoPago.Total);
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
    
    //-------------------------- Habilitar editar contrato ----------------------
    $scope.HabilitarEditarContrato = function(contrato)
    {
        $scope.optContrato = contrato;
        
        $scope.mensajeAdvertencia = "¿Estas seguro de habilitar el contrato para que se pueda modificar?";
        
        $("#modalHabilitarEditarContrato").modal('toggle');
    };
    
    $scope.CancelarHabilitarEditraContrato = function()
    {
        $scope.optContrato = null;
    };
    
    $scope.ConfirmarHabilitarModificarContrato = function()
    {        
        var datos = new Object();
        datos.ContratoId = $scope.optContrato.ContratoId;
        
        HabilitarEditarContrato($http, $q, CONFIG, datos).then(function(data)
        {
            if(data == "Exitoso")
            {
                $rootScope.mensaje = "El contrato se puede modificar.";
                 
                $scope.optContrato.Modificar = "1";
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajePerfil').modal('toggle');
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
            $('#mensajePerfil').modal('toggle');
        });
        
    };
    
    //-------------------- Cancelar Pago ---------------------
    $scope.AbrirCancelarPago = function(pago, contrato)
    {
        $scope.optContrato = contrato;
        
        $scope.pagoCancelado = new Object();
        $scope.pagoCancelado.ContratoId = contrato.ContratoId;
        $scope.pagoCancelado.PagoContratoId = pago.PagoContratoId;
        $scope.pagoCancelado.Total = pago.Total;
        $scope.pagoCancelado.Usuario = "";
        $scope.pagoCancelado.Password = "";
        $scope.pagoCancelado.Motivo = "";
        $scope.pagoCancelado.Pago = pago.Pago;
        $scope.pagoCancelado.NoNotaCargo = pago.NoNotaCargo;
        
        $('#cancelarPagoModal').modal('toggle');
    };
    
    $scope.CancelarPago = function()
    {
        $scope.pagoCancelado.Descuento = -$scope.pagoCancelado.Total;
        $scope.pagoCancelado.Password2 = md5.createHash( $scope.pagoCancelado.Password );
        
        CancelarPago($http, $q, CONFIG, $scope.pagoCancelado).then(function(data)
        {
            if(data == "Exitoso")
            {
                $rootScope.mensaje = "El pago se cancelo.";
                 
                $scope.GetEstadoCuenta($scope.optContrato);
                $('#cancelarPagoModal').modal('toggle');
            }
            else if(data == "Permiso")
            {
                 $rootScope.mensaje = "Verifique los datos del usuario. También verifique que el usuario tenga permiso para cancelar pagos.";
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajePerfil').modal('toggle');
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    //--------------------- Detalles contrato -----------------------
    $scope.DetalleContrato = function(contrato)
    {
        $scope.verDetalle = {total:false, plan: false, pago: false, fiscal: false, dato:false, especificacion: false, descripcion: false};
        $scope.GetDatosContrato(contrato, "Detalle");
    };
    
    $scope.GetDatosContrato = function(contrato, opt)              
    {
        GetDatosContrato($http, $q, CONFIG, contrato).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                 $scope.OperacionContrato(opt, data[1].Contrato);
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
    
    $scope.OperacionContrato = function(opt, contrato)
    {
        switch(opt)
        {
            case "Detalle":
                $scope.detalle = contrato;
                $('#ContratoDetalleModal').modal('toggle');
                break;
                
            case "Editar":
                CONTRATO.EditarContrato($scope.presupuestoContrato, contrato);
                break;
                
            default:
                break;
        }
    };
    
    $scope.GetPromocionTexto = function(promocion, tipoventa)
    {
        var promo = "";
        for(var k=0; k<promocion.length; k++)
        {
            if(tipoventa == promocion[k].TipoVentaId)
            {
                if(promocion[k].TipoPromocionId == "2")
                {
                    promo = promocion[k].NumeroPago + " Meses sin Intereses";
                }
                else
                {
                    promo = parseInt(promocion[k].Descuento) + "% de decuento";
                }
                
                
                break;
            }
        }
        
        if(promo.length == 0)
        {
            promo = "Sin Promoción";
        }
        
        return promo;
    };
    
    $scope.GetTotalesContrato = function(total)
    {
        total.TotalDescuento = parseFloat(total.DescuentoMueble) + parseFloat(total.DescuentoCubierta);
        total.TotalIVA = parseFloat(total.IVAMueble) + parseFloat(total.IVACubierta);
        total.TotalSubtotal = parseFloat(total.SubtotalMueble) + parseFloat(total.SubtotalCubierta);
    };
    
    //------- Editar Contrato ---
    $scope.EditarContrato = function(contrato)
    {
        $scope.optContrato = contrato;
        $scope.optPresupuesto = "EditarContrato";
        $scope.GetPresupuestoPorProyecto(contrato.PresupuestoId, contrato.ProyectoId);
    };
    
    $scope.$on('ContratoEditado',function(evento, contrato)
    {
        $scope.GetContrato(contrato.ContratoId);
    });
    
});

function GetHoyEng()
{
    var hoy = new Date();

    var dia = hoy.getDate();
    var mes = hoy.getMonth() +1;
    var year = hoy.getFullYear();

    if(mes < 10)
    {
        mes = "0"+mes;
    }
    
    if(dia < 10)
    {
        dia = "0"+dia;
    }

    return year + "-" + mes + "-" + dia;
}