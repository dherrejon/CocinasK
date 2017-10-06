/*------Medio Contacto---------*/

class MedioPago
{
    constructor()
    {
        this.MedioPagoId = "";
        this.Nombre = "";
        this.Defecto = false;
        this.Activo = true;
    }
}

//obtiene los tipos de módulos
function GetMedioPago($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetMedioPago',

      }).success(function(data)
        {
            var medioPago = []; 
            
            if(data[0].Estatus == "Exito")
            {
                for(var k=0; k<data[1].MedioPago.length; k++)
                {
                    medioPago[k] = SetMedioPago(data[1].MedioPago[k]);
                }
            }
        
            q.resolve(medioPago);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetMedioPago(data)
{
    var medioPago = new MedioPago();
    
    medioPago.MedioPagoId = data.MedioPagoId;
    medioPago.Nombre = data.Nombre;
    
    medioPago.Activo = CambiarDatoEnteroABool(data.Activo);
    medioPago.Defecto = CambiarDatoEnteroABool(data.Defecto);
    
    return medioPago;
}

//agregaga un tipo de proyecto
function AgregarMedioPago($http, CONFIG, $q, medio)
{
    var q = $q.defer();
    
    medio.Activo = CambiarDatoBool(medio.Activo);
    medio.Defecto = CambiarDatoBool(medio.Defecto);

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarMedioPago',
          data: medio

      }).success(function(data)
        {
            
            if(data[0].Estatus == "Exitoso") 
            {
                q.resolve(data);
            }
            else
            {
                q.resolve([{Estatus:"Fallo"}]);
            }
            
        }).error(function(data, status){
            q.resolve([{Estatus:status}]);

     }); 
    return q.promise;
}

//edita un servicio
function EditarMedioPago($http, CONFIG, $q, medio)
{
    var q = $q.defer();
    
    medio.Activo = CambiarDatoBool(medio.Activo);
    medio.Defecto = CambiarDatoBool(medio.Defecto);

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarMedioPago',
          data: medio

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

function ActivarDesactivarMedioPago($http, $q, CONFIG, medioPago) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarMedioPago',
          data: medioPago

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(data);

     }); 
    
    return q.promise;
}