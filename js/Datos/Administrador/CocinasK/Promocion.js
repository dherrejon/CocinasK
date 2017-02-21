/*------Medio Contacto---------*/

class Promocion
{
    constructor()
    {
        this.PromocionId = "";
        this.TipoPromocion = new TipoPromocion();
        this.TipoVenta = new TipoVenta();
        this.Descripcion = "";
        this.DescuentoMinimo = 0;
        this.DescuentoMaximo = 0;
        this.NumeroPagos = 0;
        this.FechaLimite = "";
        this.Vigencia = "";
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetPromocion($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetPromocion',

      }).success(function(data)
        {
            var promocion = []; 
            
            for(var k=0; k<data.length; k++)
            {
                promocion[k] = new Promocion();
                promocion[k] = SetPromocion(data[k]);
            }
        
            q.resolve(promocion);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetPromocion(data)
{
    var promocion = new Promocion();
    
    promocion.PromocionId = data.PromocionId;
    promocion.Descripcion = data.Descripcion;
    promocion.DescuentoMinimo = parseInt(data.DescuentoMinimo);
    promocion.DescuentoMaximo = parseInt(data.DescuentoMaximo);
    promocion.NumeroPagos = parseInt(data.NumeroPagos);
    promocion.FechaLimite = data.FechaLimite;
    promocion.Vigencia = parseInt(data.Vigencia);
    promocion.Activo = CambiarDatoEnteroABool(data.Activo);
    
    promocion.TipoVenta.TipoVentaId = data.TipoVentaId;
    promocion.TipoVenta.Nombre = data.NombreTipoVenta;
    
    promocion.TipoPromocion.TipoPromocionId = data.TipoPromocionId;
    promocion.TipoPromocion.Nombre = data.NombreTipoPromocion;
    
    return promocion;
}

//agregaga un servicio
function AgregarPromocion($http, CONFIG, $q, promocion)
{
    var q = $q.defer();
    
    promocion.Activo = CambiarDatoBool(promocion.Activo);
    if(promocion.TipoPromocion.TipoPromocionId == '1')
    {
        promocion.FechaLimite = CambiarFormatoFecha(promocion.FechaLimite);
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarPromocion',
          data: promocion

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

//edita un servicio
function EditarPromocion($http, CONFIG, $q, promocion)
{
    var q = $q.defer();
    
    promocion.Activo = CambiarDatoBool(promocion.Activo);
    if(promocion.TipoPromocion.TipoPromocionId == '1')
    {
        promocion.FechaLimite = CambiarFormatoFecha(promocion.FechaLimite);
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarPromocion',
          data: promocion

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

function ActivarDesactivarPromocion($http, $q, CONFIG, promocion) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarPromocion',
          data: promocion

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

/*------------ unidades de negocio----------------*/
function GetUnidadNegocionPorPromocion($http, $q, CONFIG, id)     
{
    var q = $q.defer();

    var datos = [];
    datos[0] = id;
        
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetUnidadNegocionPorPromocion',
          data: datos
      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}


/*--------------------Tipo Venta y Tipo Promocion ----------------------------------*/
class TipoVenta
{
    constructor()
    {
        this.TipoVentaId = "";
        this.Nombre = "";
    }
}

function GetTipoVenta()
{
    var tipoVenta = [];
    
    tipoVenta[0] = new TipoVenta();
    tipoVenta[0].TipoVentaId = "1";
    tipoVenta[0].Nombre = "Cocina";
    
    tipoVenta[1] = new TipoVenta();
    tipoVenta[1].TipoVentaId = "2";
    tipoVenta[1].Nombre = "Cubierta de piedra";
    
    return tipoVenta;
}

class TipoPromocion
{
    constructor()
    {
        this.TipoPromocionId = "";
        this.Nombre = "";
    }
}

function GetTipoPromocion()
{
    var tipoPromocion = [];
    
    tipoPromocion[0] = new TipoPromocion();
    tipoPromocion[0].TipoPromocionId = "1";
    tipoPromocion[0].Nombre = "Fecha Límite";
    
    tipoPromocion[1] = new TipoPromocion();
    tipoPromocion[1].TipoPromocionId = "2";
    tipoPromocion[1].Nombre = "Meses sin Intereses";
    
    tipoPromocion[2] = new TipoPromocion();
    tipoPromocion[2].TipoPromocionId = "3";
    tipoPromocion[2].Nombre = "Vigencia Dinámica";
    
    return tipoPromocion;
}


function CambiarFormatoFecha(fecha)
{
    var date = "";
    
    date = fecha[6] + fecha[7] + fecha[8] + fecha[9] + "-" + fecha[3] + fecha[4] + "-" + fecha[0] + fecha[1];
    return date;
}