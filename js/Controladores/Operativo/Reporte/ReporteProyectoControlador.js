app.controller("ReporteProyectoControlador", function($scope, $rootScope, $http, $q, CONFIG, $window,  $routeParams, $location, datosUsuario)
{   
    $rootScope.clasePrincipal = "";
    
    /*----------------verificar los permisos---------------------*/
    $scope.permiso = {verTodo: false, ver: false};
    $rootScope.permisoOperativo = {verTodosCliente: false};
    
    $scope.unidad = [];
    $scope.filtro = {fecha1: "", fecha2: "", unidad: new Object()};
    $scope.buscar = false;
    $scope.ordenar = "Cliente";
    $scope.busqueda = "";
    $scope.estatusProyecto = GetEstatusProyecto();
    $scope.filtroEstatus = new Object();
    
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "OpeCliConsultar")
            {
                $scope.permiso.verTodo = true;
                $rootScope.permisoOperativo.verTodosCliente = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "OpeRProConsultar")
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

    };
    
    //---------------- Filtro -----------------
    $scope.FiltroProyecto = function(proyecto)
    {
        if($scope.filtroEstatus.EstatusProyectoId)
        {
            if($scope.filtroEstatus.EstatusProyectoId != proyecto.EstatusProyectoId)
            {
                return false;
            }
        }
        
        return true;
    };
    
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
    
    $scope.CambiarEstatusFiltro = function(estatus)
    {
        if(estatus == 'ninguno')
        {
            $scope.filtroEstatus = new Object();
        }
        else
        {
            $scope.filtroEstatus = estatus;
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
        $scope.filtroEstatus = new Object();
        
        $('#fechaInicio').data("DateTimePicker").clear();
        $('#fechaFin').data("DateTimePicker").clear();
        
        $scope.buscar = false;
        $scope.busqueda = "";
        $scope.proyecto = [];
        
        $('#fechaFin').datetimepicker("minDate", false);
        $('#fechaInicio').datetimepicker("maxDate", new Date());
    };
    
    //---- Enviar Filtro
    $scope.GetReporteProyecto = function()
    {   
        GetReporteProyecto($http, $q, CONFIG, $scope.datos).then(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                data[k].FechaFormato = TransformarFecha(data[k].FechaInicio);
            }
            
            $scope.proyecto = data;
    
        }).catch(function(error)
        {
            $scope.proyecto = [];
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
            $scope.GetReporteProyecto();
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
    
    //---------------------------- Estatus -----------------------
    $scope.MostrarEstatus = function(actualId, cambiarId)
    {
        if(actualId == cambiarId || cambiarId=="2")
        {
            return false;
        }
        
        if(actualId == "1")
        {
            return true;
        }
        else if(actualId == "3")
        {
            return true;
        }
        else if(actualId == "4")
        {
            if(cambiarId != "1")
            {
                return false;
            }
            else
            {
                return true;
            }
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
