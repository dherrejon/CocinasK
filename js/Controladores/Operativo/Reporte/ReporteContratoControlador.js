app.controller("ReporteContratoControlador", function($scope, $rootScope, $http, $q, CONFIG, $window,  $routeParams, $location, datosUsuario)
{   
    $rootScope.clasePrincipal = "";
    /*----------------verificar los permisos---------------------*/
    $scope.permiso = {verTodo: false, ver: false};
    $rootScope.permisoOperativo = {verTodosCliente: false};
    
    $scope.unidad = [];
    $scope.filtro = {fecha1: "", fecha2: "", unidad: new Object()};
    $scope.buscar = false;
    $scope.ordenar = "-Fecha";
    $scope.busqueda = "";
    $scope.ordenar = "-Contrato";
    
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "OpeCliConsultar")
            {
                $scope.permiso.verTodo = true;
                $rootScope.permisoOperativo.verTodosCliente = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "OpeVRCConsultar")
            {
                $scope.permiso.ver = true;
            }
        }
    };
    
    $scope.GetUnidadNegocio = function()
    {
        GetUnidadNegocioSencillaPresupuesto($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.unidad = data;
            }
            else
            {
                $scope.unidadNegocio = [];
            }
        }).catch(function(error)
        {
            $scope.unidadNegocio = [];
            alert(error);
        });
    };
    
    //----- Ordenar -------
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenar == campoOrdenar)
        {
            $scope.ordenar = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenar = campoOrdenar;
        }
        
        $scope.Ordenar();
    };
    
    $scope.Ordenar = function()
    {
        switch($scope.ordenar)
        {
            case "-FechaVenta":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  FechaVenta DESC", [$scope.contrato]);
                break;  
            case "FechaVenta":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  FechaVenta ASC", [$scope.contrato]);
                break; 
            case "-FechaEntrega":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  FechaEntrega DESC", [$scope.contrato]);
                break;  
            case "FechaEntrega":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  FechaEntrega ASC", [$scope.contrato]);
                break; 
            case "-Total":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  TotalContrato DESC", [$scope.contrato]);
                break;  
            case "Total":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  TotalContrato ASC", [$scope.contrato]);
                break; 
            case "-Anticipo":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  Anticipo DESC", [$scope.contrato]);
                break;  
            case "Anticipo":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  Anticipo ASC", [$scope.contrato]);
                break;
            case "-Contrato":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  ContratoId DESC", [$scope.contrato]);
                break;  
            case "Contrato":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  ContratoId ASC", [$scope.contrato]);
                break;
            case "-Cliente":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  Cliente DESC", [$scope.contrato]);
                break;  
            case "Cliente":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  Cliente ASC", [$scope.contrato]);
                break; 
            case "-Unidad":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  NombreUnidadNegocio DESC", [$scope.contrato]);
                break;  
            case "Unidad":
                $scope.contrato = alasql("SELECT * FROM ? ORDER BY  NombreUnidadNegocio ASC", [$scope.contrato]);
                break; 
                break; 
            default: 
                break;
        }
    };
    
    //---------------- Filtro -----------------
    $scope.CambiarUnidadNegocio = function(unidad)
    {
        if(unidad == 'ninguna')
        {
            $scope.filtro.unidad = new Object();
        }
        else
        {
            $scope.filtro.unidad = unidad;
        }
    };
    
    $scope.CambiarFechaInicio = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.filtro.fecha1 = element.value;
        });
        
        if(element.value.length > 0)
        {
            $('#fechaFin').datetimepicker("minDate", element.value);
        }
        else
        {
            $('#fechaFin').datetimepicker("minDate", false);
        }
    };
    
    $scope.CambiarFechaFin = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.filtro.fecha2 = element.value;
        });
        
        if(element.value.length > 0)
        {
            $('#fechaInicio').datetimepicker("maxDate", element.value);
        }
        else
        {
            $('#fechaInicio').datetimepicker("maxDate", new Date());
        }
    };
    
    $('#fechaInicio').datetimepicker(
    {
        locale: 'es',
        format: 'DD/MMM/YYYY',
        maxDate: new Date(),
        date: null
    });
    
    $('#fechaFin').datetimepicker(
    {
        locale: 'es',
        format: 'DD/MMM/YYYY',
        maxDate: new Date(),
        date: null
    }); 
    
    $scope.LimpiarFiltro = function()
    {
        $scope.filtro = {fecha1: "", fecha2: "", unidad: new Object()};
        $('#fechaInicio').data("DateTimePicker").clear();
        $('#fechaFin').data("DateTimePicker").clear();
        
        $scope.buscar = false;
        $scope.busqueda = "";
        $scope.contrato = [];
        
        $('#fechaFin').datetimepicker("minDate", false);
        $('#fechaInicio').datetimepicker("maxDate", new Date());
    };
    
    //---- Enviar Filtro
    $scope.GetReporteContrato = function()
    {   
        GetReporteContrato($http, $q, CONFIG, $scope.datos).then(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                data[k].FechaVentaFormato = TransformarFecha(data[k].FechaVenta);
                data[k].FechaEntregaFormato = data[k].FechaEntrega;
                data[k].FechaEntrega = GetFechaEng(data[k].FechaEntrega); 
                
                data[k].ContratoId = parseInt(data[k].ContratoId);
                data[k].Anticipo = parseFloat(data[k].Anticipo);
                data[k].TotalContrato = parseFloat(data[k].TotalContrato);
            }
            
            $scope.contrato = data;
            
            $scope.Ordenar();
        }).catch(function(error)
        {
            $scope.pago = [];
            alert(error);
        });
    };
    
    $scope.GetContratoFiltro = function()
    {
        if(!$scope.ValidarFiltro())
        {
            return;
        }
        else
        {
            $scope.buscar = true;
            $scope.GetReporteContrato();
        }
    };
    
    $scope.ValidarFiltro = function()
    {
        $scope.datos = {fecha1:"", fecha2:"", unidadId:""};
        $scope.mensajeError = [];
        
        if($scope.filtro.fecha1 || $scope.filtro.fecha2)
        {
            if(!$scope.filtro.fecha1 || !$scope.filtro.fecha2)
            {
                if(!$scope.filtro.fecha1)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona la primera fecha.";
                }
                
                if(!$scope.filtro.fecha2)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona la segunda fecha.";
                }
            }
            
            if($scope.mensajeError.length == 0)
            {
                $scope.datos.fecha1 = GetFechaAbrEng($scope.filtro.fecha1);
                $scope.datos.fecha2 = GetFechaAbrEng($scope.filtro.fecha2);

                if($scope.datos.fecha1 > $scope.datos.fecha2)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*La primera fecha debe ser menor a la segunda.";
                }
            }
        }
        else
        {
            $scope.datos.fecha1 = -1;
            $scope.datos.fecha2 = -1;
        }
    
        
        if(!$scope.permiso.verTodo)
        {
            $scope.datos.unidadId = $scope.usuario.UnidadNegocioId;
        }
        else if($scope.filtro.unidad.UnidadNegocioId != undefined && $scope.filtro.unidad.UnidadNegocioId != null )
        {
            $scope.datos.unidadId = $scope.filtro.unidad.UnidadNegocioId;
        }
        else
        {
            $scope.datos.unidadId = -1;
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
    
    //---------------- Presupuesto ---------
    //-------------- DETALLES PRESUPUESTO ------------------
    $scope.GetProyecto = function(id)              
    {
        GetProyecto($http, $q, CONFIG, id).then(function(data)
        {
            $scope.detalle.Proyecto = data[0];
            $scope.GetDatosPresupuesto();
        
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
                $scope.detalle.Persona = new Object();
                $scope.detalle.Persona.Nombre = $scope.cliente;
                $scope.GetProyecto(proyectoId); 
            }
        
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
                $scope.detalle = data[1].Presupuesto;
                $scope.VerTipoCubierta(data[1].Presupuesto);
                
                $scope.CalcularTipoModuloCantidad(data[1].Presupuesto.Modulo);
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
                $('#mensajeReporteContrato').modal('toggle');
            }
        
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
            $('#mensajeReporteContrato').modal('toggle');
        });
    };
    
    $scope.CalcularTipoModuloCantidad = function(modulo)
    {   
        
        for(var k=0; k<modulo.length; k++)
        {
            modulo[k].Cantidad = parseInt(modulo[k].Cantidad);
        }
        
        $scope.cantidadTipoModulo = [];
        $scope.cantidadTipoModulo= alasql("SELECT TipoModuloId, NombreTipoModulo AS Nombre, SUM(Cantidad) AS Cantidad FROM ? GROUP BY TipoModuloId, NombreTipoModulo", [modulo]);
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
    
    $scope.VerDetallePresupuesto = function(presupuestoId, proyectoId, contrato)
    {
        $scope.verDetalle = {desCliente: false, desInterna: false, combinacion: false, modulo: false, puerta: false, servicio: false, maqueo: false, accesorio: false, cubiertaAglomerado: false, cubiertaPiedra: false, promocion: false};
        $scope.detalle = new Object();
        $scope.cliente = contrato.Cliente;
        
        $scope.GetPresupuestoPorProyecto(presupuestoId, proyectoId);
        
        $('#presupuestoDetalleModal').modal('toggle');
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
                $('#mensajeReporteContrato').modal('toggle');
            }
            //proyecto.Presupuesto = data;
        
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
            $('#mensajeReporteContrato').modal('toggle');
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
                    promo = parseInt(promocion[k].Descuento) + "% de descuento";
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
    
    //----------------- Descargar contrato --------------
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

                    link.download = "C_" + contrato.Cliente + contrato.ContratoId;

                    var e = document.createEvent('MouseEvents');
                    e.initEvent('click', true, true);
                    link.dispatchEvent(e);
                }
                else
                {
                    $rootScope.mensaje = "Aun no haz cargado el contrato.";
                    $('#mensajeReporteContrato').modal('toggle');
                }
            }

        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.Inicializar = function()
    {
        $scope.IdentificarPermisos();
        if(!$scope.permiso.ver)
        {
            $rootScope.IrAHomePerfil($scope.usuarioLogeado.PerfilSeleccionado);
        }
        else
        {
            $scope.GetUnidadNegocio();
            $scope.usuario = datosUsuario.getUsuario(); 
        }
    };
    
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            } 
            else if($scope.usuarioLogeado.PerfilSeleccionado == "Operativo")
            {
                $scope.Inicializar();
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
        else
        {
            $window.location = "#Login";
        }
    }
    
    //Se manda a llamar cada ves que los datos de un usuario han cambiado
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $location.path('/Login');
            return;
        }
        else
        {
            if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $location.path('/Perfil');
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado == "Operativo")
            {
                $scope.Inicializar();
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
    });
    
});
