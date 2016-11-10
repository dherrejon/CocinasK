class Plaza
{
    constructor()
    {
        this.PlazaId = "";
        this.Estado = "";
        this.Municipio = "";
        this.Ciudad = "";
        this.Activo = true;
        this.ActivoN = 1;
        this.TerritorioId = "";
        this.NombreTerritorio = "";
        this.UnidadNegocioId = "";
        this.NombreUnidadNegocio = "";
        this.Margen = "";
        this.TipoUnidadNegocioId = "";
        this.NombreTipoUnidadNegocio = "";
    }
}

//obtiene las plazas
function GetPlaza($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetPlaza',

      }).success(function(data)
        {
            var plaza = []; 
            
            for(var k=0; k<data.length; k++)
            {
                plaza[k] = new Plaza();
                plaza[k] = SetPlaza(data[k]);
            }
        
            q.resolve(plaza);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de la plaza
function SetPlaza(data)
{
    var plaza = new Plaza();
    
    plaza.PlazaId = data.PlazaId;
    plaza.Estado = data.Estado;
    plaza.Municipio = data.Municipio;
    plaza.Ciudad = data.Ciudad;
    plaza.TerritorioId = data.TerritorioId;
    plaza.NombreTerritorio = data.NombreTerritorio;
    plaza.UnidadNegocioId = data.UnidadNegocioId;
    plaza.NombreUnidadNegocio = data.NombreUnidadNegocio;
    plaza.ActivoN = data.Activo;
    plaza.Margen = data.Margen;
    plaza.TipoUnidadNegocioId = data.TipoUnidadNegocioId;
    plaza.NombreTipoUnidadNegocio = data.NombreTipoUnidadNegocio;
    
    if(data.Activo == "1")
    {
        plaza.Activo = true;
    }
    else
    {
        plaza.Activo = false;
    }
    
    return plaza;
}

//agrega una plaza
function AgregarPlaza($http, CONFIG, $q, plaza)
{
    var q = $q.defer();
    
    if(plaza.Activo)
    {
        plaza.Activo = 1;
    }
    else
    {
        plaza.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarPlaza',
          data: plaza

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

//edita una plaza
function EditarPlaza($http, CONFIG, $q, plaza)
{
    var q = $q.defer();
    
    if(plaza.Activo)
    {
        plaza.Activo = 1;
    }
    else
    {
        plaza.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarPlaza',
          data: plaza

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

//Activar - Desactivar plaza
function ActivarDesactivarPlaza($http, $q, CONFIG, plaza) 
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarPlaza',
          data: plaza

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, status){
            q.resolve(status);

     }); 
    
    return q.promise;
}