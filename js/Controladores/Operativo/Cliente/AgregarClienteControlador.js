app.controller("AgregarClienteControlador", function($scope, $rootScope, CITA, $window, $http, $q, CONFIG, $location, datosUsuario, MEDIOCONTACTO)
{   
    $scope.medioCaptacion = [];
    $scope.unidadNegocio = [];
    $scope.mostrarContenido = {contacto:false, unidad:false};
    
    $scope.$on('AgregarPersona', function()
    {
        $scope.nuevaPersona = new Persona();
        $scope.usuario = $rootScope.usuario;
        $scope.mostrarContenido = {contacto:false, unidad:false};
        $scope.mensajeError = [];
        $scope.persona = [];
        $scope.personaSeleccionada = false;
        
        if($scope.unidadNegocio.length == 0|| $scope.medioCaptacion.length == 0)
        {
            $scope.GetMedioCaptacion();
            $scope.GetUnidadNegocio();
        }
        else
        {
            $scope.SetUnidadNegocioUsuario();
        }
        
        
        $('#agregarPersonaModal').modal('toggle');
    });
    
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
        }
    };
    
    $scope.GoToPeople = function()
    {
        if($scope.nuevaPersona.Nombre && $scope.nuevaPersona.PrimerApellido)
        {
            $scope.GetBuscarPersona();
        }
    };
    
    $scope.GetBuscarPersona = function()              
    {
        var persona = new Object();
        persona.Nombre = $scope.nuevaPersona.Nombre;
        persona.PrimerApellido = $scope.nuevaPersona.PrimerApellido;
        
        GetBuscarPersona($http, $q, CONFIG, persona).then(function(data)
        {
            $scope.persona = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SeleccionarPersona = function(persona)
    {
        for(var k=0; k<$scope.persona.length; k++)
        {
            if($scope.persona[k].PersonaId != persona.PersonaId)
            {
                $scope.persona[k].Seleccionado = false;
            }
        }
        
        if(persona.Seleccionado)
        {
            $scope.nuevaPersona = $scope.SetPersona(persona);
            $scope.GetMedioContactoPersona(persona.PersonaId);
            $scope.GetUnidadNegocioPersona(persona.PersonaId);
            
            $scope.personaSeleccionada = true;
            
            $scope.mensajeError = [];
        }
        else
        {
            $scope.nuevaPersona = new Persona();
            $scope.nuevaPersona.NuevoContacto = [];
            $scope.nuevaPersona.UnidadNegocio = [];
            
            $scope.personaSeleccionada = false;
            
            $scope.SetUnidadNegocioUsuario();
        }
    };
    
    $scope.SetPersona = function(data)
    {
        var persona = new Persona();
        
        persona.PersonaId = data.PersonaId;
        persona.Nombre = data.Nombre;
        persona.PrimerApellido = data.PrimerApellido;
        persona.SegundoApellido = data.SegundoApellido;
        
        if(data.MedioCaptacionId == "0")
        {
            persona.NombreMedioCaptacion = data.NombreMedioCaptacion;
            persona.MedioCaptacion.Nombre = "Otro";
        }
        else
        {
            persona.MedioCaptacion.Nombre = data.NombreMedioCaptacion;
        }
        
        persona.MedioCaptacion.MedioCaptacionId = data.MedioCaptacionId;
        persona.NuevoContacto = $scope.nuevaPersona.NuevoContacto;
        persona.UnidadNegocio = $scope.nuevaPersona.UnidadNegocio;
        
        return persona;
    };
    
    $scope.SetUnidadNegocioUsuario = function()
    {
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {   
            if($scope.unidadNegocio[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
            {
                $scope.nuevaPersona.UnidadNegocio[0] = $scope.unidadNegocio[k];
                $scope.unidadNegocio[k].show = false;
            }
            else
            {
                $scope.unidadNegocio[k].show = true;
            }
        }
    };
    
    $scope.AgregarUnidadNegocio = function(unidad)
    {
        $scope.nuevaPersona.UnidadNegocio.push(unidad);
        
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if(unidad.UnidadNegocioId == $scope.unidadNegocio[k].UnidadNegocioId)
            {
                $scope.unidadNegocio[k].show = false;
                break;
            }
        }
    };
    
    $scope.QuitarUnidadNegocio = function(unidad)
    {
        for(var k=0; k<$scope.nuevaPersona.UnidadNegocio.length; k++)
        {
            if(unidad.UnidadNegocioId == $scope.nuevaPersona.UnidadNegocio[k].UnidadNegocioId)
            {
                $scope.nuevaPersona.UnidadNegocio.splice(k,1);
                break;
            }
        }
        
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if(unidad.UnidadNegocioId == $scope.unidadNegocio[k].UnidadNegocioId)
            {
                $scope.unidadNegocio[k].show = true;
                break;
            }
        }
    };
    
    $scope.MostrarContenido = function(contenido)
    {
        if(contenido == "contacto")
        {
            $scope.mostrarContenido.contacto = !$scope.mostrarContenido.contacto;
        }
        else if(contenido == "unidad")
        {
            $scope.mostrarContenido.unidad = !$scope.mostrarContenido.unidad;
        }
    };
    
    //---- Medio de contacto
    $scope.AgregarMedioContacto = function()
    {
        MEDIOCONTACTO.AgregarMedioContacto("");
    };
    
    $scope.$on('MedioContactoAgregado',function()
    {
        $scope.nuevaPersona.NuevoContacto.push(MEDIOCONTACTO.GetMedioContacto());
    });
    
    $scope.EditarContactoAgregado = function(contacto, tipo)
    {
        $scope.tipoEditar = tipo;
        if(tipo == "Nuevo")
        {
            $scope.nuevoContacto = contacto;
            MEDIOCONTACTO.EditarMedioContacto(contacto, "Proyecto");
        }
        else if(tipo == "Registrado")
        {
            $scope.nuevoContacto = contacto;
            MEDIOCONTACTO.EditarMedioContactoRegistrado(contacto, "Proyecto");
        }
        
    };
    
    $scope.$on('MedioContactoEditado',function()
    {
        if($scope.tipoEditar == "Nuevo")
        {
            for(var k=0; k<$scope.nuevaPersona.NuevoContacto.length; k++)
            {
                if($scope.nuevaPersona.NuevoContacto[k] == $scope.nuevoContacto)
                {
                    $scope.nuevaPersona.NuevoContacto[k] = MEDIOCONTACTO.GetMedioContacto();
                }
            }
        }
        else if($scope.tipoEditar == "Registrado")
        {
            $scope.GetMedioContactoPersona($scope.nuevaPersona.PersonaId);
        }
    });
    
    $scope.BorrarContactoAgregado = function(contacto)
    {
        for(var k=0; k<$scope.nuevaPersona.NuevoContacto.length; k++)
        {
            if(contacto == $scope.nuevaPersona.NuevoContacto[k])
            {
                $scope.nuevaPersona.NuevoContacto.splice(k,1);
                break;
            }
        }
        
    };
    
    $scope.MostrarMedioContacto = function(id)
    {
        return parseInt(id) > 0;
    };
    
    
    //------------ Catálogos ----------
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
    
    $scope.GetUnidadNegocio = function()
    {
        GetUnidadNegocioSencillaPresupuesto($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {   
                $scope.unidadNegocio = data;
                $scope.SetUnidadNegocioUsuario();
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
    
    $scope.GetMedioContactoPersona = function(id)              
    {
        GetMedioContactoPersona($http, $q, CONFIG, id).then(function(data)
        {
            $scope.nuevaPersona.Contacto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetUnidadNegocioPersona = function(id)              
    {
        GetUnidadNegocioPersona($http, $q, CONFIG, id).then(function(data)
        {
            $scope.nuevaPersona.UnidadNegocio = data;
            
            for(var k=0; k<$scope.unidadNegocio.length; k++)
            {
                $scope.unidadNegocio[k].show = true;
                
                for(var i=0; i<data.length; i++)
                {
                    if(data[i].UnidadNegocioId == $scope.unidadNegocio[k].UnidadNegocioId)
                    {
                        $scope.unidadNegocio[k].show = false;
                        break;
                    }
                }
            }
            
            if(!$rootScope.permisoOperativo.verTodosCliente)
            {
                var unidad = false;
                for(var k=0; k<$scope.nuevaPersona.UnidadNegocio.length; k++)
                {
                    if($scope.nuevaPersona.UnidadNegocio[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                    {
                        unidad = true;
                        break;
                    }
                }

                if(!unidad)
                {
                    for(var k=0; k<$scope.unidadNegocio.length; k++)
                    {
                        if($scope.unidadNegocio[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                        {
                            $scope.unidadNegocio[k].show = false;
                            var i = $scope.nuevaPersona.UnidadNegocio.length;
                            $scope.nuevaPersona.UnidadNegocio[i] = $scope.unidadNegocio[k];

                            break;
                        }
                    }
                }
            }
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //------------- Terminar ------
    $scope.TerminarCliente = function()
    {
        if(!$scope.ValidarDatos())
        {
            return;
        }
        else
        {
            if(!$scope.personaSeleccionada)
            {
                $scope.nuevaPersona.PersonaId = "0";
            }
            $scope.GuardarPersona();
        }
    };
    
    $scope.GuardarPersona = function()
    {
        GuardarPersona($http, CONFIG, $q, $scope.nuevaPersona).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#agregarPersonaModal').modal('toggle');
                //$scope.mensaje = "Se ha guardado correctamente.";
                //$rootScope.$broadcast('PersonaGuarda');
                $window.location = "#PerfilCliente/" + data[1].Id + "/DatosGenerales";
            }
            else
            {
                 $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                 $('#mensajeCliente').modal('toggle');
            }
           
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeCliente').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido, apellidoInvalido, medioInvalido)
    {
        $scope.mensajeError = [];
        if(!$scope.nuevaPersona.Nombre)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre válido.";
        }
        
        if(!$scope.nuevaPersona.PrimerApellido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El primer apellido no es válido.";
        }
        
        if($scope.nuevaPersona.SegundoApellido.length > 0)
        {
            if(!$rootScope.erNombrePersonal.test($scope.nuevaPersona.SegundoApellido))
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El segundo apellido no es válido.";
            }
        }
        
        if(!$scope.nuevaPersona.MedioCaptacion.MedioCaptacionId)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un medio de captación.";
        }
        else
        {
            if($scope.nuevaPersona.MedioCaptacion.MedioCaptacionId == "0")
            {
                if(!$scope.nuevaPersona.NombreMedioCaptacion)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El nombre de medio de captación solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
                }
            }
        }
        
        if($scope.nuevaPersona.UnidadNegocio.length == 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar al menos una Unidad de negocio del cliente.";
        }
        
        var telefono = false;
        
        if($scope.nuevaPersona.Contacto !== undefined)
        {
            for(var k=0; k<$scope.nuevaPersona.Contacto.length; k++)
            {
                if($scope.nuevaPersona.Contacto[k].MedioContacto.MedioContactoId == "2")
                {
                    telefono = true;
                    break;
                }
            }
        }
        
        if(!telefono)
        {
            for(var k=0; k<$scope.nuevaPersona.NuevoContacto.length; k++)
            {
                if($scope.nuevaPersona.NuevoContacto[k].MedioContacto.MedioContactoId == "2")
                {
                    telefono = true;
                    break;
                }
            }
        }
        
        if(!telefono)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de ingresar al menos un número telefónico.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        
        for(var k=0; k<$scope.nuevaPersona.NuevoContacto.length; k++)
        {
            var repetido = false;
            for(var i=0; i<$scope.nuevaPersona.NuevoContacto.length; i++)
            {
                if(i<k && $scope.nuevaPersona.NuevoContacto[k].Contacto == $scope.nuevaPersona.NuevoContacto[i].Contacto)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*" + $scope.nuevaPersona.NuevoContacto[k].Contacto + " se repite.";
                    repetido = true;
                    break;
                }
            }
            
            if($scope.nuevaPersona.Contacto !== undefined && !repetido)
            {
                for(var i=0; i<$scope.nuevaPersona.Contacto.length; i++)
                {
                    if($scope.nuevaPersona.NuevoContacto[k].Contacto == $scope.nuevaPersona.Contacto[i].Contacto)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*" + $scope.nuevaPersona.NuevoContacto[k].Contacto + " se repite.";
                        break;
                    }
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
});
