class TipoGrupo
{
    constructor()
    {
        this.TipoGrupoId = "";
        this.Nombre = "";
    }
}

class Grupo
{
    constructor()
    {
        this.GrupoId = "";
        this.TipoGrupo = new TipoGrupo();
        this.Nombre = "";
        this.Activo = true;
    }
}

function GetGrupo($http, $q, CONFIG, id)     
{
    var q = $q.defer();

    var datos = [];
    datos[0] = id;
        
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetGrupo',
          data: datos
      }).success(function(data)
        {
            var grupo = []; 
            for(var k=0; k<data.length; k++)
            {
                grupo[k] = new Grupo();
                grupo[k] = SetGrupo(data[k]);
            }
    
            q.resolve(grupo);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetGrupo(data)
{
    var grupo = new Grupo();
    var tipoGrupo = new TipoGrupo();
    
    tipoGrupo.TipoGrupoId = data.TipoGrupoId;
    tipoGrupo.Nombre = data.NombreTipoGrupo;
    
    grupo.GrupoId = data.GrupoId;
    grupo.Nombre = data.Nombre;
    grupo.TipoGrupo = tipoGrupo;
    
    if(data.Activo == "1")
    {
        grupo.Activo = true;
    }
    else
    {
        grupo.Activo = false;
    }
    
    return grupo;
}

function ActivarDesactivarGrupo($http, $q, CONFIG, grupo) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarGrupo',
          data: grupo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}


/*------------- grupo color cubierta-------------------*/
//agregaga un consumible
function AgregarGrupoColorCubierta($http, CONFIG, $q, grupo)
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
function EditarGrupoColorCubierta($http, CONFIG, $q, grupo)
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
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarGrupoColorCubierta',
          data: grupo

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