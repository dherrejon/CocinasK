/*---------------- Empresa ------------*/
class Empresa
{
    constructor()           //inicializar datos
    {
        this.EmpresaId = "";
        this.Pais = new Pais();
        this.Nombre = "";
        this.RFC = "";
        this.email = "";
        this.Domicilio = "";
        this.Estado = "";
        this.Municipio = "";
        this.Ciudad = "";
        this.Colonia = "";
        this.Codigo = "";
        this.Activo = "";
    }
}

//Obtien las empresa
function GetEmpresa($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetEmpresa',

      }).success(function(data)
        {
            var empresa = []; 
            
            for(var k=0; k<data.length; k++)
            {
                empresa[k] = new Empresa();
                empresa[k] = SetEmpresa(data[k]);
            }
        
            q.resolve(empresa);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un empresa
function SetEmpresa(data)
{
    var empresa = new Empresa();
    
    empresa.EmpresaId = data.EmpresaId;
    empresa.Pais = new Pais();
    empresa.Pais.PaisId = data.PaisId;
    empresa.Pais.nombre = data.NombrePais;
    empresa.Nombre = data.Nombre;
    empresa.RFC = data.RFC;
    empresa.email = data.email;
    empresa.Domicilio = data.Domicilio;
    empresa.Colonia = data.Colonia;
    empresa.Estado = data.Estado;
    empresa.Municipio = data.Municipio;
    empresa.Ciudad = data.Ciudad;
    empresa.Codigo = data.Codigo;
    
    if(data.Activo == "1")
        empresa.Activo = true;
    else
        empresa.Activo = false;
    
    return empresa;
}

//agrega una empresa
function AgregarEmpresa($http, CONFIG, $q, nuevaEmpresa)
{
    var q = $q.defer();
    
    if(nuevaEmpresa.Activo)
    {
        nuevaEmpresa.Activo = 1;
    }
    else
    {
        nuevaEmpresa.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarEmpresa',
          data: nuevaEmpresa

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

//edita una empresa
function EditarEmpresa($http, CONFIG, $q, nuevaEmpresa)
{
    var q = $q.defer();
    
    if(nuevaEmpresa.Activo)
    {
        nuevaEmpresa.Activo = 1;
    }
    else
    {
        nuevaEmpresa.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarEmpresa',
          data: nuevaEmpresa

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

//Activar - Desactivar Empresa
function ActivarDesactivarEmpresa($http, $q, CONFIG, empresa) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarEmpresa',
          data: empresa

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, status){
            q.resolve(status);

     }); 
    
    return q.promise;
}

/*---------------- Tipo de Unidad de Negocio ------------*/

class TipoUnidadNegocio
{
    constructor()           //inicializar datos
    {
        this.TipoUnidadNegocioId = "";
        this.Nombre = "";
        this.Activo = "";
    }
}

//Obtiene los tipo de unidades de negocio
function GetTipoUnidadNegocio($http, $q, CONFIG)   
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoUnidadNegocio',

      }).success(function(data)
        {
            var tipoUnidadNegocio = []; 
            
            for(var k=0; k<data.length; k++)
            {
                tipoUnidadNegocio[k] = new TipoUnidadNegocio();
                tipoUnidadNegocio[k] = SetTipoUnidadNegocioActivo(data[k].TipoUnidadNegocioId, data[k].Nombre, data[k].Activo);
            }
        
            q.resolve(tipoUnidadNegocio);  
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

//copia los datos de un tipo de unidad de negocio
function SetTipoUnidadNegocio(id, nombre)
{
    var tipoUnidadNegocio = new TipoUnidadNegocio();
    tipoUnidadNegocio.TipoUnidadNegocioId = id;
    tipoUnidadNegocio.Nombre = nombre;
    return tipoUnidadNegocio;
}

//copia los datos de un tipo de unidad de negocio donde se necesita saber el estado de activo
function SetTipoUnidadNegocioActivo (id, nombre, activo)
{
    var tipoUnidadNegocio = new TipoUnidadNegocio();
    tipoUnidadNegocio.TipoUnidadNegocioId = id;
    tipoUnidadNegocio.Nombre = nombre;

    if(activo == "1")
        tipoUnidadNegocio.Activo = true;
    else
        tipoUnidadNegocio.Activo = false;
    
    return tipoUnidadNegocio;
}

//agregaga un tipo de unidad de negocio
function AgregarTipoUnidadNegocio($http, CONFIG, $q, NuevoTipoUnidad)
{
    var q = $q.defer();
    
    if(NuevoTipoUnidad.Activo)
    {
        NuevoTipoUnidad.Activo = 1;
    }
    else
    {
        NuevoTipoUnidad.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarTipoUnidadNegocio',
          data: NuevoTipoUnidad

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

//edita un tipo de unidad de negocio
function EditarTipoUnidadNegocio($http, CONFIG, $q, NuevoTipoUnidad)
{
    var q = $q.defer();
    
    if(NuevoTipoUnidad.Activo)
    {
        NuevoTipoUnidad.Activo = 1;
    }
    else
    {
        NuevoTipoUnidad.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarTipoUnidadNegocio',
          data: NuevoTipoUnidad

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

 //Activar - Desactivar Tipo unidad negocio
function ActivarDesactivarTipoUnidad($http, $q, CONFIG, tipo)
{
    var q = $q.defer();
        
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarTipoUnidadNegocio',
          data: tipo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, status){
            q.resolve(status);

     }); 
    
    return q.promise;
}

/*---------------- Unidad Negocio------------*/

class UnidadNegocio
{
    constructor()           //inicializar datos
    {
        this.Colaborador = "";
        this.ColaboradorId = "";
        this.TipoUnidadNegocio = new TipoUnidadNegocio();
        this.Empresa = new Empresa();
        this.UnidadNegocioId = "";
        this.Nombre = "";
        this.Telefono = "";
        this.Domicilio = "";
        this.Colonia = "";
        this.Estado = "";
        this.Municipio = "";
        this.Ciudad = "";
        this.Codigo = "";
        this.Activo = "";
        this.Pais = new Pais();
    }
}

//obtiene las unidades de negocio
function GetUnidadNegocio($http, $q, CONFIG)    
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetUnidadNegocio',

      }).success(function(data)
        {
            var unidadNegocio = new UnidadNegocio();
            unidadNegocio = SetUnidadNegocio(data);
            q.resolve(unidadNegocio);  
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

//copia los datos de las unidades de negocio
function SetUnidadNegocio(data)
{
    var unidadNegocio = [];
    
    for(var k=0; k<data.length; k++)
    {
        unidadNegocio[k] = new UnidadNegocio();
        unidadNegocio[k].Colaborador = data[k].colaborador;
        unidadNegocio[k].ColaboradorId = data[k].ColaboradorId;
        unidadNegocio[k].Empresa.EmpresaId = data[k].EmpresaId;
        unidadNegocio[k].Empresa.Nombre = data[k].NombreEmpresa;
        unidadNegocio[k].TipoUnidadNegocio = SetTipoUnidadNegocio(data[k].TipoUnidadNegocioId, data[k].NombreTipoUnidadNegocio);
        unidadNegocio[k].UnidadNegocioId = data[k].UnidadNegocioId;
        unidadNegocio[k].Nombre = data[k].Nombre;
        unidadNegocio[k].Telefono = data[k].Telefono;
        unidadNegocio[k].Domicilio = data[k].Domicilio;
        unidadNegocio[k].Colonia = data[k].Colonia;
        unidadNegocio[k].Estado = data[k].Estado;
        unidadNegocio[k].Municipio = data[k].Municipio;
        unidadNegocio[k].Ciudad = data[k].Ciudad;
        unidadNegocio[k].Codigo = data[k].Codigo;
        unidadNegocio[k].Pais = SetPais(data[k].PaisId, data[k].NombrePais);
        if(data[k].Activo == "1")
            unidadNegocio[k].Activo = true;
        else
            unidadNegocio[k].Activo = false;
    }
    
    return unidadNegocio;
}

//agregar una unidad de negocio
function AgregarUnidadNegocio($http, CONFIG, $q, NuevaUnidad)
{
    var q = $q.defer();
    
    if(NuevaUnidad.Activo)
    {
        NuevaUnidad.Activo = 1;
    }
    else
    {
        NuevaUnidad.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarUnidadNegocio',
          data: NuevaUnidad

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

//editar unidad de negocio
function EditarUnidadNegocio($http, CONFIG, $q, NuevaUnidad)
{
    var q = $q.defer();
    
    if(NuevaUnidad.Activo)
    {
        NuevaUnidad.Activo = 1;
    }
    else
    {
        NuevaUnidad.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarUnidadNegocio',
          data: NuevaUnidad

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

 //Activar - Desactivar Unidades de Negocio
function ActivarDesactivarUnidad($http, $q, CONFIG, datos)
{
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarUnidad',
          data: datos

      }).success(function(data)
        {
            if(data[0].renglones == "1")
                q.resolve("Exito"); 
            else
                q.resolve("Error");  
        }).error(function(data, status){
            q.resolve(status);

     }); 
    
    return q.promise;
}

 //Obtiene las unidades de negocio, pero solomente sus datos ensenciales
function GetUnidadNegocioSencilla($http, $q, CONFIG)    
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetUnidadNegocioSencilla',

      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

/* ---------------------- Responsables ----------------------------- */
class Responsable
{
    constructor()
    {
        this.ColaboradorId = "";
        this.Nombre = "";
    }
}

//Obtiene el nombre de los colaboradores que son posibles responsables de una unidad de negocio
function GetResponsable($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetResponsable',

      }).success(function(data)
        {
            var responsable = []; 
            
            for(var k=0; k<data.length; k++)
            {
                responsable[k] = new Responsable();
                responsable[k].Nombre = data[k].Nombre;
                responsable[k].ColaboradorId = data[k].ColaboradorId;
                responsable[k].UnidadNegocioId = data[k].UnidadNegocioId;
            }
        
            q.resolve(responsable);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}