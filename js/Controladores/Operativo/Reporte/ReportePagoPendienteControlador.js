app.controller("ReportePagoPendienteController", function($scope, $rootScope, $http, $q, CONFIG, $window,  $routeParams, $location, datosUsuario)
{   
    /*----------------verificar los permisos---------------------*/
    $scope.permiso = {verTodo: false, ver: false};
    $rootScope.permisoOperativo = {verTodosCliente: false};

    $scope.unidad = [];
    $scope.filtro = {unidad: new Object(), estatus: new Object()};
    $scope.ordenar = "Cliente";
    $scope.busqueda = "";
    $scope.pago = [];
    
    $scope.estatusContrato = GetEstatusContrato();
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "OpeCliConsultar")
            {
                $scope.permiso.verTodo = true;
                $rootScope.permisoOperativo.verTodosCliente = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "OpeRPAConsultar")
            {
                $scope.permiso.ver = true;
            }
        }
    };
    
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
    $scope.FiltroPago = function(pago)
    {
        if(!$scope.filtro.unidad.UnidadNegocioId && !$scope.filtro.estatus.EstatusContratoId)
        {
            return true;
        }
        else if($scope.filtro.unidad.UnidadNegocioId && $scope.filtro.estatus.EstatusContratoId)
        {
            if(pago.UnidadNegocioId == $scope.filtro.unidad.UnidadNegocioId && pago.EstatusContratoId == $scope.filtro.estatus.EstatusContratoId)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else if($scope.filtro.unidad.UnidadNegocioId)
        {
            if(pago.UnidadNegocioId == $scope.filtro.unidad.UnidadNegocioId)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else if($scope.filtro.estatus.EstatusContratoId)
        {
            if(pago.EstatusContratoId == $scope.filtro.estatus.EstatusContratoId)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    };
    
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
    
    
    //-------------------- vista -------------------------
    $scope.MostrarEstatus = function(actualId, cambiarId)
    {
        if(actualId == cambiarId || cambiarId=="2" || actualId=="3")
        {
            return false;
        }
        
        if(actualId == "0" || actualId == "2")
        {
            if(cambiarId == "3")
            {
                return true;
            }
            else
            {
                 return false;
            }
            
        }
        else if(actualId == "1" )
        {
            if(cambiarId == "4")
            {
                return true;
            }
            else
            {
                 return false;
            }
            
        }
        else if(actualId == "4" )
        {
            if(cambiarId == "1")
            {
                return true;
            }
            else
            {
                 return false;
            }
        }
      
    };
    
    $scope.GetEstatusContrato = function(id)
    {
        switch(id)
        {
            case "1":
                return "EnProgreso";
            case "2":
                return "Pagado";
            case "3":
                return "Entregado";
            case "4":
                return "Detenido";
            case "0":
                return "Atrasado";
                
            default: 
                return "";
        }
    };
    
    //-------------------------- Cambiar de Estatus contrato ----------------------
    $scope.CambiarEstatus = function(pago, estatus)
    {
        $scope.cambiarPago = pago;
        $scope.estatusActualizar = estatus;
        
        $scope.mensajeAdvertencia = "¿Estas seguro de cambiar el estatus del contrato a " + estatus.Nombre + "?";
        
        $("#modalEstatusContratoPagoPendiente").modal('toggle');
    };
    
    $scope.CancelarEstatusContrato = function()
    {
        $scope.cambiarPago = null;
        $scope.estatusActualizar = null;
    };
    
    $scope.ConfirmarActualizarContrato = function()
    {        
        var datos = new Object();
        datos.ContratoId = $scope.cambiarPago.ContratoId;
        datos.EstatusContratoId = $scope.estatusActualizar.EstatusContratoId;
        
        
        CambiarEstatusContrato($http, $q, CONFIG, datos).then(function(data)
        {
            if(data == "Exitoso")
            {
                $rootScope.mensaje = "El estatus del contrato se ha actualizado correctamente.";
                 
                $scope.cambiarPago.NombreEstatusContrato = $scope.estatusActualizar.Nombre;
                $scope.cambiarPago.EstatusContratoId = $scope.estatusActualizar.EstatusContratoId;
                $scope.cambiarPago = null;
                $scope.estatusActualizar = null;
            }
            else
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                $('#mensajePagoPendiente').modal('toggle');
            }
            
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
            $('#mensajePagoPendiente').modal('toggle');
        });
        
    };
    
    
    //---- Enviar Filtro
    $scope.GetReportePagoPendiente = function(id)
    {   
        GetReportePagoPendiente($http, $q, CONFIG, id).then(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                if(!$scope.GetPagoPendiente(data[k], data[k].PlanPago))
                {
                    data.splice(k,1);
                    k--;
                }
            }
            
            $scope.pago = data;
            
        }).catch(function(error)
        {
            $scope.pago = [];
            alert(error);
        });
    };
    
    $scope.GetPagoPendiente = function(data, plan)
    {
        var hoy = GetHoyEng();
        var saldo = 0;
        var fechaAtraso = false;
        var pendiente = 0;
        
        data.Pago = parseFloat(data.Pago);
        data.ContratoId = parseInt(data.ContratoId);
        
        
        for(var k=0; k<plan.length; k++)
        {
            plan[k].Pago = parseFloat(plan[k].Pago);
            plan[k].FechaCompromiso2 = GetFechaEng(plan[k].FechaCompromiso);
            
            if(plan[k].FechaCompromiso2 < hoy)
            {
                saldo += plan[k].Pago;
                
                if(saldo > data.Pago && !fechaAtraso)
                {
                    data.FechaPendiente = plan[k].FechaCompromiso;
                    data.FechaPendiente2 = plan[k].FechaCompromiso2;
                    fechaAtraso = true;
                }
            }
        }
        
        pendiente = saldo - data.Pago;
        
        if(pendiente > 0)
        {
            data.Pendiente = pendiente;
            return true;
        }
        else
        {
            return false;
        }
    };
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.Inicializar = function()
    {
        $scope.IdentificarPermisos();
        if(!$scope.permiso.ver)
        {
            $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
        }
        else
        {
            $scope.GetUnidadNegocio();            
            $scope.usuario = datosUsuario.getUsuario(); 
            
            var unidadId = $scope.permiso.verTodo ? -1 :$scope.usuario.UnidadNegocioId;
            $scope.GetReportePagoPendiente(unidadId);
        }
    };
    
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
                $scope.Inicializar();
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
                $scope.Inicializar();
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
    });
    
});