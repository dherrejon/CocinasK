app.controller("ConfiguaracionCombinacionMaterialController", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";
    
    $scope.permisoUsuario = {
                            tipo:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConCMaConsultar")
            {
                $scope.permisoUsuario.tipo.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCMaAgregar")
            {
                $scope.permisoUsuario.tipo.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCMaEditar")
            {
                $scope.permisoUsuario.tipo.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCMaActivar")
            {
                $scope.permisoUsuario.tipo.activar= true;
            }
        }
    };
    
    $scope.titulo = "Tipo de Combinación";
    $scope.tabs = tabServicio;
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#TipoCombinacion').show();
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
                if(!$scope.permisoUsuario.tipo.consultar)
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
                if(!$scope.permisoUsuario.tipo.consultar)
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
var tabServicio = 
    [
        {titulo:"Tipo de Combinación", referencia: "#TipoCombinacion", clase:"active", area:"tipoCombinacion"}
    ];