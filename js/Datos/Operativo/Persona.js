/*--------------------------------- Componete ------------------------------*/
class Persona
{
    constructor()
    {
        this.PersonaId = "";
        this.MedioCaptacion = new MedioCaptacion(); 
        this.TipoPersona = new TipoPersona();
        this.UnidadNegocio =  new UnidadNegocio();
        
        this.Nombre = "";
        this.PrimerApellido = "";
        this.SegundoApellido = "";
        this.NombreMedioCaptacion = "";
    }
}

//obtiene los compoenetes para los módulos
/*function GetComponente($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetComponente',

      }).success(function(data)
        {
            var componente = []; 
            
            for(var k=0; k<data.length; k++)
            {
                componente[k] = new Componente();
                componente[k] = SetComponente(data[k]);
            }
        
            q.resolve(componente);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//obtiene los compoenetes para los módulos
function GetTodosComponente($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTodosComponente',

      }).success(function(data)
        {
            var componente = []; 
            
            for(var k=0; k<data.length; k++)
            {
                componente[k] = new Componente();
                componente[k] = SetComponente(data[k]);
            }
        
            q.resolve(componente);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//obtiene los compoenetes exclusivos para puerta
function GetComponentePuerta($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetComponentePuerta',

      }).success(function(data)
        {
            var componente = []; 
            
            for(var k=0; k<data.length; k++)
            {
                componente[k] = new Componente();
                componente[k] = SetComponente(data[k]);
            }
        
            q.resolve(componente);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos del tipo modulo
function SetComponente(data)
{
    var componente = new Componente();
    
    componente.ComponenteId = data.ComponenteId;
    componente.TipoComponenteId = data.TipoComponenteId;
    componente.Nombre = data.Nombre;
    
    if(data.Activo == "1")
    {
        componente.Activo = true;
    }
    else
    {
        componente.Activo = false;
    }
    
    return componente;
}

//agrega un componente
function AgregarComponente($http, CONFIG, $q, componente)
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarComponente',
          data: componente

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

//edita un componente
function EditarComponente($http, CONFIG, $q, componente)
{
    var q = $q.defer();
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarComponente',
          data: componente

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

function ActivarDesactivarComponente($http, $q, CONFIG, pieza) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarComponente',
          data: pieza

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}*/

/*------------------------ Tipo persona ---------------------------------------*/
class TipoPersona
{
    constructor()
    {
        this.TipoPersonaId = "";
        this.Nombre = "";
    }
}


function GetTipoPersona()
{
    var tipoPersona = [];
    
    tipoPersona[0] = new TipoPersona();
    tipoPersona[0].TipoPersonaId = "1";
    tipoPersona[0].Nombre = "Cliente";
    
    tipoPersona[1] = new TipoPersona();
    tipoPersona[1].TipoPersonaId = "2";
    tipoPersona[1].Nombre = "Prospecto";
    
    
    return tipoPersona;
}


/*------------ otras consultas ----------------*/
function GetBuscarPersona($http, $q, CONFIG, persona)     
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetBuscarPersona',
          data: persona

      }).success(function(data)
        {
            var persona = []; 
            
            if(data[0].Estatus == "Exito")
            {
                persona = data[1].Persona;
            }
        
            q.resolve(persona);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function GetMedioContactoPersona($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    var persona = new Object();
    persona.PersonaId = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetMedioContactoPersona',
          data: persona

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                var contacto = [];
                
                for(var k=0; k<data[1].Contacto.length; k++)
                {
                    contacto[k] = SetMedioContactoPersona(data[1].Contacto[k]);
                }
                
                q.resolve(contacto);
            }
            else
            {
               q.resolve([]);  
            }
            
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function GetDireccionPersona($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    var persona = new Object();
    persona.PersonaId = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetDireccionPersona',
          data: persona

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                var domicilio = [];
                
                for(var k=0; k<data[1].Direccion.length; k++)
                {
                    domicilio[k] = SetDireccionPersona(data[1].Direccion[k]);
                }
                
                q.resolve(domicilio);
            }
            else
            {
               q.resolve([]);  
            }
            
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function SetMedioContactoPersona(data)
{
    var contacto = new Contacto();
    
    contacto.ContactoPersonaId = data.ContactoPersonaId;
    contacto.Contacto = data.Contacto;
    contacto.Activo = CambiarDatoEnteroABool(data.Activo);
    
    contacto.MedioContacto.MedioContactoId = data.MedioContactoId;
    contacto.MedioContacto.Nombre = data.NombreMedioContacto;
    
    contacto.TipoMedioContacto.TipoMedioContactoId = data.TipoMedioContactoId;
    contacto.TipoMedioContacto.Nombre = data.NombreTipoMedioContacto;
    
    return contacto;
}

function SetDireccionPersona(data)
{
    var domicilio = new Domicilio();
    
    domicilio.DireccionPersonaId = data.DireccionPersonaId;
    domicilio.Domicilio = data.Domicilio;
    domicilio.Codigo = data.Codigo;
    domicilio.Estado = data.Estado;
    domicilio.Municipio = data.Municipio;
    domicilio.Ciudad = data.Ciudad;
    domicilio.Colonia = data.Colonia;
    
    domicilio.Activo = CambiarDatoEnteroABool(data.Activo);
    
    domicilio.Pais.PaisId = data.PaisId;
    
    domicilio.TipoMedioContacto.TipoMedioContactoId = data.TipoMedioContactoId;
    domicilio.TipoMedioContacto.Nombre = data.NombreTipoMedioContacto;
    
    return domicilio;
}

function EditarMedioContactoPersona($http, CONFIG, $q, contacto)
{
    var q = $q.defer();
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarMedioContactoPersona',
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

function EditarDireccionPersona($http, CONFIG, $q, direccion)
{
    var q = $q.defer();
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarDireccionPersona',
          data: direccion

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