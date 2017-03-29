app.controller("ClienteControlador", function($scope, $rootScope, CITA, $http, $q, CONFIG)
{   
    $rootScope.clasePrincipal = "";
    
    $scope.cliente = [];
    $scope.buscarCliente = "";
    $scope.unidadNegocio = [];
    
    $scope.ordenarPor = "PrimerApellidoA";
    
    $scope.buscarUnidad = "";
    
    
    //---------------- Catálogos -----------
    $scope.GetCliente = function()
    {
        GetCliente($http, $q, CONFIG).then(function(data)
        {
            $scope.datoCliente = data;

            for(var k=0; k<$scope.datoCliente.length; k++)
            {
                $scope.datoCliente[k].NombreA = $scope.QuitarAcento($scope.datoCliente[k].Nombre);
                $scope.datoCliente[k].PrimerApellidoA = $scope.QuitarAcento($scope.datoCliente[k].PrimerApellido);
                $scope.datoCliente[k].SegundoApellidoA = $scope.QuitarAcento($scope.datoCliente[k].SegundoApellido);
            }
            
            var sql = "Select DISTINCT PersonaId, Nombre, PrimerApellido, SegundoApellido, NombreA, PrimerApellidoA, SegundoApellidoA  FROM ? ";
            $scope.cliente = alasql(sql,[$scope.datoCliente]);

            
        }).catch(function(error)
        {
            $scope.cliente = [];
            alert(error);
        });
    };
    
    
    $scope.QuitarAcento = function(data)
    {
        var texto;
        texto = data.replace(/[Ááàäâ]/g, "a");
        texto = texto.replace(/[Ééèëê]/g, "e");
        texto = texto.replace(/[Ííìïî]/g, "i");
        texto = texto.replace(/[Óóòôö]/g, "o");
        texto = texto.replace(/[Úúùüü]/g, "u");
        texto = texto.toUpperCase();
        
        return texto;
    };
    
    $scope.GetUnidadNegocio = function()
    {
        GetUnidadNegocioSencilla($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {   
                $scope.unidadNegocio = data;
            }
            else
            {
                $scope.unidadNegocio = [];
            }
        }).catch(function(error)
        {
            $scope.unidadNegocio = [];
            alert(error);
        });
    };
    
    //------------------ Ordenar -------------------------
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
    
    //-------------- Filtrar ---------------------------
    $scope.LimpiarFiltro = function()
    {
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            $scope.unidadNegocio[k].Filtro = false;
        }
        
        var sql = "Select DISTINCT PersonaId, Nombre, PrimerApellido, SegundoApellido, NombreA, PrimerApellidoA, SegundoApellidoA FROM ? ";
        $scope.cliente = alasql(sql,[$scope.datoCliente]);
    };
    
    $scope.FitroCliente = function()
    {
        var sql = "Select * FROM ? WHERE ";
        
        var primero = true;
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if($scope.unidadNegocio[k].Filtro )
            {
                if(primero)
                {
                    sql += " UnidadNegocioId = '" + $scope.unidadNegocio[k].UnidadNegocioId + "'";
                    primero = false;
                }
                else
                {
                    sql += " OR UnidadNegocioId = '" + $scope.unidadNegocio[k].UnidadNegocioId + "'";
                }
            }
        }
        
        if(!primero)
        {
            $scope.cliente = alasql(sql,[$scope.datoCliente]);
            sql = "Select DISTINCT PersonaId, Nombre, PrimerApellido, SegundoApellido, NombreA, PrimerApellidoA, SegundoApellidoA FROM ? ";
            $scope.cliente = alasql(sql,[$scope.cliente]);
        }
        else
        {
            sql = "Select DISTINCT PersonaId, Nombre, PrimerApellido, SegundoApellido, NombreA, PrimerApellidoA, SegundoApellidoA FROM ? ";
            $scope.cliente = alasql(sql,[$scope.datoCliente]);
        }
    };
    
    //---------------------- Inicializar Cliente -------------------------------
    $scope.GetCliente();
    $scope.GetUnidadNegocio();
});
