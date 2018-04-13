app.controller("ConfiguaracionClinete", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";
    
    $scope.permisoUsuario = {
                            medioCaptacion:{consultar:false, agregar:false, editar:false, activar:false},
                            encuesta:{consultar:false, agregar:false, editar:false, activar:false}
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
            
            if($scope.usuarioLogeado.Permiso[k] == "AdmEncConsultar")
            {
                $scope.permisoUsuario.encuesta.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmEncAgregar")
            {
                $scope.permisoUsuario.encuesta.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmEncEditar")
            {
                $scope.permisoUsuario.encuesta.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmEncActivar")
            {
                $scope.permisoUsuario.encuesta.activar= true;
            }
        }
    };
    
    $scope.titulo = "Encuestas";
    $scope.tabs = tabConfigurarClientes;
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
    
        switch (index)
        {
            case 0:  
                $('#MedioCaptacion').show();
                $('#Encuesta').hide();
                break;
            case 1:  
                $('#Encuesta').show();
                $('#MedioCaptacion').hide();
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
                if(!$scope.permisoUsuario.medioCaptacion.consultar && !$scope.permisoUsuario.encuesta.consultar)
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
                if(!$scope.permisoUsuario.medioCaptacion.consultar && !$scope.permisoUsuario.encuesta.consultar)
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
        {titulo:"Medio de Captación", referencia: "#MedioCaptacion", clase:"", area:"medioCaptacion"},
        {titulo:"Encuestas", referencia: "#Encuesta", clase:"active", area:"encuesta"}
    ];