/*------Medio Contacto---------*/

class PlanPago
{
    constructor()
    {
        this.PlanPagoId = "";
        this.Nombre = "";
        this.Pagos = 1;
        this.Activo = true;
    }
}

//obtiene los tipos de módulos
function GetPlanPago($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetPlanPago',

      }).success(function(data)
        {
            var planPago = []; 
            
            for(var k=0; k<data.length; k++)
            {
                planPago[k] = new PlanPago();
                planPago[k] = SetPlanPago(data[k]);
            }
        
            q.resolve(planPago);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetPlanPago(data)
{
    var planPago = new PlanPago();
    
    planPago.PlanPagoId = data.PlanPagoId;
    planPago.Nombre = data.Nombre;
    planPago.Pagos = parseFloat(data.Pagos);
    
    planPago.Activo = CambiarDatoEnteroABool(data.Activo);
    
    return planPago;
}

//agregaga un servicio
function AgregarPlanPago($http, CONFIG, $q, plan)
{
    var q = $q.defer();
    
    plan.Activo = CambiarDatoBool(plan.Activo);

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarPlanPago',
          data: plan

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
function EditarPlanPago($http, CONFIG, $q, plan)
{
    var q = $q.defer();
    
    plan.Activo = CambiarDatoBool(plan.Activo);

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarPlanPago',
          data: plan

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

function ActivarDesactivarPlanPago($http, $q, CONFIG, plan) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarPlanPago',
          data: plan

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

/*------------ unidades de negocio----------------*/
function GetPlanPagoAbono($http, $q, CONFIG, id)     
{
    var q = $q.defer();

    var datos = [];
    datos[0] = id;
        
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetPlanPagoAbono',
          data: datos
      }).success(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                data[k].NumeroAbono = parseInt(data[k].NumeroAbono);
                data[k].Dias = parseInt(data[k].Dias);
                data[k].Abono = parseFloat(data[k].Abono);
            }
            q.resolve(data);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}