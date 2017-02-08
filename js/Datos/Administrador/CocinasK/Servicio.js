/*------Medio Contacto---------*/

class Servicio
{
    constructor()
    {
        this.ServicioId = "";
        this.Nombre = "";
        this.CostoUnidad = 0;
        this.PrecioVenta = 0;
        this.Activo = true; 
        this.Obligatorio = true; 
    }
}

//obtiene los tipos de módulos
function GetServicio($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetServicio',

      }).success(function(data)
        {
            var servicio = []; 
            
            for(var k=0; k<data.length; k++)
            {
                servicio[k] = new Servicio();
                servicio[k] = SetServicio(data[k]);
            }
        
            q.resolve(servicio);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetServicio(data)
{
    var servicio = new Servicio();
    
    servicio.ServicioId = data.ServicioId;
    servicio.Nombre = data.Nombre;
    servicio.CostoUnidad = parseFloat(data.CostoUnidad);
    servicio.PrecioVenta = parseFloat(data.PrecioVenta);
    
    if(data.Activo == "1")
    {
        servicio.Activo = true;
    }
    else
    {
        servicio.Activo = false;
    }
    
    if(data.Obligatorio == "1")
    {
        servicio.Obligatorio = true;
    }
    else
    {
        servicio.Obligatorio = false;
    }
    
    
    return servicio;
}

//agregaga un servicio
function AgregarServicio($http, CONFIG, $q, servicio)
{
    var q = $q.defer();
    
    if(servicio.Activo)
    {
        servicio.Activo = 1;
    }
    else
    {
        servicio.Activo = 0;
    }
    
    if(servicio.Obligatorio)
    {
        servicio.Obligatorio = 1;
    }
    else
    {
        servicio.Obligatorio = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarServicio',
          data: servicio

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

//edita un servicio
function EditarServicio($http, CONFIG, $q, servicio)
{
    var q = $q.defer();
    
    if(servicio.Activo)
    {
        servicio.Activo = 1;
    }
    else
    {
        servicio.Activo = 0;
    }
    
    if(servicio.Obligatorio)
    {
        servicio.Obligatorio = 1;
    }
    else
    {
        servicio.Obligatorio = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarServicio',
          data: servicio

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

function ActivarDesactivarServicio($http, $q, CONFIG, color) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarServicio',
          data: color

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}