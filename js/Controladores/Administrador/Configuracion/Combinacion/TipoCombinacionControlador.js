app.controller("TipoCombinacion", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.tipoCombinacion = [];
    
    $scope.ordenarTipo = "Nombre";
    
    $scope.tipoActualizar = null;
    $scope.nuevoTipo = null;
    
    $scope.claseTipo = {nombre:"entrada", descripcion:"margenTextArea"};

    $scope.mensajeError = [];

    $scope.GetTipoCombinacionMaterial = function()      
    {
        GetTipoCombinacionMaterial($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoCombinacion = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual
    $scope.CambiarOrdenarServicio = function(campoOrdenar)
    {
        if($scope.ordenarTipo == campoOrdenar)
        {
            $scope.ordenarTipo = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarTipo = campoOrdenar;
        }
    };
    
    /*------------------- Detalle --------------------------------*/
    $scope.MostrarDetalle = function(tipo)
    {
        $scope.tipoActualizar = tipo;
    };
    
    /*-------------------Agregar Editar------------------------------*/
    //abre el pandel para agregar-editar un servicio
    $scope.AbrirTipoCombinacion = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoTipo = SetTipoCombinacion(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoTipo =  new TipoCombinacion();
        }
        
        $scope.operacion = operacion;
        $('#tipoCombinacionModal').modal('toggle');
    };
    
    /*------------------Terminar Servicio ----------------------*/
    $scope.TerminarTipoCombinacion = function(nombreInvalido, descripcionInvalida)
    {   
        if(!$scope.ValidarDatos(nombreInvalido, descripcionInvalida))
        {
            return;
        }
    
        else
        {
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarTipoCombiancion();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarTipoCombiancion();
            }
        }
    };
    
    $scope.AgregarTipoCombiancion = function()    
    {
        AgregarTipoCombiancion($http, CONFIG, $q, $scope.nuevoTipo).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#tipoCombinacionModal').modal('toggle');
                $scope.mensaje = "El tipo de combinación se ha agregado.";
                $scope.GetTipoCombinacionMaterial();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeTipoCombinacion').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeTipoCombinacion').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarTipoCombiancion = function()
    {
        EditarTipoCombiancion($http, CONFIG, $q, $scope.nuevoTipo).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#tipoCombinacionModal').modal('toggle');
                $scope.mensaje = "El tipo de combinación se ha editado.";
                $scope.GetTipoCombinacionMaterial();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $scope.terminar = false;
            $('#mensajeTipoCombinacion').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeTipoCombinacion').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido, descripcionInvalida)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.claseTipo.nombre = "entradaError";
        }
        else
        {
            $scope.claseTipo.nombre = "entrada";
        }
        if(descripcionInvalida)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes escribir una despcripción de presupuesto.";
            $scope.claseTipo.descripcion = "margenTextAreaError";
        }
        else
        {
            $scope.claseTipo.descripcion = "margenTextArea";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k = 0; k<$scope.tipoCombinacion.length; k++)
        {
            if($scope.tipoCombinacion[k].Nombre.toLowerCase() == $scope.nuevoTipo.Nombre.toLowerCase() && $scope.tipoCombinacion[k].TipoCombinacionId != $scope.nuevoTipo.TipoCombinacionId)
            {
                $scope.claseTipo.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "*El tipo de combianción " + $scope.nuevoTipo.Nombre.toLowerCase() + " ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarTipoCombinacionForma = function()
    {
        $scope.claseTipo = {nombre:"entrada", descripcion:"margenTextArea"};
        $scope.mensajeError = [];
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarTipoCombinacion = function(tipo) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.tipoActualizar = tipo;
        
        if(tipo.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + tipo.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACRIVAR - " + tipo.Nombre + "?";
        }
        $('#modalActivarDesactivarTipoCombinacion').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarTipoCombinacion = function()  
    {
        var datos = [];
        if($scope.tipoActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.tipoActualizar.TipoCombinacionId;

        ActivarDesactivarTipoCombinacion($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El tipo de combinación se ha actualizado.";
            }
            else
            {
                $scope.tipoActualizar.Activo = !$scope.tipoActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeTipoCombinacion').modal('toggle');
        }).catch(function(error)
        {
            $scope.tipoActualizar.Activo = !$scope.tipoActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeTipoCombinacion').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoTipoCombinacion = function()           
    {
        $scope.tipoActualizar.Activo = !$scope.tipoActualizar.Activo;
    };
    
    /*-------------------- Inicializar ----------------------- */
    $scope.GetTipoCombinacionMaterial();
});