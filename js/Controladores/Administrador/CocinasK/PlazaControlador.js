app.controller("PlazaControlador", function($scope, $http, $q, CONFIG, $rootScope, $window, datosUsuario, $location)
{   
    $rootScope.clasePrincipal = "";
   
    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false, editar: false, activar:false, agregar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmPlaConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmPlaAgregar")
            {
                $scope.permisoUsuario.agregar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmPlaEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmPlaActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
        }
    };
    
    $scope.buscar = "";
    $scope.ordenarPor = "Estado";
    
    $scope.mostrarFiltro = {estado:true, territorio: false, unidad: false, activo: false};
    $scope.filtro = {estado:[], territorio:[], unidad:[], activo:{activo:false, inactivo: false}};
    $scope.estadoFiltro = [];
    $scope.territorioFiltro = [];
    $scope.unidadFiltro = [];
    $scope.clase = {estado:"dropdownListModal", municipio:"dropdownListModal", ciudad:"dropdownListModal", territorio:"dropdownListModal", unidad:"dropdownListModal", tipoUnidad:"dropdownListModal"};
    
    $scope.estado = null;
    $scope.territorio = null;
    $scope.unidadNegocio = null;
    
    $scope.mensajeError = []; 
    $scope.clase = {estado:"dropdownListModal", municipio:"dropdownListModal", ciudad:"dropdownListModal", territorio:"dropdownListModal", unidad:"dropdownListModal", tipoUnidad:"dropdownListModal"};
    
    //obtiene las plazas dadas de alta
    $scope.GetPlaza = function()
    {
        GetPlaza($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.plaza = data;
            }
            else
            {
                $scope.plaza = [];
            }
        }).catch(function(error)
        {
            $scope.plaza = [];
            alert(error);
        });
    };
    
    /*------------------Ordenar--------------------------*/
    //ordena por el campo seleccionado
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenarPor == campoOrdenar)
        {
            $scope.ordenarPor = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPor = campoOrdenar;
        }
    };
    
    /*----------------Filtrar--------------------------*/  
    //funcion que se especifica en el filter del ng-repeat 
    //si cumple con los filtros seleccionado regresa "true", en caso contrario regresa false
    $scope.FiltrarPlaza = function(plaza)
    {
        //filtro activo
        if($scope.filtro.activo.activo != $scope.filtro.activo.inactivo)
        {
            if($scope.filtro.activo.activo)
            {
                if(!plaza.Activo)
                {
                    return false;
                }
            }
            if($scope.filtro.activo.inactivo)
            {
                if(plaza.Activo)
                {
                    return false;
                }
            }   
        }
        
        if($scope.estadoFiltro.length === 0 && $scope.territorioFiltro.length === 0 && $scope.unidadFiltro.length === 0)
        {
            return true;
        }
        
        var cumpleFiltro = false;
        //fitro estado
        if($scope.estadoFiltro.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {
            for(var k=0; k<$scope.estadoFiltro.length; k++)
            {
                if($scope.estadoFiltro[k] == plaza.Estado)
                {
                    cumpleFiltro = true;
                    break;
                }
            }
        }
        if(!cumpleFiltro)
        {
            return false;
        }
        //filtro territorio
        if($scope.territorioFiltro.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {
            cumpleFiltro = false;
            for(var k=0; k<$scope.territorioFiltro.length; k++)
            {
                if($scope.territorioFiltro[k] == plaza.NombreTerritorio)
                {
                    cumpleFiltro = true;
                    break;
                }
            }
        }
        if(!cumpleFiltro)
        {
            return false;
        }
        //filtro unidad de negocio
        if($scope.unidadFiltro.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {
            cumpleFiltro = false;
            for(var k=0; k<$scope.unidadFiltro.length; k++)
            {
                if($scope.unidadFiltro[k] == plaza.NombreUnidadNegocio)
                {
                    cumpleFiltro = true;
                    break;
                }
            }
        }
        if(!cumpleFiltro)
        {
            return false;
        }
        
        return true;
    };
    
    //agrega o elimina una opccion de filtro
    $scope.setFilter = function(filtro, campo)
    {
        if(filtro == "estado")
        {
            for(var k=0; k<$scope.estadoFiltro.length; k++)
            {
                if($scope.estadoFiltro[k] == campo)
                {
                    $scope.estadoFiltro.splice(k,1);
                    return;
                }
            }
            $scope.estadoFiltro.push(campo);
            return;
        }
        else if(filtro == "territorio")
        {
            for(var k=0; k<$scope.territorioFiltro.length; k++)
            {
                if($scope.territorioFiltro[k] == campo)
                {
                    $scope.territorioFiltro.splice(k,1);
                    return;
                }
            }
            $scope.territorioFiltro.push(campo);
            return;
        }
        else if(filtro == "unidad")
        {
            for(var k=0; k<$scope.unidadFiltro.length; k++)
            {
                if($scope.unidadFiltro[k] == campo)
                {
                    $scope.unidadFiltro.splice(k,1);
                    return;
                }
            }
            $scope.unidadFiltro.push(campo);
            return;
        }
     };
    
    //Muestra u oculta las opciones de cada campo que se puede filtrar
    $scope.MostrarFiltros =function(filtro)
    {
        
        if(filtro == "estado")
        {
            $scope.mostrarFiltro.estado = !$scope.mostrarFiltro.estado;
        }
        else if(filtro == "territorio")
        {
            $scope.mostrarFiltro.territorio = !$scope.mostrarFiltro.territorio;
        }
        else if(filtro == "unidad")
        {
            $scope.mostrarFiltro.unidad = !$scope.mostrarFiltro.unidad;
        }
        else if(filtro == "activo")
        {
            $scope.mostrarFiltro.activo = !$scope.mostrarFiltro.activo;
        }
    };
    
    //limpia todos los filtros seleccionados
    $scope.LimpiarFiltro = function()
    {
        $scope.filtro = {estado:[], territorio:[], unidad:[], activo:{activo:false, inactivo: false}};
        $scope.mostrarFiltro = {estado:true, territorio: false, unidad: false, activo: false};
        $scope.estadoFiltro = [];
        $scope.territorioFiltro = [];
        $scope.unidadFiltro = [];
    
    };
    
    /*--------------------Activar-desactivar plaza---------------------------------------*/
    //Activa-Descativa una plaza desde el modal de detalle
    //copia los datos de la plaza en una nueva varible y llama a la función para confirmar su cambio de estado de activo
    $scope.CambiarActivoModal = function()   // desde el modal de detalle
    {
        $scope.nuevaPlaza.Activo = !$scope.nuevaPlaza.Activo;
        $scope.ConfirmarCambiarActivo($scope.nuevaPlaza);
    };
    
    //Se abre un panel para confirmar que se quiere cambiar el estado de activo 
    $scope.ConfirmarCambiarActivo = function(plaza)
    {
        $scope.nuevaPlaza = plaza;
        if(plaza.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + plaza.Estado + " " + plaza.Municipio + " " + plaza.Ciudad + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + plaza.Estado + " " + plaza.Municipio + " " + plaza.Ciudad + "?";
        }
        $('#modalActivoPlaza').modal('toggle'); 
    };
    
    //Se confirmo el cambio de estado de activo y se llama al metodo correspondiente para realizar el update
    $scope.ConfirmarActualizarPlaza = function()
    {
        var datos = [];
        if($scope.nuevaPlaza.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        datos[1] = $scope.nuevaPlaza.PlazaId;
        
        ActivarDesactivarPlaza($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "La plaza se ha actualizado correctamente";
                if($scope.nuevaPlaza.Activo)
                {
                    $scope.nuevaPlaza.ActivoN = 1;
                }
                else
                {
                    $scope.nuevaPlaza.ActivoN = 0;
                }
            }
            else
            {
                $scope.nuevaPlaza.Activo = !$scope.nuevaPlaza.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
        }).catch(function(error)
        {
            $scope.nuevaPlaza.Activo = !$scope.nuevaPlaza.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
        });
        $('#mensajePlaza').modal('toggle');
    };
    
    //se cancela el cambio del estatus de activo
    $scope.CancelarCambioActivo = function()
    {
        $scope.nuevaPlaza.Activo = !$scope.nuevaPlaza.Activo;
    };
    
    /*----------------------------Detalles----------------*/
    //Se abre el panel para ver los detalles de la plaza
    $scope.MostarDetalles = function(plaza)
    {
        $scope.nuevaPlaza = plaza;
    };
    
    /*------------Agregar-edtitar plaza-------------*/
    //Se presiono el boton "Teminar" para indicar que se quiere editar o agregar una plaza
    //el método sabe que operacion realizar y si los datos son validos llamara al método correspondiente para concluir la operación
    $scope.TerminarPlaza = function()
    {
        debugger;
        $scope.mensajeError = [];
        if($scope.nuevaPlaza.Estado === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un estado.";
            $scope.clase.estado = "dropdownListModalError";
        }
        else
        {
            $scope.clase.estado = "dropdownListModal";
        }
        if($scope.nuevaPlaza.Municipio === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un municipio.";
            $scope.clase.municipio = "dropdownListModalError";
        }
        else
        {
            $scope.clase.municipio = "dropdownListModal";
        }
        if($scope.nuevaPlaza.Ciudad === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un ciudad.";
            $scope.clase.ciudad = "dropdownListModalError";
        }
        else
        {
            $scope.clase.ciudad = "dropdownListModal";
        }
        if($scope.nuevaPlaza.NombreTerritorio === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un territorio.";
            $scope.clase.territorio = "dropdownListModalError";
        }
        else
        {
            $scope.clase.territorio = "dropdownListModal";
        }
        if($scope.nuevaPlaza.NombreTipoUnidadNegocio === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de unidad de negocio.";
            $scope.clase.tipoUnidad = "dropdownListModalError";
        }
        else
        {
            $scope.clase.tipoUnidad = "dropdownListModal";
        }
        if($scope.nuevaPlaza.NombreUnidadNegocio === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una unidad de negocio.";
            $scope.clase.unidad = "dropdownListModalError";
        }
        else
        {
            $scope.clase.unidad = "dropdownListModal";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.plaza.length; k++)
        {
            if($scope.operacion == "Agregar" || $scope.nuevaPlaza.PlazaId !== $scope.plaza[k].PlazaId)
            {
                if($scope.plaza[k].Estado == $scope.nuevaPlaza.Estado && $scope.plaza[k].Municipio == $scope.nuevaPlaza.Municipio  && $scope.plaza[k].Ciudad == $scope.nuevaPlaza.Ciudad)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*La plaza " + $scope.nuevaPlaza.Estado + " " + $scope.nuevaPlaza.Municipio + " "+ $scope.nuevaPlaza.Ciudad + " ya existe.";
                    $scope.clase.estado = "dropdownListModalError";
                    $scope.clase.municipio = "dropdownListModalError";
                    $scope.clase.ciudad = "dropdownListModalError";
                    return;
                }
            }
        }
        
        $scope.clase.estado = "dropdownListModal";
        $scope.clase.municipio = "dropdownListModal";
        $scope.clase.ciudad = "dropdownListModal";
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarPlaza();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarPlaza();
        }
        
        
    };
    
    //Agregar plaza, llama al método para realizar el insert y verifica que se haya llevado a cabo
    $scope.AgregarPlaza = function()
    {
        AgregarPlaza($http, CONFIG, $q, $scope.nuevaPlaza).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetPlaza();
                $('#plazaModal').modal('toggle');
                $scope.mensaje = "La plaza se ha agregado.";
                $('#mensajePlaza').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajePlaza').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajePlaza').modal('toggle');
        });
    };
    
    //editar plaza, llama al método para realizar el update verifica que se haya llevado a cabo
    $scope.EditarPlaza = function()
    {
        EditarPlaza($http, CONFIG, $q, $scope.nuevaPlaza).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetPlaza();
                $('#plazaModal').modal('toggle');
                $scope.mensaje = "La plaza se ha editado.";
                $('#mensajePlaza').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajePlaza').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajePlaza').modal('toggle');
        });
    };
    
    //Se cancelo el agregar o editar la plaza y se cerro el panel
    $scope.CerrarPlaza = function()
    {
        $scope.mensajeError = []; 
        $scope.clase = {estado:"dropdownListModal", municipio:"dropdownListModal", ciudad:"dropdownListModal", territorio:"dropdownListModal", unidad:"dropdownListModal", tipoUnidad:"dropdownListModal"};
    };
    
    //Se abre el panel para agregar o editar una plaza
    $scope.AbrirPlazaModal = function(plaza, operacion)
    {
        
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevaPlaza = new Plaza();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaPlaza = SetPlaza(plaza);
            
            GetCodigoPostal($http, $q, CONFIG, $scope.nuevaPlaza.Estado).then(function(data)
            {
                $scope.codigoPostal = data;
            }).catch(function(error)
            {
                alert(error);
            }); 
        }
        
        if($scope.estado === null)
        {
            $scope.GetEstadosMexico();
        }
        
        if($scope.territorio === null)
        {
            $scope.GetTerritorio();
        }
        
        if($scope.unidadNegocio === null)
        {
            $scope.GetUnidadNegocio();
        }
        
        $('#plazaModal').modal('toggle');
    };
    
    
    /*-------- Modificacion de datos ---------------------------*/
    //Se selecciona o un estado y se guardo en la variable
    $scope.CambiarEstado = function(estado)
    {
        if( $scope.nuevaPlaza.Estado != estado)
        {
            $scope.nuevaPlaza.Estado = estado;

            GetCodigoPostal($http, $q, CONFIG, estado).then(function(data)
            {
                $scope.codigoPostal = data;
                $scope.nuevaPlaza.Municipio = "";
                $scope.nuevaPlaza.Ciudad = ""; 

            }).catch(function(error)
            {
                alert(error);
            }); 
        }
    };
    
    //Se selecciona o un municipio y se guardo en la variable
    $scope.CambiarMunicipio = function(municipio)
    {
        if( $scope.nuevaPlaza.Municipio != municipio)
        {
            $scope.nuevaPlaza.Municipio = municipio;

            for(var k=0; k<$scope.codigoPostal.length; k++)
            {
                if($scope.codigoPostal[k].Estado == $scope.nuevaPlaza.Estado &&  $scope.codigoPostal[k].Municipio == $scope.nuevaPlaza.Municipio)
                {
                    $scope.nuevaPlaza.Ciudad = $scope.codigoPostal[k].Ciudad;
                    break;
                }
            }
        }
    };
    
     //Se selecciona o un ciudad y se guardo en la variable
    $scope.CambiarCiudad = function(ciudad)
    {
        $scope.nuevaPlaza.Ciudad = ciudad;
    };
    
     //Se selecciona o un territorio y se guardo en la variable
    $scope.CambiarTerritorio = function(territorio)
    {
        $scope.nuevaPlaza.NombreTerritorio = territorio.Nombre;
        $scope.nuevaPlaza.TerritorioId = territorio.TerritorioId;
        $scope.nuevaPlaza.Margen = territorio.Margen;
    };
    
     //Se selecciona o un tipo de unidad de negocio y se guardo en la variable
    $scope.CambiarTipoUnidadNegocio = function(tipo)
    {
        $scope.nuevaPlaza.NombreTipoUnidadNegocio = tipo;
        
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if($scope.nuevaPlaza.NombreTipoUnidadNegocio == $scope.unidadNegocio[k].NombreTipoUnidadNegocio)
            {
                $scope.CambiarUnidadNegocio($scope.unidadNegocio[k].Nombre);
                break;
            }
        }
    };
    
     //Se selecciona o una unidad de negocio y se guardo en la variable
    $scope.CambiarUnidadNegocio = function(unidad)
    {
        $scope.nuevaPlaza.NombreUnidadNegocio = unidad;
        
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if($scope.nuevaPlaza.NombreUnidadNegocio == $scope.unidadNegocio[k].Nombre && $scope.nuevaPlaza.NombreTipoUnidadNegocio == $scope.unidadNegocio[k].NombreTipoUnidadNegocio)
            {
                $scope.nuevaPlaza.UnidadNegocioId = $scope.unidadNegocio[k].UnidadNegocioId;
                break;
            }
        }
    };
    /*--------inicializar------*/
    //obtiene los estado de México
    $scope.GetEstadosMexico = function()
    {
        GetEstadoMexico($http, $q, CONFIG) .then(function(data) 
        {
            if(data.length > 0)
            {
                $scope.estado = data;
            }
            else
            {
                alert(data);
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //Obtiene los territorios registrados
    $scope.GetTerritorio = function()              //Obtine los territorios dados de alta
    {
        GetTerritorio($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.territorio = data;
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //obtiene las unidades de negocio
    $scope.GetUnidadNegocio = function()              //Obtine los territorios dados de alta
    {
        GetUnidadNegocioSencilla($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.unidadNegocio = data;
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    //verifica que haya un usuario logeado
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
                    $scope.GetPlaza();
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
    
    //destecta cuando los datos del usuario cambian
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
                    $scope.GetPlaza();
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