/*--------------------------------- Contrato ------------------------------*/
class Contrato
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
        
        this.ContratoId = "";
        
        this.Combinacion = new CombinacionMaterial();
        this.TipoCubierta = new TipoCubierta();
        this.ConceptoVenta = new ConceptoVenta();
        this.PlanPago = new PlanPago();
        this.Puerta = null;
        this.Maqueo = null;
        this.Servicio = [];
        this.Accesorio = [];
        
        this.PromocionCubierta = new Promocion();
        this.PromocionMueble = new Promocion();
    }
}

function GetHoy()
{
    var hoy = new Date();

    var dia = hoy.getDate();
    var mes = hoy.getMonth() +1;
    var year = hoy.getFullYear();

    if(mes < 10)
    {
        mes = "0" + mes;
    }
    
    if(dia < 10)
    {
        dia = "0" + dia;
    }

    return year + "-" + mes + "-" + dia;
}

function GetHoy2()
{
    var hoy = new Date();
    var dia = hoy.getDate();
    var year = hoy.getFullYear();

    return dia + "/" + GetMesNombre(hoy.getMonth()) + "/" + year;
}



