app.controller("FabricacionCubiertaControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.fabricacion = [];
    $scope.consumible = [];

    $scope.buscarFabricacion = "";
    $scope.buscarConsumible = "";
    $scope.ordenarPorFabricacion = "Nombre";

    $scope.mensajeError = [];
    
    $scope.fabricacionActualizar = null;
    $scope.nuevaFabricacion = null;
        
    $scope.claseFabricacion = {nombre:"entrada", consumible:"botonOperacion"};
    $scope.mostrarConsumible = {texto:"<<", mostrar:true};
    
    //Obtine los colores
    $scope.GetFabricacionCubierta = function()              
    {
        GetFabricacionCubierta($http, $q, CONFIG, 1).then(function(data)
        {
            $scope.fabricacion = data;
            
            for(var k=0; k<data.length; k++)
            {
                $scope.GetConsumiblePorFabricacion(data[k].FabricacionCubiertaId, k);
            }

        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetConsumiblePorFabricacion = function(id, index)
    {
        GetConsumiblePorFabricacion($http, $q, CONFIG, id).then(function(data)
        {
            $scope.fabricacion[index].Consumible = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetConsumible = function()      
    {
        GetConsumible($http, $q, CONFIG).then(function(data)
        {
            $scope.consumible = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    $scope.CambiarOrdenarFabricacion = function(campoOrdenar)
    {
        if($scope.ordenarPorFabricacion == campoOrdenar)
        {
            $scope.ordenarPorFabricacion = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorFabricacion = campoOrdenar;
        }
    };
    
    /*---------- Detalles ----------------*/
    $scope.DetallesFabricion = function(fabricacion)
    {
        $scope.fabricacionActualizar = fabricacion;
    };
    /*------------------Agregar - Editar Fabricación -----------------*/
    $scope.AbrirFabricacionCubierta = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevaFabricacion = $scope.SetFabricacion(objeto);
            $scope.ValidarConsumibles(objeto.Consumible);
            
             $scope.mostrarConsumible = {texto:">>", mostrar:false};
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevaFabricacion =  new FabricacionCubierta();
            
            $scope.nuevaFabricacion.Consumible =  [];
            $scope.ValidarConsumibles($scope.nuevaFabricacion.Consumible);
            
            $scope.mostrarConsumible = {texto:"<<", mostrar:true};
        }
        
        $scope.operacion = operacion;
        $('#fabricacionCubiertaModal').modal('toggle');
    };
    
    $scope.AgregarConsumible = function(consumible)
    {
        $scope.nuevaFabricacion.Consumible.push(consumible);
        $scope.nuevaFabricacion.Consumible[$scope.nuevaFabricacion.Consumible.length-1].Cantidad = 1;
        
        consumible.mostrar = false;
    };
    
    $scope.QuitarConsumible = function(consumible)
    {
        for(var k=0; k<$scope.nuevaFabricacion.Consumible.length; k++)
        {
            if($scope.nuevaFabricacion.Consumible[k].ConsumibleId == consumible.ConsumibleId)
            {
                $scope.nuevaFabricacion.Consumible.splice(k,1);
                break;
            }
        }
        
        for(var k=0; k<$scope.consumible.length; k++)
        {
            if($scope.consumible[k].ConsumibleId == consumible.ConsumibleId)
            {
                $scope.consumible[k].mostrar = true;
                break;
            }
        }
    };
    
    $scope.AgregarCantidadConsumible = function(consumible)
    {
        consumible.Cantidad++;
    };
    
    $scope.RemoverCantidadCosumible = function(consumible)
    {
        if((consumible.Cantidad-1) > 0)
        {
            consumible.Cantidad--;
        }
    };
    
    $scope.ValidarConsumibles = function(consumibles)
    {
        for(var i=0; i<$scope.consumible.length; i++)
        {
            $scope.consumible[i].mostrar = true;
            for(var j=0; j<consumibles.length; j++)
            {
                if($scope.consumible[i].ConsumibleId == consumibles[j].ConsumibleId)
                {
                    $scope.consumible[i].mostrar = false;
                    break;
                }
            }
        }
    };
    
    $scope.SetFabricacion = function(data)
    {
        var fabricacion = new FabricacionCubierta();
        
        fabricacion.FabricacionCubiertaId = data.FabricacionCubiertaId;
        fabricacion.Nombre = data.Nombre;
        fabricacion.Activo = data.Activo;
        
        fabricacion.Consumible = [];
        for(var k=0; k<data.Consumible.length; k++)
        {
            fabricacion.Consumible[k] = $scope.SetConsumible(data.Consumible[k]);
        }
        
        return fabricacion;
    };
    
    $scope.SetConsumible = function(data)
    {
        var consumible = new Consumible();
        
        consumible.ConsumibleId = data.ConsumibleId;
        consumible.Nombre = data.Nombre;
        consumible.Costo = data.Costo;
        consumible.Cantidad = data.Cantidad;
        consumible.Activo = data.Activo;
        
        return consumible;
    };
    
    $scope.CambiarMostrarConsumible = function()
    {
        $scope.mostrarConsumible.mostrar = !$scope.mostrarConsumible.mostrar;
        
        if($scope.mostrarConsumible.mostrar)
        {
            $scope.mostrarConsumible.texto = "<<";
        }
        else
        {
            $scope.mostrarConsumible.texto = ">>";
        }
    };
    
    /*-------------- Terminar fabriación de cubierta---------------*/
    $scope.TerminarFabricacionCubierta = function(nombreInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            return;
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarFabricacionCubierta();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarFabricacionCubierta();
        }
    };
    
    $scope.AgregarFabricacionCubierta = function()    
    {
        AgregarFabricacionCubierta($http, CONFIG, $q, $scope.nuevaFabricacion).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#fabricacionCubiertaModal').modal('toggle');
                $scope.mensaje = "La fabricación de cubierta se ha agregado.";
                $scope.GetFabricacionCubierta();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConfigurarCubiertaFabricacion').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarCubiertaFabricacion').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarFabricacionCubierta = function()
    {
        EditarFabricacionCubierta($http, CONFIG, $q, $scope.nuevaFabricacion).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#fabricacionCubiertaModal').modal('toggle');
                $scope.mensaje = "La fabricación de cubiertase se ha editado.";
                $scope.GetFabricacionCubierta();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeConfigurarCubiertaFabricacion').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarCubiertaFabricacion').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.claseFabricacion.nombre = "entradaError";
        }
        else
        {
            $scope.claseFabricacion.nombre = "entrada";
        }
        if($scope.nuevaFabricacion.Consumible.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona mínimo un consumible.";
            $scope.claseFabricacion.consumible = "botonOperacionError";
        }
        else
        {
            $scope.claseFabricacion.consumible = "botonOperacion";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.fabricacion.length; k++)
        {
            if($scope.fabricacion[k].Nombre.toLowerCase() == $scope.nuevaFabricacion.Nombre.toLowerCase() && $scope.fabricacion[k].FabricacionCubiertaId != $scope.nuevaFabricacion.FabricacionCubiertaId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*La fabricación de cubiertas " + $scope.nuevaFabricacion.Nombre + " ya existe.";
                $scope.claseFabricacion.nombre = "entradaError";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarFabricacionCubiertar = function()
    {
        $scope.claseFabricacion = {nombre:"entrada", consumible:"botonOperacion"};
        $scope.mensajeError = [];
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarFabricacionCubierta = function(fabricacion) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.fabricacionActualizar = fabricacion;
        
        if(fabricacion.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + fabricacion.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + fabricacion.Nombre + "?";
        }
        $('#modalActivarDesactivarConfigurarCubiertaFabricacion').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarFabricacionCubierta = function()  
    {
        var datos = [];
        if($scope.fabricacionActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.fabricacionActualizar.FabricacionCubiertaId;

        ActivarDesactivarFabricacionCubierta($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "La fabricación de cubierta se ha actualizado.";
            }
            else
            {
                $scope.fabricacionActualizar.Activo = !$scope.fabricacionActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConfigurarCubiertaFabricacion').modal('toggle');
        }).catch(function(error)
        {
            $scope.fabricacionActualizar.Activo = !$scope.fabricacionActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarCubiertaFabricacion').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoFabricacionCubierta = function()           
    {
        $scope.fabricacionActualizar.Activo = !$scope.fabricacionActualizar.Activo;
    };
    
    $scope.GetFabricacionCubierta();
    $scope.GetConsumible();
});