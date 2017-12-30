app.controller("ConfiguaracionClinete", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";
    
    $scope.permisoUsuario = {
                            medioCaptacion:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConMCaConsultar")
            {
                $scope.permisoUsuario.medioCaptacion.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMCaAgregar")
            {
                $scope.permisoUsuario.medioCaptacion.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMCaEditar")
            {
                $scope.permisoUsuario.medioCaptacion.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMCaActivar")
            {
                $scope.permisoUsuario.medioCaptacion.activar= true;
            }
        }
    };
    
    $scope.titulo = "Medio de Captación";
    $scope.tabs = tabConfigurarClientes;
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#MedioCaptacion').show();
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
                if(!$scope.permisoUsuario.medioCaptacion.consultar)
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
                if(!$scope.permisoUsuario.medioCaptacion.consultar)
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
var tabConfigurarClientes = 
    [
        {titulo:"Medio de Captación", referencia: "#MedioCaptacion", clase:"active", area:"medioCaptacion"}
    ];