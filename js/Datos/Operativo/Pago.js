/*--------------------------------- Pago ------------------------------*/
class Pago
{
    constructor()
    {
        this.PagoId = "";
        this.Pago = "";
        this.MedioPago = new MedioPago();
        this.Fecha = "";
        this.Hora = "";
    }
}

function GetReportePago($http, $q, CONFIG, datos)     
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetReportePago',
          data: datos

      }).success(function(data)
        {
              q.resolve(data);
        }).error(function(data, status){
            q.resolve([]);
     }); 
    return q.promise;
}


