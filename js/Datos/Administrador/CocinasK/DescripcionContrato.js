class DescripcionContrato
{
    constructor()
    {
        this.DescripcionContratoId = "";
        this.Descripcion = "";
        this.Activo = true;
        
        this.TipoVentaId = "";
        this.TipoVentaNombre  = "";
    }
}

function GetDescripcionContrato($http, $q, CONFIG)     
{
    var q = $q.defer();
        
    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetDescripcionContrato',
      }).success(function(data)
        {
            var desc = []; 
            for(var k=0; k<data.length; k++)
            {
                desc[k] = SetDescripcionContrato(data[k]);
            }
    
            q.resolve(desc);  
        }).error(function(data, status){
            q.resolve([]);
     }); 
    return q.promise;
}

function SetDescripcionContrato(data)
{
    var desc = new DescripcionContrato();
    
    desc.DescripcionContratoId = data.DescripcionContratoId;
    desc.Descripcion = data.Descripcion;
    desc.Activo = data.Activo == "1" ? true : false;
    
    desc.TipoVentaId = data.TipoVentaId;
    desc.TipoVentaNombre = data.TipoVentaNombre;
    
    return desc;
}

//agrega un acabado
function AgregarDescripcionContrato($http, CONFIG, $q, data)
{
    var q = $q.defer();
    
    data.Activo = data.Activo ? "1" : "0";

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarDescripcionContrato',
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
function EditarDescripcionContrato($http, CONFIG, $q, data)
{
    var q = $q.defer();
    
    data.Activo = data.Activo ? "1" : "0";

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarDescripcionContrato',
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

function ActivarDesactivarDescripcion($http, $q, CONFIG, datos) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarDescripcion',
          data: datos

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve([{Estatus: Estatus}]);

     }); 
    
    return q.promise;
}
