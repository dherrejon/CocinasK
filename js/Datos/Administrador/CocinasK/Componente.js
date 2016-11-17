/*--------------------------------- Componete ------------------------------*/
class Componente
{
    constructor()
    {
        this.ComponenteId = "";
        this.TipoComponenteId = ""; 
        this.Nombre = ""; 
        this.Activo = true; 
    }
}

//obtiene los compoenetes para los módulos
function GetComponente($http, $q, CONFIG)     
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
}

//agrega un componente
function AgregarComponente($http, CONFIG, $q, componente)
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarComponente',
          data: componente

      }).success(function(data)
        {
            q.resolve("Exitoso");
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
function EditarComponente($http, CONFIG, $q, componente)
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
}

/*------------------------Componente por Pieza ---------------------------------------*/
class PiezaPorComponente
{
    constructor()
    {
        this.ComponentePorPiezaId = "";
        this.ComponenteId = "";
        this.Pieza = new Pieza(); 
        this.Cantidad = 0;
    }
}

function GetPiezaPorComponente($http, $q, CONFIG, id)    // obtener las piezas del componente indicado
{
    var q = $q.defer();
    
    var componenteId = [];
    componenteId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetPiezaPorComponente',
          data: componenteId

      }).success(function(data)
        {
            var piezaPorComponente = []; 
            
            for(var k=0; k<data.length; k++)
            {
                piezaPorComponente[k] = new PiezaPorComponente();
                piezaPorComponente[k] = SetPiezaPorComponente(data[k]);
            }
        
            q.resolve(piezaPorComponente);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function SetPiezaPorComponente(datos)
{
    var piezaPorComponente = new PiezaPorComponente();
    var pieza = new Pieza();
    
    piezaPorComponente.PiezaPorComponenteId = datos.PiezaPorComponenteId;
    piezaPorComponente.ComponenteId = datos.ComponenteId;
    piezaPorComponente.Cantidad = datos.Cantidad;
    
    pieza.PiezaId = datos.PiezaId;
    pieza.FormulaAncho = datos.FormulaAncho;
    pieza.FormulaLargo = datos.FormulaLargo;
    pieza.Nombre = datos.NombrePieza;
    
    piezaPorComponente.Pieza = SetPieza(pieza);
    
    return piezaPorComponente;
}
