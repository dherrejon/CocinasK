class Territorio
{
    constructor()
    {
        this.TerritorioId = "";
        this.Nombre = "";
        this.Margen = "";
        this.Activo = true;
        this.ActivoN = 1;
    }
}

//obtener territorios
function GetTerritorio($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTerritorio',

      }).success(function(data)
        {
            var territorio = []; 
            
            for(var k=0; k<data.length; k++)
            {
                territorio[k] = new Territorio();
                territorio[k] = SetTerritorio(data[k]);
            }
        
            q.resolve(territorio);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un territorio
function SetTerritorio(data)
{
    var territorio = new Territorio();
    
    territorio.TerritorioId = data.TerritorioId;
    territorio.Nombre = data.Nombre;
    territorio.Margen = data.Margen;
    territorio.ActivoN = data.Activo;
    if(data.Activo == "1")
    {
        territorio.Activo = true;
    }
    else
    {
        territorio.Activo = false;
    }
    
    return territorio;
}

//agrega un territorio
function AgregarTerritorio($http, CONFIG, $q, terrirorio)
{
    var q = $q.defer();
    
    if(terrirorio.Activo)
    {
        terrirorio.Activo = 1;
    }
    else
    {
        terrirorio.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarTerritorio',
          data: terrirorio

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

//edita un territorio
function EditarTerritorio($http, CONFIG, $q, terrirorio)
{
    var q = $q.defer();
    
    if(terrirorio.Activo)
    {
        terrirorio.Activo = 1;
    }
    else
    {
        terrirorio.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarTerritorio',
          data: terrirorio

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

//Activar - Desactivar Territorio
function ActivarDesactivarTerritorio($http, $q, CONFIG, territorio) 
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarTerritorio',
          data: territorio

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, status){
            q.resolve(status);

     }); 
    
    return q.promise;
}

 //Obtener las plazas que pertenecen a los territorios
function GetPlazaTerritorio($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    var territorioId = [];
    territorioId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetPlazaTerritorio',
          data: territorioId

      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}