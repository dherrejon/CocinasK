app.controller("ConfiguracionPuertaControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $rootScope.clasePrincipal = "";
    $scope.permisoUsuario = {
                            puerta:{consultar:false, agregar:false, editar:false, activar:false}, 
                            muestrario:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConPueConsultar")
            {
                $scope.permisoUsuario.puerta.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConPueAgregar")
            {
                $scope.permisoUsuario.puerta.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConPueEditar")
            {
                $scope.permisoUsuario.puerta.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConPueActivar")
            {
                $scope.permisoUsuario.puerta.activar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMpuConsultar")
            {
                $scope.permisoUsuario.muestrario.consultar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMpuAgregar")
            {
                $scope.permisoUsuario.muestrario.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMpuEditar")
            {
                $scope.permisoUsuario.muestrario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConMpuActivar")
            {
                $scope.permisoUsuario.muestrario.activar = true;
            }
        }
    };
    
    $scope.titulo = "Puerta";
    $scope.tabs = tabPuerta;

    $scope.muestrario = null;
    $scope.puerta = null;
    
    $scope.puertaPorMuestrario = null;      //las puestas que pertenecen a un mismo muestrario
    $scope.componentePorPuerta = null;      //los componentes de una puerta en Detalles
    $scope.componente = null;               //Componentes que puede tener una puerta
    $scope.pieza = null;                    //Componentes que puede tener una puerta
    $scope.componenteOriginal = null;
    $scope.componentePorPuertaOriginal = [];
    $scope.combinacionPorPuerta = null;
    $scope.combinacion = [];
    $scope.gruesoMaterial = null;
    $scope.material = null;
    $scope.pasoPuerta = 1;
    
    $scope.buscarPieza = "";
    $scope.buscarPuerta = "";
    $scope.ordenar  = "Nombre";
    $scope.mostrarComponentePuerta = "";
    $scope.mostrarCombinacionPuerta = "";
    $scope.filtroCheckbox = [];
    $scope.claseMuestrario = {nombre:"entrada"};
    $scope.clasePuerta = {muestrario:"dropdownListModal", nombre:"entrada"};
    $scope.mostrarPieza = {texto:"<<", mostrar:true};
    
    $scope.mostrarFiltro = {muestrario:true, activo:false};
    $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            muestrario:[]
                     };
    
    $scope.componenteActualId = "";
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#Puerta').show();
                $('#Muestrario').hide();
                break;
            case 1:
                $('#Muestrario').show();
                $('#Puerta').hide();
                break;
            default:
                break;
        }        
    };
    
    $scope.GetMuestrarioPuerta = function()      
    {
        GetMuestrario($http, $q, CONFIG, 1).then(function(data)
        {
            $scope.muestrario = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPuerta = function()      
    {
        GetPuerta($http, $q, CONFIG).then(function(data)
        {
            $scope.puerta = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPuertaPorMuestrario = function(muestrarioId)      
    {
        GetPuertaPorMuestrario($http, $q, CONFIG, muestrarioId).then(function(data)
        {
            $scope.puertaPorMuestrario = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetComponentePorPuerta = function(puertaId)      
    {
        GetComponentePorPuerta($http, $q, CONFIG, puertaId).then(function(data)
        {
            $scope.componentePorPuerta = data;
            
            for(var k=0; k<$scope.componentePorPuerta.length; k++)
            {
                for(var i=0; i<$scope.componente.length; i++)
                {
                    if(!$scope.componente[i].seleccionado)
                    {
                        if($scope.componente[i].ComponenteId == $scope.componentePorPuerta[k].ComponenteId)
                        {
                            $scope.componente[i].seleccionado = true;
                            $scope.componenteOriginal[i].seleccionado = true;
                            break;
                        }
                    }
                }
                $scope.componentePorPuertaOriginal[k] = $scope.CopiarComponentePorPuerte($scope.componentePorPuerta[k]);
                
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.CopiarComponentePorPuerte = function(componente)
    {
        var nuevoComponente = new Object();
        
        nuevoComponente.NombrePieza = componente.NombrePieza;
        nuevoComponente.PiezaId = componente.PiezaId;
        nuevoComponente.NombreComponente = componente.NombreComponente;
        nuevoComponente.ComponenteId = componente.ComponenteId;
        nuevoComponente.Cantidad = componente.Cantidad;
        nuevoComponente.ComponentePorPuertaId = componente.ComponentePorPuertaId;
        nuevoComponente.PiezaPorComponentePuertaId = componente.PiezaPorComponentePuertaId;
        
        return nuevoComponente;
    };
    
    /*-------------------------Puerta-----------------------------*/
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual se van a ordenar las puertas
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenar == campoOrdenar)
        {
            $scope.ordenar = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenar = campoOrdenar;
        }
    };
    
    /*--------Filtrar------------*/
    $scope.FiltroPuerta = function(puerta)
    {
        if($scope.filtro.activo.activo != $scope.filtro.activo.inactivo)
        {
            if($scope.filtro.activo.activo)
            {
                if(!puerta.Activo)
                {
                    return false;
                }
            }
            if($scope.filtro.activo.inactivo)
            {
                if(puerta.Activo)
                {
                    return false;
                }
            }   
        }
        
        if($scope.filtro.muestrario.length === 0)
        {
            return true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.muestrario.length; k++)
            {
                if(puerta.Muestrario.Nombre == $scope.filtro.muestrario[k])
                {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    $scope.setFiltro = function(campo)
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
    
    $scope.MostrarFiltros = function(filtro)
    {
        if(filtro == "muestrario")
        {
            $scope.mostrarFiltro.muestrario =  !$scope.mostrarFiltro.muestrario;
        }
        else if(filtro == "activo")
        {
            $scope.mostrarFiltro.activo =  !$scope.mostrarFiltro.activo;
        }
    };
    
    $scope.LimpiarFiltro = function()
    {
        $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            muestrario:[]
                        };
        
        $scope.filtroCheckbox = [];
    };
    
    /*------Detalles----------------*/
    $scope.AbrirDetallesPuerta = function(puerta)
    {
        $scope.detallePuerta = puerta;
        
        $scope.GetComponentePorPuerta(puerta.PuertaId);
        $scope.GetCombinacionPorPuerta(puerta.PuertaId);
        
        $('#DetallesComponentePuerta').modal('toggle');
    };
    
    $scope.MostraPiezaPorComponentePieza = function(componente)
    {
        if(componente != $scope.mostrarComponentePuerta)
        {
            $scope.mostrarComponentePuerta = componente;
        }
        else
        {
            $scope.mostrarComponentePuerta = "";
        }
    };
    
    $scope.GetClaseDetallesComponente = function(componente)
    {
        if($scope.mostrarComponentePuerta == componente)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    /*----------------Editar - Agregar Puerta -----------------------*/
    $scope.AbrirPuertaForma = function(operacion, puerta)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevaPuerta = new Puerta();
            
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].seleccionado = true;
            }
            $scope.componentePorPuerta = [];
            
            $scope.combinacionPorPuerta = [];
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaPuerta = SetPuerta(puerta);
            $scope.nuevaPuerta.Muestrario = SetMuestrario(puerta.Muestrario);
            
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].seleccionado = false;
                $scope.componenteOriginal[k].seleccionado = false;
            }
            
            $scope.GetComponentePorPuerta(puerta.PuertaId);
            $scope.GetCombinacionPorPuerta(puerta.PuertaId);
        }
        
        if($scope.pieza === null)
        {
           $scope.GetPieza();
        }
        
        $('#puertaModal').modal('toggle');
    };
    
    $scope.CambiarMuestrario = function(muestrario)
    {
        $scope.nuevaPuerta.Muestrario.MuestrarioId = muestrario.MuestrarioId;
        $scope.nuevaPuerta.Muestrario.Nombre = muestrario.Nombre;
    };
    
    $scope.CambiarComponenteSeleccionado = function(componente)
    {
        componente.seleccionado = !componente.seleccionado; 
        if(componente.ComponenteId == $scope.componenteActualId)
        {
            $scope.componenteActualId = "";
        }
    }; 
    
    $scope.GetClaseComponente = function(seleccionado)
    {
        if(seleccionado)
        {
            return "checkSeleccionado";
        }
        else
        {
            return "checkNoSeleccionado";
        }
    };
    
    $scope.GetClaseComponenteSeleccionado = function(componenteId)
    {
        if($scope.componenteActualId == componenteId)
        {
            return "resaltarSeleccion";
        }
        
        return "";
    };
    
    $scope.AgregarPiezaComponente = function(pieza, componente)
    {
        var index = $scope.componentePorPuerta.length;
        
        $scope.componentePorPuerta[index] = new Object();
       
        $scope.componentePorPuerta[index].ComponenteId = componente.ComponenteId;
        $scope.componentePorPuerta[index].NombreComponente = componente.Nombre;
        $scope.componentePorPuerta[index].PiezaId = pieza.PiezaId;
        $scope.componentePorPuerta[index].NombrePieza = pieza.Nombre;
        $scope.componentePorPuerta[index].Cantidad = 1;
    };
    
    $scope.RemoverCantidadPieza = function(pieza)
    {
        if((pieza.Cantidad-1) > 0)
        {
            pieza.Cantidad--;    
        }
    };
    
    $scope.AgregarCantidadPieza = function(pieza)
    {
        pieza.Cantidad++;    
    };
    
    $scope.QuitarPieza = function(pieza)
    {
        for(var k=0; k<$scope.componentePorPuerta.length; k++)
        {
            if(pieza.ComponenteId == $scope.componentePorPuerta[k].ComponenteId && pieza.PiezaId == $scope.componentePorPuerta[k].PiezaId)
            {
                $scope.componentePorPuerta.splice(k,1);
            }
        }
    };
    
    $scope.FitrarPieza = function( pieza)
    {
        if($scope.componentePorPuerta !== null)
        {
            for(var k=0; k<$scope.componentePorPuerta.length; k++)
            {
                if($scope.componentePorPuerta[k].ComponenteId == $scope.componenteActualId && $scope.componentePorPuerta[k].PiezaId == pieza.PiezaId)
                {
                    return false;
                }
            }
        }
            
        return true;
    };
    
    $scope.CambiarComponenteActual = function(componenteId)
    {
        if(componenteId != $scope.componenteActualId)
        {
            $scope.componenteActualId = componenteId;
        }
        else
        {
            $scope.componenteActualId = "";
        }
    };
    
    $scope.CambiarMostrarPiezas = function()
    {
        $scope.mostrarPieza.mostrar = !$scope.mostrarPieza.mostrar;
        if($scope.mostrarPieza.mostrar)
        {
            $scope.mostrarPieza.texto = "<<";
        }
        else
        {
            $scope.mostrarPieza.texto = ">>";
        }
    };
    
    /*-----Paso 2----------*/
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
    
    //--------Terminar de editar agregar
    $scope.ValidarDatos = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        var datoInvalido = true;
        
        if(nombreInvalido)
        {
            $scope.clasePuerta.nombre = "entradaError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";   
        }
        else
        {
            $scope.clasePuerta.nombre = "entrada";
        }
        if($scope.nuevaPuerta.Muestrario.MuestrarioId === "")
        {
            $scope.clasePuerta.muestrario = "dropdownListModalError";
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un muestrario.";
        }
        else
        {
            $scope.clasePuerta.muestrario = "dropdownListModal";
        }
        
        
        for(var k=0; k<$scope.componente.length; k++)
        {
            if($scope.componente[k].seleccionado)
            {
                datoInvalido = false;
                break;
            }
        }
        if(datoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de selecionar al menos un componente.";
            
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].clase = "botonOperacionError";
            }
        }
        else
        {
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].clase = "botonOperacion";
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
    
        for(var k=0; k<$scope.componente.length; k++)
        {
            if($scope.componente[k].seleccionado)
            {
                datoInvalido = true;
                for(var i=0; i<$scope.componentePorPuerta.length; i++)
                {
                    if($scope.componentePorPuerta[i].ComponenteId == $scope.componente[k].ComponenteId)
                    {
                       datoInvalido = false;
                       break;
                    }
                }
                if(datoInvalido)
                {
                    $scope.componente[k].clase = "botonOperacionError";
                    $scope.mensajeError[$scope.mensajeError.length] = "*El componente " + $scope.componente[k].Nombre + " debe de contar con almenos una pieza.";
                }
                else
                {
                    $scope.componente[k].clase = "botonOperacion";
                }
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
            
        for(var k=0; k<$scope.puerta.length; k++)
        {
            if($scope.nuevaPuerta.Nombre.toLowerCase() == $scope.puerta[k].Nombre.toLowerCase() && $scope.nuevaPuerta.PuertaId != $scope.puerta[k].PuertaId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*La puerta "+ $scope.nuevaPuerta.Nombre + " ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.SetValoresAgregar = function()
    {
        $scope.nuevaPuerta.Componente = $scope.componente;
        $scope.nuevaPuerta.componentePorPuerta = $scope.componentePorPuerta;
    };
    
    $scope.SetValoresEditarComponente = function()
    {
        var componenteBorrar = [];
        var componenteAgregar = [];
        var componenteEditar = [];
        
        for(var i=0; i<$scope.componenteOriginal.length; i++)
        {
            if($scope.componenteOriginal[i].seleccionado && !$scope.componente[i].seleccionado)
            {
                componenteBorrar[componenteBorrar.length] = $scope.componente[i].ComponenteId;
            }
            
            if(!$scope.componenteOriginal[i].seleccionado && $scope.componente[i].seleccionado)
            {
                componenteAgregar[componenteAgregar.length] = $scope.componente[i].ComponenteId;
            }
            if($scope.componenteOriginal[i].seleccionado && $scope.componente[i].seleccionado)
            {
                componenteEditar[componenteEditar.length] = $scope.componente[i].ComponenteId;
            }
        }
        
        $scope.nuevaPuerta.componenteEditar = componenteEditar;
        $scope.nuevaPuerta.componenteAgregar = componenteAgregar;
        $scope.nuevaPuerta.componenteBorrar = componenteBorrar;
    };
    
    $scope.SetValoresEditarComponentePorPuerta = function()
    { 
        var piezaPorComponenteAgregar = [];
        var piezaPorComponenteBorrar = [];
        var piezaPorComponenteEditar = [];
        
        var datoEncontrado;
        for(var i=0; i<$scope.componentePorPuerta.length; i++)
        {
            datoEncontrado = false;
            for(var k=0; k<$scope.componentePorPuertaOriginal.length; k++)
            {
                if($scope.componentePorPuertaOriginal[k].ComponenteId == $scope.componentePorPuerta[i].ComponenteId && $scope.componentePorPuertaOriginal[k].PiezaId == $scope.componentePorPuerta[i].PiezaId)
                {
                    datoEncontrado = true;
                    break;
                }
            }
            
            if(datoEncontrado)
            {
                for(var j=0; j<$scope.componente.length; j++)
                {
                    if($scope.componente[j].ComponenteId == $scope.componentePorPuerta[i].ComponenteId && $scope.componente[j].seleccionado)
                    {
                        piezaPorComponenteEditar[piezaPorComponenteEditar.length] = $scope.componentePorPuerta[i];
                        break;
                    }
                }
            }
            else
            {
                for(var j=0; j<$scope.componente.length; j++)
                {
                    if($scope.componente[j].ComponenteId == $scope.componentePorPuerta[i].ComponenteId && $scope.componente[j].seleccionado)
                    {
                        piezaPorComponenteAgregar[piezaPorComponenteAgregar.length] = $scope.componentePorPuerta[i];
                        break;
                    }
                }
            }
        }
        
        for(var i=0; i<$scope.componentePorPuertaOriginal.length; i++)
        {
            datoEncontrado = false;
            for(var k=0; k<$scope.componentePorPuerta.length; k++)
            {
                if($scope.componentePorPuertaOriginal[i].ComponenteId == $scope.componentePorPuerta[k].ComponenteId && $scope.componentePorPuertaOriginal[i].PiezaId == $scope.componentePorPuerta[k].PiezaId)
                {
                    datoEncontrado = true;
                    break;
                }
            }
            if(!datoEncontrado)
            {
                piezaPorComponenteBorrar[piezaPorComponenteBorrar.length] = $scope.componentePorPuertaOriginal[i];
            }
        }
        
        $scope.nuevaPuerta.piezaPorComponenteAgregar = piezaPorComponenteAgregar;
        $scope.nuevaPuerta.piezaPorComponenteBorrar = piezaPorComponenteBorrar;
        $scope.nuevaPuerta.piezaPorComponenteEditar = piezaPorComponenteEditar;
    };
    
    $scope.SiguientePuerta = function(nombreInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            return;
        }
        
        $scope.PrepararCombinaciones();
        
        $scope.pasoPuerta++;
    };
    
    $scope.PrepararCombinaciones = function()
    {
        if($scope.combinacionPorPuerta.length == 0)
        {
            var index = 0;
            for(var k=0; k<$scope.combinacion.length; k++)
            {
                for(var i=0; i<$scope.componente.length; i++)
                {
                    if($scope.componente[i].seleccionado)
                    {
                        $scope.combinacionPorPuerta[index] = new CombinacionPorMaterialComponente();
                        $scope.combinacionPorPuerta[index].CombinacionMaterial = SetCombinacionMaterial($scope.combinacion[k]);

                        $scope.combinacionPorPuerta[index].Componente = new Componente();
                        $scope.combinacionPorPuerta[index].Componente = SetComponente($scope.componente[i]);
                        $scope.combinacionPorPuerta[index].clase = {tipoMaterial:"dropdownListModal", material:"dropdownListModal", grueso:"dropdownListModal"};
                        index++;
                    }
                }
            }
        }
        else
        {
            for(var i=0; i<$scope.componente.length; i++)
            {
                for(var k=0; k<$scope.combinacionPorPuerta.length; k++)
                {
                    if(!$scope.componente[i].seleccionado)
                    {
                        if($scope.componente[i].Nombre == $scope.combinacionPorPuerta[k].Componente.Nombre)
                        {
                            $scope.combinacionPorPuerta.splice(k,1);
                            k--;
                        }
                    }
                }
            }
            
            for(var j=0; j<$scope.combinacion.length; j++)
            {
                for(var i=0; i<$scope.componente.length; i++)
                {
                    if($scope.componente[i].seleccionado)
                    {
                        var componenteAgregado = false;
                        for(var k=0; k<$scope.combinacionPorPuerta.length; k++)
                        {
                            if($scope.combinacionPorPuerta[k].Componente.ComponenteId == $scope.componente[i].ComponenteId && $scope.combinacion[j].CombinacionMaterialId == $scope.combinacionPorPuerta[k].CombinacionMaterial.CombinacionMaterialId)
                            {
                                componenteAgregado = true;
                                break;
                            }
                        }
                        if(!componenteAgregado)
                        {
                            var ind = $scope.combinacionPorPuerta.length;
                            $scope.combinacionPorPuerta[ind] = new CombinacionPorMaterialComponente();
                            $scope.combinacionPorPuerta[ind].CombinacionMaterial = SetCombinacionMaterial($scope.combinacion[j]);

                            $scope.combinacionPorPuerta[ind].Componente = new Componente();
                            $scope.combinacionPorPuerta[ind].Componente = SetComponente($scope.componente[i]);
                            $scope.combinacionPorPuerta[ind].clase = {tipoMaterial:"dropdownListModal", material:"dropdownListModal", grueso:"dropdownListModal"};
                        }
                    }
                }
            }
        }
    };
    
    $scope.ValidarPuertaPaso2 = function()
    {
        $scope.mensajeError = [];
       
        var datosIncompletos = false;
        
        for(var k=0; k<$scope.combinacionPorPuerta.length; k++)
        {
            if(!$scope.combinacionPorPuerta[k].CombinacionMaterial.Activo)
            {
                $scope.CambiarTipoMaterial('No Aplica', $scope.combinacionPorPuerta[k]);
            }
            else
            {
                if($scope.combinacionPorPuerta[k].Material.TipoMaterial.Nombre.length === 0)
                {
                    datosIncompletos = true;
                    $scope.combinacionPorPuerta[k].clase.tipoMaterial = "dropdownListModalError";
                }
                else
                {
                  $scope.combinacionPorPuerta[k].clase.tipoMaterial = "dropdownListModal";  
                }
                if($scope.combinacionPorPuerta[k].Material.Nombre.length === 0)
                {
                    datosIncompletos = true;
                    $scope.combinacionPorPuerta[k].clase.material = "dropdownListModalError";
                }
                else
                {
                  $scope.combinacionPorPuerta[k].clase.material = "dropdownListModal";  
                }
                if($scope.combinacionPorPuerta[k].Grueso.length === 0)
                {
                    $scope.combinacionPorPuerta[k].clase.grueso = "dropdownListModalError";
                    datosIncompletos = true;
                }
                else
                {
                    $scope.combinacionPorPuerta[k].clase.grueso = "dropdownListModal";  
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
    
    $scope.TerminarPuerta = function(nombreInvalido)
    {   
        if(!$scope.ValidarPuertaPaso2())
        {
            return;
        }
        
        $scope.nuevaPuerta.combinacion = $scope.combinacionPorPuerta;
        if($scope.operacion == "Agregar")
        {
            $scope.SetValoresAgregar ();
            $scope.AgregarPuerta();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.SetValoresEditarComponente();
            $scope.SetValoresEditarComponentePorPuerta();
            
            $scope.EditarPuerta();
        }
    };
    
    $scope.AgregarPuerta = function()
    {
        AgregarPuerta($http, CONFIG, $q, $scope.nuevaPuerta).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetPuerta();
                $scope.CerrarPuerta();
                
                $('#puertaModal').modal('toggle');
                $scope.mensaje = "La puerta se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            $('#mensajeConfigurarPuerta').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeConfigurarPuerta').modal('toggle');
        });
    };
    
    $scope.EditarPuerta = function()
    {
        EditarPuerta($http, CONFIG, $q, $scope.nuevaPuerta).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetPuerta();
                $scope.CerrarPuerta();
                
                $('#puertaModal').modal('toggle');
                $scope.mensaje = "La puerta se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            $('#mensajeConfigurarPuerta').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeConfigurarPuerta').modal('toggle');
        });
    };
    
    $scope.AnteriorPuerta = function()
    {
        $scope.pasoPuerta--;
        $scope.mensajeError = [];
    };
    
    $scope.CerrarPuerta = function()
    {
        $scope.pasoPuerta = 1;
        $scope.componenteActualId = ""; 
        $scope.mensajeError = [];
        $scope.clasePuerta = {nombre:"entrada", muestrario:"dropdownListModal"};
        
        for(var k=0; k<$scope.componente.length; k++)
        {
            $scope.componente.clase = "botonOperacion";
        }
    };
    
    $scope.FiltrarCombinacionPorComponentePuerta = function(combinacion)
    {
        if(combinacion.CombinacionMaterial.Nombre == $scope.mostrarCombinacionPuerta)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    
    /*--------------------------Muestrario ------------------------------*/
    
    /*------------ Detalles ----------------*/
    $scope.AbrirDetallesMuestrario = function(muestrario)
    {
        $scope.detalleMuestrario = muestrario;
        
        $scope.GetPuertaPorMuestrario(muestrario.MuestrarioId);
        
        $('#DetallesPuertaMuestrario').modal('toggle');
    };
    
    /*Agregar-Editar muestrario*/
    $scope.AbrirMuestrarioModal = function(operacion, muestrario)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoMuestrario = new Muestrario();
            $scope.nuevoMuestrario.TipoAccesorio.TipoAccesorioId = null;
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoMuestrario = SetMuestrario(muestrario);
            $scope.nuevoMuestrario.TipoAccesorio.TipoAccesorioId = "null";
        }
        
        $('#muestrarioModal').modal('toggle');
    };
    
    $scope.TerminarMuestrario = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";   
            $scope.claseMuestrario.nombre = "entradaError";
        }
        else
        {
            $scope.claseMuestrario.nombre = "entrada";
        }
         
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.muestrario.length; k++)
        {
            if($scope.nuevoMuestrario.Nombre.toLowerCase() == $scope.muestrario[k].Nombre.toLowerCase() && $scope.nuevoMuestrario.MuestrarioId != $scope.muestrario[k].MuestrarioId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "El muestario " + $scope.nuevoMuestrario.Nombre + " ya existe.";
                $scope.claseMuestrario.nombre = "entradaError";
                return;
            }
        }
        
        $scope.nuevoMuestrario.TipoMuestrarioId = 1;  // tipo de muestrario de puertas
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarMuestrario();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.nuevoMuestrario.Margen = "null";
            $scope.EditarMuestrario();
        }        
    };
    
    $scope.AgregarMuestrario = function()
    {
        AgregarMuestrario($http, CONFIG, $q, $scope.nuevoMuestrario).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#muestrarioModal').modal('toggle');
                $scope.mensaje = "El muestrario se ha agregado.";
                $scope.GetMuestrarioPuerta();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            $('#mensajeConfigurarPuerta').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeConfigurarPuerta').modal('toggle');
        });
    };
    
    $scope.EditarMuestrario = function()
    {
        EditarMuestrario($http, CONFIG, $q, $scope.nuevoMuestrario).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetMuestrarioPuerta();

                $('#muestrarioModal').modal('toggle');
                $scope.mensaje = "El muestrario se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            $('#mensajeConfigurarPuerta').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeConfigurarPuerta').modal('toggle');
        });
    };
    
    $scope.CerrarMuestrarioForma = function()
    {
        $scope.mensajeError = [];
        $scope.claseMuestrario = {nombre:"entrada"};
    };
    
    $scope.MostraCominacionPorPuerta = function(combinacion)
    {
        if(combinacion != $scope.mostrarCombinacionPuerta)
        {
            $scope.mostrarCombinacionPuerta = combinacion;
        }
        else
        {
            $scope.mostrarCombinacionPuerta = "";
        }
    };
    
    $scope.GetClaseDetallesCombinacion = function(combinacion)
    {
        if($scope.mostrarCombinacionPuerta == combinacion)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    
    
    /*---------------------- Cambiar Activo -------------*/
    $scope.CambiarEstatusActivo = function(seccion, objeto)
    {
        $scope.objetoActivo = objeto;
        $scope.seccionCambiarActivo = seccion;
        
        
        if(objeto.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + objeto.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + objeto.Nombre + "?";
        }
        
        $('#modalActivarDesactivarConfigurarPuerta').modal('toggle');
    };
    
    $scope.CancelarCambiarActivo = function()
    {
        $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
    };
    
    $scope.ConfirmarActualizarActivo = function()
    {
        var datos = [];
        
        if($scope.objetoActivo.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;  
        }
        
        if($scope.seccionCambiarActivo == "puerta")
        {
            datos[1] = $scope.objetoActivo.PuertaId;
            
            ActivarDesactivarPuerta($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "La puerta se ha actualizado correctamente.";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarPuerta').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarPuerta').modal('toggle');
            });
            
            if($scope.objetoActivo.Activo)
            {
                $scope.objetoActivo.ActivoN = 1;
            }
            else
            {
                $scope.objetoActivo.ActivoN = 0;
            }
        }
        
        if($scope.seccionCambiarActivo == "muestrario")
        {
            datos[1] = $scope.objetoActivo.MuestrarioId;
            
            ActivarDesactivarMuestrario($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El muestrario se ha actualizado correctamente.";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarPuerta').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarPuerta').modal('toggle');
            });
        }    
    };
    
    /*-----------Otros Catálogos-----------*/
    $scope.GetComponentePuerta = function()      
    {
        GetComponentePuerta($http, $q, CONFIG).then(function(data)
        {            
            $scope.componente = data;
            $scope.componenteOriginal = [];
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].clase = "botonOperacion";
                $scope.componenteOriginal[k] = $scope.SetComponenteCopia($scope.componente[k]);
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetCombinacionPorPuerta = function(puertaId)
    {
        GetCombinacionPorMaterialComponente($http, $q, CONFIG, puertaId, "puerta").then(function(data)
        {
            $scope.combinacionPorPuerta = data;
            for(var k=0; k<data.length; k++)
            {
                for(var i=0; i<$scope.material.length; i++)
                {
                    if($scope.material[i].MaterialId == $scope.combinacionPorPuerta[k].Material.MaterialId)
                    {
                        $scope.combinacionPorPuerta[k].Material.Grueso = $scope.material[i].grueso;
                        break;
                    }
                }
                $scope.combinacionPorPuerta[k].clase = {tipoMaterial:"dropdownListModal", material:"dropdownListModal", grueso:"dropdownListModal"};
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener los consumibles." + error);
            return;
        });
    };
    
    $scope.GetPieza = function()      
    {
        GetPieza($http, $q, CONFIG).then(function(data)
        {            
            $scope.pieza = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetComponenteCopia = function(componente)
    {
        var copiaComponente = new Object();
        
        copiaComponente.ComponenteId = componente.ComponenteId;
        copiaComponente.Nombre = componente.Nombre;
        copiaComponente.ComponenteId = componente.ComponenteId;
        
        return copiaComponente;
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
    
    /*--------- Inicializar -------------*/
    $scope.InicializarPuerta = function()
    {    
        $scope.GetMuestrarioPuerta();
        $scope.GetPuerta();
        $scope.GetComponentePuerta();
        
        $scope.GetCombinacionMaterial();
        $scope.GetMaterial();
        $scope.GetGruesoMaterial();
        $scope.GetTipoMaterial();
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
                if(!$scope.permisoUsuario.puerta.consultar && !$scope.permisoUsuario.muestrario.consultar)
                {
                    $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado); 
                }
                else
                {
                    $scope.InicializarPuerta();
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
                if(!$scope.permisoUsuario.puerta.consultar && !$scope.permisoUsuario.muestrario.consultar)
                {
                    $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.InicializarPuerta();
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
var tabPuerta = 
    [
        {titulo:"Puerta", referencia: "#Puerta", clase:"active", area:"puerta"},
        {titulo:"Muestrario", referencia: "#Muestrario", clase:"", area:"muestrario"}
    ];
