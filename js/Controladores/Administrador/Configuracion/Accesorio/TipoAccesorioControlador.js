app.controller("TipoAccesorioControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.tipoAccesorio = [];
    $scope.claseAccesorio = [];
    
    $scope.tipoAccesorioActualizar = null;
    $scope.nuevoTipoAccesorio = null;
    $scope.buscarTipoAccesorio = "";
    $scope.ordenarPorTipoAccesorio = "Nombre";
    
    $scope.instrucciones = [];
    $scope.archivoSeleccionado = false;
    
    $scope.claseTipoAccesorio = {clase:"dropdownListModal", nombre:"entrada"};


    $scope.mensajeError = [];
    
    $scope.GetTipoAccesorio = function()              
    {
        GetTipoAccesorio($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoAccesorio = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetClaseAccesorio = function()
    {
        $scope.claseAccesorio = GetClaseAccesorio();
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual
    $scope.CambiarOrdenarTipoAccesorio = function(campoOrdenar)
    {
        if($scope.ordenarPorTipoAccesorio == campoOrdenar)
        {
            $scope.ordenarPorTipoAccesorio = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorTipoAccesorio = campoOrdenar;
        }
    };
    
    /*----------- Abrir modal para editar-agregar----------------------*/
    $scope.AbrirTipoAccesorio = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoTipoAccesorio = $scope.SetTipoAccesorio(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoTipoAccesorio =  new TipoAccesorio();
            
            $scope.CambiarClaseAccesorio($scope.claseAccesorio[0]);
        }
        
        $scope.operacion = operacion;
        $('#tipoAccesorioModal').modal('toggle');
    };
    
    $scope.SetTipoAccesorio = function(data)
    {
        var tipoAccesorio = new TipoAccesorio();
        
        tipoAccesorio.TipoAccesorioId = data.TipoAccesorioId;
        tipoAccesorio.Nombre = data.Nombre;
        tipoAccesorio.Instrucciones = data.Instrucciones;
        tipoAccesorio.Activo = data.Activo;
        tipoAccesorio.NombreArchivo = data.NombreArchivo;
        tipoAccesorio.Obligatorio = data.Obligatorio;
        tipoAccesorio.Contable = data.Contable;
        
        tipoAccesorio.ClaseAccesorio.ClaseAccesorioId = data.ClaseAccesorio.ClaseAccesorioId ;
        tipoAccesorio.ClaseAccesorio.Nombre = data.ClaseAccesorio.Nombre ;
        
        return tipoAccesorio;
    };
    
    
    $scope.CambiarClaseAccesorio = function(clase)
    {
        $scope.nuevoTipoAccesorio.ClaseAccesorio = clase;
    };
    
    /*------------- Terminar tipo accesorio ----------------------*/
    $scope.TerminarTipoAccesorio = function(nombreInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            return;
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarTipoAccesorio();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarTipoAccesorio();
        }
            
    };
    
    $scope.AgregarTipoAccesorio = function()    
    {
        AgregarTipoAccesorio($http, CONFIG, $q, $scope.nuevoTipoAccesorio).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#tipoAccesorioModal').modal('toggle');
                $scope.mensaje = "El tipo de accesorio se ha agregado.";
                
                if($scope.archivoSeleccionado)
                {
                    $scope.GuardarInstrucciones(data[1].TipoAccesorioId);
                }
                else
                {
                    $scope.GetTipoAccesorio();
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeTipoAccesorio').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeTipoAccesorio').modal('toggle');
        });
    };
    
    $scope.EditarTipoAccesorio = function()
    {
        EditarTipoAccesorio($http, CONFIG, $q, $scope.nuevoTipoAccesorio).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#tipoAccesorioModal').modal('toggle');
                $scope.mensaje = "El tipo de accesorio se ha editado.";
                
                if($scope.archivoSeleccionado)
                {
                    $scope.GuardarInstrucciones($scope.nuevoTipoAccesorio.TipoAccesorioId);
                }
                else
                {
                    $scope.GetTipoAccesorio();
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeTipoAccesorio').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeTipoAccesorio').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.claseTipoAccesorio.nombre = "entradaError";
        }
        else
        {
            $scope.claseTipoAccesorio.nombre = "entrada";
        }
        
        if($scope.nuevoTipoAccesorio.ClaseAccesorio.Nombre.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una clase de accesorio.";
            $scope.claseTipoAccesorio.clase = "dropdownListModalError";
        }
        else
        {
            $scope.claseTipoAccesorio.clase = "dropdownListModal";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.tipoAccesorio.length; k++)
        {
            if($scope.nuevoTipoAccesorio.Nombre.toLowerCase() == $scope.tipoAccesorio[k].Nombre.toLowerCase()  && $scope.nuevoTipoAccesorio.TipoAccesorioId != $scope.tipoAccesorio[k].TipoAccesorioId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "El tipo de accesorio " + $scope.nuevoTipoAccesorio.Nombre.toLowerCase() + " ya existe.";
                $scope.claseTipoAccesorio.nombre = "entradaError";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarTipoAccesorio = function()
    {
        $scope.mensajeError = [];
        $scope.claseTipoAccesorio = {clase:"dropdownListModal", nombre:"entrada"};
    };
    
    $scope.LimpiarArchivoIntrucciones = function()
    {
        $scope.instrucciones = [];
        $scope.archivoSeleccionado = false;
        $scope.CerrarTipoAccesorio();
    };
    /*-------------- Activar y desactivar tipo accesorio ------------------*/
    $scope.ActivarDesactivarTipoAccesorio = function(tipo) 
    {
        $scope.tipoAccesorioActualizar = tipo;
        
        if(tipo.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + tipo.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + tipo.Nombre + "?";
        }
        
        $('#modalActivarDesactivarTipoAccesorio').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarTipoAccesorio = function()  
    {
        var datos = [];
        if($scope.tipoAccesorioActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.tipoAccesorioActualizar.TipoAccesorioId;

        ActivarDesactivarTipoAccesorio($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El tipo de accesorio se ha actualizado.";
            }
            else
            {
                $scope.tipoAccesorioActualizar.Activo = !$scope.tipoAccesorioActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeTipoAccesorio').modal('toggle');
        }).catch(function(error)
        {
            $scope.tipoAccesorioActualizar.Activo = !$scope.tipoAccesorioActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeTipoAccesorio').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoTipoAccesorio = function()           
    {
        $scope.tipoAccesorioActualizar.Activo = !$scope.tipoAccesorioActualizar.Activo;
    };
    
    /*-------Archivo-------*/
    $scope.CargarInstrucciones = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.instrucciones[0] = element.files[0];
            $scope.archivoSeleccionado = true; 
        });
    };
    
    $scope.GuardarInstrucciones = function(tipoId) 
    {
        GuardarInstrucciones($http, $q, CONFIG, $scope.instrucciones, tipoId).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.GetTipoAccesorio();
            }
        }).catch(function(error)
        {
            $scope.GetTipoAccesorio();
            alert("No se pudieron guardar las instrucciones.");
        });
        
        $scope.archivoSeleccionado = false;
        $scope.instrucciones = [];
    };
    
    $scope.DescargarIntrucciones = function(tipo)
    {
        var url = 'data:application/pdf;base64,' + tipo.Instrucciones;
        window.open(url);
    };
    
    /*-------------------- Inicializar ----------------------- */
    $scope.GetTipoAccesorio();
    $scope.GetClaseAccesorio();
});