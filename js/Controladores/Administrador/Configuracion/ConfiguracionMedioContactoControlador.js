app.controller("ConfiguaracionMedioContactoControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";

    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {
                            tipoMedioContacto:{consultar:false, agregar:false, editar:false, activar:false},
                            color:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConTMCConsultar")
            {
                $scope.permisoUsuario.tipoMedioContacto.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTMCAgregar")
            {
                $scope.permisoUsuario.tipoMedioContacto.agregar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTMCEditar")
            {
                $scope.permisoUsuario.tipoMedioContacto.editar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTMCActivar")
            {
                $scope.permisoUsuario.tipoMedioContacto.activar  = true;
            }
        }
    };
    
    $scope.titulo = "Tipo Medio Contacto";
    $scope.moduloActualizar = "";               //guarda el modulo con el que se estará trabajando (actualizar, agregar, editar)
    $scope.tabs = tabMedioContacto;                   //pestañas 
    $scope.mensajeError = [];                   //mensaje de errores en el momento de agregar o editar
    $scope.operacion = "";                      //Saber si se esta agregando o editando
    $scope.ordenarPorTipo = "NombreMedioContacto";
    
    $scope.tipoMedioContacto = [];
    $scope.medioContacto = [];
    
    $scope.nuevoTipoMedioContacto = new TipoMedioContacto();
    
    
    $scope.clase =  {
                        tipoMedioContacto:{nombre:"entrada", medioContacto:"dropdownListModal"}
                    };
    
    
    //Obtine los tipos de medio de contacto dados de alta
    $scope.GetTipoMedioContacto = function()              
    {
        GetTipoMedioContacto($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoMedioContacto = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //Obtiene los tipos de unidad de negocio dados de alta 
    $scope.GetMedioContacto = function()      
    {
        $scope.medioContacto = GetMedioContacto();   
    };
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#TipoMedioContacto').show();
                break;
            default:
                break;
        }        
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual se van a ordenar los tipos de material
    $scope.CambiarOrdenarTipoMedioContacto = function(campoOrdenar)
    {
        if($scope.ordenarPorTipo == campoOrdenar)
        {
            $scope.ordenarPorTipo = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorTipo = campoOrdenar;
        }
    };
    
    $scope.TipoMedioContactoValido = function(tipo)
    {
        return (parseInt(tipo.TipoMedioContactoId) > 0);
    };
     
    /*--------------Activar y desactivar empresa y tipo de unidad de negocio ------------------*/
    $scope.ActivarDesactivar = function(modulo, objeto) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.moduloActualizar = objeto;
        $scope.tipoModulo = modulo;
        
        if(objeto.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + objeto.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACRIVAR - " + objeto.Nombre + "?";
        }
        $('#modalActivarDesactivarConfigurarGeneral').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarModulo = function()  
    {
        var datos = [];
        if($scope.moduloActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        if($scope.tipoModulo == "tipoMedioContacto")
        {
            datos[1] = $scope.moduloActualizar.TipoMedioContactoId;
                
            ActivarDesactivarTipoMedioContacto($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El tipo de medio de contacto se ha actualizado.";
                }
                else
                {
                    $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                }
                $('#mensajeConfigurarGeneral').modal('toggle');
            }).catch(function(error)
            {
                $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarGeneral').modal('toggle');
            });
        }
    };
    
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivo = function()           
    {
        $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
    };
    
    /*---------------  Tipo de medio contacto ------------- */
    $scope.CambiarMedioContacto = function(medio)
    {
        $scope.nuevoTipoMedioContacto.NombreMedioContacto = medio.Nombre; 
        $scope.nuevoTipoMedioContacto.MedioContactoId = medio.MedioContactoId; 
    };
    
    $scope.ValidarTipoMedioContacto = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.clase.tipoMedioContacto.nombre = "entradaError";
        }
        else
        {
            $scope.clase.tipoMedioContacto.nombre = "entrada";
        }
        
        if($scope.nuevoTipoMedioContacto.NombreMedioContacto === "" || $scope.nuevoTipoMedioContacto.NombreMedioContacto === undefined)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un medio de contacto.";
            $scope.clase.tipoMedioContacto.medioContacto = "dropdownListModalError";
        }
        else
        {
            $scope.clase.tipoMedioContacto.medioContacto = "dropdownListModal";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.tipoMedioContacto.length; k++)
        {
            if($scope.tipoMedioContacto[k].MedioContactoId == $scope.nuevoTipoMedioContacto.MedioContactoId && $scope.tipoMedioContacto[k].Nombre.toLowerCase() == $scope.nuevoTipoMedioContacto.Nombre.toLowerCase() && $scope.tipoMedioContacto[k].TipoMedioContactoId != $scope.nuevoTipoMedioContacto.TipoMedioContactoId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El tipo medio contacto "  + $scope.tipoMedioContacto[k].NombreMedioContacto + " - " +  $scope.tipoMedioContacto[k].Nombre.toLowerCase() + " ya existe.";
                $scope.clase.tipoMedioContacto.nombre = "entradaError";
                break;
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    
    //Se editará o agregera un tipo de unidad de negocio
    $scope.TerminarTipoMedioContacto = function(nombreInvalido)       
    {
        
        if(!$scope.ValidarTipoMedioContacto(nombreInvalido))
        {
            return;
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarTipoMedioContacto();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarTipoMedioContacto();
        }
            
    };
    
    //agrega un tipo de unidad
    $scope.AgregarTipoMedioContacto = function()    
    {
        AgregarTipoMedioContacto($http, CONFIG, $q, $scope.nuevoTipoMedioContacto).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTipoMedioContacto();
                $('#tipoMedioContactoModal').modal('toggle');
                $scope.mensaje = "El tipo de medio de contacto se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConfigurarGeneral').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarGeneral').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarTipoMedioContacto = function()
    {
        EditarTipoMedioContacto($http, CONFIG, $q, $scope.nuevoTipoMedioContacto).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTipoMedioContacto();
                $('#tipoMedioContactoModal').modal('toggle');
                $scope.mensaje = "El tipo de medio de contacto se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeConfigurarGeneral').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarGeneral').modal('toggle');
        });
    };
    
    //abre el pandel para agregar-editar un tipo de contacto
    $scope.AbrirTipoMedioContacto = function(operacion, objeto)       /*abrir la forma de tipo de unidad para agregar o editar*/
    {
        if(operacion == "Editar")
        {
            $scope.nuevoTipoMedioContacto = SetTipoMedioContacto(objeto);
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoTipoMedioContacto =  new TipoMedioContacto();
            $scope.nuevoTipoMedioContacto.Activo = true;
        }
        
        $scope.operacion = operacion;
        $('#tipoMedioContactoModal').modal('toggle');
    };
    
    //cancelar agregar-editar tipo de unidad
    $scope.CerrarTipoMedioContactoModal = function()               //limpiar errores y clases de error cuando se salga de la forma de tipo de unidad
    {
        $scope.clase =  {
                            tipoMedioContacto:{nombre:"entrada", medioContacto:"dropdownListModal"}
                        };
        $scope.mensajeError = [];
    };
         
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.tipoMedioContacto.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado); 
                }
                else
                {
                    if($scope.permisoUsuario.tipoMedioContacto.consultar)
                    {
                        $scope.GetMedioContacto();
                        $scope.GetTipoMedioContacto();
                    }
                }
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
        else
        {
            $location.path('/Login');
        }
    }
    
    //Se manda a llamar cada ves que los datos del usuario cambian
    //verifica que el usuario este logeado y que tenga los permisos correspondientes
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $location.path('/Login');
            return;
        }
        else
        {
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.tipoMedioContacto.consultar)
                {
                    $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    if($scope.permisoUsuario.tipoMedioContacto.consultar)
                    {
                        $scope.GetMedioContacto();
                        $scope.GetTipoMedioContacto();
                    }
                }
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
    });

});

//Pestañas
var tabMedioContacto = 
    [
        {titulo:"Tipo Medio Contacto", referencia: "#General", clase:"active", area:"general"}
    ];