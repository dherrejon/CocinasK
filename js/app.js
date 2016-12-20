var app = angular.module('CocinasK',['ngRoute', 'angular.filter','angular-md5']);

 //Configuracion del jason token, APIURL: indica la direccion del directorio de index.php
app.constant('CONFIG',
{        
        APIURL: "php/API/index.php",
        APIKEY: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoid2ViLmFwcCIsImlhdCI6MTQ3MzcwMjIxN30.IpBDTlZBLcTiAV1bg55cpXFhywFXCd5fFSsN5syqwUI",
});


app.factory('mhttpInterceptor', function($q,CONFIG,$rootScope,$window,$location) 
{
    
    return{
        
        'request': function(config)
        {
            if(config.url.indexOf( CONFIG.APIURL) !== -1)
            {

                if($rootScope.status)
                {
                    if($window.sessionStorage.getItem('cocinasK_Token') !== null)
                    {
                        config.headers['X-Api-Key'] = $window.sessionStorage.getItem('cocinasK_Token');    
                    }
                    else
                    {
                        config.headers['X-Api-Key'] = CONFIG.APIKEY;       
                    }
                }
                else
                {
                    config.headers['X-Api-Key'] = CONFIG.APIKEY;
                }
            }

            return config;

        },

        'response': function(response){

            if(response.headers('X-Api-Key') !== null)
            {
                if(response.headers('X-Origin-Response') === $location.host())
                {
                   $window.sessionStorage.setItem('cocinasK_Token', response.headers('X-Api-Key')); 
                   $rootScope.ChecarSesion( response.headers('X-Api-Key') );
                }

            }

            return response;
        },

        responseError: function(response)
        {
            if(response.status === 401)
            {
                $location.path('/Login');
            }

            return $q.reject(response);
        }
    };
});


//indica las rutas de la aplicacion web
app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) 
{   
    $httpProvider.interceptors.push('mhttpInterceptor');
    
    $routeProvider.
    when('/Login',{
        templateUrl: 'html/Login.html'
    }).
    when('/Perfil',{
        templateUrl: 'html/Perfil.html'
    }).
    when('/UnidadNegocio',{
        templateUrl: 'html/Administrador/CocinasK/UnidadNegocio.html'
    }).
     when('/Plaza',{
        templateUrl: 'html/Administrador/CocinasK/Plaza.html'
    }).
    when('/Territorio',{
        templateUrl: 'html/Administrador/CocinasK/Territorio.html'
    }).
    when('/Colaborador',{
        templateUrl: 'html/Administrador/CocinasK/Colaborador.html'
    }).
    when('/UsuarioPerfil',{
        templateUrl: 'html/Administrador/CocinasK/UsuarioPerfil.html'
    }).
    
    when('/ConfigurarUnidadNegocio',{
        templateUrl: 'html/Administrador/Configuracion/ConfiguracionUnidadNegocio.html'
    }).
    when('/ConfigurarModulo',{
        templateUrl: 'html/Administrador/Configuracion/Modulo/ConfiguracionModulo.html'
    }).
    when('/ConfigurarMaterial',{
        templateUrl: 'html/Administrador/Configuracion/ConfiguracionMaterial.html'
    }).
    when('/ConfigurarPuerta',{
        templateUrl: 'html/Administrador/Configuracion/ConfiguracionPuerta.html'
    }).
    
    when('/Combinacion',{
        templateUrl: 'html/Administrador/Catalogo/Combinacion.html'
    }).
    when('/Modulo',{
        templateUrl: 'html/Administrador/Catalogo/Modulo.html'
    }).
    
    when('/Ejecutivo',{
        templateUrl: 'html/Ejecutivo/Ejecutivo.html'
    }).
    when('/Operativo',{
        templateUrl: 'html/Operativo/Operativo.html'
    }).
    otherwise({
        templateUrl: 'html/Login.html'
    });
}]);


app.run(function($rootScope, $location, $window, $http, CONFIG, $q, datosUsuario)
{   
    if($location.path() == "/Login" || $location.path() == "/Perfil" || $location.path() === "")   /*Modifica que el fondo de la paina sea la imagen de la cociana o no*/
    {
        $rootScope.clasePrincipal = "login";  
    }
    else
    {
        $rootScope.clasePrincipal = "";  
    }
           
    var usuario = new Usuario("","","");         //guarda los datos del usuario que ha iniciado sesión
    $rootScope.PerfilSeleccinado = "";           //Muestra el perfil con el cual esta trabando el usurio
    
    $rootScope.ChecarSesion = function(token)           //verifica el esatdo de la sesión
    {  
        var payload = token.split(".");
        var decode_payload = $.parseJSON( atob( payload[1] ) );
        
        if( decode_payload.state !== true )
        {
            if($window.sessionStorage.getItem('cocinasK_Token') !== null)
            {
                $window.sessionStorage.removeItem('cocinasK_Token'); 
            }
        
            if(decode_payload.state === 'expired')
            {
                 $rootScope.CerrarSesion();
                 $rootScope.clasePrincipal = "login";
                 if($location.path() !== "/Login")
                 {
                    $window.location = "#Login";
                 }
            }
        }  
    }; 
    
    $rootScope.GetEstadoSesion = function()            //Si el usuario ha iniciado sesion obtine los datos de este si se ha actualizado la aplicación web
    {
       SesionIniciada($http, $q, CONFIG).then(function(data)
       {
            if(data.SesionIniciada)
            {
                usuario = data;
                $rootScope.PerfilSeleccinado = data.PerfilSeleccionado;
                datosUsuario.enviarUsuario(usuario);
            }
            else
            {
                datosUsuario.enviarUsuario(data);  
            }
        }).catch(function(error){
            alert(error);
        });
    };

    $rootScope.GetEstadoSesion();                     //Cada ves que se inicializa la aplicación verifica los datos del ususario
    
    /*-----------------Expresiones Regulares--------------------------*/
    $rootScope.erNombreGeneral = /^(([a-z ñáéíóú]|[A-Z ÑÁÉÍÓÚ]|[0-9]|\.|\+|\-|\#) ?)+$/;   //expresión regular para nombres
    $rootScope.erTelefono = /^(\d){10}$/;                                          //expresión regular para el teléfono   // \((\d){3}\) \d{3}-\d{4}
    $rootScope.erCP = /^(\d){5}$/;                                          //expresión regular para el código postal 
    $rootScope.erEmail = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;   //expresion regular para correo electronico                                       
    $rootScope.erRFC = /^(([A-Z,Ñ,&]|[a-z,ñ]){3,4}\-([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\-([A-Z]|\d|[a-z]){3})$/;   //expresion regular para RFC de una empresa
    $rootScope.erDecimal = /^[0-9]+(\.[0-9][0-9]?)?$/;   //expresion regular para RFC de una empresa
    $rootScope.erNombrePersonal = /^(([A-Z]|Ñ|[a-z]|[ñáéíóú]|[ÁÉÍÓÚ]){2,120}\s?)+$/;   //expresion regular para los apellido y el nombre de una persona
    $rootScope.erNombreUsuario = /^(\w|ñ){4}(\w|ñ)*$/;   //expresion regular para el nombre de usurio
    $rootScope.erNumeroDecimal = /^[0-9]+(\.[0-9][0-9]?)?$/;   //expresion regular para un número decimal
    $rootScope.erNumeroFraccion = /^((([0-9]\s)*([1-9]\/[1-9]{1,2}))|([0-9]))+$/;   //expresion regular para un número fraccional
    $rootScope.erNumeroEntero = /^[0-9]+$/;   //expresion regular para un número entero
    
    /*---------------------------------- Mantener la barra de navegacion visible-----------------------*/
    /*$window.onscroll = function ()
    {
        var maxScrollY = 0;
        if($window.innerWidth < 767)
            maxScrollY = 78;
        else
            maxScrollY = 63;
        
        if ( $window.scrollY >  maxScrollY)
        {
            $rootScope.barraNavArriba = "navbar navbar-fixed-top";
            $rootScope.$apply();
        }
        else
        {
            $rootScope.barraNavArriba = "navbar";
            $rootScope.$apply();
            
        }        
    };*/
    
    /*-----tamaño de la pantalla -----------*/
    $rootScope.anchoPantalla = $( window ).width();
    $( window ).resize(function() 
    {
        $rootScope.anchoPantalla = $( window ).width();
        $rootScope.$apply();       
    });
});

//identificas cuando los datos del usuario cambian
app.factory('datosUsuario',function($rootScope)
{
  var service = {};
  service.usuario = null;
    
  service.enviarUsuario = function(usuario)
  {
      this.usuario = usuario;
      $rootScope.$broadcast('cambioUsuario');
  };
  service.getUsuario = function()
  {
      return this.usuario;
  };
  service.setPerfilSeleccionado = function(perfil)
  {
      this.usuario.PerfilSeleccionado = perfil;
  };
    
  return service;
});

//identificar cuando el usuario cambia de perfil
app.factory('datosPerfil',function($rootScope)
{
  var service = {};
  service.perfil = null;
    
  service.enviarPerfil = function(perfil)
  {
      this.perfil = perfil;
      $rootScope.$broadcast('cambioPerfil');
  };
  service.getPefil = function()
  {
    return this.perfil;
  };
    
  return service;
});

/*--------Trabajar con multiples modales---------*/
$(document).on('show.bs.modal', '.modal', function () 
{
    var zIndex = Math.max.apply(null, Array.prototype.map.call(document.querySelectorAll('*'), function(el) 
    {
        return +el.style.zIndex;
    })) + 100;
    
    $(document).on('hidden.bs.modal', '.modal', function () 
    {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    });
});