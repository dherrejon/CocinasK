/*----------------------------------Material ----------------------------------*/

class Consumible
{
    constructor()
    {
        this.ConsumibleId;
        this.MaterialId = "";
        this.Nombre = "";
        this.Costo = ""; 
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetConsumible($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetConsumible',

      }).success(function(data)
        {
            var consumible = []; 

            for(var k=0; k<data.length; k++)
            {
                consumible[k] = new Consumible();
                consumible[k] = SetConsumible(data[k]);
            }
            q.resolve(consumible);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetConsumible(data)
{
    var consumible = new Consumible();
    
    consumible.ConsumibleId = data.ConsumibleId;
    consumible.Nombre = data.Nombre;
    consumible.Costo = parseFloat(data.Costo);
    
    
    if(data.Activo == "1")
    {
        consumible.Activo = true;
    }
    else
    {
        consumible.Activo = false;
    }
    
    return consumible;
}

//agregaga un consumible
function AgregarConsumible($http, CONFIG, $q, consumible)
{
    var q = $q.defer();
    
    if(consumible.Activo)
    {
        consumible.Activo = 1;
    }
    else
    {
        consumible.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarConsumible',
          data: consumible

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

//edita un consumible
function EditarConsumible($http, CONFIG, $q, consumible)
{
    var q = $q.defer();
    
    if(consumible.Activo)
    {
        consumible.Activo = 1;
    }
    else
    {
        consumible.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarConsumible',
          data: consumible

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


function ActivarDesactivarConsumible($http, $q, CONFIG, combinacion) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarConsumible',
          data: combinacion

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

