app.controller("ConfiguaracionUnidadNegocioControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter)
{   
    $rootScope.clasePrincipal = "";

    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultarEmpresa:false, editarEmpresa: false, activarEmpresa:false, agregarEmpresa:false, consultarTipoUnidad:false, editarTipoUnidad:false, activarTipoUnidad:false, agregarTipoUnidad:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConEmpConsultar")
            {
                $scope.permisoUsuario.consultarEmpresa = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConEmpAgregar")
            {
                $scope.permisoUsuario.agregarEmpresa = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConEmpEditar")
            {
                $scope.permisoUsuario.editarEmpresa = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConEmpActivar")
            {
                $scope.permisoUsuario.activarEmpresa = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTUNConsultar")
            {
                $scope.permisoUsuario.consultarTipoUnidad = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTUNAgregar")
            {
                $scope.permisoUsuario.agregarTipoUnidad = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTUNEditar")
            {
                $scope.permisoUsuario.editarTipoUnidad = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTUNActivar")
            {
                $scope.permisoUsuario.activarTipoUnidad = true;
            }
        }
    };
    
    $scope.titulo = "Empresa";
    $scope.moduloActualizar = "";               //guarda el modulo con el que se estará trabajando (actualizar, agregar, editar)
    $scope.tipoModulo = "";                     //saber si se esta trabajando con una empresa o con un tipo de unidad
    $scope.tabs = tab;                          //pestañas 
    $scope.mensajeError = [];                   //mensaje de errores en el momento de agregar o editar
    $scope.operacion = "";                      //Saber si se esta agregando o editando
    
    
    $scope.clase =                               //clase que contendra los controles de los modals de agregar y editar
    [
        {nombre:"entrada", rfc:"entrada", email:"entrada", domicilio:"entrada", cp:"entrada", Estado:"dropdownListModal",
        Municipio:"dropdownListModal", ciudad:"dropdownListModal", colonia:"dropdownListModal", otraColonia:"entrada"},
        {nombre:"entrada"}
    ];
    
    //Obtine las empresas dadas de alta
    $scope.GetEmpresa = function()              
    {
        GetEmpresa($http, $q, CONFIG).then(function(data)
        {
            $scope.empresa = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //Obtiene los tipos de unidad de negocio dados de alta 
    $scope.GetTipoUnidadNegocio = function()      
    {
        GetTipoUnidadNegocio($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoUnidad = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        
        switch (index)
        {
            case 0:  
                $('#Empresa').show();
                $('#TipoUnidadNegocio').hide();
                break;
            case 1:
                $('#TipoUnidadNegocio').show();
                $('#Empresa').hide();
                break;
            default:
                break;
        }        
    };
     
    /*--------------Activar y desactivar empresa y tipo de unidad de negocio ------------------*/
    $scope.ActivarDesactivar = function(modulo, objeto) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.moduloActualizar = objeto;
        $scope.tipoModulo = modulo;
        
        if(objeto.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + objeto.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACRIVAR - " + objeto.Nombre + "?";
        }
        $('#modalActivarDesactivarModulo').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarModulo = function()  
    {
        var datos = [];
        if($scope.moduloActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        if($scope.tipoModulo == "Empresa")
        {
            datos[1] = $scope.moduloActualizar.EmpresaId;
                
            ActivarDesactivarEmpresa($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "La empresa se ha actualizado correctamente";
                }
                else
                {
                    $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                }
                $('#mensajeConfigurarUnidad').modal('toggle');
            }).catch(function(error)
            {
                $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarUnidad').modal('toggle');
            });
        }
        
        if($scope.tipoModulo == "TipoUnidad")
        {
            datos[1] = $scope.moduloActualizar.TipoUnidadNegocioId;
            
            ActivarDesactivarTipoUnidad($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El tipo de unidad de negocio se ha actualizado correctamente";
                }
                else
                {
                    $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarUnidad').modal('toggle');
            }).catch(function(error)
            {
                $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarUnidad').modal('toggle');
            });
        }
    };
    
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivo = function()           
    {
        $scope.moduloActualizar.Activo = !$scope.moduloActualizar.Activo;
    };
    
    /*---------------  Tipo de unidad ------------- */
    //Se editará o agregera un tipo de unidad de negocio
    $scope.TerminarTipoUnidad = function(nombreInvalido)       
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido) 
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.clase[1].nombre = "entradaError";
        }
        else
        {
            for(var k=0; k<$scope.tipoUnidad.length; k++)
            {
                if($scope.operacion == "Agregar" || $scope.moduloActualizar.TipoUnidadNegocioId !== $scope.tipoUnidad[k].TipoUnidadNegocioId)
                {
                    if($scope.moduloActualizar.Nombre.toLowerCase() == $scope.tipoUnidad[k].Nombre.toLowerCase())
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*" + $scope.moduloActualizar.Nombre + " ya existe.";
                        $scope.clase[1].nombre = "entradaError";
                        break;
                    }
                }
            }
            if($scope.mensajeError.length === 0)
            {
                $scope.clase[1].nombre = "entrada";
            }
        }
        
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarTipoUnidad();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarTipoUnidad();
        }
            
    };
    
    //agrega un tipo de unidad
    $scope.AgregarTipoUnidad = function()    
    {
        AgregarTipoUnidadNegocio($http, CONFIG, $q, $scope.moduloActualizar).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTipoUnidadNegocio();
                $('#tipoUnidadForma').modal('toggle');
                $scope.mensaje = "El tipo de unidad de negocio se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeConfigurarUnidad').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarUnidad').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarTipoUnidad = function()
    {
        EditarTipoUnidadNegocio($http, CONFIG, $q, $scope.moduloActualizar).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTipoUnidadNegocio();
                $('#tipoUnidadForma').modal('toggle');
                $scope.mensaje = "El tipo de unidad de negocio se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeConfigurarUnidad').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarUnidad').modal('toggle');
        });
    };
    
    //abre el pandel para agregar-editar un tipo de unidad
    $scope.AbrirTipoUnidadForma = function(objeto, operacion)       /*abrir la forma de tipo de unidad para agregar o editar*/
    {
        if(operacion == "Editar")
        {
            $scope.moduloActualizar = SetTipoUnidadNegocioActivo(objeto.TipoUnidadNegocioId, objeto.Nombre, objeto.Activo);
        }
        else if(operacion == "Agregar")
        {
            $scope.moduloActualizar =  new TipoUnidadNegocio();
            $scope.moduloActualizar.Activo = true;
        }
        
        $scope.operacion = operacion;
        $('#tipoUnidadForma').modal('toggle');
    };
    
    //cancelar agregar-editar tipo de unidad
    $scope.CerrarTipoUnidadForma = function()               //limpiar errores y clases de error cuando se salga de la forma de tipo de unidad
    {
        $scope.clase[1].nombre = "entrada";
        $scope.mensajeError = [];
    };
    
    
    /*-----------------Empresa------------------------------*/
    //Se presionó el botón "TERMINAR" para editar-agregar una empresa
    //Verfica que los datos sean validos
    //Si los datos son validos llama al método para realizar la operación
    $scope.TerminarEmpresa = function(nombreInvalido, rfcInvalido, emailInvalido, domicilioInvalido, codigoInvalido, coloniaInvalida)
    {   
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, ., +, - y #.";
            $scope.clase[0].nombre = "entradaError";
        }
        else
        {
            $scope.clase[0].nombre = "entrada";
        }
        
        if(rfcInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un RFC válido. Ejemplo: ABC-AAMMDD-A1B.";
            $scope.clase[0].rfc = "entradaError";
        }
        else
        {
            $scope.clase[0].rfc = "entrada";
        }
        if(emailInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un correo electrónico válido.";
            $scope.clase[0].email = "entradaError";
        }
        else
        {
            $scope.clase[0].email = "entrada";
        }
        if(domicilioInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El domicilio solo puede tener los siguientes caracteres: letras, números, ., +, - y #.";
            $scope.clase[0].domicilio = "entradaError";
        }
        else
        {
            $scope.clase[0].domicilio = "entrada";
        }
        if(codigoInvalido)
        {
            if($scope.moduloActualizar.Codigo === "NC.P.")
            {
                $scope.clase[0].cp = "entrada";
            }
            else if($scope.otraColonia)
            {
                if($scope.moduloActualizar.Codigo.length === 0)
                {
                    $scope.moduloActualizar.Codigo = "NC.P.";
                    $scope.clase[0].cp = "entrada";
                }
                else
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El C.P. debe de tener 5 números o en dado que no se conosca estar vacio.";
                    $scope.clase[0].cp = "entradaError";
                }
            }
            else
            {
                $scope.mensajeError[$scope.mensajeError.length]= "*El C.P. debe de tener 5 números.";
                $scope.clase[0].cp = "entradaError";
            }
        }
        else
        {
            $scope.clase[0].cp = "entrada";
        }
        if($scope.moduloActualizar.Estado === "" || $scope.moduloActualizar.Municipio === "" || $scope.moduloActualizar.Ciudad === "" || $scope.moduloActualizar.Colonia === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Completa todos los campos del domicilio.";
            $scope.clase[0].Estado = "dropdownListModalError";
            $scope.clase[0].Municipio = "dropdownListModalError";
            $scope.clase[0].ciudad = "dropdownListModalError";
            $scope.clase[0].colonia = "dropdownListModalError";
        }
        else
        {
            $scope.clase[0].Estado = "dropdownListModal";
            $scope.clase[0].Municipio = "dropdownListModal";
            $scope.clase[0].ciudad = "dropdownListModal";
            $scope.clase[0].colonia = "dropdownListModal";
        }
        if(coloniaInvalida)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*La colonia solo puede tener los siguientes caracteres: letras, números, ., +, - y #.";
            $scope.clase[0].otraColonia = "entradaError";
        }
        else
        {
            $scope.clase[0].otraColonia = "entrada";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.empresa.length; k++)
        {
            if($scope.moduloActualizar.Nombre.toLowerCase() == $scope.empresa[k].Nombre.toLowerCase() && $scope.moduloActualizar.EmpresaId != $scope.empresa[k].EmpresaId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*La empresa " + $scope.moduloActualizar.Nombre + " ya existe.";
                return;
            }
        }
        
        $scope.moduloActualizar.RFC = $scope.moduloActualizar.RFC.toUpperCase();
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarEmpresa();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarEmpresa();
        }
    };
    
    //Agregar empresa
    $scope.AgregarEmpresa = function()
    {
        AgregarEmpresa($http, CONFIG, $q, $scope.moduloActualizar).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetEmpresa();
                $('#empresaModal').modal('toggle');
                $scope.mensaje = "La empresa se ha agregado.";
                $('#mensajeConfigurarUnidad').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeConfigurarUnidad').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde."+ error;
            $('#mensajeConfigurarUnidad').modal('toggle');
        });
    };
    
    //Editar empresa
    $scope.EditarEmpresa = function()
    {
        EditarEmpresa($http, CONFIG, $q, $scope.moduloActualizar).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetEmpresa();
                $('#empresaModal').modal('toggle');
                $scope.mensaje = "La empresa se ha editado.";
                $('#mensajeConfigurarUnidad').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeConfigurarUnidad').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde."+ error;
            $('#mensajeConfigurarUnidad').modal('toggle');
        });
    };
    
    //Abre el panel de agregar-editar empresa
    $scope.AbrirEmpresaForma = function(objeto, operacion)
    {
        $scope.sinCP = false;
        $scope.otraColonia = false;
        $scope.operacion = operacion;
        
        if(operacion == "Editar")
        {
            objeto.PaisId = objeto.Pais.PaisId;
            $scope.moduloActualizar = SetEmpresa(objeto);
            
            if($scope.moduloActualizar.Codigo != "NC.P.")
            {
                GetCodigoPostal($http, $q, CONFIG, $scope.moduloActualizar.Codigo).then(function(data)
                {
                    if(data.length > 0)
                    {
                        $scope.codigoPostal = data;
                    }
                }).catch(function(error)
                {
                    $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
                    $('#mensajeUnidad').modal('toggle'); 
                });
            }
            else if($scope.moduloActualizar.Codigo == "NC.P.")
            {
                $scope.sinCP = true;
                $scope.GetColoniaEstado($scope.moduloActualizar.Estado);
            }
        }
        else if(operacion == "Agregar")
        {
            $scope.moduloActualizar =  new Empresa();
            $scope.moduloActualizar.Activo = true;
            var pais = GetPais();
            $scope.moduloActualizar.Pais = SetPais(pais[0].PaisId, pais[0].Nombre);
        }
    
        $('#empresaModal').modal('toggle');
    };
    
    //cancela agregar-editar empresa
    $scope.CerrarEmpresaForma = function()               //limpiar errores y clases de error cuando se salga de la forma de empresa
    {
        $scope.clase[0] =  {nombre:"entrada", rfc:"entrada", email:"entrada", domicilio:"entrada", cp:"entrada", Estado:"dropdownListModal",
        Municipio:"dropdownListModal", ciudad:"dropdownListModal", colonia:"dropdownListModal", otraColonia:"entrada"};
        $scope.mensajeError = [];
    };
    
    /*-------Dirección------*/
    $scope.sinCP = false;
    $scope.otraColonia = false;
    $scope.estadoMexico = null;
    
    //indica si se conoce el codigo postal o no
    $scope.ConocerCP = function()  
    {
        $scope.sinCP = !$scope.sinCP; 
        $scope.otraColonia = false;

        $scope.moduloActualizar.Estado  = "";
        $scope.moduloActualizar.Municipio  ="";
        $scope.moduloActualizar.Colonia  ="";
        $scope.moduloActualizar.Ciudad  ="";
        $scope.moduloActualizar.Codigo  ="";
        
        if($scope.estadoMexico === null)
        {
            $scope.GetMexicoEstados();
        }
        
    };
    
    //identifica cuando el codigo postal cambia, por lo tanto obtiene los datos relacionados con ese cp
    $scope.CambiarCodigo = function()  
    {
        if($scope.moduloActualizar.Codigo.length == 5)
        {
            GetCodigoPostal($http, $q, CONFIG, $scope.moduloActualizar.Codigo).then(function(data)
            {
                if(data.length > 0)
                {
                    $scope.codigoPostal = data;
                    $scope.moduloActualizar.Estado = data[0].Estado;
                    $scope.moduloActualizar.Municipio = data[0].Municipio;
                    $scope.moduloActualizar.Ciudad = data[0].Ciudad;
                    $scope.moduloActualizar.Colonia = data[0].Colonia;
                }
            }).catch(function(error)
            {
                $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
                $('#mensajeUnidad').modal('toggle'); 
            });
        }
    };
    
    //Se quieren conocer las colonias de un estado sin conocer el codigo postal
    $scope.GetColoniaEstado = function(estado)
    {
        GetCodigoPostal($http, $q, CONFIG, estado).then(function(data)
        {
            $scope.codigoPostal = data;
        }).catch(function(error)
        {
            alert("Ha ocurrido un error. Intenta más tarde." + error);
        });
    };
    
    //se guarda el estado seleccionado
    $scope.CambiarEstado = function(estado)
    {
        if( $scope.moduloActualizar.Estado != estado)
        {
            $scope.moduloActualizar.Estado = estado;

            if($scope.sinCP)
            {
                GetCodigoPostal($http, $q, CONFIG, estado).then(function(data)
                {
                    $scope.codigoPostal = data;
                    $scope.moduloActualizar.Municipio = "";
                    $scope.moduloActualizar.Ciudad = ""; 
                    $scope.moduloActualizar.Colonia = ""; 
                    $scope.moduloActualizar.Codigo = "";
                    
                }).catch(function(error)
                {
                    $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
                    $('#mensajeUnidad').modal('toggle'); 
                });
            }
        }
    };
    
    //guarda el municipio seleccionado
    $scope.CambiarMunicipio = function(municipio)
    {
        if($scope.moduloActualizar.Municipio != municipio)
        {
            $scope.moduloActualizar.Municipio = municipio;
            $scope.moduloActualizar.Colonia = ""; 
            $scope.moduloActualizar.Codigo = "";
            $scope.moduloActualizar.Ciudad = "";
            for(var k=0; k<$scope.codigoPostal.length; k++)
            {
                if($scope.codigoPostal[k].Municipio == $scope.moduloActualizar.Municipio)
                {
                    $scope.moduloActualizar.Ciudad = $scope.codigoPostal[k].Ciudad;
                    break;
                }
            }
        }
    };
    
    //guarda la ciudad seleccinada
    $scope.CambiarCiudad = function(ciudad)
    {
        if($scope.moduloActualizar.Ciudad != ciudad)
        {
            $scope.moduloActualizar.Ciudad = ciudad;
            $scope.moduloActualizar.Colonia = "";
            $scope.moduloActualizar.Codigo = "";
        }   
    };
    
    //Guarda la colonia seleccionada
    //Si se dijo que no se conocia el cp, entonces lo obtiene de acuerdo a los datos seleccionados
    $scope.CambiarColonia = function (colonia)
    {
        if(colonia === "OtraColonia")
        {
            $scope.otraColonia = true; 
            $scope.moduloActualizar.Colonia = "";
            if($scope.sinCP)
                $scope.moduloActualizar.Codigo = "";
        }
        else
        {
            $scope.otraColonia = false; 
            $scope.moduloActualizar.Colonia = colonia;
            
            if($scope.sinCP)                                       //Obteber el código postal 
            {
                for(var k=0; k<$scope.codigoPostal.length; k++)
                {
                    if($scope.codigoPostal[k].Municipio == $scope.moduloActualizar.Municipio && $scope.codigoPostal[k].Ciudad == $scope.moduloActualizar.Ciudad && $scope.codigoPostal[k].Colonia == $scope.moduloActualizar.Colonia)
                    {
                        $scope.moduloActualizar.Codigo = $scope.codigoPostal[k].Codigo;
                        break;
                    }
                }
            }
        }
    };
    
    //obtiene los estados de México
    $scope.GetMexicoEstados = function()
    {
        GetEstadoMexico($http, $q, CONFIG).then(function(data)
        {
            $scope.estadoMexico = data;
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
            $('#mensajeUnidad').modal('toggle'); 
        });
    };
     
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.consultarEmpresa && !$scope.permisoUsuario.consultarTipoUnidad)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado); 
                }
                else
                {
                    if($scope.permisoUsuario.consultarEmpresa)
                    {
                        $scope.GetEmpresa();
                    }
                    if($scope.permisoUsuario.consultarTipoUnidad)
                    {
                        $scope.GetTipoUnidadNegocio();
                    }
                }
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
        else
        {
            $window.location = "#Login";
        }
    }
    
    //Se manda a llamar cada ves que los datos del usuario cambian
    //verifica que el usuario este logeado y que tenga los permisos correspondientes
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $window.location = "#Login";
            return;
        }
        else
        {
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.consultarEmpresa && !$scope.permisoUsuario.consultarTipoUnidad)
                {
                    $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    if($scope.permisoUsuario.consultarEmpresa)
                    {
                        $scope.GetEmpresa();
                    }
                    if($scope.permisoUsuario.consultarTipoUnidad)
                    {
                        $scope.GetTipoUnidadNegocio();
                    }

                }
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
    });

});

//Pestañas
var tab = 
    [
        {titulo:"Empresa", referencia: "#Empresa", clase:"active", area:"empresa"},
        {titulo:"Tipo Unidad Negocio", referencia: "#TipoUnidadNegocio", clase:"", area:"tipoUnidad"}
    ];