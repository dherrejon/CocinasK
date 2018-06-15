app.controller("CostoConsumoPresupuesto", function($scope, $rootScope, datosUsuario, $window, datosUsuario, COSCONPRESUPUESTO, CocinasKService)
{   
    $scope.permiso = {ver: false};
    $scope.presupuesto = [];
    $scope.combinacion = [];
    $scope.material = [];

    //------------ Cargar Catalogos --------------------
    $scope.CargarCatalagosInicio = function()
    {
        //$scope.presupuesto = COSCONPRESUPUESTO.GetPresupuesto();
        $scope.presupuesto = ["101", "336", "337"];
        $scope.GetCatalogosCostoConsumo();
        $scope.GetModuloPresupuesto();
        
       // console.log($scope.presupuesto);
    };
    
    $scope.GetCatalogosCostoConsumo = function()
    {   
        (self.servicioObj = CocinasKService.Post('CostoConsumo', $scope.presupuesto)).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.combinacion = dataResponse.data.combinacion;
                $scope.material = dataResponse.data.material;
            
                console.log($scope.combinacion);
                console.log($scope.material);
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede cargar la información.", 'error');
                $scope.encuesta = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
    $scope.GetModuloPresupuesto = function()
    {   
        (self.servicioObj = CocinasKService.Post('CostoConsumo/Modulo', $scope.presupuesto)).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                console.log(dataResponse.data.modulo);
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede cargar la información.", 'error');
                $scope.encuesta = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
    /*------------------  Valida el inicio de sesion y los permisos -------------------*/
    $scope.Inicializar = function()
    {
        $scope.IdentificarPermisos();
        
        if(!$scope.permiso.ver)
        {
            $rootScope.IrAHomePerfil($scope.usuario.PerfilSeleccionado);
        }
        else
        {
            $scope.CargarCatalagosInicio();
        }
    };
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuario.Permiso.length; k++)
        {
            if($scope.usuario.Permiso[k] == "OpeCCPConsultar")
            {
                $scope.permiso.ver = true;
            }
        }
    };
    
        //----- Valida si el usuario esta cargando
    $scope.usuario =  datosUsuario.getUsuario(); 
    
    if($scope.usuario !== null)
    {
        if($scope.usuario.SesionIniciada)
        {
            if($scope.usuario.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            } 
            else if($scope.usuario.PerfilSeleccionado == "Operativo")
            {
                $scope.Inicializar();
            }
            else
            {
                $rootScope.VolverAHome($scope.usuario.PerfilSeleccionado);
            }
        }
        else
        {
            $window.location = "#Login";
        }
    }
    
        //Se manda a llamar cada ves que los datos de un usuario han cambiado
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuario =  datosUsuario.getUsuario();
    
        if($scope.usuario.SesionIniciada)
        {
            if($scope.usuario.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            } 
            else if($scope.usuario.PerfilSeleccionado == "Operativo")
            {
                $scope.Inicializar();
            }
            else
            {
                $rootScope.VolverAHome($scope.usuario.PerfilSeleccionado);
            }
        }
        else
        {
            $window.location = "#Login";
        }
    });
    
});





