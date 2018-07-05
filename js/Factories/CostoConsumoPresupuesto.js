app.factory('COSCONPRESUPUESTO',function($rootScope)
{
    var service = {};
    service.presupuesto = null;

    service.SetPresupuesto = function(presupuesto)
    {
        this.presupuesto = presupuesto;
    };

    service.GetPresupuesto = function()
    {
        return this.presupuesto;
    };

    return service;
});

app.filter('decimal', function () 
{
    return function (valor) 
    {
        if(valor)
        {
            return valor.toFixed(2);
        }
        else
        {
            return '';
        }
    };
});