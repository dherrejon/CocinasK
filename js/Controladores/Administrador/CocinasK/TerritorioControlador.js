app.controller("TerritorioControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $location)
{   
    $rootScope.clasePrincipal = "";

    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false, editar: false, activar:false, agregar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmTerConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmTerAgregar")
            {
                $scope.permisoUsuario.agregar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmTerEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmTerActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
        }
    };
    
    $scope.ordenarPor = "Nombre";                         //Campo por el cual se van a ordenar los campos
    $scope.buscar = "";
    $scope.filtro = 
    [
        {activo: false, inactivo:false},
        {margenMaximo:0, margenMinimo:0}
    ];
    $scope.mostrarFiltro = {activo: true, margen: false};
    
    $scope.clase = {nombre:"entrada", margen:"entrada"};
    $scope.mensajeError = [];
    
    //obtiene los territorios registrdos
    $scope.GetTerritorio = function()          
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
    
    /*-------- Ordenar -----------*/
    //cambia el campo por el cual se van a ordenar los territorios
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
    
    /*-------- filtrar -------------*/
    //método que se especifica en el filter del ng-repear
    //Verica las opcines seleccionadas para filtrar si se cumple regresa "true", en caso contrario regresa "false"
    $scope.filtarTerrirotio = function(territorio)
    {
        if($scope.filtro[0].activo != $scope.filtro[0].inactivo)
        {
            if($scope.filtro[0].activo)
            {
                if(!territorio.Activo)
                {
                    return false;
                }
            }
            if($scope.filtro[0].inactivo)
            {
                if(territorio.Activo)
                {
                    return false;
                }
            }   
        }
        
        if(($scope.filtro[1].margenMaximo !==0 || $scope.filtro[1].margenMinimo !==0) && ($scope.filtro[1].margenMaximo >= $scope.filtro[1].margenMinimo))
        {
            if(territorio.Margen > $scope.filtro[1].margenMaximo || territorio.Margen < $scope.filtro[1].margenMinimo)
            {
                return false;
            }
        }
        
        return true;
    };
    
    //Muestra u oculta las opciones de filtración en cada campo
    $scope.MostrarFiltros =function(filtro)
    {
        if(filtro == "activo")
        {
            $scope.mostrarFiltro.activo = !$scope.mostrarFiltro.activo;
        }
        else if(filtro == "margen")
        {
            $scope.mostrarFiltro.margen = !$scope.mostrarFiltro.margen;
        }
    };
    
    //Limpia las opciones de filtro seleccionadas
    $scope.LimpiarFiltro = function()
    {
        $scope.filtro = 
        [
            {activo: false, inactivo:false},
            {margenMaximo:0, margenMinimo:0}
        ];
    };
    
    /*-------------------Detalles----------------------------*/
    //Abre el panel para mostrar los detalles del territorio
    //Llama el método correspondiente para realizar el SELECT y obetener la plazas relacionadas con el territorio
    $scope.MostarDetalles = function(territorio)
    {
        $scope.nuevoTerritorio = territorio;
        
        GetPlazaTerritorio($http, $q, CONFIG, territorio.TerritorioId).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.plaza = data[1].Plaza;
            }
            else
            {
                $scope.plaza = [];
                alert("Ha ocurrido un error al obtener las plazas del territorio.");            
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener las plazas del territorio." + error);
            $scope.plaza = [];
        });
        
    };
    
    /*------------Activar y desactivar ---------------------*/
    //Esta funcion se llama desde el modal de detalle del territorio para cambiar el estatus de activo
    //Manda a llamar un método para confirmar si se desea cambiar es estatus de activo
    $scope.CambiarActivo = function()   
    {
        $scope.nuevoTerritorio.Activo = !$scope.nuevoTerritorio.Activo;
        $scope.ConfirmarCambiarActivo($scope.nuevoTerritorio);
    };
    
    //Abre el panel para poder confirmar o cancelar el cambio del estatus de activo
    $scope.ConfirmarCambiarActivo = function(objeto)
    {
        $scope.nuevoTerritorio = objeto;
        if(objeto.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + objeto.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + objeto.Nombre +"?";
        }
        $('#modalActivoTerritorio').modal('toggle'); 
    };
    
    //Se cancelo la operacion del cambio del estatus de activo
    $scope.CancelarEstatusActivo = function()
    {
        $scope.nuevoTerritorio.Activo = !$scope.nuevoTerritorio.Activo;
    };
    
    //Se cambia el estaus de activo y se llama al método correspondiente para realizar el update
    $scope.ConfirmarActualizarTerritorio = function()
    {
        var datos = [];
        if($scope.nuevoTerritorio.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        datos[1] = $scope.nuevoTerritorio.TerritorioId;
        
        ActivarDesactivarTerritorio($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El territorio se ha actualizado correctamente";
                if($scope.nuevoTerritorio.Activo)
                {
                    $scope.nuevoTerritorio.ActivoN = 1;
                }
                else
                {
                    $scope.nuevoTerritorio.ActivoN = 0;
                }
            }
            else
            {
                $scope.nuevoTerritorio.Activo = !$scope.nuevoTerritorio.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
        }).catch(function(error)
        {
            $scope.nuevoTerritorio.Activo = !$scope.nuevoTerritorio.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
        });
        $('#mensajeTerritorio').modal('toggle');
    };
    
    /*------------------- agregar-editar territorio ------------------------ */
    //Se presionó el botón "TERMINAR" y se agregará o editará un territorio
    //Primeramente se validan los datos y depués se realiza la operación correspondiente
    $scope.TerminarTerritorio = function(nombreInvalido, margenInvalido)
    {
        $scope.mensajeError = [];
    
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.clase.nombre = "entradaError";
        }
        else
        {
            $scope.clase.nombre = "entrada";
        }
        if(margenInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El margen solo acepta núemros de hasta dos decimales";
            $scope.clase.margen = "entradaError";
        }
        else
        {
            $scope.clase.margen = "entrada";
        }
    
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.territorio.length; k++)
        {
            if($scope.territorio[k].Nombre.toLowerCase() == $scope.nuevoTerritorio.Nombre.toLowerCase()  && $scope.territorio[k].TerritorioId !== $scope.nuevoTerritorio.TerritorioId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El territorio " +  $scope.nuevoTerritorio.Nombre + " ya existe";
                $scope.clase.nombre = "entradaError";
                return;
            }
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarTerritorio();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarTerritorio();
        }
    };
    
    //Agregar territorio, llama al método para realizar el insert y verfica que se haya realizado
    $scope.AgregarTerritorio = function()
    {
        AgregarTerritorio($http, CONFIG, $q, $scope.nuevoTerritorio).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTerritorio();
                $('#territorioModal').modal('toggle');
                $scope.mensaje = "El territorio se ha agregado.";
                $('#mensajeTerritorio').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeTerritorio').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeTerritorio').modal('toggle');
        });
    };
    
    //editar territorio, llama el método para realizar el update y verifica que se haya realizado
    $scope.EditarTerritorio = function()
    {
        EditarTerritorio($http, CONFIG, $q, $scope.nuevoTerritorio).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTerritorio();
                $('#territorioModal').modal('toggle');
                $scope.mensaje = "El territorio se ha editado.";
                $('#mensajeTerritorio').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeTerritorio').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeTerritorio').modal('toggle');
        });
    };
    
    //Abre el panel para agregar-editar un territorio
    //si se va a agregar el se crea un territorio vacio
    //si se va a editar se obtienen los datos del territorio seleccionado
    $scope.AbrirTerritotioModal = function(territorio, operacion)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoTerritorio = new Territorio();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoTerritorio = SetTerritorio(territorio);
        }
        
        $('#territorioModal').modal('toggle');
    };
    
    //se cancela la operacion de agregar o editar territorio y se cierra dicho panel
    $scope.CerrarTerritotio = function()
    {
        $scope.mensajeError = [];
        $scope.clase = {nombre:"entrada", margen:"entrada"};
    };
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
    $scope.contador = 0;
    //Verifica que un usuario este logeado
    if($scope.usuarioLogeado !== null)
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
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
                    $scope.GetTerritorio();
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
    
    //se realiza cada ves que los datos del usuario cambia y verifica que este cuente con el permiso de acceder a este módulo
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
                    $scope.GetTerritorio();
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