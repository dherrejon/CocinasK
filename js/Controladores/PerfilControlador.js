app.controller("PerfilControlador", function($scope, $window, $rootScope, $http, CONFIG, datosUsuario, datosPerfil, $location)
{   
    $rootScope.clasePrincipal = "login";
    
    $scope.usuario = datosUsuario.getUsuario();
    $rootScope.Perfiles = datosPerfil.getPefil();
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuario =  datosUsuario.getUsuario();    
        $scope.HabilitarPerfiles();
    });
    
    /*------------------Indentifica cuando los perfiles se hayan cargado-------------------*/
    $scope.$on('cambioPerfil',function()
    { 
        $scope.HabilitarPerfiles();
    });
    
    $scope.SeleccionarPerfil = function(perfil)     // selecionar un perfil 
    {
        $rootScope.clasePrincipal = "";
        datosUsuario.setPerfilSeleccionado(perfil.nombre);
        SetPerfil(perfil, $rootScope, $window, $http, CONFIG, $scope.usuario);
    };
    
    //Muesrta los perfiles con los cuales cuenta el usuario
    $scope.HabilitarPerfiles = function()           
    {
        if($scope.usuario !== null && $scope.Perfiles !== undefined)
        {
            var perfilDisponible = false;
            for(var i=0; i<$rootScope.Perfiles.length; i++)         //Mostrar los perfiles disponibles para el usuarios
            {
                for(var j=0; j<$scope.usuario.Perfil.length; j++)
                {
                    if($rootScope.Perfiles[i].nombre == $scope.usuario.Perfil[j])
                    {
                        $rootScope.Perfiles[i].visible = true;
                        perfilDisponible = true;
                        break;
                    }
                }
                if(!perfilDisponible)
                {
                    $rootScope.Perfiles[i].visible = false;
                }
                perfilDisponible = false;
            }
        }
    };
    
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            $scope.HabilitarPerfiles();
        }
        else
        {
            $location.path('/Login');
        }
    }
    
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
            $scope.HabilitarPerfiles();
        }
    });
    
    //Inicializar 
     $scope.HabilitarPerfiles();
});

//Datos del perfil seleccionado por el usuario
//Muestra y ocultas las secciones para las cuales el usuario tiene permiso de acceder
function SetPerfil(perfil, $rootScope, $window, $http, CONFIG, usuario)         
{
    $rootScope.barraNavegacionOpciones = perfil.barraNavegacion;
    $rootScope.PerfilSeleccinado = perfil.nombre;
    $window.location = perfil.paginaPrincipal;
    SetPerfilInSesion(perfil.nombre, $http, CONFIG);                    //Coloca el perfil seleccionado en _$Session
    
    
    for(var i=0;  i<$rootScope.barraNavegacionOpciones.length; i++)
    {
        for(var j=0; j<$rootScope.barraNavegacionOpciones[i].elemento.length; j++)
        {
            $rootScope.barraNavegacionOpciones[i].elemento[j].show = false;
            
            if($rootScope.barraNavegacionOpciones[i].elemento[j].tipo == "dropdownlist")
            {
                for(var m=0; m<$rootScope.barraNavegacionOpciones[i].elemento[j].opcion.length; m++)
                {
                     $rootScope.barraNavegacionOpciones[i].elemento[j].opcion[m].show = false; 
                }
            }
        }
    }

    HabilitarOpcionesMenu(usuario, $rootScope);
}

