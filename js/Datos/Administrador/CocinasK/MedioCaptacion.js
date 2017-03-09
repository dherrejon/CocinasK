/*------Medio Contacto---------*/

class MedioCaptacion
{
    constructor()
    {
        this.MedioCaptacionId = "";
        this.Nombre = "";
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetMedioCaptacion($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetMedioCaptacion',

      }).success(function(data)
        {
            var medioCaptacion = []; 
            
            for(var k=0; k<data.length; k++)
            {
                medioCaptacion[k] = new MedioCaptacion();
                medioCaptacion[k] = SetMedioCaptacion(data[k]);
            }
        
            q.resolve(medioCaptacion);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetMedioCaptacion(data)
{
    var medioCaptacion = new MedioCaptacion();
    
    medioCaptacion.MedioCaptacionId = data.MedioCaptacionId;
    medioCaptacion.Nombre = data.Nombre;
    
    medioCaptacion.Activo = CambiarDatoEnteroABool(data.Activo);
    
    return medioCaptacion;
}

//agregaga un medio de captación
function AgregarMedioCaptacion($http, CONFIG, $q, medio)
{
    var q = $q.defer();
    
    medio.Activo = CambiarDatoBool(medio.Activo);

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarMedioCaptacion',
          data: medio

      }).success(function(data)
        {
            q.resolve(data);
            
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

//edita un medio de captacion
function EditarMedioCaptacion($http, CONFIG, $q, medio)
{
    var q = $q.defer();
    
    medio.Activo = CambiarDatoBool(medio.Activo);

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarMedioCaptacion',
          data: medio

      }).success(function(data)
        {
            q.resolve(data);
            
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

function ActivarDesactivarMedioCaptacion($http, $q, CONFIG, medio) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarMedioCaptacion',
          data: medio

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}


//-------------- Otro -----------------
function GetMedioCaptacionOtro($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetMedioCaptacionOtro',

      }).success(function(data)
        {
            var medioCaptacion = []; 
        
            if(data[0].Estatus == "Exito")
            {
                medioCaptacion = data[1].MedioCaptacion;
            }
        
            q.resolve(medioCaptacion);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function ActualizarMedioCaptacion($http, CONFIG, $q, medio)
{
    var q = $q.defer();
    
    var url = "";
    if(medio.Nuevo)
    {
        url = '/ActualizarMedioCaptacionAgregar';
    }
    else
    {
        url = '/ActualizarMedioCaptacion';
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + url,
          data: medio

      }).success(function(data)
        {
            q.resolve(data);
            
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}