/*--------------------------------- Componete ------------------------------*/
class Cita
{
    constructor()
    {
        this.CitaId = "";
        this.Persona = new Persona();
        this.Tarea = new TareaCita();
        this.EstatusCita = new EstatusCita();
        
        this.Responsable = new ResponsableCita();
        this.Domicilio = new Domicilio();
        
        this.Asunto = "";
        this.Fecha = "";
        this.HoraInicio = "";
        this.HoraFin = "";
        this.Descripcion = "";
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
}*/

//copia los datos del tipo modulo
function SetCita(data)
{
    var cita = new Cita();
    
    cita.CitaId = data.CitaId;
    cita.Asunto = data.Asunto;
    cita.Fecha = data.Fecha;
    cita.HoraInicio = data.HoraInicio.slice(0,5);
    cita.HoraFin = data.HoraFin.slice(0,5);
    cita.Descripcion = data.Descripcion;
    
    cita.Tarea.TareaCitaId = data.TareaCitaId;
    cita.Tarea.Nombre = data.NombreTareaCita;
    
    cita.EstatusCita.EstatusCitaId = data.EstatusCitaId;
    cita.EstatusCita.Nombre = data.NombreEstatusCita;
    
    cita.Persona.PersonaId = data.PersonaId;
    cita.Persona.Nombre = data.NombrePersona;
    
    cita.Domicilio.Codigo = data.Codigo;
    cita.Domicilio.Estado = data.Estado;
    cita.Domicilio.Domicilio = data.Codigo;
    cita.Domicilio.Municipio = data.Municipio;
    cita.Domicilio.Ciudad = data.Ciudad;
    cita.Domicilio.Colonia = data.Colonia;
    
    if(data.UnidadNegocioId !== null)
    {
        cita.Responsable.UnidadNegocio = true;
        cita.Responsable.Colaborador = false;
        cita.Responsable.ResponsableId = data.UnidadNegocioId;
        cita.Responsable.Nombre = data.NombreUnidadNegocio;
    }
    else if(data.ColobaoradorId !== null)
    {
        cita.Responsable.UnidadNegocio = false;
        cita.Responsable.Colaborador = true;
        cita.Responsable.ResponsableId = data.ColobaoradorId;
        cita.Responsable.Nombre = data.NombreColaborador;
    }

    return cita;
}

//agrega un componente
function AgregarCita($http, CONFIG, $q, cita)
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarCita',
          data: cita

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
/*function EditarComponente($http, CONFIG, $q, componente)
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
}*/

function CambiarEstatusCita($http, $q, CONFIG, estatus) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/CambiarEstatusCita',
          data: estatus

      }).success(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                q.resolve("Exitoso");
            }
            else
            {
                q.resolve("Fallo");
            }
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

/*------------------------  Datos de cita ---------------------------------------*/
class TareaCita
{
    constructor()
    {
        this.TareaCitaId = "";
        this.Nombre = "";
    }
}


function GetTareaCita()
{
    var tarea = [];
    
    tarea[0] = new TareaCita();
    tarea[0].TareaCitaId = "1";
    tarea[0].Nombre = "Medir";
    
    tarea[1] = new TareaCita();
    tarea[1].TareaCitaId = "2";
    tarea[1].Nombre = "Llamar";
    
    tarea[2] = new TareaCita();
    tarea[2].TareaCitaId = "3";
    tarea[2].Nombre = "Visita Sucursal";
    
    return tarea;
}

class EstatusCita
{
    constructor()
    {
        this.EstatusCitaId = "";
        this.Nombre = "";
    }
}


function GetEstatusCita()
{
    var estatus = [];
    
    estatus[0] = new EstatusCita();
    estatus[0].EstatusCitaId = "3";
    estatus[0].Nombre = "Terminada";
    
    estatus[1] = new EstatusCita();
    estatus[1].EstatusCitaId = "4";
    estatus[1].Nombre = "Cancelada";
    
    estatus[2] = new EstatusCita();
    estatus[2].EstatusCitaId = "2";
    estatus[2].Nombre = "Pendiente";
    
    estatus[3] = new EstatusCita();
    estatus[3].EstatusCitaId = "1";
    estatus[3].Nombre = "Atrasada";
    
    return estatus;
}

class ResponsableCita
{
    constructor()
    {
        this.UnidadNegocio = true;
        this.Colaborador = false;
        this.ResponsableId = "";
        this.Nombre = "";
    }
}

