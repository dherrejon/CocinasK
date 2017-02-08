app.controller("ConfiguaracionMaqueoController", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.permisoUsuario = {
                            maqueo:{consultar:false, agregar:false, editar:false, activar:false},
                            muestario:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConMaqConsultar")
            {
                $scope.permisoUsuario.maqueo.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMaqAgregar")
            {
                $scope.permisoUsuario.maqueo.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMaqEditar")
            {
                $scope.permisoUsuario.maqueo.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMaqActivar")
            {
                $scope.permisoUsuario.maqueo.activar= true;
            }
            if($scope.usuarioLogeado.Permiso[k] == "ConMCMConsultar")
            {
                $scope.permisoUsuario.muestario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMCMAgregar")
            {
                $scope.permisoUsuario.muestario.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMCMEditar")
            {
                $scope.permisoUsuario.muestario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMCMActivar")
            {
                $scope.permisoUsuario.muestario.activar= true;
            }
        }
    };
    
    $scope.titulo = "Maqueo";
    $scope.tabs = tabMaqueo;
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#Maqueo').show();
                $('#MuestrarioColor').hide();
                
                if($scope.permisoUsuario.maqueo.editar || $scope.permisoUsuario.maqueo.agregar)
                {
                    $rootScope.InicializarMaqueo();
                }
                break;
            case 1:  
                $('#MuestrarioColor').show();
                $('#Maqueo').hide();
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
                if(!$scope.permisoUsuario.maqueo.consultar && !$scope.permisoUsuario.muestario.consultar)
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
                if(!$scope.permisoUsuario.maqueo.consultar && !$scope.permisoUsuario.muestario.consultar)
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
var tabMaqueo = 
    [
        {titulo:"Maqueo", referencia: "#Maqueo", clase:"active", area:"maqueo"},
        {titulo:"Muestrario Color", referencia: "#MuestrarioColor", clase:"", area:"muestrarioColor"}
    ];