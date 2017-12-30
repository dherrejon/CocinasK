app.controller("AccesorioModuloControlador", function($scope, $http, $q, CONFIG, datosUsuarioPerfil, md5, $rootScope, datosUsuario, $window, $location)
{
    $rootScope.clasePrincipal = "";  //si esta en el login muestra una cocina de fondo
    
    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false, editar: false, activar:false, agregar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "CatAccConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "CatAccAgregar")
            {
                $scope.permisoUsuario.agregar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "CatAccEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "CatAccActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
        }
    };
    
    $scope.titulo = "Accesorios";
    $scope.accesorio = [];
    $scope.buscar = "";
    $scope.ordenarPor = "Nombre";
    $scope.mostrarDetalles = "";
    $scope.mensajeError = [];
    
    $scope.accesorioActualizar = null;
    $scope.nuevoAccesorio = null;
    
    $scope.combinacionAccesorio = [];
    $scope.claseAccesorio = [];
    $scope.tipoAccesorio = [];
    $scope.muestrario = [];
    $scope.combinacion = [];
    $scope.material = [];
    $scope.gruesoMaterial = [];
    $scope.tipoMaterial = [];
    
    $scope.imagen = [];
    $scope.imagenSeleccionada = false;
    $scope.numeroPaso = 1;
    $scope.clase = {tipoAccesorio:"dropdownListModal", muestrario:"dropdownListModal", nombre:"entrada", costo:"entrada", consumo:"entrada"};
    
    $scope.terminar = false;
    
    $scope.mostrarFiltro = {tipoAccesorio:true, claseAccesorio:false, muestario:false, activo: false, contable: false, obligatorio: false};
    $scope.filtroCheckboxMuestrario = [];
    $scope.filtroCheckboxTipoAccesorio = [];
    $scope.filtroCheckboxClaseAccesorio = [];
    
    $scope.filtro = {
                        activo:{activo:false, inactivo: false},
                        contable:{contable:false, noContable: false},
                        obligatorio:{obligatorio:false, noObligatorio: false},
                        tipoAccesorio:[],
                        claseAccesorio:[],
                        muestrario: []
                     };
    
    $scope.GetAccesorio = function()      
    {
        GetAccesorio($http, $q, CONFIG).then(function(data)
        {
            $scope.accesorio = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*--------- Catálogos auxiliares --------*/
    $scope.GetClaseAccesorio = function()
    {
        $scope.claseAccesorio = GetClaseAccesorio();
    };
    
    $scope.GetTipoAccesorio = function()              
    {
        GetTipoAccesorio($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoAccesorio = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetMuestrarioAccesorio = function()      
    {
        GetMuestrario($http, $q, CONFIG, 2).then(function(data)
        {
            $scope.muestrario = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetCombinacionMaterial = function()
    {
        GetCombinacionMaterial($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.combinacion = data;
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*---------- CATALOGO DE MATERIALES-----------------------*/
     $scope.GetMaterial = function()      
    {
        GetMaterial($http, $q, CONFIG).then(function(data)
        {
            $scope.material = data;
            if($scope.gruesoMaterial !== null)
            {
                $scope.SetGrueso();
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetGruesoMaterial = function()      
    {
        
        GetGruesoMaterial($http, $q, CONFIG).then(function(data)
        {
            $scope.gruesoMaterial = data;
            if($scope.material !== null)
            {
                $scope.SetGrueso();
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetGrueso = function()
    {
        for(var i=0; i<$scope.material.length; i++)
        {
            $scope.material[i].grueso = [];
        }

        for(var k=0; k<$scope.gruesoMaterial.length; k++)
        {
            for(var i=0; i<$scope.material.length; i++)
            {
                if($scope.material[i].MaterialId == $scope.gruesoMaterial[k].MaterialId)
                {
                    $scope.material[i].grueso[$scope.material[i].grueso.length] = SetGruesoMaterial($scope.gruesoMaterial[k]);
                    break;
                }
            }
        }
    };
    
    $scope.GetTipoMaterial = function()      
    {
        GetTipoMaterialParaModulos($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoMaterial = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*------- otros datos ----------*/
    
    $scope.GetCombinacionPorAccesorio = function(accesorioId, operacion)          
    {
        GetCombinacionPorAccesorio($http, $q, CONFIG, accesorioId, "accesorio").then(function(data)
        {
            if(data.length > 0)
            {
                $scope.combinacionAccesorio = data;
                if(operacion == "editar")
                {
                    for(var k=0; k<data.length; k++)
                    {
                        for(var i=0; i<$scope.material.length; i++)
                        {
                            if($scope.material[i].MaterialId == $scope.combinacionAccesorio[k].Material.MaterialId)
                            {
                                $scope.combinacionAccesorio[k].Material.Grueso = $scope.material[i].grueso;
                                break;
                            }
                        }

                        $scope.combinacionAccesorio[k].claseTipoMaterial = "dropdownListModal";
                        $scope.combinacionAccesorio[k].claseMaterial = "dropdownListModal";
                        $scope.combinacionAccesorio[k].claseGrueso = "dropdownListModal";
                    }
                }
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*-------- Ordenar -----------*/
    //cambia el campo por el cual se van a ordenar los modulos
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
    
    /*-----------------------------------Filtrar---------------------*/
    $scope.FiltrarAccesorio = function(accesorio)
    {
        if($scope.filtro.activo.activo != $scope.filtro.activo.inactivo)
        {
            if($scope.filtro.activo.activo)
            {
                if(!accesorio.Activo)
                {
                    return false;
                }
            }
            if($scope.filtro.activo.inactivo)
            {
                if(accesorio.Activo)
                {
                    return false;
                }
            }   
        }
        
        /*if($scope.filtro.contable.contable != $scope.filtro.contable.noContable)
        {
            if($scope.filtro.contable.contable)
            {
                if(!accesorio.Contable)
                {
                    return false;
                }
            }
            if($scope.filtro.contable.noContable)
            {
                if(accesorio.Contable)
                {
                    return false;
                }
            }   
        }
        
        if($scope.filtro.obligatorio.obligatorio != $scope.filtro.obligatorio.noObligatorio)
        {
            if($scope.filtro.obligatorio.obligatorio)
            {
                if(!accesorio.Obligatorio)
                {
                    return false;
                }
            }
            if($scope.filtro.obligatorio.noObligatorio)
            {
                if(accesorio.Obligatorio)
                {
                    return false;
                }
            }   
        }*/
        
        var cumpleFiltro = false;
        
        if($scope.filtro.tipoAccesorio.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.tipoAccesorio.length; k++)
            {
                if(accesorio.TipoAccesorio.Nombre == $scope.filtro.tipoAccesorio[k])
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
        
        if($scope.filtro.claseAccesorio.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.claseAccesorio.length; k++)
            {
                if(accesorio.TipoAccesorio.ClaseAccesorio.Nombre == $scope.filtro.claseAccesorio[k])
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
        
        if($scope.filtro.muestrario.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.muestrario.length; k++)
            {
                if(accesorio.Muestrario.Nombre == $scope.filtro.muestrario[k])
                {
                    cumpleFiltro = true;
                }
            }
        }
        
        if(!cumpleFiltro)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.setFiltroTipo = function(campo)
    {
        for(var k=0; k<$scope.filtro.tipoAccesorio.length; k++)
        {
            if($scope.filtro.tipoAccesorio[k] == campo)
            {
                $scope.filtro.tipoAccesorio.splice(k,1);
                return;
            }
        }
        $scope.filtro.tipoAccesorio.push(campo);
        return;
    };
    
    $scope.setFiltroClase = function(campo)
    {
        for(var k=0; k<$scope.filtro.claseAccesorio.length; k++)
        {
            if($scope.filtro.claseAccesorio[k] == campo)
            {
                $scope.filtro.claseAccesorio.splice(k,1);
                return;
            }
        }
        $scope.filtro.claseAccesorio.push(campo);
        return;
    };
    
    $scope.setFiltroMuestrario = function(campo)
    {
        for(var k=0; k<$scope.filtro.muestrario.length; k++)
        {
            if($scope.filtro.muestrario[k] == campo)
            {
                $scope.filtro.muestrario.splice(k,1);
                return;
            }
        }
        $scope.filtro.muestrario.push(campo);
        return;
    };
    
    $scope.LimpiarFiltro = function()
    {
        $scope.mostrarFiltro = {tipoAccesorio:true, claseAccesorio:false, muestario:false, activo: false, contable: false, obligatorio: false};
        $scope.filtroCheckboxMuestrario = [];
        $scope.filtroCheckboxTipoAccesorio = [];
        $scope.filtroCheckboxClaseAccesorio = [];

        $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            contable:{contable:false, noContable: false},
                            obligatorio:{obligatorio:false, noObligatorio: false},
                            tipoAccesorio:[],
                            claseAccesorio:[],
                            muestrario: []
                         };
        
        for(var k=0; k<$scope.filtroCheckboxMuestrario.length; k++)
        {
            $scope.filtroCheckboxMuestrario[k] = false;
        }
        
        for(var k=0; k<$scope.filtroCheckboxTipoAccesorio.length; k++)
        {
            $scope.filtroCheckboxTipoAccesorio[k] = false;
        }
        
        for(var k=0; k<$scope.filtroCheckboxClaseAccesorio.length; k++)
        {
            $scope.filtroCheckboxClaseAccesorio[k] = false;
        }
    };
    
    $scope.MostrarFiltros = function(campo)
    {  
        if(campo == "tipoAccesorio")
        {
            $scope.mostrarFiltro.tipoAccesorio = !$scope.mostrarFiltro.tipoAccesorio;
        }
        else if(campo == "claseAccesorio")
        {
            $scope.mostrarFiltro.claseAccesorio = !$scope.mostrarFiltro.claseAccesorio;
        }
        else if(campo == "muestrario")
        {
            $scope.mostrarFiltro.muestrario = !$scope.mostrarFiltro.muestrario;
        }
        else if(campo == "activo")
        {
            $scope.mostrarFiltro.activo = !$scope.mostrarFiltro.activo;
        }
        /*else if(campo == "contable")
        {
            $scope.mostrarFiltro.contable = !$scope.mostrarFiltro.contable;
        }
        else if(campo == "obligatorio")
        {
            $scope.mostrarFiltro.obligatorio = !$scope.mostrarFiltro.obligatorio;
        }*/
    };
    
    /*--------------------------- Detalles -------------------*/
    $scope.MostarDetalles = function(accesorio)
    {
        $scope.nuevoAccesorio = accesorio;
        
        if(accesorio.TipoAccesorio.ClaseAccesorio.ClaseAccesorioId == "2")
        {
            $scope.GetCombinacionPorAccesorio(accesorio.AccesorioId,'detalle');
        }
    };
    
    $scope.MostrarPanelDetalles = function(detalle)
    {
        if(detalle == $scope.mostrarDetalles)
        {
            $scope.mostrarDetalles = "";
            return;
        }
        
        $scope.mostrarDetalles = detalle;
    };
    
    $scope.GetClaseDetallesSeccion = function(seccion)
    {
        if($scope.mostrarDetalles == seccion)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    /*----------- Abrir modal para editar-agregar----------------------*/
    $scope.AbrirAccesorioModal = function(operacion, objeto)
    {
        if(operacion == "Editar")
        {
            $scope.nuevoAccesorio = $scope.SetAccesorio(objeto);
            if(objeto.TipoAccesorio.ClaseAccesorio.ClaseAccesorioId == "2")
            {
                $scope.GetCombinacionPorAccesorio($scope.nuevoAccesorio.AccesorioId, "editar");
            }
            else
            {
                $scope.combinacionAccesorio = [];
            }
        }
        else if(operacion == "Agregar")
        {
            $scope.nuevoAccesorio =  new Accesorio();
            $scope.SetCombinacion();
        }
        
        $scope.operacion = operacion;
        $('#accesorioModal').modal('toggle');
    };
    
    $scope.SetAccesorio = function(data)
    {
        var accesorio = new Accesorio();
        
        accesorio.AccesorioId = data.AccesorioId;
        accesorio.Nombre = data.Nombre;
        //accesorio.Contable = data.Contable;
        //accesorio.Obligatorio = data.Obligatorio;
        accesorio.Activo = data.Activo;
        accesorio.Imagen = data.Imagen;
        accesorio.CostoUnidad = data.CostoUnidad;
        accesorio.ConsumoUnidad = data.ConsumoUnidad;
        
        accesorio.Muestrario.MuestrarioId = data.Muestrario.MuestrarioId;
        accesorio.Muestrario.Nombre = data.Muestrario.Nombre;
        
        accesorio.TipoAccesorio.TipoAccesorioId = data.TipoAccesorio.TipoAccesorioId;
        accesorio.TipoAccesorio.Nombre = data.TipoAccesorio.Nombre ;
        accesorio.TipoAccesorio.ClaseAccesorio.ClaseAccesorioId = data.TipoAccesorio.ClaseAccesorio.ClaseAccesorioId;
        accesorio.TipoAccesorio.ClaseAccesorio.Nombre = data.TipoAccesorio.ClaseAccesorio.Nombre;
        
        return accesorio;
    };
    
    $scope.SetCombinacion = function()
    {
        for(var k=0; k<$scope.combinacion.length; k++)
        {
            $scope.combinacionAccesorio[k] = new CombincacionPorMaterialAccesorio();
            $scope.combinacionAccesorio[k].CombinacionMaterial = SetCombinacionMaterial($scope.combinacion[k]);

            $scope.combinacionAccesorio[k].claseTipoMaterial = "dropdownListModal";
            $scope.combinacionAccesorio[k].claseMaterial = "dropdownListModal";
            $scope.combinacionAccesorio[k].claseGrueso = "dropdownListModal";
        }
    };
    
    /*--------------------------Paso 1 ----------------------------------*/
    $scope.TerminaPaso1 = function(nombreInvalido, costoInvalido, consumoInvalido)
    {
        $scope.terminar = true;
        if(!$scope.ValidarDatos(nombreInvalido, costoInvalido, consumoInvalido))
        {
            $scope.terminar = false;
            return;
        }
        else
        {
            if($scope.nuevoAccesorio.TipoAccesorio.ClaseAccesorio.ClaseAccesorioId != "2")
            {
                if($scope.operacion == "Agregar")
                {
                    $scope.AgregarAccesorio();
                }
                else if($scope.operacion == "Editar")
                {
                    $scope.EditarAccesorio();
                }
            }
            else if($scope.nuevoAccesorio.TipoAccesorio.ClaseAccesorio.ClaseAccesorioId == "2")
            {
                $scope.terminar = false;
                $scope.numeroPaso++;
                
                if($scope.combinacionAccesorio.length === 0)
                {
                    $scope.SetCombinacion();
                }
                
            }
        }
    };
    
    $scope.ValidarDatos = function(nombreInvalido, costoInvalido, consumoInvalido)
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
        if(costoInvalido && $scope.nuevoAccesorio.TipoAccesorio.ClaseAccesorio.ClaseAccesorioId != "2")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El costo debe ser un número decimal.";
            $scope.clase.costo = "entradaError";
        }
        else
        {
            $scope.clase.costo = "entrada";
        }
        if(consumoInvalido && $scope.nuevoAccesorio.TipoAccesorio.ClaseAccesorio.ClaseAccesorioId == "2")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El consumo debe ser un número decimal.";
            $scope.clase.consumo = "entradaError";
        }
        else
        {
            $scope.clase.consumo = "entrada";
        }
        if($scope.nuevoAccesorio.TipoAccesorio.Nombre.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de accesorio.";
            $scope.clase.tipoAccesorio = "dropdownListModalError";
        }
        else
        {
            $scope.clase.tipoAccesorio = "dropdownListModal";
        }
        if($scope.nuevoAccesorio.Muestrario.Nombre.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un muestrario.";
            $scope.clase.muestrario = "dropdownListModalError";
        }
        else
        {
            $scope.clase.muestrario = "dropdownListModal";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.accesorio.length; k++)
        {
            if($scope.accesorio[k].Nombre.toLowerCase() == $scope.nuevoAccesorio.Nombre.toLowerCase() && $scope.accesorio[k].TipoAccesorio.TipoAccesorioId == $scope.nuevoAccesorio.TipoAccesorio.TipoAccesorioId && $scope.accesorio[k].AccesorioId != $scope.nuevoAccesorio.AccesorioId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El accesorio " + $scope.nuevoAccesorio.TipoAccesorio.Nombre + " - " + $scope.nuevoAccesorio.Nombre.toLowerCase() + " ya existe.";
                $scope.clase.nombre = "entradaError";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.CambiarMuestrario = function(muestrario)
    {
        $scope.nuevoAccesorio.Muestrario = muestrario;
    };
    
    $scope.CambiarTipoAccesorio = function(tipo)
    {
        $scope.nuevoAccesorio.TipoAccesorio = tipo;
    };
    
    $scope.CerrarAccesorioModal = function()
    {
        $scope.numeroPaso = 1;
        $scope.mensajeError = [];
        $scope.clase = {tipoAccesorio:"dropdownListModal", muestrario:"dropdownListModal", nombre:"entrada", costo:"entrada", consumo:"entrada"};
    };
    
    $scope.LimpiarImagen = function()
    {
        $scope.imagen = [];
        $scope.imagenSeleccionada = false;
        $scope.CerrarAccesorioModal();
    };
    
    /*------------------------ paso 2 ---------------------------*/
    $scope.TerminaPaso2 = function()
    {
        $scope.terminar = true;
        if(!$scope.ValidarDatos2())
        {
            $scope.terminar = false;
            return;
        }
        else
        {
            $scope.nuevoAccesorio.Combinacion = $scope.combinacionAccesorio;
            
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarAccesorio();
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarAccesorio();
            }
        }
    };
    
    
    
    $scope.ValidarDatos2 = function()
    {
        $scope.mensajeError = [];
        var datosIncompletos = false;
        
        for(var k=0; k<$scope.combinacionAccesorio.length; k++)
        {
            if(!$scope.combinacionAccesorio[k].CombinacionMaterial.Activo)
            {
                $scope.CambiarTipoMaterial('No Aplica', $scope.combinacionAccesorio[k]);
            }
            else
            {
                if($scope.combinacionAccesorio[k].Material.TipoMaterial.Nombre.length === 0)
                {
                    datosIncompletos = true;
                    $scope.combinacionAccesorio[k].claseTipoMaterial = "dropdownListModalError";
                }
                else
                {
                  $scope.combinacionAccesorio[k].claseTipoMaterial = "dropdownListModal";  
                }
                if($scope.combinacionAccesorio[k].Material.Nombre.length === 0)
                {
                    datosIncompletos = true;
                    $scope.combinacionAccesorio[k].claseMaterial = "dropdownListModalError";
                }
                else
                {
                  $scope.combinacionAccesorio[k].claseMaterial = "dropdownListModal";  
                }
                if($scope.combinacionAccesorio[k].Grueso.length === 0)
                {
                    $scope.combinacionAccesorio[k].claseGrueso = "dropdownListModalError";
                    datosIncompletos = true;
                }
                else
                {
                  $scope.combinacionAccesorio[k].claseGrueso = "dropdownListModal";  
                }
            }
        }
        
        if(datosIncompletos)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Completa todos los datos"; 
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.CambiarTipoMaterial = function(tipoMaterial, componente)
    {
        if(tipoMaterial == "No Aplica")
        {
            componente.Material.TipoMaterial.Nombre = "No Aplica";
            componente.Material.TipoMaterial.TipoMaterialId = 0;
            componente.Grueso = "No Aplica";
            componente.Material.MaterialId = 0;
            componente.Material.Nombre = "No Aplica";
        }
        else if(tipoMaterial.Nombre != componente.Material.TipoMaterial.Nombre)
        {
            componente.Material = new Material();
            componente.Material.Grueso = [];
            
            componente.Material.TipoMaterial.Nombre = tipoMaterial.Nombre;
            componente.Material.TipoMaterial.TipoMaterialId = tipoMaterial.TipoMaterialId;
            
            componente.Grueso = ""; 
        }
        
    };
    
    $scope.CambiarMaterial = function(material, componente)
    {
        if(componente.Material.Grueso != material.grueso)
        {
            componente.Material.Nombre = material.Nombre;
            componente.Material.MaterialId = material.MaterialId;
            componente.Material.Grueso = material.grueso;

            if(material.grueso.length == 0)
            {
                componente.Grueso = 1;
            }
            else
            {
                componente.Grueso = "";
            }
        }
        
    };
    
    $scope.CambiarGrueso = function(grueso, componente)
    {
        componente.Grueso = grueso;
    };
    
    $scope.AnteriorAccesorio = function()
    {
        $scope.mensajeError = [];
        $scope.numeroPaso--;
    };
    
    /*--------terminar agregar - editar accesorio -------------*/
    $scope.AgregarAccesorio = function()
    {
        AgregarAccesorio($http, CONFIG, $q, $scope.nuevoAccesorio).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.CerrarAccesorioModal();
                $('#accesorioModal').modal('toggle');
                $scope.mensaje = "El accesorio se ha agregado.";
                
                if($scope.imagenSeleccionada)
                {
                    $scope.GuardarImagenAccesorio(data[1].AccesorioId);
                }
                else
                {
                    $scope.GetAccesorio();
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            
            $scope.terminar =false;
            $('#mensajeAccesorio').modal('toggle');
        }).catch(function(error)
        {
            $scope.terminar =false;
            $('#mensajeAccesorio').modal('toggle');
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
    };
    
    $scope.EditarAccesorio = function()
    {
        EditarAccesorio($http, CONFIG, $q, $scope.nuevoAccesorio).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.CerrarAccesorioModal();
                $('#accesorioModal').modal('toggle');
                $scope.mensaje = "El accesorio se ha editado.";
                
                if($scope.imagenSeleccionada)
                {
                    $scope.GuardarImagenAccesorio($scope.nuevoAccesorio.AccesorioId);
                }
                else
                {
                    $scope.GetAccesorio();
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            $scope.terminar = false;
             $('#mensajeAccesorio').modal('toggle');
        }).catch(function(error)
        {
            $scope.terminar = false;
            $('#mensajeAccesorio').modal('toggle');
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
    };
    
    /*-------------- Activar y desactivar color ------------------*/
    $scope.CambiarEstatusActivoModal = function(accesorio)
    {
        $scope.accesorioActualizar = accesorio;
        $scope.accesorioActualizar.Activo = !$scope.accesorioActualizar.Activo;
        $scope.ActivarDesactivarAccesorio($scope.accesorioActualizar);
    };
    
    $scope.ActivarDesactivarAccesorio = function(accesorio) //Activa o desactiva un elemento (empresa y tipo de unidad de negocio)
    {
        $scope.accesorioActualizar = accesorio;
        
        if(accesorio.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + accesorio.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + accesorio.Nombre + "?";
        }
        $('#modalActivarDesactivarAccesorio').modal('toggle'); 
    };
    
    /*Se confirmo que se quiere cambiar el estado de activo del elemeneto*/ 
    $scope.ConfirmarActualizarAccesorio = function()  
    {
        var datos = [];
        if($scope.accesorioActualizar.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;
        }
        
        datos[1] = $scope.accesorioActualizar.AccesorioId;

        ActivarDesactivarAccesorio($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El accesorio se ha actualizado.";
            }
            else
            {
                $scope.accesorioActualizar.Activo = !$scope.accesorioActualizar.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            $('#mensajeAccesorio').modal('toggle');
        }).catch(function(error)
        {
            $scope.accesorioActualizar.Activo = !$scope.accesorioActualizar.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeAccesorio').modal('toggle');
        });
    };
        
    /*Se cancelo el cambiar el estado de activo del elemento*/
    $scope.CancelarEstatusActivoAccesorio = function()           
    {
        $scope.accesorioActualizar.Activo = !$scope.accesorioActualizar.Activo;
    };
    
    /*-------Imagen-------*/
    $scope.CargarImagenAccesorio = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.imagen[0] = element.files[0];
            $scope.imagenSeleccionada = true; 
        });
    };
    
    $scope.GuardarImagenAccesorio = function(accesorioId) 
    {
        GuardarImagenAccesorio($http, $q, CONFIG, $scope.imagen, accesorioId).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.GetAccesorio();
            }
        }).catch(function(error)
        {
            $scope.GetAccesorio();
            alert("No se pudo guardar la imagen del accesorio");
        });
        
        $scope.imagenSeleccionada = false;
        $scope.imagen = [];
    };
    
    function ImagenSeleccionada(evt) 
    {
        var files = evt.target.files;

        for (var i = 0, f; f = files[i]; i++) 
        {
            if (!f.type.match('image.*')) 
            {
                continue;
            }

            var reader = new FileReader();

            reader.onload = (function(theFile) 
            {
                return function(e) 
                {
                    document.getElementById("PrevisualizarImagenAccesorio").innerHTML = ['<img class="imagenModulo center-block" src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('');
                    document.getElementById("PrevisualizarImagenAccesorioDetalles").innerHTML = ['<img class=" center-block img-responsive" src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('');
                };
            })(f);

            reader.readAsDataURL(f);
        }
    }
    
    document.getElementById('cargarImagen').addEventListener('change', ImagenSeleccionada, false);
    
    
    /*---------------------- Iniciar Sesión -------------------*/
    $scope.InicializarAccesorio = function()
    {
        $scope.GetAccesorio();
        $scope.GetClaseAccesorio();
        if($scope.permisoUsuario.editar || $scope.permisoUsuario.agregar)
        {
            $scope.GetTipoAccesorio();
            $scope.GetMuestrarioAccesorio();
            $scope.GetCombinacionMaterial();
            $scope.GetMaterial();
            $scope.GetGruesoMaterial();
            $scope.GetTipoMaterial();
        }
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
                    $scope.InicializarAccesorio();
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
                    $scope.InicializarAccesorio();
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