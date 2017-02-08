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
    
    
    if(perfil.nombre == "Administrador")
    {
        for(var k=0; k< $rootScope.barraNavegacionOpciones[0].elemento.length; k++)
        {
            $rootScope.barraNavegacionOpciones[0].elemento[k].show = false;
        }

        for(var k=0; k< $rootScope.barraNavegacionOpciones[1].elemento.length; k++)
        {
            $rootScope.barraNavegacionOpciones[1].elemento[k].show = false;
        }

        for(var k=0; k< $rootScope.barraNavegacionOpciones[2].elemento.length; k++)
        {
            $rootScope.barraNavegacionOpciones[2].elemento[k].show = false;
        }
    }

    for(var k=0; k<usuario.Permiso.length; k++)
    {
        if(perfil.nombre == "Administrador")
        {
            /*cocinas K*/
            if(usuario.Permiso[k] == "AdmColConsultar")
            {
                $rootScope.barraNavegacionOpciones[0].elemento[0].show = true;
            }
            else if(usuario.Permiso[k] == "AdmUNeConsultar")
            {
                $rootScope.barraNavegacionOpciones[0].elemento[1].show = true;
            }
            else if(usuario.Permiso[k] == "AdmPlaConsultar")
            {
                $rootScope.barraNavegacionOpciones[0].elemento[2].show = true;
            }
            else if(usuario.Permiso[k] == "AdmTerConsultar")
            {
                $rootScope.barraNavegacionOpciones[0].elemento[3].show= true;
            }
            /*catálogos*/
            else if(usuario.Permiso[k] == "CatModConsultar")
            {
                $rootScope.barraNavegacionOpciones[1].elemento[0].show = true;
            }
            else if(usuario.Permiso[k] == "CatComConsultar")
            {
                $rootScope.barraNavegacionOpciones[1].elemento[1].show = true;
            }
            else if(usuario.Permiso[k] == "ConCubConsultar")
            {
                $rootScope.barraNavegacionOpciones[1].elemento[2].show = true;
            }
            else if(usuario.Permiso[k] == "CatAccConsultar")
            {
                $rootScope.barraNavegacionOpciones[1].elemento[3].show = true;
            }
            /*Configurar*/
            else if(usuario.Permiso[k] == "ConCmpConsultar" || usuario.Permiso[k] == "ConPieConsultar" || usuario.Permiso[k] == "ConCnsConsultar" || usuario.Permiso[k] == "ConTMdConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[0].show = true;
            }
            else if(usuario.Permiso[k] == "AdmEmpConsultar" || usuario.Permiso[k] == "AdmTUNConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[1].show = true;
            }
            else if(usuario.Permiso[k] == "AdmMatConsultar" || usuario.Permiso[k] == "AdmTMaConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[2].show = true;
            }
            else if(usuario.Permiso[k] == "ConPueConsultar" || usuario.Permiso[k] == "ConMpuConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[3].show = true;
            }
            else if(usuario.Permiso[k] == "ConMCCConsultar" || usuario.Permiso[k] == "ConFCuConsultar" || usuario.Permiso[k] == "ConUCuConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[4].show = true;
            }
            else if(usuario.Permiso[k] == "ConTMCConsultar" || usuario.Permiso[k] == "ConCloConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[5].show = true;
            }
            else if(usuario.Permiso[k] == "ConMAcConsultar" || usuario.Permiso[k] == "ConTAcConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[6].show = true;
            }
            else if(usuario.Permiso[k] == "ConSerConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[7].show = true;
            }
            else if(usuario.Permiso[k] == "ConMaqConsultar" || usuario.Permiso[k] == "ConMCMConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[8].show = true;
            }
        }
    }
}

