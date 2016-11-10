/*------Medio Contacto---------*/

class MedioContacto
{
    constructor()
    {
        this.MedioContactoId = "";
        this.Nombre = ""; 
    }
}

//copia los datos de un medio de contacto
function SetMedioContacto(id, medio)
{
    var medioContacto = new MedioContacto();
    medioContacto.MedioContactoId = id;
    medioContacto.Nombre = medio;
    
    return medioContacto;
}

/*------Tipo Medio Contacto---------*/
class TipoMedioContacto
{
    constructor()
    {
        this.TipoMedioContactoId = "";
        this.Nombre = ""; 
        this.MedioContactoId = "";
        this.NombreMedioContacto = "";
        this.Activo = "1";
    }
}

//obtiene los tipos de medio de contacto
function GetTipoMedioContacto($http, $q, CONFIG)     //iniciar sesion
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetTipoMedioContacto',

      }).success(function(data)
        {
            var tipoMedioContacto = []; 
            
            for(var k=0; k<data.length; k++)
            {
                tipoMedioContacto[k] = SetTipoMedioContacto(data[k]);
            }
        
            q.resolve(tipoMedioContacto);  
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

//copia un tipo de medio de contacto
function SetTipoMedioContacto(data)
{
    var tipoMedioContacto = new TipoMedioContacto();
    
    tipoMedioContacto.TipoMedioContactoId = data.TipoMedioContactoId;
    tipoMedioContacto.Nombre = data.Nombre;
    tipoMedioContacto.MedioContactoId = data.MedioContactoId;
    tipoMedioContacto.NombreMedioContacto = data.NombreMedioContacto;
    tipoMedioContacto.Activo = data.Activo;
    
    return tipoMedioContacto;
}