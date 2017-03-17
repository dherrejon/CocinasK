app.controller("PromocionControlador", function($scope, $http, $q, CONFIG, $rootScope, $window, datosUsuario, $location)
{   
    $rootScope.clasePrincipal = "";
    $scope.permisoUsuario = {consultar:false, agregar:false, editar:false, activar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmProConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmProAgregar")
            {
                $scope.permisoUsuario.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmProEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmProActivar")
            {
                $scope.permisoUsuario.activar= true;
            }
        }
    };
    
    $scope.promocion = [];
    $scope.tipoPromocion = [];
    $scope.tipoVenta = [];
    $scope.unidadNegocio = [];
    $scope.ordenarPor = "TipoPromocion.Nombre";
    $scope.buscar = "";
    $scope.buscarUnidad = "";
    $scope.nuevaPromocion = null;
    $scope.promocionActualizar = null;
    $scope.detalle  = "";
    $scope.mensajeError = [];
    
    $scope.mostrarFiltro = {tipoPromocion:true, tipoVenta:false, unidadNegocio:false, activo: false};
    $scope.filtroCheckboxTipoPromocion = [];
    $scope.filtroCheckboxTipoVenta = [];
    $scope.filtroCheckboxUnidadNegocio = [];
    
    $scope.mostrarUnidad = {texto:">>", mostrar:false};
    
    $scope.clase = {tipoPromocion:"dropdownListModal", tipoVenta:"dropdownListModal", minimo:"entrada", maximo:"entrada", fecha:"entrada", numeroPagos:"entrada", vigencia:"entrada", unidad:"botonOperacion"};
    
    $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            tipoPromocion:[],
                            tipoVenta: [],
                            unidadNegocio: []
                     };
    
    $scope.GetPromocion = function()
    {
        GetPromocion($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.promocion = data;
                for(var k=0; k<data.length; k++)
                {
                    $scope.GetUnidadNegocioPorPromocion( $scope.promocion[k]);
                }
            }
            else
            {
                $scope.promocion = [];
            }
        }).catch(function(error)
        {
            $scope.promocion = [];
            alert(error);
        });
    };
    
    $scope.GetUnidadNegocioPorPromocion = function(dato)
    {
        GetUnidadNegocionPorPromocion($http, $q, CONFIG, dato.PromocionId).then(function(data)
        {   
            dato.UnidadNegocio = data;
        }).catch(function(error)
        {
            return [];
            alert(error);
        });
    };
    
    $scope.GetTipoPromocion = function()
    {
        $scope.tipoPromocion = GetTipoPromocion();
    };
    
    $scope.GetTipoVenta = function()
    {
        $scope.tipoVenta = GetTipoVenta();
    };
    
    $scope.GetUnidadNegocio = function()
    {
        GetUnidadNegocioSencilla($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.unidadNegocio = data;
            }
            else
            {
                $scope.unidadNegocio = [];
            }
        }).catch(function(error)
        {
            $scope.unidadNegocio = [];
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
    
    //------------------------Filtrar-----------------------------------
    $scope.MostrarFiltros = function(filtro)
    {
        if(filtro == "tipoPromocion")
        {
            $scope.mostrarFiltro.tipoPromocion = !$scope.mostrarFiltro.tipoPromocion;
        }
        else if(filtro == "tipoVenta")
        {
            $scope.mostrarFiltro.tipoVenta = !$scope.mostrarFiltro.tipoVenta;
        }
        else if(filtro == "unidadNegocio")
        {
            $scope.mostrarFiltro.unidadNegocio = !$scope.mostrarFiltro.unidadNegocio;
        }
        else if(filtro == "activo")
        {
            $scope.mostrarFiltro.activo = !$scope.mostrarFiltro.activo;
        }
    };
    
    $scope.FiltrarPromocion = function(promocion)
    {
        if($scope.filtro.activo.activo != $scope.filtro.activo.inactivo)
        {
            if($scope.filtro.activo.activo)
            {
                if(!promocion.Activo)
                {
                    return false;
                }
            }
            if($scope.filtro.activo.inactivo)
            {
                if(promocion.Activo)
                {
                    return false;
                }
            }   
        }
        
        var cumpleFiltro = false;
        if($scope.filtro.tipoPromocion.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.tipoPromocion.length; k++)
            {
                if(promocion.TipoPromocion.TipoPromocionId == $scope.filtro.tipoPromocion[k])
                {
                    cumpleFiltro = true;
                }
            }
        }
        
        if(!cumpleFiltro)
        {
            return false;
        }
        
        cumpleFiltro = false;
        if($scope.filtro.unidadNegocio.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.unidadNegocio.length; k++)
            {
                for(var i=0; i<promocion.UnidadNegocio.length; i++)
                {
                   if(promocion.UnidadNegocio[i].UnidadNegocioId == $scope.filtro.unidadNegocio[k])
                    {
                        cumpleFiltro = true;
                    } 
                }
            }
        }
        
        if(!cumpleFiltro)
        {
            return false;
        }
        
        cumpleFiltro = false;
        
        if($scope.filtro.tipoVenta.length === 0)
        {
            return true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.tipoVenta.length; k++)
            {
                if(promocion.TipoVenta.TipoVentaId == $scope.filtro.tipoVenta[k])
                {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    $scope.setFilterTipoPromocion = function(campo)
    {
        for(var k=0; k<$scope.filtro.tipoPromocion.length; k++)
        {
            if($scope.filtro.tipoPromocion[k] == campo)
            {
                $scope.filtro.tipoPromocion.splice(k,1);
                return;
            }
        }
        $scope.filtro.tipoPromocion.push(campo);
    };
    
    $scope.setFilterTipoVenta= function(campo)
    {
        for(var k=0; k<$scope.filtro.tipoVenta.length; k++)
        {
            if($scope.filtro.tipoVenta[k] == campo)
            {
                $scope.filtro.tipoVenta.splice(k,1);
                return;
            }
        }
        $scope.filtro.tipoVenta.push(campo);
    };
    
    $scope.setFilterUnidadNeogocio= function(campo)
    {
        for(var k=0; k<$scope.filtro.unidadNegocio.length; k++)
        {
            if($scope.filtro.unidadNegocio[k] == campo)
            {
                $scope.filtro.unidadNegocio.splice(k,1);
                return;
            }
        }
        $scope.filtro.unidadNegocio.push(campo);
    };
    
    $scope.LimpiarFiltro = function()
    {
        $scope.mostrarFiltro = {tipoPromocion:true, tipoVenta:false, unidadNegocio:false, activo: false};
    
        $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            tipoPromocion:[],
                            tipoVenta: [],
                            unidadNegocio: []
                     };
        
        for(var k=0; k<$scope.filtroCheckboxTipoVenta.length; k++)
        {
            $scope.filtroCheckboxTipoVenta[k] = false;
        }
        
        for(var k=0; k<$scope.filtroCheckboxTipoPromocion.length; k++)
        {
            $scope.filtroCheckboxTipoPromocion[k] = false;
        }
        
        for(var k=0; k<$scope.filtroCheckboxUnidadNegocio.length; k++)
        {
            $scope.filtroCheckboxUnidadNegocio[k] = false;
        }
    };
    
    //---------------Detalles--------------------------
    $scope.DetallePromocion = function(promocion)
    {
        $scope.promocionActualizar = promocion;
        //$scope.GetUnidadNegocioPorPromocion($scope.promocionActualizar);
    };
    
    $scope.MostrarDetalle = function(detalle)
    {
        if($scope.detalle == detalle)
        {
            $scope.detalle = "";
        }
        else
        {
            $scope.detalle = detalle;   
        }
    };
    
    $scope.GetClaseDetallesSeccion = function(seccion)
    {
        if($scope.detalle == seccion)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    /*--------------------Abrir Agregar-Editar Promocion---------------------*/
    $scope.AbrirPromocionModal = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevaPromocion = new Promocion();
            $scope.nuevaPromocion.UnidadNegocio = [];
            $scope.ValidarUnidades($scope.nuevaPromocion.UnidadNegocio);
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaPromocion = $scope.SetPromocion(objeto);
            $scope.nuevaPromocion.UnidadNegocio = objeto.UnidadNegocio;
            $scope.ValidarUnidades($scope.nuevaPromocion.UnidadNegocio);
            
            document.getElementById("fechaLimite").value= objeto.FechaLimite;
        }

        $('#promocionModal').modal('toggle');
    };
    
    $scope.ValidarUnidades = function(unidades)
    {
        for(var i=0; i<$scope.unidadNegocio.length; i++)
        {
            $scope.unidadNegocio[i].show = true;
            for(var j=0; j<unidades.length; j++)
            {
                if($scope.unidadNegocio[i].UnidadNegocioId == unidades[j].UnidadNegocioId)
                {
                    $scope.unidadNegocio[i].show = false;
                    break;
                }
            }
        }
    };
    
    $scope.SetPromocion = function(data)
    {
        var promo = new Promocion();
        
        promo.PromocionId = data.PromocionId;
        promo.Descripcion = data.Descripcion;
        promo.DescuentoMaximo = data.DescuentoMaximo;
        promo.DescuentoMinimo = data.DescuentoMinimo;
        promo.NumeroPagos = data.NumeroPagos;
        promo.Vigencia = data.Vigencia;
        promo.FechaLimite = data.FechaLimite;
        promo.Activo = data.Activo;
        
        promo.TipoVenta.TipoVentaId = data.TipoVenta.TipoVentaId;
        promo.TipoVenta.Nombre = data.TipoVenta.Nombre;
        
        promo.TipoPromocion.TipoPromocionId = data.TipoPromocion.TipoPromocionId;
        promo.TipoPromocion.Nombre = data.TipoPromocion.Nombre;
        
        return promo;
    };
    
    $scope.CambiarTipoPromocion = function(tipo)
    {
        $scope.nuevaPromocion.TipoPromocion = tipo;    
    };
    
    $scope.CambiarTipoVenta = function(tipo)
    {
        $scope.nuevaPromocion.TipoVenta = tipo;    
    };
    
    $scope.CambiarFecha = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.nuevaPromocion.FechaLimite = element.value;
        });
    };
    
    $('#fechaLimite').bootstrapMaterialDatePicker(
    {
        weekStart : 0, 
        time: false,
        format: "DD/MM/YYYY",
        minDate : new Date(),
        disabledDays: [7]
    });
    
    $scope.CambiarMotrarUnidad = function()
    {
        $scope.mostrarUnidad.mostrar = !$scope.mostrarUnidad.mostrar;
        
        if($scope.mostrarUnidad.mostrar)
        {
            $scope.mostrarUnidad.texto = "<<";
        }
        else
        {
            $scope.mostrarUnidad.texto = ">>";
        }
    };
    
    $scope.AgregarUnidad = function(unidad)
    {
        unidad.show = false;
        $scope.nuevaPromocion.UnidadNegocio.push(unidad);
    };
    
    $scope.QuitarUnidad = function(unidad)
    {
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if($scope.unidadNegocio[k].UnidadNegocioId == unidad.UnidadNegocioId)
            {
                $scope.unidadNegocio[k].show = true;
                break;
            }
        }
        
        for(var k=0; k<$scope.nuevaPromocion.UnidadNegocio.length; k++)
        {
            if($scope.nuevaPromocion.UnidadNegocio[k].UnidadNegocioId == unidad.UnidadNegocioId)
            {
                $scope.nuevaPromocion.UnidadNegocio.splice(k,1);
            }
        }
    };
    
    /*------------terminar promocion-------------------------*/
    $scope.TerminarPromocion  = function(descripcionInvalida)
    {
        if(!$scope.ValidarDatos(descripcionInvalida))
        {
            return;
        }
        else
        {
            $scope.AjustarPromocion();
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarPromocion();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarPromocion();
            }
        }
    };
    
    $scope.AjustarPromocion = function()
    {
        if($scope.nuevaPromocion.TipoPromocion.TipoPromocionId == '1')
        {
            $scope.nuevaPromocion.NumeroPagos = 0;
            $scope.nuevaPromocion.Vigencia = null;
        }
        else if($scope.nuevaPromocion.TipoPromocion.TipoPromocionId == '2')
        {
            $scope.nuevaPromocion.DescuentoMinimo = 0;
            $scope.nuevaPromocion.DescuentoMaximo = 0;
            $scope.nuevaPromocion.Vigencia = null;
            $scope.nuevaPromocion.FechaLimite = null;
        }
        else if($scope.nuevaPromocion.TipoPromocion.TipoPromocionId == '3')
        {
            $scope.nuevaPromocion.NumeroPagos = 0;
            $scope.nuevaPromocion.FechaLimite = null;
        }
    };
    
    $scope.AgregarPromocion = function()    
    {
        AgregarPromocion($http, CONFIG, $q, $scope.nuevaPromocion).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#promocionModal').modal('toggle');
                $scope.mensaje = "La promoción se ha agregado.";
                $scope.GetPromocion();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajePromocion').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePromocion').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarPromocion = function()
    {
        EditarPromocion($http, CONFIG, $q, $scope.nuevaPromocion).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#promocionModal').modal('toggle');
                $scope.mensaje = "La promoción se ha editado.";
                $scope.GetPromocion();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajePromocion').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePromocion').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(descripcionInvalida)
    {
        $scope.mensajeError = [];
        
        if($scope.nuevaPromocion.TipoPromocion.Nombre.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de promoción.";
            $scope.clase.tipoPromocion = "dropdownListModalError";
            return false;
        }
        else
        {
            $scope.clase.tipoPromocion = "dropdownListModal";
        }
        
        if($scope.nuevaPromocion.TipoVenta.Nombre.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de venta.";
            $scope.clase.tipoVenta = "dropdownListModalError";
        }
        else
        {
            $scope.clase.tipoVenta = "dropdownListModal";
        }
        
        if($scope.nuevaPromocion.TipoPromocion.TipoPromocionId != "2")
        {
            if($scope.nuevaPromocion.DescuentoMinimo === undefined || $scope.nuevaPromocion.DescuentoMinimo.length === 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El decuento mínimo debe ser un número entero.";
                $scope.clase.minimo = "entradaError";
            }
            else
            {
                $scope.clase.minimo = "entrada";
            }
            
            if($scope.nuevaPromocion.DescuentoMaximo === undefined || $scope.nuevaPromocion.DescuentoMaximo.length === 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El decuento máximo debe ser un número entero.";
                $scope.clase.maximo = "entradaError";
            }
            else
            {
                $scope.clase.maximo = "entrada";
                if(parseInt($scope.nuevaPromocion.DescuentoMaximo) < parseInt($scope.nuevaPromocion.DescuentoMinimo))
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El decuento máximo debe ser mayor o igual al descuento mínimo.";
                    $scope.clase.maximo = "entradaError";
                    $scope.clase.minimo = "entradaError";
                }
            }
        }
        else if($scope.nuevaPromocion.TipoPromocion.TipoPromocionId == "2")
        {
            if($scope.nuevaPromocion.NumeroPagos === undefined || $scope.nuevaPromocion.NumeroPagos.length === 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El número de pago debe ser entero.";
                $scope.clase.numeroPagos = "entradaError";
            }
            else
            {
                $scope.clase.numeroPagos = "entrada";
            }
        }
        
        if($scope.nuevaPromocion.TipoPromocion.TipoPromocionId == "1")
        {
            if($scope.nuevaPromocion.FechaLimite.length === 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una fecha límite.";
                $scope.clase.fecha = "entradaError";
            }
        }
        else
        {
            $scope.clase.fecha = "entrada";
        }
        
        if(($scope.nuevaPromocion.Vigencia === undefined  || $scope.nuevaPromocion.Vigencia.length === 0) && $scope.nuevaPromocion.TipoPromocion.TipoPromocionId == "3")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*La vigencia debe ser un número entrero.";
            $scope.clase.vigencia = "entradaError";
        }
        else
        {
            $scope.clase.vigencia = "entradaError";
        }
        
        if($scope.nuevaPromocion.UnidadNegocio.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona al menos una unidad de negocio.";
            $scope.clase.unidad = "botonOperacionError";
        }
        else
        {
            $scope.clase.unidad = "botonOperacion";
        }
        
        if(descripcionInvalida)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe una descripción de la promoción.";
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
    
    $scope.CerrarPromocion = function()
    {
        document.getElementById("fechaLimite").value= "";
        $scope.mensajeError = [];
        $scope.clase = {tipoPromocion:"dropdownListModal", tipoVenta:"dropdownListModal", minimo:"entrada", maximo:"entrada", fecha:"entrada", numeroPagos:"entrada", vigencia:"entrada", unidad:"botonOperacion"};
    };
        
    /*---------------------Inicializar Promocion ----------------------*/
    $scope.InicializarPromocion = function()
    {
        $scope.GetPromocion();
        $scope.GetTipoPromocion();
        $scope.GetTipoVenta();
        $scope.GetUnidadNegocio();
    };
    
    /*--------------------Activar-desactivar plaza---------------------------------------*/
    //Activa-Descativa una plaza desde el modal de detalle
    //copia los datos de la plaza en una nueva varible y llama a la función para confirmar su cambio de estado de activo
    $scope.CambiarActivoModal = function()   // desde el modal de detalle
    {
        $scope.promocionActualizar.Activo = !$scope.promocionActualizar.Activo;
        $scope.CambiarEstadoActivo($scope.promocionActualizar);
    };
    
    //Se abre un panel para confirmar que se quiere cambiar el estado de activo 
    $scope.CambiarEstadoActivo = function(promocion)
    {
        $scope.promocionActualizar = promocion;
        if(promocion.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR esta promoción?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR esta promoción?";
        }
        $('#modalActivoPromocion').modal('toggle'); 
    };
    
    //Se confirmo el cambio de estado de activo y se llama al metodo correspondiente para realizar el update
    $scope.ConfirmarActualizarPromocion = function()
    {
        var datos = [];
        if($scope.promocionActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        datos[1] = $scope.promocionActualizar.PromocionId;
        
        ActivarDesactivarPromocion($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "La promocion se ha actualizado correctamente.";
            }
            else
            {
                $scope.promocionActualizar.Activo = !$scope.promocionActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajePromocion').modal('toggle');
        }).catch(function(error)
        {
            $scope.promocionActualizar.Activo = !$scope.promocionActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
            $('#mensajePromocion').modal('toggle');
        });
        
    };
    
    //se cancela el cambio del estatus de activo
    $scope.CancelarCambioActivo = function()
    {
        $scope.promocionActualizar.Activo = !$scope.promocionActualizar.Activo;
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
                    $scope.InicializarPromocion();
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
    
    
    //Se manda a llamar cada ves que los datos del usuario cambian
    //verifica que el usuario este logeado y que tenga los permisos correspondientes
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
                    $scope.InicializarPromocion();
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
    
    $scope.AbrirCalendario = function()
    {
        $('#datepicker').datepicker('show');
    };
    
    
});
