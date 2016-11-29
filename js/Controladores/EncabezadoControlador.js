app.controller("EncabezadoControlador", function($scope, $rootScope, $http, CONFIG, $q, $window, datosUsuario, datosPerfil)
{   
    $rootScope.barraNavegacionOpciones = "";      //opciones de la barra de navegación
    $scope.usuario = datosUsuario.getUsuario();
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuario =  datosUsuario.getUsuario();

        if(!($rootScope.Perfiles === null || $rootScope.Perfiles === undefined))
        {
            SetPerfilNombre($rootScope, $scope.usuario); 
        }
    });
    
    /*------------------Indentifica cuando los perfiles se hayan cargado-------------------*/
    $scope.$on('cambioPerfil',function()
    {
        if($scope.usuario !== null)
        {
            if($scope.usuario.SesionIniciada)
            {
                SetPerfilNombre($rootScope, $scope.usuario); 
            }
        }
    });
        
    /*----------------------Control de vista de clases de la barra de navegación----------------------------*/ 
    $scope.MouseClickElemento = function(index)
    {
        $('#'+$scope.barraNavegacionOpciones[index].Opcion.id ).removeClass('open');
    };
    
    //despliega las secciones del módulo donde esta el mouse
    $scope.MouseEnterarElemento = function(index)
    {

        $('.header-horizontal-menu .navbar-nav > li.dropdown').removeClass('open');
        $('#'+$scope.barraNavegacionOpciones[index].Opcion.id).addClass('open');
    };

    //oculta las secciones
    $scope.MouseSalirElemento = function(index)
    {
        $('#'+$scope.barraNavegacionOpciones[index].Opcion.id).removeClass('open');   
    };
    
    //Cierra la barra de navegacion en el tamaño xs 
    $scope.CerrarBarraNavegacion = function()
    {
        $('#navbarCollapse').removeClass('in');
    };
    
    /*-------------------------Cerrar Sesión-----------------------------------------*/    
    $rootScope.CerrarSesion = function()
    {
        $('#navbarCollapse').removeClass('in');
        
        CerrarSesion($http, $rootScope, $q, CONFIG).then(function(data)
        {
            if(data)
            {
                $window.sessionStorage.removeItem('KeyUser'); 
                $rootScope.clasePrincipal = "login"; 
                $scope.usuario = new Usuario("","","");
                $scope.usuario.Perfil = [];
                $rootScope.PerfilSeleccinado = "";
                $rootScope.barraNavegacionOpciones = "";
                $window.location = "#Login";
                datosUsuario.enviarUsuario($scope.usuario);
            }
            else
            {
                alert("Error. Intentelo más tarde");
            }
             
        }).catch(function(error){
            alert("Error. Intentelo más tarde, " + error );
        }); 
    };
    
    /*-------------------------------Opciones para cada perfil-------------------------------------*/
    $rootScope.Perfiles = 
    [
        {nombre: "Administrador", paginaPrincipal: "#Modulo", visible: false, barraNavegacion: OpcionAdministrador}, 
        {nombre: "Ejecutivo",  paginaPrincipal: "#Ejecutivo", visible: false, barraNavegacion: OpcionEjecutivo}, 
        {nombre: "Operativo",  paginaPrincipal: "#Operativo", visible: false, barraNavegacion: OpcionOperativo} 
    ];
    
    //Abre la página de perfiles
    $scope.IrPerfil = function()
    {
        $window.location = "#Pefil";
    };
    
    datosPerfil.enviarPerfil( $rootScope.Perfiles);
});

 /*Obtiene el perfil con el que estaba trabajando el usuario antes de actualizar*/
function SetPerfilNombre($rootScope, usuario)               
{
    for(var k=0; k<$rootScope.Perfiles.length; k++)
    {
        if(usuario.PerfilSeleccionado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
        {
            $rootScope.barraNavegacionOpciones = $rootScope.Perfiles[k].barraNavegacion;
            $rootScope.PerfilSeleccinado = $rootScope.Perfiles[k].nombre;
            break;
        }
    }
    
    for(var k=0; k<usuario.Permiso.length; k++)
    {
        if(usuario.PerfilSeleccionado == "Administrador")
        {
            if(usuario.Permiso[k] == "AdmColConsultar")
            {
                $rootScope.barraNavegacionOpciones[0].elemento[0].show = true;
            }
            else if(usuario.Permiso[k] == "AdmUNeConsultar")
            {
                $rootScope.barraNavegacionOpciones[0].elemento[1].show = true;
            }
            else if(usuario.Permiso[k] == "AdmPlaConsultar")
            {
                $rootScope.barraNavegacionOpciones[0].elemento[2].show = true;
            }
            else if(usuario.Permiso[k] == "AdmTerConsultar")
            {
                $rootScope.barraNavegacionOpciones[0].elemento[3].show= true;
            }
            
            else if(usuario.Permiso[k] == "CatModConsultar")
            {
                $rootScope.barraNavegacionOpciones[1].elemento[0].show = true;
            }
            else if(usuario.Permiso[k] == "AdmComConsultar")
            {
                $rootScope.barraNavegacionOpciones[1].elemento[1].show = true;
            }
            
            
            else if(usuario.Permiso[k] == "ConModConfigurar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[0].show = true;
            }
            else if(usuario.Permiso[k] == "ConEmpConsultar" || usuario.Permiso[k] == "ConTUNConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[1].show = true;
            }
            else if(usuario.Permiso[k] == "ConMatConfigurar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[2].show = true;
            }
        }
    }
}

/*---------------------------------Opciones del menú principal dependiendo del perfil------------------------------------------*/
var OpcionAdministrador =
[
    { 
        Opcion: {texto:"Cocinas K", id:"cocinasK"},
        elemento: [ 
                        { referencia: "#Colaborador", texto:"Colaboradores", nuevaPagina:true, show:false},
                        { referencia: "#UnidadNegocio", texto:"Unidades de Negocio", nuevaPagina:true, show:false},
                        { referencia: "#Plaza", texto:"Plazas", nuevaPagina:true, show:false },
                        { referencia: "#Territorio", texto:"Territorios", nuevaPagina:true, show:false}
                  ]                      
    },
    { 
        Opcion: {texto:"Catálogos", id:"catalogos"},
        elemento: [     
                        { referencia: "#Modulo", texto:"Módulos", nuevaPagina:true, show:false},
                        { referencia: "#Combinacion", texto:"Combinación de Materiales", nuevaPagina:true, show:false} 
                  ]                      
    },
    { 
        Opcion: {texto:"Configuración", id:"configuracion"},
        elemento: [ 
                        { referencia: "#ConfigurarModulo", texto:"Módulos", nuevaPagina:true, show:false},
                        { referencia: "#ConfigurarUnidadNegocio", texto:"Unidades de Negocio", nuevaPagina:true, show:false},
                        { referencia: "#ConfigurarMaterial", texto:"Material", nuevaPagina:true, show:false}
                  ]                      
    },
    { 
        Opcion: {texto:"Usuario", id:"usuario"},
        elemento: [ 
                        { texto:"Cerrar Sesión", funcion:"CerrarSesion()", nuevaPagina:false, show:true},
                        { referencia: "#UsuarioPreferencia", texto:"Cambiar datos", nuevaPagina:true, show:true}
                  ]                      
    }
];

var OpcionOperativo =
[
   { 
        Opcion: {texto:"Usuario", id:"usuario"},
        elemento: [ 
                        { texto:"Cerrar Sesión", funcion:"CerrarSesion()", nuevaPagina:false, show:true},
                        { referencia: "#UsuarioPreferencia", texto:"Cambiar datos", nuevaPagina:true, show:true},
                  ]                      
    }
];

var OpcionEjecutivo =
[
   { 
        Opcion: {texto:"Usuario", id:"usuario"},
        elemento: [ 
                        { texto:"Cerrar Sesión", funcion:"CerrarSesion()", nuevaPagina:false, show:true},
                        { referencia: "#UsuarioPreferencia", texto:"Cambiar datos", nuevaPagina:true, show:true},
                  ]                      
    } 
];