app.controller("UbicacionControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.ubicacion = [];
    $scope.fabricacionUbicacion = [];
    $scope.tipoCubierta = [];

    $scope.mensajeError = [];
    
    $scope.ubicacionActualizar = null;
    $scope.nuevaUbicacion = null;
        
    $scope.claseUbicacion = {nombre:"entrada"};
    
    $scope.ordenarPorUbicacion = "Nombre";
    
    $scope.GetUbicacionCubierta = function()      
    {
        GetUbicacionCubierta($http, $q, CONFIG).then(function(data)
        {
            $scope.ubicacion = data;
            
            for(var k=0; k<data.length; k++)
            {
                $scope.GetDatosUbicacion(data[k].UbicacionCubiertaId, k);
            }

        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDatosUbicacion = function(id, index)
    {
        GetDatosUbicacion($http, $q, CONFIG, id).then(function(data)
        {   
            $scope.ubicacion[index].Datos = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*/$scope.GetTipoCubierta = function()
    {
        $scope.tipoCubierta = GetTipoCubierta();
    };*/
    
    $scope.GetFabricacionCubiertaUbicacion = function()              
    {
        GetFabricacionCubierta($http, $q, CONFIG, 1).then(function(data)
        {
            $scope.fabricacionUbicacion = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    $scope.CambiarOrdenarUbicacion = function(campoOrdenar)
    {
        if($scope.ordenarPorUbicacion == campoOrdenar)
        {
            $scope.ordenarPorUbicacion = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorUbicacion = campoOrdenar;
        }
    };
    
    /*---------- Detalles ----------------*/
    $scope.DetallesUbicacion = function(ubicacion)
    {
        $scope.ubicacionActualizar = ubicacion;
    };
    
    
    /*--------- Abrir modal para agregar - EDITAR ubicacion de la cubierta ---------------*/
    $scope.AbrirUbicacionCubierta = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevaUbicacion = $scope.SetUbicacion(objeto);
        }
        
        $scope.operacion = operacion;
        $('#ubicacionCubiertaModal').modal('toggle');
    };
    
    $scope.SetUbicacion = function(data)
    {
        var ubicacion = new UbicacionCubierta();
        
        ubicacion.UbicacionCubiertaId = data.UbicacionCubiertaId;
        ubicacion.Nombre = data.Nombre;
        ubicacion.Activo = data.Activo;
        
        ubicacion.Datos = [];
        
        /*for(var k=0; k<$scope.tipoCubierta.length; k++)
        {
            ubicacion.Datos[k] = new FabricacionPorUbicacionTipoCubierta();
            
            ubicacion.Datos[k].TipoCubierta = tipoCubierta
        }*/
        
        for(var k=0; k<data.Datos.length; k++)
        {
            ubicacion.Datos[k] = $scope.SetDatosUbicacion(data.Datos[k]);
        }
        
        return ubicacion;
    };
    
    $scope.SetDatosUbicacion = function(data)
    {
        var datosCubierta = new FabricacionPorUbicacionTipoCubierta();
        
        datosCubierta.FabricacionPorUbicacionTipoCubiertaId = data.FabricacionPorUbicacionTipoCubiertaId;
        datosCubierta.clase = "dropdownListModal";
        
        datosCubierta.TipoCubierta.TipoCubiertaId = data.TipoCubierta.TipoCubiertaId;
        datosCubierta.TipoCubierta.Nombre = data.TipoCubierta.Nombre;
        
        datosCubierta.FabricacionCubierta.FabricacionCubiertaId = data.FabricacionCubierta.FabricacionCubiertaId;
        datosCubierta.FabricacionCubierta.Nombre = data.FabricacionCubierta.Nombre;
        
        return datosCubierta;
    };
    
    $scope.CambiarFabricacionCubierta = function(tipo, fabricacion)
    {
        for(var k=0; k<$scope.nuevaUbicacion.Datos.length; k++)
        {
            if(tipo.TipoCubiertaId == $scope.nuevaUbicacion.Datos[k].TipoCubierta.TipoCubiertaId)
            {
                $scope.nuevaUbicacion.Datos[k].FabricacionCubierta = fabricacion;
                break;
            }
        }
    };
    
    /*------------------ Terminar ubicacion cubierta ---------------*/
    $scope.TerminarUbicacionCubierta = function()
    {
        if($scope.operacion == "Editar")
        {
            $scope.EditarUbicacionFabricacionTipoCubierta();
        }
    };
    
    $scope.EditarUbicacionFabricacionTipoCubierta = function()
    {
        EditarUbicacionFabricacionTipoCubierta($http, CONFIG, $q, $scope.nuevaUbicacion).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#ubicacionCubiertaModal').modal('toggle');
                $scope.mensaje = "La ubicación de cubiertase se ha editado.";
                $scope.GetUbicacionCubierta();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeConfigurarCubiertaUbicacion').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarCubiertaUbicacion').modal('toggle');
        });
    };
    
    $scope.CerrarUbicacionCubierta = function()
    {
        $scope.claseUbicacion = {nombre:"entrada"};
        $scope.mensajeError = [];
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarUbicacionCubierta = function(ubicacion) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.ubicacionActualizar = ubicacion;
        
        if(ubicacion.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + ubicacion.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACRIVAR - " + ubicacion.Nombre + "?";
        }
        $('#modalActivarDesactivarConfigurarCubiertaUbicacion').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarUbicacionCubierta = function()  
    {
        var datos = [];
        if($scope.ubicacionActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.ubicacionActualizar.UbicacionCubiertaId;

        ActivarDesactivarUbicacionCubierta($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "La ubicación de cubierta se ha actualizado.";
            }
            else
            {
                $scope.ubicacionActualizar.Activo = !$scope.ubicacionActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConfigurarCubiertaUbicacion').modal('toggle');
        }).catch(function(error)
        {
            $scope.ubicacionActualizar.Activo = !$scope.ubicacionActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarCubiertaUbicacion').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoUbicacionCubierta = function()           
    {
        $scope.ubicacionActualizar.Activo = !$scope.ubicacionActualizar.Activo;
    };
    
    $scope.GetUbicacionCubierta();
    //$scope.GetTipoCubierta();
    $scope.GetFabricacionCubiertaUbicacion();
});