class Perfil
{
    constructor()
    {
        this.PerfilId = "";
        this.Nombre = ""; 
    }
}

//genera los perfiles que puede tener un usuario
function GetPerfil()
{
    var perfil = [3];
    for(var k=0; k<3; k++)
    {
        perfil[k] = new Perfil();
    }
    
    perfil[0].PerfilId = "1";
    perfil[0].Nombre = "Administrador";
    perfil[1].PerfilId = "2";
    perfil[1].Nombre = "Ejecutivo";
    perfil[2].PerfilId = "3";
    perfil[2].Nombre = "Operativo";
    
    return perfil;
}

//agrega un usuario
function AgregarUsuario($http, CONFIG, $q, usuario)
{
    var q = $q.defer();
    
    if(usuario.colaborador.ActivoUsuario)
    {
        usuario.colaborador.ActivoUsuario = 1;
    }
    else
    {
        usuario.colaborador.ActivoUsuario = 0;
    }
    

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarUsuario',
          data: usuario

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

//edita un usuario
function EditarUsuario($http, CONFIG, $q, usuario)
{
    var q = $q.defer();
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarUsuario',
          data: usuario

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

//Activar - Desactivar usuario
function ActivarDesactivarUsuario($http, $q, CONFIG, usuario) 
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarUsuario',
          data: usuario

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, status){
            q.resolve(status);

     }); 
    
    return q.promise;
}

//cambia la contraseña de un usuario
function CambiarPassword($http, CONFIG, $q, usuario)
{
    var q = $q.defer();

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/CambiarPassword',
          data: usuario

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

// obtener los perfiles del usuario
function GetPerfilPorUsuario($http, $q, CONFIG, id)   
{
    var q = $q.defer();
    
    var usuarioId = [];
    usuarioId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetPerfilPorUsuario',
          data: usuarioId

      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}


/*-----------------------------Permisos------------------------------*/
function GetPermiso($http, $q, CONFIG)    // obtener todos los permisos dados de alta
{
    var q = $q.defer();
    
    $http({      
          method: 'Get',
          url: CONFIG.APIURL + '/GetPermiso',

      }).success(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                data[k].Activo = false;
            }
            q.resolve(data);  
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function GetPermisoPorUsuario($http, $q, CONFIG, id)    // obtener los permisos del usuario
{
    var q = $q.defer();
    
    var usuarioId = [];
    usuarioId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetPermisoPorUsuario',
          data: usuarioId

      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}




