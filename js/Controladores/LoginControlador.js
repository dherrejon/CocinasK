app.controller("LoginControlador", function($window,$scope, $http, $rootScope, $q, CONFIG, datosUsuario, md5)
{   
    $rootScope.clasePrincipal = "login";
    $scope.usuario = datosUsuario.getUsuario();
     
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuario =  datosUsuario.getUsuario();    
        
        if($scope.usuario.SesionIniciada)
        {
            $scope.NegarAccesoLogin();
        }
    });
    
    /*------------------------------------------------------------------------------*/
    
    $scope.mensajeError = ""; // Mensaje de error en el login
    $scope.mensajeErrorPassword = "";
    
    //Inicia sesión del usuario
    $scope.IniciarSesion = function(usuarioInvalido, passwordInvalado)
    {
        if(usuarioInvalido) //verifica que los campos de nombre de usuario y de password contengan datos
        {
            $scope.mensajeError = "*Debes escribir un usuario"; 
            return;
        }
        
        if(passwordInvalado)
        {
            $scope.mensajeError = "*Debes escribir una contraseña"; 
            return;
        }
        
        $scope.usuario.IniciarSesion($http, $scope.usuario, $q, CONFIG, md5).then(function(data) //iniciar sesion
        {
            if(data == "SesionInicada")     //Verifica que la sesión no este iniciada
            {
                $scope.mensajeError = "Hay una sesión conectada, cierra la sesión para que puedas iniciar sesión.";
                return;
            }
            
            $scope.usuario = data;
            if($scope.usuario.SesionIniciada)
            {   
                if($scope.usuario.Perfil.length > 1)            //si el usuario cuenta con 2 perfiles o más se manda a una página para que este seleccione el perfil a utilizar
                {
                    $window.location = "#Perfil";
                }
                else if($scope.usuario.Perfil.length == 1)      //Si el usuario solo tiene un perfil automáticamente se abre la pagina principal de ese perfil
                {
                    for(var k=0; k<$rootScope.Perfiles.length; k++)
                    {

                        if($scope.usuario.Perfil[0] == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
                        {
                            $rootScope.PerfilSeleccinado = $scope.usuario.Perfil[0];
                            $scope.usuario.PerfilSeleccionado = $scope.usuario.Perfil[0];
                            SetPerfil($rootScope.Perfiles[k], $rootScope, $window, $http, CONFIG, $scope.usuario);      
                            break;
                        }
                    }
                    
                    $rootScope.clasePrincipal = ""; 
                }
                $scope.messageError = "";
                
                datosUsuario.enviarUsuario($scope.usuario);
            }
            else if($scope.usuario.SesionIniciada === false)
            {
                 $scope.mensajeError = "*Verifica que tu usuario y contraseña sean correctas";
            }
            else
            {
                 $scope.usuario = new Usuario("","","");
                 $scope.mensajeError = "*Error de conexión. Intenta más tarde.";
            }
            
            
        }).catch(function(error){
            $scope.usuario = new Usuario("","","");
            alert(error);
        });
    };
    
    /*---------Recuperar Password-----------------*/
    $scope.RecuperarPassword = function(usuarioInvalido)
    {
        $scope.mensajeErrorPassword = "";
        if(usuarioInvalido)
        {
            $scope.mensajeErrorPassword = "*Escribe un usuario válido.";
            return;
        }
        
        var usuario = new Object();
        usuario.Nombre = $scope.usuario.Nombre;
        
        RecuperarPassword($http, CONFIG, $q, usuario).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.mensaje = "Se te ha enviado un correo para que puedas reiniciar tu contraseña.";
                $('#recuperarPasswordModal').modal('toggle');
                $('#mensajeLogin').modal('toggle');
            }
            else if(data == "ErrorUsuario")
            {
                $scope.mensajeErrorPassword = "*El usuario no es válido.";
            }
            else if(data == "ErrorContacto")
            {
                $scope.mensajeErrorPassword = "*El usuario no tiene correos electrónicos registrados. Es necesario que al menos tenga un correo electrónico registrado.";
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
    
    $scope.CerrarRecuperarPasswordForma = function()
    {
        $scope.mensajeErrorPassword = "";
    };
    
   /*Identifica si el usuariario esta logeado e impide el acceso a login*/
    $scope.NegarAccesoLogin  = function()                       
    {
        for(var k=0; k<$rootScope.Perfiles.length; k++)
        {
            if($rootScope.PerfilSeleccinado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
            {
                $rootScope.clasePrincipal = "";
                $window.location = $rootScope.Perfiles[k].paginaPrincipal;
                return;
            }
        }
    };
    
    if($scope.usuario !== null)
    {
        if($scope.usuario.SesionIniciada)
        {
            $scope.NegarAccesoLogin();
        }
    }
});


