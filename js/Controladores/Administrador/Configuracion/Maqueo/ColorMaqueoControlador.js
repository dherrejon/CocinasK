app.controller("ColorMaqueoControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.grupo = [];
    $scope.color = [];
    $scope.nuevoGrupo = [];
    
    $scope.buscarGrupoColor = "";
    $scope.buscarColor = "";
    $scope.ordenarPorGrupoColor = "Nombre";

    $scope.mensajeError = [];
    
    $scope.grupoActualizar = null;
    $scope.colorModal = "";
        
    $scope.claseGrupoColor = {nombre:"entrada", color:"botonOperacion"};
    $scope.mostrarColor = {texto:"<<", mostrar:true};
    
    $scope.terminar = false;
    
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
    
    //Obtine los colores
    $scope.GetColor = function()              
    {
        GetColor($http, $q, CONFIG).then(function(data)
        {
            $scope.color = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual se van a ordenar los tipos de material
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenarPorGrupoColor == campoOrdenar)
        {
            $scope.ordenarPorGrupoColor = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorGrupoColor = campoOrdenar;
        }
    };
    
    /*------- Detalles ----------*/
    $scope.VerGrupoColor = function(grupo)
    {
        $scope.grupoActualizar = grupo;
    };
    
    $scope.VerColor = function(color)
    {
        $scope.colorModal = color;
    };
    
    /*-------------------Agregar Editar------------------------------*/
    //abre el pandel para agregar-editar un grupo de colores
    $scope.AbrirGrupoColor = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoGrupo = $scope.SetGrupo(objeto);
            $scope.ValidarColores(objeto.Color);
            
             $scope.mostrarColor = {texto:">>", mostrar:false};
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoGrupo =  new Grupo();
            
            $scope.nuevoGrupo.TipoGrupo.TipoGrupoId =  "2";
            $scope.nuevoGrupo.Color =  [];
            $scope.ValidarColores($scope.nuevoGrupo.Color);
            
            $scope.mostrarColor = {texto:"<<", mostrar:true};
        }
        
        $scope.operacion = operacion;
        $('#colorMaqueoModal').modal('toggle');
    };
    
    $scope.SetGrupo = function(data)
    {
        var grupo = new Grupo();
        
        grupo.GrupoId = data.GrupoId;
        grupo.Nombre = data.Nombre;
        grupo.Activo = data.Activo;
        
        grupo.TipoGrupo.TipoGrupoId = data.TipoGrupo.TipoGrupoId;
        grupo.TipoGrupo.Nombre = data.TipoGrupo.Nombre;
        
        grupo.Color = [];
        for(var k=0; k<data.Color.length; k++)
        {
            grupo.Color[k] = SetColor(data.Color[k]);
        }
        
        return grupo;
    };
    
    $scope.SetColor = function(data)
    {
        var nuevoColor = new Color();
        
        nuevoColor.ColorId = data.ColorId;
        nuevoColor.Nombre = data.Nombre;
        nuevoColor.Imagen = data.Imagen;
        nuevoColor.Activo = data.Activo;
        
        return nuevoColor;
    };
    
    $scope.ValidarColores = function(colores)
    {
        for(var k=0; k<$scope.color.length; k++)
        {
            $scope.color[k].show = true;
            for(var i=0; i<colores.length; i++)
            {
                if($scope.color[k].ColorId == colores[i].ColorId)
                {
                    $scope.color[k].show = false;
                    break;
                }
            }
        }
        
    };
    
    $scope.CambiarMostrarColor = function()
    {
        if($scope.mostrarColor.mostrar)
        {
            $scope.mostrarColor = {texto:">>", mostrar:false};
        }
        else
        {
            $scope.mostrarColor = {texto:"<<", mostrar:true};
        }
        
    };
    
    $scope.AgregarColor = function(color)
    {
        color.show = false;
        
        $scope.nuevoGrupo.Color.push(color);
    };
    
    $scope.QuitarColor = function(color)
    {
        for(var k=0; k<$scope.color.length; k++)
        {
            if($scope.color[k].ColorId == color.ColorId)
            {
                $scope.color[k].show = true;
                break;
            }
        }
        
        for(var k=0; k<$scope.nuevoGrupo.Color.length; k++)
        {
            if($scope.nuevoGrupo.Color[k].ColorId == color.ColorId)
            {
                $scope.nuevoGrupo.Color.splice(k,1);
                break;
            }
        }
    };
    
    $scope.ValidarDatos = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.claseGrupoColor.nombre = "entradaError";
        }
        else
        {
            $scope.claseGrupoColor.nombre = "entrada";
        }
        if($scope.nuevoGrupo.Color.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona mínimo un color.";
            $scope.claseGrupoColor.color = "botonOperacionError";
        }
        else
        {
            $scope.claseGrupoColor.color = "botonOperacion";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.grupo.length; k++)
        {
            if($scope.grupo[k].Nombre.toLowerCase() == $scope.nuevoGrupo.Nombre.toLowerCase() && $scope.grupo[k].GrupoId != $scope.nuevoGrupo.GrupoId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El muestrario de color " + $scope.nuevoGrupo.Nombre + " ya existe.";
                $scope.claseGrupoColor.nombre = "entradaError";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.TerminarColorCubierta = function(nombreInvalido)
    {
        $scope.terminar = true;
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            $scope.terminar = false;
            return;
        }
        
        if($scope.operacion == "Agregar")
        {
             $scope.AgregarMuestrarioColor();
        }
        else if($scope.operacion == "Editar")
        {
             $scope.EditarMuestrarioColor();
        }
    };
    
    //agrega un tipo de unidad
    $scope.AgregarMuestrarioColor = function()    
    {
        AgregarGrupoColorCubierta($http, CONFIG, $q, $scope.nuevoGrupo).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#colorMaqueoModal').modal('toggle');
                $scope.mensaje = "El muestrario de colores se ha agregado.";
                $scope.GetGrupoColor();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $scope.terminar = false;
            $('#mensajeConfigurarMaqueoColor').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.terminar = false;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarMaqueoColor').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarMuestrarioColor = function()
    {
        EditarGrupoColorCubierta($http, CONFIG, $q, $scope.nuevoGrupo).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#colorMaqueoModal').modal('toggle');
                $scope.mensaje = "El muestrario de colores se ha editado.";
                $scope.GetGrupoColor();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $scope.terminar = false;
            $('#mensajeConfigurarMaqueoColor').modal('toggle');
        }).catch(function(error)
        {
            $scope.terminar = false;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarMaqueoColor').modal('toggle');
        });
    };
    
    $scope.CerrarGrupoColorModal = function()
    {
        $scope.mensajeError = [];

        $scope.claseGrupoColor = {nombre:"entrada", color:"botonOperacion"};
        $scope.mostrarColor = {texto:"<<", mostrar:true};
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarGrupoColor = function(grupo) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.grupoActualizar = grupo;
        
        if(grupo.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + grupo.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + grupo.Nombre + "?";
        }
        $('#modalActivarDesactivarConfigurarMaqueoColor').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarGrupoColor = function()  
    {
        var datos = [];
        if($scope.grupoActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.grupoActualizar.GrupoId;

        ActivarDesactivarGrupo($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El grupo de color se ha actualizado.";
            }
            else
            {
                $scope.grupoActualizar.Activo = !$scope.grupoActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConfigurarMaqueoColor').modal('toggle');
        }).catch(function(error)
        {
            $scope.grupoActualizar.Activo = !$scope.grupoActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarMaqueoColor').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoGrupoColor = function()           
    {
        $scope.grupoActualizar.Activo = !$scope.grupoActualizar.Activo;
    };
    
    $scope.GetColor();
    $scope.GetGrupoColor();
});