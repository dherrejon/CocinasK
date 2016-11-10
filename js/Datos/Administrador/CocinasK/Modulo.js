/*---------------------------------Tipo de módulo------------------------------*/
class TipoModulo
{
    constructor()
    {
        this.TipoModuloId = "";
        this.Nombre = ""; 
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetTipoModulo($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoModulo',

      }).success(function(data)
        {
            var tipoModulo = []; 
            
            for(var k=0; k<data.length; k++)
            {
                tipoModulo[k] = new TipoModulo();
                tipoModulo[k] = SetTipoModulo(data[k]);
            }
        
            q.resolve(tipoModulo);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos del tipo modulo
function SetTipoModulo(data)
{
    var tipoModulo = new TipoModulo();
    
    tipoModulo.TipoModuloId = data.TipoModuloId;
    tipoModulo.Nombre = data.Nombre;
    
    if(data.Activo == "1")
    {
        tipoModulo.Activo = true;
    }
    else
    {
        tipoModulo.Activo = false;
    }
    
    return tipoModulo;
}

//agregaga un tipo de módulo
function AgregarTipoModulo($http, CONFIG, $q, tipoModulo)
{
    var q = $q.defer();
    
    if(tipoModulo.Activo)
    {
        tipoModulo.Activo = 1;
    }
    else
    {
        tipoModulo.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarTipoModulo',
          data: tipoModulo

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

//edita un tipo de unidad de negocio
function EditarTipoModulo($http, CONFIG, $q, tipoModulo)
{
    var q = $q.defer();
    
    if(tipoModulo.Activo)
    {
        tipoModulo.Activo = 1;
    }
    else
    {
        tipoModulo.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarTipoModulo',
          data: tipoModulo

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

//Activar - Desactivar Tipo de Módulo
function ActivarDesactivarTipoModulo($http, $q, CONFIG, tipoModulo) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarTipoModulo',
          data: tipoModulo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

