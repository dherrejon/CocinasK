app.controller("DescripcionContatoController", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{       
    $scope.descripcion = [];
    $scope.mensajeError = [];
    $scope.buscarDesc = "";

    $scope.GetDescripcionContrato = function()      
    {
        GetDescripcionContrato($http, $q, CONFIG).then(function(data)
        {
            $scope.descripcion = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    
    /*-------------------Agregar Editar------------------------------*/
    //abre el pandel para agregar-editar un servicio
    $scope.AbrirDescripcion = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevaDesc =  $scope.SetDescripcionContrato(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevaDesc =  new DescripcionContrato();
        }
        
        $scope.operacion = operacion;
        $('#DecripcionContrato').modal('toggle');
    };
    
    $scope.SetDescripcionContrato = function(data)
    {
        var desc = new DescripcionContrato();
        
        desc.DescripcionContratoId = data.DescripcionContratoId;
        desc.Descripcion = data.Descripcion;
        desc.Activo = data.Activo;
        
        return desc;
    };
    
    /*------------------Terminar Tipo Proyecto ----------------------*/
    $scope.TerminarDescripcionContrato = function(descInvalido)
    {
        $scope.mensajeError = [];
        
        if(descInvalido)
        {
            $scope.mensajeError[0] = "*Escribe una descripción.";
            return;
        }
        else
        {
            var desc = $scope.SetDescripcionContrato($scope.nuevaDesc);
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarDescripcionContrato(desc);
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarDescripcionContrato(desc);
            }
        }
    };
    
    $scope.AgregarDescripcionContrato = function(desc)    
    {   
        AgregarDescripcionContrato($http, CONFIG, $q, desc).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#DecripcionContrato').modal('toggle');
                $scope.mensaje = "La descripción se ha agregado.";
                $scope.GetDescripcionContrato();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeDescripcionContrato').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeDescripcionContrato').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarDescripcionContrato = function(desc)
    {
        EditarDescripcionContrato($http, CONFIG, $q, desc).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#DecripcionContrato').modal('toggle');
                $scope.mensaje = "La descripción se ha editado.";
                $scope.GetDescripcionContrato();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }

            $('#mensajeDescripcionContrato').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeDescripcionContrato').modal('toggle');
        });
    };
    
    $scope.CerrarDescripcion = function()
    {
        $scope.mensajeError = [];
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarDescripcion = function(desc) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.descActualizar = desc;
        
        if(desc.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - la descripción?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - la descripción?";
        }
        $('#modalActivarDescripcion').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarDescripcion = function()  
    {
        var datos = [];
        
        datos[0] = $scope.descActualizar.Activo ? "1" : "0";        
        datos[1] = $scope.descActualizar.DescripcionContratoId;

        ActivarDesactivarDescripcion($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "La descripcion se ha actualizado.";
            }
            else
            {
                $scope.descActualizar.Activo = !$scope.descActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeDescripcionContrato').modal('toggle');
        }).catch(function(error)
        {
            $scope.descActualizar.Activo = !$scope.descActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeDescripcionContrato').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoDescripcion = function()           
    {
        $scope.descActualizar.Activo = !$scope.descActualizar.Activo;
    };
    
    //--------------- Detalle ------------
    $scope.AbrirDetalleDescripcion = function(data)
    {
        $scope.detalle = data;
        $('#DetalleModal').modal('toggle');
    };
    
    /*-------------------- Inicializar ----------------------- */
    $scope.GetDescripcionContrato();
});