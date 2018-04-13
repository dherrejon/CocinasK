app.controller("EncuestaControlador", function($scope, $http, $q, CONFIG, $rootScope, CocinasKService)
{   
    
    $scope.encuesta = [];
    $scope.buscar = "";
    
    $scope.GetEncuesta = function()
    {   
        (self.servicioObj = CocinasKService.Get('GetMedioCaptacion' )).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.encuesta = dataResponse.data;
                
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
});