app.controller("ReporteCitaController", function($scope, $rootScope, $http, $q, CONFIG, $window,  $routeParams, $location, datosUsuario, CITA)
{   
    $rootScope.clasePrincipal = "";
    
    $scope.unidad = [];
    $scope.filtro = {unidad: new Object(), estatus: new Object(), tarea: new Object()};
    $scope.ordenar = "Fecha";
    $scope.cita = [];
    $scope.estatus = GetEstatusCita();
    $scope.hoy = GetHoy();
    $scope.busqueda = "";
    $scope.verFiltro = false;
    
    $scope.tareaCita = GetTareaCita();
    
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
            $scope.filtro.estatus = new Object();
        }
        else
        {
            $scope.filtro.estatus = estatus;
        }
    };
    
    $scope.CambiarTareaFiltro = function(tarea)
    {
        if(tarea == 'ninguno')
        {
            $scope.filtro.tarea = new Object();
        }
        else
        {
            $scope.filtro.tarea = tarea;
        }
    };
    
    $scope.FiltroCita = function(cita)
    {
        //unidad
        if($scope.filtro.unidad.UnidadNegocioId)
        {
            if(cita.UnidadNegocioId != $scope.filtro.unidad.UnidadNegocioId)
            {
                return false;
            }
        }
        
        //tarea
        if($scope.filtro.tarea.TareaCitaId)
        {
            if(cita.TareaCitaId != $scope.filtro.tarea.TareaCitaId)
            {
                return false;
            }
        }
        
        //estatus
        if($scope.filtro.estatus.EstatusCitaId)
        {
            if(cita.NombreEstatusCita != $scope.filtro.estatus.Nombre)
            {
                return false;
            }
        }
        
        return true;
    };
    
    //-------------------- vista -------------------------
    $scope.GetCitaPorId = function(cita, opt)              
    {
        GetCitaPorId($http, $q, CONFIG, cita.CitaId).then(function(data)
        {
            if(data.length > 0)
            {
                if(opt == "Detalle")
                {
                    $scope.detalle = data[0];
                    $('#citaDetalle').modal('toggle');
                }
                else if(opt == "Editar")
                {
                    CITA.EditarCita(data[0]);
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                $('#mensajeCitaPendiente').modal('toggle');
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.DetalleCita = function(cita)
    {
        console.log(cita);
        $scope.GetCitaPorId(cita, "Detalle");
    };
    
    
    $scope.GetClaseEstatus = function(nombre)
    {   
        switch(nombre)
        {
            case 'Atrasada':
                return "textoNaranja";
                
            case 'Pendiente':
                return "textoAzul";
                
            default:
                return "";
        }
    };
    
    /*---------- Agregar cita ----------*/
    $scope.AgregarCita = function()
    {
        CITA.AgregarCitaCero(); 
    };
    
    $scope.$on('CitaAgregada',function()
    {
        var cita = CITA.GetCita();
        
        $scope.GetCitaPendientePorId(cita.CitaId, "Agregar");
    });
    
    //------------------------------ Editar Cita -----------------------------
    $scope.EditarCita = function(cita)
    {
        cita.Persona = new Object();
        cita.Persona.Nombre = cita.Cliente;
        cita.Persona.PersonaId = cita.PersonaId;
        
        $scope.GetCitaPorId(cita, "Editar");
    };
    
    $scope.$on('CitaEditada',function()
    {
        var cita = CITA.GetCita();        
        $scope.GetCitaPendientePorId(cita.CitaId, "Editar");
    });
    
    $scope.GetCitaPendientePorId = function(id, opt)
    {   
        GetCitaPendientePorId($http, $q, CONFIG, id).then(function(data)
        {   
            if(data != "Error")
            {
                data.FechaFormato = TransformarFechaEsp2(data.Fecha);
                $scope.GetEstatusCita(data);

                
                if(opt == "Editar")
                {
                    $scope.SetCitaEditadaNueva(data);
                }
                else if(opt == "Agregar")
                {
                    $scope.cita.push(data);
                }
                
                
            }
        }).catch(function(error)
        {
            $scope.cita = [];
            alert(error);
        });
    };
    
    $scope.SetCitaEditadaNueva = function(cita)
    {
        for(var k=0; k<$scope.cita.length; k++)
        {
            if($scope.cita[k].CitaId == cita.CitaId)
            {
                $scope.cita[k] = cita;
                break;
            }
        }     
    };
    
    //-------------------------- Cambiar de Estatus contrato ----------------------
    $scope.CambiarEstatusCita = function(cita, estatus)
    {        
        if(cita.EstatusCitaId != estatus.EstatusCitaId)
        {
            $scope.cambiarCita = new Object();
            $scope.cambiarCita.CitaId = cita.CitaId;
            $scope.cambiarCita.EstatusCitaId = estatus.EstatusCitaId;
            $scope.cambiarCita.EstatusCitaNombre = estatus.Nombre;
        
            $scope.mensajeAdvertencia = "¿Estas seguro de cambiar la cita a " + estatus.Nombre.toUpperCase() + "?";
            $('#cambiarEstatusCitaPendiente').modal('toggle');
        }
    };
    
    $scope.ConfirmarCambiarEstatusCita = function()
    {   
        $scope.cambiarCita.FechaFin2 = GetFechaAhora(); 
        
        CambiarEstatusCita($http, $q, CONFIG, $scope.cambiarCita).then(function(data)
        {
            if(data == "Exitoso")
            {
                $rootScope.mensaje = "El estatus de la cita se ha actualizado correctamente.";
                 
                for(var k=0; k<$scope.cita.length; k++)
                {
                    if($scope.cita[k].CitaId == $scope.cambiarCita.CitaId)
                    {
                        $scope.cita.splice(k,1);
                        break;
                    }
                }
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeCitaPendiente').modal('toggle');
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
            $('#mensajeCitaPendiente').modal('toggle');
        });  
    };
    
    $scope.CancelarEstatusCita = function()
    {
        $scope.cambiarCita = null;
    };
    
    //---- Enviar Filtro
    $scope.GetCitaPendiente = function(unidad, Colaborador)
    {   
        GetCitaPendiente($http, $q, CONFIG, unidad, Colaborador).then(function(data)
        {   
            if(!data[0].Estatus)
            {
                for(var k=0; k<data.length; k++)
                {
                    data[k].FechaFormato = TransformarFechaEsp2(data[k].Fecha);
                    $scope.GetEstatusCita(data[k]);
                }

                $scope.cita = data;
            }
            else
            {
                $scope.cita = [];
            }
        }).catch(function(error)
        {
            $scope.cita = [];
            alert(error);
        });
    };
    
    $scope.GetEstatusCita = function(cita)
    {   
        cita.EstatusCitaId = "2";
        if($scope.hoy > cita.Fecha)
        {
            cita.NombreEstatusCita = "Atrasada";
            
        }
        else
        {
            cita.NombreEstatusCita = "Pendiente";
        }
    };
    
    //------------- Inicializar ----------
    
    $scope.Inicializar = function()
    {
        $scope.GetUnidadNegocio();            
        $scope.usuario = datosUsuario.getUsuario(); 
        var unidadId = $rootScope.permisoOperativo.verTodosCliente ? -1 :$scope.usuario.UnidadNegocioId;
        $scope.GetCitaPendiente(unidadId, $scope.usuario.ColaboradorId);
    };
    
    

});