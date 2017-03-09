app.controller("ConfiguaracionColorControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";

    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {
                                color:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            //color
            if($scope.usuarioLogeado.Permiso[k] == "ConCloConsultar")
            {
                $scope.permisoUsuario.color.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCloAgregar")
            {
                $scope.permisoUsuario.color.agregar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCloEditar")
            {
                $scope.permisoUsuario.color.editar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCloActivar")
            {
                $scope.permisoUsuario.color.activar  = true;
            }
        }
    };
    
    $scope.titulo = "Color";
    $scope.tabs = tabColor;                   //pestañas 

    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#Color').show();
                break;
            default:
                break;
        }        
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
                if(!$scope.permisoUsuario.color.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado); 
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
                if(!$scope.permisoUsuario.color.consultar)
                {
                    $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
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
var tabColor = 
    [
        {titulo:"Color", referencia: "#Color", clase:"active", area:"color"}
    ];