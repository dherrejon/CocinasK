/*------Medio Contacto---------*/

class Maqueo
{
    constructor()
    {
        this.MaqueoId = "";
        this.Grupo = new Grupo();
        this.Nombre = ""; 
        this.CostoUnidad = 0; 
        this.PrecioVenta = 0; 
        this.PorDefecto = true; 
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetMaqueo($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetMaqueo',

      }).success(function(data)
        {
            var maqueo = []; 
            for(var k=0; k<data.length; k++)
            {
                maqueo[k] = new Maqueo();
                maqueo[k] = SetMaqueo(data[k]);
            }
    
            q.resolve(maqueo);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetMaqueo(data)
{
    var maqueo = new Maqueo();
    
    maqueo.MaqueoId = data.MaqueoId;
    maqueo.Nombre = data.Nombre;
    maqueo.CostoUnidad = parseFloat(data.CostoUnidad);
    maqueo.PrecioVenta = parseFloat(data.PrecioVenta);
    
    maqueo.Grupo.GrupoId = data.GrupoId;
    maqueo.Grupo.Nombre = data.NombreGrupo;
    
    if(data.Activo == "1")
    {
        maqueo.Activo = true;
    }
    else
    {
        maqueo.Activo = false;
    }
    
    if(data.PorDefecto == "1")
    {
        maqueo.PorDefecto = true;
    }
    else
    {
        maqueo.PorDefecto = false;
    }
    
    
    return maqueo;
}

//agregaga un maqueo
function AgregarMaqueo($http, CONFIG, $q, maqueo)
{
    var q = $q.defer();
    
    if(maqueo.Activo)
    {
        maqueo.Activo = 1;
    }
    else
    {
        maqueo.Activo = 0;
    }
    
    if(maqueo.PorDefecto)
    {
        maqueo.PorDefecto = 1;
    }
    else
    {
        maqueo.PorDefecto = 0;
    }


    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarMaqueo',
          data: maqueo

      }).success(function(data)
        {
            q.resolve(data);
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

//edita un consumible
function EditarMaqueo($http, CONFIG, $q, maqueo)
{
    var q = $q.defer();
    
    if(maqueo.Activo)
    {
        maqueo.Activo = 1;
    }
    else
    {
        maqueo.Activo = 0;
    }
    
    if(maqueo.PorDefecto)
    {
        maqueo.PorDefecto = 1;
    }
    else
    {
        maqueo.PorDefecto = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarMaqueo',
          data: maqueo

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

function ActivarDesactivarMaqueo($http, $q, CONFIG, maqueo) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarMaqueo',
          data: maqueo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}


  