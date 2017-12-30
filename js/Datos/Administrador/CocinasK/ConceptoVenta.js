/*------Medio Contacto---------*/

class ConceptoVenta
{
    constructor()
    {
        this.ConceptoVentaId = "";
        this.Nombre = "";
        this.IVA = true;
        this.Activo = true;
    }
}

//obtiene los tipos de módulos
function GetConceptoVenta($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetConceptoVenta',

      }).success(function(data)
        {
            var concepto = []; 
            
            if(data[0].Estatus == "Exito")
            {
                for(var k=0; k<data[1].ConceptoVenta.length; k++)
                {
                    concepto[k] = SetConceptoVenta(data[1].ConceptoVenta[k]);
                }
            }
        
            q.resolve(concepto);  
        }).error(function(data, status){
            q.resolve([]);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetConceptoVenta(data)
{
    var concepto = new ConceptoVenta();
    
    concepto.ConceptoVentaId = data.ConceptoVentaId;
    concepto.Nombre = data.Nombre;
    
    concepto.Activo = CambiarDatoEnteroABool(data.Activo);
    concepto.IVA = CambiarDatoEnteroABool(data.IVA);
    
    return concepto;
}

//agregaga un tipo de proyecto
function AgregarConceptoVenta($http, CONFIG, $q, concepto)
{
    var q = $q.defer();
    
    concepto.Activo = CambiarDatoBool(concepto.Activo);
    concepto.IVA = CambiarDatoBool(concepto.IVA);

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarConceptoVenta',
          data: concepto

      }).success(function(data)
        {
            
            if(data[0].Estatus == "Exitoso") 
            {
                q.resolve(data);
            }
            else
            {
                q.resolve(data);
            }
            
        }).error(function(data, status){
            q.resolve([{Estatus: status}]);

     }); 
    return q.promise;
}

//editar un concepto de venta
function EditarConceptoVenta($http, CONFIG, $q, concepto)
{
    var q = $q.defer();
    
    concepto.Activo = CambiarDatoBool(concepto.Activo);
    concepto.IVA = CambiarDatoBool(concepto.IVA);

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarConceptoVenta',
          data: concepto

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

function ActivarDesactivarConceptoVenta($http, $q, CONFIG, concepto) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarConceptoVenta',
          data: concepto

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve([{Estatus: Estatus}]);

     }); 
    
    return q.promise;
}