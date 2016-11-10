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