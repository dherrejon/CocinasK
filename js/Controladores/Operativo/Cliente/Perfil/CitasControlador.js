app.controller("CitaClienteControlador", function($scope, $rootScope, CITA, $http, $q, CONFIG)
{   
    $scope.cita = [];
    $scope.citaEstatus = [];
    
    $scope.filtro = "Todas";
    $scope.filtroEstatus = "Todos";
    
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
    
    
    //-------- Detalle --------
    $scope.DetalleCita = function(cita)
    {
        $scope.detalle = cita;
        $('#citaDetalle').modal('toggle');
    };
    
    $scope.GetTareaCita = function()
    {
        $scope.tareaCita = GetTareaCita();
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
        
        var dd = cita.Fecha2.slice(0,2);
        var mm = cita.Fecha2.slice(3,5);
        var yy = cita.Fecha2.slice(6,10);

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
        if(id != $scope.estatusCita)
        {
            $scope.estatusCita = id;
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
        $scope.cambiarCita.FechaFin2 = GetFechaAhora(); 
        $scope.cambiarCita.FechaFin = TransformarFechaEsp2($scope.cambiarCita.FechaFin2);
        
        CambiarEstatusCita($http, $q, CONFIG, $scope.cambiarCita).then(function(data)
        {
            if(data == "Exitoso")
            {
                $rootScope.mensaje = "El estatus de la cita se ha actualizado correctamente.";
                 
                $scope.cambiarEstatus.EstatusCitaId = $scope.cambiarCita.EstatusCitaId;
                $scope.cambiarEstatus.Nombre = $scope.cambiarCita.EstatusCitaNombre;
                
                $scope.SetCitaFechaFin();
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
    
    $scope.SetCitaFechaFin = function()
    {
        for(var k=0; k<$scope.cita.length; k++)
        {
            if($scope.cita[k].CitaId == $scope.cambiarCita.CitaId)
            {
                $scope.cita[k].FechaFin = $scope.cambiarCita.FechaFin; 
                $scope.cita[k].FechaFin2 = $scope.cambiarCita.FechaFin2;
                break;
            }
        }
    };
    
    /*--------- Filtro --------------*/
    $scope.CambiarTareaFiltro = function(tarea)
    {
        if($scope.filtro != tarea)
        {
            $scope.filtro = tarea;
        }
    };
    
    $scope.CambiarEstatusFiltro = function(estatus)
    {
        if($scope.filtroEstatus != estatus)
        {
            $scope.filtroEstatus = estatus;
        }
    };
    
    $scope.FiltroCita = function(cita)
    {
        if($scope.filtro == "Todas")
        {
            if($scope.estatusCita == '2')
            {
                if($scope.filtroEstatus != 'Todos')
                {
                    if(cita.EstatusCita.Nombre == $scope.filtroEstatus)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return true;
                }
            }
            else
            {
                return true;
            }
        }
        else
        {
            if(cita.Tarea.Nombre == $scope.filtro)
            {
                if($scope.estatusCita == '2')
                {
                    if($scope.filtroEstatus != 'Todos')
                    {
                        if(cita.EstatusCita.Nombre == $scope.filtroEstatus)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    return true;
                }
            }
            else
            {
                return false;
            }
        }
    };
    
    //------------------------------- Exterior ----------------------
    $scope.AgregarCita = function()
    {
        CITA.AgregarCitaPre($rootScope.persona);
    };
    
    $scope.$on('CitaAgregada',function()
    {
        var cita = CITA.GetCita();
        
        $scope.SetCitaAgregada(cita);
    });
    
    $scope.SetCitaAgregada = function(cita)
    {
        if($rootScope.persona.PersonaId == cita.Persona.PersonaId)
        {
            cita.Persona.Nombre = cita.Persona.Nombre + " " + cita.Persona.PrimerApellido + " " + cita.Persona.SegundoApellido ;
            cita.Fecha2 = cita.Fecha;
            cita.Fecha3 = TransformarFechaEsp2Ing(cita.Fecha);
            cita.Fecha = TransformarFechaEsp(cita.Fecha);
            cita.FechaFin = null;
            cita.FechaFin2 = null;

            $scope.cita.push(cita);
        }        
    };
    
    //------------------------------ Editar Cita -----------------------------
    $scope.EditarCita = function(cita)
    {
        cita.Persona = $rootScope.persona;
        CITA.EditarCita(cita);
    };
    
    $scope.$on('CitaEditada',function()
    {
        var cita = CITA.GetCita();        
        $scope.SetCitaEditada(cita);
    });
    
    $scope.SetCitaEditada = function(cita)
    {
        for(var k=0; k<$scope.cita.length; k++)
        {
            if($scope.cita[k].CitaId == cita.CitaId)
            {
                $scope.cita[k].Fecha2 = cita.Fecha;
                $scope.cita[k].Fecha3 = TransformarFechaEsp2Ing(cita.Fecha);
                $scope.cita[k].Fecha = TransformarFechaEsp(cita.Fecha);
                
                $scope.cita[k].HoraInicio = cita.HoraInicio;
                $scope.cita[k].HoraFin = cita.HoraFin;
                $scope.cita[k].Descripcion = cita.Descripcion;
                
                $scope.cita[k].Responsable = cita.Responsable;
                
                $scope.cita[k].EstatusCita.Nombre = "Pendiente";
                $scope.cita[k].EstatusCita.EstatusCitaId = "2";
                $scope.cita[k].FechaFin = null;
                $scope.cita[k].FechaFin2 = null;
                
                $scope.cita[k].DireccionCitaId = cita.DireccionCitaId;
                $scope.cita[k].Domicilio = cita.Domicilio;
            }
        }        
    };
    
    
    //-------- Inicializar -----------
    $scope.citaEstatus = GetEstatusCita();
    $scope.GetCitaPersona($rootScope.personaId);
    $scope.GetTareaCita();
    
    $scope.MostrarEstatusCita("2");
});
