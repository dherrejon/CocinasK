app.controller("EncuestaPerfilControlador", function($scope, $rootScope, CocinasKService, datosUsuario)
{   
    $scope.tabSeleccionada = "Sugerida";
    $scope.filtro = {estatusEncuesta:"", tipoEncuesta:""};
    $scope.ordenar = "-UltimoMovimiento";
    $scope.usuario =  datosUsuario.getUsuario(); 
    
    //-- Iniciar --
    /*----------------verificar los permisos---------------------*/
    $scope.permiso = {ver: false, aplicar: false};

    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "OpeRESConsultar")
            {
                $scope.permiso.ver = true;
                
                //Obtener las encuestas sugeridas
                $scope.GetReporteEncuetaSugerida();
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
        $scope.IdentificarPermisos();
        
        $scope.tipoEncuesta = GetTipoEncuesta();
        $scope.estatusEncuestaSugerida = GetEstatusEncuestaSugerida();
        
        $scope.filtro.estatusEncuesta = $scope.estatusEncuestaSugerida[0];
        
        $scope.GetEncuestaAplicada();
    };
    
    $scope.GetReporteEncuetaSugerida = function()
    {
        (self.servicioObj = CocinasKService.Get('Reporte/EncuestaSugerida/Cliente/' + $rootScope.personaId )).then(function (dataResponse) 
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
    
    $scope.GetEncuestaAplicada = function()
    {
        (self.servicioObj = CocinasKService.Get('Encuesta/Aplicada/Cliente/' + $rootScope.personaId )).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.encuestaAplicada = dataResponse.data;
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede cargar la información.", 'error');
                $scope.encuestaAplicada = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $scope.encuestaAplicada = [];
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
    //-- Control Vista --
    $scope.CambiarTab = function(tab)
    {
        if(tab != $scope.tabSeleccionada)
        {
            $scope.tabSeleccionada = tab;
        }
        else
        {
            $scope.tabSeleccionada = "";
        }
    };
    
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
        
        if($scope.filtro.estatusEncuesta.EstatusEncuestaSugeridaId)
        {
            if($scope.filtro.estatusEncuesta.EstatusEncuestaSugeridaId != encuesta.EstatusEncuestaSugeridaId)
            {
                return false;
            }
        }
        
        
        return true;
    };
    
     //-- Detalle --
    $scope.DetalleEncuesta = function(encuesta)
    {
        //Rechazada        
        if(encuesta.EstatusEncuestaSugeridaId == "3")
        {
            $scope.motivoRechazoDetalle = encuesta.MotivoRechazo;
            $('#MotivoRechazoPerfil').modal('toggle');
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
        
        $scope.nuevaEncuesta = "sugerida";
    };
    
    $scope.$on('EncuestaAplicada', function()
    {
        if($scope.nuevaEncuesta == "sugerida")
        {
            $scope.GetReporteEncuetaSugerida();
            $scope.GetEncuestaAplicada();
        }
        else if($scope.nuevaEncuesta == "nueva")
        {
            $scope.GetEncuestaAplicada();
        }
       
    });
    
    $scope.AplicarNuevaEncuesta = function()
    {
        var data = {UsuarioId:"", PersonaId: ""};
        data.UsuarioId = $scope.usuario.UsuarioId;
        data.PersonaId = $rootScope.personaId;
        data.EncuestaSugeridaId = "-1";
        
        $scope.nuevaEncuesta = "nueva";
        
        $rootScope.$broadcast('AplicarEncuesta', data);
    };
    
    $scope.DetalleEncuestaAplicada = function(encuesta)
    {
        $rootScope.$broadcast('DetalleEncuestaAplicada', encuesta);        
    };

});
