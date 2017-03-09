class Muestrario
{
    constructor()
    {
        this.MuestrarioId = "";
        this.TipoMuestrarioId = "";
        this.TipoAccesorio = new TipoAccesorio();
        this.Nombre = "";
        this.Margen = null;
        this.Activo = true;
        this.ActivoN = "1";
        this.PorDefecto = false;
    }
}

function GetMuestrario($http, $q, CONFIG, tipoMuestrario)     
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetMuestrario',
          data: tipoMuestrario

      }).success(function(data)
        {
            var muestrario = []; 

            for(var k=0; k<data.length; k++)
            {
                muestrario[k] = new Muestrario();
                muestrario[k] = SetMuestrario(data[k]);
            }
            q.resolve(muestrario);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetMuestrario(data)
{
    var muestrario= new Muestrario();
    
    muestrario.MuestrarioId = data.MuestrarioId;
    muestrario.TipoMuestrarioId = data.TipoMuestrarioId;
    muestrario.Nombre = data.Nombre;
    muestrario.Margen = parseFloat(data.Margen);
    muestrario.ActivoN = data.Activo;
    
    muestrario.TipoAccesorio.TipoAccesorioId = data.TipoAccesorioId;
    muestrario.TipoAccesorio.Nombre = data.NombreTipoAccesorio;
    
    if(data.Activo == "1")
    {
        muestrario.Activo = true;
    }
    else
    {
        muestrario.Activo = false;
    }
    
    if(data.PorDefecto == "1")
    {
        muestrario.PorDefecto = true;
    }
    else
    {
        muestrario.PorDefecto = false;
    }
    
    return muestrario;
}

//agrega un muestrario
function AgregarMuestrario($http, CONFIG, $q, muestrario)
{
    var q = $q.defer();
    
    if(muestrario.Activo)
    {
        muestrario.Activo = "1";
    }
    else
    {
        muestrario.Activo = "0";
    }
    
    if(muestrario.PorDefecto)
    {
        muestrario.PorDefecto = "1";
    }
    else
    {
        muestrario.PorDefecto = "0";
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarMuestrario',
          data: muestrario

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

//edita un muestrario
function EditarMuestrario($http, CONFIG, $q, muestrario)
{
    var q = $q.defer();
    
    if(muestrario.Activo)
    {
        muestrario.Activo = "1";
    }
    else
    {
        muestrario.Activo = "0";
    }
    
    if(muestrario.PorDefecto)
    {
        muestrario.PorDefecto = "1";
    }
    else
    {
        muestrario.PorDefecto = "0";
    }
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarMuestrario',
          data: muestrario

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

//Activar - Desactivar puerta
function ActivarDesactivarMuestrario($http, $q, CONFIG, puerta) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarMuestrario',
          data: puerta
      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

function GetPuertaPorMuestrario($http, $q, CONFIG, id)
{
    var q = $q.defer();
    
    var muestrarioId = [];
    muestrarioId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetPuertaPorMuestrario',
          data: muestrarioId

      }).success(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                if(data[k].Activo == "1")
                {
                    data[k].Activo = true;
                }
                else
                {
                    data[k].Activo = false;
                }
            }

            q.resolve(data);
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function GetAccesorioPorMuestrario($http, $q, CONFIG, id)
{
    var q = $q.defer();
    
    var muestrarioId = [];
    muestrarioId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetAccesorioPorMuestrario',
          data: muestrarioId

      }).success(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                if(data[k].Activo == "1")
                {
                    data[k].Activo = true;
                }
                else
                {
                    data[k].Activo = false;
                }
            }

            q.resolve(data);
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}
