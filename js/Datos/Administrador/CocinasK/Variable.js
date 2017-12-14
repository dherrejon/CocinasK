/*---------------------- Parametros --------------------------------*/
class Parametro
{
    constructor()
    {
        this.ParametroId = "";
        this.Nombre = "";
        this.Valor = "";
    }
}

function GetParametro($http, $q, CONFIG, Id)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetParametro/' + Id,

      }).success(function(data)
        {
            var parametro = []; 
            
            for(var k=0; k<data.length; k++)
            {
                parametro[k] = new Parametro();
                parametro[k] = SetParametro(data[k]);
            }
        
            q.resolve(parametro);  
        }).error(function(data, status){
            q.resolve([]);
     }); 
    
    return q.promise;
}

function SetParametro(data)
{
    var parametro = new Parametro();
    
    parametro.ParametroId = data.ParametroId;
    parametro.Nombre = data.Nombre;
    parametro.Valor = data.Valor;
    parametro.Unidad = data.Unidad;
    
    return parametro;
}

function EditarParametro($http, CONFIG, $q, parametro)
{
    var q = $q.defer();

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarParametro',
          data: parametro

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

/*------ Variables del sistema ---------*/
class IVA
{
    constructor()
    {
        this.IVAId = "";
        this.IVA = 0;
        this.Incluye = "1";
    }
}

//obtiene los tipos de módulos
function GetIVA($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetIVA',

      }).success(function(data)
        {
            var iva = []; 
            
            for(var k=0; k<data.length; k++)
            {
                iva[k] = new IVA();
                iva[k] = SetIVA(data[k]);
            }
        
            q.resolve(iva);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetIVA(data)
{
    var iva = new IVA();
    
    iva.IVAId = data.IVAId;
    iva.IVA = parseFloat(data.IVA);
    
    iva.Incluye = CambiarDatoEnteroABool(data.Incluye);
    
    return iva;
}

function EditarIVA($http, CONFIG, $q, iva)
{
    var q = $q.defer();
    
    iva.Incluye = CambiarDatoBool(iva.Incluye);

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarIVA',
          data: iva

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