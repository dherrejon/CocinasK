class FabricacionCubierta
{
    constructor()
    {
        this.FabricacionCubiertaId = "";
        this.Nombre = "";
        this.Activo = true;
    }
}

function GetFabricacionCubierta($http, $q, CONFIG)     
{
    var q = $q.defer();
        
    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetFabricacionCubierta',
      }).success(function(data)
        {
            var fabricacion = []; 
            for(var k=0; k<data.length; k++)
            {
                fabricacion[k] = new FabricacionCubierta();
                fabricacion[k] = SetFabricacionCubierta(data[k]);
            }
    
            q.resolve(fabricacion);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetFabricacionCubierta(data)
{
    var fabricacion = new FabricacionCubierta();
    
    fabricacion.FabricacionCubiertaId = data.FabricacionCubiertaId;
    fabricacion.Nombre = data.Nombre;
    
    if(data.Activo == "1")
    {
        fabricacion.Activo = true;
    }
    else
    {
        fabricacion.Activo = false;
    }
    
    return fabricacion;
}

function AgregarFabricacionCubierta($http, CONFIG, $q, fabricacion)
{
    var q = $q.defer();
    
    if(fabricacion.Activo)
    {
        fabricacion.Activo = 1;
    }
    else
    {
        fabricacion.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarFabricacionCubierta',
          data: fabricacion

      }).success(function(data)
        {
            
            if(data[0].Estatus == "Exitoso") 
            {
                q.resolve(data);
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
function EditarFabricacionCubierta($http, CONFIG, $q, fabricacion)
{
    var q = $q.defer();
    
    if(fabricacion.Activo)
    {
        fabricacion.Activo = 1;
    }
    else
    {
        fabricacion.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarFabricacionCubierta',
          data: fabricacion

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

function ActivarDesactivarFabricacionCubierta($http, $q, CONFIG, fabricacion) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarFabricacionCubierta',
          data: fabricacion

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

/*--------------- Consumible por fabricacion ---------------------*/
function GetConsumiblePorFabricacion($http, $q, CONFIG, id)     
{
    var q = $q.defer();

    var datos = [];
    datos[0] = id;
        
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetConsumiblePorFabricacion',
          data: datos
      }).success(function(data)
        {
            var consumible = []; 
            for(var k=0; k<data.length; k++)
            {
                consumible[k] = new Consumible();
                consumible[k] = SetConsumible(data[k]);
                consumible[k].Cantidad = parseInt(data[k].Cantidad);
            }
    
            q.resolve(consumible);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}