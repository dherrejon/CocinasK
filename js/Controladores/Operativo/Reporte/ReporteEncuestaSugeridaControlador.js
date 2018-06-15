app.controller("ReporteEncuestaSugeridaController", function($scope, $rootScope, $http, $q, CONFIG, $window,  $routeParams, $location, datosUsuario, CocinasKService)
{   
    $rootScope.clasePrincipal = "";
    
    $scope.encuesta = [];
    $scope.tipoEncuesta = [];
    $scope.estatusEncuestaSugerida = [];
    
    $scope.filtro = {unidad: new Object(), tipoEncuesta: new Object(), estatusEncuesta: new Object(), buscar:""};
    $scope.verFiltro = false;
    
    $scope.ordenar = "-UltimoMovimiento";
    
    /*----------------verificar los permisos---------------------*/
    $scope.permiso = {verTodo: false, ver: false, aplicar: false};
    $rootScope.permisoOperativo = {verTodosCliente: false};

    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "OpeCliConsultar")
            {
                $scope.permiso.verTodo = true;
                $rootScope.permisoOperativo.verTodosCliente = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "OpeRESConsultar")
            {
                $scope.permiso.ver = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "OpeApEnConsultar")
            {
                $scope.permiso.aplicar = true;
            }
        }
    };
    
    //Catalogos 
    $scope.GetCatalagos = function()
    {
        $scope.GetUnidadNegocio();
        $scope.GetReporteEncuetaSugerida();
        
        $scope.tipoEncuesta = GetTipoEncuesta();
        $scope.estatusEncuestaSugerida = GetEstatusEncuestaSugerida();
        
        $scope.filtro.estatusEncuesta = $scope.estatusEncuestaSugerida[0];
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
    
    $scope.GetReporteEncuetaSugerida = function()
    {   
        var unidad = $scope.permisoOperativo.verTodosCliente ? -1 : $scope.usuario.UnidadNegocioId;
        (self.servicioObj = CocinasKService.Get('Reporte/EncuestaSugerida/' + unidad )).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.encuesta = dataResponse.data;
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
    
    
    //filtrar
    $scope.CambiarTipoEncuesta = function(tipo)
    {
        if(tipo != "ninguno")
        {
            $scope.filtro.tipoEncuesta = tipo;
        }
        else
        {
            $scope.filtro.tipoEncuesta = new Object();
        }
    };
    
    $scope.CambiarUnidadNegocio = function(unidad)
    {
        if(unidad != "ninguna")
        {
            $scope.filtro.unidad = unidad;
        }
        else
        {
            $scope.filtro.unidad = new Object();
        }
    };
    
    $scope.CambiarEstatusEncuesta = function(estatus)
    {
        if(estatus != "ninguno")
        {
            $scope.filtro.estatusEncuesta = estatus;
        }
        else
        {
            $scope.filtro.estatusEncuesta = new Object();
        }
    };
    
    $scope.FiltroEncuestaSugerida= function(encuesta)
    {
        if($scope.filtro.tipoEncuesta.TipoEncuestaId)
        {
            if($scope.filtro.tipoEncuesta.TipoEncuestaId != encuesta.TipoEncuestaId)
            {
                return false;
            }
        }
        
        if($scope.filtro.unidad.UnidadNegocioId)
        {
            if($scope.filtro.unidad.UnidadNegocioId != encuesta.UnidadNegocioId)
            {
                return false;
            }
        }
        
        if($scope.filtro.estatusEncuesta.EstatusEncuestaSugeridaId)
        {
            if($scope.filtro.estatusEncuesta.EstatusEncuestaSugeridaId != encuesta.EstatusEncuestaSugeridaId)
            {
                return false;
            }
        }
        
        
        return true;
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
    
    //-- Detalle --
    $scope.DetalleEncuesta = function(encuesta)
    {
        //Rechazada
        if(encuesta.EstatusEncuestaSugeridaId == "3")
        {
            $scope.motivoRechazoDetalle = encuesta.MotivoRechazo;
            $('#MotivoRechazo').modal('toggle');
        }
        
        //Realizada
        if(encuesta.EstatusEncuestaSugeridaId == "2")
        {
           $rootScope.$broadcast('DetalleEncuestaAplicada', encuesta);
        }
        
    };
    
    //-- Rechazar encuesta --
    $scope.RechazarEncuesta = function(data)
    {
        data.UsuarioId = $scope.usuario.UsuarioId;
        $rootScope.$broadcast('RechazarEncuesta', data);
    };
    
    $scope.$on('EncuestaRechazadaGuardada', function(evento, data)
    {
        for(var k=0; k<$scope.encuesta.length; k++)
        {
            if($scope.encuesta[k].EncuestaSugeridaId == data.encuestaSugeridaId)
            {
                $scope.encuesta[k].EstatusEncuestaSugeridaId = "3";
                $scope.encuesta[k].NombreEstatusEncuestaSugerida = "Rechazada";
                $scope.encuesta[k].MotivoRechazo = data.motivo;
                break;
            }
        }
    });
    
    //-- Aplicar encuesta --
    $scope.AplicarEncuesta = function(data)
    {
        data.UsuarioId = $scope.usuario.UsuarioId;
        $rootScope.$broadcast('AplicarEncuesta', data);
    };
    
    $scope.$on('EncuestaAplicada', function()
    {
        $scope.GetReporteEncuetaSugerida();
    });
    
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
            $scope.usuario = datosUsuario.getUsuario(); 
            $scope.GetCatalagos();
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