app.controller("TipoProyectoControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.tipoProyecto = [];
    
    $scope.ordenarTipoProyecto = "Nombre";
    $scope.buscarTipoProyecto = "";
    
    $scope.tipoActualizar = null;
    $scope.nuevoTipoProyecto = null;
    
    $scope.mensajeError = [];

    $scope.GetTipoProyecto = function()      
    {
        GetTipoProyecto($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoProyecto = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual
    $scope.CambiarOrdenarTipoProyecto = function(campoOrdenar)
    {
        if($scope.ordenarTipoProyecto == campoOrdenar)
        {
            $scope.ordenarTipoProyecto = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarTipoProyecto = campoOrdenar;
        }
    };
    
    /*-------------------Agregar Editar------------------------------*/
    //abre el pandel para agregar-editar un servicio
    $scope.AbrirTipoProyecto = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoTipoProyecto =  $scope.SetTipoProyecto(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoTipoProyecto =  new TipoProyecto();
        }
        
        $scope.operacion = operacion;
        $('#tipoProyectoModal').modal('toggle');
    };
    
    $scope.SetTipoProyecto = function(data)
    {
        var tipo = new TipoProyecto();
        
        tipo.TipoProyectoId = data.TipoProyectoId;
        tipo.Nombre = data.Nombre;
        tipo.Mueble = data.Mueble;
        tipo.CubiertaAglomerado = data.CubiertaAglomerado;
        tipo.CubiertaPiedra = data.CubiertaPiedra;
        tipo.IVA = data.IVA;
        tipo.LibreIVA = data.LibreIVA;
        tipo.Activo = data.Activo;
        
        return tipo;
    };
    
    /*-------------------- operaciones de interfaz -------------*/
    $scope.CambiarMueble = function(val)
    {
        $scope.nuevoTipoProyecto.Mueble = val;
    };
    
    $scope.CambiarCubietaAglomerado = function(val)
    {
        $scope.nuevoTipoProyecto.CubiertaAglomerado = val;
    };
    
    $scope.CambiarCubietaPiedra = function(val)
    {
        $scope.nuevoTipoProyecto.CubiertaPiedra = val;
    };
    
    $scope.CambiarIVA = function(val)
    {
        $scope.nuevoTipoProyecto.IVA = val;
        
        if(!val)
        {
            $scope.nuevoTipoProyecto.LibreIVA = false;
        }
    };
    
    $scope.CambiarLiberarIVA = function(val)
    {
        $scope.nuevoTipoProyecto.LibreIVA = val;
    };
    
    /*------------------Terminar Tipo Proyecto ----------------------*/
    $scope.TerminarTipoProyecto = function(nombreInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            return;
        }
        else
        {
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarTipoProyecto();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarTipoProyecto();
            }
        }
    };
    
    $scope.AgregarTipoProyecto = function()    
    {
        var tipo = $scope.SetTipoProyecto($scope.nuevoTipoProyecto);
        
        AgregarTipoProyecto($http, CONFIG, $q, tipo).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#tipoProyectoModal').modal('toggle');
                $scope.mensaje = "El tipo de proyecto se ha agregado.";
                
                $scope.nuevoTipoProyecto.TipoProyectoId = data[1].Id;
                $scope.tipoProyecto.push($scope.nuevoTipoProyecto);
                $scope.nuevoTipoProyecto = new TipoProyecto();
                //$scope.GetServicio();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeTipoProyecto').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeTipoProyecto').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarTipoProyecto = function()
    {
        var tipo = $scope.SetTipoProyecto($scope.nuevoTipoProyecto);
        
        EditarTipoProyecto($http, CONFIG, $q, tipo).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#tipoProyectoModal').modal('toggle');
                $scope.mensaje = "El tipo de proyecto se ha editado.";
                $scope.SetNuevoTipoProyecto($scope.nuevoTipoProyecto);
                //$scope.GetServicio();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }

            $('#mensajeTipoProyecto').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeTipoProyecto').modal('toggle');
        });
    };
    
    $scope.SetNuevoTipoProyecto = function(data)
    {
        if($scope.operacion == "Editar")
        {
            for(var k=0; k<$scope.tipoProyecto.length; k++)
            {
                if(data.TipoProyectoId == $scope.tipoProyecto[k].TipoProyectoId)
                {
                    $scope.tipoProyecto[k] = $scope.SetTipoProyecto(data);
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
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre del tipo de proyecto.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k = 0; k<$scope.tipoProyecto.length; k++)
        {
            if($scope.tipoProyecto[k].Nombre.toLowerCase() == $scope.nuevoTipoProyecto.Nombre.toLowerCase() && $scope.tipoProyecto[k].TipoProyectoId != $scope.nuevoTipoProyecto.TipoProyectoId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El tipo de proyecto \"" + $scope.nuevoTipoProyecto.Nombre.toLowerCase() + "\" ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarTipoProyectoForma = function()
    {
        $scope.mensajeError = [];
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarTipoProyecto = function(tipo) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.tipoActualizar = tipo;
        
        if(tipo.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + tipo.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + tipo.Nombre + "?";
        }
        $('#modalActivarDesactivarTipoProyecto').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarTipoProyecto = function()  
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
        
        datos[1] = $scope.tipoActualizar.TipoProyectoId;

        ActivarDesactivarTipoProyecto($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El tipo de proyecto se ha actualizado.";
            }
            else
            {
                $scope.tipoActualizar.Activo = !$scope.tipoActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeTipoProyecto').modal('toggle');
        }).catch(function(error)
        {
            $scope.tipoActualizar.Activo = !$scope.tipoActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeTipoProyecto').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoTipoProyecto = function()           
    {
        $scope.tipoActualizar.Activo = !$scope.tipoActualizar.Activo;
    };
    
    /*-------------------- Inicializar ----------------------- */
    $scope.GetTipoProyecto();
});