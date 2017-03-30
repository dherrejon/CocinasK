app.controller("CitaClienteControlador", function($scope, $rootScope, CITA, $http, $q, CONFIG)
{   
    $scope.cita = [];
    $scope.citaEstatus = [];
    
    $scope.GetCitaPersona = function(id)              
    {
        GetCitaPersona($http, $q, CONFIG, id).then(function(data)
        {
            $scope.cita = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //---------- Interfeaz -------------------
    $scope.GetClaseEstatus = function(estatus)
    {
        var val = parseInt(estatus.EstatusCitaId);
        
        switch(val)
        {
            case 1:
                return "textoNaranja";
                
            case 2:
                if(estatus.Nombre == "Pendiente")
                    return "textoAzul";
                
                if(estatus.Nombre == "Atrasada")
                    return "textoNaranja";
                
            case 3:
                return "textoVerde";
            case 4:
                return "textoRojo";
                
            default:
                return "";
        }
    };
    
    $scope.GetEstatusCita = function(cita)
    {
        var hoy = new Date();
        
        var dd = cita.Fecha.slice(0,2);
        var mm = cita.Fecha.slice(3,5);
        var yy = cita.Fecha.slice(6,10);

        var hh = cita.HoraFin.slice(0,2);
        var mi = cita.HoraFin.slice(3,5);
        
        var fechaCita = new Date(yy, mm-1, dd, hh, mi);
    
        if(hoy > fechaCita)
        {
            cita.EstatusCita.Nombre = "Atrasada";
            cita.EstatusCita.EstatusCitaId = "2";
        }
    };
    
    $scope.MostrarEstatusCita = function(id)
    {
        for(var k=0; k<$scope.citaEstatus.length; k++)
        {
            if($scope.citaEstatus[k].EstatusCitaId == id)
            {
               $scope.citaEstatus[k].clase = "active"; 
            }
            else
            {
                $scope.citaEstatus[k].clase = ""; 
            }
        }
    };
    
    $scope.CambiarEstatusCita = function(cita, estatus)
    {        
        if(cita.EstatusCita.EstatusCitaId != estatus.EstatusCitaId)
        {
            $scope.cambiarCita = new Object();
            $scope.cambiarCita.CitaId = cita.CitaId;
            $scope.cambiarCita.EstatusCitaId = estatus.EstatusCitaId;
            $scope.cambiarCita.EstatusCitaNombre = estatus.Nombre;
            
            $scope.cambiarEstatus = cita.EstatusCita;
            
            $scope.mensajeAdvertencia = "¿Estas seguro de cambiar la cita a " + estatus.Nombre.toUpperCase() + "?";
            $('#cambiarEstatusCita').modal('toggle');
        }
    };
    
    $scope.ConfirmarCambiarEstatusCita = function()
    {        
        CambiarEstatusCita($http, $q, CONFIG, $scope.cambiarCita).then(function(data)
        {
            if(data == "Exitoso")
            {
                $rootScope.mensaje = "El estatus de la cita se ha actualizado correctamente.";
                 
                $scope.cambiarEstatus.EstatusCitaId = $scope.cambiarCita.EstatusCitaId;
                $scope.cambiarEstatus.Nombre = $scope.cambiarCita.EstatusCitaNombre;
                /*for(var k=0; k<$scope.cita.length; k++)
                {
                    if($scope.cita[k].CitaId == $scope.cambiarCita.CitaId)
                    {
                        $scope.cita[k].EstatusCita = 
                        break;
                    }
                }*/
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
    
    //-------- Inicializar -----------
    $scope.citaEstatus = GetEstatusCita();
    $scope.GetCitaPersona($rootScope.personaId);
    
    $scope.MostrarEstatusCita("2");
});
