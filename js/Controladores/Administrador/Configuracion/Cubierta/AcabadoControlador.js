app.controller("AcabadoControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.acabado = [];
    $scope.buscarAcabado = "";
    $scope.ordenarAcabado = "Nombre";
    
    $scope.GetAcabadoCubierta = function()      
    {
        GetAcabadoCubierta($http, $q, CONFIG).then(function(data)
        {
            $scope.acabado = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    $scope.CambiarOrdenarAcabado = function(campoOrdenar)
    {
        if($scope.ordenarAcabado == campoOrdenar)
        {
            $scope.ordenarAcabado = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarAcabado = campoOrdenar;
        }
    };
    
    /*--------- Abrir modal para agregar - EDITAR un acabado de la cubierta ---------------*/
    $scope.AbrirAcabadoCubierta = function(operacion, objeto)
    {
        if(operacion == "Agregar")
        {
            $scope.nuevoAcabado = new AcabadoCubierta();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoAcabado = $scope.SetAcabado(objeto);
        }
        
        $scope.operacion = operacion;
        $('#AcabadoCubiertaModal').modal('toggle');
    };
    
    $scope.SetAcabado = function(data)
    {
        var acabado = new AcabadoCubierta();
        
        acabado.AcabadoCubiertaId = data.AcabadoCubiertaId;
        acabado.Nombre = data.Nombre;
        acabado.Activo = data.Activo;
        
        return acabado;
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
    
    /*------------------ Terminar acabado cubierta ---------------*/
    $scope.TerminarAcabadoCubierta = function(inombre)
    {
        if(!$scope.ValidarAcabado(inombre))
        {
            return;
        }
        else
        {
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarAcabadoCubierta();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarAcabadoCubierta();
            }
        }
    };
    
    $scope.AgregarAcabadoCubierta = function()
    {
        AgregarAcabadoCubierta($http, CONFIG, $q, $scope.nuevoAcabado).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#AcabadoCubiertaModal').modal('toggle');
                $scope.mensaje = "El acabado de cubierta se se ha agregado.";
                $scope.GetAcabadoCubierta();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeAcabadoCubierta').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeAcabadoCubierta').modal('toggle');
        });
    };
    
    $scope.EditarAcabadoCubierta = function()
    {
        EditarAcabadoCubierta($http, CONFIG, $q, $scope.nuevoAcabado).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#AcabadoCubiertaModal').modal('toggle');
                $scope.mensaje = "El acabado de cubierta se se ha editado.";
                $scope.GetAcabadoCubierta();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeAcabadoCubierta').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeAcabadoCubierta').modal('toggle');
        });
    };
    
    $scope.ValidarAcabado = function(inombre)
    {
        $scope.mensajeError = [];
        
        if(inombre)
        {
            $scope.mensajeError[0] = "*Escribe un nombre válido para el acabdo de cubierta.";
            return false;
        }
        
        for(var k=0; k<$scope.acabado.length; k++)
        {
            if($scope.acabado[k].Nombre.toLowerCase() == $scope.nuevoAcabado.Nombre.toLocaleLowerCase() && $scope.acabado[k].AcabadoCubiertaId != $scope.nuevoAcabado.AcabadoCubiertaId)
            {
                 $scope.mensajeError[0] = "*El acabado " + $scope.nuevoAcabado.Nombre.toUpperCase() + " ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarAcabadoCubierta = function()
    {
        $scope.mensajeError = [];
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarAcabadoCubierta = function(acabado) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.acabadoActualizar = acabado;
        
        if(acabado.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + acabado.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + acabado.Nombre + "?";
        }
        $('#modalActivarDesactivarAcabado').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarAcabadoCubierta = function()  
    {
        var datos = [];

        datos[0] = $scope.acabadoActualizar.Activo ? "1" : "0";
        datos[1] = $scope.acabadoActualizar.AcabadoCubiertaId;

        ActivarDesactivarAcabadoCubierta($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El acabado de cubierta se ha actualizado.";
            }
            else
            {
                $scope.acabadoActualizar.Activo = !$scope.acabadoActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeAcabadoCubierta').modal('toggle');
        }).catch(function(error)
        {
            $scope.acabadoActualizar.Activo = !$scope.acabadoActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeAcabadoCubierta').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoAcabadoCubierta = function()           
    {
        $scope.acabadoActualizar.Activo = !$scope.acabadoActualizar.Activo;
    };
    
});