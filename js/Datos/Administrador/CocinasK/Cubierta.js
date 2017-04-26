class Cubierta
{
    constructor()           //inicializar datos
    {
        this.DatosCubiertaId = "";
        this.Material = new Material();
        this.TipoCubierta = new TipoCubierta();
        this.Margen = 0;
        this.Desperdicio = 0;
    }
}

//Obtien las Cubierta
function GetCubierta($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetCubierta',

      }).success(function(data)
        {
            var cubierta = []; 

            for(var k=0; k<data.length; k++)
            {
                cubierta[k] = new Cubierta();
                cubierta[k] = SetCubierta(data[k]);
            }
            q.resolve(cubierta);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetCubierta(data)
{
    var cubierta = new Cubierta();
    
    cubierta.DatosCubiertaId = data.DatosCubiertaId;
    cubierta.Margen = parseFloat(data.Margen);
    cubierta.Desperdicio = parseFloat(data.Desperdicio);
    
    cubierta.Material.TipoMaterial.TipoMaterialId = data.TipoMaterialId;
    cubierta.Material.TipoMaterial.Nombre = data.NombreTipoMaterial;
    cubierta.Material.MaterialId = data.MaterialId;
    cubierta.Material.Nombre = data.Nombre;
    
    cubierta.TipoCubierta.TipoCubiertaId = data.TipoCubiertaId;
    cubierta.TipoCubierta.Nombre = data.NombreTipoCubierta;
    
    if(data.Activo == "1")
    {
        cubierta.Material.Activo  = true;
    }
    else
    {
        cubierta.Material.Activo  = false;  
    }
    
    return cubierta;
}

function AgregarCubierta($http, CONFIG, $q, cubierta)
{
    var q = $q.defer();
    
    for(var k=0; k<cubierta.Color.length; k++)
    {
        if(cubierta.Color[k].PorDefecto)
        {
            cubierta.Color[k].PorDefecto = "1";
        }
        else
        {
            cubierta.Color[k].PorDefecto = "0";
        }
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarCubierta',
          data: cubierta

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

//edita un material
function EditarCubierta($http, CONFIG, $q, cubierta)
{
    var q = $q.defer();
    
    for(var k=0; k<cubierta.Color.length; k++)
    {
        if(cubierta.Color[k].PorDefecto)
        {
            cubierta.Color[k].PorDefecto = "1";
        }
        else
        {
            cubierta.Color[k].PorDefecto = "0";
        }
    }
    
    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarCubierta',
          data: cubierta

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



/*---------------- Tipo Cubierta ------------*/
class TipoCubierta
{
    constructor()           //inicializar datos
    {
        this.TipoCubiertaId = "";
        this.Nombre = "";
    }
}

//Obtien los Tipo Cubierta
function GetTipoCubierta()     
{
    var tipoCubierta = [];
    tipoCubierta[0] = new TipoCubierta();
    tipoCubierta[1] = new TipoCubierta();
    
    tipoCubierta[0].TipoCubiertaId = "1";
    tipoCubierta[0].Nombre = "Formaica";
    tipoCubierta[0].PorDefecto = true;
    
    tipoCubierta[1].TipoCubiertaId = "2";
    tipoCubierta[1].Nombre = "Granito";
    tipoCubierta[1].PorDefecto = false;
    
    return tipoCubierta;
}

function SetTipoCubierta(tipo)
{
    var tipoCubierta = new TipoCubierta();
    
    tipoCubierta.TipoCubiertaId = tipo.TipoCubiertaId;
    tipoCubierta.Nombre = tipo.Nombre;
    
    return tipoCubierta;
}

/*------------------------------- Datos cubierta ---------------------------------*/
function GetCubiertaUbicacion($http, $q, CONFIG, id)     
{
    var q = $q.defer();

    var datos = [];
    datos[0] = id;
        
    var servicio = "";
    if(id == "-1")
    {
        servicio = "/GetCubiertaUbicacionTodo";
    }
    else
    {
        servicio = "/GetCubiertaUbicacion";
    }
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + servicio,
          data: datos
      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

class ColorPorMaterialCubierta
{
    constructor()           //inicializar datos
    {
        this.ColorPorMaterialCubiertaId = "";
        this.Material = new Material();
        this.Grupo = new Grupo();
        this.CostoUnidad = "";
        this.PorDefecto = true;
    }
}

function GetGrupoColorCubierta($http, $q, CONFIG, id)     
{
    var q = $q.defer();

    var datos = [];
    datos[0] = id;
    
    var servicio = "";
    if(id == "-1")
    {
        servicio = '/GetGrupoColorCubiertaTodo';
    }
    else
    {
        servicio = '/GetGrupoColorCubierta';
    }
        
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + servicio,
          data: datos
      }).success(function(data)
        {
            if(id == "-1")
            {
                q.resolve(data); 
            }
            else
            {
                var colorPorMaterial = []; 
                for(var k=0; k<data.length; k++)
                {
                    colorPorMaterial[k] = new ColorPorMaterialCubierta();
                    colorPorMaterial[k] = SetColorPorMaterialCubierta(data[k]);
                }
                q.resolve(colorPorMaterial); 
            }
    
             
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

function SetColorPorMaterialCubierta(data)
{
    var material = new ColorPorMaterialCubierta();
    
    material.ColorPorMaterialCubiertaId = data.ColorPorMaterialCubiertaId;
    material.CostoUnidad = parseFloat(data.CostoUnidad);
    
    material.Grupo.GrupoId = data.GrupoId;
    material.Grupo.Nombre = data.NombreGrupo;
    
    material.Material.MaterialId = data.MaterialId;
    material.Material.Nombre = data.NombreMaterial;
    
    if(data.PorDefecto == "1")
    {
        material.PorDefecto = true; 
    }
    else
    {
        material.PorDefecto = false; 
    }
    
    if(data.Activo == "1")
    {
        material.Grupo.Activo = true; 
    }
    else
    {
        material.Grupo.Activo = false; 
    }
    
    return material;
}
