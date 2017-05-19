/*------Medio Contacto---------*/

class TipoProyecto
{
    constructor()
    {
        this.TipoProyectoId = "";
        this.Nombre = "";
        this.Mueble = true;
        this.CubiertaAglomerado = true;
        this.CubiertaPiedra = true; 
        this.IVA = true; 
        this.LibreIVA = true; 
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetTipoProyecto($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoProyecto',

      }).success(function(data)
        {
            var tipoProyecto = []; 
            
            if(data[0].Estatus == "Exito")
            {
                for(var k=0; k<data[1].TipoProyecto.length; k++)
                {
                    tipoProyecto[k] = SetTipoProyecto(data[1].TipoProyecto[k]);
                }
            }
        
            q.resolve(tipoProyecto);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetTipoProyecto(data)
{
    var tipoProyecto = new TipoProyecto();
    
    tipoProyecto.TipoProyectoId = data.TipoProyectoId;
    tipoProyecto.Nombre = data.Nombre;
    
    tipoProyecto.Mueble = CambiarDatoEnteroABool(data.Mueble);
    tipoProyecto.CubiertaAglomerado = CambiarDatoEnteroABool(data.CubiertaAglomerado);
    tipoProyecto.CubiertaPiedra = CambiarDatoEnteroABool(data.CubiertaPiedra);
    tipoProyecto.IVA = CambiarDatoEnteroABool(data.IVA);
    tipoProyecto.LibreIVA = CambiarDatoEnteroABool(data.LibreIVA);
    tipoProyecto.Activo = CambiarDatoEnteroABool(data.Activo);
    
    return tipoProyecto;
}

//agregaga un tipo de proyecto
function AgregarTipoProyecto($http, CONFIG, $q, tipoProyecto)
{
    var q = $q.defer();
    
    tipoProyecto.Mueble = CambiarDatoBool(tipoProyecto.Mueble);
    tipoProyecto.CubiertaAglomerado = CambiarDatoBool(tipoProyecto.CubiertaAglomerado);
    tipoProyecto.CubiertaPiedra = CambiarDatoBool(tipoProyecto.CubiertaPiedra);
    tipoProyecto.IVA = CambiarDatoBool(tipoProyecto.IVA);
    tipoProyecto.LibreIVA = CambiarDatoBool(tipoProyecto.LibreIVA);
    tipoProyecto.Activo = CambiarDatoBool(tipoProyecto.Activo);

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarTipoProyecto',
          data: tipoProyecto

      }).success(function(data)
        {
            
            if(data[0].Estatus == "Exitoso") 
            {
                q.resolve(data);
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
function EditarTipoProyecto($http, CONFIG, $q, tipoProyecto)
{
    var q = $q.defer();
    
    tipoProyecto.Mueble = CambiarDatoBool(tipoProyecto.Mueble);
    tipoProyecto.CubiertaAglomerado = CambiarDatoBool(tipoProyecto.CubiertaAglomerado);
    tipoProyecto.CubiertaPiedra = CambiarDatoBool(tipoProyecto.CubiertaPiedra);
    tipoProyecto.IVA = CambiarDatoBool(tipoProyecto.IVA);
    tipoProyecto.LibreIVA = CambiarDatoBool(tipoProyecto.LibreIVA);
    tipoProyecto.Activo = CambiarDatoBool(tipoProyecto.Activo);

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarTipoProyecto',
          data: tipoProyecto

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

function ActivarDesactivarTipoProyecto($http, $q, CONFIG, tipoProyecto) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarTipoProyecto',
          data: tipoProyecto

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}