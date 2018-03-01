/*--------------------------------- Componete ------------------------------*/
class Presupuesto
{
    constructor()
    {
        this.PresupuestoId = "";
        this.Proyecto = new Proyecto();
        this.Persona = new Persona();
        
        this.Modulo = [];
        this.NumeroPuerta = "0";
        this.NumeroCajon = "0";
        this.NumeroSeccionVacia = 0;
        this.CantidadMaqueo = "";
        this.Margen = -1;
        
        this.DescripcionCliente = "";
        this.DescripcionInterna = "";
        this.Titulo = "";
        
        this.ContratoId = null;
    }
}

class Proyecto
{
    constructor()
    {
        this.ProyectoId = "";
        this.Persona = new Persona();
        this.TipoProyecto = new TipoProyecto();
        this.EstatusProyecto = new EstatusProyecto();
        this.Domicilio = new Domicilio();
        
        this.Nombre = "";
        this.Medidas = "";
        this.Comentario = "";
    }
}

/*---------------------- Sub catálogos de proyecto ----------------------------*/
class EstatusProyecto
{
    constructor()
    {
        this.EstatusProyectoId = "";
        this.Nombre = "";
    }
}

function GetEstatusProyecto()
{
    var estatus = [];
    
    estatus[0] = new EstatusProyecto();
    estatus[0].EstatusProyectoId = "1";
    estatus[0].Nombre = "Activo";
    
    estatus[1] = new EstatusProyecto();
    estatus[1].EstatusProyectoId = "2";
    estatus[1].Nombre = "Contratado";
    
    estatus[2] = new EstatusProyecto();
    estatus[2].EstatusProyectoId = "3";
    estatus[2].Nombre = "Pendiente";
    
    estatus[3] = new EstatusProyecto();
    estatus[3].EstatusProyectoId = "4";
    estatus[3].Nombre = "Cancelado";
    
    return estatus;
}

function AgregarProyectoPresupuesto($http, CONFIG, $q, presupuesto)
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarProyectoPresupuesto',
          data: presupuesto

      }).success(function(data)
        {
            if(data[0].Estatus == "Exitoso") 
            {
                q.resolve(data);
            }
            else
            {
                q.resolve([{Estatus:"Fallo"}]);
            }
            
        }).error(function(data, status){
            q.resolve([{Estatus:status}]);

     }); 
    return q.promise;
}

function EditarProyectoPresupuesto($http, CONFIG, $q, presupuesto)
{
    var q = $q.defer();
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarProyectoPresupuesto',
          data: presupuesto

      }).success(function(data)
        {
            if(data[0].Estatus == "Exitoso") 
            {
                q.resolve(data);
            }
            else
            {
                q.resolve([{Estatus: "Fallo"}]);
            }
            
        }).error(function(data, status){
            q.resolve([{Estatus: status}]);

     }); 
    return q.promise;
}

function GetProyectoPersona($http, $q, CONFIG, id)    
{
    var q = $q.defer();
    
    var persona = new Object();
    persona.PersonaId = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetProyectoPersona',
          data: persona

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                var proyecto = [];
                
                for(var k=0; k<data[1].Proyecto.length; k++)
                {
                    proyecto[k] = SetProyecto(data[1].Proyecto[k]);
                }
                
                q.resolve(proyecto);
            }
            else
            {
               q.resolve([]);  
            }
            
        }).error(function(data){
            q.resolve([]);
     }); 
    
    return q.promise;
}

function GetProyecto($http, $q, CONFIG, id)    
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetProyecto/'+id,

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                var proyecto = [];
                
                for(var k=0; k<data[1].Proyecto.length; k++)
                {
                    proyecto[k] = SetProyecto(data[1].Proyecto[k]);
                }
                
                q.resolve(proyecto);
            }
            else
            {
               q.resolve([]);  
            }
            
        }).error(function(data){
            q.resolve([]);
     }); 
    
    return q.promise;
}


function SetProyecto(data)
{
    var proyecto = new Proyecto();
    
    proyecto.ProyectoId = data.ProyectoId;
    proyecto.Nombre = data.Nombre;
    
    proyecto.TipoProyecto = new TipoProyecto();
    proyecto.TipoProyecto.TipoProyectoId = data.TipoProyectoId;
    proyecto.TipoProyecto.Nombre = data.NombreTipoProyecto;
    proyecto.UnidadNegocioId = data.UnidadNegocioId;
    
    proyecto.EstatusProyecto = new EstatusProyecto();
    proyecto.EstatusProyecto.EstatusProyectoId = data.EstatusProyectoId;
    proyecto.EstatusProyecto.Nombre = data.NombreEstatusProyecto;
    
    if(data.DireccionPersonaId != null)
    {
        proyecto.Domicilio = new Domicilio();
        proyecto.Domicilio.DireccionPersonaId = data.DireccionPersonaId;
        proyecto.Domicilio.Domicilio = data.Domicilio;
        proyecto.Domicilio.Colonia = data.Colonia;
        proyecto.Domicilio.Codigo = data.Codigo;
        proyecto.Domicilio.Estado = data.Estado;
        proyecto.Domicilio.Municipio = data.Municipio;
        proyecto.Domicilio.Ciudad = data.Ciudad;
    }
    else
    {
        proyecto.Domicilio = null;
    }
    
    
    return proyecto;
}

function TransformarFecha(fecha)
{
    var year = fecha.slice(0,4);
    var mes = parseInt(fecha.slice(5,7))-1;
    var dia = fecha.slice(8,10);
    
    var d = new Date(year, mes, dia);
    
    mes = GetMesNombre(mes);
    
    var fechaF = dia + "/"  + mes + "/" + year;
    
    return fechaF;
}


function TransformarFechaEsp(fecha)
{
    var year = fecha.slice(6,10);
    var mes = parseInt(fecha.slice(3,5))-1;
    var dia = fecha.slice(0,2);
    
    var d = new Date(year, mes, dia);
    
    mes = GetMesNombre(mes);
    
    var fechaF = dia + "/"  + mes + "/" + year;
    
    return fechaF;
}

function TransformarFechaEsp2(fecha)
{
    var year = fecha.slice(0,4);
    var mes = parseInt(fecha.slice(5,7))-1;
    var dia = fecha.slice(8,10);
    var hora = fecha.slice(10,16);
    
    var d = new Date(year, mes, dia);
    
    mes = GetMesNombre(mes);
    
    var fechaF = dia + "/"  + mes + "/" + year + hora;
    
    return fechaF;
}

function TransformarFechaEsp2Ing(fecha)
{
    var year = fecha.slice(6,10);
    var mes = fecha.slice(3,5);
    var dia = fecha.slice(0,2);
    
    var fechaF = year + "-"  + mes + "-" + dia;
    
    return fechaF;
}

function GetMesNombre(mes)
{
    return Month[mes];
}

var Month = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

//------------ Operaciones con proyectos ---------------------
function CambiarEstatusProyecto($http, $q, CONFIG, estatus) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/CambiarEstatusProyecto',
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

function EditarProyecto($http, $q, CONFIG, proyecto) 
{
    var q = $q.defer();

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarProyecto',
          data: proyecto

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

//----------------------- Presupuesto --------------------
function GetPresupuestoPorProyecto($http, $q, CONFIG, id, presupuestoId)    
{
    var q = $q.defer();
    
    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetPresupuestoPorProyecto/' + id + "/" +presupuestoId,
        
      }).success(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                var presupuesto = [];
                
                for(var k=0; k<data[1].Presupuesto.length; k++)
                {
                    presupuesto[k] = SetPresupuesto(data[1].Presupuesto[k]);
                }
                
                q.resolve(presupuesto);
            }
            else
            {
               q.resolve([]);  
            }
            
        }).error(function(data){
            q.resolve([]);
     }); 
    
    return q.promise;
}

function SetPresupuesto(data)
{
    var presupuesto = new Presupuesto;
    
    presupuesto.PresupuestoId = data.PresupuestoId;
    presupuesto.PresupuestoIdN = parseInt(data.PresupuestoId);
    presupuesto.ProyectoId = data.ProyectoId;
    presupuesto.UsuarioId = data.UsuarioId;
    presupuesto.FechaCreacion = TransformarFecha(data.FechaCreacion);
    presupuesto.PersonaId = data.PersonaId;
    presupuesto.DescripcionInterna = data.DescripcionInterna;
    presupuesto.DescripcionCliente = data.DescripcionCliente;
    presupuesto.Titulo = data.Titulo;
    presupuesto.CantidadMaqueo = parseFloat(data.CantidadMaqueo);
    presupuesto.ContratoId = data.ContratoId;
    
    return presupuesto;
}

function GetDatosPresupuesto($http, $q, CONFIG, presupuesto)    
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetDatosPresupuesto',
          data: presupuesto
        
      }).success(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                
                /*for(var k=0; k<data[1].Presupuesto.PromocionMueble.length; k++)
                {
                    if(data[1].Presupuesto.PromocionMueble[k].TipoPromocionId != "2")
                    {
                        data[1].Presupuesto.PromocionMueble[k].FechaLimite = TransformarFecha(data[1].Presupuesto.PromocionMueble[k].FechaLimite);
                    }
                }
                
                for(var k=0; k<data[1].Presupuesto.PromocionCubierta.length; k++)
                {
                    if(data[1].Presupuesto.PromocionCubierta[k].TipoPromocionId != "2")
                    {
                        data[1].Presupuesto.PromocionCubierta[k].FechaLimite = TransformarFecha(data[1].Presupuesto.PromocionCubierta[k].FechaLimite);
                    }
                }*/
                
                q.resolve(data);
            }
            else
            {
               q.resolve([{Estatus:"Fallo"}]);  
            }
            
        }).error(function(data){
            q.resolve([{Estatus:"Fallo"}]);
     }); 
    
    return q.promise;
}

function GetReporteProyecto($http, $q, CONFIG, datos)     
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetReporteProyecto',
          data: datos

      }).success(function(data)
        {
              q.resolve(data);
        }).error(function(data, status){
            q.resolve([]);
     }); 
    return q.promise;
}
