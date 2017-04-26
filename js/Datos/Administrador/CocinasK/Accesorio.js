/*--------------------------------- Componete ------------------------------*/
class Accesorio
{
    constructor()
    {
        this.AccesorioId = "";
        this.TipoAccesorio = new TipoAccesorio(); 
        this.Muestrario = new Muestrario(); 
        this.Nombre = "";
        this.Imagen = "";
        this.CostoUnidad = "";
        this.ConsumoUnidad = "";
        this.Contable = true;
        this.Obligatorio = true;
        this.Activo = true; 
    }
}

//obtiene los compoenetes para los módulos
function GetAccesorio($http, $q, CONFIG, conf)     
{
    var q = $q.defer();
    
    var servicio = "";
    if(conf == "presupuesto")
    {
        servicio = '/GetAccesorioPresupuesto';
    }
    else
    {
        servicio = '/GetAccesorio';
    }
    
    $http({      
          method: 'GET',
          url: CONFIG.APIURL + servicio,

      }).success(function(data)
        {
            var accesorio = []; 
            
            for(var k=0; k<data.length; k++)
            {
                accesorio[k] = new Accesorio();
                accesorio[k] = SetAccesorio(data[k]);
            }
        
            q.resolve(accesorio);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function GetAccesorioClase($http, $q, CONFIG, clase)     
{
    var q = $q.defer();
    var datos = [];
    datos[0] = clase;
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetAccesorioClase',
          data: datos
      }).success(function(data)
        {
            var accesorio = []; 
            
            for(var k=0; k<data.length; k++)
            {
                accesorio[k] = new Accesorio();
                accesorio[k] = SetAccesorio(data[k]);
            }
        
            q.resolve(accesorio);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetAccesorio(data)
{
    var accesorio = new Accesorio();
    
    accesorio.AccesorioId = data.AccesorioId;
    accesorio.Nombre = data.Nombre;
    accesorio.Imagen = data.Imagen;
    accesorio.MuestrarioId = data.MuestrarioId;
    
    accesorio.CostoUnidad = parseFloat(data.CostoUnidad);
    accesorio.ConsumoUnidad = parseFloat(data.ConsumoUnidad);
    
    accesorio.TipoAccesorio.TipoAccesorioId = data.TipoAccesorioId;
    accesorio.TipoAccesorio.Nombre = data.NombreTipoAccesorio;
    
    accesorio.TipoAccesorio.ClaseAccesorio.ClaseAccesorioId = data.ClaseAccesorioId;
    accesorio.TipoAccesorio.ClaseAccesorio.Nombre = data.NombreClaseAccesorio;
    
    accesorio.Muestrario.MuestrarioId = data.MuestrarioId;
    accesorio.Muestrario.Nombre = data.NombreMuestrario;
    
    if(data.Contable == "1")
    {
        accesorio.Contable = true;
    }
    else
    {
        accesorio.Contable = false;
    }
    
    if(data.Obligatorio == "1")
    {
        accesorio.Obligatorio = true;
    }
    else
    {
        accesorio.Obligatorio = false;
    }
    
    if(data.Activo == "1")
    {
        accesorio.Activo = true;
    }
    else
    {
        accesorio.Activo = false;
    }
    
    return accesorio;
}


//agrega un accesorio
function AgregarAccesorio($http, CONFIG, $q, accesorio)
{
    var q = $q.defer();
    
    accesorio.Activo = CambiarDatoBool(accesorio.Activo);
    accesorio.Contable = CambiarDatoBool(accesorio.Contable);
    accesorio.Obligatorio = CambiarDatoBool(accesorio.Obligatorio);

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarAccesorio',
          data: accesorio

      }).success(function(data)
        {
            q.resolve(data);
        
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

//edita un accesorio
function EditarAccesorio($http, CONFIG, $q, accesorio)
{
    var q = $q.defer();
    
    accesorio.Activo = CambiarDatoBool(accesorio.Activo);
    accesorio.Contable = CambiarDatoBool(accesorio.Contable);
    accesorio.Obligatorio = CambiarDatoBool(accesorio.Obligatorio);
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarAccesorio',
          data: accesorio

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

function ActivarDesactivarAccesorio($http, $q, CONFIG, accesorio) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarAccesorio',
          data: accesorio

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

//Guardar una imagen del color en la base de datos
function GuardarImagenAccesorio($http, $q, CONFIG, imagen, accesorioId) 
{
    var q = $q.defer();
    
    var xhr = new XMLHttpRequest();
        
    var file = imagen[0];
    var name = imagen[0].name;
    var fd = new FormData();
    fd.append('file', file);

    $http(
    {
      method: 'POST',
      url:   CONFIG.APIURL  + '/GuardarImagenAccesorio/'+accesorioId,
      data: fd,

      headers: 
      {
        "Content-type": undefined 
      },
      //transformRequest: fd

        }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);
    });
    
    return q.promise;
}

/*------------------------Tipo Accesorio ---------------------------------------*/

class ClaseAccesorio
{
    constructor()
    {
        this.ClaseAccesorioId = "";
        this.Nombre = "";
    }
}

class TipoAccesorio
{
    constructor()
    {
        this.TipoAccesorioId = "";
        this.Nombre = "";
        this.ClaseAccesorio = new ClaseAccesorio();
        this.Instrucciones = null; 
        this.Activo = true;
        this.NombreArchivo = "";
    }
}

function GetTipoAccesorio($http, $q, CONFIG, conf)    // obtener las piezas del componente indicado
{
    var q = $q.defer();
    
    var servicio = "";
    
    if(conf == "presupuesto")
    {
        servicio = '/GetTipoAccesorioPresupuesto';
    }
    else
    {
        servicio = '/GetTipoAccesorio';
    }
    
    $http({      
          method: 'Get',
          url: CONFIG.APIURL + servicio

      }).success(function(data)
        {
            var tipoAccesorio = []; 
            
            for(var k=0; k<data.length; k++)
            {
                tipoAccesorio[k] = new TipoAccesorio();
                tipoAccesorio[k] = SetTipoAccesorio(data[k]);
            }
        
            q.resolve(tipoAccesorio);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function SetTipoAccesorio(data)
{
    var tipoAccesorio = new TipoAccesorio();
    
    tipoAccesorio.TipoAccesorioId = data.TipoAccesorioId;
    tipoAccesorio.Nombre = data.Nombre;
    tipoAccesorio.Instrucciones = data.Instrucciones;
    tipoAccesorio.NombreArchivo = data.NombreArchivo;
    
    if(data.Activo == "1")
    {
        tipoAccesorio.Activo = true;
    }
    else
    {
        tipoAccesorio.Activo = false;
    }
    
    tipoAccesorio.ClaseAccesorio.ClaseAccesorioId = data.ClaseAccesorioId;
    tipoAccesorio.ClaseAccesorio.Nombre = data.NombreClaseAccesorio;
    
    return tipoAccesorio;
}

function AgregarTipoAccesorio($http, CONFIG, $q, tipo)
{
    var q = $q.defer();
    
    if(tipo.Activo)
    {
        tipo.Activo = "1";
    }
    else
    {
        tipo.Activo = "0";
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarTipoAccesorio',
          data: tipo

      }).success(function(data)
        {
            q.resolve(data);
            
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

//edita un tipo de accsesorio
function EditarTipoAccesorio($http, CONFIG, $q, tipo)
{
    var q = $q.defer();
    
    if(tipo.Activo)
    {
        tipo.Activo = "1";
    }
    else
    {
        tipo.Activo = "0";
    }
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarTipoAccesorio',
          data: tipo

      }).success(function(data)
        {
            q.resolve(data);   
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

function ActivarDesactivarTipoAccesorio($http, $q, CONFIG, tipo) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarTipoAccesorio',
          data: tipo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

function GetClaseAccesorio()
{
    var claseAccesorio = [];
    
    claseAccesorio[0] = new ClaseAccesorio();
    claseAccesorio[0].ClaseAccesorioId = "1";
    claseAccesorio[0].Nombre = "Compra-venta";
    
    claseAccesorio[1] = new ClaseAccesorio();
    claseAccesorio[1].ClaseAccesorioId = "2";
    claseAccesorio[1].Nombre = "Madera";
    
    return claseAccesorio;
}


/*-------------- Guardar Archivo de Instrucciones ------------------------------*/
function GuardarInstrucciones($http, $q, CONFIG, archivo, tipoId) 
{
    var q = $q.defer();
    
    var xhr = new XMLHttpRequest();
        
    var file = archivo[0];
    var name = archivo[0].name;
    var fd = new FormData();
    fd.append('file', file);
    fd.append('Nombre', name);

    $http(
    {
      method: 'POST',
      url:   CONFIG.APIURL  + '/GuardarInstrucciones/'+tipoId,
      data: fd,

      headers: 
      {
        "Content-type": undefined 
      },
      //transformRequest: angular.identity

        }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);
    });
    
    return q.promise;
}


/*----------------------------CombinacionPorMaterialAccesorio-----------------------------------*/
class CombincacionPorMaterialAccesorio
{
    constructor()
    {
        this.CombincacionPorMaterialAccesorioId = "";
        this.Material = new Material();
        this.Accesorio = new Accesorio();
        this.CombinacionMaterial = new CombinacionMaterial();
        this.Grueso = "";
    }
}

function GetCombinacionPorAccesorio($http, $q, CONFIG, id, modulo)    // obtener los componentes del módulo
{
    var q = $q.defer();
    
    var dato = [];
    dato[0] = id;
    dato[1] = modulo;
        

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetCombinacionPorAccesorio',
          data: dato

      }).success(function(data)
        {
            var combinacionAccesorio = []; 
            
            for(var k=0; k<data.length; k++)
            {
                combinacionAccesorio[k] = new CombincacionPorMaterialAccesorio();
                combinacionAccesorio[k] = SetCombinacionPorAccesorio(data[k]);
            }
        
            q.resolve(combinacionAccesorio);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

//copia los datos de una combinacion de materiales por componente
function SetCombinacionPorAccesorio(data)
{
    var combinacion = new CombincacionPorMaterialAccesorio();
    
    combinacion.CombincacionPorMaterialAccesorioId = data.CombincacionPorMaterialAccesorioId;
    combinacion.Grueso = data.Grueso;
    
    combinacion.Material.TipoMaterial.TipoMaterialId = data.TipoMaterialId;
    combinacion.Material.TipoMaterial.Nombre = data.NombreTipoMaterial;
    
    combinacion.Material.MaterialId = data.MaterialId;
    combinacion.Material.Nombre = data.NombreMaterial;
    
    combinacion.Accesorio.AccesorioId = data.AccesorioId;
    combinacion.Accesorio.Nombre = data.NombreAccesorio;
    
    if(data.ActivoAccesorio == "1")
    {
        combinacion.Accesorio.Activo = true;
    }
    else
    {
        combinacion.Accesorio.Activo = false;
    }
    
    combinacion.CombinacionMaterial.CombinacionMaterialId = data.CombinacionMaterialId;
    combinacion.CombinacionMaterial.Nombre = data.Nombre;
    
    if(data.ActivoCombinacionMaterial == "1")
    {
        combinacion.CombinacionMaterial.Activo = true;
    }
    else
    {
        combinacion.CombinacionMaterial.Activo = false;
    }
    
    return combinacion;
}

/*---------- Get Instrucciones -------------------*/
function GetInstruccionesTipoAccesorio($http, $q, CONFIG, id)     
{
    var q = $q.defer();
    
    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetInstruccionesTipoAccesorio/'+id,
      }).success(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                q.resolve(data[1].Instrucciones[0]);  
            }
            else
            {
                q.resolve([]);      
            }
            
        }).error(function(data, status){
            q.resolve([]);
     }); 
    return q.promise;
}