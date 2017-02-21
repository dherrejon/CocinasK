app.controller("ServicioControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.servicio = [];
    
    $scope.ordenarServicio = "Nombre";
    $scope.buscarServicio = "";
    
    $scope.servicioActualizar = null;
    $scope.nuevoServicio = null;
    
    $scope.claseServicio = {nombre:"entrada", costo:"entrada", precio:"entrada"};
    
    $scope.terminar = false;  //desabilita el boton terminar
    $scope.mensajeError = [];

    $scope.GetServicio = function()      
    {
        GetServicio($http, $q, CONFIG).then(function(data)
        {
            $scope.servicio = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual
    $scope.CambiarOrdenarServicio = function(campoOrdenar)
    {
        if($scope.ordenarServicio == campoOrdenar)
        {
            $scope.ordenarServicio = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarServicio = campoOrdenar;
        }
    };
    
    /*-------------------Agregar Editar------------------------------*/
    //abre el pandel para agregar-editar un servicio
    $scope.AbrirServicio = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoServicio = SetServicio(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoServicio =  new Servicio();
        }
        
        $scope.operacion = operacion;
        $('#servicioModal').modal('toggle');
    };
    
    /*------------------Terminar Servicio ----------------------*/
    $scope.TerminarServicio = function(nombreInvalido, costoInvalido, precioInvalido)
    {
        $scope.terminar = true;
        
        if(!$scope.ValidarDatos(nombreInvalido, costoInvalido, precioInvalido))
        {
            $scope.terminar = false;
            return;
        }
        else
        {
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarServicio();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarServicio();
            }
        }
    };
    
    $scope.AgregarServicio = function()    
    {
        AgregarServicio($http, CONFIG, $q, $scope.nuevoServicio).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#servicioModal').modal('toggle');
                $scope.mensaje = "El servicio se ha agregado.";
                $scope.GetServicio();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeServicio').modal('toggle');
            $scope.terminar = false;
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeServicio').modal('toggle');
            $scope.terminar = false;
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarServicio = function()
    {
        EditarServicio($http, CONFIG, $q, $scope.nuevoServicio).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#servicioModal').modal('toggle');
                $scope.mensaje = "El servicio se ha editado.";
                $scope.GetServicio();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $scope.terminar = false;
            $('#mensajeServicio').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $scope.terminar = false;
            $('#mensajeServicio').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido, costoInvalido, precioInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.claseServicio.nombre = "entradaError";
        }
        else
        {
            $scope.claseServicio.nombre = "entrada";
        }
        if(costoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El costo por unidad debe ser un número decimal.";
            $scope.claseServicio.costo = "entradaError";
        }
        else
        {
            $scope.claseServicio.costo = "entrada";
        }
        if(precioInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El precio de venta debe ser un número decimal.";
            $scope.claseServicio.precio = "entradaError";
        }
        else
        {
            $scope.claseServicio.precio = "entrada";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k = 0; k<$scope.servicio.length; k++)
        {
            if($scope.servicio[k].Nombre.toLowerCase() == $scope.nuevoServicio.Nombre.toLowerCase() && $scope.servicio[k].ServicioId != $scope.nuevoServicio.ServicioId)
            {
                $scope.claseServicio.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "*El servicio " + $scope.nuevoServicio.Nombre.toLowerCase() + " ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarServicioForma = function()
    {
        $scope.claseServicio = {nombre:"entrada", costo:"entrada", precio:"entrada"};
        $scope.mensajeError = [];
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarServicio = function(servicio) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.servicioActualizar = servicio;
        
        if(servicio.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + servicio.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACRIVAR - " + servicio.Nombre + "?";
        }
        $('#modalActivarDesactivarServicio').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarServicio = function()  
    {
        var datos = [];
        if($scope.servicioActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.servicioActualizar.ServicioId;
        
        console.log();

        ActivarDesactivarServicio($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El servicio se ha actualizado.";
            }
            else
            {
                $scope.servicioActualizar.Activo = !$scope.servicioActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeServicio').modal('toggle');
        }).catch(function(error)
        {
            $scope.servicioActualizar.Activo = !$scope.servicioActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeServicio').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoServicio = function()           
    {
        $scope.servicioActualizar.Activo = !$scope.servicioActualizar.Activo;
    };
    
    /*-------------------- Inicializar ----------------------- */
    $scope.GetServicio();
});