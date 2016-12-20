app.controller("UsuarioPerfilControlador", function($scope, $http, $q, CONFIG, datosUsuarioPerfil, $rootScope, $window, md5, datosUsuario)
{   
    $rootScope.clasePrincipal = "";
    
    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false, editar: false, activar:false, restaurarPassword: false, verPermisos:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmUsuPerfil")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUsuActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
            if($scope.usuarioLogeado.Permiso[k] == "AdmUsuEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUsuRestaurarPassword")
            {
                $scope.permisoUsuario.restaurarPassword = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUsuPermisos")
            {
                $scope.permisoUsuario.verPermisos = true;
            }
        }
    };
    
    $scope.usuarioPerfil = datosUsuarioPerfil.getUsuario();
    $scope.usuarioContacto = datosUsuarioPerfil.getContacto();
    $scope.perfilUsuario = datosUsuarioPerfil.getPerfil();
    
    $scope.colaborador = null;
    $scope.permiso = null;
    
    $scope.tabs = tabPerfilUsuario;
    $scope.titulo = "Datos";
    
    if($scope.usuarioPerfil === null)
    {
        $window.location = "#Colaborador";
    }
    
    //Obtiene los datos del perfil del usuario seleccionado
    $rootScope.$on('cambioUsuarioPerfil',function()          
    {
        $scope.usuarioPerfil = datosUsuarioPerfil.getUsuario();
        $scope.usuarioContacto = datosUsuarioPerfil.getContacto();
        $scope.perfilUsuario = datosUsuarioPerfil.getPerfil();
    });
    
    /*-------control de pestañas---------*/
    $scope.SeleccionarTab = function(tab, index)    //Cambia el contenido de la pestaña
    {
        if(tab.enable)
        {
            $scope.titulo = tab.titulo;

            switch (index)
            {
                case 0:  
                    $('#Datos').show();
                    $('#Citas').hide();
                    $('#Bitacora').hide();
                    break;
                case 1:
                    $('#Citas').show();
                    $('#Datos').hide();
                    $('#Bitacora').hide();
                    break;
                case 2:
                    $('#Bitacora').show();
                    $('#Citas').hide();
                    $('#Datos').hide();
                    break;
                default:
                    break;
            }
        }
    };
    
    /*-------------------Activa-Desactivar usuario-----------------*/ 
    //Abre el panel para confirmar si se desea cambiar el estatus de activo del usuario
    $scope.ConfirmarActualizarActivoUsuario = function()
    {
        if(!$scope.usuarioPerfil.Activo && $scope.usuarioPerfil.ActivoUsuario)
        {
            $scope.usuarioPerfil.ActivoUsuario = false;
            $scope.mensaje = "Para poder activar al usuario primeramente debe de activar al colaborador";
            $('#mensajeUsuario').modal('toggle');
            return;
        }
        else if($scope.usuarioPerfil.ActivoUsuario)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR el usuario " + $scope.usuarioPerfil.NombreUsuario  + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR el usuario - " + $scope.usuarioPerfil.NombreUsuario +  "?";
        }
        $('#modalActivoUsuario').modal('toggle'); 
    };
    
    //Se cambia el estatus de activo
    $scope.ConfirmarActualizarUsuario = function()
    {
        var datos = [2];
        if($scope.usuarioPerfil.ActivoUsuario)
        {
            datos[1] = 1;
        }
        else
        {
            datos[1] = 0;
        }
        datos[0] = $scope.usuarioPerfil.UsuarioId;
        
        ActivarDesactivarUsuario($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El usuario se ha actualizado correctamente.";
            }
            else
            {
                $scope.usuarioPerfil.ActivoUsuario = !$scope.usuarioPerfil.ActivoUsuario;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
        }).catch(function(error)
        {
            $scope.usuarioPerfil.ActivoUsuario = !$scope.usuarioPerfil.ActivoUsuario;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
        });
        $('#mensajeUsuario').modal('toggle');
    };
    
    //se cancela el cambio de estatus de activo
    $scope.CancelarCambioActivo = function()
    {
        $scope.usuarioPerfil.ActivoUsuario = !$scope.usuarioPerfil.ActivoUsuario;
    };
    
    //Se abre el panel para confirmar que se desea reestable el password
    $scope.ConfirmarCambiarPassword = function()
    {
        $('#confirmarCambiarPassword').modal('toggle');
    };

    //Se reestable el password del usuario seleccionado
    //el password se generea aletoriamente y se mando a los correos electrónicos que tiene registrado el colaborador del usuario
    $scope.CambiarPassword = function()
    {
        var password = Math.random().toString(36).slice(-8);
        var correo = $.base64.encode( password );
        
        $scope.usuarioPerfil.Password = md5.createHash( password );
        $scope.usuarioPerfil.Correo = correo;
        
        var datosUsuario = {usuario:"", contacto:""};
        datosUsuario.usuario = $scope.usuarioPerfil;
        datosUsuario.contacto = $scope.usuarioContacto;
        
        CambiarPassword($http, CONFIG, $q, datosUsuario).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.mensaje = "La contraseña del usuario se ha cambiado. La nueva contraseña se envio a los correos electrónicos del usuario.";
                $('#mensajeUsuario').modal('toggle');
            }
            else
            {
                alert("Ha ocurrido un error. Intente más tarde.");
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error. Intente más tarde." +error);
            return;
        });
    };
    
    /*------------------------Editar Usuario----------------*/
    $scope.usuarioTab = 'datosUsuario';
    $scope.claseUsuario = {usuario:"entrada", perfil:"checkBoxActivo"};
    $scope.mostarCopiarPermisos ={mostrar:false, texto:"Copiar Permisos >>"};
    $scope.mensajeError = [];
    
    //Se abre el panel para editar el usuario
    $scope.AbrirEditarUsuario = function()
    {
        $scope.nuevoUsuario = SetColaborador($scope.usuarioPerfil);
        
        $scope.perfilNuevoUsuario = [];
        
        for(var k=0; k<$scope.perfilUsuario.length; k++)
        {
            $scope.perfilNuevoUsuario[k] = setPerfilUsuario($scope.perfilUsuario[k]);
        }
        
        if($scope.colaborador === null)
        {
            $scope.GetColaboradores();
        }
        
        $scope.SetPermisos($scope.nuevoUsuario);
        
        $('#usuarioPerfilModal') .modal('toggle');
    };
    
    //Se confirmo que se desea editar el usuario
    //Verifica que el nombre de usuario es correcto y que al menos se hay seleccionado un perfil
    //Si los datos son correctos se pasa a elegir los permisos del usuario
    $scope.TerminarUsuario = function(usuarioInvalido)
    {   
        $scope.mensajeError = [];
        
        if(usuarioInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre del usuario puede tener letras en minúscula y números sin espacios. Mínimo debe tener 4 caracteres.";
            $scope.claseUsuario.usuario = "entradaError";
        }
        else
        {
            $scope.claseUsuario.usuario = "entrada";
        }
        var perfilSeleccionado = false;
        for(var k=0; k<$scope.perfilNuevoUsuario.length; k++)
        {
            if($scope.perfilNuevoUsuario[k].Activo)
            {
                perfilSeleccionado = true;
                break;
            }
        }
        if(!perfilSeleccionado)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes seleccionar al menos un perfil.";
            $scope.claseUsuario.perfil = "checkBoxActivoError";
        }
        else
        {
            $scope.claseUsuario.perfil = "checkBoxActivo";
        }
        
        if( $scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.colaborador.length; k++)
        {
            if($scope.colaborador[k].UsuarioId !== null)
            {
                if($scope.colaborador[k].NombreUsuario.toLowerCase() == $scope.nuevoUsuario.NombreUsuario.toLowerCase() && $scope.colaborador[k].ColaboradorId !== $scope.nuevoUsuario.ColaboradorId)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El nombre del usuario " + $scope.nuevoUsuario.NombreUsuario + " ya existe.";
                    $scope.claseUsuario.usuario = "entradaError";
                    return;
                }
            }
        }
        
        $scope.nuevoUsuario.NombreUsuario = $scope.nuevoUsuario.NombreUsuario.toLowerCase();
        
        //validación correcta
            
        $scope.usuarioTab = "permisosUsuario";
    };
    
    //Se verifica que el usario tenga como minimo un permiso en cada perfil
    //Se editan los datos del usuario
    $scope.TerminarPermisosUsuario = function()
    {
         $scope.mensajeError = [];
        var permisoPerfilSeleccionado = {adminatrador: false, operativo: false, ejecutivo: false};
        for(var k=0; k<$scope.perfilNuevoUsuario.length; k++)
        {
            if(!$scope.perfilNuevoUsuario[k].Activo)
            {
                if($scope.perfilNuevoUsuario[k].Nombre == "Administrador")
                {
                    permisoPerfilSeleccionado.adminatrador = true;
                }
                else if($scope.perfilNuevoUsuario[k].Nombre == "Ejecutivo")
                {
                    permisoPerfilSeleccionado.ejecutivo = true;
                }
                else if($scope.perfilNuevoUsuario[k].Nombre == "Operativo")
                {
                    permisoPerfilSeleccionado.operativo = true;
                }
            }
        }
        
        for(var k=0; k<$scope.permiso.length; k++)
        {
            if($scope.permiso[k].Activo)
            {
                if($scope.permiso[k].NombrePerfil == "Administrador" && !permisoPerfilSeleccionado.adminatrador)
                {
                    permisoPerfilSeleccionado.adminatrador = true;
                }
                else if($scope.permiso[k].NombrePerfil  == "Ejecutivo" && !permisoPerfilSeleccionado.ejecutivo)
                {
                    permisoPerfilSeleccionado.ejecutivo = true;
                }
                else if($scope.permiso[k].NombrePerfil  == "Operativo" && !permisoPerfilSeleccionado.operativo)
                {
                    permisoPerfilSeleccionado.operativo = true;
                }
                
                if(permisoPerfilSeleccionado.adminatrador && permisoPerfilSeleccionado.ejecutivo && permisoPerfilSeleccionado.operativo)
                {
                    break;
                }
            }
        }

        if(!(permisoPerfilSeleccionado.adminatrador && permisoPerfilSeleccionado.ejecutivo && permisoPerfilSeleccionado.operativo))
        {
            $scope.mensajeError[0] = "Debes de seleccionar al menos un permiso por perfil.";
            return;
        }
        
        var datos = {colaborador:"", perfil:"", permiso:""};
        datos.usuario = $scope.nuevoUsuario;
        datos.perfil = $scope.perfilNuevoUsuario;
        datos.permiso = $scope.permiso;
        
        EditarUsuario($http, CONFIG, $q, datos).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.usuarioPerfil = SetColaborador($scope.nuevoUsuario);
                for(var k=0; k<$scope.perfilUsuario.length; k++)
                {
                    $scope.perfilUsuario[k] = setPerfilUsuario($scope.perfilNuevoUsuario[k]);
                }
                
                $scope.CerrarUsuario();
                $('#usuarioPerfilModal').modal('toggle');
                $scope.mensaje = "El usuario se ha editado.";
                $('#mensajeUsuario').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeUsuario').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeUsuario').modal('toggle');
        });
    };
    
    //Se cancela la edición del usuario
    $scope.CerrarUsuario = function()
    {
        $scope.usuarioTab = "datosUsuario";
        $scope.claseUsuario = {usuario:"entrada", perfil:"checkBoxActivo"};
        $scope.mensajeError = [];
    };
    
    /*---------Catálogos -----------*/
    //Obtine los colaboradores dados de alta
    $scope.GetColaboradores = function()              
    {
        GetColaboradores($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.colaborador = data;
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //Se obtinen todos los permisos disponibles
    $scope.GetPermiso = function()
    {
        GetPermiso($http, $q, CONFIG).then(function(data)
        {
            $scope.permiso = data;
        }).catch(function(error)
        {
            alert("Error al cargar los permisos. Intente más tarde." + error);
        });
    };
    
    /*Permisos */
    //Se muestran u ocultan los permisos del perfil correspondiente
    $scope.MostrarOcultarPermisos = function(perfil)
    {
        perfil.mostrar = !perfil.mostrar;
        if(perfil.mostrar)
        {
            perfil.texto = "<<";
        }
        else
        {
            perfil.texto = ">>";
        }
    };
    
    //Se regresa al primer paso de la edición del usuario
    $scope.AnteriorPermisos = function()
    {
        $scope.usuarioTab = "datosUsuario";
    };
    
    //Selecciona todos los permisos del perfil correspondiente
    $scope.ActivarPermisos = function(perfil)
    {
        for(var k=0; k<$scope.permiso.length; k++)
        {
            if($scope.permiso[k].NombrePerfil == perfil)
            {
               $scope.permiso[k].Activo = true; 
            }
        }
    };
    
    //deselecciona todos los permisos del perfil correspondiente
    $scope.DesactivarPermisos = function(perfil)
    {
        for(var k=0; k<$scope.permiso.length; k++)
        {
            if($scope.permiso[k].NombrePerfil == perfil)
            {
               $scope.permiso[k].Activo = false; 
            }
        }
    };
    
    //Copia los permisos de un usuario al usuario actual
    $scope.SetPermisos = function(usuario)
    {
        GetPermisoPorUsuario($http, $q, CONFIG, usuario.UsuarioId).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                var permisoActivo = false;
                for(var i=0; i<$scope.permiso.length; i++)
                {
                    permisoActivo = false;
                    for(var j=0; j<data[1].Permiso.length; j++)
                    {
                        if($scope.permiso[i].PermisoId == data[1].Permiso[j].PermisoId)
                        {
                            permisoActivo = true;
                            break;
                        }
                    }
                    $scope.permiso[i].Activo = permisoActivo;
                }
            }
            else
            {
                alert("Ha ocurrido un error al obtener los permisos.");
                return;
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener los permisos." + error);
            return;
        });
    };
    
    //Muestra u oculta la tabla donde se despliegan todos los usuarios
    //Si se selecciona un usuario de esta tabla se copian los permisos de este usario al usuario actual
    $scope.MostrarCopiarPermisos = function()
    {
        $scope.mostarCopiarPermisos.mostrar = !$scope.mostarCopiarPermisos.mostrar;
        if($scope.mostarCopiarPermisos.mostrar )
        {
            $scope.mostarCopiarPermisos.texto = "Copiar Permisos <<";
        }
        else
        {
            $scope.mostarCopiarPermisos.texto = "Copiar Permisos >>";
        }
    };
    
    //Muestra u oculta los permisos del perfil seleccionado
    $scope.VerPermisos = function()
    {
        $scope.SetPermisos($scope.usuarioPerfil);
        $('#PermisoModal').modal('toggle');  
    };
    
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            $scope.IdentificarPermisos();
            if(!$scope.permisoUsuario.consultar)
            {
               for(var k=0; k<$rootScope.Perfiles.length; k++)
                {
                    if($scope.usuarioLogeado.PerfilSeleccionado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
                    {
                        $window.location = $rootScope.Perfiles[k].paginaPrincipal;
                    }
                } 
            }
            else
            {
                if($scope.permiso === null)
                {
                    $scope.GetPermiso();
                }
            }
        }
        else
        {
            $window.location = "#Login";
        }
    }
    
    //Verifica que el usuario este logeado y que cumpla con los permisos pertinentes al módulo
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $window.location = "#Login";
            return;
        }
        else
        {
            $scope.IdentificarPermisos();
            if(!$scope.permisoUsuario.consultar)
            {
               for(var k=0; k<$rootScope.Perfiles.length; k++)
                {
                    if($scope.usuarioLogeado.PerfilSeleccionado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
                    {
                        $window.location = $rootScope.Perfiles[k].paginaPrincipal;
                    }
                } 
            }
            else
            {
                if($scope.permiso === null)
                {
                    $scope.GetPermiso();
                }
            }
        }
    });
    
});

//Pestañas del perfil del usuario
var tabPerfilUsuario = 
    [
        {titulo:"Datos", referencia: "#Datos", clase:"active", area:"datos", enable:true},
        {titulo:"Citas", referencia: "#Citas", clase:"", area:"citas", enable:false},
        {titulo:"Bitacora", referencia: "#Bitacora", clase:"", area:"bitacora", enable:false}
    ];

//Guarda los datos del usuario seleccionado
function setPerfilUsuario(perfil)
{
    var nuevoPerfil = new Perfil();
    
    nuevoPerfil.Nombre = perfil.Nombre;
    nuevoPerfil.PerfilId = perfil.PerfilId;
    nuevoPerfil.Activo = perfil.Activo;
    nuevoPerfil.mostrar = false;
    nuevoPerfil.texto = ">>";
    
    return nuevoPerfil;
}

