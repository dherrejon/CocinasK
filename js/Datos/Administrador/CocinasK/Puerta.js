class Puerta
{
    constructor()
    {
        this.PuertaId = "";
        this.Muestrario = new Muestrario();
        this.Nombre = "";
        this.Activo = true;
        this.ActivoN = "1";
    }
}

function GetPuerta($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetPuerta',

      }).success(function(data)
        {
            var puerta = []; 

            for(var k=0; k<data.length; k++)
            {
                puerta[k] = new Puerta();
                puerta[k] = SetPuerta(data[k]);
            }
            q.resolve(puerta);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetPuerta(data)
{
    var muestrario= new Muestrario();
    var puerta = new Puerta();
    
    muestrario.MuestrarioId = data.MuestrarioId;
    muestrario.Nombre = data.NombreMuestrario;
    
    puerta.PuertaId = data.PuertaId;
    puerta.Nombre = data.Nombre;
    puerta.ActivoN = data.Activo;
    puerta.Muestrario = muestrario;
    
    if(data.Activo == "1")
    {
        puerta.Activo = true;
    }
    else
    {
        puerta.Activo = false;
    }
    
    return puerta;
}

function AgregarPuerta($http, CONFIG, $q, puerta)
{
    var q = $q.defer();
    
    if(puerta.Activo)
    {
        puerta.Activo = 1;
    }
    else
    {
        puerta.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarPuerta',
          data: puerta

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

//edita una puerta
function EditarPuerta($http, CONFIG, $q, puerta)
{
    var q = $q.defer();
    
    if(puerta.Activo)
    {
        puerta.Activo = 1;
    }
    else
    {
        puerta.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarPuerta',
          data: puerta

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

//Activar - Desactivar Muestrario
function ActivarDesactivarPuerta($http, $q, CONFIG, muestrario) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarPuerta',
          data: muestrario

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

function GetComponentePorPuerta($http, $q, CONFIG, id)
{
    var q = $q.defer();
    
    var puertaId = [];
    puertaId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetComponentePorPuerta',
          data: puertaId

      }).success(function(data)
        {
            q.resolve(data);
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function GetComponentesPorPuertaComponente($http, $q, CONFIG)
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetComponentesPorPuertaComponente',

      }).success(function(data)
        {
            q.resolve(data);
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}