class AcabadoCubierta
{
    constructor()
    {
        this.AcabadoCubiertaId = "";
        this.Nombre = "";
        this.Activo = true;
    }
}

function GetAcabadoCubierta($http, $q, CONFIG)     
{
    var q = $q.defer();
        
    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetAcabadoCubierta',
      }).success(function(data)
        {
            var acabado = []; 
            for(var k=0; k<data.length; k++)
            {
                acabado[k] = SetUbicacionCubierta(data[k]);
            }
    
            q.resolve(acabado);  
        }).error(function(data, status){
            q.resolve([]);
     }); 
    return q.promise;
}

function SetUbicacionCubierta(data)
{
    var acabado = new AcabadoCubierta();
    
    acabado.AcabadoCubiertaId = data.AcabadoCubiertaId;
    acabado.Nombre = data.Nombre;
    acabado.Activo = data.Activo == "1" ? true : false;
    
    return acabado;
}

//agrega un acabado
function AgregarAcabadoCubierta($http, CONFIG, $q, acabado)
{
    var q = $q.defer();
    
    var data = jQuery.extend({}, acabado);
    data.Activo = data.Activo ? "1" : "0";

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarAcabadoCubierta',
          data: data

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


//edita un acabdo
function EditarAcabadoCubierta($http, CONFIG, $q, acabado)
{
    var q = $q.defer();
    
    var data = jQuery.extend({}, acabado);
    data.Activo = data.Activo ? "1" : "0";

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarAcabadoCubierta',
          data: data

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

function ActivarDesactivarAcabadoCubierta($http, $q, CONFIG, datos) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarAcabadoCubierta',
          data: datos

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve([{Estatus: Estatus}]);

     }); 
    
    return q.promise;
}
