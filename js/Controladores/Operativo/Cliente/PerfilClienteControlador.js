app.controller("PerfilClienteControlador", function($scope, $rootScope, $http, $q, CONFIG, $window,  $routeParams, $location, datosUsuario)
{   
    /*----------------verificar los permisos---------------------*/
    $rootScope.permisoOperativo = {verTodosCliente: false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "OpeCliConsultar")
            {
                $rootScope.permisoOperativo.verTodosCliente = true;
            }
        }
    };
    
    $rootScope.personaId = $routeParams.personaId;
    $rootScope.seccion = $routeParams.seccion;
    
    $rootScope.persona = new Persona();
    
    $scope.opciones = optPerfil;
    
    $scope.clasePersona = {nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"};
    
    //-------------------------------
    $scope.GetClaseSeccion = function(seccion)
    {
        if(seccion == $rootScope.seccion)
        {
            return "active";
        }
        else
        {
            return "";
        }
    };
    
    /*---------------- Catálogos -------------------*/
    $scope.GetDatoPersona = function(id)              
    {
        GetDatoPersona($http, $q, CONFIG, id).then(function(data)
        {
            $rootScope.persona = $scope.SetPersonaDatos(data);
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetPersonaDatos = function(data)
    {
        var persona = new Persona();

        persona.PersonaId = data.PersonaId;
        persona.Nombre = data.Nombre;
        persona.PrimerApellido = data.PrimerApellido;
        persona.SegundoApellido = data.SegundoApellido;
        
        persona.MedioCaptacion.MedioCaptacionId = data.MedioCaptacionId;
        
        if(data.MedioCaptacionId == "0")
        {
            persona.NombreMedioCaptacion = data.NombreMedioCaptacion;
            persona.MedioCaptacion.Nombre = "Otro";
        }
        else
        {
            persona.NombreMedioCaptacion = "";
            persona.MedioCaptacion.Nombre = data.NombreMedioCaptacion;
        }
        persona.TipoPersona.TipoPersonaId = data.TipoPersonaId;
        
        return persona;
    };
    
    
    //------------------------ Datos Persona --------------------------
    $rootScope.AbrirDatosPersona = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Editar")
        {
            $scope.nuevaPersona = new Persona();
            $scope.CopiarDatos($scope.nuevaPersona, objeto);
        }
        
        $('#datosModal').modal('toggle');
        $scope.GetMedioCaptacion();
    };
    
    $scope.CopiarDatos = function(persona ,data)
    {
        persona.PersonaId = data.PersonaId;
        persona.Nombre = data.Nombre;
        persona.PrimerApellido = data.PrimerApellido;
        persona.SegundoApellido = data.SegundoApellido;
        
        persona.MedioCaptacion.MedioCaptacionId = data.MedioCaptacion.MedioCaptacionId;
        persona.MedioCaptacion.Nombre = data.MedioCaptacion.Nombre;
        persona.NombreMedioCaptacion = data.NombreMedioCaptacion;
    };
    
    $scope.CambiarMedioCaptacion = function(medio)
    {
        if(medio == 'otro')
        {
            $scope.nuevaPersona.MedioCaptacion.MedioCaptacionId = "0";
            $scope.nuevaPersona.MedioCaptacion.Nombre = "Otro";
            
        }
        else
        {
            $scope.nuevaPersona.MedioCaptacion = medio;
            $scope.nuevaPersona.NombreMedioCaptacion  = "";
        }
    };
    
    //----------- Terminar -----------
    $scope.TerminarDatosPersona = function(nombreInvalido, apellido1Invalido, medioInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido, apellido1Invalido, medioInvalido))
        {
            return;
        }
        else
        {
            if($scope.operacion == "Editar")
            {
                $scope.EditarDatosPersona();
            }
        }
    };
    
    $scope.EditarDatosPersona = function()
    {
        EditarDatosPersona($http, CONFIG, $q, $scope.nuevaPersona).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#datosModal').modal('toggle');
                $scope.mensaje = "Los datos se han actualizado.";
                
                $scope.CopiarDatos($rootScope.persona, $scope.nuevaPersona);
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajePerfil').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido, apellido1Invalido, medioInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre válido.";
            $scope.clasePersona.nombre = "entradaError";
        }
        else
        {
            $scope.clasePersona.nombre = "entrada";
        }
        
        if(apellido1Invalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El primer apellido no es válido.";
            $scope.clasePersona.apellido1 = "entradaError";
        }
        else
        {
            $scope.clasePersona.apellido1 = "entrada";
        }
        
        if($scope.nuevaPersona.SegundoApellido.length > 0)
        {
            if(!$rootScope.erNombrePersonal.test($scope.nuevaPersona.SegundoApellido))
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El segundo apellido no es válido.";
                $scope.clasePersona.apellido2 = "entradaError";
            }
            else
            {
                $scope.clasePersona.apellido2 = "entrada";
            }
        }
        
        if($scope.nuevaPersona.MedioCaptacion.MedioCaptacionId.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un medio de captación.";
            $scope.clasePersona.captacion = "dropdownlistModalError";
        }
        else
        {
             $scope.clasePersona.captacion = "dropdownlistModal";
            
            if($scope.nuevaPersona.MedioCaptacion.MedioCaptacionId == "0")
            {
                if(medioInvalido)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El nombre de medio de captación solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
                    $scope.clasePersona.otro = "entradaError";
                }
                else
                {
                    $scope.clasePersona.otro = "entrada";
                }
            }
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
    
    $scope.CerrarDatosModal = function()
    {
        $scope.mesajeError = [];
        $scope.clasePersona = {nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"};
    };
    
    //------- catálogos ---------------
    $scope.GetMedioCaptacion = function()              
    {
        GetMedioCaptacion($http, $q, CONFIG).then(function(data)
        {
            $scope.medioCaptacion = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //---------- Inicializar ---------------------+
    $scope.IncializarControlador = function()
    {
        $scope.GetDatoPersona($rootScope.personaId);
    };
    
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
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
                $scope.IdentificarPermisos();
                $scope.IncializarControlador();
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
                $scope.IdentificarPermisos();
                $scope.IncializarControlador();
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
    });
    
});


var optPerfil = [
                    {titulo: "Datos generales", icono:"fa fa-id-card-o", referencia:"DatosGenerales"},
                    {titulo: "Proyectos", icono:"fa fa-archive", referencia:"Proyectos"},
                    {titulo: "Citas", icono:"fa fa-calendar-o", referencia:"Citas"},
                    {titulo: "Contratos", icono:"fa fa-handshake-o", referencia:"Contratos"},
                    //{titulo: "Notas", icono:"fa fa-sticky-note-o", referencia:"Notas"}
                ];
