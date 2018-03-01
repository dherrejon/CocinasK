app.controller("ReportePagoController", function($scope, $rootScope, $http, $q, CONFIG, $window,  $routeParams, $location, datosUsuario)
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
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "OpeCliConsultar")
            {
                $scope.permiso.verTodo = true;
                $rootScope.permisoOperativo.verTodosCliente = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "OpeVRPConsultar")
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
            case "-Venta":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  ProyectoNombre DESC", [$scope.pago]);
                break;  
            case "Venta":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  ProyectoNombre ASC", [$scope.pago]);
                break; 
            case "-Total":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  Total DESC", [$scope.pago]);
                break;  
            case "Total":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  Total ASC", [$scope.pago]);
                break; 
            case "-Cliente":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  Cliente DESC", [$scope.pago]);
                break;  
            case "Cliente":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  Cliente ASC", [$scope.pago]);
                break; 
            case "-Fecha":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  Fecha DESC, Hora DESC", [$scope.pago]);
                break;  
            case "Fecha":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  Fecha ASC, Hora ASC", [$scope.pago]);
                break;
            case "-Unidad":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  NombreTipoUnidadNegocio DESC, NombreUnidadNegocio DESC", [$scope.pago]);
                break;  
            case "Unidad":
                $scope.pago = alasql("SELECT * FROM ? ORDER BY  NombreTipoUnidadNegocio ASC, NombreUnidadNegocio ASC", [$scope.pago]);
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
        $scope.pago = [];
        $scope.totalPago = 0;
        
        $('#fechaFin').datetimepicker("minDate", false);
        $('#fechaInicio').datetimepicker("maxDate", new Date());
    };
    
    //---- Enviar Filtro
    $scope.GetReportePago = function()
    {   
        GetReportePago($http, $q, CONFIG, $scope.datos).then(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                data[k].Pago  = parseFloat(data[k].Pago);
            }
            
            $scope.pago = alasql( "SELECT *, SUM(Pago) as Total FROM ? GROUP BY NoNotaCargo, Concepto, ContratoId", [data]);
            
            $scope.totalPago = 0;
            
            if($scope.pago[0].Total > 0)
            {
                for(var k=0; k<$scope.pago.length; k++)
                {
                    $scope.pago[k].Desgloce = alasql("SELECT * FROM ? WHERE ContratoId = '" + $scope.pago[k].ContratoId + "' AND NoNotaCargo = '" + $scope.pago[k].NoNotaCargo + "' AND Concepto = '" + $scope.pago[k].Concepto + "'", [data]);
                }

                for(var k=0; k<$scope.pago.length; k++)
                {
                    $scope.pago[k].FechaFormato = TransformarFecha($scope.pago[k].Fecha);
                    $scope.pago[k].Pago  = parseFloat($scope.pago[k].Pago);

                    $scope.pago[k].Total  = parseFloat($scope.pago[k].Total);

                    $scope.totalPago += $scope.pago[k].Total;
                }
            }
            
            $scope.Ordenar();
        }).catch(function(error)
        {
            $scope.pago = [];
            alert(error);
        });
    };
    
    $scope.GetPagoFiltro = function()
    {
        if(!$scope.ValidarFiltro())
        {
            return;
        }
        else
        {
            $scope.buscar = true;
            $scope.GetReportePago();
        }
    };
    
    $scope.ValidarFiltro = function()
    {
        $scope.datos = {fecha1:"", fecha2:"", unidadId:""};
        $scope.mensajeError = [];
        
        if($scope.filtro.fecha1 == undefined || $scope.filtro.fecha1 == null)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona la primera fecha.";
        }
        else
        {
            if($scope.filtro.fecha1.length == 0 )
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona la primera fecha.";
            }
        }
        
        if($scope.filtro.fecha1 == undefined || $scope.filtro.fecha1 == null)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona la segunda fecha.";
        }
        else
        {
            if($scope.filtro.fecha2.length == 0 )
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