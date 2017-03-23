app.controller("DatosClienteControlador", function($scope, $rootScope, CITA, $http, $q, CONFIG)
{   
    $scope.titulo = "datos generales";
    
    $scope.acordion = opcionesDatos;
    
    $scope.GetMedioContactoPersona = function(id)              
    {
        GetMedioContactoPersona($http, $q, CONFIG, id).then(function(data)
        {
            $rootScope.persona.Contacto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDireccionPersona = function(id)              
    {
        GetDireccionPersona($http, $q, CONFIG, id).then(function(data)
        {
            $rootScope.persona.Domicilio = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetUnidadNegocioPersona = function(id)              
    {
        GetUnidadNegocioPersona($http, $q, CONFIG, id).then(function(data)
        {
            $rootScope.persona.UnidadNegocio = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //----------- Inicializar ------------
    $scope.GetMedioContactoPersona($rootScope.personaId);
    $scope.GetDireccionPersona($rootScope.personaId);
    $scope.GetUnidadNegocioPersona($rootScope.personaId );
});

var opcionesDatos = [
                        {titulo:"Datos"},
                        {titulo:"Medio de Contacto"},
                        {titulo:"Domicilios"},
                        {titulo:"Contactos adicionales"},
                        {titulo:"Datos fiscales"},
                        {titulo:"Unidades de Negocio"}
                    ];
