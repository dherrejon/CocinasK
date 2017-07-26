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

/*class TipoProyecto
{
    constructor()
    {
        this.TipoProyectoId = "";
        this.Nombre = "";
        this.IVA = true;
        this.Activo = true;
    }
}

function GetTipoProyecto()
{
    var tipo = [];
    
    tipo[0] = new TipoProyecto();
    tipo[0].TipoProyectoId = "1";
    tipo[0].Nombre = "Cocinas Integral";
    tipo[0].IVA = false;
    tipo[0].Activo = true;
    
    tipo[1] = new TipoProyecto();
    tipo[1].TipoProyectoId = "2";
    tipo[1].Nombre = "Cocinas Integral y Cubierta";
    tipo[1].IVA = false;
    tipo[1].Activo = true;
    
    tipo[2] = new TipoProyecto();
    tipo[2].TipoProyectoId = "3";
    tipo[2].Nombre = "Cubierta";
    tipo[2].IVA = true;
    tipo[2].Activo = true;
    
    return tipo;
}*/

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
    estatus[2].Nombre = "Cancelado";

    
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

function SetProyecto(data)
{
    var proyecto = new Proyecto();
    
    proyecto.ProyectoId = data.ProyectoId;
    proyecto.Nombre = data.Nombre;
    
    proyecto.TipoProyecto = new TipoProyecto();
    proyecto.TipoProyecto.TipoProyectoId = data.TipoProyectoId;
    proyecto.TipoProyecto.Nombre = data.NombreTipoProyecto;
    
    proyecto.EstatusProyecto = new EstatusProyecto();
    proyecto.EstatusProyecto.EstatusProyectoId = data.EstatusProyectoId;
    proyecto.EstatusProyecto.Nombre = data.NombreEstatusProyecto;
    
    proyecto.Domicilio = new Domicilio();
    proyecto.Domicilio.DireccionPersonaId = data.DireccionPersonaId;
    proyecto.Domicilio.Domicilio = data.Domicilio;
    proyecto.Domicilio.Codigo = data.Codigo;
    proyecto.Domicilio.Estado = data.Estado;
    proyecto.Domicilio.Municipio = data.Municipio;
    proyecto.Domicilio.Ciudad = data.Ciudad;
    
    return proyecto;
}


function GetMesNombre(mes)
{
    return Month[mes];
}

var Month = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Nov", "Dic"];

