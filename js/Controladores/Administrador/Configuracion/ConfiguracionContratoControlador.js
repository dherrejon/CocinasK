app.controller("ConfiguaracionContratoController", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";
    $scope.permisoUsuario = {
                             conceptoVenta:{consultar:false, agregar:false, editar:false, activar:false},
                             medioPago:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            //concepto de venta
            if($scope.usuarioLogeado.Permiso[k] == "ConCVeConsultar")
            {
                $scope.permisoUsuario.conceptoVenta.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCVeAgregar")
            {
                $scope.permisoUsuario.conceptoVenta.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCVeEditar")
            {
                $scope.permisoUsuario.conceptoVenta.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCVeActivar")
            {
                $scope.permisoUsuario.conceptoVenta.activar= true;
            }
            
            //medio de pago
            else if($scope.usuarioLogeado.Permiso[k] == "ConMPaConsultar")
            {
                $scope.permisoUsuario.medioPago.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMPaAgregar")
            {
                $scope.permisoUsuario.medioPago.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMpaEditar")
            {
                $scope.permisoUsuario.medioPago.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMpaActivar")
            {
                $scope.permisoUsuario.medioPago.activar= true;
            }
        }
    };
    
    $scope.titulo = "Concepto de Venta";
    $scope.tabs = tabConfContrato;
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#ConceptoVenta').show();
                $('#MedioPago').hide();
                break;
            case 1:  
                $('#MedioPago').show();
                $('#ConceptoVenta').hide();
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
                if(!$scope.permisoUsuario.conceptoVenta.consultar && !$scope.permisoUsuario.medioPago.consultar)
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
                if(!$scope.permisoUsuario.conceptoVenta.consultar && !$scope.permisoUsuario.medioPago.consultar)
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
var tabConfContrato = 
    [
        {titulo:"Concepto de Venta", referencia: "#ConceptoVenta", clase:"active", area:"conceptoVenta"},
        {titulo:"Medio de Pago", referencia: "#MedioPago", clase:"", area:"medioPago"}
    ];