class CombinacionMaterial
{
    constructor()
    {
        this.CombinacionMaterialId = "";
        this.Nombre = "";
        this.Activo = true;
        this.ActivoN = 1;
    }
}

//obtener combinaciones
function GetCombinacionMaterial($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetCombinacionMaterial',

      }).success(function(data)
        {
            var combinacion = []; 
            
            for(var k=0; k<data.length; k++)
            {
                combinacion[k] = new CombinacionMaterial();
                combinacion[k] = SetCombinacionMaterial(data[k]);
            }
        
            q.resolve(combinacion);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de una combinacion de materiales
function SetCombinacionMaterial(data)
{
    var combinacion = new CombinacionMaterial();
    
    combinacion.CombinacionMaterialId = data.CombinacionMaterialId;
    combinacion.Nombre = data.Nombre;
    combinacion.ActivoN = data.Activo;
    if(data.Activo == "1")
    {
        combinacion.Activo = true;
    }
    else
    {
        combinacion.Activo = false;
    }
    
    return combinacion;
}

//agrega una combinación de materiales
function AgregarCombinacionMaterial($http, CONFIG, $q, combinacion)
{
    var q = $q.defer();   
    
    if(combinacion.Activo)
    {
        combinacion.Activo = "1";
    }
    else
    {
        combinacion.Activo = "0";
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarCombinacionMaterial',
          data: combinacion

      }).success(function(data)
        {
            q.resolve("Exitoso");
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

//edita una combinacion de materiales
function EditarCombinacionMaterial($http, CONFIG, $q, combinacion)
{
    var q = $q.defer();
    
    if(combinacion.Activo)
    {
        combinacion.Activo = "1";
    }
    else
    {
        combinacion.Activo = "0";
    }
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarCombinacionMaterial',
          data: combinacion

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

function ActivarDesactivarCombinacionMaterial($http, $q, CONFIG, combinacion) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarCombinacionMaterial',
          data: combinacion

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}


/*----------------------------CombinacionPorMaterialComponente-----------------------------------*/
class CombinacionPorMaterialComponente
{
    constructor()
    {
        this.CombinacionPorMaterialComponenteId = "";
        this.Material = new Material();
        this.Componente = new Componente();
        this.CombinacionMaterial = new CombinacionMaterial();
        this.Grueso = "";
    }
}

//obtener combinaciones por material componente
function GetCombinacionPorMaterialComponente($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetCombinacionPorMaterialComponente',

      }).success(function(data)
        {
            var combinacionPorMaterial = []; 
            
            for(var k=0; k<data.length; k++)
            {
                combinacionPorMaterial[k] = new CombinacionPorMaterialComponente();
                combinacionPorMaterial[k] = SetCombinacionPorMaterialComponente(data[k]);
            }
        
            q.resolve(combinacionPorMaterial);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de una combinacion de materiales por componente
function SetCombinacionPorMaterialComponente(data)
{
    var combinacion = new CombinacionPorMaterialComponente();
    var material = new Material();
    var componente = new Componente();
    var combinacionMaterial = new CombinacionMaterial();
    var tipoMaterial = new TipoMaterial();
    
    combinacion.CombinacionPorMaterialComponenteId = data.CombinacionPorMaterialComponenteId;
    combinacion.Grueso = data.Grueso;
    
    tipoMaterial.TipoMaterialId = data.TipoMaterialId;
    tipoMaterial.Nombre = data.NombreTipoMaterial;
    
    material.MaterialId = data.MaterialId;
    material.Nombre = data.NombreMaterial;
    material.TipoMaterial = tipoMaterial;
    
    componente.ComponenteId = data.ComponenteId;
    componente.Nombre = data.NombreComponente;
    if(data.ActivoComponente == "1")
    {
        componente.Activo = true;
    }
    else
    {
        componente.Activo = false;
    }
    
    combinacionMaterial.CombinacionMaterialId = data.CombinacionMaterialId;
    combinacionMaterial.Nombre = data.Nombre;
    
    if(data.ActivoCombinacionMaterial == "1")
    {
        combinacionMaterial.Activo = true;
    }
    else
    {
        combinacionMaterial.Activo = false;
    }
    
    combinacion.Material = material;
    combinacion.Componente = componente;
    combinacion.CombinacionMaterial = combinacionMaterial;
    
    return combinacion;
}
