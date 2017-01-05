app.controller("UnidadNegocioControlador", function($scope, $http, $q, CONFIG, datosUsarUnidad, $rootScope, datosUnidadNegocio, datosUsuario, $window, $location)
{    
    $rootScope.clasePrincipal = "";

    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false, editar: false, activar:false, agregar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmUNeConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUNeAgregar")
            {
                $scope.permisoUsuario.agregar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUNeEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUNeActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
        }
    };
    
    $rootScope.UnidadNegocio = [];
    $rootScope.clasePrincipal = "";
    
    $scope.ordenarPor = "Nombre";
    $scope.buscar = "";
    
    //obtine las unidades de negocio
    $scope.InicializarUniadadNegocio = function()
    {
        GetUnidadNegocio($http, $q, CONFIG).then(function(data)     
        {
            $rootScope.UnidadNegocio = data;
        }).catch(function(error)
        {
            $rootScope.UnidadNegocio = [];
            alert(error);
        });
    };
    
    //copia una unidad de negocio para editarla
    $scope.SetUnidadSeleccionada = function(unidad)         
    {
        datosUsarUnidad.setUnidad(unidad);
    };
    
    //esta funcion se manda a llamar cuando se quiere agregar una Unidad de Negocio
    $scope.AbrirUnidadNegocioForma = function()            
    {
        var NuevaUnidad = new UnidadNegocio();
        datosUsarUnidad.setUnidad(NuevaUnidad);             //Se crea una unidad de negocio vacia
        $('#UnidadNegocioForma').modal('toggle'); 
    };
    
    //Actualiza las Unidades de negocio
    $scope.$on('guardarUnidad',function()                   
    {
        $scope.InicializarUniadadNegocio();
    });
    
    //Abrir el modal para confirmar que si se quiere desactivar o activar la unidad de negocio
    $scope.ActivarDesactivarModal = function(unidad)      
    {
        datosUsarUnidad.setUnidad(unidad);
        $('#modalActivarDesactivar').modal('toggle'); 
    };
    
    //ordena las unidades de negocio por el campo seleccionado
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenarPor == campoOrdenar)
        {
            $scope.ordenarPor = "-" + campoOrdenar;
        }
        else if($scope.ordenarPor == "-"+campoOrdenar)
        {
            $scope.ordenarPor = campoOrdenar;
        }
        else
        {
           $scope.ordenarPor = campoOrdenar; 
        }
    };
    
    /*-------------------filtros-------------*/

    $scope.fitroResponsable = [];
    $scope.filtroTipoUnidad = [];
    $scope.fitroEmpresa = [];
    
    //Agrega o quita una opcion para filtrar
    $scope.setFilter = function(filtro, campo)
    {
        if(filtro == "tipoUnidad")
        {
            for(var k=0; k<$scope.filtroTipoUnidad.length; k++)
            {
                if($scope.filtroTipoUnidad[k] == campo)
                {
                    $scope.filtroTipoUnidad.splice(k,1);
                    return;
                }
            }
            $scope.filtroTipoUnidad.push(campo);
            return;
        }
        else if(filtro == "responsable")
        {
            for(var k=0; k<$scope.fitroResponsable.length; k++)
            {
                if($scope.fitroResponsable[k] == campo)
                {
                    $scope.fitroResponsable.splice(k,1);
                    return;
                }
            }
            $scope.fitroResponsable.push(campo);
            return;
        }
        else if(filtro == "empresa")
        {
            for(var k=0; k<$scope.fitroEmpresa.length; k++)
            {
                if($scope.fitroEmpresa[k] == campo)
                {
                    $scope.fitroEmpresa.splice(k,1);
                    return;
                }
            }
            $scope.fitroEmpresa.push(campo);
            return;
        }
    };
    
    //funcion que se especica en el filter del ng-repeat
    //Verifica que se cumplan los filtros seleccionado
    $scope.filtrarUnidad = function(unidad)
    {
        if($scope.fitroResponsable.length === 0 && $scope.filtroTipoUnidad.length === 0 && $scope.fitroEmpresa.length === 0)
        {
            return true;
        }
        else
        {
            var cumpleFiltro = false;
            if($scope.filtroTipoUnidad.length === 0)
                cumpleFiltro = true;
            
            //console.log(unidad.Nombre+" "+cumpleFiltro+ " " + $scope.filtroTipoUnidad.length);
            for(var k=0; k<$scope.filtroTipoUnidad.length; k++)
            {
                if(unidad.TipoUnidadNegocio.Nombre == $scope.filtroTipoUnidad[k])
                {
                    cumpleFiltro = true;
                    break;
                }
            }

            if(!cumpleFiltro)
                return false;
            
            
            if($scope.fitroResponsable.length === 0)
                cumpleFiltro = true;
            else
                cumpleFiltro = false;
            
            for(var k=0; k<$scope.fitroResponsable.length; k++)
            {
                if(unidad.Colaborador == $scope.fitroResponsable[k])
                {
                    cumpleFiltro  = true;
                    break;
                }
            }
            if(!cumpleFiltro)
                return false;
            
            if($scope.fitroEmpresa.length === 0)
                cumpleFiltro = true;
            else
                cumpleFiltro = false;
            for(var k=0; k<$scope.fitroEmpresa.length; k++)
            {
                if(unidad.Empresa.Nombre == $scope.fitroEmpresa[k])
                {
                    cumpleFiltro = true;
                    break;
                }
            }
            
            if(cumpleFiltro)
                return true;
            else
                return false;
        }
    };
    $scope.tipoUnidadFiltroCheckbox = [];
    $scope.responsableFiltroCheckbox = [];
    $scope.empresaFiltroCheckbox = [];
    
    
    //limpia las opcines seleccionadas para filtrar
    $scope.LimpiarFiltro = function()
    {
        $scope.filtroTipoUnidad.splice(0,$scope.filtroTipoUnidad.length);
        $scope.fitroResponsable.splice(0,$scope.fitroResponsable.length);
        $scope.fitroEmpresa.splice(0,$scope.fitroEmpresa.length);
        
        for(var k=0; k<$scope.tipoUnidadFiltroCheckbox.length; k++)
        {
            $scope.tipoUnidadFiltroCheckbox[k] = false;
        }
        
        for(var k=0; k<$scope.responsableFiltroCheckbox.length; k++)
        {
            $scope.responsableFiltroCheckbox[k] = false;
        }
        
        for(var k=0; k<$scope.empresaFiltroCheckbox.length; k++)
        {
            $scope.empresaFiltroCheckbox[k] = false;
        }
    };
    
    $scope.mostrarFiltroTipoUnidad = true;
    $scope.mostrarFiltroResponsable = false;
    $scope.mostrarFiltroEmpresa = false;
    
    //Muestra u oculta las opciones para filtrar de cada campo
    $scope.MostrarFiltros = function(filtro)
    {
        if(filtro === "tipoUnidad")
        {
            $scope.mostrarFiltroTipoUnidad = !$scope.mostrarFiltroTipoUnidad;
        }
        else if(filtro === "responsable")
        {
            $scope.mostrarFiltroResponsable = !$scope.mostrarFiltroResponsable;
        }
        else if(filtro === "empresa")
        {
            $scope.mostrarFiltroEmpresa = !$scope.mostrarFiltroEmpresa;
        }
    };
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    //Verifica que un usuario este logeado
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            $scope.IdentificarPermisos();
            if(!$scope.permisoUsuario.consultar)
            {
               for(var k=0; k<$rootScope.Perfiles.length; k++)
                {
                    if($scope.usuarioLogeado.PerfilSeleccionado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
                    {
                        $window.location = $rootScope.Perfiles[k].paginaPrincipal;
                    }
                } 
            }
            else
            {
               $scope.InicializarUniadadNegocio();
            }
        }
        else
        {
            $window.location = "#Login";
        }
    }
    
    //verfica que el usuario este logeado y que cumpla con los permisos necesario para este módulo
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
            $scope.IdentificarPermisos();
            if(!$scope.permisoUsuario.consultar)
            {
               for(var k=0; k<$rootScope.Perfiles.length; k++)
                {
                    if($scope.usuarioLogeado.PerfilSeleccionado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
                    {
                        $window.location = $rootScope.Perfiles[k].paginaPrincipal;
                    }
                } 
            }
            else
            {
               $scope.InicializarUniadadNegocio();
            }
        }
    });
   
});



/*--------Controlador de los modal--------*/
app.controller("UtilizarUidadNegocio", function($scope, $rootScope, $http, $q, CONFIG, datosUsarUnidad, datosUnidadNegocio, datosUsuario, $window)
{   
    /*----------------verificar los permisos---------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
    $scope.permisoUsuario = {editar: false, activar:false, consultar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmUNeConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUNeEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUNeActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
        }
    };
    
    $scope.unidad = datosUsarUnidad.getUnidad();  //Se obtiene la unidad de negocios seleccionada (Puede ser que aun no exista)  
    $scope.mensaje ="";                           //Se utiliza para enviar un mensaje al usuario
    $scope.operacion = "";                        //Saber si se esta agregando o editando
    $scope.buscarResponsable = "";                //busqueda de colaborador
    $scope.NuevaUnidad = new UnidadNegocio();     //Se crea una nueva unidad la cual será modificada para editar o agregar
    $scope.sinCP = false;                         //cuando no se conoce el CP.
    
    $scope.mostrarOcultarBoton = ">>";            //Texto que indica si mostar o ocultar los colaboradores en seleccionar un responsable
    $scope.mostrarColaboradores = false;          //mostrar lista de colaboradores para seleccionar un responsable
    
    //Obtiene la unidad selecciona (puede ser vacia para agregar o puede estar llena para editar)
    $scope.$on('cambioUnidad',function()          
    {
        $scope.unidad = datosUsarUnidad.getUnidad();
        
        $scope.sinCP = false;
        
        if($scope.unidad.Nombre === "")         
        {
            $scope.operacion = "Agregar";
            $scope.NuevaUnidad = new UnidadNegocio();
            $scope.mostrarColaboradores = true;
            $scope.mostrarOcultarBoton = "<<"; 
            
            $scope.otraColonia = false;
            
            $scope.NuevaUnidad.Activo = true;
            
            if($scope.empresa !== null)
            {
                for(var k=0; k< $scope.empresa.length; k++)
                {
                    if($scope.empresa[k].Activo)
                    {
                        $scope.NuevaUnidad.Empresa.EmpresaId = $scope.empresa[0].EmpresaId; 
                        $scope.NuevaUnidad.Empresa.Nombre = $scope.empresa[0].Nombre;
                        break;
                    }
                }
            }
            if($scope.tipoUnidadNegocio !== null)
            {
                for(var k=0; k< $scope.tipoUnidadNegocio.length; k++)
                {
                    if($scope.tipoUnidadNegocio[k].Activo)
                    {
                        $scope.NuevaUnidad.TipoUnidadNegocio = SetTipoUnidadNegocio($scope.tipoUnidadNegocio[k].TipoUnidadNegocioId, $scope.tipoUnidadNegocio[k].Nombre);
                        break;
                    }
                }
            }
            if($scope.pais !== null)
            {
                $scope.NuevaUnidad.Pais = SetPais($scope.pais[0].PaisId, $scope.pais[0].Nombre);
            }
        }
        else
        {
            $scope.operacion = "Editar";
            $scope.NuevaUnidad = CopiarUnidad($scope.unidad);
            $scope.mostrarColaboradores = false; 
            $scope.mostrarOcultarBoton = ">>"; 
            
            if($scope.NuevaUnidad.Codigo != "NC.P.")
            {
                GetCodigoPostal($http, $q, CONFIG, $scope.NuevaUnidad.Codigo).then(function(data)
            {
                if(data.length > 0)
                {
                    $scope.codigoPostal = data;
                }
            }).catch(function(error)
            {
                alert("Ha ocurrido un error. Intenta más tarde." + error);
            });
            }
            else if($scope.NuevaUnidad.Codigo == "NC.P.")
            {
                $scope.sinCP = true;
                $scope.GetColoniaEstado($scope.NuevaUnidad.Estado);
            }
        }
    });
    
    //abre el panel para agregar o editar una unidad de negocio
    $scope.AbrirUnidadNegocioForma = function()   
    {
        $scope.sinCP = false;
        
        if($scope.operacion == "Editar")
        {
            if($scope.NuevaUnidad.Codigo != "NC.P.")
            {
                GetCodigoPostal($http, $q, CONFIG, $scope.NuevaUnidad.Codigo).then(function(data)
                {
                    if(data.length > 0)
                    {
                        $scope.codigoPostal = data;
                    }
                }).catch(function(error)
                {
                    alert("Ha ocurrido un error. Intenta más tarde." + error);
                });
            }
            else if($scope.NuevaUnidad.Codigo == "NC.P.")
            {
                $scope.sinCP = true;
                $scope.GetColoniaEstado($scope.NuevaUnidad.Estado);
            }
        }
        
        $scope.otraColonia = false;
        
        $('#UnidadNegocioForma').modal('toggle'); 
        //$('#DetallesUnidadNegocio').modal('toggle'); 
    };
    
    //Obtiene los catálogos necesarios para editar o agregar una unidad de negocio
    $scope.GetCatalogosUnidadNegocio = function()           //inicializar catálogos
    {
        GetEmpresa($http, $q, CONFIG).then(function(data)
        {
            $scope.empresa = data;
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
            $('#mensajeUnidad').modal('toggle'); 
        });
        
        GetTipoUnidadNegocio($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoUnidadNegocio = data;
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
            $('#mensajeUnidad').modal('toggle'); 
        });
        
        GetEstadoMexico($http, $q, CONFIG).then(function(data)
        {
            $scope.estadoMexico = data;
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
            $('#mensajeUnidad').modal('toggle'); 
        });
        
        GetResponsable($http, $q, CONFIG).then(function(data)
        {
            $scope.responsable = data;
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
            $('#mensajeUnidad').modal('toggle'); 
        });
        
        $scope.pais = GetPais();
    };
    
    //Se selecciono un tipo de unidad y se guarda en una variable
    $scope.CambiarTipoUnidad = function(tipo)
    {
        $scope.NuevaUnidad.TipoUnidadNegocio = SetTipoUnidadNegocio(tipo.TipoUnidadNegocioId, tipo.Nombre);
    };
    
    //Se selcciono una empresa y se guarda en una variable
    $scope.CambiarEmpresa= function(empresa)
    {
        $scope.NuevaUnidad.Empresa.EmpresaId = empresa.EmpresaId;
        $scope.NuevaUnidad.Empresa.Nombre = empresa.Nombre;
    };
    
    //---------------------------Dirección -----------------------*/
    //Se selecciono un estado
    $scope.CambiarEstado = function(estado)
    {
        if( $scope.NuevaUnidad.Estado != estado)
        {
            $scope.NuevaUnidad.Estado = estado;

            if($scope.sinCP)
            {
                GetCodigoPostal($http, $q, CONFIG, estado).then(function(data)
                {
                    $scope.codigoPostal = data;
                    $scope.NuevaUnidad.Municipio = "";
                    $scope.NuevaUnidad.Ciudad = ""; 
                    $scope.NuevaUnidad.Colonia = ""; 
                    $scope.NuevaUnidad.Codigo = "";
                    
                }).catch(function(error)
                {
                    $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
                    $('#mensajeUnidad').modal('toggle'); 
                });
            }
        }
    };
    
    //Se selecciona un municipio
    $scope.CambiarMunicipio = function(municipio)
    {
        if($scope.NuevaUnidad.Municipio != municipio)
        {
            $scope.NuevaUnidad.Municipio = municipio;
            $scope.NuevaUnidad.Colonia = ""; 
            $scope.NuevaUnidad.Codigo = "";
            $scope.NuevaUnidad.Ciudad = "";
            for(var k=0; k<$scope.codigoPostal.length; k++)
            {
                if($scope.codigoPostal[k].Municipio == $scope.NuevaUnidad.Municipio)
                {
                    $scope.NuevaUnidad.Ciudad = $scope.codigoPostal[k].Ciudad;
                    break;
                }
            }
        }
    };
    
    //se selecciona una ciudad
    $scope.CambiarCiudad = function(ciudad)
    {
        if($scope.NuevaUnidad.Ciudad != ciudad)
        {
            $scope.NuevaUnidad.Ciudad = ciudad;
            $scope.NuevaUnidad.Colonia = "";
            $scope.NuevaUnidad.Codigo = "";
        }
    };
    
    //Se selecciona una colonia
    //Si no se conoce el código postal se obtendra depués de haber seleccionada la colonia
    $scope.otraColonia = false;                     //se habilitará cuando la colonia no aparesa en el catálogo
    $scope.CambiarColonia = function(colonia)
    {
        if(colonia === "OtraColonia")
        {
            $scope.otraColonia = true; 
            $scope.NuevaUnidad.Colonia = "";
            if($scope.sinCP)
                $scope.NuevaUnidad.Codigo = "";
        }
        else
        {
            $scope.otraColonia = false; 
            $scope.NuevaUnidad.Colonia = colonia;
            
            if($scope.sinCP)                                       //Obteber el código postal 
            {
                for(var k=0; k<$scope.codigoPostal.length; k++)
                {
                    if($scope.codigoPostal[k].Municipio == $scope.NuevaUnidad.Municipio && $scope.codigoPostal[k].Ciudad == $scope.NuevaUnidad.Ciudad && $scope.codigoPostal[k].Colonia == $scope.NuevaUnidad.Colonia)
                    {
                        $scope.NuevaUnidad.Codigo = $scope.codigoPostal[k].Codigo;
                        break;
                    }
                }
            }
        }
    };
    
    //se manda a llamar cada ves que el código postal cambia
    //Se obtienen los datos relacionados con el código postal especificado
    $scope.CambiarCodigo = function()
    {
        if($scope.NuevaUnidad.Codigo.length == 5)
        {
            GetCodigoPostal($http, $q, CONFIG, $scope.NuevaUnidad.Codigo).then(function(data)
            {
                if(data.length > 0)
                {
                    $scope.codigoPostal = data;
                    $scope.NuevaUnidad.Estado = data[0].Estado;
                    $scope.NuevaUnidad.Municipio = data[0].Municipio;
                    $scope.NuevaUnidad.Ciudad = data[0].Ciudad;
                    $scope.NuevaUnidad.Colonia = data[0].Colonia;
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
    
    //Muestra u oculta la lista de los colaboradores, de la cual se selecciona un responsable
    $scope.MostrarOcultarColaboradores = function()
    {
        $scope.mostrarColaboradores = !$scope.mostrarColaboradores;
        if(!$scope.mostrarColaboradores)
        {
            $scope.mostrarOcultarBoton = ">>";
        }
        else
        {
            $scope.mostrarOcultarBoton = "<<";
        }
    };
    
    //Se selecciona un colaborador como responsable
    $scope.SetReponsable = function(responsable)
    {
        $scope.NuevaUnidad.Colaborador = responsable.Nombre;
        $scope.NuevaUnidad.ColaboradorId = responsable.ColaboradorId;
    };
    
    //Se especifica el conocimiento del código postal
    $scope.ConocerCP = function()
    {
        $scope.sinCP = !$scope.sinCP; 
        $scope.otraColonia = false;

        $scope.NuevaUnidad.Estado  ="";
        $scope.NuevaUnidad.Municipio  ="";
        $scope.NuevaUnidad.Colonia  ="";
        $scope.NuevaUnidad.Ciudad  ="";
        $scope.NuevaUnidad.Codigo  ="";
    };
    
    $scope.claseUnidad = 
    [
        {tipoUnidad:"dropdownListModal", empresa:"dropdownListModal", nombre:"entrada", telefono:"entrada", responsable:"entrada", domicilio:"entrada", cp:"entrada", Estado:"dropdownListModal",
        Municipio:"dropdownListModal", ciudad:"dropdownListModal", colonia:"dropdownListModal", otraColonia:"entrada"}
    ];
    
    //Se presiona el botón "TERMINAR" para agregar o editar una unidad de negocio
    //Verifica que los datos sean validos, si este es el caso pasa a realizar la operación correspondiente para concluir con la operación
    $scope.GuardarNuevaUnidad = function(nombreInvalido, telefonoInvalido, domicilioInvalido, codigoInvalido, coloniaInvalida)
    {
        $scope.campoInvalido = [];
        
        if($scope.NuevaUnidad.TipoUnidadNegocio.Nombre === "")
        {
            $scope.campoInvalido[$scope.campoInvalido.length] = "*Selecciona un tipo de unidad de negocio.";
            $scope.claseUnidad[0].tipoUnidad = "dropdownListModalError";
        }
        else
        {
            $scope.claseUnidad[0].tipoUnidad = "dropdownListModal";
        }
        if($scope.NuevaUnidad.Empresa.Nombre === "")
        {
            $scope.campoInvalido[$scope.campoInvalido.length] = "*Selecciona una empresa.";
            $scope.claseUnidad[0].empresa = "dropdownListModalError";
        }
        else
        {
            $scope.claseUnidad[0].empresa = "dropdownListModal";
        }
        if(nombreInvalido)
        {
            $scope.campoInvalido[$scope.campoInvalido.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, ., +, - y #.";
            $scope.claseUnidad[0].nombre = "entradaError";
        }
        else
        {
            $scope.claseUnidad[0].nombre = "entrada";
        }
        if(telefonoInvalido)
        {
            $scope.campoInvalido[$scope.campoInvalido.length] = "*El número telefónico solo puede tener número y estar completo (10 dígitos).";
            $scope.claseUnidad[0].telefono = "entradaError";
        }
        else
        {
            $scope.claseUnidad[0].telefono = "entrada";
        }
        if($scope.NuevaUnidad.Colaborador === "")
        {
            $scope.campoInvalido[$scope.campoInvalido.length] = "*Selecciona un responsable.";
            $scope.claseUnidad[0].responsable = "entradaError";
        }
        else
        {
            $scope.claseUnidad[0].responsable = "entrada";
        }
        if(domicilioInvalido)
        {
            $scope.campoInvalido[$scope.campoInvalido.length] = "*El domicilio solo puede tener los siguientes caracteres: letras, números, ., +, - y #.";
            $scope.claseUnidad[0].domicilio = "entradaError";
        }
        else
        {
            $scope.claseUnidad[0].domicilio = "entrada";
        }
        if($scope.NuevaUnidad.Estado === "" || $scope.NuevaUnidad.Municipio === "" || $scope.NuevaUnidad.Ciudad === "" || $scope.NuevaUnidad.Colonia === "")
        {
            $scope.campoInvalido[$scope.campoInvalido.length] = "*Completa todos los campos del domicilio.";
            $scope.claseUnidad[0].Estado = "dropdownListModalError";
            $scope.claseUnidad[0].Municipio = "dropdownListModalError";
            $scope.claseUnidad[0].ciudad = "dropdownListModalError";
            $scope.claseUnidad[0].colonia = "dropdownListModalError";
        }
        else
        {
            $scope.claseUnidad[0].Estado = "dropdownListModal";
            $scope.claseUnidad[0].Municipio = "dropdownListModal";
            $scope.claseUnidad[0].ciudad = "dropdownListModal";
            $scope.claseUnidad[0].colonia = "dropdownListModal";
        }
        if(coloniaInvalida)
        {
            $scope.campoInvalido[$scope.campoInvalido.length] = "*La colonia solo puede tener los siguientes caracteres: letras, números, ., +, - y #.";
            $scope.claseUnidad[0].otraColonia = "entradaError";
        }
        else
        {
            $scope.claseUnidad[0].otraColonia = "entrada";
        }
        if(codigoInvalido)
        {
            //console.log($scope.NuevaUnidad.Codigo);
            if($scope.NuevaUnidad.Codigo === "NC.P.")
            {
                $scope.claseUnidad[0].cp = "entrada";
            }
            else if($scope.otraColonia)
            {
                if($scope.NuevaUnidad.Codigo.length === 0)
                {
                    $scope.NuevaUnidad.Codigo = "NC.P.";
                    $scope.claseUnidad[0].cp = "entrada";
                }
                else
                {
                    $scope.campoInvalido[$scope.campoInvalido.length] = "*El C.P. debe de tener 5 números o en dado que no se conosca estar vacio.";
                    $scope.claseUnidad[0].cp = "entradaError";
                }
            }
            else
            {
                $scope.campoInvalido[$scope.campoInvalido.length]= "*El C.P. debe de tener 5 números.";
                $scope.claseUnidad[0].cp = "entradaError";
                return;
            }
        }
        else
        {
            $scope.claseUnidad[0].cp = "entrada";
        }
        
        if($scope.campoInvalido.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$rootScope.UnidadNegocio.length; k++)
        {
            if($scope.operacion == "Agregar" || $scope.NuevaUnidad.UnidadNegocioId !== $scope.UnidadNegocio[k].UnidadNegocioId)
            {
                if($rootScope.UnidadNegocio[k].Nombre.toLowerCase() == $scope.NuevaUnidad.Nombre.toLowerCase())
                {
                    if($rootScope.UnidadNegocio[k].TipoUnidadNegocio.Nombre == $scope.NuevaUnidad.TipoUnidadNegocio.Nombre)
                    {
                        $scope.campoInvalido[$scope.campoInvalido.length]= "Ya existe " + $scope.NuevaUnidad.TipoUnidadNegocio.Nombre + " " + $scope.NuevaUnidad.Nombre;
                        
                        $scope.claseUnidad[0].nombre = "entradaError";
                        return;
                    }
                }
            }
        }
        
        $scope.otraColonia = false;
        $scope.sinCP = false;
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarUnidadNegocio();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarUnidadNegocio();
        }
    };
    
    
    //Agrega una unidad de negocio
    $scope.AgregarUnidadNegocio = function()
    {
        AgregarUnidadNegocio($http, CONFIG, $q, $scope.NuevaUnidad).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#UnidadNegocioForma').modal('toggle'); 
                datosUnidadNegocio.setUnidad("Guardar");
                $scope.mensaje = "La unidad ha sido agregada.";
                $('#mensajeUnidad').modal('toggle'); 
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
                $('#mensajeUnidad').modal('toggle'); 
            }
        }).catch(function(error)
        {
                $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
                $('#mensajeUnidad').modal('toggle'); 
        });
    };
    
    //Edita una unidad de negocio
    $scope.EditarUnidadNegocio = function()
    {
        EditarUnidadNegocio($http, CONFIG, $q, $scope.NuevaUnidad).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#UnidadNegocioForma').modal('toggle'); 
                datosUnidadNegocio.setUnidad("Guardar");
                //datosUsarUnidad.setUnidad($scope.NuevaUnidad);
                //$scope.unidad = CopiarUnidad($scope.NuevaUnidad);
                $scope.mensaje = "La unidad ha sido editada.";
                $('#mensajeUnidad').modal('toggle'); 
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
                $('#mensajeUnidad').modal('toggle'); 
            }
        }).catch(function(error)
        {
                $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
                $('#mensajeUnidad').modal('toggle'); 
        });
    };
    
    //Abrir el modal para confirmar que si se quiere desactivar o activar la unidad de negocio
    $scope.ActivarDesactivarModal = function(unidad)      
    {
        $scope.unidad.Activo = !$scope.unidad.Activo; 
        $('#modalActivarDesactivar').modal('toggle'); 
    };
    
    //Se cancela el cambio de estatus actvo
    $rootScope.CancelarActivarDesactivarUnidad = function()
    {
       $scope.unidad.Activo = !$scope.unidad.Activo;  
    };
    
    //Cambiar estatus de activo de la unidad de negocio
    $rootScope.ActivarDesactivarUnidad = function()    
    {
        var datos = [];  
        if($scope.unidad.Activo)
            datos[0] = "1";
        else
            datos[0] = "0";
        
        datos[1] = $scope.unidad.UnidadNegocioId;
        
        ActivarDesactivarUnidad($http, $q, CONFIG, datos).then(function(data)
        {
            if(data == "Exito")
            {
                $scope.mensaje = "La unidad de negocio se ha actualizado."
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
            }
            $('#mensajeUnidad').modal('toggle'); 
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
            $('#mensajeUnidad').modal('toggle'); 
        });
    };
    
    //Se cancelo el agregar o editar la unidad de negocio y se limpian los datos que se generaron en el proceso
    $scope.LimpiarErrores = function()
    {
        $scope.claseUnidad = 
        [
            {tipoUnidad:"dropdownListModal", empresa:"dropdownListModal", nombre:"entrada", telefono:"entrada", responsable:"entrada", domicilio:"entrada", cp:"entrada", Estado:"dropdownListModal",
            Municipio:"dropdownListModal", ciudad:"dropdownListModal", colonia:"dropdownListModal", otraColonia:"entrada"}
        ];
        
        $scope.campoInvalido = [];
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
                if(!$scope.permisoUsuario.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.GetCatalogosUnidadNegocio();           //Inicializar catálogos (CodigoPostal, responsables, tipo de unidad de negocio y empresa) 
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
            $location.path('/Login');
        }
    }
    
    //Verifica que el usuario este logeado y que cumpla con los permisos necesario
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $location.path('/Login');
            return;
        }
        else
        {
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.consultar)
                {
                    $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.GetCatalogosUnidadNegocio();           //Inicializar catálogos (CodigoPostal, responsables, tipo de unidad de negocio y empresa) 
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

/*--------Guardar los datos de la unidad que se escogio para trabajar con ella--------*/
app.factory('datosUsarUnidad',function($rootScope)
{
  var service = {};
  service.unidad = null;
    
  service.setUnidad = function(unidad)
  {
      this.unidad = unidad;
      $rootScope.$broadcast('cambioUnidad');
  };
  service.getUnidad = function()
  {
    return this.unidad;
  };
    
  return service;
});

app.factory('datosUnidadNegocio',function($rootScope)
{
  var service = {};
  service.unidad = null;
    
  service.setUnidad = function(unidad)
  {
      this.unidad = unidad;
      $rootScope.$broadcast('guardarUnidad');
  };
    
  return service;
});

/*copiar uniad ya que el operador "=" la consideraba como puntero*/
function CopiarUnidad(unidad)       
{
    var nuevaUnidad = new UnidadNegocio();
    
    nuevaUnidad.Colaborador = unidad.Colaborador;
    nuevaUnidad.ColaboradorId = unidad.ColaboradorId;
    nuevaUnidad.Empresa.EmpresaId = unidad.Empresa.EmpresaId;
    nuevaUnidad.Empresa.Nombre = unidad.Empresa.Nombre;
    nuevaUnidad.TipoUnidadNegocio = SetTipoUnidadNegocio(unidad.TipoUnidadNegocio.TipoUnidadNegocioId, unidad.TipoUnidadNegocio.Nombre);
    nuevaUnidad.UnidadNegocioId = unidad.UnidadNegocioId;
    nuevaUnidad.Nombre = unidad.Nombre;
    nuevaUnidad.Telefono = unidad.Telefono;
    nuevaUnidad.Domicilio = unidad.Domicilio;
    nuevaUnidad.Colonia = unidad.Colonia;
    nuevaUnidad.Estado = unidad.Estado;
    nuevaUnidad.Municipio = unidad.Municipio;
    nuevaUnidad.Ciudad = unidad.Ciudad;
    nuevaUnidad.Codigo = unidad.Codigo;
    nuevaUnidad.Pais = SetPais(unidad.Pais.PaisId, unidad.Pais.Nombre);
    nuevaUnidad.Activo = unidad.Activo;
    
    return nuevaUnidad;
}

//Directiva para mostrar el teléfono con una mascara 
app.directive('phoneInput', function($filter, $browser) 
{
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) 
        {
            var listener = function() 
            {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) 
            {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() 
            {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) 
            {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() 
            {
                $browser.defer(listener);
            });
        }

    };
});

app.filter('tel', function () {
    return function (tel) {
        //console.log(tel);
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) 
        {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number)
        {
            if(number.length>3)
            {
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else
            {
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else
        {
            return "(" + city;
        }
    };
});