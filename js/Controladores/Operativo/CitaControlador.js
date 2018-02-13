app.controller("CitaControlador", function($scope, $rootScope, $location, CITA, $http, $q, CONFIG, MEDIOCONTACTO, DOMICILIO, datosUsuario)
{   
    $scope.tareaCita = [];
    $scope.medioCaptacion = [];
    $scope.persona = [];
    $scope.responsable = [];
    $scope.unidadNegocio = [];
    
    $scope.personaSeleccionada = false;
    $scope.mostrarResponsable = false;
    $scope.tipoResponsable = "UnidadNegocio";
    $scope.buscarColaborador = "";
    $scope.buscarUnidad = "";
    $scope.mostrarContenido = {contacto:false, direccion:false, unidad: false};
    
    $scope.claseCita = {
                            paso1:{nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"},
                            paso2:{tarea:"dropdownlistModal", asunto:"entrada", fecha:"entrada", horaInicio:"entrada", horaFin:"entrada", descripcion:"descripcionArea", responsable:"dropdownlistModal"},
                        };
    
    $scope.$on('AgregarCitaCero',function()
    {
        $scope.operacion = "Agregar";
        $scope.nuevaCita = new Cita();
        $scope.nuevaCita.Persona.NuevoContacto = [];
        $scope.nuevaCita.Persona.NuevoDomicilio = [];
        $scope.nuevaCita.Persona.UnidadNegocio = [];
        
        $scope.personaSeleccionada = false;
        $scope.mostrarResponsable = false;
        $scope.pasoCita = 1;
        $scope.pasoMinimo = 1;

        $scope.IniciarCita();
        
        $('#agregarCitaModal').modal('toggle');
    });
    
    $scope.$on('AgregarCitaPre',function()
    {
        $scope.operacion = "Agregar";
        $scope.nuevaCita = new Cita();
        
        $scope.nuevaCita.Persona = CITA.GetPersona();
        $scope.nuevaCita.Persona.NuevoContacto = [];
        $scope.nuevaCita.Persona.NuevoDomicilio = [];
        $scope.nuevaCita.Persona.UnidadNegocio = [];
        
        $scope.personaSeleccionada = true;
        $scope.mostrarResponsable = false;
        $scope.pasoCita = 2;
        $scope.pasoMinimo = 2;
        
        $scope.IniciarCita(); 
        $scope.GetDireccionPersona($scope.nuevaCita.Persona.PersonaId);
        $scope.GetUnidadNegocioPersona($scope.nuevaCita.Persona.PersonaId);
        
        $('#agregarCitaModal').modal('toggle');
    });
    
     $scope.$on('EditarCita',function()
    {
        $scope.operacion = "Editar";
        $scope.nuevaCita = new Cita();
        
         
        var c = CITA.GetCita();
        $scope.nuevaCita = jQuery.extend({}, c);
        $scope.nuevaCita.Persona.NuevoContacto = [];
        $scope.nuevaCita.Persona.NuevoDomicilio = [];
        $scope.nuevaCita.Persona.UnidadNegocio = [];
         
        $scope.personaSeleccionada = true;
        $scope.mostrarResponsable = false;
        $scope.pasoCita = 2;
        $scope.pasoMinimo = 2;
        
        $scope.nuevaCita.Fecha = $scope.nuevaCita.Fecha2;
        document.getElementById('fechaCita').value = $scope.nuevaCita.Fecha2;
        document.getElementById('horaInicio').value = $scope.nuevaCita.HoraInicio;
        document.getElementById('horaFin').value = $scope.nuevaCita.HoraFin;
        
        $scope.IniciarCita(); 
        $scope.GetDireccionPersona($scope.nuevaCita.Persona.PersonaId);
        //$scope.GetUnidadNegocioPersona($scope.nuevaCita.Persona.PersonaId);
         
        if($scope.nuevaCita.Responsable.UnidadNegocio)
        {
            $scope.tipoResponsable = "UnidadNegocio";
        }
        else
        {
            $scope.tipoResponsable = "Colaborador";
        }
        
        $('#agregarCitaModal').modal('toggle');
    });
    
    $scope.IniciarCita = function()
    {
        $scope.tipoResponsable = "UnidadNegocio";
        $scope.mostrarContenido = {contacto:false, direccion:false, unidad:false};
        
        $scope.CargarCatalogoCita();
        $scope.persona = [];        
    };
    
    $scope.CargarCatalogoCita = function()
    {   
        $scope.GetTareaCita();
        $scope.GetResponsable();
        $scope.GetUnidadNegocio();
        
        if($scope.operacion != "Editar")
        {
            $scope.GetMedioCaptacion();
        }
        
        $scope.usuario = datosUsuario.getUsuario();
    };
    
    /*------------------------------ catálogos --------------------------------*/
    $scope.GetTareaCita = function()
    {
        $scope.tareaCita = GetTareaCita();
    };
    
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
    
    $scope.GetBuscarPersona = function()              
    {
        var persona = new Object();
        persona.Nombre = $scope.nuevaCita.Persona.Nombre;
        persona.PrimerApellido = $scope.nuevaCita.Persona.PrimerApellido;
        GetBuscarPersona($http, $q, CONFIG, persona).then(function(data)
        {
            $scope.persona = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetResponsable = function()
    {
        GetResponsable($http, $q, CONFIG).then(function(data)
        {
            $scope.responsable = data;
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
            $('#').modal('toggle'); 
        });
    };
    
    $scope.GetUnidadNegocio = function()
    {
        GetUnidadNegocioSencilla($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                for(var k=0; k<data.length; k++)
                {
                    data[k].show = true;
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
    
    $scope.GetMedioContactoPersona = function(id)              
    {
        GetMedioContactoPersona($http, $q, CONFIG, id).then(function(data)
        {
            $scope.nuevaCita.Persona.Contacto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDireccionPersona = function(id)              
    {
        GetDireccionPersona($http, $q, CONFIG, id).then(function(data)
        {
            if($scope.operacion == "Editar")
            {
                for(var k=0; k<data.length; k++)
                {
                    if(data[k].DireccionPersonaId == $scope.nuevaCita.DireccionCitaId)
                    {
                        data[k].Seleccionado = true;
                    }
                    else
                    {
                        data[k].Seleccionado = false;
                    }
                }
            }
                    
            $scope.nuevaCita.Persona.Domicilio = data;
            
           
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetUnidadNegocioPersona = function(id)              
    {
        GetUnidadNegocioPersona($http, $q, CONFIG, id).then(function(data)
        {
            $scope.nuevaCita.Persona.UnidadNegocio = data;
            
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
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*----------------------------   Agregar Cita ------------------------*/
    /*----------- interfaz -----------*/
    $scope.GetClaseDropdown = function(valor)
    {
        if(valor)
        {
            return "active";
        }
        else
        {
            return "";     
        }
    };
    
    /*--------- Paso 1 -------------*/
    $scope.TerminarCita1 = function(nombreInvalido, apellidoInvalido, medioInvalido)
    {

        if(!$scope.ValidarDatos(nombreInvalido, apellidoInvalido, medioInvalido))
        {
            return;
        }
        else
        {
            $scope.pasoCita++;
        }
    };
    
    $scope.ValidarDatos = function(nombreInvalido, apellidoInvalido, medioInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre válido.";
            $scope.claseCita.paso1.nombre = "entradaError";
        }
        else
        {
            $scope.claseCita.paso1.nombre = "entrada";
        }
        
        if(apellidoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El primer apellido no es válido.";
            $scope.claseCita.paso1.apellido1 = "entradaError";
        }
        else
        {
            $scope.claseCita.paso1.apellido1 = "entrada";
        }
        
        if($scope.nuevaCita.Persona.SegundoApellido.length > 0)
        {
            if(!$rootScope.erNombrePersonal.test($scope.nuevaCita.Persona.SegundoApellido))
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El segundo apellido no es válido.";
                $scope.claseCita.paso1.apellido2 = "entradaError";
            }
            else
            {
                $scope.claseCita.paso1.apellido2 = "entrada";
            }
        }
        
        if($scope.nuevaCita.Persona.MedioCaptacion.MedioCaptacionId.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un medio de captación.";
            $scope.claseCita.paso1.captacion = "dropdownlistModalError";
        }
        else
        {
             $scope.claseCita.paso1.captacion = "dropdownlistModal";
            
            if($scope.nuevaCita.Persona.MedioCaptacion.MedioCaptacionId == "0")
            {
                if(medioInvalido)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El nombre de medio de captación solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
                    $scope.claseCita.paso1.otro = "entradaError";
                }
                else
                {
                    $scope.claseCita.paso1.otro = "entrada";
                }
            }
        }
        
        if($scope.nuevaCita.Persona.UnidadNegocio.length == 0 && $rootScope.permisoOperativo.verTodosCliente)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar al menos una Unidad de negocio del cliente.";
        }
        
        var telefono = false;
        
        if($scope.nuevaCita.Persona.Contacto !== undefined)
        {
            for(var k=0; k<$scope.nuevaCita.Persona.Contacto.length; k++)
            {
                if($scope.nuevaCita.Persona.Contacto[k].MedioContacto.MedioContactoId == "2")
                {
                    telefono = true;
                    break;
                }
            }
        }
        
        if(!telefono)
        {
            for(var k=0; k<$scope.nuevaCita.Persona.NuevoContacto.length; k++)
            {
                if($scope.nuevaCita.Persona.NuevoContacto[k].MedioContacto.MedioContactoId == "2")
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
        
        
        for(var k=0; k<$scope.nuevaCita.Persona.NuevoContacto.length; k++)
        {
            var repetido = false;
            for(var i=0; i<$scope.nuevaCita.Persona.NuevoContacto.length; i++)
            {
                if(i<k && $scope.nuevaCita.Persona.NuevoContacto[k].Contacto == $scope.nuevaCita.Persona.NuevoContacto[i].Contacto)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*" + $scope.nuevaCita.Persona.NuevoContacto[k].Contacto + " se repite.";
                    repetido = true;
                    break;
                }
            }
            
            if($scope.nuevaCita.Persona.Contacto !== undefined && !repetido)
            {
                for(var i=0; i<$scope.nuevaCita.Persona.Contacto.length; i++)
                {
                    if($scope.nuevaCita.Persona.NuevoContacto[k].Contacto == $scope.nuevaCita.Persona.Contacto[i].Contacto)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*" + $scope.nuevaCita.Persona.NuevoContacto[k].Contacto + " se repite.";
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
    
    $scope.GoToPeople = function()
    {
        if($scope.nuevaCita.Persona.Nombre.length > 0 && $scope.nuevaCita.Persona.PrimerApellido.length > 0)
        {
            $scope.GetBuscarPersona();
        }
    };
    
    $scope.CambiarMedioCaptacion = function(medio)
    {
        if(medio == 'otro')
        {
            $scope.nuevaCita.Persona.MedioCaptacion.MedioCaptacionId = "0";
            $scope.nuevaCita.Persona.MedioCaptacion.Nombre = "Otro";
            
        }
        else
        {
            $scope.nuevaCita.Persona.MedioCaptacion = medio;
        }
    };
    
    $scope.SeleccionarPersona = function(persona)
    {
        for(var k=0; k<$scope.persona.length ;k++)
        {
            if($scope.persona[k].PersonaId != persona.PersonaId)
            {
                $scope.persona[k].Seleccionado = false;
            }
        }
        
        if(persona.Seleccionado)
        {
            $scope.nuevaCita.Persona = $scope.SetPersona(persona);
            $scope.GetMedioContactoPersona(persona.PersonaId);
            $scope.GetDireccionPersona(persona.PersonaId);
            $scope.GetUnidadNegocioPersona(persona.PersonaId);
            
            $scope.personaSeleccionada = true;
            
            $scope.mensajeError = [];
            $scope.claseCita = {
                                    paso1:{nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"},
                                    paso2:{tarea:"dropdownlistModal", asunto:"entrada", fecha:"entrada", horaInicio:"entrada", horaFin:"entrada", descripcion:"descripcionArea", responsable:"dropdownlistModal"},
                                };
        }
        else
        {
            $scope.nuevaCita.Persona = new Persona();
            $scope.nuevaCita.Persona.NuevoContacto = [];
            $scope.nuevaCita.Persona.NuevoDomicilio = [];
            $scope.nuevaCita.Persona.UnidadNegocio = [];
            
            $scope.personaSeleccionada = false;
            
            for(var k=0; k<$scope.unidadNegocio.length; k++)
            {
                $scope.unidadNegocio[k].show = true;
            }
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
        persona.NuevoContacto = $scope.nuevaCita.Persona.NuevoContacto;
        persona.NuevoDomicilio = $scope.nuevaCita.Persona.NuevoDomicilio;
        persona.UnidadNegocio = $scope.nuevaCita.Persona.UnidadNegocio;
        
        return persona;
    };
    
    $scope.AgregarUnidadNegocio = function(unidad)
    {
        $scope.nuevaCita.Persona.UnidadNegocio.push(unidad);
        
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
        for(var k=0; k<$scope.nuevaCita.Persona.UnidadNegocio.length; k++)
        {
            if(unidad.UnidadNegocioId == $scope.nuevaCita.Persona.UnidadNegocio[k].UnidadNegocioId)
            {
                $scope.nuevaCita.Persona.UnidadNegocio.splice(k,1);
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
        else if(contenido == "direccion")
        {
            $scope.mostrarContenido.direccion = !$scope.mostrarContenido.direccion;
        }
        else if(contenido == "unidad")
        {
            $scope.mostrarContenido.unidad = !$scope.mostrarContenido.unidad;
        }
    };
    
    $scope.AgregarMedioContacto = function()
    {
        MEDIOCONTACTO.AgregarMedioContacto("Cita");
    };
    
    $scope.$on('MedioContactoAgregado',function()
    {
        $scope.nuevaCita.Persona.NuevoContacto.push(MEDIOCONTACTO.GetMedioContacto());
    });
    
    $scope.EditarContactoAgregado = function(contacto, tipo)
    {
        $scope.tipoEditar = tipo;
        if(tipo == "Nuevo")
        {
            $scope.nuevoContacto = contacto;
            MEDIOCONTACTO.EditarMedioContacto(contacto, "Cita");
        }
        else if(tipo == "Registrado")
        {
            $scope.nuevoContacto = contacto;
            MEDIOCONTACTO.EditarMedioContactoRegistrado(contacto, "Cita");
        }
        
    };
    
    $scope.$on('MedioContactoEditado',function()
    {
        if($scope.tipoEditar == "Nuevo")
        {
            for(var k=0; k<$scope.nuevaCita.Persona.NuevoContacto.length; k++)
            {
                if($scope.nuevaCita.Persona.NuevoContacto[k] == $scope.nuevoContacto)
                {
                    $scope.nuevaCita.Persona.NuevoContacto[k] = MEDIOCONTACTO.GetMedioContacto();
                }
            }
        }
        else if($scope.tipoEditar == "Registrado")
        {
            $scope.GetMedioContactoPersona($scope.nuevaCita.Persona.PersonaId);
        }
    });
    
    $scope.BorrarContactoAgregado = function(contacto)
    {
        for(var k=0; k<$scope.nuevaCita.Persona.NuevoContacto.length; k++)
        {
            if(contacto == $scope.nuevaCita.Persona.NuevoContacto[k])
            {
                $scope.nuevaCita.Persona.NuevoContacto.splice(k,1);
                break;
            }
        }
        
    };
    
    $scope.MostrarMedioContacto = function(id)
    {
        return parseInt(id) > 0;
    };
    
    /*------------------------ Paso 2 ---------------------*/
    $scope.AnteriorCita = function()
    {
        $scope.mensajeError = [];
        $scope.claseCita = {
                            paso1:{nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"},
                            paso2:{tarea:"dropdownlistModal", asunto:"entrada", fecha:"entrada", horaInicio:"entrada", horaFin:"entrada", descripcion:"descripcionArea", responsable:"dropdownlistModal"},
                        };
        
        $scope.pasoCita--;
    };
    
    $scope.CambiarTarea = function(tarea)
    {
        $scope.nuevaCita.Tarea = tarea;
    };
    
    $scope.CambiarMostrarResponsable = function()
    {
        $scope.mostrarResponsable = !$scope.mostrarResponsable;
    };
    
    $scope.CambiarTipoResponsable = function(tipo)
    {
        $scope.tipoResponsable = tipo;
    };
    
    $scope.GetClaseTipoResponsable = function(tipo)
    {
        if(tipo == $scope.tipoResponsable)
        {
            return "botonTabActive";        
        }
        else
        {
            return "botonTab";        
        }
    };
    
    $scope.SetReponsable = function(responsable, tipo)
    {
        if(tipo == "Colaborador")
        {
            $scope.nuevaCita.Responsable.Nombre = responsable.Nombre;
            $scope.nuevaCita.Responsable.ResponsableId = responsable.ColaboradorId;
            
            $scope.nuevaCita.Responsable.Colaborador = true;
            $scope.nuevaCita.Responsable.UnidadNegocio = false;
        }
        if(tipo == "UnidadNegocio")
        {
            $scope.nuevaCita.Responsable.Nombre = responsable.NombreTipoUnidadNegocio + " - " +responsable.Nombre;
            $scope.nuevaCita.Responsable.ResponsableId = responsable.UnidadNegocioId;
            
            $scope.nuevaCita.Responsable.Colaborador = false;
            $scope.nuevaCita.Responsable.UnidadNegocio = true;
        }
    };
    
    $('#fechaCita').bootstrapMaterialDatePicker(
    { 
        weekStart : 0, 
        time: false,
        format: "DD/MM/YYYY",
        minDate : new Date(),
        disabledDays: [7]
    });
    
    $('#horaInicio').datetimepicker(
    {
        locale: 'es',
        format: 'HH:mm',
        showClear: true,
        showClose: true,
        toolbarPlacement: 'bottom'
    });
    
    $('#horaFin').datetimepicker(
    {
        locale: 'es',
        format: 'HH:mm',
        showClear: true,
        showClose: true,
        toolbarPlacement: 'bottom'
    });
    
    /*.on('blur', function(e, date)
    {
        $('#horaFin').minDate = $('#horaFin').date;
    });*/
    
    /*$('#horaInicio').bootstrapMaterialDatePicker(
    { 
        weekStart : 0, 
        date: false,
        format: "HH:mm",
        //shortTime: true,
        //minDate : new Date(),
    });*/
    
    /*$('#horaFin').bootstrapMaterialDatePicker(
    { 
        weekStart : 0, 
        date: false,
        format: "HH:mm",
        //shortTime: true,
        //minDate : new Date()
    });*/

    $scope.CambiarFecha = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.nuevaCita.Fecha = element.value;
        });
    };
    
    $scope.CambiarHoraInicio = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.nuevaCita.HoraInicio = element.value;
        });
    };
    
    $scope.CambiarHoraFin = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.nuevaCita.HoraFin = element.value;
        });
    };
    
    $scope.AgregarDomicilio = function()
    {
        DOMICILIO.AgregarDomicilio("Cita");
    };
    
    $scope.$on('DomicilioAgregado',function()
    {
        var domicilio = DOMICILIO.GetDomicilio();
        domicilio.Seleccionado = false;
        $scope.nuevaCita.Persona.NuevoDomicilio.push(domicilio);
    });
    
    $scope.BorrarDomicilioAgregado = function(domicilio)
    {
        for(var k=0; k<$scope.nuevaCita.Persona.NuevoDomicilio.length; k++)
        {
            if($scope.nuevaCita.Persona.NuevoDomicilio[k] == domicilio)
            {
                $scope.nuevaCita.Persona.NuevoDomicilio.splice(k,1);
                break;
            }
        }
    };
    
    $scope.EditarDomicilioAgregado = function(domicilio, tipo)
    {
        $scope.operacionDomicilio = tipo;
        $scope.operacionDomicilioEditar = domicilio;
        
        if(tipo == "Nuevo")
        {
            DOMICILIO.EditarDomicilioNuevo(domicilio, "Cita");
        }
        
        if(tipo == "Registrado")
        {
            DOMICILIO.EditarDomicilioRegistrado(domicilio, "Cita");
        }
    };
    
    $scope.$on('DomicilioEditado',function()
    {
        if( $scope.operacionDomicilio == "Nuevo")
        {
            for(var k=0; k<$scope.nuevaCita.Persona.NuevoDomicilio.length; k++)
            {
                if($scope.operacionDomicilioEditar == $scope.nuevaCita.Persona.NuevoDomicilio[k])
                {
                    $scope.nuevaCita.Persona.NuevoDomicilio[k] = DOMICILIO.GetDomicilio();
                }
            }
        }
        else if($scope.operacionDomicilio == "Registrado")
        {
            $scope.GetDireccionPersona($scope.nuevaCita.Persona.PersonaId);
        }
        
    });
    
    $scope.SeleccionarDomicilio = function(domicilio)
    {
        for(var k=0; k<$scope.nuevaCita.Persona.NuevoDomicilio.length; k++)
        {
            if($scope.nuevaCita.Persona.NuevoDomicilio[k] != domicilio)
            {
                $scope.nuevaCita.Persona.NuevoDomicilio[k].Seleccionado = false; 
            }
        }
        
        if($scope.nuevaCita.Persona.Domicilio != undefined)
        {
            for(var k=0; k<$scope.nuevaCita.Persona.Domicilio.length; k++)
            {
                if($scope.nuevaCita.Persona.Domicilio[k] != domicilio)
                {
                    $scope.nuevaCita.Persona.Domicilio[k].Seleccionado = false; 
                }
                else
                {
                    $scope.nuevaCita.DireccionCitaId =  domicilio.DireccionPersonaId;
                }
            }
        }
        
        if(domicilio.Seleccionado)
        {
            $scope.nuevaCita.Domicilio = domicilio;
        }
        else
        {
            $scope.nuevaCita.Domicilio = new Domicilio();
        }
    };
    
    
    $scope.DetalleDomicilio = function(domicilio)
    {
        DOMICILIO.VerDomicilio(domicilio);
    };
    //------------------ Terminar ---------------------
    
    $scope.TerminarDatoCita = function(asuntoInvalido, descripcionInvalida)
    {
        if(!$scope.ValidarDatosCita(asuntoInvalido, descripcionInvalida))
        {
            return;
        }
        else
        {
            if(!$scope.personaSeleccionada)
            {
                $scope.nuevaCita.Persona.PersonaId = "0";
            }
            
            if(!$rootScope.permisoOperativo.verTodosCliente)
            {
                var unidad = false;
                for(var k=0; k<$scope.nuevaCita.Persona.UnidadNegocio.length; k++)
                {
                    if($scope.usuario.UnidadNegocioId == $scope.nuevaCita.Persona.UnidadNegocio[k].UnidadNegocioId)
                    {
                        unidad = true;
                        break;
                    }
                }
                
                if(!unidad)
                {
                    var unidadNegocio = new Object();
                    unidadNegocio.UnidadNegocioId = $scope.usuario.UnidadNegocioId;
                    $scope.nuevaCita.Persona.UnidadNegocio.push(unidadNegocio);
                }
            }
            
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarCita();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarCita();
            }
        }
    };
    
    $scope.AgregarCita = function()    
    {
        var nuevo = ($scope.nuevaCita.Persona.PersonaId == "0");
        AgregarCita($http, CONFIG, $q, $scope.nuevaCita).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#agregarCitaModal').modal('toggle');
                $scope.mensaje = "La cita se ha agregado.";
                $scope.CerrarCitaModal();
                
                
                if(nuevo)
                {
                    $location.path('/PerfilCliente/' + data[1].Cita.Persona.PersonaId + '/Citas');
                    return;
                }
                else
                {
                    CITA.CitaAgregada(data[1].Cita);
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeCita').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeCita').modal('toggle');
        });
    };
    
    $scope.EditarCita = function()    
    {
        EditarCita($http, CONFIG, $q, $scope.nuevaCita).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#agregarCitaModal').modal('toggle');
                $scope.mensaje = "La cita se ha agregado.";
                $scope.CerrarCitaModal();
                
                CITA.CitaEditada($scope.nuevaCita);
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeCita').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeCita').modal('toggle');
        });
    };
    
    $scope.ValidarDatosCita = function(asuntoInvalido, descripcionInvalida)
    {
        $scope.mensajeError = [];
        
        if($scope.nuevaCita.Tarea.TareaCitaId.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una tarea.";
            $scope.claseCita.paso2.tarea = "dropdownlistModalError";
        }
        else
        {
            $scope.claseCita.paso2.tarea = "dropdownlistModal";
        }
        
        if(asuntoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un asunto válido.";
            $scope.claseCita.paso2.asunto = "entradaError";
        }
        else
        {
            $scope.claseCita.paso2.asunto = "entrada";
        }
        
        if($scope.nuevaCita.Responsable.ResponsableId.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un responsable.";
            $scope.claseCita.paso2.responsable = "dropdownlistModalError";
        }
        else
        {
            $scope.claseCita.paso2.responsable = "dropdownlistModal";
        }
        
        if($scope.nuevaCita.Fecha.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una fecha.";
            $scope.claseCita.paso2.fecha = "entradaError";
        }
        else
        {
            $scope.claseCita.paso2.fecha = "entrada";
        }
        
        if($scope.nuevaCita.HoraInicio.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una hora de incio.";
            $scope.claseCita.paso2.horaInicio = "entradaError";
        }
        else
        {
            $scope.claseCita.paso2.horaInicio = "entrada";
        }
        
        if($scope.nuevaCita.HoraFin.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una hora de fin.";
            $scope.claseCita.paso2.horaFin = "entradaError";
        }
        else
        {
            $scope.claseCita.paso2.horaFin = "entrada";
        }
        
        if($scope.nuevaCita.HoraInicio.length > 0 && $scope.nuevaCita.HoraFin.length)
        {
            if($scope.nuevaCita.HoraFin < $scope.nuevaCita.HoraInicio)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*La hora de fin debe ser mayor a la hora de inicio.";
            }
        }
        
        if(descripcionInvalida)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe una descripción";
            $scope.claseCita.paso2.descripcion = "descripcionAreaError";
        }
        else
        {
            $scope.claseCita.paso2.descripcion = "descripcionArea";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        if($scope.nuevaCita.Tarea.TareaCitaId == "1")
        {
            var numDom = 0;
            if($scope.nuevaCita.Persona.Domicilio !== undefined)
            {
                numDom = $scope.nuevaCita.Persona.Domicilio.length + $scope.nuevaCita.Persona.NuevoDomicilio.length;
            }
            else
            {
                numDom = $scope.nuevaCita.Persona.NuevoDomicilio.length;
            }
            
            if(numDom > 0)
            {
                var seleccionado = false;
                for(var k=0; k<$scope.nuevaCita.Persona.NuevoDomicilio.length; k++)
                {
                    if($scope.nuevaCita.Persona.NuevoDomicilio[k].Seleccionado)
                    {
                        seleccionado = true;
                        break;
                    }
                }
                
                if($scope.nuevaCita.Persona.Domicilio !== undefined && !seleccionado)
                {
                    for(var k=0; k<$scope.nuevaCita.Persona.Domicilio.length; k++)
                    {
                        if($scope.nuevaCita.Persona.Domicilio[k].Seleccionado)
                        {
                            seleccionado = true;
                            break;
                        }
                    }
                }
                
                if(!seleccionado)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar la dirección de la cita.";
                }
            }
            else
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Debes de indicar mínimo una dirección.";
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
    /*--------------- ---------------------------------*/
    $scope.CerrarCitaModal = function()
    {
        $scope.mensajeError = [];
        
        $scope.claseCita = {
                                paso1:{nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"},
                                paso2:{tarea:"dropdownlistModal", asunto:"entrada", fecha:"entrada", horaInicio:"entrada", horaFin:"entrada", descripcion:"descripcionArea", responsable:"dropdownlistModal"},
                            };
        
        document.getElementById("fechaCita").value="";
        $('#horaInicio').data("DateTimePicker").clear();
        $('#horaFin').data("DateTimePicker").clear();
    };
    
});

app.factory('CITA',function($rootScope)
{
  var service = {};
  service.cita = null;
  service.persona = null;
    
  service.AgregarCitaCero = function()
  {
      this.cita = null;
      $rootScope.$broadcast('AgregarCitaCero');
  };
    
  service.AgregarCitaPre = function(persona)
  {
      this.persona = persona;
      $rootScope.$broadcast('AgregarCitaPre');
  };
    
  service.CitaAgregada = function(cita)
  {
      this.cita = cita;
      $rootScope.$broadcast('CitaAgregada');
  };
    
  service.CitaEditada = function(cita)
  {
      this.cita = cita;
      $rootScope.$broadcast('CitaEditada');
  };
    
  service.GetPersona = function()
  {
      return this.persona;
  };
    
  service.GetCita = function()
  {
      return this.cita;
  };
    
  service.EditarCita = function(cita)
  {
      this.cita = cita;
      $rootScope.$broadcast('EditarCita');
  };
    
  return service;
});