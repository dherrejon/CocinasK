/*------Variables del sistema---------*/

class IVA
{
    constructor()
    {
        this.IVAId = "";
        this.IVA = 0;
        this.Incluye = "1";
    }
}

//obtiene los tipos de módulos
function GetIVA($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetIVA',

      }).success(function(data)
        {
            var iva = []; 
            
            for(var k=0; k<data.length; k++)
            {
                iva[k] = new IVA();
                iva[k] = SetIVA(data[k]);
            }
        
            q.resolve(iva);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetIVA(data)
{
    var iva = new IVA();
    
    iva.IVAId = data.IVAId;
    iva.IVA = parseFloat(data.IVA);
    
    iva.Incluye = CambiarDatoEnteroABool(data.Incluye);
    
    return iva;
}

function EditarIVA($http, CONFIG, $q, iva)
{
    var q = $q.defer();
    
    iva.Incluye = CambiarDatoBool(iva.Incluye);

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarIVA',
          data: iva

      }).success(function(data)
        {
            
            if(data[0].Estatus == "Exitoso") 
            {
                q.resolve("Exitoso");
            }
            else
            {
                q.resolve("Fallido");
            }
            
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}