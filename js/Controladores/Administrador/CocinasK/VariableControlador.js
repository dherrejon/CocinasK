app.controller("VariableControlador", function($scope, $http, $q, CONFIG, $rootScope, $window, datosUsuario, $location)
{   
    $rootScope.clasePrincipal = "";
    $scope.permisoUsuario = {consultar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmVaSCon")
            {
                $scope.permisoUsuario.consultar = true;
            }
        }
    };
    
    $scope.iva = new IVA();
    $scope.nuevoIVA = new IVA();
    
    $scope.GetIVA = function()
    {
        
        GetIVA($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                
                $scope.iva = data[0];
            }
            else
            {
                $scope.iva = new IVA();
            }
        }).catch(function(error)
        {
            $scope.iva = new IVA();
            alert(error);
        });
    };
    
    /*------------ Abrir agregar - editar modulo ----------------------------*/
    $scope.AbrirIVA = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        if($scope.operacion == "Editar")
        {
            $scope.nuevoIVA = SetIVA(objeto);
        }
        
        $('#IVAModal').modal('toggle');
    };
    
    $scope.CerrarIVA = function()
    {
        $scope.mensajeError = [];
    };
    /*-------------------------Terminar Plan de Pago --------------------*/
    $scope.TerminarIVA = function(ivaInvalido, fechaEntregaInvalida)
    {
        if(!$scope.ValidarDatos(ivaInvalido))
        {
            return false;
        }
        else
        {
            if($scope.operacion == "Editar")
            {
                $scope.EditarIVA();
            }
        }
    };
    
    $scope.EditarIVA = function()
    {
        EditarIVA($http, CONFIG, $q, $scope.nuevoIVA).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#IVAModal').modal('toggle');
                $scope.mensaje = "El IVA se edito.";
                $scope.iva = SetIVA($scope.nuevoIVA);
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeVariable').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeVariable').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(ivaInvalido)
    {
        $scope.mensajeError = [];
        if(ivaInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El IVA debe ser un número decimal."; 
            return false;
        }
        else
        {
            return true;
        }

    };
    
    /*---------------------Inicializar Promocion ----------------------*/
    $scope.InicializarPlanPago = function()
    {
        $scope.GetIVA();
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
                    $scope.InicializarPlanPago();
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
                if(!$scope.permisoUsuario.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.InicializarPlanPago();
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