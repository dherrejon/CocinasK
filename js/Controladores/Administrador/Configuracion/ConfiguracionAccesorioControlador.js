app.controller("ConfiguaracionAccesorioController", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";
    
    $scope.permisoUsuario = {
                            tipoAccesorio:{consultar:false, agregar:false, editar:false, activar:false}, 
                            muestrario:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConTAcConsultar")
            {
                $scope.permisoUsuario.tipoAccesorio.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTAcAgregar")
            {
                $scope.permisoUsuario.tipoAccesorio.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTAcEditar")
            {
                $scope.permisoUsuario.tipoAccesorio.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTAcActivar")
            {
                $scope.permisoUsuario.tipoAccesorio.activar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMAcConsultar")
            {
                $scope.permisoUsuario.muestrario.consultar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMAcAgregar")
            {
                $scope.permisoUsuario.muestrario.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMAcEditar")
            {
                $scope.permisoUsuario.muestrario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMAcActivar")
            {
                $scope.permisoUsuario.muestrario.activar = true;
            }
        }
    };
    
    $scope.titulo = "Tipo Accesorio";
    $scope.tabs = tabAccesorio;
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#TipoAccesorio').show();
                $('#Muestrario').hide();
                break;
            case 1:  
                $('#Muestrario').show();
                $('#TipoAccesorio').hide();
                if($scope.permisoUsuario.muestrario.editar || $scope.permisoUsuario.muestrario.agregar)
                {
                    $rootScope.InicializarMuestratrioAccesorio();
                }
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
                if(!$scope.permisoUsuario.tipoAccesorio.consultar && !$scope.permisoUsuario.muestrario.consultar)
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
                if(!$scope.permisoUsuario.tipoAccesorio.consultar && !$scope.permisoUsuario.muestrario.consultar)
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
var tabAccesorio = 
    [
        {titulo:"Tipo Accesorio", referencia: "#TipoAccesorio", clase:"active", area:"tipoMaterial"},
        {titulo:"Muestrario Accesorios", referencia: "#Muestrario", clase:"", area:"material"},
    ];