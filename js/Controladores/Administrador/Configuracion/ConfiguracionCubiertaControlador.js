app.controller("ConfiguaracionCubiertaControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";

    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {
                            muestrarioColor:{consultar:false, agregar:false, editar:false, activar:false},
                            fabricacion:{consultar:false, agregar:false, editar:false, activar:false},
                            ubicacion:{consultar:false, agregar:false, editar:false, activar:false},
                            acabado:{consultar:false, agregar:false, editar:false, activar:false},
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConMCCConsultar")
            {
                $scope.permisoUsuario.muestrarioColor.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMCCAgregar")
            {
                $scope.permisoUsuario.muestrarioColor.agregar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMCCEditar")
            {
                $scope.permisoUsuario.muestrarioColor.editar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMCCActivar")
            {
                $scope.permisoUsuario.muestrarioColor.activar  = true;
            }
            //fabricacion
            if($scope.usuarioLogeado.Permiso[k] == "ConFCuConsultar")
            {
                $scope.permisoUsuario.fabricacion.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConFCuAgregar")
            {
                $scope.permisoUsuario.fabricacion.agregar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConFCuEditar")
            {
                $scope.permisoUsuario.fabricacion.editar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConFCuActivar")
            {
                $scope.permisoUsuario.fabricacion.activar  = true;
            }
            //ubicacion
            if($scope.usuarioLogeado.Permiso[k] == "ConUCuConsultar")
            {
                $scope.permisoUsuario.ubicacion.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConUCuAgregar")
            {
                $scope.permisoUsuario.ubicacion.agregar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConUCuEditar")
            {
                $scope.permisoUsuario.ubicacion.editar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConUCuActivar")
            {
                $scope.permisoUsuario.ubicacion.activar  = true;
            }
            //acabado
            if($scope.usuarioLogeado.Permiso[k] == "ConACuConsultar")
            {
                $scope.permisoUsuario.acabado.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConACuAgregar")
            {
                $scope.permisoUsuario.acabado.agregar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConACuEditar")
            {
                $scope.permisoUsuario.acabado.editar  = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConACuActivar")
            {
                $scope.permisoUsuario.acabado.activar  = true;
            }
        }
    };
    
    $scope.titulo = "MuestrarioColor";
    $scope.tabs = tabCubierta;                   //pestañas 
    
    $scope.mensajeError = [];                   //mensaje de errores en el momento de agregar o editar
    $scope.operacion = "";                      //Saber si se esta agregando o editando
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#MuestrarioColor').show();
                $('#Fabricacion').hide();
                $('#Ubicacion').hide();
                $('#Acabado').hide();
                break;
            case 1:  
                $('#Fabricacion').show();
                $('#MuestrarioColor').hide();
                $('#Ubicacion').hide();
                $('#Acabado').hide();
                break;
            case 2:  
                $('#Ubicacion').show();
                $('#MuestrarioColor').hide();
                $('#Fabricacion').hide();
                $('#Acabado').hide();
                
                if($scope.permisoUsuario.ubicacion.editar)
                {
                    $rootScope.InicializarUbicacionCubierta();
                }
                break;
                
            case 3:  
                $('#Acabado').show();
                $('#MuestrarioColor').hide();
                $('#Ubicacion').hide();
                $('#MuestrarioColor').hide();
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
                if(!$scope.permisoUsuario.muestrarioColor.consultar && !$scope.permisoUsuario.fabricacion.consultar && !$scope.permisoUsuario.ubicacion.consultar)
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
                if(!$scope.permisoUsuario.muestrarioColor.consultar && !$scope.permisoUsuario.fabricacion.consultar && !$scope.permisoUsuario.ubicacion.consultar)
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
var tabCubierta = 
    [
        {titulo:"Muestrario Color", referencia: "#MuestrarioColor", clase:"active", area:"muestrarioColor"},
        {titulo:"Fabricación", referencia: "#Fabricacion", clase:"", area:"fabricacion"},
        {titulo:"Ubicación", referencia: "#Ubicacion", clase:"", area:"ubicacion"},
        {titulo:"Acabado", referencia: "#Acabado", clase:"", area:"acabado"}
    ];