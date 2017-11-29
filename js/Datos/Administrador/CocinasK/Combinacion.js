class CombinacionMaterial
{
    constructor()
    {
        this.CombinacionMaterialId = "";
        this.TipoCombinacion = new TipoCombinacion();
        this.Nombre = "";
        this.Activo = true;
        this.PorDefecto = false;
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
     combinacion.TipoCombinacionId = data.TipoCombinacionId;
    combinacion.TipoCombinacion.TipoCombinacionId = data.TipoCombinacionId;
    combinacion.TipoCombinacion.Nombre = data.NombreTipoCombinacion;
    combinacion.TipoCombinacion.Descripcion = data.Descripcion;
    
    
    if(data.Activo == "1")
    {
        combinacion.Activo = true;
    }
    else
    {
        combinacion.Activo = false;
    }
    
    if(data.PorDefecto == "1")
    {
        combinacion.PorDefecto = true;
    }
    else
    {
        combinacion.PorDefecto = false;
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
    
    if(combinacion.PorDefecto && combinacion.Activo)
    {
        combinacion.PorDefecto = "1";
    }
    else
    {
        combinacion.PorDefecto = "0";
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
    
    if(combinacion.PorDefecto && combinacion.Activo)
    {
        combinacion.PorDefecto = "1";
    }
    else
    {
        combinacion.PorDefecto = "0";
    }
    
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
        this.Puerta = new Puerta();
        this.Grueso = "";
    }
}

function GetCombinacionPorMaterialComponente($http, $q, CONFIG, id, modulo)    // obtener los componentes del módulo
{
    var q = $q.defer();
    
    var dato = [];
    var urlPHP;
    dato[0] = id;
    
    if(modulo == "componente")
    {
        urlPHP ='/GetCombinacionPorMaterialComponentePorComponente';
    }
    else if(modulo == "combinacion") 
    {
        urlPHP ='/GetCombinacionPorMaterialComponente';
    }
    else if(modulo == "puerta") 
    {
        urlPHP ='/GetCombinacionPorMaterialComponentePorPuerta';
    }
    else if(modulo == "puertaCombinacion") 
    {
        urlPHP ='/GetCombinacionPorMaterialComponentePorPuertaCombinacion';
    }
        

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + urlPHP,
          data: dato

      }).success(function(data)
        {
            var combinacionMaterialComponente = []; 
            
            for(var k=0; k<data.length; k++)
            {
                combinacionMaterialComponente[k] = new CombinacionPorMaterialComponente();
                combinacionMaterialComponente[k] = SetCombinacionPorMaterialComponente(data[k], modulo);
            }
        
            q.resolve(combinacionMaterialComponente);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function GetCombinacionMaterialCosto($http, $q, CONFIG)    // obtener los componentes del módulo
{
    var q = $q.defer();
    

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetCombinacionMaterialCosto',

      }).success(function(data)
        {
            q.resolve(data);
            
        }).error(function(data){
            q.resolve([{Estatus: data}]);
     }); 
    
    return q.promise;
}

//copia los datos de una combinacion de materiales por componente
function SetCombinacionPorMaterialComponente(data, modulo)
{
    var combinacion = new CombinacionPorMaterialComponente();
    var material = new Material();
    var componente = new Componente();
    var combinacionMaterial = new CombinacionMaterial();
    var tipoMaterial = new TipoMaterial();
    
    combinacion.CombinacionPorMaterialComponenteId = data.CombinacionPorMaterialComponenteId;
    combinacion.Grueso = data.Grueso;
    combinacion.Descripcion = data.Descripcion;
    
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
    
    if(modulo == "puerta" || modulo=="puertaCombinacion")
    {
        var puerta = new Puerta();
        puerta.Nombre = data.NombrePuerta;
        puerta.PuertaId = data.PuertaId;
        puerta.Activo = data.ActivoPuerta;
        puerta.ComponentePorPuertaId = data.ComponentePorPuertaId;
        combinacion.Puerta = puerta;
        
        combinacion.Componente.ComponenteId = data.ComponenteId2;
    }
    
    return combinacion;
}

/*----------------------------------- Tipo combinacion ---------------------------*/
class TipoCombinacion
{
    constructor()
    {
        this.TipoCombinacionId = "";
        this.Nombre = "";
        this.Descripcion = "";
        this.Activo = true;
    }
}

//obtener combinaciones
function GetTipoCombinacionMaterial($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoCombinacionMaterial',

      }).success(function(data)
        {
            var combinacion = []; 
            
            for(var k=0; k<data.length; k++)
            {
                combinacion[k] = new TipoCombinacion();
                combinacion[k] = SetTipoCombinacion(data[k]);
            }
            q.resolve(combinacion);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de una combinacion de materiales
function SetTipoCombinacion(data)
{
    var tipoCombinacion = new TipoCombinacion();
    
    tipoCombinacion.TipoCombinacionId = data.TipoCombinacionId;
    tipoCombinacion.Nombre = data.Nombre;
    tipoCombinacion.Descripcion = data.Descripcion;
    
    tipoCombinacion.Activo = CambiarDatoEnteroABool(data.Activo);
    
    return tipoCombinacion;
}

function AgregarTipoCombiancion($http, CONFIG, $q, tipo)
{
    var q = $q.defer();   
    
    tipo.Activo = CambiarDatoBool(tipo.Activo);

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarTipoCombiancion',
          data: tipo

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
function EditarTipoCombiancion($http, CONFIG, $q, tipo)
{
    var q = $q.defer();
    
    tipo.Activo = CambiarDatoBool(tipo.Activo);
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarTipoCombiancion',
          data: tipo

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

function ActivarDesactivarTipoCombinacion($http, $q, CONFIG, tipo) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarTipoCombinacion',
          data: tipo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}