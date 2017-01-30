/*----------------------------------Material ----------------------------------*/

class Material
{
    constructor()
    {
        this.TipoMaterial = new TipoMaterial();
        this.MaterialId = "";
        this.Nombre = "";
        this.CostoUnidad = ""; 
        this.MaterialDe = "";
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetMaterial($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetMaterial',

      }).success(function(data)
        {
            var material = []; 

            for(var k=0; k<data.length; k++)
            {
                material[k] = new Material();
                material[k] = SetMaterial(data[k]);
            }
            q.resolve(material);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetMaterial(data)
{
    var material = new Material();
    var tipoMaterial = new TipoMaterial();
    
    material.MaterialId = data.MaterialId;
    material.Nombre = data.Nombre;
    material.MaterialDe = data.MaterialDe;
    material.CostoUnidad = parseFloat(data.CostoUnidad);
    
    tipoMaterial.Nombre = data.NombreTipoMaterial;
    tipoMaterial.TipoMaterialId = data.TipoMaterialId;
    
    if(data.DisponibleModulo == "1")
    {
        tipoMaterial.DisponibleModulo = true;
    }
    else
    {
        tipoMaterial.DisponibleModulo = false;
    }
    
    if(data.DisponibleCubierta == "1")
    {
        tipoMaterial.DisponibleCubierta = true;
    }
    else
    {
        tipoMaterial.DisponibleCubierta = false;
    }
    
    material.TipoMaterial = SetTipoMaterial(tipoMaterial);
    
    if(data.Activo == "1")
    {
        material.Activo = true;
    }
    else
    {
        material.Activo = false;
    }
    
    return material;
}

//agrega un material
function AgregarMaterial($http, CONFIG, $q, material)
{
    var q = $q.defer();    

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarMaterial',
          data: material

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

//edita un material
function EditarMaterial($http, CONFIG, $q, material)
{
    var q = $q.defer();
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarMaterial',
          data: material

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


//Activar - Desactivar Material
function ActivarDesactivarMaterial($http, $q, CONFIG, material) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarMaterial',
          data: material

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

/*---------------------------------Tipo de material------------------------------*/
class TipoMaterial
{
    constructor()
    {
        this.TipoMaterialId = "";
        this.Nombre = ""; 
        this.Activo = true; 
        this.DisponibleModulo = false;
        this.DisponibleCubierta = false;
        this.TipoCubierta = new TipoCubierta();
    }
}

//obtiene los tipos de módulos
function GetTipoMaterial($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoMaterial',

      }).success(function(data)
        {
            var tipoMaterial = []; 
            
            for(var k=0; k<data.length; k++)
            {
                tipoMaterial[k] = new TipoMaterial();
                tipoMaterial[k] = SetTipoMaterial(data[k]);
            }
        
            q.resolve(tipoMaterial);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos del tipo modulo
function SetTipoMaterial(data)
{
    var tipoMaterial = new TipoMaterial();
    
    tipoMaterial.TipoMaterialId = data.TipoMaterialId;
    tipoMaterial.Nombre = data.Nombre;
    
    if(data.Activo == "1")
    {
        tipoMaterial.Activo = true;
    }
    else
    {
        tipoMaterial.Activo = false;
    }
    
    if(data.DisponibleModulo == "1")
    {
        tipoMaterial.DisponibleModulo = true;
    }
    else
    {
        tipoMaterial.DisponibleModulo = false;
    }
    
    if(data.DisponibleCubierta == "1")
    {
        tipoMaterial.DisponibleCubierta = true;
    }
    else
    {
        tipoMaterial.DisponibleCubierta = false;
    }

    tipoMaterial.TipoCubierta.TipoCubiertaId = data.TipoCubiertaId;
    tipoMaterial.TipoCubierta.Nombre = data.NombreTipoCubierta;

    return tipoMaterial;
}

//agregaga un tipo de material
function AgregarTipoMaterial($http, CONFIG, $q, tipoMaterial)
{
    var q = $q.defer();
    
    if(tipoMaterial.Activo)
    {
        tipoMaterial.Activo = 1;
    }
    else
    {
        tipoMaterial.Activo = 0;
    }
    
    if(tipoMaterial.DisponibleModulo)
    {
        tipoMaterial.DisponibleModulo = 1;
    }
    else
    {
        tipoMaterial.DisponibleModulo = 0;
    }

    if(tipoMaterial.DisponibleCubierta)
    {
        tipoMaterial.DisponibleCubierta = 1;
    }
    else
    {
        tipoMaterial.DisponibleCubierta = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarTipoMaterial',
          data: tipoMaterial

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

//edita un tipo de material
function EditarTipoMaterial($http, CONFIG, $q, tipoMaterial)
{
    var q = $q.defer();
    
    if(tipoMaterial.Activo)
    {
        tipoMaterial.Activo = 1;
    }
    else
    {
        tipoMaterial.Activo = 0;
    }
    
    if(tipoMaterial.DisponibleModulo)
    {
        tipoMaterial.DisponibleModulo = 1;
    }
    else
    {
        tipoMaterial.DisponibleModulo = 0;
    }

    if(tipoMaterial.DisponibleCubierta)
    {
        tipoMaterial.DisponibleCubierta = 1;
    }
    else
    {
        tipoMaterial.DisponibleCubierta = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarTipoMaterial',
          data: tipoMaterial

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

//Activar - Desactivar Tipo de Material
function ActivarDesactivarTipoMaterial($http, $q, CONFIG, tipoMaterial) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarTipoMaterial',
          data: tipoMaterial

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

/*---------------------------------- Grueso Material ----------------------------------*/

class GruesoMaterial
{
    constructor()
    {
        this.GruesoMaterialId = "";
        this.MaterialId = "";
        this.Grueso = "";
        this.CostoUnidad = ""; 
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetGruesoMaterial($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetGruesoMaterial',

      }).success(function(data)
        {
            var gruesoMaterial = []; 

            for(var k=0; k<data.length; k++)
            {
                gruesoMaterial[k] = new GruesoMaterial();
                gruesoMaterial[k] = SetGruesoMaterial(data[k]);
            }
            q.resolve(gruesoMaterial);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetGruesoMaterial(data)
{
    var gruesoMaterial = new GruesoMaterial();
    
    gruesoMaterial.GruesoMaterialId = data.GruesoMaterialId;
    gruesoMaterial.MaterialId = data.MaterialId;
    gruesoMaterial.Grueso = data.Grueso;
    gruesoMaterial.CostoUnidad = parseFloat(data.CostoUnidad);

    if(data.Activo == "1")
    {
        gruesoMaterial.Activo = true;
    }
    else
    {
        gruesoMaterial.Activo = false;
    }
    
    return gruesoMaterial;
}

//Activar - Desactivar grueso Material
function ActivarDesactivarGruesoMaterial($http, $q, CONFIG, material) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarGruesoMaterial',
          data: material

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

/*-----------------------Material Para-------------------------------------*/

class MaterialPara
{
    constructor()
    {
        this.MaterialParaId = "";
        this.Nombre = "";
    }
}

//obtiene los tipos de módulos
function GetMaterialPara($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetMaterialPara',

      }).success(function(data)
        {
            var materialPara = []; 
            
            for(var k=0; k<data.length; k++)
            {
                materialPara[k] = new MaterialPara();
                materialPara[k] = SetTaterialPara(data[k]);
            }
        
            q.resolve(materialPara);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos del tipo modulo
function SetTaterialPara(data)
{
    var materialPara = new MaterialPara();
    
    materialPara.MaterialParaId = data.MaterialParaId;
    materialPara.Nombre = data.Nombre;
    
    return materialPara;
}


//obtiene los tipos de módulos
function GetTipoMaterialParaModulos($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoMaterialParaModulo',

      }).success(function(data)
        {
            var tipoMaterial = []; 
            
            for(var k=0; k<data.length; k++)
            {
                tipoMaterial[k] = new TipoMaterial();
                tipoMaterial[k] = SetTipoMaterial(data[k]);
            }
        
            q.resolve(tipoMaterial);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//obtiene los tipos de módulos
function GetTipoMaterialParaCubierta($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoMaterialParaCubierta',

      }).success(function(data)
        {
            var tipoMaterial = []; 
            
            for(var k=0; k<data.length; k++)
            {
                tipoMaterial[k] = new TipoMaterial();
                tipoMaterial[k] = SetTipoMaterial(data[k]);
            }
        
            q.resolve(tipoMaterial);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function GetMaterialCubierta($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetMaterialCubierta',

      }).success(function(data)
        {
            var material = []; 

            for(var k=0; k<data.length; k++)
            {
                material[k] = new Material();
                material[k] = SetMaterial(data[k]);
            }
            q.resolve(material);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}
 