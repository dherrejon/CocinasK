app.controller("CubiertaControlador", function($scope, $http, $q, CONFIG, datosUsuarioPerfil, md5, $rootScope, datosUsuario, $window, $location)
{
    $rootScope.clasePrincipal = "";  //si esta en el login muestra una cocina de fondo
    
    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false, editar: false, activar:false, agregar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConCubConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCubAgregar")
            {
                $scope.permisoUsuario.agregar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCubEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCubActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
        }
    };
    
    $scope.titulo = "Cubiertas";
    $scope.ordenarPor = "Material.Nombre";
    
    $scope.cubierta = [];
    $scope.ubicacion = [];
    $scope.grupo = [];
    $scope.grupoCubierta = [];
    $scope.tipoMaterial = [];
    $scope.material = [];
    $scope.cubiertaActualizar = null;
    $scope.nuevaCubierta = new Cubierta();
    
    $scope.mostrarDatoDetalle = "";
    $scope.buscar = "";
    $scope.buscarGrupo = "";
    $scope.mostrarFiltro = {tipoCubierta:true, tipoMaterial:false, activo: false};
    $scope.filtroCheckboxTipoCubierta = [];
    $scope.filtroCheckboxTipoMaterial = [];
    $scope.mensajeError = [];
    
    $scope.mostrarMuestrarioColor = {texto:"<<", mostrar:true};
    
    $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            tipoCubierta:[],
                            tipoMaterial: []
                     };
    
    $scope.claseCubierta  = {tipoCubierta:"dropdownListModal", tipoMaterial:"dropdownListModal", material:"dropdownListModal", margen:"entrada", desperdicio:"entrada", color:"botonOperacion", nuevoMaterial:"entrada"};
    $scope.nuevoMaterial = false;
    
    $scope.GetCubierta = function()
    {
        GetCubierta($http, $q, CONFIG).then(function(data)
        {
            $scope.cubierta = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*--------- catálogos auxiliares ---------*/
    $scope.GetTipoCubierta = function()
    {
        $scope.tipoCubierta = GetTipoCubierta();
    };
    
    $scope.GetUbicacionCubierta = function()      
    {
        GetUbicacionCubierta($http, $q, CONFIG).then(function(data)
        {
            $scope.ubicacion = data;

        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetGrupoColor = function()              
    {
        GetGrupo($http, $q, CONFIG, 1).then(function(data)
        {
            $scope.grupo = data;
            
            for(var k=0; k<data.length; k++)
            {
                $scope.GetColorGrupo(data[k].GrupoId, k);
            }
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetColorGrupo = function(id, index)
    {
        GetGrupoPorColor($http, $q, CONFIG, id).then(function(data)
        {
            $scope.grupo[index].Color = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetTipoMaterial = function()      
    {
        GetTipoMaterialParaCubierta($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoMaterial = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetMaterialCubierta = function()      
    {
        GetMaterialCubierta($http, $q, CONFIG).then(function(data)
        {
            $scope.material = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*--------- datos -------------------*/
    $scope.GetCubiertaUbicacion = function(id)
    {
        var q = $q.defer();
        GetCubiertaUbicacion($http, $q, CONFIG, id).then(function(data)
        {
            q.resolve(data);
        }).catch(function(error)
        {
            q.resolve("error"); 
            alert(error);
        });
        return q.promise;
    };
    
    $scope.GetGrupoColorCubierta = function(id)              
    {
        var q = $q.defer();
        GetGrupoColorCubierta($http, $q, CONFIG, id).then(function(data)
        {
            $scope.grupoCubierta = data;
            
            for(var k=0; k<data.length; k++)
            {
                $scope.grupoCubierta[k].claseCosto = "entrada";
                $scope.GetColorCubiertaGrupo(data[k].Grupo.GrupoId, k).then(function(respuesta)
                {
                    if(respuesta == (data.length-1))
                    {
                        q.resolve($scope.grupoCubierta); 
                    }
                });
            }
        
        }).catch(function(error)
        {
            q.resolve("error");
            alert(error);
        });
        return q.promise;
    };
    
    $scope.GetColorCubiertaGrupo = function(id, index)
    {
        var q = $q.defer();
        GetGrupoPorColor($http, $q, CONFIG, id).then(function(data)
        {
            $scope.grupoCubierta[index].Color = data;
            q.resolve(index);
            
        }).catch(function(error)
        {
            q.resolve("error"); 
            alert(error);
        });
        return q.promise;
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual se van a ordenar los tipos de material
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
    
    /*------------- filtros --------------*/
    $scope.MostrarFiltros = function(campo)
    {  
        if(campo == "tipoCubierta")
        {
            $scope.mostrarFiltro.tipoCubierta = !$scope.mostrarFiltro.tipoCubierta;
        }
        else if(campo == "tipoMaterial")
        {
            $scope.mostrarFiltro.tipoMaterial = !$scope.mostrarFiltro.tipoMaterial;
        }
        else if(campo == "activo")
        {
            $scope.mostrarFiltro.activo = !$scope.mostrarFiltro.activo;
        }
    };
    
    $scope.FiltrarCubierta = function(cubierta)
    {
        if($scope.filtro.activo.activo != $scope.filtro.activo.inactivo)
        {
            if($scope.filtro.activo.activo)
            {
                if(!cubierta.Material.Activo)
                {
                    return false;
                }
            }
            if($scope.filtro.activo.inactivo)
            {
                if(cubierta.Material.Activo)
                {
                    return false;
                }
            }   
        }
        
        var cumpleFiltro = false;
        if($scope.filtro.tipoCubierta.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.tipoCubierta.length; k++)
            {
                if(cubierta.TipoCubierta.TipoCubiertaId == $scope.filtro.tipoCubierta[k])
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
        
        if($scope.filtro.tipoMaterial.length === 0)
        {
            return true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.tipoMaterial.length; k++)
            {
                if(cubierta.Material.TipoMaterial.TipoMaterialId == $scope.filtro.tipoMaterial[k])
                {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    $scope.setFiltro = function(tipo, campo)
    {
        if(tipo == "tipoCubierta")
        {
            for(var k=0; k<$scope.filtro.tipoCubierta.length; k++)
            {
                if($scope.filtro.tipoCubierta[k] == campo)
                {
                    $scope.filtro.tipoCubierta.splice(k,1);
                    return;
                }
            }
            $scope.filtro.tipoCubierta.push(campo);
        }
        else if(tipo == "tipoMaterial")
        {
            for(var k=0; k<$scope.filtro.tipoMaterial.length; k++)
            {
                if($scope.filtro.tipoMaterial[k] == campo)
                {
                    $scope.filtro.tipoMaterial.splice(k,1);
                    return;
                }
            }
            $scope.filtro.tipoMaterial.push(campo);
        }
        
        return;
    };
    
    $scope.LimpiarFiltro = function()
    {
        $scope.mostrarFiltro = {tipoCubierta:true, tipoMaterial:false, activo: false};
        $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            tipoCubierta:[],
                            tipoMaterial: []
                     };
    
        for(var k=0; k<$scope.filtroCheckboxTipoCubierta.length; k++)
        {
            $scope.filtroCheckboxTipoCubierta[k] = false;
        }
        
        for(var k=0; k<$scope.filtroCheckboxTipoMaterial.length; k++)
        {
            $scope.filtroCheckboxTipoMaterial[k] = false;
        }
        
    };
    
    /*------------------Detalle-----------------*/
    $scope.MostarDetalles = function(cubierta)
    {
        $scope.mostrarDatoDetalle = "";
        $scope.GetDatosCubierta(cubierta).then(function(data)
        {
             $scope.cubiertaActualizar = data;
        });
    };
    
    $scope.GetDatosCubierta = function(cubierta)
    {
        var q = $q.defer();
        
        $scope.cubierta.Ubicacion = [];
        
        $scope.GetCubiertaUbicacion(cubierta.Material.MaterialId).then(function(data)
        {
            if(data != "error")
            {
                cubierta.Ubicacion = [];
                for(var k=0; k<$scope.ubicacion.length; k++)
                {
                    cubierta.Ubicacion[k] = new UbicacionCubierta();
                    cubierta.Ubicacion[k] = $scope.ubicacion[k];
                    cubierta.Ubicacion[k].Activo = false;
                    
                    for(var i=0; i<data.length; i++)
                    {
                        if(data[i].UbicacionCubiertaId == $scope.ubicacion[k].UbicacionCubiertaId)
                        {
                            cubierta.Ubicacion[k].Activo = true;
                            break;
                        }
                    }
                }
            }
        });
        
        $scope.GetGrupoColorCubierta(cubierta.Material.MaterialId).then(function(data)
        {
            if(data != "error")
            {
                cubierta.Color = data;
                q.resolve(cubierta);
            }
            else
            {
                return null;
            }
        });
        
        //console.log(cubierta);
        return q.promise;
    };
    
    $scope.GetClaseDetallesSeccion = function(seccion)
    {
        if($scope.mostrarDatoDetalle == seccion)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    $scope.MostrarDetalleEspecifico = function(detalle)
    {
        if($scope.mostrarDatoDetalle == detalle )
        {
            $scope.mostrarDatoDetalle = "";
            return;
        }
        
        $scope.mostrarDatoDetalle = detalle;
    };
    
    $scope.VerGrupoColor = function(grupo)
    {
        $scope.verGrupo = grupo;
    };
    
    $scope.VerImagenColor = function(color)
    {
        $scope.verColor = color;
    };
    
    /*-------------------Abrir modal para editar - agregar cubierta ---------------------*/
    $scope.ObtenerDatosCubiertaEditar = function(cubierta)
    {
        $scope.GetDatosCubierta(cubierta).then(function(data)
        {
            $scope.AbrirModuloCubierta("Editar", data);
        });
        
    };
    
    $scope.ValidarGrupo = function(grupos)
    {
        for(var i=0; i<$scope.grupo.length; i++)
        {
            $scope.grupo[i].show = true;
            for(var j=0; j<grupos.length; j++)
            {
                if(grupos[j].Grupo.GrupoId == $scope.grupo[i].GrupoId)
                {
                    $scope.grupo[i].show = false;
                    break;
                }
            }
        }
    };
    
    $scope.AbrirModuloCubierta = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevaCubierta = $scope.SetCubierta(objeto);
            $scope.ValidarGrupo(objeto.Color);
            
            $scope.mostrarMuestrarioColor = {texto:">>", mostrar:false};
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevaFabricacion =  new FabricacionCubierta();
            
            $scope.nuevaCubierta =  new Cubierta();
            $scope.nuevaCubierta.Color =  [];
            $scope.nuevaCubierta.Ubicacion =  [];
            for(var k=0; k<$scope.ubicacion.length; k++)
            {
                $scope.nuevaCubierta.Ubicacion[k] = $scope.ubicacion[k];
                $scope.nuevaCubierta.Ubicacion[k].Activo = true;
            }
            
            $scope.ValidarGrupo($scope.nuevaCubierta.Color);
            
            $scope.mostrarMuestrarioColor = {texto:"<<", mostrar:true};
        }
        
        $scope.operacion = operacion;
        $('#CubiertaModuloModal').modal('toggle');
    };
    
    $scope.SetCubierta = function(data)
    {
        var cubierta = new Cubierta();
        
        cubierta.DatosCubiertaId = data.DatosCubiertaId;
        cubierta.Desperdicio = data.Desperdicio;
        cubierta.Margen = data.Margen;
        
        cubierta.TipoCubierta.TipoCubiertaId = data.TipoCubierta.TipoCubiertaId;
        cubierta.TipoCubierta.Nombre = data.TipoCubierta.Nombre;
        
        cubierta.Material.MaterialId = data.Material.MaterialId;
        cubierta.Material.Nombre = data.Material.Nombre;
        cubierta.Material.Activo = data.Material.Activo;
        
        cubierta.Material.TipoMaterial.TipoMaterialId = data.Material.TipoMaterial.TipoMaterialId;
        cubierta.Material.TipoMaterial.Nombre = data.Material.TipoMaterial.Nombre;
        
        cubierta.Ubicacion = data.Ubicacion;
        cubierta.Color = data.Color;
        
        return cubierta;
    };
    
    $scope.CambiarTipoCubierta = function(tipo)
    {
        if(tipo.TipoCubiertaId != $scope.nuevaCubierta.TipoCubierta.TipoCubiertaId)
        {
            $scope.nuevaCubierta.TipoCubierta = tipo;
            $scope.nuevaCubierta.Material = new Material();
        }
    };
    
    $scope.CambiarTipoMaterial = function(tipo)
    {
        if(tipo.TipoMaterialId != $scope.nuevaCubierta.Material.TipoMaterial.TipoMaterialId)
        {
            $scope.nuevaCubierta.Material.TipoMaterial = tipo;
            $scope.nuevaCubierta.Material.MaterialId = "";
            $scope.nuevaCubierta.Material.Nombre = "";
        }
    };
    
    $scope.CambiarMaterial = function(material)
    {
        if(material == "NuevoMaterial")
        {
            $scope.nuevaCubierta.Material.MaterialId = "";
            $scope.nuevaCubierta.Material.Nombre = "";
            $scope.nuevaCubierta.Material.MaterialDe = "Cubierta";
            $scope.nuevaCubierta.Material.CostoUnidad = 0;
            $scope.nuevaCubierta.Material.Activo = "1";
            $scope.nuevoMaterial = true;
        }
        else
        {
            $scope.nuevoMaterial = false;
            $scope.nuevaCubierta.Material = SetMaterialCompleto(material);
        }
    };
    
    $scope.GetClaseMaterial = function()
    {
        if($scope.nuevoMaterial)
        {
            return "input-group-btn";
        }
        else
        {
            return "";
        }
    };
    
    $scope.CambiarMostrarColor = function()
    {
        $scope.mostrarMuestrarioColor.mostrar = !$scope.mostrarMuestrarioColor.mostrar;
        if($scope.mostrarMuestrarioColor.mostrar)
        {
            $scope.mostrarMuestrarioColor.texto = "<<";
        }
        else
        {
            $scope.mostrarMuestrarioColor.texto = ">>";
        }
    };
    
    $scope.AgregarGrupoColor = function(grupo)
    {
        var cubierta = new ColorPorMaterialCubierta();
        cubierta.claseCosto = "entrada";
        cubierta.Grupo = grupo;
        cubierta.Color = grupo.Color;
        
        $scope.nuevaCubierta.Color.push(cubierta);
        
        grupo.show = false;
    };
    
    $scope.QuitarGrupoColor = function(grupo)
    {
        for(var k=0; k<$scope.nuevaCubierta.Color.length; k++)
        {
            if(grupo.Grupo.GrupoId == $scope.nuevaCubierta.Color[k].Grupo.GrupoId)
            {
                $scope.nuevaCubierta.Color.splice(k,1);
                break;
            }
        }
        
        for(var k=0; k<$scope.grupo.length; k++)
        {
            if(grupo.Grupo.GrupoId == $scope.grupo[k].GrupoId)
            {
                $scope.grupo[k].show = true;
                break;
            }
        }
    };
    
    /*-----------------Terminar agregar-editar cubierta ------------*/
    $scope.TerminarCubierta = function(margenInvalido, desperdicioInvalido)
    {
        if(!$scope.ValidarDatos(margenInvalido, desperdicioInvalido))
        {
            return;
        }
        
        $scope.nuevaCubierta.NuevoMaterial = $scope.nuevoMaterial;
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarCubierta();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarCubierta();
        }
    };
    
    $scope.AgregarCubierta = function()    
    {
        AgregarCubierta($http, CONFIG, $q, $scope.nuevaCubierta).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#CubiertaModuloModal').modal('toggle');
                $scope.mensaje = "La cubierta se ha agregado.";
                $scope.GetCubierta();
                $scope.GetMaterialCubierta();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeCubierta').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeCubierta').modal('toggle');
        });
    };
    
    //edita el tipo de unidad seleccionado
    $scope.EditarCubierta = function()
    {
        EditarCubierta($http, CONFIG, $q, $scope.nuevaCubierta).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#CubiertaModuloModal').modal('toggle');
                $scope.mensaje = "La cubiertase se ha editado.";
                $scope.GetCubierta();
                $scope.GetMaterialCubierta();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeCubierta').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeCubierta').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(margenInvalido, desperdicioInvalido)
    {
        $scope.mensajeError = [];
        var cumple = true;
        
        if($scope.nuevaCubierta.TipoCubierta.Nombre.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de cubierta.";
            $scope.claseCubierta.tipoCubierta = "dropdownListModalError";
        }
        else
        {
            $scope.claseCubierta.tipoCubierta = "dropdownListModal";
        }
        
        if($scope.nuevaCubierta.Material.TipoMaterial.Nombre.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de material.";
            $scope.claseCubierta.tipoMaterial = "dropdownListModalError";
        }
        else
        {
            $scope.claseCubierta.tipoMaterial = "dropdownListModal";
        }
        
        if($scope.nuevaCubierta.Material.Nombre === undefined || $scope.nuevaCubierta.Material.Nombre === "" )
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Indica un material de cubierta.";
            $scope.claseCubierta.material = "dropdownListModalError";
            $scope.claseCubierta.nuevoMaterial = "entradaError";
        }
        else
        {
            $scope.claseCubierta.material = "dropdownListModal";
            $scope.claseCubierta.nuevoMaterial = "entrada";
        }
        
        if(margenInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El margen debe ser un número decima con máximo dos decimales.";
            $scope.claseCubierta.margen = "entradaError";
        }
        else
        {
            $scope.claseCubierta.margen = "entrada";
        }
        
        if(desperdicioInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El desperdicio debe ser un número decima con máximo dos decimales.";
            $scope.claseCubierta.desperdicio = "entradaError";
        }
        else
        {
            $scope.claseCubierta.desperdicio = "entrada";
        }
        
        if($scope.nuevaCubierta.TipoCubierta.TipoCubiertaId === "1")
        {
            cumple = false;
            for(var k=0; k<$scope.nuevaCubierta.Ubicacion.length; k++)
            {
                if($scope.nuevaCubierta.Ubicacion[k].Activo)
                {
                    cumple = true;
                    break;
                }
            }
            if(!cumple)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El material debe de estar disponible en al menos una ubicación.";
            }
        }
        
        if($scope.nuevaCubierta.Color.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona al menos un muestrario de colores.";
            $scope.claseCubierta.color = "botonOperacionError";
        }
        else
        {
            $scope.claseCubierta.color = "botonOperacion";
        }
        
        cumple = true;
        for(var k=0; k<$scope.nuevaCubierta.Color.length; k++)
        {
            
            if($scope.nuevaCubierta.Color[k].CostoUnidad === undefined || $scope.nuevaCubierta.Color[k].CostoUnidad === "")
            {
                $scope.nuevaCubierta.Color[k].claseCosto = "entradaError";
                cumple = false;
            }
            else
            {
                $scope.nuevaCubierta.Color[k].claseCosto = "entrada";
            }
        }
        
        if(!cumple)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El costo de la cubierta debe ser un númeroDecimal.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        if($scope.nuevoMaterial)
        {
            for(var k=0; k<$scope.material.length; k++)
            {
                if($scope.material[k].Nombre.toLowerCase() == $scope.nuevaCubierta.Material.Nombre.toLowerCase())
                {   
                    $scope.claseCubierta.nuevoMaterial = "entradaError";
                    $scope.mensajeError[$scope.mensajeError.length] = "*El material " + $scope.nuevaCubierta.Material.Nombre.toLowerCase() + " ya existe.";
                    return false;        
                }
            }
        
            for(var k=0; k<$scope.cubierta.length; k++)
            {
                if($scope.cubierta[k].Material.Nombre.toLowerCase() == $scope.nuevaCubierta.Material.Nombre.toLowerCase() && $scope.cubierta[k].Material.MaterialId != $scope.nuevaCubierta.Material.MaterialId)
                {   
                    $scope.claseCubierta.nuevoMaterial = "entradaError";
                    $scope.mensajeError[$scope.mensajeError.length] = "*El material " + $scope.nuevaCubierta.Material.Nombre.toLowerCase() + " ya existe.";
                    return false;        
                }
            }
        }
        
        return true;
    };
    
    $scope.CerrarCubiertaForma = function()
    {
        $scope.mensajeError = [];
        $scope.claseCubierta  = {tipoCubierta:"dropdownListModal", tipoMaterial:"dropdownListModal", material:"dropdownListModal", margen:"entrada", desperdicio:"entrada", color:"botonOperacion", nuevoMaterial:"entrada"};
        $scope.nuevoMaterial = false;
    };
    
    /*-------------- Activar y desactivar cubierta ------------------*/
    $scope.CambiarActivoModal = function()
    {
        $scope.cubiertaActualizar.Material.Activo = !$scope.cubiertaActualizar.Material.Activo;
        $scope.CambiarEstatusActivo($scope.cubiertaActualizar); 
    };
    
    $scope.CambiarEstatusActivo = function(cubierta) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.cubiertaActualizar = cubierta;
        
        if(cubierta.Material.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + cubierta.Material.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + cubierta.Material.Nombre + "?";
        }
        $('#modalActivarDesactivarCubierta').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarActivoCubierta = function()  
    {
        var datos = [];
        if($scope.cubiertaActualizar.Material.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.cubiertaActualizar.Material.MaterialId;

        ActivarDesactivarMaterial($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "La cubierta de cubierta se ha actualizado.";
            }
            else
            {
                $scope.cubiertaActualizar.Material.Activo = !$scope.cubiertaActualizar.Material.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeCubierta').modal('toggle');
        }).catch(function(error)
        {
            $scope.cubiertaActualizar.Material.Activo = !$scope.cubiertaActualizar.Material.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeCubierta').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoCubierta = function()           
    {
        $scope.cubiertaActualizar.Material.Activo = !$scope.cubiertaActualizar.Material.Activo;
    };
    
    /*-------- Inicializar -----------------*/
    $scope.InicializarCubierta = function()
    {
        $scope.GetCubierta();
        $scope.GetUbicacionCubierta();
        $scope.GetGrupoColor();
        $scope.GetTipoCubierta();
        $scope.GetTipoMaterial();
        $scope.GetMaterialCubierta();
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
                    $scope.InicializarCubierta();
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
                    $scope.InicializarCubierta();
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
