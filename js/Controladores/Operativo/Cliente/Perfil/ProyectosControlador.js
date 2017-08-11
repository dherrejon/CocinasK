app.controller("ProyectoClienteControlador", function($scope, $rootScope, CITA, $http, $q, CONFIG, PRESUPUESTO, DOMICILIO)
{  
    $scope.proyecto = [];
    $scope.estatus = [];
    $scope.proyectoDetalle = "";
    $scope.promocionPersona = {promocionMueble: [], promocionCubierta: []};
    $scope.verDireccion = false;
    
    $scope.verDetalle = {desCliente: false, desInterna: false, combinacion: false, modulo: false, puerta: false, servicio: false, maqueo: false, accesorio: false, cubiertaAglomerado: false, cubiertaPiedra: false, promocion: false};
    $scope.verTipoCubierta = {aglomerado: false, piedra: false};
    
    $scope.GetPromocionPersona = function(id)              
    {
        GetPromocionPersona($http, $q, CONFIG, id).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.promocionPersona = data[1].Promocion;
            }
            else
            {
               $scope.promocionPersona = {promocionMueble: [], promocionCubierta: []}; 
            }
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetProyectoPersona = function(id)              
    {
        GetProyectoPersona($http, $q, CONFIG, id).then(function(data)
        {
            $scope.proyecto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPresupuestoPorProyecto = function(proyecto)              
    {
        GetPresupuestoPorProyecto($http, $q, CONFIG, proyecto.ProyectoId).then(function(data)
        {
            proyecto.Presupuesto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDatosPresupuesto = function(presupuesto, opt)              
    {
        GetDatosPresupuesto($http, $q, CONFIG, presupuesto).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                 $scope.OperacionPresupuesto(opt, data);
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
                $('#mensajePerfil').modal('toggle');
            }
            //proyecto.Presupuesto = data;
        
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    $scope.GetEstatusProyecto = function()
    {
        $scope.estatus = GetEstatusProyecto();
    };
    
    $scope.GetDireccionPersona = function(id)              
    {
        GetDireccionPersona($http, $q, CONFIG, id).then(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                data[k].Seleccionado = false;
                if(data[k].DireccionPersonaId == $scope.nuevoProyecto.Domicilio.DireccionPersonaId)
                {
                    data[k].Seleccionado = true;
                }
            }
            
            $scope.domicilioPersona = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //--------------- Funcionalidades Generales ---------
    $scope.OperacionPresupuesto = function(opt, data)
    {   
        if(opt == "Detalle")
        {
            $scope.detalle = data[1].Presupuesto;
            $scope.VerTipoCubierta(data[1].Presupuesto);
        }
        else if(opt == "Editar")
        {
            PRESUPUESTO.EditarPresupuesto(data[1].Presupuesto);
        }
        else if(opt == "Clonar")
        {
            PRESUPUESTO.ClonarPresupuesto(data[1].Presupuesto);
        }
    };

    $scope.SetDatosPresupuesto = function(presupuesto, proyecto)
    {
        presupuesto.Proyecto = $scope.SetProyecto(proyecto);
        presupuesto.Persona = $rootScope.persona;
        presupuesto.PromocionMueble = $scope.promocionPersona.PromocionMueble;
        presupuesto.PromocionCubierta = $scope.promocionPersona.PromocionCubierta;
    };
    
    //----------- vista ----------------------------
    $scope.MostrarEstatus = function(actualId, cambiarId)
    {
        if(actualId == cambiarId)
        {
            return false;
        }
        
        if(actualId == "1")
        {
            return true;
        }
        else if(actualId == "2")
        {
            if(cambiarId != "1")
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else if(actualId == "3")
        {
            if(cambiarId == "2")
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else if(actualId == "4")
        {
            if(cambiarId != "1")
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    };
    
    $scope.CambiarProyectoDetalle = function(proyecto)
    {
        if($scope.proyectoDetalle == proyecto.ProyectoId)
        {
            $scope.proyectoDetalle = "";
        }
        else
        {
            $scope.proyectoDetalle = proyecto.ProyectoId;
            $scope.GetPresupuestoPorProyecto(proyecto);
        }

    };
    
    $scope.VerTipoCubierta = function(data)
    {
        $scope.verTipoCubierta = {aglomerado: false, piedra: false};
        for(var k=0; k<data.TipoCubierta.length; k++)
        {
            if(data.TipoCubierta[k].TipoCubiertaId == "1")
            {
                $scope.verTipoCubierta.aglomerado = true;
                
                $scope.SetUbicacionMaterialCubierta(data.TipoCubierta[k]);
            }
            else if(data.TipoCubierta[k].TipoCubiertaId == "2")
            {
                $scope.verTipoCubierta.piedra = true;
            }
        }
    };
    
    $scope.SetUbicacionMaterialCubierta = function(data)
    {
        for(var i=0; i<data.Material.length; i++)
        {
            for(var k=0; k<data.Ubicacion.length; k++)
            {
                var ubicado = false;
                for(var j=0; j<data.Material[i].Ubicacion.length; j++)
                {
                    if(data.Material[i].Ubicacion[j].UbicacionCubiertaId == data.Ubicacion[k].UbicacionCubiertaId)
                    {
                        ubicado = true;
                        break;
                    }
                }
                
                if(!ubicado)
                {
                    var ubicacion = new Object();
                    ubicacion.UbicacionCubiertaId = data.Ubicacion[k].UbicacionCubiertaId;
                    ubicacion.PrecioVenta = "No Disponible";
                    
                    data.Material[i].Ubicacion.push(ubicacion);
                }
            }
        }
    
    };
    
    //--------------------------------------------- Operaciones presupuesto ----------------------------------------------------
    //--------------- Detalles ---------------------------
    $scope.VerDetallePresupuesto = function(presupuesto, proyecto)
    {
        $scope.verDetalle = {desCliente: false, desInterna: false, combinacion: false, modulo: false, puerta: false, servicio: false, maqueo: false, accesorio: false, cubiertaAglomerado: false, cubiertaPiedra: false, promocion: false};
        $scope.SetDatosPresupuesto(presupuesto, proyecto);
        
        $scope.GetDatosPresupuesto(presupuesto, "Detalle");
        
        $('#presupuestoDetalleModal').modal('toggle');
    };
    
    $scope.SetProyecto = function(data)
    {
        var proyecto = new Proyecto();
    
        proyecto.ProyectoId = data.ProyectoId;
        proyecto.Nombre = data.Nombre;
        proyecto.TipoProyecto.TipoProyectoId = data.TipoProyecto.TipoProyectoId;
        proyecto.TipoProyecto.Nombre = data.TipoProyecto.Nombre;
        
        proyecto.Domicilio = jQuery.extend({}, data.Domicilio);
        
        return proyecto;
    };
    
    //--------------------- Cambiar Estatus --------------------
    $scope.CambiarEstatus = function(proyecto, estatus)
    {
        $scope.ProyetoActualizar = proyecto;
        $scope.estatusActualizar = estatus;
        
        $scope.mensajeAdvertencia = "¿Estas seguro de cambiar el estatus del proyecto a " + estatus.Nombre + "?";
        
        $("#modalEstatusProyecto").modal('toggle');
    };
    
    $scope.CancelarEstatusProyecto = function()
    {
        $scope.ProyetoActualizar = null;
        $scope.estatusActualizar = null;
    };
    
    $scope.ConfirmarActualizarProyecto = function()
    {        
        var datos = new Object();
        datos.ProyectoId = $scope.ProyetoActualizar.ProyectoId;
        datos.EstatusProyectoId = $scope.estatusActualizar.EstatusProyectoId;
        
        
        CambiarEstatusProyecto($http, $q, CONFIG, datos).then(function(data)
        {
            if(data == "Exitoso")
            {
                $rootScope.mensaje = "El estatus del proyecto se ha actualizado correctamente.";
                 
                $scope.ProyetoActualizar.EstatusProyecto = $scope.estatusActualizar;
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
    
    //----------------------------------Editar Presupuesto-------------------------------
    $scope.EditarPresupuesto = function(presupuesto, proyecto)
    {
        $scope.SetDatosPresupuesto(presupuesto, proyecto);
        $scope.presupuestoEditar = presupuesto;
        
        $scope.GetDatosPresupuesto(presupuesto, "Editar");
    };
    
    $scope.$on('PresupuestoEditado',function()
    {
        var pre = PRESUPUESTO.GetPresupuesto();
        
        
        $scope.presupuestoEditar.DescripcionInterna = pre.DescripcionInterna;
        $scope.presupuestoEditar.DescripcionCliente = pre.DescripcionCliente;
        $scope.presupuestoEditar.CantidadMaqueo = parseFloat(pre.CantidadMaqueo);
        $scope.presupuestoEditar.FechaCreacion = TransformarFecha(pre.FechaCreacion);
        $scope.presupuestoEditar.Titulo = pre.Titulo;
        $scope.presupuestoEditar.UsuarioId = pre.UsuarioId; 
        $scope.presupuestoEditar = null;
        
        $scope.GetPromocionPersona($rootScope.personaId);
    });
    
    //---------------------------------- Agregar Proyecto -------------------------------
    $scope.AgregarProyecto = function()
    {
        PRESUPUESTO.AgregarProyecto($rootScope.persona);
    };
    
    $scope.$on('ProyectoAgregado',function()
    {
        var pro = PRESUPUESTO.GetProyecto();
        
        var proyecto = $scope.SetProyecto(pro);
        proyecto.EstatusProyecto.EstatusProyectoId = "1";
        proyecto.EstatusProyecto.Nombre = "Activo";
        if(pro.Domicilio.DomicilioId === null)
        {
            proyecto.Domicilio = null;
        }
        
        $scope.proyecto.push(proyecto);
        
        $scope.GetPromocionPersona($rootScope.personaId);
    });
    
    //---------------------------------- Agregar Presupuesto -------------------------------
    $scope.AgregarPresupuesto = function(proyecto)
    {
        PRESUPUESTO.AgregarPresupuestoProyecto($rootScope.persona, proyecto);
        $scope.proyectoAgregar = proyecto;
    };
    
    $scope.$on('PresupuestoProyectoAgregado',function()
    {
        var pre = PRESUPUESTO.GetPresupuesto();
        
        var presupuesto = SetPresupuesto(pre);
        presupuesto.PersonaId = pre.Persona.PersonaId;
        presupuesto.ProyectoId = pre.Proyecto.ProyectoId;
        
        $scope.proyectoAgregar.Presupuesto.push(presupuesto);
        
        
        $scope.GetPromocionPersona($rootScope.personaId);
    });
    
    //---------------------------------- Clonar Presupuesto -------------------------------
    $scope.ClonarPresupuesto = function(presupuesto, proyecto)
    {
        $scope.SetDatosPresupuesto(presupuesto, proyecto);
        $scope.presupuestoEditar = presupuesto;
        $scope.proyectoAgregar = proyecto;
        
        $scope.GetDatosPresupuesto(presupuesto, "Clonar");
    };
    
    $scope.$on('PresupuestoClonado',function()
    {
        var pre = PRESUPUESTO.GetPresupuesto();
        
        if(pre.Persona.PersonaId == $rootScope.personaId)
        {
            if(pre.Proyecto.ProyectoId == $scope.proyectoAgregar.ProyectoId)
            {
                 //presupuesto al proyecto
                 var presupuesto = SetPresupuesto(pre);
                presupuesto.PersonaId = pre.Persona.PersonaId;
                presupuesto.ProyectoId = pre.Proyecto.ProyectoId;

                $scope.proyectoAgregar.Presupuesto.push(presupuesto);
                
            }
            else
            {
                //agregar proyecto a la persona
                var proyectoNuevo = true;
                
                for(var k=0; k<$scope.proyecto.length; k++)
                {
                    if($scope.proyecto[k].ProyectoId == pre.Proyecto.ProyectoId)
                    {
                        proyectoNuevo = false;
                        break;
                    }
                }
                
                if(proyectoNuevo)
                {
                    var pro = pre.Proyecto;

                    var proyecto = $scope.SetProyecto(pro);
                    proyecto.EstatusProyecto.EstatusProyectoId = "1";
                    proyecto.EstatusProyecto.Nombre = "Activo";
                    if(pro.Domicilio.DomicilioId === null)
                    {
                        proyecto.Domicilio = null;
                    }
                    $scope.proyecto.push(proyecto);
                }
            }
        }
        
        $scope.GetPromocionPersona($rootScope.personaId);
    });
    
    
    //-------------------------- Editar Proyecto ----------------------
    $scope.EditarProyectoModal = function(proyecto)
    {
        $scope.ProyetoActualizar = proyecto;
        $scope.nuevoProyecto = $scope.SetProyecto(proyecto);
        $scope.GetDireccionPersona($rootScope.personaId);
        
        $('#editarProyectoModal').modal('toggle');
    };
    
    $scope.DetalleDomicilio = function(domicilio)
    {
        DOMICILIO.VerDomicilio(domicilio);
    };
    
    $scope.CambiarDomicilio = function(domicilio)
    {
        if(!domicilio.Seleccionado)
        {
            $scope.nuevoProyecto.Domicilio.DireccionPersonaId = null;
        }
        else
        {
            $scope.nuevoProyecto.Domicilio = domicilio;
            for(var k=0; k<$scope.domicilioPersona.length; k++)
            {
                if($scope.domicilioPersona[k].DireccionPersonaId != domicilio.DireccionPersonaId)
                {
                    $scope.domicilioPersona[k].Seleccionado = false;
                }
            }
        }
    };
    
    $scope.TerminarProyecto = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[0] = "*Escribe un nombre válido del proyecto.";
            return;
        }
        else
        {
            $scope.EditarProyecto();
        }
    };
    
    $scope.EditarProyecto = function()
    {                
        EditarProyecto($http, $q, CONFIG, $scope.nuevoProyecto).then(function(data)
        {
            if(data == "Exitoso")
            {
                $rootScope.mensaje = "El proyecto se ha actualizado correctamente.";
            
                $scope.ProyetoActualizar.Nombre = $scope.nuevoProyecto.Nombre;
                
                
                if($scope.nuevoProyecto.Domicilio.DireccionPersonaId === null)
                {
                    $scope.ProyetoActualizar.Domicilio = null;
                }
                else
                {
                    $scope.ProyetoActualizar.Domicilio = jQuery.extend({}, $scope.nuevoProyecto.Domicilio);
                }
               
                $('#editarProyectoModal').modal('toggle');
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
    
    $scope.CerrarProyecto = function()
    {
        $scope.mensajeError = [];
    };
    
    
    //Inicializar
    $scope.GetPromocionPersona($rootScope.personaId);
    $scope.GetProyectoPersona($rootScope.personaId);
    $scope.GetEstatusProyecto();
});
