/*--------------------------------- Componete ------------------------------*/
class Persona
{
    constructor()
    {
        this.PersonaId = "";
        this.MedioCaptacion = new MedioCaptacion(); 
        this.TipoPersona = new TipoPersona();
        this.UnidadNegocio =  [];
        
        this.Nombre = "";
        this.PrimerApellido = "";
        this.SegundoApellido = "";
        this.NombreMedioCaptacion = "";
    }
}

//obtiene los compoenetes para los módulos
function GetCliente($http, $q, CONFIG, id)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetCliente/' + id,

      }).success(function(data)
        {
            var cliente = []; 
            
            if(data[0].Estatus == "Exito")
            {
                 q.resolve(data[1].Cliente);
            }
        
            q.resolve(cliente);  
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

/*--------------- Contacto Adicional -------------*/
class ContactoAdicional
{
    constructor()
    {
        this.ContactoAdicionalId = "";
        this.Nombre = "";
        this.Telefono = "";
        this.Correo = "";
    }
}

/*--------------- Datos ficales -------------*/
class DatosFiscales
{
    constructor()
    {
        this.DatosFiscalesId = "";
        this.Nombre = "";
        this.RFC = "";
        this.CorreoElectronico = "";
        this.Domicilio = "";
        this.Codigo = "";
        this.Estado = "";
        this.Municipio = "";
        this.Ciudad = "";
        this.Colonia = "";
    }
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

function GetDatoPersona($http, $q, CONFIG, id)     
{
    var q = $q.defer();
    
    var persona = new Object();
    persona.PersonaId = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetDatoPersona',
          data: persona

      }).success(function(data)
        {
            var persona = []; 
            
            if(data[0].Estatus == "Exito")
            {
                persona = data[1].Persona[0];
            }
        
            q.resolve(persona);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function GetUnidadNegocioPersona($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    var persona = new Object();
    persona.PersonaId = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetUnidadNegocioPersona',
          data: persona

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                var unidadNegocio = [];
                
                unidadNegocio = data[1].UnidadNegocio;
                
                q.resolve(unidadNegocio);
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

function GetContactoAdicional($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    var persona = new Object();
    persona.PersonaId = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetContactoAdicional',
          data: persona

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {   
                q.resolve(data[1].ContactoAdicional);
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

function GetDatosFiscales($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    var persona = new Object();
    persona.PersonaId = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetDatosFiscales',
          data: persona

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {   
                /*var fiscal = [];
                for(var k=0; k<data[1].DatosFiscales.length; k++)
                {
                    fiscal[k] = SetDatosFiscales(data[1].DatosFiscales[k]);
                }*/
                q.resolve(data[1].DatosFiscales);
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

function GetCitaPersona($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    var persona = new Object();
    persona.PersonaId = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetCitaPersona',
          data: persona

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                var cita = [];
                
                for(var k=0; k<data[1].Cita.length; k++)
                {
                    cita[k] = SetCita(data[1].Cita[k]);
                }
                
                q.resolve(cita);
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

/*function SetDatosFiscales(data)
{
    var fiscal = new DatosFiscales();
    
    fiscal.DatosFiscalesId = data.DatosFiscalesId;
    fiscal.Nombre = data.Nombre;
    fiscal.RFC = data.RFC;
    
    fiscal.Correo.Contacto = data.Contacto;
    fiscal.Correo.TipoMedioContacto.TipoMedioContactoId = data.TipoContacto;
    fiscal.Correo.TipoMedioContacto.Nombre = data.NombreTipoContacto;
    fiscal.Correo.MedioContacto.MedioContactoId ="1";
    fiscal.Correo.MedioContacto.Nombre = "Correo Electrónico";
    fiscal.Correo.ContactoPersona = data.CorreoElectronicoId;
    
    fiscal.Domicilio.Domicilio = data.Domicilio;
    fiscal.Domicilio.Codigo = data.Codigo;
    fiscal.Domicilio.Estado = data.Estado;
    fiscal.Domicilio.Municipio = data.Municipio;
    fiscal.Domicilio.Ciudad = data.Ciudad;
    fiscal.Domicilio.Colonia = data.Colonia;
    fiscal.Domicilio.TipoMedioContacto.TipoMedioContactoId = data.TipoDomicilio;
    fiscal.Domicilio.TipoMedioContacto.Nombre = data.NombreTipoDomicilio;
    
    
    return fiscal;
}*/

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

function AgregarMedioContactoPersona($http, CONFIG, $q, contacto)
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarMedioContactoPersona',
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

function AgregarDireccionPersona($http, CONFIG, $q, domicilio)
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarDomicilioPersona',
          data: domicilio

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

function AgregarDatoFiscalPersona($http, CONFIG, $q, datoFiscal)
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarDatoFiscalPersona',
          data: datoFiscal

      }).success(function(data)
        {
            q.resolve(data);
            
        }).error(function(data, status){
            q.resolve([{Estatus:status}]);

     }); 
    return q.promise;
}

function EditarDatoFiscalPersona($http, CONFIG, $q, dato)
{
    var q = $q.defer();
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarDatoFiscalPersona',
          data: dato

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

function EditarDatosPersona($http, CONFIG, $q, persona)
{
    var q = $q.defer();
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarDatosPersona',
          data: persona

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

function EditarUnidadNegocioPersona($http, CONFIG, $q, unidad)
{
    var q = $q.defer();
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarUnidadNegocioPersona',
          data: unidad

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

function AgregarContactoAdicional($http, CONFIG, $q, contacto)
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarContactoAdicional',
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

function EditarContactoAdicional($http, CONFIG, $q, contacto)
{
    var q = $q.defer();

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarContactoAdicional',
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


function EliminarUnidadNegocioPersona($http, $q, CONFIG, id)    
{
    var q = $q.defer();

    $http({      
          method: 'DELETE',
          url: CONFIG.APIURL + '/DeleteUnidadNegocioPersona',
          data: id

      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}


function GetMargenDireccion($http, $q, CONFIG, direccion)
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetMargenDireccion',
          data: direccion

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito") 
            {
                q.resolve(data);
            }
            else
            {
                q.resolve("fallo");
            }
            
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

function GetPromocionPersona($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetPromocionPersona/' + id,
        
      }).success(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                for(var k=0; k<data[1].Promocion.PromocionMueble.length; k++)
                {
                    data[1].Promocion.PromocionMueble[k].DescuentoMinimo = parseFloat(data[1].Promocion.PromocionMueble[k].DescuentoMinimo);
                    data[1].Promocion.PromocionMueble[k].DescuentoMaximo = parseFloat(data[1].Promocion.PromocionMueble[k].DescuentoMaximo);
                    data[1].Promocion.PromocionMueble[k].FechaLimite2 = data[1].Promocion.PromocionMueble[k].FechaLimite;
                    if(data[1].Promocion.PromocionMueble[k].TipoPromocionId != "2")
                    {
                        data[1].Promocion.PromocionMueble[k].FechaLimite = TransformarFecha(data[1].Promocion.PromocionMueble[k].FechaLimite);
                    }
                }
                
                for(var k=0; k<data[1].Promocion.PromocionCubierta.length; k++)
                {
                    data[1].Promocion.PromocionCubierta[k].DescuentoMinimo = parseFloat(data[1].Promocion.PromocionCubierta[k].DescuentoMinimo);
                    data[1].Promocion.PromocionCubierta[k].DescuentoMaximo = parseFloat(data[1].Promocion.PromocionCubierta[k].DescuentoMaximo);
                    data[1].Promocion.PromocionCubierta[k].FechaLimite2 = data[1].Promocion.PromocionCubierta[k].FechaLimite;
                    if(data[1].Promocion.PromocionCubierta[k].TipoPromocionId != "2")
                    {
                        data[1].Promocion.PromocionCubierta[k].FechaLimite = TransformarFecha(data[1].Promocion.PromocionCubierta[k].FechaLimite);
                    }
                }
                
                q.resolve(data);
            }
            else
            {
               q.resolve([{Estatus: "Fallo"}]);  
            }
            
        }).error(function(data){
            q.resolve([{Estatus: "Fallo"}]);
     }); 
    
    return q.promise;
}