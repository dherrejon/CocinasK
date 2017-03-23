app.controller("EncabezadoControlador", function($scope, $rootScope, $http, CONFIG, $q, $window, datosUsuario, datosPerfil, md5, CITA)
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
        $('#'+$scope.barraNavegacionOpciones[index].Opcion.id ).addClass('open');
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
    
    $scope.LlamarFuncion = function(funcion, opcion)
    {
        $('#'+ opcion.Opcion.id).removeClass('open');
        $scope.CerrarBarraNavegacion();
        
        if(funcion == "CerrarSesion")
        {
            $scope.CerrarSesion();
        }
        else if(funcion == "CambiarContraseña")
        {
            $scope.CambiarPassword();
        }
        else if(funcion == "AgregarCita")
        {
            CITA.AgregarCitaCero(); 
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
    
    HabilitarOpcionesMenu(usuario, $rootScope);
    
    //$rootScope.Altura = $('#barraNavegacion').offset().top;
}
function HabilitarOpcionesMenu(usuario, $rootScope)
{
    for(var k=0; k<usuario.Permiso.length; k++)
    {
        for(var i=0; i<$rootScope.barraNavegacionOpciones.length ;i++)
        {
            for(var j=0; j<$rootScope.barraNavegacionOpciones[i].elemento.length; j++)
            {
                if($rootScope.barraNavegacionOpciones[i].elemento[j].tipo == "enlace")
                {
                    for(var m=0; m<$rootScope.barraNavegacionOpciones[i].elemento[j].permiso.length; m++)
                    {
                        if(usuario.Permiso[k] == ($rootScope.barraNavegacionOpciones[i].elemento[j].permiso[m].clave))
                        {
                            $rootScope.barraNavegacionOpciones[i].elemento[j].show = true;
                            break;
                        }
                    }
                }
                else if($rootScope.barraNavegacionOpciones[i].elemento[j].tipo == "dropdownlist")
                {
                    var permiso = false;
                    for(var m=0; m<$rootScope.barraNavegacionOpciones[i].elemento[j].opcion.length; m++)
                    {
                        for(var n=0; n<$rootScope.barraNavegacionOpciones[i].elemento[j].opcion[m].permiso.length; n++)
                        {
                            if(usuario.Permiso[k] == $rootScope.barraNavegacionOpciones[i].elemento[j].opcion[m].permiso[n].clave)
                            {
                                $rootScope.barraNavegacionOpciones[i].elemento[j].opcion[m].show = true; 
                                permiso = true;
                                break;
                            }
                        }
                    }
                    if(permiso)
                    {
                        $rootScope.barraNavegacionOpciones[i].elemento[j].show = true;
                    }
                }
                else if($rootScope.barraNavegacionOpciones[i].elemento[j].tipo == "funcion")
                {
                    $rootScope.barraNavegacionOpciones[i].elemento[j].show = true;
                }
            }
        }
    }
}

var OpcionAdministrador =
[
    { 
        Opcion: {texto:"Cocinas K", id:"cocinasK"},
        elemento: [ 
                    { menu: 1, referencia: "#Colaborador", texto:"Colaboradores", show:false, tipo:"enlace", permiso:[{clave:"AdmColConsultar"}]},
                    { menu: 1, texto:"Unidades de Negocio",  show:false, tipo:"dropdownlist", id:"UnidadNegocio", clase:"dropdown-submenu",
                        opcion:[
                                    {referencia: "#UnidadNegocio", texto:"Registro",  show:false, permiso:[{clave:"AdmUNeConsultar"}]},
                                    {referencia: "#ConfigurarUnidadNegocio", texto:"Configuración", show:false, permiso:[
                                                                                                                {clave:"AdmEmpConsultar"},
                                                                                                                {clave:"AdmTUNConsultar"}
                                                                                                                        ]}
                                    
                               ]
                    },
                    { menu: 1, referencia: "#Plaza", texto:"Plazas", show:false, tipo:"enlace", permiso:[{clave:"AdmPlaConsultar"}]},
                    { menu: 1, referencia: "#Territorio", texto:"Territorios",  show:false, tipo:"enlace", permiso:[{clave:"AdmTerConsultar"}]},
                    { menu: 1, referencia: "#Promocion", texto:"Promociones", show:false, tipo:"enlace", permiso:[{clave:"AdmProConsultar"}]},
                    { menu: 1, referencia: "#PlanPago", texto:"Plan de pagos", show:false, tipo:"enlace", permiso:[{clave:"AdmPlNConsultar"}]}
                  ]                      
    },
    
    { 
        Opcion: {texto:"Catálogos", id:"catalogos"},
        elemento: [ 
                        { menu: 1, texto:"Módulos", show:false, tipo:"dropdownlist", id:"ConfigurarModulo", clase:"dropdown-submenu",
                            opcion:[
                                        {referencia: "#Modulo", texto:"Registro",  show:false, permiso:[{clave:"CatModConsultar"}]},
                                        {referencia: "#ConfigurarModulo", texto:"Configuración", show:false, permiso:[
                                                                                                                {clave:"ConCmpConsultar"}, {clave:"ConPieConsultar"},
                                                                                                                {clave:"ConCnsConsultar"}, {clave:"ConTMdConsultar"}
                                                                                                                    ]},

                                        {divider:true, referencia: "#ConfigurarPuerta", texto:"Puertas", show:false, permiso:[
                                                                                                                {clave:"ConPueConsultar"},
                                                                                                                {clave:"ConMpuConsultar"}
                                                                                                                        ]}
                                   ]
                        },
            
                        

                        { menu: 1, referencia: "", texto:"Combinación de Materiales", show:false, tipo:"dropdownlist", id:"ConfigurarCombinacionMaterial", clase:"dropdown-submenu",
                            opcion:[
                                
                                        {referencia: "#Combinacion", texto:"Registro",  show:false, permiso:[{clave:"CatComConsultar"}]},
                                        {referencia: "#ConfigurarCombinacionMaterial", texto:"Configuración", show:false, permiso:[{clave:"ConCMaConsultar"}]}

                                   ]
                        },
            
                        { menu: 1, referencia: "", texto:"Accesorios", show:false, tipo:"dropdownlist", id:"Accesorios", clase:"dropdown-submenu",
                            opcion:[
                                
                                        {referencia: "#Accesorio", texto:"Registro",  show:false, permiso:[{clave:"CatAccConsultar"}]},
                                        {referencia: "#ConfigurarAccesorio", texto:"Configuración", show:false, permiso:[
                                                                                                                {clave:"ConTAcConsultar"},
                                                                                                                {clave:"ConMAcConsultar"}
                                                                                                                        ]},
                                        
                                        {divider:true, referencia: "#Maqueo", texto:"Maqueo", show:false, permiso:[
                                                                                                        {clave:"ConMaqConsultar"},
                                                                                                        {clave:"ConMCMConsultar"}
                                                                                                                ]},
                                        {referencia: "#Servicio", texto:"Servicios", show:false, permiso:[{clave:"ConSerConsultar"}]},
                                        
                                   ]
                        },
            
                        { menu: 1, referencia: "", texto:"Cubiertas", show:false, tipo:"dropdownlist", id:"Accesorios", clase:"dropdown-submenu",
                            opcion:[
                                
                                        {referencia: "#Cubierta", texto:"Registro",  show:false, permiso:[{clave:"ConCubConsultar"}]},
                                        {referencia: "#ConfigurarCubierta", texto:"Configuración", show:false, permiso:[
                                                                                                            {clave:"ConMCCConsultar"}, {clave:"ConFCuConsultar"},
                                                                                                            {clave:"ConUCuConsultar"}
                                                                                                                    ]}

                                   ]
                        },
            
                        { menu: 1, referencia: "#ConfigurarMaterial", texto:"Materiales", show:false, tipo:"enlace", permiso:[
                                                                                                                            {clave:"AdmMatConsultar"}, {clave:"AdmTMaConsultar"}
                                                                                                                              ]},
            
                        { menu: 1, referencia: "#ConfigurarColor", texto:"Colores", show:false, tipo:"enlace", permiso:[{clave:"ConCloConsultar"}]},
            
                        { menu: 2, referencia: "", texto:"Clientes", show:false, tipo:"dropdownlist", id:"ConfigurarModulo", clase:"dropdown-submenu", divider:true,
                                opcion:[
                                            { referencia: "#ConfigurarCliente", texto:"Configuración", show:false, permiso:[{clave:"ConMCaConsultar"}]}
                                       ]
                        }, 
            
                        { menu: 2, referencia: "#ConfigurarMedioContacto", texto:"Medios de Contacto", show:false, tipo:"enlace", permiso:[{clave:"ConTMCConsultar"}]}
                  ]                      
    },
    
    { 
        Opcion: {texto:"Usuario", id:"usuario"},
        elemento: [ 
                        { menu: 1, texto:"Cambiar Contraseña", funcion:"CambiarContraseña", show:true, tipo:"funcion"},
                        { menu: 1, texto:"Cerrar Sesión", funcion:"CerrarSesion", show:true, tipo:"funcion"}
                  ]                      
    }
];

var OpcionOperativo =
[
    { 
        Opcion: {texto:"Clientes", id:"clientes"},
        elemento: [ 
                    { menu: 1, referencia: "#Cliente", texto:"Perfil Clientes",  show:false, tipo:"enlace", permiso:[{clave:"AdmTerConsultar"}]},
                    { divider: true, menu: 2, texto:"Agregar Cita", funcion:"AgregarCita", show:true, tipo:"funcion"},
                    { menu: 2, referencia: "#PlanPago", texto:"Agregar Presupuesto", show:false, tipo:"enlace", permiso:[{clave:"AdmPlNConsultar"}]}
                  ]                      
    },
    
    { 
        Opcion: {texto:"Usuario", id:"usuario"},
        elemento: [ 
                        { menu: 1, referencia: "#Plaza", texto:"Agenda", show:false, tipo:"enlace", permiso:[{clave:"AdmPlaConsultar"}]},
                        { menu: 2, texto:"Cambiar Contraseña", funcion:"CambiarContraseña", show:true, tipo:"funcion", divider:true},
                        { menu: 2, texto:"Cerrar Sesión", funcion:"CerrarSesion", show:true, tipo:"funcion"}
                  ]                      
    }
];

var OpcionEjecutivo =
[
   { 
        Opcion: {texto:"Usuario", id:"usuario"},
        elemento: [ 
                        { texto:"Cambiar Contraseña", funcion:"CambiarContraseña", show:true, tipo:"funcion"},
                        { texto:"Cerrar Sesión", funcion:"CerrarSesion", show:true, tipo:"funcion"}
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


