app.controller("MedioCaptacionControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.medioCaptacion = [];
    $scope.medioOtro = [];
    
    $scope.medioCaptacionActualizar = null;
    $scope.nuevoMedioCaptacion = null;
    $scope.buscarMedioCaptacion = "";
    $scope.ordenarPorMedioCaptacion = "Nombre";

    $scope.claseMedioCaptacion = {nombre:"entrada"};
    $scope.claseOtro = {medio:"dropdownListModal"};

    $scope.medioCaptacionOtro = new MedioCaptacion();
    $scope.otroNuevo = false;

    $scope.mensajeError = [];
    
    $scope.GetMedioCaptacion = function()              
    {
        GetMedioCaptacion($http, $q, CONFIG).then(function(data)
        {
            $scope.medioCaptacion = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //--------------------- Otro --------------------
    $scope.GetMedioCaptacionOtro = function()              
    {
        GetMedioCaptacionOtro($http, $q, CONFIG).then(function(data)
        {
           for(var k=0; k<data.length; k++)
            {
                data[k].Seleccionado = false;
            }
            $scope.medioOtro = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual
    $scope.CambiarOrdenarMedioCaptacion = function(campoOrdenar)
    {
        if($scope.ordenarPorMedioCaptacion == campoOrdenar)
        {
            $scope.ordenarPorMedioCaptacion = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorMedioCaptacion = campoOrdenar;
        }
    };
    
    /*----------- Abrir modal para editar-agregar----------------------*/
    $scope.AbrirMedioCaptacion = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoMedioCaptacion = SetMedioCaptacion(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoMedioCaptacion =  new MedioCaptacion();
        }
        
        $scope.operacion = operacion;
        $('#medioCaptacionModal').modal('toggle');
    };
    
    /*------------- Terminar tipo accesorio ----------------------*/
    $scope.TerminarMedioCaptacion = function(nombreInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            return;
        }

        if($scope.operacion == "Agregar")
        {
            $scope.AgregarMedioCaptacion();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarMedioCaptacion();
        }
            
    };
    
    $scope.AgregarMedioCaptacion = function()    
    {
        AgregarMedioCaptacion($http, CONFIG, $q, $scope.nuevoMedioCaptacion).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#medioCaptacionModal').modal('toggle');
                $scope.mensaje = "El medio de captación se ha agregado.";
                
                $scope.GetMedioCaptacion();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeMedioCaptacion').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioCaptacion').modal('toggle');
        });
    };
    
    $scope.EditarMedioCaptacion = function()
    {
        EditarMedioCaptacion($http, CONFIG, $q, $scope.nuevoMedioCaptacion).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#medioCaptacionModal').modal('toggle');
                $scope.mensaje = "El medio de captación se ha editado.";
                
                $scope.GetMedioCaptacion();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeMedioCaptacion').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioCaptacion').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.claseMedioCaptacion.nombre = "entradaError";
        }
        else
        {
            $scope.claseMedioCaptacion.nombre = "entrada";
        }
        
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.medioCaptacion.length; k++)
        {
            if($scope.nuevoMedioCaptacion.Nombre.toLowerCase() == $scope.medioCaptacion[k].Nombre.toLowerCase()  && $scope.nuevoMedioCaptacion.MedioCaptacionId != $scope.medioCaptacion[k].MedioCaptacionId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El medio de captación " + $scope.nuevoMedioCaptacion.Nombre.toLowerCase() + " ya existe.";
                $scope.claseMedioCaptacion.nombre = "entradaError";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarMedioCaptacion = function()
    {
        $scope.mensajeError = [];
        $scope.claseMedioCaptacion = {nombre:"entrada"};
    };
    
    /*-------------- Activar y desactivar medio captación ------------------*/
    $scope.ActivarDesactivarMedioCaptacion = function(medio) 
    {
        $scope.medioCaptacionActualizar = medio;
        
        if(medio.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + medio.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACRIVAR - " + medio.Nombre + "?";
        }
        
        $('#modalActivarDesactivarMedioCaptacion').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarTipoAccesorio = function()  
    {
        var datos = [];
        if($scope.medioCaptacionActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.medioCaptacionActualizar.MedioCaptacionId;

        ActivarDesactivarMedioCaptacion($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El medio de captación se ha actualizado.";
            }
            else
            {
                $scope.medioCaptacionActualizar.Activo = !$scope.medioCaptacionActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeMedioCaptacion').modal('toggle');
        }).catch(function(error)
        {
            $scope.medioCaptacionActualizar.Activo = !$scope.medioCaptacionActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioCaptacion').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoMedioCaptacion = function()           
    {
        $scope.medioCaptacionActualizar.Activo = !$scope.medioCaptacionActualizar.Activo;
    };
    
    
    //-------------------- Otro -------------------------------------------------
    $scope.AbrirMedioCaptacionOtro = function()
    {
        $scope.medioCaptacionOtro = new MedioCaptacion();
        $scope.GetMedioCaptacionOtro();
        $('#medioCaptacionModalOtro').modal('toggle');
    };
    
    $scope.CambiarMedioCaptacion = function(medio)
    {
        if(medio == "Nuevo")
        {
            $scope.otroNuevo  = true;
            $scope.medioCaptacionOtro = new MedioCaptacion();
        }
        else
        {
            $scope.otroNuevo  =false;
            $scope.medioCaptacionOtro = medio;
        }
        
    };
    
    $scope.CerrarMedioCaptacionOtro = function()
    {
        $scope.claseOtro = {medio:"dropdownListModal"};
        $scope.mensajeError = [];
        $scope.medioCaptacionOtro = new MedioCaptacion();
        $scope.otroNuevo = false;
    };
    
    $scope.TerminarMedioCaptacionOtro = function(nombreInvalido)
    {
        if(!$scope.ValidarDatosOtroMedioCaptacion(nombreInvalido))
        {
            return;
        }
        else
        {
            $scope.medioCaptacionOtro.Otro = $scope.medioOtro;
            $scope.medioCaptacionOtro.Nuevo = $scope.otroNuevo;
            $scope.ActualizarMedioCaptacion();
        }
    };
    
    $scope.ActualizarMedioCaptacion = function()
    {
        console.log($scope.medioCaptacionOtro);
        ActualizarMedioCaptacion($http, CONFIG, $q, $scope.medioCaptacionOtro).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                //$('#medioCaptacionModalOtro').modal('toggle');
                $scope.mensaje = "El medio de captación se ha actualizado.";
                
                $scope.GetMedioCaptacionOtro();
                if($scope.otroNuevo)
                {
                    $scope.GetMedioCaptacion();
                }
                $scope.CerrarMedioCaptacionOtro();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeMedioCaptacion').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioCaptacion').modal('toggle');
        });
    };
    
    $scope.ValidarDatosOtroMedioCaptacion = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        if($scope.otroNuevo)
        {
            if(nombreInvalido)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            }
            else
            {
                for(var k=0; k<$scope.medioCaptacion.length; k++)
                {
                    if($scope.medioCaptacionOtro.Nombre.toLowerCase() == $scope.medioCaptacion[k].Nombre.toLowerCase())
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*El medio de captación " + $scope.medioCaptacionOtro.Nombre.toLowerCase() + " ya existe.";
                        $scope.claseMedioCaptacion.nombre = "entradaError";
                        return false;
                    }
                }
            }
        }
        else
        {
            if($scope.medioCaptacionOtro.Nombre.length == 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un medio de captación.";
                $scope.claseOtro.medio = "dropdownListModalError";
            }
            else
            {
                $scope.claseOtro.medio = "dropdownListModal";
            }
        }
        
        var seleccionado = false;
        for(var k=0; k<$scope.medioOtro.length; k++)
        {
            if($scope.medioOtro[k].Seleccionado)
            {
                seleccionado = true;
            }
        }
        if(!seleccionado)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona mínimo un medio de captación a actualizar.";
        }
        
        if($scope.mensajeError.length>0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    
    /*-------------------- Inicializar ----------------------- */
    $scope.GetMedioCaptacion();
});