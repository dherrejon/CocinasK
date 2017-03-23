app.controller("PerfilClienteControlador", function($scope, $rootScope, $http, $q, CONFIG,  $routeParams)
{   
    $rootScope.personaId = $routeParams.personaId;
    $rootScope.seccion = $routeParams.seccion;
    
    $rootScope.persona = new Persona();
    
    $scope.opciones = optPerfil;
    
    //-------------------------------
    $scope.GetClaseSeccion = function(seccion)
    {
        if(seccion == $rootScope.seccion)
        {
            return "active";
        }
        else
        {
            return "";
        }
    };
    
    /*---------------- Catálogos -------------------*/
    $scope.GetDatoPersona = function(id)              
    {
        GetDatoPersona($http, $q, CONFIG, id).then(function(data)
        {
            $rootScope.persona = $scope.SetPersonaDatos(data);
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetPersonaDatos = function(data)
    {
        var persona = new Persona();
        
        persona.PersonaId = data.PersonaId;
        persona.Nombre = data.Nombre;
        persona.PrimerApellido = data.PrimerApellido;
        persona.SegundoApellido = data.SegundoApellido;
        
        persona.MedioCaptacion.MedioCaptacionId = data.MedioCaptacionId;
        
        if(data.MedioCaptacionId == "0")
        {
            persona.NombreMedioCaptacion = data.NombreMedioCaptacion;
            persona.MedioCaptacion.Nombre = "Otro";
        }
        else
        {
            persona.NombreMedioCaptacion = "";
            persona.MedioCaptacion.Nombre = data.NombreMedioCaptacion;
        }
        persona.TipoPersona.TipoPersonaId = data.TipoPersonaId;
        
        return persona;
    };
    
    //---------- Inicializar ---------------------
    $scope.GetDatoPersona($rootScope.personaId);
    
});


var optPerfil = [
                    {titulo: "Datos generales", icono:"fa fa-id-card-o", referencia:"DatosGenerales"},
                    {titulo: "Proyectos", icono:"fa fa-archive", referencia:"Proyectos"},
                    {titulo: "Citas", icono:"fa fa-calendar-o", referencia:"Citas"},
                    {titulo: "Notas", icono:"fa fa-sticky-note-o", referencia:"Notas"}
                ];
