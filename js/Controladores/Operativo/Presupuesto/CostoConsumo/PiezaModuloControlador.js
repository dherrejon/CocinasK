app.controller("PiezaModuloController", function($scope, $rootScope, $window)
{   
    $scope.modulo = null;
    
    
    //Recibir módulo
    $scope.$on('PiezaModulo',function(evento, modulo)
    {
        $scope.modulo = modulo;
        $('#piezaModuloModal').modal('toggle');
    });
    
    
    $scope.CalcularConsumo = function(ancho, largo, cantidad)
    {
        return ((ancho*largo)/144.0)*parseInt(cantidad);
    }
});





