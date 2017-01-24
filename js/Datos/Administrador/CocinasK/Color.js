/*------Medio Contacto---------*/

class Color
{
    constructor()
    {
        this.ColorId = "";
        this.Imagen = "";
        this.Activo = true; 
    }
}

//obtiene los tipos de módulos
function GetColor($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetColor',

      }).success(function(data)
        {
            var color = []; 
            for(var k=0; k<data.length; k++)
            {
                color[k] = new Color();
                color[k] = SetColor(data[k]);
            }
    
            q.resolve(color);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//copia los datos de un material
function SetColor(data)
{
    var color = new Color();
    
    color.ColorId = data.ColorId;
    color.Nombre = data.Nombre;
    color.Imagen = data.Imagen;
    
    if(data.Activo == "1")
    {
        color.Activo = true;
    }
    else
    {
        color.Activo = false;
    }
    
    
    return color;
}

//agregaga un consumible
function AgregarColor($http, CONFIG, $q, grupo)
{
    var q = $q.defer();
    
    if(grupo.Activo)
    {
        grupo.Activo = 1;
    }
    else
    {
        grupo.Activo = 0;
    }

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarColor',
          data: grupo

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

//edita un consumible
function EditarColor($http, CONFIG, $q, grupo)
{
    var q = $q.defer();
    
    if(grupo.Activo)
    {
        grupo.Activo = 1;
    }
    else
    {
        grupo.Activo = 0;
    }

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/EditarColor',
          data: grupo

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

function ActivarDesactivarColor($http, $q, CONFIG, color) 
{
    var q = $q.defer();

    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/ActivarDesactivarColor',
          data: color

      }).success(function(data)
        {
            q.resolve(data); 
        }).error(function(data, Estatus){
            q.resolve(Estatus);

     }); 
    
    return q.promise;
}

//Guardar una imagen del color en la base de datos
function GuardarImagenColor($http, $q, CONFIG, imagen, colorId) 
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
      url:   CONFIG.APIURL  + '/GuardarImagenColor/'+colorId,
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


/*--------------- Grupo Por Color ---------------------*/
function GetGrupoPorColor($http, $q, CONFIG, id)     
{
    var q = $q.defer();

    var datos = [];
    datos[0] = id;
        
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/GetGrupoPorColor',
          data: datos
      }).success(function(data)
        {
            var color = []; 
            for(var k=0; k<data.length; k++)
            {
                color[k] = new Color();
                color[k] = SetColor(data[k]);
            }
    
            q.resolve(color);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}



  