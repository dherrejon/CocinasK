app.controller("EncabezadoControlador", function($scope, $rootScope, $http, CONFIG, $q, $window, datosUsuario, datosPerfil, md5)
{   
    $rootScope.barraNavegacionOpciones = "";      //opciones de la barra de navegación
    $scope.usuario = datosUsuario.getUsuario();
    $scope.nuevoPassword = {nuevo:"", repetir:"", actual:""};
    $scope.clasePassword = {nuevo:"entrada", repetir:"entrada", actual:"entrada"};
    $scope.mensajeError = [];
    
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
    
    $scope.LlamarFuncion = function(funcion)
    {
        if(funcion == "CerrarSesion")
        {
            $scope.CerrarSesion();
        }
        else if(funcion == "CambiarContraseña")
        {
            $scope.CambiarPassword();
        }
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
    
    /*------------------------------Cambiar Contraseña--------------------------------------------*/
    $scope.CambiarPassword = function()
    {
        $('#CambiarPasswordModal').modal('toggle');
    };
    
    $scope.GuardarPassword = function(passwordInvalido)
    {
        if(!$scope.ValidarPassword(passwordInvalido))
        {
            return;
        }
        
        var datosUsuario = [];
        datosUsuario[0] = $scope.usuario.UsuarioId;
        datosUsuario[1] = md5.createHash( $scope.nuevoPassword.actual );
        datosUsuario[2] = md5.createHash( $scope.nuevoPassword.nuevo );
        
        CambiarPasswordPorUsuario($http, CONFIG, $q, datosUsuario).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.mensaje = "La contraseña se ha actualizado correctamente.";
                $scope.CerrarCambiarPasswordForma();
                $('#mensajeEncabezado').modal('toggle');
                $('#CambiarPasswordModal').modal('toggle');
            }
            else if(data == "ErrorPassword")
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Tu contraseña actual es incorrecta.";
            }
            else
            {
                alert("Ha ocurrido un error. Intente más tarde.");
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error. Intente más tarde." +error);
            return;
        });
    };
    
    $scope.ValidarPassword = function(passwordInvalido)
    {
        $scope.mensajeError = [];
        if(passwordInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*La contraseña solo puede tener letras y números. Mínimo debe tener 6 carácteres.";
            $scope.clasePassword.nuevo = "entradaError"; 
            return false;
        }
        else
        {
            $scope.clasePassword.nuevo = "entrada";        
        }
        if($scope.nuevoPassword.nuevo != $scope.nuevoPassword.repetir)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Las contraseñas no coinciden.";
            $scope.clasePassword.repetir = "entradaError"; 
        }
        else
        {
            $scope.clasePassword.repetir = "entrada";        
        }
        if($scope.nuevoPassword.actual === "" || $scope.nuevoPassword.actual === undefined || $scope.nuevoPassword.actual === null)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe tu contraseña actual.";
            $scope.clasePassword.actual = "entradaError"; 
        }
        else
        {
            $scope.clasePassword.actual = "entrada";        
        }
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.CerrarCambiarPasswordForma = function()
    {
        $scope.nuevoPassword = {nuevo:"", repetir:"", actual:""};
        $scope.clasePassword = {nuevo:"entrada", repetir:"entrada", actual:"entrada"};
        $scope.mensajeError = [];
    };
    
    /*-------------------------------Opciones para cada perfil-------------------------------------*/
    $rootScope.Perfiles = 
    [
        {nombre: "Administrador", paginaPrincipal: "#Home", visible: false, barraNavegacion: OpcionAdministrador}, 
        {nombre: "Ejecutivo",  paginaPrincipal: "#Ejecutivo", visible: false, barraNavegacion: OpcionEjecutivo}, 
        {nombre: "Operativo",  paginaPrincipal: "#Operativo", visible: false, barraNavegacion: OpcionOperativo} 
    ];
    
    //Abre la página de perfiles
    $scope.IrPerfil = function()
    {
        $window.location = "#Pefil";
    };
    
    datosPerfil.enviarPerfil( $rootScope.Perfiles);
    
    $rootScope.VolverAHome = function(perfil)
    {
        for(var k=0; k<$rootScope.Perfiles.length; k++)
        {
            if(perfil == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
            {
                $window.location = $rootScope.Perfiles[k].paginaPrincipal;
            }
        } 
    };
    
    /*-----------Reporte de errores----------------------------*/
    $scope.modulos = bug;
    $scope.moduloSeleccionado = "";
    $scope.bug = {Seccion:"", Modulo:"", Operacion:"", Descripcion:"", UsuarioId:""};
    
    $scope.CambiarModulo = function(modulo)
    {
        if(modulo != $scope.moduloSeleccionado)
        {
            $scope.bug.Modulo = modulo.titulo;
            $scope.moduloSeleccionado = modulo;
            $scope.bug.Seccion = "";
        }
    };
    
    $scope.CambiarSeccion = function(seccion)
    {
        $scope.bug.Seccion = seccion;
    };
    
    $scope.TerminarReportarBug = function(operacionInvalida, descripcionInvalida)
    {
        if(!$scope.ValidarBug(operacionInvalida, descripcionInvalida))
        {
            return;
        }
        
        $scope.bug.UsuarioId = $scope.usuario.UsuarioId;
        
        AgregarBug($http, CONFIG, $q, $scope.bug).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#reportarBug').modal('toggle');
                $scope.mensaje = "El error ha sido notificado.";
                $scope.CerrarReportarError();
                $('#mensajeEncabezado').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeEncabezado').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeEncabezado').modal('toggle');
        });
    };
    
    $scope.ValidarBug = function(operacionInvalida, descripcionInvalida)
    {
        $scope.mensajeError = [];
        if($scope.bug.Modulo === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un módulo.";
        }
        if($scope.bug.Seccion === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una sección.";
        }
        if(operacionInvalida)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Operación invalida.";
        }
        if(descripcionInvalida)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Descripción invalida.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;        
        }
    };
    
    $scope.CerrarReportarError = function()
    {
        $scope.mensajeError = [];
        $scope.moduloSeleccionado = "";
        $scope.bug = {Seccion:"", Modulo:"", Operacion:"", Descripcion:"", UsuarioId:""};
    };
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
            /*Cocinas k*/
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
            /*Catálogos*/
            else if(usuario.Permiso[k] == "CatModConsultar")
            {
                $rootScope.barraNavegacionOpciones[1].elemento[0].show = true;
            }
            else if(usuario.Permiso[k] == "CatComConsultar")
            {
                $rootScope.barraNavegacionOpciones[1].elemento[1].show = true;
            }
            /*Configuración*/
            else if(usuario.Permiso[k] == "ConCmpConsultar" || usuario.Permiso[k] == "ConPieConsultar" || usuario.Permiso[k] == "ConCnsConsultar" || usuario.Permiso[k] == "ConTMdConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[0].show = true;
            }
            else if(usuario.Permiso[k] == "AdmEmpConsultar" || usuario.Permiso[k] == "AdmTUNConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[1].show = true;
            }
            else if(usuario.Permiso[k] == "AdmMatConsultar" || usuario.Permiso[k] == "AdmTMaConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[2].show = true;
            }
            else if(usuario.Permiso[k] == "ConPueConsultar" || usuario.Permiso[k] == "ConMpuConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[3].show = true;
            }
            else if(usuario.Permiso[k] == "ConMCCConsultar" || usuario.Permiso[k] == "ConFCuConsultar" || usuario.Permiso[k] == "ConUCuConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[4].show = true;
            }
            else if(usuario.Permiso[k] == "ConTMCConsultar" || usuario.Permiso[k] == "ConCloConsultar")
            {
                $rootScope.barraNavegacionOpciones[2].elemento[5].show = true;
            }
        }
    }
    
    //$rootScope.Altura = $('#barraNavegacion').offset().top;
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
                        { referencia: "#ConfigurarMaterial", texto:"Materiales", nuevaPagina:true, show:false},
                        { referencia: "#ConfigurarPuerta", texto:"Puertas", nuevaPagina:true, show:false},
                        { referencia: "#ConfigurarCubierta", texto:"Cubiertas", nuevaPagina:true, show:false},
                        { referencia: "#ConfigurarGeneral", texto:"General", nuevaPagina:true, show:false}
                  ]                      
    },
    { 
        Opcion: {texto:"Usuario", id:"usuario"},
        elemento: [ 
                        { texto:"Cambiar Contraseña", funcion:"CambiarContraseña", nuevaPagina:false, show:true},
                        { texto:"Cerrar Sesión", funcion:"CerrarSesion", nuevaPagina:false, show:true}
                  ]                      
    }
];

var OpcionOperativo =
[
   { 
        Opcion: {texto:"Usuario", id:"usuario"},
        elemento: [ 
                        { texto:"Cambiar Contraseña", funcion:"CambiarContraseña", nuevaPagina:false, show:true},
                        { texto:"Cerrar Sesión", funcion:"CerrarSesion", nuevaPagina:false, show:true}
                  ]                      
    }
];

var OpcionEjecutivo =
[
   { 
        Opcion: {texto:"Usuario", id:"usuario"},
        elemento: [ 
                        { texto:"Cambiar Contraseña", funcion:"CambiarContraseña", nuevaPagina:false, show:true},
                        { texto:"Cerrar Sesión", funcion:"CerrarSesion", nuevaPagina:false, show:true}
                  ]                      
    } 
];

var bug =   [
                    {modulo:{titulo:"Cocinas K", seccion:[{titulo:"Colaborador"}, {titulo:"Unidad de Negocio"}, {titulo:"Plaza"}, {titulo:"Territorio"}]}},
                    {modulo:{titulo:"Catálogos", seccion:[{titulo:"Módulo"}, {titulo:"Combinación de Materiales"}]}},
                    {modulo:{titulo:"Configuración", seccion:[{titulo:"Módulo"}, {titulo:"Unidades de Negocio"}, {titulo:"Materiales"}, {titulo:"Puerta"}]}},
                    {modulo:{titulo:"Usuario", seccion:[{titulo:"Cambiar datos"}, {titulo:"Cerrar Sesión"}]}},
                    {modulo:{titulo:"General", seccion:[{titulo:"Login"}, {titulo:"Perfil"}, {titulo:"Encabezado"}, {titulo:"Otro"}]}}
            ];