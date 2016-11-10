/*-------------------------Pais-------------*/
class Pais
{
    constructor()
    {
        this.PaisId = "";
        this.Nombre = "";
    }
}

//copia los datos de un país
function SetPais(id, nombre)
{
    var pais = new Pais();
    pais.PaisId = id;
    pais.Nombre = nombre;
    return pais;
}

//regresa los paises
function GetPais()
{
    var pais =[];
        
    pais[0] = new Pais();
    pais[0] = SetPais(1, "México");
    
    return pais;
}

/*---------------------- Codigo Postal ------------------------------*/
class CodigoPostal
{
    constructor()
    {
        this.CodigoPostalId = "";
        this.Codigo = "";
        this.Estado = "";
        this.Municipio = "";
        this.Ciudad = "";
        this.Colonia = "";
    }
}

//obtine los datos relacionados a un codigo postal
function GetCodigoPostal($http, $q, CONFIG, dato)
{
    var q = $q.defer();
    var datos = [];
    datos[0] = dato;
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetCodigoPostal',
          data: datos

      }).success(function(data)
        {
            var codigoPostal = []; 
        
            codigoPostal = SetCodigoPostal(data);
            
        
            q.resolve(codigoPostal);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//Copia los datos de un codigo postal
function SetCodigoPostal(data)
{
    var codigoPostal = [];
    
    for(var k=0; k<data.length; k++)
    {
        codigoPostal[k] = new CodigoPostal();
        
        codigoPostal[k].CodigoPostalId = data[k].CodigoPostalId;
        codigoPostal[k].Codigo = data[k].Codigo;
        codigoPostal[k].Estado = data[k].Estado;
        codigoPostal[k].Municipio = data[k].Municipio;
        codigoPostal[k].Ciudad = data[k].Ciudad;
        codigoPostal[k].Colonia = data[k].Colonia;
    }
    
    return codigoPostal;
}

 //Obtiene los estados de  mexico sin que se repitan
function GetEstadoMexico($http, $q, CONFIG)    
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetEstadoMexico',

      }).success(function(data)
        {
            var estado = []; 
            estado = data;
            
            q.resolve(estado);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}