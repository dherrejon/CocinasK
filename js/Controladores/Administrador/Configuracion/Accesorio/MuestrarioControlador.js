app.controller("MuestarioAccesorioControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.muestrario = []; 
    $scope.accesorioPorMuestrario = [];
    
    $scope.muestrarioActualizar = null;
    $scope.nuevoMuestrario = null;
    $scope.buscarMuestarioAccesorio = "";
    $scope.ordenarPorMuestarioAccesorio = "Nombre";
    
    $scope.claseMuestrario = {nombre:"entrada", margen:"entrada"};
    
    $scope.GetMuestrarioAccesorio = function()      
    {
        GetMuestrario($http, $q, CONFIG, 2).then(function(data)
        {
            $scope.muestrario = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //cambia el orden
    $scope.CambiarOrdenarMuestrarioAccesorio = function(campoOrdenar)
    {
        if($scope.ordenarPorMuestarioAccesorio == campoOrdenar)
        {
            $scope.ordenarPorMuestarioAccesorio = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorMuestarioAccesorio = campoOrdenar;
        }
    };
    
    $scope.GetAccesorioPorMuestrario = function(muestrarioId)      
    {
        GetAccesorioPorMuestrario($http, $q, CONFIG, muestrarioId).then(function(data)
        {
            $scope.accesorioPorMuestrario = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------------ Detalles ----------------*/
    $scope.AbrirDetallesMuestrario = function(muestrario)
    {
        $scope.muestrarioActualizar = muestrario;
        
        $scope.GetAccesorioPorMuestrario(muestrario.MuestrarioId);
        
        $('#DetallesMuestrarioAccesorio').modal('toggle');
    };
    
    /*-------------------Abrir - Editar  Muestrario -----------*/
    $scope.AbrirMuestrarioModal = function(operacion, muestrario)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoMuestrario = new Muestrario();
            $scope.nuevoMuestrario.TipoMuestrarioId = "2";
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoMuestrario = SetMuestrario(muestrario);
        }
        
        $('#muestrarioAccesorioModal').modal('toggle');
    };
    
    /*-------------- Terminar Muestrario Accesorios --------------*/
    $scope.TerminarMuestrarioAccesorio = function(nombreInvalido, margenInvalido)
    {        
        if(!$scope.ValidarDatos(nombreInvalido, margenInvalido))
        {
            return;
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarMuestrarioAccesorio();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarMuestrarioAccesorio();
        }      
    };
    
    $scope.AgregarMuestrarioAccesorio = function()
    {
        AgregarMuestrario($http, CONFIG, $q, $scope.nuevoMuestrario).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#muestrarioAccesorioModal').modal('toggle');
                $scope.mensaje = "El muestrario se ha agregado.";
                $scope.GetMuestrarioAccesorio();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            $('#mensajeMuestrarioAccesorio').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeMuestrarioAccesorio').modal('toggle');
        });
    };
    
    $scope.EditarMuestrarioAccesorio = function()
    {
        EditarMuestrario($http, CONFIG, $q, $scope.nuevoMuestrario).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetMuestrarioAccesorio();
                $scope.mensaje = "El muestrario se ha editado.";
                $('#muestrarioAccesorioModal').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            $('#mensajeMuestrarioAccesorio').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeMuestrarioAccesorio').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido, margenInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";   
            $scope.claseMuestrario.nombre = "entradaError";
        }
        else
        {
            $scope.claseMuestrario.nombre = "entrada";
        }
        
        if(margenInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El margen se debe de indicar con un número decial.";   
            $scope.claseMuestrario.margen = "entradaError";
        }
        else
        {
            $scope.claseMuestrario.margen = "entrada";
        }
         
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.muestrario.length; k++)
        {
            if($scope.nuevoMuestrario.Nombre.toLowerCase() == $scope.muestrario[k].Nombre.toLowerCase() && $scope.nuevoMuestrario.MuestrarioId != $scope.muestrario[k].MuestrarioId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "El muestario " + $scope.nuevoMuestrario.Nombre.toLowerCase() + " ya existe.";
                $scope.claseMuestrario.nombre = "entradaError";
                return false;
            }
        }
        
        return true;
    };
    
    /*---------------------- Cambiar Activo -------------*/
    $scope.CambiarEstatusActivo = function(objeto)
    {
        $scope.muestrarioActualizar = objeto;
        
        if(objeto.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + objeto.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + objeto.Nombre + "?";
        }
        
        $('#modalActivarDesactivarMuestrarioAccesorio').modal('toggle');
    };
    
    $scope.CancelarCambiarActivo = function()
    {
        $scope.muestrarioActualizar.Activo = !$scope.muestrarioActualizar.Activo;
    };
    
    $scope.ConfirmarActualizarActivo = function()
    {
        var datos = [];
        
        if($scope.muestrarioActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;  
        }
        
        datos[1] = $scope.muestrarioActualizar.MuestrarioId;
        
    
        ActivarDesactivarMuestrario($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El muestrario se ha actualizado correctamente.";
            }
            else
            {
                $scope.muestrarioActualizar.Activo = !$scope.muestrarioActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            } 
            $('#mensajeMuestrarioAccesorio').modal('toggle');
        }).catch(function(error)
        {
            $scope.muestrarioActualizar.Activo = !$scope.muestrarioActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMuestrarioAccesorio').modal('toggle');
        });
        
    };
    
    
    /*------------------ Inicializar --------------------*/
    $scope.GetMuestrarioAccesorio();
});