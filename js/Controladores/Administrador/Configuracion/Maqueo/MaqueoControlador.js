app.controller("MaqueoControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.maqueo = [];
    $scope.grupo = [];
    
    $scope.ordenarMaqueo = "Nombre";
    $scope.buscarMaqueo = "";
    
    $scope.maqueoActualizar = null;
    $scope.nuevoMaqueo = null;
    $scope.grupoDetalle = null;
    $scope.colorModal = null;
    
    $scope.claseMaqueo = {nombre:"entrada", grupo:"dropdownListModal", costo:"entrada", precio:"entrada", color:"botonOperacion"};
    $scope.mensajeError = [];
    $scope.mostrarColorMaqueo = {texto:">>", mostrar:false};
    $scope.buscarGrupoMaqueo = "";
    
    $scope.terminar = false;
    

    $scope.GetMaqueo = function()      
    {
        GetMaqueo($http, $q, CONFIG).then(function(data)
        {
            $scope.maqueo = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetColorGrupoMaqueo = function(id)
    {
        GetGrupoPorColor($http, $q, CONFIG, id).then(function(data)
        {
            $scope.grupoDetalle.Color = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*-----------Otros Catálogos ---------------------*/
    //Obtine los colores
    $scope.GetGrupoColor = function()              
    {
        GetGrupo($http, $q, CONFIG, 2).then(function(data)
        {
            $scope.grupo = data;
            
            for(var k=0; k<data.length; k++)
            {
                $scope.GetColorGrupo(data[k].GrupoId, k);
            }
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetColorGrupo = function(id, index)
    {
        GetGrupoPorColor($http, $q, CONFIG, id).then(function(data)
        {
            $scope.grupo[index].Color = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual
    $scope.CambiarOrdenarMaqueo = function(campoOrdenar)
    {
        if($scope.ordenarMaqueo == campoOrdenar)
        {
            $scope.ordenarMaqueo = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarMaqueo = campoOrdenar;
        }
    };
    
    /*-------- Detalles ----------------*/
    $scope.VerGrupoColorMaqueo = function(grupo)
    {
        $scope.grupoDetalle = grupo;
        $scope.GetColorGrupoMaqueo(grupo.GrupoId);
        
    };
    
    $scope.VerGrupoColorMaqueo2 = function(grupo)
    {
        $scope.grupoDetalle = grupo;
    };
    
    $scope.VerColorMaqueo = function(color)
    {
        $scope.colorModal = color;
    };
    
    /*-------------------Agregar Editar------------------------------*/
    //abre el pandel para agregar-editar un servicio
    $scope.AbrirServicio = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoMaqueo = $scope.SetMaqueo(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoMaqueo =  new Maqueo();
        }
        
        $scope.operacion = operacion;
        $('#maqueoModal').modal('toggle');
    };
    
    $scope.SetMaqueo = function(data)
    {
        var maqueo = new Maqueo();
        
        maqueo.MaqueoId = data.MaqueoId;
        maqueo.Nombre = data.Nombre;
        maqueo.CostoUnidad = data.CostoUnidad;
        maqueo.PrecioVenta = data.PrecioVenta;
        maqueo.PorDefecto = data.PorDefecto;
        maqueo.Activo = data.Activo;
        
        maqueo.Grupo.GrupoId = data.Grupo.GrupoId;
        maqueo.Grupo.Nombre = data.Grupo.Nombre;
        
        return maqueo;
    };
    
    $scope.CambiarMostrarColorMaqueo = function()
    {
        $scope.mostrarColorMaqueo.mostrar = !$scope.mostrarColorMaqueo.mostrar;
        if($scope.mostrarColorMaqueo.mostrar)
        {
            $scope.mostrarColorMaqueo.texto = "<<";
        }
        else
        {
            $scope.mostrarColorMaqueo.texto = ">>";
        }
    };
    
    $scope.SeleccionarGrupo = function(grupo)
    {
        $scope.nuevoMaqueo.Grupo = grupo; 
        $scope.mostrarColorMaqueo.mostrar = false;
        $scope.mostrarColorMaqueo.texto = ">>";
    };
    
    /*------------------Terminar Servicio ----------------------*/
    $scope.TerminarMaqueo = function(nombreInvalido, costoInvalido, precioInvalido)
    {
        $scope.terminar = true;
        
        if(!$scope.ValidarDatos(nombreInvalido, costoInvalido, precioInvalido))
        {
            $scope.terminar = false;
            return;
        }
        else
        {
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarMaqueo();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarMaqueo();
            }
        }
    };
    
    $scope.AgregarMaqueo = function()    
    {
        AgregarMaqueo($http, CONFIG, $q, $scope.nuevoMaqueo).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#maqueoModal').modal('toggle');
                $scope.mensaje = "El maqueo se ha agregado.";
                $scope.GetMaqueo();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeMaqueo').modal('toggle');
            $scope.terminar = false;
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMaqueo').modal('toggle');
            $scope.terminar = false;
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarMaqueo = function()
    {
        EditarMaqueo($http, CONFIG, $q, $scope.nuevoMaqueo).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#maqueoModal').modal('toggle');
                $scope.mensaje = "El maqueo se ha editado.";
                $scope.GetMaqueo();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $scope.terminar = false;
            $('#mensajeMaqueo').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $scope.terminar = false;
            $('#mensajeMaqueo').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido, costoInvalido, precioInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.claseMaqueo.nombre = "entradaError";
        }
        else
        {
            $scope.claseMaqueo.nombre = "entrada";
        }
        
        if($scope.nuevoMaqueo.Grupo.Nombre.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un grupo de colores.";
            $scope.claseMaqueo.color = "botonOperacionError";
        }
        else
        {
            $scope.claseMaqueo.color = "botonOperacion";
        }
        
        if(costoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El costo por unidad debe ser un número decimal.";
            $scope.claseMaqueo.costo = "entradaError";
        }
        else
        {
            $scope.claseMaqueo.costo = "entrada";
        }
        if(precioInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El precio de venta debe ser un número decimal.";
            $scope.claseMaqueo.precio = "entradaError";
        }
        else
        {
            $scope.claseMaqueo.precio = "entrada";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k = 0; k<$scope.maqueo.length; k++)
        {
            if($scope.maqueo[k].Nombre.toLowerCase() == $scope.nuevoMaqueo.Nombre.toLowerCase() && $scope.maqueo[k].MaqueoId != $scope.nuevoMaqueo.MaqueoId)
            {
                $scope.claseMaqueo.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "*El maqueo " + $scope.nuevoMaqueo.Nombre.toLowerCase() + " ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarMaqueoForma = function()
    {
        $scope.claseMaqueo = {nombre:"entrada", grupo:"dropdownListModal", costo:"entrada", precio:"entrada", color:"botonOperacion"};
        $scope.mensajeError = [];
        $scope.mostrarColorMaqueo = {texto:">>", mostrar:false};
    };
    
    /*-------------- Activar y desactivar maqueo ------------------*/
    $scope.ActivarDesactivarMaqueo = function(maqueo) 
    {
        $scope.maqueoActualizar = maqueo;
        
        if(maqueo.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + maqueo.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACRIVAR - " + maqueo.Nombre + "?";
        }
        $('#modalActivarDesactivarMaqueo').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarMaqueo = function()  
    {
        var datos = [];
        if($scope.maqueoActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.maqueoActualizar.MaqueoId;
        
        ActivarDesactivarMaqueo($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El maqueo se ha actualizado.";
            }
            else
            {
                $scope.maqueoActualizar.Activo = !$scope.maqueoActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeMaqueo').modal('toggle');
        }).catch(function(error)
        {
            $scope.maqueoActualizar.Activo = !$scope.maqueoActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMaqueo').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoMaqueo = function()           
    {
        $scope.maqueoActualizar.Activo = !$scope.maqueoActualizar.Activo;
    };
    
    /*-------------------- Inicializar ----------------------- */
    $scope.GetMaqueo();
    
    
    $rootScope.InicializarMaqueo = function()
    {
        $scope.GetGrupoColor();
    };
    
    $rootScope.InicializarMaqueo();
});