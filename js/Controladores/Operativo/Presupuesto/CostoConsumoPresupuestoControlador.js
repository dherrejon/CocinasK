app.controller("CostoConsumoPresupuesto", function($scope, $rootScope, datosUsuario, $window, datosUsuario, COSCONPRESUPUESTO, CocinasKService)
{   
    $scope.permiso = {ver: false};
    $scope.presupuesto = [];
    $scope.combinacion = [];
    $scope.material = [];
    $scope.modulo = [];
    $scope.puerta = [];

    //------------ Cargar Catalogos --------------------
    $scope.CargarCatalagosInicio = function()
    {
        //$scope.presupuesto = COSCONPRESUPUESTO.GetPresupuesto();
        $scope.presupuesto = ["101", "336", "337"];
        $scope.GetCatalogosCostoConsumo();
        
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
                
                $scope.GetModuloPresupuesto();
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
                $scope.modulo = dataResponse.data.modulo;
                $scope.puerta = dataResponse.data.puerta;
                
                $scope.SetPrecioMaterial();
                //console.log(dataResponse.data.modulo);
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
    
    $scope.SetPrecioMaterial = function()
    {
        //modulo
        for(var i=0; i<$scope.modulo.length; i++) //i->módulo
        {
            //componente
            for(var j=0; j<$scope.modulo[i].Componente.length; j++)  //j-> componente
            {
                for(var k=0; k<$scope.modulo[i].Componente[j].Combinacion.length; k++) //k--> Combinacion
                {
                    var combinacion = $scope.modulo[i].Componente[j].Combinacion[k];
                    combinacion.Costo = $scope.GetCostoMaterial(combinacion.MaterialId, combinacion.Grueso);
                }
            }
            
            //componente especial
            for(var j=0; j<$scope.modulo[i].ComponenteEspecial.length; j++) //j-> componente especial
            {
                 for(var k=0; k<$scope.modulo[i].ComponenteEspecial[j].Combinacion.length; k++) //k--> Combinacion
                {
                    var combinacion = $scope.modulo[i].ComponenteEspecial[j].Combinacion[k];
                    combinacion.Costo = $scope.GetCostoMaterial(combinacion.MaterialId, combinacion.Grueso);
                    
                }
            }
        }
        
        //puerta
        for(var i=0; i<$scope.puerta.length; i++) //i->puerta
        {
            //componente
            for(var j=0; j<$scope.puerta[i].Componente.length; j++)  //j-> componente
            {
                for(var k=0; k<$scope.puerta[i].Componente[j].Combinacion.length; k++) //k--> Combinacion
                {
                    var combinacion = $scope.puerta[i].Componente[j].Combinacion[k];
                    combinacion.Costo = $scope.GetCostoMaterial(combinacion.MaterialId, combinacion.Grueso);
                }
            }
        }
        
         console.log($scope.modulo);
         console.log($scope.puerta);
    };
    
    $scope.GetCostoMaterial = function(id, grueso)
    {
        for(var m=0; m<$scope.material.length; m++) //m-> material
        {
            if(id == $scope.material[m].MaterialId)
            {
                if($scope.material[m].Grueso.length > 0)
                {
                    for(var n=0; n<$scope.material[m].Grueso.length; n++) //n->grueso
                    {
                        if(grueso == $scope.material[m].Grueso[n].Grueso)
                        {
                            return parseFloat($scope.material[m].Grueso[n].CostoUnidad);
                        }
                    }
                }
                else
                {
                    return parseFloat($scope.material[m].CostoUnidad);
                }
            }
        }
        
        return 0;
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





