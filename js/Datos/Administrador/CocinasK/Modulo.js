/*---------------------------------Tipo de módulo------------------------------*/
class TipoModulo
{
    constructor()
    {
        this.TipoModuloId = "";
        this.Nombre = ""; 
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetTipoModulo($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoModulo',

      }).success(function(data)
        {
            var tipoModulo = []; 
            
            for(var k=0; k<data.length; k++)
            {
                tipoModulo[k] = new TipoModulo();
                tipoModulo[k] = SetTipoModulo(data[k]);
            }
        
            q.resolve(tipoModulo);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos del tipo modulo
function SetTipoModulo(data)
{
    var tipoModulo = new TipoModulo();
    
    tipoModulo.TipoModuloId = data.TipoModuloId;
    tipoModulo.Nombre = data.Nombre;
    
    if(data.Activo == "1")
    {
        tipoModulo.Activo = true;
    }
    else
    {
        tipoModulo.Activo = false;
    }
    
    return tipoModulo;
}

//agregaga un tipo de módulo
function AgregarTipoModulo($http, CONFIG, $q, tipoModulo)
{
    var q = $q.defer();
    
    if(tipoModulo.Activo)
    {
        tipoModulo.Activo = 1;
    }
    else
    {
        tipoModulo.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarTipoModulo',
          data: tipoModulo

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
function EditarTipoModulo($http, CONFIG, $q, tipoModulo)
{
    var q = $q.defer();
    
    if(tipoModulo.Activo)
    {
        tipoModulo.Activo = 1;
    }
    else
    {
        tipoModulo.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarTipoModulo',
          data: tipoModulo

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

//Activar - Desactivar Tipo de Módulo
function ActivarDesactivarTipoModulo($http, $q, CONFIG, tipoModulo) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarTipoModulo',
          data: tipoModulo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

/*--------------------------------- módulo------------------------------*/
class Modulo
{
    constructor()
    {
        this.ModuloId = "";
        this.TipoModulo = new TipoModulo(); 
        this.TipoModuloId = ""; 
        this.Nombre = "";
        this.Margen = "";
        this.Imagen = "";
        this.NumeroSeccion = "";
        this.Desperdicio = "";
        this.Activo = true;
        this.ActivoN = 1;
    }
}

//obtiene los tipos de módulos
function GetModulo($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetModulo',

      }).success(function(data)
        {
            var modulo = []; 
            
            for(var k=0; k<data.length; k++)
            {
                modulo[k] = new Modulo();
                modulo[k] = SetModulo(data[k]);
            }
        
            q.resolve(modulo);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos del modulo
function SetModulo(data)
{
    var modulo = new Modulo();
    
    modulo.TipoModulo.TipoModuloId = data.TipoModuloId;
    modulo.TipoModulo.Nombre = data.NombreTipoModulo;
    
    modulo.ModuloId = data.ModuloId;
    modulo.TipoModuloId = data.TipoModuloId;
    modulo.Nombre = data.Nombre;
    modulo.Margen = parseFloat(data.Margen);
    modulo.Imagen = data.Imagen;
    modulo.NumeroSeccion = parseInt(data.NumeroSeccion);
    modulo.Desperdicio = parseFloat(data.Desperdicio);
    modulo.ActivoN = data.Activo;
    
    if(data.Activo == "1")
    {
        modulo.Activo = true;
    }
    else
    {
        modulo.Activo = false;
    }
    
    return modulo;
}

//agregaga un modulo
function AgregarModulo($http, CONFIG, $q, modulo)
{
    var q = $q.defer();
    
    if(modulo.Activo)
    {
        modulo.Activo = 1;
    }
    else
    {
        modulo.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarModulo',
          data: modulo

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

//edita un modulo
function EditarModulo($http, CONFIG, $q, modulo)
{
    var q = $q.defer();
    
    if(modulo.Activo)
    {
        modulo.Activo = 1;
    }
    else
    {
        modulo.Activo = 0;
    }
    
    for(var k=0; k<modulo.MedidasPorModulo.length; k++)
    {
        if(modulo.MedidasPorModulo[k].Activo)
        {
            modulo.MedidasPorModulo[k].Activo = 1;
        }
        else
        {
            modulo.MedidasPorModulo[k].Activo = 0;
        }
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarModulo',
          data: modulo

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

//Guardar una imagen del módulo en la base de datos
function GuardarImagenModulo($http, $q, CONFIG, imagen, moduloId) 
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
      url:   CONFIG.APIURL  + '/GuardarImagenModulo/'+moduloId,
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

//Activar - Desactivar Módulo
function ActivarDesactivarModulo($http, $q, CONFIG, modulo) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarModulo',
          data: modulo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

//editar un contacto del colaborador
function EditarMedidaPorModulo($http, CONFIG, $q, medida)
{
    var q = $q.defer();

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarMedidaPorModulo',
          data: medida

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


/*--Catálagos auxiliares----*/
class MedidasPorModulo
{
    constructor()
    {
        this.MedidasPorModuloId = "";
        this.ModuloId = "";
        this.Ancho = "";
        this.Alto = ""; 
        this.Profundo = "";
        this.Activo = 1;
    }
}

function GetMedidasPorModulo($http, $q, CONFIG, id)    // obtener las medidas de un módulo
{
    var q = $q.defer();
    
    var moduloId = [];
    moduloId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetMedidasPorModulo',
          data: moduloId

      }).success(function(data)
        {
            var medidaPorModulo = []; 
            
            for(var k=0; k<data.length; k++)
            {
                medidaPorModulo[k] = new MedidasPorModulo();
                medidaPorModulo[k] = SetMedidaPorModulo(data[k]);
            }
        
            q.resolve(medidaPorModulo);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function SetMedidaPorModulo(datos)
{
    var medidaPorModulo = new MedidasPorModulo();
    
    medidaPorModulo.MedidasPorModuloId = datos.MedidasPorModuloId;
    medidaPorModulo.ModuloId = datos.ModuloId;
    medidaPorModulo.Ancho = datos.Ancho;
    medidaPorModulo.Alto = datos.Alto;
    medidaPorModulo.Profundo = datos.Profundo;
    
    if(datos.Activo == "1")
    {
        medidaPorModulo.Activo = true;
    }
    else
    {
        medidaPorModulo.Activo = false;
    }
    
    
    return medidaPorModulo;
}

//Activar - Desactivar una medidas del módulo
function ActivarDesactivarMedidasPorModulo($http, $q, CONFIG, modulo) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarMedidasPorModulo',
          data: modulo

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

class ConsumiblePorModulo
{
    constructor()
    {
        this.ConsumiblePorModuloId = "";
        this.ModuloId = "";
        this.Consumible = new Consumible();
        this.Cantidad = ""; 
    }
}

function GetConsumiblePorModulo($http, $q, CONFIG, id)    // obtener los consumibles del módulo
{
    var q = $q.defer();
    
    var moduloId = [];
    moduloId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetConsumiblePorModulo',
          data: moduloId

      }).success(function(data)
        {
            var consumiblePorModulo = []; 
            
            for(var k=0; k<data.length; k++)
            {
                consumiblePorModulo[k] = new ConsumiblePorModulo();
                consumiblePorModulo[k] = SetConsumiblePorModulo(data[k]);
            }
        
            q.resolve(consumiblePorModulo);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function SetConsumiblePorModulo(datos)
{
    var consumibleModulo = new ConsumiblePorModulo();
    var consumible = new Consumible();
    
    consumibleModulo.ConsumiblePorModuloId = datos.ConsumiblePorModuloId;
    consumibleModulo.ModuloId = datos.ModuloId;
    consumibleModulo.Cantidad = datos.Cantidad;
    
    consumible.Nombre = datos.NombreConsumible;
    consumible.ConsumibleId = datos.ConsumibleId;
    consumible.Costo = parseFloat(datos.Costo);
    
    consumibleModulo.Consumible = consumible;
    
    return consumibleModulo;
}

class ComponentePorModulo
{
    constructor()
    {
        this.ComponentePorModuloId = "";
        this.ModuloId = "";
        this.Componente = new Componente();
        this.Cantidad = ""; 
    }
}

function GetComponentePorModulo($http, $q, CONFIG, id)    // obtener los componentes del módulo
{
    var q = $q.defer();
    
    var moduloId = [];
    moduloId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetComponentePorModulo',
          data: moduloId

      }).success(function(data)
        {
            var componentePorModulo = []; 
            
            for(var k=0; k<data.length; k++)
            {
                componentePorModulo[k] = new ComponentePorModulo();
                componentePorModulo[k] = SetComponentePorModulo(data[k]);
            }
        
            q.resolve(componentePorModulo);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function SetComponentePorModulo(datos)
{
    var componenteModulo = new ComponentePorModulo();
    var componente = new Componente();
    
    componenteModulo.ComponentePorModuloId = datos.ComponentePorModuloId;
    componenteModulo.ModuloId = datos.ModuloId;
    componenteModulo.Cantidad = datos.Cantidad;
    
    componente.Nombre = datos.NombreComponente;
    componente.ComponenteId = datos.ComponenteId;
    
    componenteModulo.Componente = componente;
    
    return componenteModulo;
}

class SeccionModulo
{
    constructor()
    {
        this.SeccionModuloId = "";
        this.Nombre = "";
    }
}

function GetSeccionModulo()  
{
    var seccion = [];
    
    seccion[0] = new SeccionModulo();
    seccion[0].SeccionModuloId = "1";
    seccion[0].Nombre = "Puerta";
    
    seccion[1] = new SeccionModulo();
    seccion[1].SeccionModuloId = "2";
    seccion[1].Nombre = "Cajón";
    
    seccion[2] = new SeccionModulo();
    seccion[2].SeccionModuloId = "3";
    seccion[2].Nombre = "Sección Vacia";
    
    return seccion;
}

class LuzPorSeccion
{
    constructor()
    {
        this.LuzPorSeccionId = "";
        //this.SeccionPorModulo = new SeccionPorModulo();
        this.Luz = "";
        this.NumeroEntrepano = "";
        this.AltoModulo = "";
    }
}

class SeccionPorModulo
{
    constructor()
    {
        this.SeccionPorModuloId = "";
        this.SeccionModulo = new SeccionModulo();
        this.ModuloId = "";
        this.NumeroPiezas = "";
        this.PeinazoVertical = "";
        this.LuzPorSeccion = [];
    }
}

function GetSeccionPorModulo($http, $q, CONFIG, id)    // obtener los componentes del módulo
{
    var q = $q.defer();
    
    var moduloId = [];
    moduloId[0] = id;
    var seccionPorModulo = []; 

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetSeccionPorModulo',
          data: moduloId

      }).success(function(data)
        {   
            for(var k=0; k<data.length; k++)
            {
                seccionPorModulo[k] = new SeccionPorModulo();
                seccionPorModulo[k] = SetSeccionPorModulo(data[k]);
            }
        
            q.resolve(seccionPorModulo);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function GetLuzPorSeccion($http, $q, CONFIG, id)    // obtener los componentes del módulo
{
    var q = $q.defer();
    
    var seccionId = [];
    seccionId[0] = id;
    var luzPorSeccion = []; 

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetLuzPorSeccion',
          data: seccionId

      }).success(function(data)
        {   
            for(var k=0; k<data.length; k++)
            {
                luzPorSeccion[k] = new LuzPorSeccion();
                luzPorSeccion[k] = SetLuzPorSeccion(data[k]);
            }
        
            q.resolve(luzPorSeccion);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function SetSeccionPorModulo(datos)
{
    var seccionPorModulo = new SeccionPorModulo();
    var seccion = new SeccionModulo();
    
    seccion.SeccionModuloId = datos.SeccionModuloId;
    seccion.Nombre = datos.NombreSeccionModulo;
    
    seccionPorModulo.SeccionModulo = seccion;
    seccionPorModulo.SeccionPorModuloId = datos.SeccionPorModuloId;
    seccionPorModulo.ModuloId = datos.ModuloId;
    seccionPorModulo.NumeroPiezas = datos.NumeroPiezas;
    seccionPorModulo.PeinazoVertical = datos.PeinazoVertical;

    return seccionPorModulo;
}

function SetLuzPorSeccion(datos)
{
    var luzSeccion = new LuzPorSeccion();
    
    
    luzSeccion.LuzPorSeccionId = datos.LuzPorSeccionId;
    luzSeccion.Luz = datos.Luz;
    luzSeccion.AltoModulo = datos.AltoModulo;
    luzSeccion.NumeroEntrepano = datos.NumeroEntrepano;
    
    return luzSeccion;
}

/*function SetLuzPorSeccion(datos)
{
    var luzSeccion = new LuzPorSeccion();
    var seccion = new SeccionModulo();
    var seccionModulo = new SeccionPorModulo();
    
    luzSeccion.LuzPorSeccionId = datos.LuzPorSeccionId;
    luzSeccion.Luz = datos.Luz;
    luzSeccion.AltoModulo = datos.AltoModulo;
    luzSeccion.NumeroEntrepano = datos.NumeroEntrepano;
    
    seccion.SeccionModuloId = datos.SeccionModuloId;
    seccion.Nombre = datos.NombreSeccionModulo;
    
    seccionModulo.SeccionModulo = seccion;
    seccionModulo.SeccionPorModuloId = datos.SeccionPorModuloId;
    seccionModulo.ModuloId = datos.ModuloId;
    seccionModulo.NumeroPiezas = datos.NumeroPiezas;
    seccionModulo.PeinazoVertical = datos.PeinazoVertical;
    
    luzSeccion.SeccionPorModulo = seccionModulo;

    return luzSeccion;
}*/

class PartePorModulo
{
    constructor()
    {
        this.PartePorModuloId = "";
        this.ModuloId = "";
        this.Ancho = ""; 
        this.NombreTipoParte = "";
        this.TipoParteId = "";
    }
}

function GetPartePorModulo($http, $q, CONFIG, id)    // obtener los componentes del módulo
{
    var q = $q.defer();
    
    var moduloId = [];
    moduloId[0] = id;

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetPartePorModulo',
          data: moduloId

      }).success(function(data)
        {
            var partePorModulo = []; 
            
            for(var k=0; k<data.length; k++)
            {
                partePorModulo[k] = new PartePorModulo();
                partePorModulo[k] = SetPartePorModulo(data[k]);
            }
        
            q.resolve(partePorModulo);   
        }).error(function(data){
            q.resolve(data);
     }); 
    
    return q.promise;
}

function SetPartePorModulo(datos)
{
    var parteModulo = new PartePorModulo();
    
    parteModulo.PartePorModuloId = datos.PartePorModuloId;
    parteModulo.ModuloId = datos.ModuloId;
    parteModulo.Ancho = datos.Ancho;
    parteModulo.TipoParteId = datos.TipoParteId;
    parteModulo.NombreTipoParte = datos.NombreTipoParte;

    return parteModulo;
}

/*------Tipo Parte----------*/
class TipoParte
{
    constructor()
    {
        this.TipoParteId = "";
        this.Nombre = "";
    }
}

function GetTipoParte()
{
    var parte = [];
    
    parte[0] = new TipoParte();
    parte[0].TipoParteId = "1";
    parte[0].Nombre = "Costado Izquierdo";
    
    parte[1] = new TipoParte();
    parte[1].TipoParteId = "2";
    parte[1].Nombre = "Costado Derecho";
    
    parte[2] = new TipoParte();
    parte[2].TipoParteId = "3";
    parte[2].Nombre = "Peinazo Superior";
    
    parte[3] = new TipoParte();
    parte[3].TipoParteId = "4";
    parte[3].Nombre = "Peinazo Medio";
    
    parte[4] = new TipoParte();
    parte[4].TipoParteId = "5";
    parte[4].Nombre = "Peinazo Inferior";
    
    return parte;
}


