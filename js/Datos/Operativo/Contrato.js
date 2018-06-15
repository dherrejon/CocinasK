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

function GetContrato($http, $q, CONFIG, PersonaId, ContratoId)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetContrato/' + PersonaId + "/" + ContratoId,

      }).success(function(data)
        {
            var contrato = []; 
            for(var k=0; k<data.length; k++)
            {
                contrato[k] = new Object();
                contrato[k] = SetContrato(data[k]);
            }
    
            q.resolve(contrato);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetContrato(data)
{
    data.EstatusContrato = new Object();
    data.EstatusContrato.EstatusContratoId = data.EstatusContratoId;
    data.EstatusContrato.Nombre = data.NombreEstatusContrato;
    
    data.FechaVentaFormato = TransformarFecha(data.FechaVenta);
    data.FechaEntregaFormato = data.FechaEntrega;
    data.FechaEntrega = GetFechaEng(data.FechaEntrega);
    
    return data;
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

function EditarContrato($http, CONFIG, $q, contrato)
{
    var q = $q.defer();

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarContrato',
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

//-------------- Operaciones contratos --------------------------
function UpdateNumeroFactura($http, CONFIG, $q, fac)
{
    var q = $q.defer();
    

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/UpdateNumeroFactura',
          data: fac

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

function GuardarContratoPDF($http, $q, CONFIG, contrato, ContratoId) 
{
    var q = $q.defer();
    
    var xhr = new XMLHttpRequest();
        
    var file = contrato;
    var fd = new FormData();
    fd.append('file', file);

    $http(
    {
      method: 'POST',
      url:   CONFIG.APIURL  + '/GuardarContratoPDF/'+ContratoId,
      data: fd,

      headers: 
      {
        "Content-type": undefined 
      },
      //transformRequest: fd

        }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve([{Estatus: Estatus}]);
    });
    
    return q.promise;
}

function DescargarContrato($http, $q, CONFIG, id)     
{
    var q = $q.defer();
    
    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/DescargarContrato/'+id,
      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                q.resolve(data[1].Archivo[0]);  
            }
            else
            {
                q.resolve([]);      
            }
            
        }).error(function(data, status){
            q.resolve([]);
     }); 
    return q.promise;
}

function CambiarEstatusContrato($http, $q, CONFIG, estatus) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/CambiarEstatusContrato',
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

function GetEstadoCuenta($http, $q, CONFIG, contrato) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetEstadoCuenta',
          data: contrato

      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                q.resolve({Estatus:"Exitoso", Pagos:data[1].Contrato.Pagos, PlanPagos:data[1].Contrato.PlanPagos});
            }
            else
            {
                q.resolve({Pagos:[], PlanPagos:[]});
            }
        }).error(function(data, Estatus){
            q.resolve({Estatus:data});

     }); 
    
    return q.promise;
}

function AgregarPago($http, $q, CONFIG, pago) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarPago',
          data: pago

      }).success(function(data)
        {
            q.resolve(data);
        }).error(function(data, Estatus){
            q.resolve([{Estatus:data}]);

     }); 
    
    return q.promise;
}

function CancelarPago($http, $q, CONFIG, pago) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/CancelarPago',
          data: pago

      }).success(function(data)
        {
            q.resolve(data[0].Estatus);
        }).error(function(data, Estatus){
            q.resolve([{Estatus:data}]);

     }); 
    
    return q.promise;
}

function GetNotaCargo($http, $q, CONFIG, nota, contrato) 
{
    var q = $q.defer();
    
    var url = "";
    if(contrato)
    {
        url = CONFIG.APIURL + '/GetNotaCargo/' + nota + "/" + contrato;
    }
    else
    {
        url = CONFIG.APIURL + '/GetNotaCargo/' + nota + "/-1";
    }

    $http({      
          method: 'GET',
          url: url
      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                q.resolve(parseInt(data[1].Count));
            }
            else
            {
                q.resolve(-1);
            }
        }).error(function(data, Estatus){
            q.resolve(-1);

     }); 
    
    return q.promise;
}

function GetNoFactura($http, $q, CONFIG, factura, contrato) 
{
    var q = $q.defer();
    
    var url = "";
    
    if(contrato)
    {
        url = CONFIG.APIURL + '/GetNoFactura/' + factura + "/" + contrato;
    }
    else
    {
        url = CONFIG.APIURL + '/GetNoFactura/' + factura + "/-1";
    }

    $http({      
          method: 'GET',
          url: url,
      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                q.resolve(parseInt(data[1].Count));
            }
            else
            {
                q.resolve(-1);
            }
        }).error(function(data, Estatus){
            q.resolve(-1);
     }); 
    
    return q.promise;
}

function HabilitarEditarContrato($http, $q, CONFIG, datos) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/HabilitarEditarContrato',
          data: datos

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

function GetDatosContrato($http, $q, CONFIG, contrato)    
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetDatosContrato',
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
            
        }).error(function(data){
            q.resolve([{Estatus:"Fallo"}]);
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

function GetEstatusContrato()
{
    var estatus = [];
    
    estatus[0] = new TipoVenta();
    estatus[0].EstatusContratoId = "1";
    estatus[0].Nombre = "En Proceso";
    
    estatus[1] = new TipoVenta();
    estatus[1].EstatusContratoId = "2";
    estatus[1].Nombre = "Pagado";
    
    estatus[2] = new TipoVenta();
    estatus[2].EstatusContratoId = "3";
    estatus[2].Nombre = "Entregado";
    
    estatus[3] = new TipoVenta();
    estatus[3].EstatusContratoId = "4";
    estatus[3].Nombre = "Detenido";
    
    return estatus;
}

function GetReporteContrato($http, $q, CONFIG, datos)     
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetReporteContrato',
          data: datos

      }).success(function(data)
        {
              q.resolve(data);
        }).error(function(data, status){
            q.resolve([]);
     }); 
    return q.promise;
}

function GetReporteContratoDetalle($http, $q, CONFIG, datos)     
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetReporteContrato/Detalle',
          data: datos

      }).success(function(data)
        {
              q.resolve(data);
        }).error(function(data, status){
            q.resolve([]);
     }); 
    return q.promise;
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

function GetFechaEng(fecha)
{
    var dia = parseInt(fecha.slice(0,2));
    var mes = fecha.slice(3,6);
    var year = fecha.slice(7);
    
    if(dia<10)
    {
        dia = "0" + dia;
    }
    
    for(var k=0; k<Month.length; k++)
    {
        if(mes == Month[k])
        {
            mes = k<9 ? "0" + (k+1) : k+1;
            break;
        }
    }
    
    return year + "-" + mes + "-" + dia;
}

function GetFechaEngShort(fecha)
{
    var dia, mes, year;
    
    if(fecha.length == 11)
    {
        dia = parseInt(fecha.slice(0,2));
        mes = fecha.slice(3,6);
        year = fecha.slice(7);
    }
    if(fecha.length == 10)
    {
        dia = parseInt(fecha.slice(0,1));
        mes = fecha.slice(2,5);
        year = fecha.slice(6);
    }
    
    
    if(dia<10)
    {
        dia = "0" + dia;
    }
    
    for(var k=0; k<Month.length; k++)
    {
        if(mes == Month[k])
        {
            mes = k<9 ? "0" + (k+1) : k+1;
            break;
        }
    }
    
    return year + "-" + mes + "-" + dia;
}


function GetFechaAbrEng(fecha)
{
    var dia = parseInt(fecha.slice(0,2));
    var mes = fecha.slice(3,6);
    var year = fecha.slice(7);
    
    if(dia<10)
    {
        dia = "0" + dia;
    }
    
    for(var k=0; k<Month.length; k++)
    {
        if(mes == Month[k])
        {
            mes = k<9 ? "0" + (k+1) : k+1;
            break;
        }
    }
    
    return year + "-" + mes + "-" + dia;
}

//Excel
function ExportarExcel(tabla, titulo)
{
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById(tabla);
    var table_html = table_div.outerHTML.replace(/ /g, '%20');

    var a = document.createElement('a');
    a.href = data_type + ', ' + table_html;
    a.download = titulo  + '.xls';
    a.click();
}


var mesesN = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var mesAbr = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];



