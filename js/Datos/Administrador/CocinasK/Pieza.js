/*---------------------------------Pieza------------------------------*/
class Pieza
{
    constructor()
    {
        this.PiezaId= "";
        this.Nombre = ""; 
        this.FormulaAncho = "";
        this.FormulaLargo = ""; 
        this.Nombre = ""; 
        this.Activo = true; 
    }
}

//obtiene las Piezas
function GetPieza($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetPieza',

      }).success(function(data)
        {
            var pieza = []; 
            
            for(var k=0; k<data.length; k++)
            {
                pieza[k] = new Pieza();
                pieza[k] = SetPieza(data[k]);
            }
        
            q.resolve(pieza);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de la pieza
function SetPieza(data)
{
    var pieza = new Pieza();
    
    pieza.PiezaId = data.PiezaId;
    pieza.Nombre = data.Nombre;
    pieza.FormulaAncho = data.FormulaAncho;
    pieza.FormulaLargo = data.FormulaLargo;
    pieza.FormulaAncho2 = data.FormulaAncho;
    pieza.FormulaLargo2 = data.FormulaLargo;
    
    if(data.Activo == "1")
    {
        pieza.Activo = true;
    }
    else
    {
        pieza.Activo = false;
    }
    
    return pieza;
}

//agrega una pieza
function AgregarPieza($http, CONFIG, $q, pieza)
{
    var q = $q.defer();
    
    if(pieza.Activo)
    {
        pieza.Activo = "1";
    }
    else
    {
        pieza.Activo = "0";
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarPieza',
          data: pieza

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

//edita una pieza
function EditarPieza($http, CONFIG, $q, pieza)
{
    var q = $q.defer();
    
    if(pieza.Activo)
    {
        pieza.Activo = "1";
    }
    else
    {
        pieza.Activo = "0";
    }
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarPieza',
          data: pieza

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

function ActivarDesactivarPieza($http, $q, CONFIG, pieza) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarPieza',
          data: pieza

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}