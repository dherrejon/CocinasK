class UbicacionCubierta
{
    constructor()
    {
        this.UbicacionCubiertaId = "";
        this.Nombre = "";
        this.Activo = true;
    }
}

function GetUbicacionCubierta($http, $q, CONFIG)     
{
    var q = $q.defer();
        
    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetUbicacionCubierta',
      }).success(function(data)
        {
            var ubicacion = []; 
            for(var k=0; k<data.length; k++)
            {
                ubicacion[k] = new UbicacionCubierta();
                ubicacion[k] = SetUbicacionCubierta(data[k]);
            }
    
            q.resolve(ubicacion);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetUbicacionCubierta(data)
{
    var ubicacion = new UbicacionCubierta();
    
    ubicacion.UbicacionCubiertaId = data.UbicacionCubiertaId;
    ubicacion.Nombre = data.Nombre;
    
    if(data.Activo == "1")
    {
        ubicacion.Activo = true;
    }
    else
    {
        ubicacion.Activo = false;
    }
    
    return ubicacion;
}

function EditarUbicacionFabricacionTipoCubierta($http, CONFIG, $q, ubicacion)
{
    var q = $q.defer();
    
    if(ubicacion.Activo)
    {
        ubicacion.Activo = 1;
    }
    else
    {
        ubicacion.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarUbicacionFabricacionTipoCubierta',
          data: ubicacion

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

function ActivarDesactivarUbicacionCubierta($http, $q, CONFIG, ubicacion) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarUbicacionCubierta',
          data: ubicacion

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}


/*------------ Datos de Ubicacion -------------------------*/
class FabricacionPorUbicacionTipoCubierta
{
    constructor()
    {
        this.FabricacionPorUbicacionTipoCubiertaId = "";
        this.UbicacionCubierta = new UbicacionCubierta();
        this.FabricacionCubierta = new FabricacionCubierta();
        this.TipoCubierta = new TipoCubierta();
    }
}

function GetDatosUbicacion($http, $q, CONFIG, id)     
{
    var q = $q.defer();

    var datos = [];
    datos[0] = id;
        
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetDatosUbicacion',
          data: datos
      }).success(function(data)
        {
            var ubicacion = []; 
            for(var k=0; k<data.length; k++)
            {
                ubicacion[k] = new UbicacionCubierta();
                ubicacion[k] = SetDatosUbicacionCubierta(data[k]);
            }
    
            q.resolve(ubicacion);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetDatosUbicacionCubierta(data)
{
    var ubicacion = new FabricacionPorUbicacionTipoCubierta();
    
    ubicacion.FabricacionPorUbicacionTipoCubiertaId = data.FabricacionPorUbicacionTipoCubierta;
    
    ubicacion.UbicacionCubierta.UbicacionCubiertaId = data.UbicacionCubiertaId;
    
    ubicacion.TipoCubierta.TipoCubiertaId = data.TipoCubiertaId;
    ubicacion.TipoCubierta.Nombre = data.NombreTipo;
    
    ubicacion.FabricacionCubierta.FabricacionCubiertaId = data.FabricacionCubiertaId;
    ubicacion.FabricacionCubierta.Nombre = data.NombreFabricacion;
    
    
    return ubicacion;
}
/*------------- grupo color cubierta-------------------*/
//agregaga un consumible
/*function AgregarGrupoColorCubierta($http, CONFIG, $q, grupo)
{
    var q = $q.defer();
    
    if(grupo.Activo)
    {
        grupo.Activo = 1;
    }
    else
    {
        grupo.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarGrupoColorCubierta',
          data: grupo

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

//edita un consumible
*/