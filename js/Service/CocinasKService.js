app.factory('CocinasKService', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) 
{   
    var self = this;
    self.urlBase = getUrlBase();
    self.CocinasKService = {};
    self.tiempoEspera = 120000;
    
    self.CocinasKService.Get = function (metodo) 
    {
        var tiempo = $q.defer();
        var url = self.urlBase + metodo;
        var peticion = $http(
        {
            method: 'GET',
            url: url,
            cache: false,
            timeout: tiempo.promise
        });
        var contador = setTimeout(function () 
        {
            tiempo.resolve();
        }, self.tiempoEspera);

        var promesa = peticion.then(function (respuesta) 
        {
            return respuesta;
        }, function (error) 
        {
            return error;

        });
        promesa.abortar = function () 
        {
            tiempo.resolve();
            clearTimeout(contador);
        };

        promesa.detenerTiempo = function () 
        {
            clearTimeout(contador);
        };
        promesa.finally(function () 
        {
            promesa.abortar = angular.noop;
            clearTimeout(contador);
            peticion = null;
            promesa = null;
            tiempo = null;
        });

        return promesa;
    };
    
    self.CocinasKService.Post = function (url, data) 
    {
        var tiempo = $q.defer();
        var url = self.urlBase + url;
        var peticion = $http(
        {
            method: 'POST',
            data: data,
            headers: {'Content-Type': 'application/json'},
            url: url,
            cache: false,
            timeout: tiempo.promise
        });


        var contador = setTimeout(function () 
        {
            tiempo.resolve();
        }, self.tiempoEspera);

        var promesa = peticion.then(function (respuesta) 
        {
            return respuesta;
        }, function (error) 
        {
            return error;

        });

        promesa.abortar = function () 
        {
            tiempo.resolve();
            clearTimeout(contador);
        };

        promesa.detenerTiempo = function () 
        {
            clearTimeout(contador);
        };

        promesa.finally(function () 
        {
            promesa.abortar = angular.noop;
            clearTimeout(contador);
            peticion = null;
            promesa = null;
            tiempo = null;
        });


        return promesa;
    };

    self.CocinasKService.Put = function (url, data) 
    {
        var tiempo = $q.defer();
        var url = self.urlBase + url;
        var peticion = $http(
        {
            method: 'PUT',
            data: data,
            headers: {'Content-Type': 'application/json'},
            url: url,
            cache: false,
            timeout: tiempo.promise
        });


        var contador = setTimeout(function () 
        {
            tiempo.resolve();
        }, self.tiempoEspera);

        var promesa = peticion.then(function (respuesta) 
        {
            return respuesta;
        }, function (error) 
        {
            return error;

        });

        promesa.abortar = function () 
        {
            tiempo.resolve();
            clearTimeout(contador);
        };

        promesa.detenerTiempo = function () 
        {
            clearTimeout(contador);
        };

        promesa.finally(function () 
        {
            promesa.abortar = angular.noop;
            clearTimeout(contador);
            peticion = null;
            promesa = null;
            tiempo = null;
        });


        return promesa;
    };
    
    self.CocinasKService.Delete = function (url, data) 
    {
        var tiempo = $q.defer();
        var url = self.urlBase + url;
        var peticion = $http(
        {
            method: 'DELETE',
            data: data,
            headers: {'Content-Type': 'application/json'},
            url: url,
            cache: false,
            timeout: tiempo.promise
        });


        var contador = setTimeout(function () 
        {
            tiempo.resolve();
        }, self.tiempoEspera);

        var promesa = peticion.then(function (respuesta) 
        {
            return respuesta;
        }, function (error) 
        {
            return error;

        });

        promesa.abortar = function () 
        {
            tiempo.resolve();
            clearTimeout(contador);
        };

        promesa.detenerTiempo = function () 
        {
            clearTimeout(contador);
        };

        promesa.finally(function () 
        {
            promesa.abortar = angular.noop;
            clearTimeout(contador);
            peticion = null;
            promesa = null;
            tiempo = null;
        });


        return promesa;
    };
    


    return self.CocinasKService;
}]);