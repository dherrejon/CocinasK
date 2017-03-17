class Usuario   //clase usuario
{
    constructor(id, nombre, password)           //inicializar datos
    {
        this.Nombre = nombre;
        this.UsuarioId = id;
        this.Password = password;
        this.SesionIniciada = false;
        this.Perfil = [];
        this.PerfilSeleccionado = "";
        this.Permiso = [];
        this.NombreColaborador = "";
    }
    
    //iniciar sesion
    IniciarSesion($http, usuario, $q, CONFIG, md5)     
    {
        var datosUsuario = [];
        datosUsuario[0] = usuario.Nombre;
        datosUsuario[1] = md5.createHash( usuario.Password );
        
        var q = $q.defer();
        
        $http({      
              method: 'POST',
              url: CONFIG.APIURL + '/Login',
              data: datosUsuario

          }).success(function(data)
            {
                if(data[0].Activo == "1")
                {
                    usuario = SetUsuario(data);
                    q.resolve(usuario);
                }
                else if(data[0].Estatus == "SesionInicada")
                {
                    q.resolve(data[0].Estatus);
                }
                else
                {
                    usuario.Password = "";
                    usuario.UsuarioId = "";
                    usuario.SesionIniciada = false;
                    q.resolve(usuario);
                }
            }).error(function(data, status){
                q.resolve(status);
         }); 
        return q.promise;
    }
}

//Verificar el estado de la sesion
function SesionIniciada($http, $q, CONFIG)          
{
    var q = $q.defer();
    var usuario = new Usuario("","","");

    $http({

            method: 'GET',
            url: CONFIG.APIURL + '/GetEstadoSesion'

        }).success(function(data){
            if( data[0].Estatus)
            {
                usuario = SetUsuario(data[1].Usuario, usuario);
                usuario.PerfilSeleccionado = data[0].Perfil;
            }
            else
            {
                usuario.perfilSeleccinado = "";
                usuario.Password = "";
                usuario.UsuarioId = "";
                SesionIniciada = false;
            }

            q.resolve(usuario);

        }).error(function(data, Estatus){
             alert("Ha fallado la petición, no se ha podido obtener el estado de sesion. Estado HTTP:"+Estatus);
    });

    return q.promise;
}

//cerrar sesion
function CerrarSesion($http, $rootScope, $q, CONFIG)            
{
    var q = $q.defer();

     $http({

          method: 'GET',
          url: CONFIG.APIURL + '/CerrarSesion'

     }).success(function(data, status, headers, config){

           if( data[0].Estatus )
           {
              q.resolve(true);
           }
           else
           {
              q.resolve(false);
           } 

     }).error(function(data, status, headers, config){

           alert("Ha fallado la petición. Estado HTTP:"+status);

     });

    return q.promise;
}

 //Indicar los datos del usuario, periles y permisos
function SetUsuario(data)              
{
    var usuario = new Usuario("","","");
    
    usuario.UsuarioId = data[0].UsuarioId;
    usuario.Nombre = data[0].NombreUsuario;
    usuario.UnidadNegocioId = data[0].UnidadNegocioId;
    usuario.Password = "";
    usuario.SesionIniciada = true;
    usuario.NombreColaborador = data[0].NombreColaborador;

    var administrador = false;
    var ejecutivo = false;
    var operativo = false;

    for(var k=0; k<data.length; k++)
    {
        if(data[k].NombrePerfil == "Administrador" && !administrador)
        {
            usuario.Perfil[usuario.Perfil.length] = "Administrador";
            administrador = true;
        }
        else if(data[k].NombrePerfil == "Ejecutivo" && !ejecutivo)
        {
            usuario.Perfil[usuario.Perfil.length] = "Ejecutivo";
            ejecutivo = true;
        }
        else if(data[k].NombrePerfil == "Operativo" && !operativo)
        {
            usuario.Perfil[usuario.Perfil.length] = "Operativo";
            operativo = true;
        }
        
        usuario.Permiso[k] = data[k].Clave;
    }
    
    return usuario;
}

//Poner el perfil seleccionado por el usuario en session
function SetPerfilInSesion(perfil, $http, CONFIG)       
{
    var datos = [];
    datos[0] = perfil;
    $http({

          method: 'PUT',
          url: CONFIG.APIURL + '/SetPerfil',
          data: datos

     }).success(function(data){

           

     }).error(function(data){


     });
}

function CambiarDatoBool(dato)
{
    if(dato)
    {
        return "1";
    }
    else
    {
        return "0";
    }
}

function CambiarDatoEnteroABool(dato)
{
    if(dato == "1")
    {
        return true;
    }
    else
    {
        return false;
    }
}
