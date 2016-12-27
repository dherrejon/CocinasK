app.controller("BugControlador", function($scope, $window, $rootScope, $http, CONFIG, datosUsuario, datosPerfil, $q)
{   
    $rootScope.clasePrincipal = "";
    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmRErConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
        }
    };
    
    $scope.bug = [];
    $scope.ordenarPor = "Fecha";
    $scope.buscar = "";
    $scope.mostrarFiltro = {modulo:true, seccion:false, resuelto:false};
    $scope.bugDetalle = "";
    $scope.mensajeError = [];
    $scope.resolverBug = new Object();
    $scope.filtro = {modulo:[], seccion:[]};
    $scope.filtroModulo = [];
    $scope.filtroSeccion = [];
    $scope.filtroResuelto = {resuelto:false, noResuelto:false};
    
    $scope.GetBug = function()
    {
        GetBug($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.bug = data;
            }
            else
            {
                $scope.bug = [];
            }
        }).catch(function(error)
        {
            $scope.bug = [];
            alert(error);
        });
    };
    
    $scope.MostrarFiltros = function(filtro)
    {
        if(filtro == "modulo")
        {
            $scope.mostrarFiltro.modulo = !$scope.mostrarFiltro.modulo;
        }
        else if(filtro == "seccion")
        {
            $scope.mostrarFiltro.seccion = !$scope.mostrarFiltro.seccion;
        }
        else if(filtro == "resuelto")
        {
            $scope.mostrarFiltro.resuelto = !$scope.mostrarFiltro.resuelto;
        }
    };
    
    /*-----Ordenar--------------*/
    //ordena por el campo seleccionado
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenarPor == campoOrdenar)
        {
            $scope.ordenarPor = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPor = campoOrdenar;
        }
    };
    
    /*----------- Filtro --------------------*/
    $scope.FiltrarBug = function(bug)
    {
        if($scope.filtroResuelto.resuelto != $scope.filtroResuelto.noResuelto)
        {
            if($scope.filtroResuelto.resuelto)
            {
                if(bug.Resuelto === "0")
                {
                    return false;
                }
            }
            else if($scope.filtroResuelto.noResuelto)
            {
                if(bug.Resuelto === "1")
                {
                    return false;
                }
            }
        }
        
        var valorEncontrado = false;
        
        if($scope.filtroModulo.length > 0)
        {
            for(var k=0; k<$scope.filtroModulo.length; k++)
            {
                if(bug.Modulo == $scope.filtroModulo[k])
                {
                    valorEncontrado = true;
                    break;
                }
            }
            if(!valorEncontrado)
            {
                return false;
            }
        }
        
        if($scope.filtroSeccion.length > 0)
        {
            valorEncontrado = false;
            for(var k=0; k<$scope.filtroSeccion.length; k++)
            {
                if(bug.Seccion == $scope.filtroSeccion[k])
                {
                    valorEncontrado = true;
                    break;
                }
            }
            if(!valorEncontrado)
            {
                return false;
            }
        }
        
        return true;
    };
    
    $scope.setFilter = function(filtro, campo)
    {
        if(filtro == "modulo")
        {
            for(var k=0; k<$scope.filtroModulo.length; k++)
            {
                if($scope.filtroModulo[k] == campo)
                {
                    $scope.filtroModulo.splice(k,1);
                    return;
                }
            }
            $scope.filtroModulo.push(campo);
            return;
        }
        else if(filtro == "seccion")
        {
            for(var k=0; k<$scope.filtroSeccion.length; k++)
            {
                if($scope.filtroSeccion[k] == campo)
                {
                    $scope.filtroSeccion.splice(k,1);
                    return;
                }
            }
            $scope.filtroSeccion.push(campo);
            return;
        }
     };
    
    $scope.LimpiarFiltro = function()
    {
        $scope.filtro = {modulo:[], seccion:[]};
        $scope.filtroModulo = [];
        $scope.filtroSeccion = [];
        $scope.filtroResuelto = {resuelto:false, noResuelto:false};
    };
    
    /*---------Detalle-----------------*/
    $scope.MostarDetalles = function(bug)
    {
        $scope.bugDetalle = bug;
        $('#DetalleBug').modal('toggle');
    };
    
    /*----------- Resolver Bug -----------*/
    $scope.ResolverBug = function(bug)
    {
        $scope.resolverBug = bug;
        $('#ResolverBug').modal('toggle');
    };
    
    $scope.TerminarResolverBug = function()
    {
        $scope.mensajeError = [];
        if($scope.resolverBug.Observacion.length > 250)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El texto de observación puede llevar un máximo de 250 carácteres.";
        }
        
        if($scope.mensajeError.length >0)
        {
            return;
        }
        
        ResolverBug($http, CONFIG, $q, $scope.resolverBug).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetBug();
                $('#ResolverBug').modal('toggle');
                $scope.mensaje = "El error se ha marcado como resuelto.";
                $('#mensajeBug').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeBug').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeBug').modal('toggle');
        });
    };
    
    $scope.CerrarReportarError = function()
    {
        $scope.mensajeError = [];
        $scope.resolverBug.Observacion = "";
        $scope.resolverBug.resultoCheck = false;
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
                if(!$scope.permisoUsuario.consultar)
                {
                    $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.GetBug();
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
            $window.location = "#Login";
        }
    }
    
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $window.location = "#Login";
            return;
        }
        else
        {
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.GetBug();
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