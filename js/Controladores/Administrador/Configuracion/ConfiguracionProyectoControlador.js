app.controller("ConfiguaracionProyectoController", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";
    $scope.permisoUsuario = {
                            tipoProyecto:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConTPRConsultar")
            {
                $scope.permisoUsuario.tipoProyecto.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTPRAgregar")
            {
                $scope.permisoUsuario.tipoProyecto.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTPREditar")
            {
                $scope.permisoUsuario.tipoProyecto.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTPRActivar")
            {
                $scope.permisoUsuario.tipoProyecto.activar= true;
            }
        }
    };
    
    $scope.titulo = "Tipo de Proyecto";
    $scope.tabs = tabTipoProyecto;
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#TipoProyecto').show();
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
                if(!$scope.permisoUsuario.tipoProyecto.consultar)
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
                if(!$scope.permisoUsuario.tipoProyecto.consultar)
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
var tabTipoProyecto = 
    [
        {titulo:"Tipo de Proyecto", referencia: "#TipoProyecto", clase:"active", area:"tipoProyecto"}
    ];