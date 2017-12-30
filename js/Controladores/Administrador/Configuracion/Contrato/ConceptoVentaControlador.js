app.controller("ConceptoVentaControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.conceptoVenta = [];
    
    $scope.ordenarConcepto = "Nombre";
    $scope.buscarTipoProyecto = "";
    
    $scope.conceptoActualizar = null;
    $scope.nuevoConceptoVenta = null;
    
    $scope.mensajeError = [];

    $scope.GetConceptoVenta = function()      
    {
        GetConceptoVenta($http, $q, CONFIG).then(function(data)
        {
            $scope.conceptoVenta = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual se ordena
    $scope.CambiarOrdenarConceptoVenta = function(campoOrdenar)
    {
        if($scope.ordenarConcepto == campoOrdenar)
        {
            $scope.ordenarConcepto = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarConcepto = campoOrdenar;
        }
    };
    
    /*-------------------Agregar Editar------------------------------*/
    //abre el pandel para agregar-editar un servicio
    $scope.AbrirConceptoVenta = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoConceptoVenta =  $scope.SetConceptoVenta(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoConceptoVenta =  new ConceptoVenta();
        }
        
        $scope.operacion = operacion;
        $('#concetoVentaModal').modal('toggle');
    };
    
    $scope.SetConceptoVenta = function(data)
    {
        var concepto = new TipoProyecto();
        
        concepto.ConceptoVentaId = data.ConceptoVentaId;
        concepto.Nombre = data.Nombre;
        concepto.IVA = data.IVA;
        concepto.Activo = data.Activo;
        
        return concepto;
    };
    
    /*------------------Terminar Tipo Proyecto ----------------------*/
    $scope.TerminarConceptoVenta = function(nombreInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            return;
        }
        else
        {
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarConceptoVenta();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarConceptoVenta();
            }
        }
    };
    
    $scope.AgregarConceptoVenta = function()    
    {
        var concepto = $scope.SetConceptoVenta($scope.nuevoConceptoVenta);
        
        AgregarConceptoVenta($http, CONFIG, $q, concepto).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#concetoVentaModal').modal('toggle');
                $scope.mensaje = "El concepto de venta se ha agregado.";
                
                $scope.nuevoConceptoVenta.ConceptoVentaId = data[1].Id;
                $scope.conceptoVenta.push($scope.nuevoConceptoVenta);
                $scope.nuevoConceptoVenta = new ConceptoVenta();
                //$scope.GetServicio();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConceptoVenta').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConceptoVenta').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarConceptoVenta = function()
    {
        var concepto = $scope.SetConceptoVenta($scope.nuevoConceptoVenta);
        
        EditarConceptoVenta($http, CONFIG, $q, concepto).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#concetoVentaModal').modal('toggle');
                $scope.mensaje = "El concepto de venta se ha editado.";
                $scope.SetNuevoConceptoVenta($scope.nuevoConceptoVenta);
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }

            $('#mensajeConceptoVenta').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConceptoVenta').modal('toggle');
        });
    };
    
    $scope.SetNuevoConceptoVenta = function(data)
    {
        if($scope.operacion == "Editar")
        {
            for(var k=0; k<$scope.conceptoVenta.length; k++)
            {
                if(data.ConceptoVentaId == $scope.conceptoVenta[k].ConceptoVentaId)
                {
                    $scope.conceptoVenta[k] = $scope.SetConceptoVenta(data);
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
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre del concepto de venta.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k = 0; k<$scope.conceptoVenta.length; k++)
        {
            if($scope.conceptoVenta[k].Nombre.toLowerCase() == $scope.nuevoConceptoVenta.Nombre.toLowerCase() && $scope.conceptoVenta[k].ConceptoVentaId != $scope.nuevoConceptoVenta.ConceptoVentaId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El tipo de proyecto \"" + $scope.nuevoConceptoVenta.Nombre.toLowerCase() + "\" ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarConceptoVenta = function()
    {
        $scope.mensajeError = [];
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarConceptoVenta = function(concepto) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.conceptoActualizar = concepto;
        
        if(concepto.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + concepto.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + concepto.Nombre + "?";
        }
        $('#modalActivarDesactivarConceptoVenta').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarConceptoVenta = function()  
    {
        var datos = [];
        if($scope.conceptoActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.conceptoActualizar.ConceptoVentaId;

        ActivarDesactivarConceptoVenta($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El concepto de venta se ha actualizado.";
            }
            else
            {
                $scope.conceptoActualizar.Activo = !$scope.conceptoActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConceptoVenta').modal('toggle');
        }).catch(function(error)
        {
            $scope.conceptoActualizar.Activo = !$scope.conceptoActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConceptoVenta').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoConceptoVenta = function()           
    {
        $scope.conceptoActualizar.Activo = !$scope.conceptoActualizar.Activo;
    };
    
    /*-------------------- Inicializar ----------------------- */
    $scope.GetConceptoVenta();
});