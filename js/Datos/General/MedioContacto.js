/*------Medio Contacto---------*/

class MedioContacto
{
    constructor()
    {
        this.MedioContactoId = "";
        this.Nombre = ""; 
    }
}

//copia los datos de un medio de contacto
function SetMedioContacto(id, medio)
{
    var medioContacto = new MedioContacto();
    medioContacto.MedioContactoId = id;
    medioContacto.Nombre = medio;
    
    return medioContacto;
}

function GetMedioContacto()
{
    var medioContacto = [];
    
    medioContacto[0] = new MedioContacto();
    medioContacto[0].MedioContactoId = "1";
    medioContacto[0].Nombre = "Correo Electrónico";
    
    medioContacto[1] = new MedioContacto();
    medioContacto[1].MedioContactoId = "2";
    medioContacto[1].Nombre = "Teléfono";
    
    medioContacto[2] = new MedioContacto();
    medioContacto[2].MedioContactoId = "3";
    medioContacto[2].Nombre = "Dirección";
    
    return medioContacto;
}

/*------Tipo Medio Contacto---------*/
class TipoMedioContacto
{
    constructor()
    {
        this.TipoMedioContactoId = "";
        this.Nombre = ""; 
        this.MedioContactoId = "";
        this.NombreMedioContacto = "";
        this.Activo = "1";
    }
}

//obtiene los tipos de medio de contacto
function GetTipoMedioContacto($http, $q, CONFIG)     //iniciar sesion
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoMedioContacto',

      }).success(function(data)
        {
            var tipoMedioContacto = []; 
            
            for(var k=0; k<data.length; k++)
            {
                tipoMedioContacto[k] = SetTipoMedioContacto(data[k]);
            }
        
            q.resolve(tipoMedioContacto);  
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

function AgregarTipoMedioContacto($http, CONFIG, $q, tipo)
{
    var q = $q.defer();
    
    if(tipo.Activo)
    {
        tipo.Activo = "1";
    }
    else
    {
        tipo.Activo = "0";
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarTipoMedioContacto',
          data: tipo

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

//edita un tipo medio de contacto
function EditarTipoMedioContacto($http, CONFIG, $q, tipo)
{
    var q = $q.defer();
    
    if(tipo.Activo)
    {
        tipo.Activo = "1";
    }
    else
    {
        tipo.Activo = "0";
    }
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarTipoMedioContacto',
          data: tipo

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


function ActivarDesactivarTipoMedioContacto($http, $q, CONFIG, tipo) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarTipoMedioContacto',
          data: tipo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

//copia un tipo de medio de contacto
function SetTipoMedioContacto(data)
{
    var tipoMedioContacto = new TipoMedioContacto();
    
    tipoMedioContacto.TipoMedioContactoId = data.TipoMedioContactoId;
    tipoMedioContacto.Nombre = data.Nombre;
    tipoMedioContacto.MedioContactoId = data.MedioContactoId;
    tipoMedioContacto.NombreMedioContacto = data.NombreMedioContacto;
    
    if(data.Activo == "1")
    {
        tipoMedioContacto.Activo = true;
    }
    else
    {
        tipoMedioContacto.Activo = false;
    }
    
    return tipoMedioContacto;
}


/*--------- contacto -----------*/
class Contacto
{
    constructor()
    {
        this.TipoMedioContacto = new TipoMedioContacto();
        this.MedioContacto = new MedioContacto(); 
        this.Contacto = "";
        this.Activo = true;
    }
}

class Domicilio
{
    constructor()
    {
        this.TipoMedioContacto = new TipoMedioContacto();
        this.Pais = new Pais(); 
        this.Codigo = "";
        this.Domicilio = "";
        this.DomicilioId = null;
        this.Estado = "";
        this.Municipio = "";
        this.Ciudad = "";
        this.Colonia = "";
        this.Activo = true;
        
        this.Pais.PaisId = "1";
    }
}

