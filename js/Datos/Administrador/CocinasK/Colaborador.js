class Colaborador
{
    constructor()
    {
        this.ColaboradorId = "";
        this.UnidadNegocioId = "";
        this.NombreUnidadNegocio = "";
        this.NombreTipoUnidadNegocio = "";
        this.PaisId = "";
        this.NombrePais = "";
        this.Nombre = "";
        this.PrimerApellido = "";
        this.SegundoApellido = "";
        this.Domicilio = "";
        this.Colonia = "";
        this.Estado = "";
        this.Municipio = "";
        this.Ciudad = "";
        this.Codigo = "";
        this.Activo = true;
        this.ActivoN = 1;  
        this.NombreUsuario = "";  
        this.UsuarioId = "";
        this.ActivoUsuario = true;
    }
}

//obtener colaboradores
function GetColaboradores($http, $q, CONFIG)
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetColaborador',

      }).success(function(data)
        {
            var colaborador = []; 
            
            for(var k=0; k<data.length; k++)
            {
                colaborador[k] = new Colaborador();
                colaborador[k] = SetColaborador(data[k]);
            }
        
            q.resolve(colaborador);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copiar los datos del colaborador
function SetColaborador(data)
{
    var colaborador = new Colaborador();
    
    colaborador.ColaboradorId = data.ColaboradorId;
    colaborador.Nombre = data.Nombre;
    colaborador.PrimerApellido = data.PrimerApellido;
    colaborador.SegundoApellido = data.SegundoApellido;
    colaborador.Estado = data.Estado;
    colaborador.Municipio = data.Municipio;
    colaborador.Ciudad = data.Ciudad;
    colaborador.Colonia = data.Colonia;
    colaborador.Domicilio = data.Domicilio;
    colaborador.Codigo = data.Codigo;
    colaborador.ActivoN = data.Activo;
    colaborador.UnidadNegocioId = data.UnidadNegocioId;
    colaborador.NombreUnidadNegocio = data.NombreUnidadNegocio;
    colaborador.NombreTipoUnidadNegocio = data.NombreTipoUnidadNegocio;
    colaborador.PaisId = data.PaisId;
    colaborador.NombrePais = data.NombrePais;
    colaborador.NombreUsuario = data.NombreUsuario;
    colaborador.UsuarioId = data.UsuarioId;
    
    if(data.Activo == "1")
    {
        colaborador.Activo = true;
    }
    else
    {
        colaborador.Activo = false;
    }
    
    if(data.ActivoUsuario == "1")
    {
        colaborador.ActivoUsuario = true;
    }
    else
    {
        colaborador.ActivoUsuario = false;
    }
    
    return colaborador;
}

//agregar colaborador
function AgregarColaborador($http, CONFIG, $q, colaborador)
{
    var q = $q.defer();
    
    if(colaborador.colaborador.Activo)
    {
        colaborador.colaborador.Activo = 1;
    }
    else
    {
        colaborador.colaborador.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarColaborador',
          data: colaborador

      }).success(function(data)
        {
            q.resolve(data);
        
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

//editar colaborador
function EditarColaborador($http, CONFIG, $q,  colaborador)
{
    var q = $q.defer();
    
    if(colaborador.colaborador.Activo)
    {
        colaborador.colaborador.Activo = 1;
    }
    else
    {
        colaborador.colaborador.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarColaborador',
          data: colaborador

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

//Activar - Desactivar colaborador
function ActivarDesactivarColaborador($http, $q, CONFIG, colaborador) 
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarColaborador',
          data: colaborador

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, status){
            q.resolve(status);

     }); 
    
    return q.promise;
}


/*Medio de contacto*/
// obtener los contactos del colaborador
function GetContactoColaborador($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    var colaboradorId = [];
    colaboradorId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetContactoColaborador',
          data: colaboradorId

      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

//editar un contacto del colaborador
function EditarContactoColaborador($http, CONFIG, $q, contacto)
{
    var q = $q.defer();

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarContactoColabordor',
          data: contacto

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

//elimna un contacto del colaborador
function EliminarContactoColaborador($http, $q, CONFIG, id)    
{
    var q = $q.defer();

    $http({      
          method: 'DELETE',
          url: CONFIG.APIURL + '/DeleteContactoColaborador',
          data: id

      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}



