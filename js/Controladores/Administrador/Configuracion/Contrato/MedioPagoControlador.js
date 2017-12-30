app.controller("MedioPagoControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{       
    $scope.medioPago = [];
    
    $scope.ordenarMedioPago = "Nombre";
    $scope.buscarMedioPago = "";
    
    $scope.medioActualizar = null;
    $scope.nuevoMedioPago = null;
    
    $scope.mensajeError = [];

    $scope.GetMedioPago = function()      
    {
        GetMedioPago($http, $q, CONFIG).then(function(data)
        {
            $scope.medioPago = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual
    $scope.CambiarOrdenaMedioPago = function(campoOrdenar)
    {
        if($scope.ordenarMedioPago == campoOrdenar)
        {
            $scope.ordenarMedioPago = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarMedioPago = campoOrdenar;
        }
    };
    
    /*-------------------Agregar Editar------------------------------*/
    //abre el pandel para agregar-editar un servicio
    $scope.AbrirMedioPago = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoMedioPago =  $scope.SetMedioPago(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoMedioPago =  new MedioPago();
        }
        
        $scope.operacion = operacion;
        $('#medioPagoModal').modal('toggle');
    };
    
    $scope.SetMedioPago = function(data)
    {
        var medio = new MedioPago();
        
        medio.MedioPagoId = data.MedioPagoId;
        medio.Nombre = data.Nombre;
        medio.Activo = data.Activo;
        medio.Defecto = data.Defecto;
        
        return medio;
    };
    
    /*------------------Terminar Tipo Proyecto ----------------------*/
    $scope.TerminarMedioPago = function(nombreInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            return;
        }
        else
        {
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarMedioPago();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarMedioPago();
            }
        }
    };
    
    $scope.AgregarMedioPago = function()    
    {
        var medio = $scope.SetMedioPago($scope.nuevoMedioPago);
        
        AgregarMedioPago($http, CONFIG, $q, medio).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#medioPagoModal').modal('toggle');
                $scope.mensaje = "El medio de pago se ha agregado.";
                
                $scope.nuevoMedioPago.MedioPagoId = data[1].Id;
                $scope.medioPago.push($scope.nuevoMedioPago);
                
                if($scope.nuevoMedioPago.Defecto)
                {
                    $scope.QuitarDefecto(data[1].Id );
                }
                $scope.nuevoMedioPago = new MedioPago();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeMedioPago').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioPago').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarMedioPago = function()
    {
        var medio = $scope.SetMedioPago($scope.nuevoMedioPago);
        
        EditarMedioPago($http, CONFIG, $q, medio).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#medioPagoModal').modal('toggle');
                $scope.mensaje = "El medio de pago se ha editado.";
                $scope.SetNuevoMedioPago($scope.nuevoMedioPago);
                
                if($scope.nuevoMedioPago.Defecto)
                {
                    $scope.QuitarDefecto($scope.nuevoMedioPago.MedioPagoId);
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }

            $('#mensajeMedioPago').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioPago').modal('toggle');
        });
    };
    
    $scope.SetNuevoMedioPago = function(data)
    {
        if($scope.operacion == "Editar")
        {
            for(var k=0; k<$scope.medioPago.length; k++)
            {
                if(data.MedioPagoId == $scope.medioPago[k].MedioPagoId)
                {
                    $scope.medioPago[k] = $scope.SetMedioPago(data);
                    break;
                }
            }
        }
    };
    
    $scope.ValidarDatos = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre del medio de pago.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k = 0; k<$scope.medioPago.length; k++)
        {
            if($scope.medioPago[k].Nombre.toLowerCase() == $scope.nuevoMedioPago.Nombre.toLowerCase() && $scope.medioPago[k].MedioPagoId != $scope.nuevoMedioPago.MedioPagoId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El medio de pago \"" + $scope.nuevoMedioPago.Nombre.toLowerCase() + "\" ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.QuitarDefecto = function(medio)
    {  
        for(var k=0; k<$scope.medioPago.length; k++)
        {
            if($scope.medioPago[k].MedioPagoId != medio && $scope.medioPago[k].Defecto)
            {
                $scope.medioPago[k].Defecto = false;
                break;
            }
        }
    };
    
    $scope.CerrarMedioPagoForma = function()
    {
        $scope.mensajeError = [];
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarMedioPago = function(medio) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.medioActualizar = medio;
        
        if(medio.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + medio.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + medio.Nombre + "?";
        }
        $('#modalActivarMedioPago').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarTipoProyecto = function()  
    {
        var datos = [];
        if($scope.medioActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.medioActualizar.MedioPagoId;

        ActivarDesactivarMedioPago($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El medio de pago se ha actualizado.";
            }
            else
            {
                $scope.medioPago.Activo = !$scope.medioActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeMedioPago').modal('toggle');
        }).catch(function(error)
        {
            $scope.medioPago.Activo = !$scope.medioActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioPago').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoTipoProyecto = function()           
    {
        $scope.medioActualizar.Activo = !$scope.medioActualizar.Activo;
    };
    
    /*-------------------- Inicializar ----------------------- */
    $scope.GetMedioPago();
});