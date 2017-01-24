app.controller("ConfiguaracionMaterial", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter, $location)
{   
    $scope.permisoUsuario = {
                            material:{consultar:false, agregar:false, editar:false, activar:false}, 
                            tipoMaterial:{consultar:false, agregar:false, editar:false, activar:false}
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmMatConsultar")
            {
                $scope.permisoUsuario.material.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmMatAgregar")
            {
                $scope.permisoUsuario.material.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmMatEditar")
            {
                $scope.permisoUsuario.material.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmMatActivar")
            {
                $scope.permisoUsuario.material.activar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmTMaConsultar")
            {
                $scope.permisoUsuario.tipoMaterial.consultar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmTMaAgregar")
            {
                $scope.permisoUsuario.tipoMaterial.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmTMaEditar")
            {
                $scope.permisoUsuario.tipoMaterial.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmTMaActivar")
            {
                $scope.permisoUsuario.tipoMaterial.activar = true;
            }
        }
    };
    
    $scope.titulo = "Tipo Material";
    $scope.tabs = tabMaterial;
    $scope.tipoMaterial = null;
    $scope.material = null;
    $scope.materialPara = null;
    $scope.gruesoMaterial = null;
    
    $scope.mensajeError = [];
    $scope.buscar = "";
    $scope.filtro = [];
    $scope.filtroCheckbox = [];
    
    $scope.filtroCubierta = [];
    $scope.filtroCheckboxCubierta = [];
    
    $scope.claseTipoModulo = {nombre:"entrada", material:"dropdownListModal", tipoCubierta:"dropdownListModal"};
    $scope.claseMaterial= {tipoMaterial:"dropdownListModal", nombre:"entrada", costo:"entrada"};
    
    $scope.ordenarPorTipo = "Nombre";
    $scope.ordenarPorMaterial = "Nombre";
    $scope.ordenarPorMaterialCubierta = "Nombre";
    
    $scope.tipoCubierta= [];
    
    $scope.materialDeSeleccionado = "";  //identifica que material que va agregar o editar (cubierta o módulo)
    
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#TipoMaterial').show();
                $('#Material').hide();
                $('#MaterialCubierta').hide();
                break;
            case 1:
                $('#Material').show();
                $('#TipoMaterial').hide();
                $('#MaterialCubierta').hide();
                break;
            case 2:
                $('#MaterialCubierta').show();
                $('#TipoMaterial').hide();
                $('#Material').hide();
                break;
            default:
                break;
        }        
    };
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual se van a ordenar los tipos de material
    $scope.CambiarOrdenarTipoMaterial = function(campoOrdenar)
    {
        if($scope.ordenarPorTipo == campoOrdenar)
        {
            $scope.ordenarPorTipo = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorTipo = campoOrdenar;
        }
    };
    
    //cambia el campo por el cual se van a ordenar  el material
    $scope.CambiarOrdenarMaterial = function(campoOrdenar)
    {
        if($scope.ordenarPorMaterial == campoOrdenar)
        {
            $scope.ordenarPorMaterial = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorMaterial = campoOrdenar;
        }
    };
    
    $scope.CambiarOrdenarMaterialCubierta = function(campoOrdenar)
    {
        if($scope.ordenarPorMaterialCubierta == campoOrdenar)
        {
            $scope.ordenarPorMaterialCubierta = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorMaterialCubierta = campoOrdenar;
        }
    };
    
    /*--------filtro -----------*/
    $scope.setFiltro = function(campo)
    {
        for(var k=0; k<$scope.filtro.length; k++)
        {
            if($scope.filtro[k] == campo)
            {
                $scope.filtro.splice(k,1);
                return;
            }
        }
        $scope.filtro.push(campo);
        return;
    };
    
    $scope.LimpiarFiltro = function()
    {
        $scope.filtro = [];
        
        for(var k=0; k<$scope.filtroCheckbox.length; k++)
        {
            $scope.filtroCheckbox[k] = false;
        }
        
    };
    
    $scope.FiltrarMaterial = function(material)
    {
        if($scope.filtro.length === 0)
        {
            return true;
        }
        else
        {
            var cumpleFiltro = false;
            
            
            for(var k=0; k<$scope.filtro.length; k++)
            {
                if(material.TipoMaterial.Nombre == $scope.filtro[k])
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
    
    
    $scope.setFiltroCubierta = function(campo)
    {
        for(var k=0; k<$scope.filtroCubierta.length; k++)
        {
            if($scope.filtroCubierta[k] == campo)
            {
                $scope.filtroCubierta.splice(k,1);
                return;
            }
        }
        $scope.filtroCubierta.push(campo);
        return;
    };
    
    $scope.LimpiarFiltroCubierta = function()
    {
        $scope.filtroCubierta = [];
        
        for(var k=0; k<$scope.filtroCheckboxCubierta.length; k++)
        {
            $scope.filtroCheckboxCubierta[k] = false;
        }
        
    };
    
    $scope.FiltrarMaterialCubierta = function(material)
    {
        if($scope.filtroCubierta.length === 0)
        {
            return true;
        }
        else
        {
            var cumpleFiltro = false;
            
            
            for(var k=0; k<$scope.filtroCubierta.length; k++)
            {
                if(material.TipoMaterial.Nombre == $scope.filtroCubierta[k])
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
    
    /*-----------------------------------Tipo Material----------------------------------------------------------*/
    
    $scope.GetTipoMaterial = function()      
    {
        GetTipoMaterial($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoMaterial = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.AbrirTipoMaterialForma = function(operacion, tipoMaterial)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoTipoMaterial = new TipoMaterial();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoTipoMaterial = SetTipoMaterial(tipoMaterial);
            $scope.nuevoTipoMaterial.TipoCubierta = SetTipoCubierta(tipoMaterial.TipoCubierta);
        }
        
        $('#tipoMaterialForma').modal('toggle');
    };
    
    $scope.CambiarTipoCubierta = function(tipo)
    {  
        $scope.nuevoTipoMaterial.TipoCubierta = SetTipoCubierta(tipo); 
    };
    
    $scope.TerminarTipoMaterial = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.claseTipoModulo.nombre = "entradaError";
        }
        else
        {
            $scope.claseTipoModulo.nombre = "entrada";
        }
        
        if(!$scope.nuevoTipoMaterial.DisponibleCubierta && !$scope.nuevoTipoMaterial.DisponibleModulo)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona al menos una opción de donde se usará este tipo de material.";
        }
        
        if(($scope.nuevoTipoMaterial.TipoCubierta.TipoCubiertaId != "1" && $scope.nuevoTipoMaterial.TipoCubierta.TipoCubiertaId != "2") && $scope.nuevoTipoMaterial.DisponibleCubierta)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de cubierta.";
            $scope.claseTipoModulo.tipoCubierta = "dropdownListModalError";
        }
        else
        {
            $scope.claseTipoModulo.tipoCubierta = "dropdownListModal";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return; 
        }
        
        for(var k=0; k<$scope.tipoMaterial.length; k++)
        {
            if($scope.tipoMaterial[k].Nombre.toLowerCase() == $scope.nuevoTipoMaterial.Nombre.toLowerCase() && $scope.tipoMaterial[k].TipoMaterialId != $scope.nuevoTipoMaterial.TipoMaterialId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "El tipo de material " + $scope.nuevoTipoMaterial.Nombre + " ya existe.";
                return;
            }
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarTipoMaterial();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarTipoMaterial();
        }
    };
    
    $scope.AgregarTipoMaterial = function()
    {
        AgregarTipoMaterial($http, CONFIG, $q, $scope.nuevoTipoMaterial).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTipoMaterial();
                $('#tipoMaterialForma').modal('toggle');
                $scope.mensaje = "El tipo de material se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            
            $('#mensajeConfigurarMaterial').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarMaterial').modal('toggle');
        });
    };
    
    $scope.EditarTipoMaterial = function()
    {
        EditarTipoMaterial($http, CONFIG, $q, $scope.nuevoTipoMaterial).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTipoMaterial();
                $('#tipoMaterialForma').modal('toggle');
                $scope.mensaje = "El tipo de material se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde"; 
            }
            $('#mensajeConfigurarMaterial').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarMaterial').modal('toggle');
        });
    };
    
    $scope.CerrarTipoMaterialForma = function()
    {
        $scope.mensajeError = [];
        $scope.claseTipoModulo = {nombre:"entrada", material:"dropdownListModal", tipoCubierta:"dropdownListModal"};
    };
    
    /*----------------------------------- Material----------------------------------------------------------*/    
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
    
    $scope.GetTipoCubierta = function()
    {
        $scope.tipoCubierta = GetTipoCubierta();
    };
    
    $scope.AbrirGruesoForma = function(material)
    {
        $scope.costoPorGrueso = material;
        
        $('#DetallesCostoPorGrueso').modal('toggle');
    };
    
    /*Agregar-Editar material*/
    $scope.AbrirMaterialForma = function(operacion, material, materialDe)
    {
        $scope.operacion = operacion;
        $scope.materialDeSeleccionado = materialDe;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoMaterial = new Material();
            $scope.nuevoMaterial.grueso = [];
            
            $scope.nuevoMaterial.MaterialDe = materialDe;
            
            for(var k=0; k<$scope.tipoMaterial.length; k++)
            {
                if(materialDe == "Módulo")
                {
                    if($scope.tipoMaterial[k].Activo && $scope.tipoMaterial[k].DisponibleModulo)
                    {
                        $scope.CambiarTipoMaterial($scope.tipoMaterial[k]);
                        break;
                    }
                }
                else if(materialDe == "Cubierta")
                {
                   if($scope.tipoMaterial[k].Activo && $scope.tipoMaterial[k].DisponibleCubierta)
                    {
                        $scope.CambiarTipoMaterial($scope.tipoMaterial[k]);
                        break;
                    } 
                }
            }
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoMaterial = SetMaterialCompleto(material);
            
            for(var k=0; k<$scope.nuevoMaterial.grueso.length; k++)
            {
                $scope.nuevoMaterial.grueso[k].ClaseGrueso = "entrada";
                $scope.nuevoMaterial.grueso[k].ClaseCosto = "entrada";
            }
        }
        
        $('#MaterialForma').modal('toggle');
    };
    
    $scope.CambiarTipoMaterial = function(tipoMaterial)
    {
        $scope.nuevoMaterial.TipoMaterial = SetTipoMaterial(tipoMaterial);
    };
    
    $scope.CambiarNumeroGrueso = function(operacion)
    {
        if(operacion == "Agregar")
        {
            $scope.nuevoMaterial.grueso[$scope.nuevoMaterial.grueso.length] = new GruesoMaterial();
            $scope.nuevoMaterial.grueso[$scope.nuevoMaterial.grueso.length-1].ClaseGrueso = "entrada";
            $scope.nuevoMaterial.grueso[$scope.nuevoMaterial.grueso.length-1].ClaseCosto = "entrada";
        }
        else if(operacion == "Quitar" && ($scope.nuevoMaterial.grueso.length > 0))
        {
            $scope.nuevoMaterial.grueso.splice($scope.nuevoMaterial.grueso.length-1,1);
        }
    };
    
    $scope.TerminarMaterial = function(nombreInvalido, costoInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.claseMaterial.nombre = "entradaError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";   
        }
        else
        {
            $scope.claseMaterial.nombre = "entrada";
        }
        
        if($scope.nuevoMaterial.grueso.length === 0 && costoInvalido)
        {
            $scope.claseMaterial.costo = "entradaError"; 
            $scope.mensajeError[$scope.mensajeError.length] = "*El costo se debe ser un número entero o un número decimal. Por ejemplo: 50, 45.50, etc.";    
        }
        else
        {
            $scope.claseMaterial.costo = "entrada"; 
        }
        
        var gruesoError = false, costoError = false;
        for(var k=0; k<$scope.nuevoMaterial.grueso.length; k++)
        {
            
            if($scope.nuevoMaterial.grueso[k].Grueso === undefined || $scope.nuevoMaterial.grueso[k].Grueso === "")
            {
                $scope.nuevoMaterial.grueso[k].ClaseGrueso = "entradaError";
                if(!gruesoError)
                {
                    gruesoError = true;
                    $scope.mensajeError[$scope.mensajeError.length] = "*El grueso se debe de indicar con una fraccion. Por ejemplo: \"1 1/4\", \"1/2\", etc.";
                }
            }
            else
            {
                $scope.nuevoMaterial.grueso[k].ClaseGrueso = "entrada";
            }
            
            if($scope.nuevoMaterial.grueso[k].CostoUnidad === undefined || $scope.nuevoMaterial.grueso[k].CostoUnidad === "")
            {
                $scope.nuevoMaterial.grueso[k].ClaseCosto = "entradaError";
                if(!costoError)
                {
                    costoError = true;
                    $scope.mensajeError[$scope.mensajeError.length] = "*El costo se debe ser un número entero o un número decimal. Por ejemplo: 50, 45.50, etc.";
                }
            }
            else
            {
               $scope.nuevoMaterial.grueso[k].ClaseCosto = "entrada"; 
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var i=0; i<$scope.nuevoMaterial.grueso.length; i++)
        {
            for(var j=0; j<$scope.nuevoMaterial.grueso.length; j++)
            {
                if(i != j)
                {
                    if($scope.nuevoMaterial.grueso[i].Grueso == $scope.nuevoMaterial.grueso[j].Grueso)
                    {
                        $scope.nuevoMaterial.grueso[i].ClaseGrueso = "entradaError";
                        $scope.nuevoMaterial.grueso[j].ClaseGrueso = "entradaError";
                        $scope.mensajeError[$scope.mensajeError.length] = "*El grueso " + $scope.nuevoMaterial.grueso[i].Grueso+ " se repite.";
                        return;
                    }
                }
            }
        }
        
        for(var k=0; k<$scope.material.length; k++)
        {
            if($scope.material[k].Nombre.toLowerCase() == $scope.nuevoMaterial.Nombre.toLowerCase() && $scope.material[k].MaterialId != $scope.nuevoMaterial.MaterialId && $scope.material[k].TipoMaterial.TipoMaterialId == $scope.nuevoMaterial.TipoMaterial.TipoMaterialId)
            {
                $scope.claseMaterial.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "*El material " + $scope.nuevoMaterial.TipoMaterial.Nombre + " - " + $scope.nuevoMaterial.Nombre + " ya existe.";
                return;
            }
        }
        
        if($scope.nuevoMaterial.grueso.length > 0 || $scope.materialDeSeleccionado == "Cubierta")
        {
            $scope.nuevoMaterial.CostoUnidad = 0;
        }
        
        if($scope.nuevoMaterial.Activo)
        {
            $scope.nuevoMaterial.Activo = "1";
        }
        else
        {
            $scope.nuevoMaterial.Activo = "0";
        }
        
        for(var i=0; i<$scope.nuevoMaterial.grueso.length; i++)
        {
            if($scope.nuevoMaterial.grueso[i].Activo)
            {
                $scope.nuevoMaterial.grueso[i].Activo = "1";
            }
            else
            {
                $scope.nuevoMaterial.grueso[i].Activo = "0";
            }
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarMaterial();
        }
        else if($scope.operacion == "Editar")
        {
             $scope.EditarMaterial();
        }
        
    };
    
    $scope.AgregarMaterial = function()
    {
        AgregarMaterial($http, CONFIG, $q, $scope.nuevoMaterial).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#MaterialForma').modal('toggle');
                $scope.GetMaterial();
                $scope.GetGruesoMaterial();
                $scope.cerrarMaterialForma();
                $scope.mensaje = "El material se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            $('#mensajeConfigurarMaterial').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeConfigurarMaterial').modal('toggle');
        });
        
    };
    
    $scope.EditarMaterial = function()
    {
        EditarMaterial($http, CONFIG, $q, $scope.nuevoMaterial).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#MaterialForma').modal('toggle');
                $scope.GetMaterial();
                $scope.GetGruesoMaterial();
                $scope.cerrarMaterialForma();
                $scope.mensaje = "El material se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
            $('#mensajeConfigurarMaterial').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeConfigurarMaterial').modal('toggle');
        });
        
        
    };
    
    $scope.cerrarMaterialForma = function()
    {
        $scope.claseMaterial = {tipoMaterial:"dropdownListModal", nombre:"entrada", costo:"entrada"};
        $scope.mensajeError = [];
    };
    
    /*---------------------- Cambiar Activo -------------*/
    $scope.CambiarEstatusActivo = function(seccion, objeto)
    {
        $scope.objetoActivo = objeto;
        $scope.seccionCambiarActivo = seccion;
        
        if($scope.seccionCambiarActivo == "gruesoMaterial")
        {
            $scope.objetoActivo.Nombre = $scope.objetoActivo.Grueso;
        }
        
        if(objeto.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + objeto.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + objeto.Nombre + "?";
        }
        
        $('#modalActivarDesactivarConfigurarMaterial').modal('toggle');
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
        
        if($scope.seccionCambiarActivo == "tipoMaterial")
        {
            datos[1] = $scope.objetoActivo.TipoMaterialId;
            
            ActivarDesactivarTipoMaterial($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El tipo de material se ha actualizado correctamente.";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarMaterial').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarMaterial').modal('toggle');
            });
        }
        
        if($scope.seccionCambiarActivo == "material")
        {
            datos[1] = $scope.objetoActivo.MaterialId;
            
            ActivarDesactivarMaterial($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El material se ha actualizado correctamente.";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarMaterial').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarMaterial').modal('toggle');
            });
        }
        
        if($scope.seccionCambiarActivo == "gruesoMaterial")
        {
            datos[1] = $scope.objetoActivo.GruesoMaterialId;
            
            ActivarDesactivarGruesoMaterial($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El grueso del material se ha actualizado correctamente.";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarMaterial').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarMaterial').modal('toggle');
            });
        }
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
                if(!$scope.permisoUsuario.material.consultar && !$scope.permisoUsuario.tipoMaterial.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.GetTipoMaterial();
                    if($scope.permisoUsuario.material.consultar)
                    {   

                        $scope.GetMaterial();
                        $scope.GetGruesoMaterial();
                        $scope.GetTipoCubierta ();
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
                if(!$scope.permisoUsuario.material.consultar && !$scope.permisoUsuario.tipoMaterial.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.GetTipoMaterial();
                    if($scope.permisoUsuario.material.consultar)
                    {   

                        $scope.GetMaterial();
                        $scope.GetGruesoMaterial();
                        $scope.GetTipoCubierta();
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
var tabMaterial = 
    [
        {titulo:"Tipo Material", referencia: "#TipoMaterial", clase:"active", area:"tipoMaterial"},
        {titulo:"Material Módulos", referencia: "#Material", clase:"", area:"material"},
        {titulo:"Material Cubiertas", referencia: "#MaterialCubierta", clase:"", area:"materialCubierta"}
    ];

function SetMaterialCompleto(material)
{
    var nuevoMaterial  = new Material();
    nuevoMaterial.grueso = [];
    
    var tipoMaterial = new TipoMaterial();
    
    nuevoMaterial.DisponibleCubierta = material.DisponibleCubierta;
    nuevoMaterial.DisponibleModulo = material.DisponibleModulo;
    nuevoMaterial.Nombre = material.Nombre;
    nuevoMaterial.CostoUnidad = material.CostoUnidad;
    nuevoMaterial.TipoMaterial = SetTipoMaterial(material.TipoMaterial);
    nuevoMaterial.Activo = material.Activo;
    nuevoMaterial.MaterialDe = material.MaterialDe;
    
    for(var k=0; k<material.grueso.length; k++)
    {
        nuevoMaterial.grueso[k] = material.grueso[k];
    }
    
    return nuevoMaterial;
}