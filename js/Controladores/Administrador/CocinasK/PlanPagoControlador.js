app.controller("PlanPagoControlador", function($scope, $http, $q, CONFIG, $rootScope, $window, datosUsuario, $location)
{   
    $rootScope.clasePrincipal = "";
    $scope.permisoUsuario = {consultar:false, agregar:false, editar:false, activar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmPlNConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmPlNAgregar")
            {
                $scope.permisoUsuario.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmPlNEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmPlNActivar")
            {
                $scope.permisoUsuario.activar= true;
            }
        }
    };
    
    $scope.planPago = "";
    $scope.planPagoActualizar = null;
    $scope.nuevoPlanPago = null;
    
    $scope.mensajeError = [];
    $scope.buscar = "";
    $scope.ordenarPor = "Nombre";
    $scope.detalle = "";
    
    $scope.clase = {nombre:"entrada", fecha:"entrada", pagos:"entrada"};
    
    $scope.mostrarFiltro = {activo: true};
    $scope.filtro = {
                        activo:{activo:false, inactivo: false}
                    };
    
    $scope.GetPlanPago = function()
    {
        GetPlanPago($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.planPago = data;
                for(var k=0; k<data.length; k++)
                {
                    $scope.GetPlanPagoAbono( $scope.planPago[k]);
                }
            }
            else
            {
                $scope.promocion = [];
            }
        }).catch(function(error)
        {
            $scope.promocion = [];
            alert(error);
        });
    };
    
    $scope.GetPlanPagoAbono = function(dato)
    {
        GetPlanPagoAbono($http, $q, CONFIG, dato.PlanPagoId).then(function(data)
        {   
            dato.Abono = data;
        }).catch(function(error)
        {
            dato.Abono = [];
            alert(error);
        });
    };
    
    /*------------------Ordenar--------------------------*/
    //ordena por el campo seleccionado
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenarPor == campoOrdenar)
        {
            $scope.ordenarPor = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPor = campoOrdenar;
        }
    };
    
    /*------------- filtrar ---------------------*/
    $scope.FiltrarPlanPago = function(plan)
    {
        if($scope.filtro.activo.activo != $scope.filtro.activo.inactivo)
        {
            if($scope.filtro.activo.activo)
            {
                if(!plan.Activo)
                {
                    return false;
                }
            }
            if($scope.filtro.activo.inactivo)
            {
                if(plan.Activo)
                {
                    return false;
                }
            }   
        }
        
        return true;
    };
    
    $scope.MostrarFiltros = function(campo)
    {
        if(campo == "activo")
        {
            $scope.mostrarFiltro.activo = !$scope.mostrarFiltro.activo;
        }
    };
    
    $scope.LimpiarFiltro = function()
    {
        $scope.mostrarFiltro = {activo: true};
        $scope.filtro = {
                            activo:{activo:false, inactivo: false}
                        };
    };
    
    /*--------------- Detalles --------------------*/
    $scope.DetallePlanPago = function(plan)
    {
        $scope.planPagoActualizar = plan;
    };
    
    $scope.MostrarDetalle = function(detalle)
    {
        if($scope.detalle == detalle)
        {
            $scope.detalle = "";
        }
        else
        {
            $scope.detalle = detalle;   
        }
    };
    
    $scope.GetClaseDetallesSeccion = function(seccion)
    {
        if($scope.detalle == seccion)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    /*------------ Abrir agregar - editar modulo ----------------------------*/
    $scope.AbrirModuloPlanPago = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoPlanPago = new PlanPago();
            $scope.nuevoPlanPago.Abono = [];
            $scope.nuevoPlanPago.Anticipo = {NumeroAbono:0, Abono:0, Dias:0};
            $scope.nuevoPlanPago.claseAnticipo = {abono:"entrada", dias:"entrada"};
        }
        else if($scope.operacion == "Editar")
        {
            $scope.nuevoPlanPago = $scope.SetPlanPagos(objeto);
        }
        
        $('#planPagoModal').modal('toggle');
    };
    
    $scope.AumentarPagos = function()
    {
        var nuevoAbono = {NumeroAbono:0, Abono:0, Dias: 0};
        nuevoAbono.NumeroAbono = $scope.nuevoPlanPago.Pagos;
        nuevoAbono.clase = {abono:"entrada", dias:"entrada"};
        $scope.nuevoPlanPago.Pagos ++;
        
        $scope.nuevoPlanPago.Abono.push(nuevoAbono);
    };
    
    $scope.ReducirPagos = function()
    {
        if(($scope.nuevoPlanPago.Pagos-1) > 0)
        {
            $scope.nuevoPlanPago.Abono.splice($scope.nuevoPlanPago.Abono.length-1, 1);
            $scope.nuevoPlanPago.Pagos --;            
        }
    };
    
    $scope.SetPlanPagos = function(data)
    {
        var plan = new PlanPago();
        
        plan.PlanPagoId = data.PlanPagoId;
        plan.Nombre = data.Nombre;
        plan.Pagos = data.Pagos;
        plan.FechaEntrega = data.FechaEntrega;
        plan.Activo = data.Activo;
        
        plan.Abono = [];
        for(var k=0; k<data.Abono.length; k++)
        {
            //console.log(data.Abono[k]);
            if(data.Abono[k].NumeroAbono === 0)
            {
                plan.Anticipo = data.Abono[k];
                plan.claseAnticipo = {abono:"entrada", dias:"entrada"};
            }
            else
            {
                plan.Abono[plan.Abono.length] = data.Abono[k];
                plan.Abono[plan.Abono.length-1].clase = {abono:"entrada", dias:"entrada"};
            }
        }
        return plan;
    };
    
    $scope.CerrarPlanPagoForma = function()
    {
        $scope.mensajeError = [];
        $scope.clase = {nombre:"entrada", fecha:"entrada", pagos:"entrada"};
    };
    
    /*-------------------------Terminar Plan de Pago --------------------*/
    $scope.TerminarPlanPago = function(nombreInvalido, fechaEntregaInvalida)
    {
        if(!$scope.ValidarDatos(nombreInvalido, fechaEntregaInvalida))
        {
            return false;
        }
        else
        {
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarPlanPago();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarPlanPago();
            }
        }
    };
    
    $scope.AgregarPlanPago = function()    
    {
        AgregarPlanPago($http, CONFIG, $q, $scope.nuevoPlanPago).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#planPagoModal').modal('toggle');
                $scope.mensaje = "El plan de pagos se ha agregado.";
                $scope.GetPlanPago();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajePlanPago').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePlanPago').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarPlanPago = function()
    {
        EditarPlanPago($http, CONFIG, $q, $scope.nuevoPlanPago).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#planPagoModal').modal('toggle');
                $scope.mensaje = "El plan de pagos se ha editado.";
                $scope.GetPlanPago();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajePlanPago').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePlanPago').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido, fechaEntregaInvalida)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'."; 
            $scope.clase.nombre = "entradaError";
        }
        else
        {
            $scope.clase.nombre = "entrada";
        }
        
        if(fechaEntregaInvalida)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*La fecha de entrega debe ser un número entero."; 
            $scope.clase.fecha = "entradaError";
        }
        else
        {
            $scope.clase.fecha = "entrada";
        }
        
        var abonoError = false;
        var diasError = false;
        
        if($scope.nuevoPlanPago.Anticipo.Abono === 0 || $scope.nuevoPlanPago.Anticipo.Abono === undefined)
        {
            
            abonoError = true;
            $scope.nuevoPlanPago.claseAnticipo.abono = "entradaError";
        }
        else
        {
            $scope.nuevoPlanPago.claseAnticipo.abono = "entrada";
        }
        
        for(var k=0; k<$scope.nuevoPlanPago.Abono.length; k++)
        {
            if($scope.nuevoPlanPago.Abono[k].Abono === 0 || $scope.nuevoPlanPago.Abono[k].Abono === undefined)
            {
                abonoError = true;
                $scope.nuevoPlanPago.Abono[k].clase.abono = "entradaError";
            }
            else
            {
                $scope.nuevoPlanPago.Abono[k].clase.abono = "entrada";
            }
            
            if($scope.nuevoPlanPago.Abono[k].Dias === 0 || $scope.nuevoPlanPago.Abono[k].Dias === undefined)
            {
                diasError = true;
                $scope.nuevoPlanPago.Abono[k].clase.dias = "entradaError";
            }
            else
            {
                $scope.nuevoPlanPago.Abono[k].clase.dias = "entrada";
            }
        }
        
        if(abonoError)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El abono debe ser mayor a cero y un número con máximo dos decimales.";
        }
        
        if(diasError)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Los días de los abonos deben ser un número entero y mayor a cero.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.planPago.length; k++)
        {
            if($scope.planPago[k].Nombre.toLowerCase() == $scope.nuevoPlanPago.Nombre.toLowerCase() && $scope.planPago[k].PlanPagoId != $scope.nuevoPlanPago.PlanPagoId)
            {
                $scope.clase.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "*El plan de pagos " + $scope.nuevoPlanPago.Nombre.toLowerCase()  + " ya existe.";
                return false;
            }
        }
        
        var abono = 0;
        abono = parseFloat($scope.nuevoPlanPago.Anticipo.Abono);
        
        for(var k=0; k<$scope.nuevoPlanPago.Abono.length; k++)
        {
            abono += parseFloat($scope.nuevoPlanPago.Abono[k].Abono);
        }
        
        if(abono != 100)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*La suma de los abonos es: " + abono + " y debe ser exacmente igual a 100.";
            return false;
        }
        
        return true;
    };
    
    /*--------------------Activar-desactivar plaza---------------------------------------*/
    //Activa-Descativa una plaza desde el modal de detalle
    //copia los datos de la plaza en una nueva varible y llama a la función para confirmar su cambio de estado de activo
    $scope.CambiarActivoModal = function()   // desde el modal de detalle
    {
        $scope.planPagoActualizar.Activo = !$scope.planPagoActualizar.Activo;
        $scope.CambiarEstadoActivo($scope.planPagoActualizar);
    };
    
    //Se abre un panel para confirmar que se quiere cambiar el estado de activo 
    $scope.CambiarEstadoActivo = function(plan)
    {
        $scope.planPagoActualizar = plan;
        if(plan.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR " + plan.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR "  +plan.Nombre + "?";
        }
        $('#modalActivoPlanPago').modal('toggle'); 
    };
    
    //Se confirmo el cambio de estado de activo y se llama al metodo correspondiente para realizar el update
    $scope.ConfirmarActualizarPlanPago = function()
    {
        var datos = [];
        if($scope.planPagoActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        datos[1] = $scope.planPagoActualizar.PlanPagoId;
        
        ActivarDesactivarPlanPago($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El el plan de pagos se ha actualizado correctamente.";
            }
            else
            {
                $scope.planPagoActualizar.Activo = !$scope.planPagoActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajePlanPago').modal('toggle');
        }).catch(function(error)
        {
            $scope.planPagoActualizar.Activo = !$scope.planPagoActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
            $('#mensajePlanPago').modal('toggle');
        });
        
    };
    
    //se cancela el cambio del estatus de activo
    $scope.CancelarCambioActivo = function()
    {
        $scope.planPagoActualizar.Activo = !$scope.planPagoActualizar.Activo;
    };
    
    /*---------------------Inicializar Promocion ----------------------*/
    $scope.InicializarPlanPago = function()
    {
        $scope.GetPlanPago();
    };

    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.InicializarPlanPago();
                }
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
        else
        {
            $location.path('/Login');
        }
    }
    
    
    //Se manda a llamar cada ves que los datos del usuario cambian
    //verifica que el usuario este logeado y que tenga los permisos correspondientes
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
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.InicializarPlanPago();
                }
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
    });
});