app.controller("DatosClienteControlador", function($scope, $rootScope, CITA, $http, $q, CONFIG, MEDIOCONTACTO, DOMICILIO, DATOSFISCALES)
{   
    $scope.titulo = "datos generales";
    
    $scope.acordion = opcionesDatos;
    $scope.tabSeleccionada = "";
    
    $scope.claseAdicional = {nombre:"entrada", telefono:"entrada", correo:"entrada"};
    
    /*------------------------------------------ Cátalogos ----------------------------------------*/
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
    
    $scope.GetContactoAdicional = function(id)              
    {
        GetContactoAdicional($http, $q, CONFIG, id).then(function(data)
        {
            $rootScope.persona.ContactoAdicional = data;
            console.log($rootScope.persona);
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDatosFiscales = function(id)              
    {
        GetDatosFiscales($http, $q, CONFIG, id).then(function(data)
        {
            $rootScope.persona.DatosFiscales = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*--------------- Otros Catálogos -------------*/
    $scope.GetUnidadNegocio = function(unidad)
    {
        GetUnidadNegocioSencilla($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {            
                for(var k=0; k<data.length; k++)
                {
                    data[k].show = true;
                    for(var i=0; i<unidad.length; i++)
                    {
                         if(unidad[i].UnidadNegocioId == data[k].UnidadNegocioId)
                        {
                            data[k].show = false;
                            break;
                        }
                    } 
                }
                
                $scope.unidadNegocio = data;
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
    
    //-------------------------- Operaciones -------------------------------------------
    $scope.CambiarTab = function(tab)
    {
        if(tab == $scope.tabSeleccionada)
        {
            $scope.tabSeleccionada = "";
        }
        else
        {
            $scope.tabSeleccionada = tab;
        }
    };
    
    $scope.GetClaseTab = function(tab)
    {
        if(tab == $scope.tabSeleccionada)
        {
            return "active";
        }
        else
        {
            return "";
        }
    };
    
    $scope.MostrarDomicilio = function(tipoMedioContactoId)
    {
        return parseInt(tipoMedioContactoId) > 0;
    };
    
    //------- Medio de contacto -- 
    $scope.AgregarMedioContacto = function(fuente)
    {
        MEDIOCONTACTO.AgregarMedioContactoPersona($rootScope.personaId, fuente);
    };
    
    $scope.$on('TerminarNuevoContactoPersona',function()
    {
        $scope.GetMedioContactoPersona($rootScope.personaId);
    });
    
    $scope.EditarContactoAgregado = function(contacto, fuente)
    {
        MEDIOCONTACTO.EditarMedioContactoRegistrado(contacto, fuente);
    };
    
    $scope.$on('MedioContactoEditado',function()
    {
        $scope.GetMedioContactoPersona($rootScope.personaId);
    });
    
    //-------- Domicilios ------------------------
    $scope.AgregarDomicilio = function(fuente)
    {
        DOMICILIO.AgregarDomicilioPersona($rootScope.personaId, fuente);
    };
    
    $scope.$on('TerminarNuevoDomicilioPersona',function()
    {
        $scope.GetDireccionPersona($scope.persona.PersonaId);
    });
    
    $scope.EditarDomicilioAgregado = function(domicilio, fuente)
    {
        DOMICILIO.EditarDomicilioRegistrado(domicilio, fuente);
    };
    
    $scope.$on('DomicilioEditado',function()
    {
        $scope.GetDireccionPersona($scope.persona.PersonaId);
    });
    
    $scope.DetalleDomicilio = function(domicilio, fuente)
    {
        if(fuente == "fiscal")
        {
            domicilio.TipoMedioContacto = new TipoMedioContacto();
            domicilio.TipoMedioContacto.Nombre = "Fiscal";
        }
        DOMICILIO.VerDomicilio(domicilio);
    };
    
    $scope.GetCountDomicilio = function()
    {
        var val = 0;
        for(var k=0; k<$rootScope.persona.Domicilio.length; k++)
        {
            if(parseInt($rootScope.persona.Domicilio[k].TipoMedioContacto.TipoMedioContactoId) > 0)
            {
                val++;
                break;
            }
        }
        
        return val;  
    };
    
    //------------ UnidadNegocio --------------------
    $scope.AbrirUnidadNegocioPersona = function(unidad)
    {
        $scope.unidadNegocioPersona = $scope.SetUnidadNegocioPersona(unidad);
        
        $scope.GetUnidadNegocio(unidad);
        $scope.mostrarUnidad = false;
        $('#unidadNegocioPeriflModal').modal('toggle');
    };
    
    $scope.CambiarMostrarUnidad = function()
    {
        $scope.mostrarUnidad = !$scope.mostrarUnidad;
    };
    
    $scope.AgregarUnidadNegocioPersona = function(unidad)
    {
        $scope.unidadNegocioPersona.push(unidad);
        unidad.show = false;
    };
    
    $scope.QuitarUnidadNegocioPersona = function(unidad)
    {
        for(var k=0; $scope.unidadNegocio.length; k++)
        {
            if(unidad.UnidadNegocioId == $scope.unidadNegocio[k].UnidadNegocioId)
            {
                $scope.unidadNegocio[k].show = true;
                break;
            }
        }
        
        for(var k=0; k<$scope.unidadNegocioPersona.length; k++)
        {
            if(unidad.UnidadNegocioId == $scope.unidadNegocioPersona[k].UnidadNegocioId)
            {
                $scope.unidadNegocioPersona.splice(k,1);
                break;
            }
        }
    };
    
    $scope.QuitarUnidadNegocio = function(unidad)
    {
        if($rootScope.persona.UnidadNegocio.length > 1)
        {
            $scope.quitarUnidadId = unidad.UnidadNegocioPorPersonaId;
            $scope.mensajeAdvertencia = "¿Esta seguro de quitar la unidad de necio " + unidad.NombreTipoUnidadNegocio + " - " +unidad.Nombre + " del cliente?";
            $('#quitarUnidadModal').modal('toggle');
        }
        else
        {
            $rootScope.mensaje = "No se puede quitar la unidad de negocio. El cliente debe de tener al menos una unidad de negocio.";
            $('#mensajePerfil').modal('toggle');
        }
    };
    
    $scope.EliminarUnidadNegocioPersona = function()
    {  
        EliminarUnidadNegocioPersona($http, $q, CONFIG, $scope.quitarUnidadId).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $rootScope.mensaje = "El cliente ya no pertenece a la unidad de negocio seleccionada.";
                $('#mensajePerfil').modal('toggle');
                
                $scope.GetUnidadNegocioPersona($rootScope.personaId);
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                $('#mensajePerfil').modal('toggle');
            }
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    $scope.SetUnidadNegocioPersona = function(data)
    {
        var unidad = [];
        
        for(var k=0; k<data.length; k++)
        {
            unidad[k] = new UnidadNegocio();
            
            unidad[k].Nombre = data[k].Nombre;
            unidad[k].UnidadNegocioId = data[k].UnidadNegocioId;
            unidad[k].NombreTipoUnidadNegocio = data[k].NombreTipoUnidadNegocio;
            unidad[k].TipoUnidadNegocioId = data[k].TipoUnidadNegocioId;
        }
        
        return unidad;
    };
    
    $scope.TerminarUnidadNegocioPersona = function()
    {
        $scope.mensajeError = [];
        if($scope.unidadNegocioPersona.length == 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El cliente debe pertenecer al menos a una unidad de negocios."; 
            return;
        }
        else
        {
            $scope.EditarUnidadNegocioPersona();
        }
    };
    
    $scope.EditarUnidadNegocioPersona = function()
    {
        $scope.nuevaUnidadPersona = new Object();
        
        $scope.nuevaUnidadPersona.Persona = new Object();
        $scope.nuevaUnidadPersona.Unidad = new Object();
        
        $scope.nuevaUnidadPersona.Persona.PersonaId = $rootScope.personaId;
        $scope.nuevaUnidadPersona.Unidad = $scope.unidadNegocioPersona;
        EditarUnidadNegocioPersona($http, CONFIG, $q, $scope.nuevaUnidadPersona).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#unidadNegocioPeriflModal').modal('toggle');
                $rootScope.mensaje = "Las unidades de negocio del cliente se han actualizado.";
                
                $scope.GetUnidadNegocioPersona($rootScope.personaId);
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajePerfil').modal('toggle');
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    
    $scope.CerrarUnidadNegocioPersona = function()
    {
        $scope.mensajeError = [];
    };
    
    //--------------------- Contacto Adicional ------------
    $scope.AbrirContactoAdicional = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoContactoAdicional = new ContactoAdicional();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoContactoAdicional = $scope.SetContactoAdicional(objeto);
        }
        
        $('#contactoAdicionalModal').modal('toggle');
    };
    
    $scope.SetContactoAdicional = function(data)
    {
        var contacto = new ContactoAdicional();
        
        contacto.ContactoAdicionalId = data.ContactoAdicionalId;
        contacto.Nombre = data.Nombre;
        contacto.Telefono = data.Telefono;
        contacto.Correo = data.CorreoElectronico;
        
        contacto.PersonaId = $rootScope.personaId;
        
        return contacto;
    };
    
    $scope.TerminarContactoAdicional = function(nombreInvalido, telefonoInvalido, correoInvalido)
    {
        if(!$scope.ValidarDatosContactoAdicional(nombreInvalido, telefonoInvalido, correoInvalido))
        {
            return;
        }
        else
        {
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarContactoAdicional();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarContactoAdicional();
            }
        }
    };
    
    $scope.AgregarContactoAdicional = function()
    {
        $scope.nuevoContactoAdicional.PersonaId = $rootScope.personaId;
        
        AgregarContactoAdicional($http, CONFIG, $q, $scope.nuevoContactoAdicional).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#contactoAdicionalModal').modal('toggle');
                $rootScope.mensaje = "El contacto adicional se ha agregado.";
                
                $scope.GetContactoAdicional($rootScope.personaId);
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajePerfil').modal('toggle');
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    $scope.EditarContactoAdicional = function()
    {
        EditarContactoAdicional($http, CONFIG, $q, $scope.nuevoContactoAdicional).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#contactoAdicionalModal').modal('toggle');
                $rootScope.mensaje = "El contacto adicional se ha editado.";
                
                $scope.GetContactoAdicional($rootScope.personaId);
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajePerfil').modal('toggle');
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    $scope.ValidarDatosContactoAdicional = function(nombreInvalido, telefonoInvalido, correoInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre válido.";
            $scope.claseAdicional.nombre = "entradaError";
        }
        else
        {
            $scope.claseAdicional.nombre = "entrada";
        }
        
        if(correoInvalido && telefonoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Desbes de indicar un teléfono o un correo electrónico.";
        }
        else
        {
            if($scope.nuevoContactoAdicional.Telefono == undefined)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un teléfono válido.";
                $scope.claseAdicional.telefono = "entradaError";
            }
            else
            {
                $scope.claseAdicional.telefono = "entrada";
            }

            if($scope.nuevoContactoAdicional.Correo == undefined)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un corrreo electronico válido.";
                $scope.claseAdicional.correo = "entradaError";
            }
            else
            {
                $scope.claseAdicional.correo = "entrada";
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
    
    //------- Datos fiscales -- 
    $scope.AgregarDatosFiscales = function()
    {
        DATOSFISCALES.AgregarDatoFiscal($rootScope.persona);
    };
    
    $scope.$on('DatoFiscalTerminado',function()
    {
        $scope.GetDatosFiscales($scope.persona.PersonaId);
    });
    
    $scope.EditarDatosFiscales = function(dato)
    {
        DATOSFISCALES.EditarDatoFiscal(dato, $rootScope.persona);
    };
    
    //-----------------------------------------
    $scope.CerrarContactoAdicional = function()
    {  
        $scope.mensajeError = [];
        $scope.claseAdicional = {nombre:"entrada", telefono:"entrada", correo:"entrada"};
    };
    
    //----------------------------- Inicializar --------------------------
    $scope.GetMedioContactoPersona($rootScope.personaId);
    $scope.GetDireccionPersona($rootScope.personaId);
    $scope.GetUnidadNegocioPersona($rootScope.personaId );
    $scope.GetContactoAdicional($rootScope.personaId );
    $scope.GetDatosFiscales($rootScope.personaId );
});

var opcionesDatos = [
                        {titulo:"Datos"},
                        {titulo:"Medio de Contacto"},
                        {titulo:"Domicilios"},
                        {titulo:"Contactos adicionales"},
                        {titulo:"Datos fiscales"},
                        {titulo:"Unidades de Negocio"}
                    ];
