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
        
        this.DescripcionCliente = "";
        this.DescripcionInterna = "";
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

