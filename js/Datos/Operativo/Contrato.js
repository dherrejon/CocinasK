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
        
        this.NoFactura = "";
        this.NoNotaCargo = "";
        this.DatoFiscal = new DatosFiscales();
        this.Especificacion = [];
        this.DescripcionContrato = [];
        this.Encabezado = "";
        this.ProyectoNombre = "";
    }
}


function AgregarContrato($http, CONFIG, $q, contrato)
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarContrato',
          data: contrato

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



//---------- tipo venta contrato -------------------
function GetTipoVentaContrato()
{
    var tipoVenta = [];
    
    tipoVenta[0] = new TipoVenta();
    tipoVenta[0].TipoVentaId = "0";
    tipoVenta[0].Nombre = "General";
    
    tipoVenta[1] = new TipoVenta();
    tipoVenta[1].TipoVentaId = "1";
    tipoVenta[1].Nombre = "Cocina";
    
    tipoVenta[2] = new TipoVenta();
    tipoVenta[2].TipoVentaId = "2";
    tipoVenta[2].Nombre = "Cubierta de piedra";
    
    return tipoVenta;
}

//------------------------- funciones
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

var mesesN = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

