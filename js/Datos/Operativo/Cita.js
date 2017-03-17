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
}*/

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
    estatus[0].EstatusCitaId = "1";
    estatus[0].Nombre = "Terminada";
    
    estatus[1] = new EstatusCita();
    estatus[1].EstatusCitaId = "2";
    estatus[1].Nombre = "Cancelada";
    
    estatus[2] = new EstatusCita();
    estatus[2].EstatusCitaId = "3";
    estatus[2].Nombre = "Pendiente";
    
    estatus[3] = new EstatusCita();
    estatus[3].EstatusCitaId = "4";
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

