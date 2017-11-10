app.controller("ColorControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.color = [];
    $scope.imagen = [];
    $scope.buscarColor = "";
    $scope.ordenarPor = "Nombre";
    $scope.nuevoColor = null;
    $scope.imagenSeleccionada = false;
    
    $scope.claseColor = {nombre:"entrada"};
    $scope.mensajeError = [];
    
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
        if($scope.ordenarPor == campoOrdenar)
        {
            $scope.ordenarPor = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPor = campoOrdenar;
        }
    };
    
    /*-------------------Agregar Editar------------------------------*/
    //abre el pandel para agregar-editar un tipo de contacto
    $scope.AbrirColor = function(operacion, objeto)       /*abrir la forma de tipo de unidad para agregar o editar*/
    {
        if(operacion == "Editar")
        {
            $scope.nuevoColor = $scope.SetColor(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoColor =  new Color();
        }
        
        $scope.operacion = operacion;
        $('#colorModal').modal('toggle');
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
    
    $scope.TerminarColor = function(nombreInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            return;
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarColor();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarColor();
        }
    };
    
    //agrega un tipo de unidad
    $scope.AgregarColor = function()    
    {
        AgregarColor($http, CONFIG, $q, $scope.nuevoColor).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $('#colorModal').modal('toggle');
                $scope.mensaje = "El color se ha agregado.";
                
                if($scope.imagenSeleccionada)
                {
                    $scope.GuardarImagenColor(data[1].ColorId);
                }
                else
                {
                    $scope.GetColor();
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConfigurarGeneralColor').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarGeneralColor').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarColor = function()
    {
        EditarColor($http, CONFIG, $q, $scope.nuevoColor).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#colorModal').modal('toggle');
                $scope.mensaje = "El color se ha editado.";
                
                if($scope.imagenSeleccionada)
                {
                    $scope.GuardarImagenColor($scope.nuevoColor.ColorId);
                }
                else
                {
                    $scope.GetColor();
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeConfigurarGeneralColor').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarGeneralColor').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.claseColor.nombre = "entradaError";
        }
        else
        {
            $scope.claseColor.nombre = "entrada";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.color.length; k++)
        {
            if($scope.color[k].Nombre.toLowerCase() == $scope.nuevoColor.Nombre.toLowerCase() && $scope.color[k].ColorId != $scope.nuevoColor.ColorId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El color " + $scope.color[k].Nombre + "ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CerrarColorModal = function()
    {
        $scope.claseColor = {nombre:"entrada"};
        $scope.mensajeError = [];
    };
    
    $scope.LimpiarImagen = function()
    {
        $scope.imagen = [];
        $scope.imagenSeleccionada = false;
        $scope.CerrarColorModal();
    };
    
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.ActivarDesactivarColor = function(color) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.colorActualizar = color;
        
        if(color.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + color.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + color.Nombre + "?";
        }
        $('#modalActivarDesactivarConfigurarGeneralColor').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarColor = function()  
    {
        var datos = [];
        if($scope.colorActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.colorActualizar.ColorId;

        ActivarDesactivarColor($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El color de contacto se ha actualizado.";
            }
            else
            {
                $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConfigurarGeneralColor').modal('toggle');
        }).catch(function(error)
        {
            $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarGeneral').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoColor = function()           
    {
        $scope.colorActualizar.Activo = !$scope.colorActualizar.Activo;
    };
    
    //----------------- Ver imagen del color--------
    $scope.VerColor = function(color)
    {
        $scope.nuevoColor = color;
    };
    
    /*-------Imagen-------*/
    $scope.CargarImagenColor = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.imagen[0] = element.files[0];
            $scope.imagenSeleccionada = true; 
        });
    };
    
    $scope.GuardarImagenColor = function(colorId) 
    {
        GuardarImagenColor($http, $q, CONFIG, $scope.imagen ,colorId).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.GetColor();
            }
        }).catch(function(error)
        {
            $scope.GetColor();
            alert("No se pudo guardar la imagen del módulo");
        });
        
        $scope.imagenSeleccionada = false;
        $scope.imagen = [];
    };
    
    function ImagenSeleccionada(evt) 
    {
        var files = evt.target.files;

        for (var i = 0, f; f = files[i]; i++) 
        {
            if (!f.type.match('image.*')) 
            {
                continue;
            }

            var reader = new FileReader();

            reader.onload = (function(theFile) 
            {
                return function(e) 
                {
                    document.getElementById("PrevisualizarImagenColor").innerHTML = ['<img class="imagenModulo center-block" src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('');
                    document.getElementById("PrevisualizarImagenColorDetalles").innerHTML = ['<img class=" center-block img-responsive" src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('');
                };
            })(f);

            reader.readAsDataURL(f);
        }
    }
 
    document.getElementById('cargarImagen').addEventListener('change', ImagenSeleccionada, false);
    
    $scope.GetColor();
});