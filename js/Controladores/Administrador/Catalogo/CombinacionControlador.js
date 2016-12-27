app.controller("CombinacionControlador", function($scope, $http, $q, CONFIG, datosUsuarioPerfil, md5, $rootScope, datosUsuario, $window)
{   
    $rootScope.clasePrincipal = "";  //si esta en el login muestra una cocina de fondo
    
    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false, editar: false, activar:false, agregar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "CatComConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "CatComAgregar")
            {
                $scope.permisoUsuario.agregar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "CatComEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "CatComActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
        }
    };
    
    $scope.titulo = "Combinación de Materiales para Módulos";
    $scope.buscar = "";
    
    $scope.combinacion = [];
    $scope.combinacionMaterialComponente = null;
    $scope.componente = null;
    $scope.material = null;
    $scope.tipoMaterial = null;
    $scope.gruesoMaterial = null;
    
    $scope.ordenarPor = "Nombre";
    $scope.claseCombinacion = {nombre:"entrada"};
    $scope.mostrarComponentePuerta = "";
    $scope.combinacionPorPuerta = null;
    $scope.componentePorPuerta = null;
    $scope.pasoCombinacion = 1;
    
    $scope.mensajeError = [];
    
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
    
    $scope.GetCombinacionPorMaterialComponente = function(combinacionId, operacion)
    {
        GetCombinacionPorMaterialComponente($http, $q, CONFIG, combinacionId, "combinacion").then(function(data)
        {
            $scope.combinacionMaterialComponente = data;
            if(operacion == "editar")
            {
                for(var k=0; k<$scope.combinacionMaterialComponente.length; k++)
                {
                    for(var i=0; i<$scope.material.length; i++)
                    {
                        if($scope.material[i].MaterialId == $scope.combinacionMaterialComponente[k].Material.MaterialId)
                        {
                            $scope.combinacionMaterialComponente[k].Material.Grueso = $scope.material[i].grueso;
                        }
                    }
                    
                    $scope.combinacionMaterialComponente[k].clase = {tipoMaterial:"dropdownListModal", material:"dropdownListModal", grueso:"dropdownListModal"};
                }
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener los consumibles." + error);
            return;
        });
    };
    
    $scope.GetCombinacionPorPuerta = function(combinacionId)
    {
        GetCombinacionPorMaterialComponente($http, $q, CONFIG, combinacionId, "puertaCombinacion").then(function(data)
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
    
    /*---------- Detalles ---------*/
    $scope.MostarDetalles = function(combinacion)
    {
        $scope.nuevaCombinacion = combinacion;
        $scope.GetCombinacionPorMaterialComponente(combinacion.CombinacionMaterialId, "detalles");
        $scope.GetCombinacionPorPuerta(combinacion.CombinacionMaterialId);
    };
    
    $scope.MostraComponentePuerta = function(puerta)
    {
        if(puerta != $scope.mostrarComponentePuerta)
        {
            $scope.mostrarComponentePuerta = puerta;
        }
        else
        {
            $scope.mostrarComponentePuerta = "";
        }
    };
    
    $scope.GetClaseDetallesPuerta = function(puerta)
    {
        if($scope.mostrarComponentePuerta == puerta)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    $scope.FiltarPuerta = function(componente)
    {
        if(componente.Puerta.Nombre == $scope.mostrarComponentePuerta)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    
    /*-------- Ordenar -----------*/
    //cambia el campo por el cual se van a ordenar las combinaciones
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
    
    /*---------Agregar - Editar combinacion ----------------*/
    $scope.AbrirCombinacionMaterialModal = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        $scope.mostrarComponentePuerta = "";
        
        if(operacion == "Agregar")
        {
            $scope.nuevaCombinacion = new CombinacionMaterial();
            $scope.combinacionMaterialComponente = [];
            
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.combinacionMaterialComponente[k] = new CombinacionPorMaterialComponente();
                $scope.combinacionMaterialComponente[k].Componente = SetComponente($scope.componente[k]);
                
                $scope.combinacionMaterialComponente[k].clase = {tipoMaterial:"dropdownListModal", material:"dropdownListModal", grueso:"dropdownListModal"};
            }
            
            $scope.combinacionPorPuerta = [];
            for(var k=0; k<$scope.componentePorPuerta.length; k++)
            {
                $scope.combinacionPorPuerta[k] = new CombinacionPorMaterialComponente();
                
                $scope.combinacionPorPuerta[k].Puerta.PuertaId = $scope.componentePorPuerta[k].PuertaId;
                $scope.combinacionPorPuerta[k].Puerta.Nombre = $scope.componentePorPuerta[k].NombrePuerta;
                $scope.combinacionPorPuerta[k].Puerta.ComponentePorPuertaId = $scope.componentePorPuerta[k].ComponentePorPuertaId;
                $scope.combinacionPorPuerta[k].Puerta.Activo = $scope.componentePorPuerta[k].ActivoPuerta;
                
                $scope.combinacionPorPuerta[k].Componente.ComponenteId = $scope.componentePorPuerta[k].ComponenteId;
                $scope.combinacionPorPuerta[k].Componente.Nombre = $scope.componentePorPuerta[k].NombreComponente;
               
                $scope.combinacionPorPuerta[k].clase = {tipoMaterial:"dropdownListModal", material:"dropdownListModal", grueso:"dropdownListModal"};
                
            }
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaCombinacion = SetCombinacionMaterial(objeto); 
          
            $scope.GetCombinacionPorMaterialComponente(objeto.CombinacionMaterialId, "editar");
            $scope.GetCombinacionPorPuerta(objeto.CombinacionMaterialId);
        }
        
        $('#combinacionMaterialModal').modal('toggle');
    };
    
    $scope.CambiarTipoMaterial = function(tipoMaterial, combinacion)
    {
        if(tipoMaterial == "No Aplica")
        {
            combinacion.Material.TipoMaterial.Nombre = "No Aplica";
            combinacion.Material.TipoMaterial.TipoMaterialId = 0;
            combinacion.Grueso = "No Aplica";
            combinacion.Material.MaterialId = 0;
            combinacion.Material.Nombre = "No Aplica";
        }
        else if(tipoMaterial.Nombre != combinacion.Material.TipoMaterial.Nombre)
        {
            combinacion.Material = new Material();
            combinacion.Material.Grueso = [];
            
            combinacion.Material.TipoMaterial.Nombre = tipoMaterial.Nombre;
            combinacion.Material.TipoMaterial.TipoMaterialId = tipoMaterial.TipoMaterialId;
            
            combinacion.Grueso = ""; 
        }
        
    };
    
    $scope.CambiarMaterial = function(material, combinacion)
    {
        if(combinacion.Material.Nombre != material.Nombre)
        {
        combinacion.Material.Nombre = material.Nombre;
        combinacion.Material.MaterialId = material.MaterialId;
        combinacion.Material.Grueso = material.grueso;
        
            if(material.grueso.length == 0)
            {
                combinacion.Grueso = 1;
            }
            else  
            {
                combinacion.Grueso = "";  
            }
        }
    };
    
    $scope.CambiarGrueso = function(grueso, combinacion)
    {
        combinacion.Grueso = grueso;
    };
    
    $scope.SiguienteCombinacion = function(nombreInvalido)
    {
        $scope.nuevaCombinacion.MaterialComponente = $scope.combinacionMaterialComponente

        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.claseCombinacion.nombre = "entradaError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";  
        }
        else
        {
            $scope.claseCombinacion.nombre = "entrada";
        }
        
        if($scope.mensajeError.length>0)
        {
            return;
        }
        
        for(var k=0; k<$scope.combinacion.length; k++)
        {
            if($scope.combinacion[k].Nombre.toLowerCase() == $scope.nuevaCombinacion.Nombre.toLowerCase() && $scope.combinacion[k].CombinacionMaterialId != $scope.nuevaCombinacion.CombinacionMaterialId)
            {
                $scope.claseCombinacion.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "*La combinación " + $scope.nuevaCombinacion.Nombre + " ya existe."; 
                return;
            }
        }
        
        var datosIncompletos = false;
        
        for(var k=0; k<$scope.nuevaCombinacion.MaterialComponente.length; k++)
        {
            if(!$scope.nuevaCombinacion.MaterialComponente[k].Componente.Activo)
            {
                $scope.CambiarTipoMaterial('No Aplica', $scope.nuevaCombinacion.MaterialComponente[k]);
            }
            else
            {
                if($scope.nuevaCombinacion.MaterialComponente[k].Material.TipoMaterial.Nombre.length === 0)
                {
                    datosIncompletos = true;
                    $scope.nuevaCombinacion.MaterialComponente[k].clase.tipoMaterial = "dropdownListModalError";
                }
                else
                {
                  $scope.nuevaCombinacion.MaterialComponente[k].clase.tipoMaterial = "dropdownListModal";  
                }
                if($scope.nuevaCombinacion.MaterialComponente[k].Material.Nombre.length === 0)
                {
                    datosIncompletos = true;
                    $scope.nuevaCombinacion.MaterialComponente[k].clase.material = "dropdownListModalError";
                }
                else
                {
                  $scope.nuevaCombinacion.MaterialComponente[k].clase.material = "dropdownListModal";  
                }
                if($scope.nuevaCombinacion.MaterialComponente[k].Grueso.length === 0)
                {
                    $scope.nuevaCombinacion.MaterialComponente[k].clase.grueso = "dropdownListModalError";
                    datosIncompletos = true;
                }
                else
                {
                  $scope.nuevaCombinacion.MaterialComponente[k].clase.grueso = "dropdownListModal";  
                }
            }
        }
        
        if(datosIncompletos)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Completa todos los datos"; 
            return;
        }
                
        $scope.pasoCombinacion++;
    };
    
    $scope.ValidarCombinacionPaso2 = function()
    {
        $scope.mensajeError = [];
       
        var datosIncompletos = false;
        
        for(var k=0; k<$scope.combinacionPorPuerta.length; k++)
        {
            if($scope.combinacionPorPuerta[k].Puerta.Activo === false || $scope.combinacionPorPuerta[k].Puerta.Activo == "0")
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
            $scope.mensajeError[$scope.mensajeError.length] = "*Completa todos los datos."; 
            return false;
        }
        else
        {
            return true;        
        }
    };
    
    $scope.TerminarCombinacion = function()
    {
        if(!$scope.ValidarCombinacionPaso2())
        {
            return;
        }
        
        $scope.nuevaCombinacion.puerta = $scope.combinacionPorPuerta;
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarCombinacionMaterial();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarCombinacionMaterial();
        }
    };
    
    $scope.AnteriorPuerta = function()
    {
        $scope.pasoCombinacion--;
        $scope.mensajeError = [];
    };
    
    $scope.AgregarCombinacionMaterial = function()
    {
        AgregarCombinacionMaterial($http, CONFIG, $q, $scope.nuevaCombinacion).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetCombinacionMaterial();
                $scope.GetCombinacionPorMaterialComponente();  
               
                $scope.CerrarCombinacionMaterialModal();
                $('#combinacionMaterialModal').modal('toggle');
                $scope.mensaje = "La combinación de materiales se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeCombinacionMaterial').modal('toggle');
    };
    
    $scope.EditarCombinacionMaterial = function()
    {
        EditarCombinacionMaterial($http, CONFIG, $q, $scope.nuevaCombinacion).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetCombinacionMaterial();
                $scope.GetCombinacionPorMaterialComponente();
                
                $scope.CerrarCombinacionMaterialModal();
                $('#combinacionMaterialModal').modal('toggle');
                $scope.mensaje = "La combinación de materiales se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeCombinacionMaterial').modal('toggle');
    };
    
    $scope.CerrarCombinacionMaterialModal = function()
    {
        $scope.pasoCombinacion = 1;
        $scope.mostrarComponentePuerta = "";
        $scope.mensajeError = [];
        $scope.claseCombinacion.nombre = "entrada";
    };
    
    /*--------Activar-Desactivar----------*/
    $scope.CambiarEstatusActivoModal = function()
    {
        $scope.nuevaCombinacion.Activo = !$scope.nuevaCombinacion.Activo;
        $scope.CambiarEstatusActivo($scope.nuevaCombinacion); 
    };
    
    $scope.CambiarEstatusActivo = function(combinacion)
    {   
        $scope.nuevaCombinacion = combinacion;
        
        if(combinacion.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + combinacion.Nombre + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + combinacion.Nombre + "?";
        }
        
        $('#CambiarActivoCombinacionModal').modal('toggle');
    };
    
    $scope.CancelarCambiarActivo = function()
    {
        $scope.nuevaCombinacion.Activo = !$scope.nuevaCombinacion.Activo;
    };
    
    $scope.ConfirmarActualizarActivo = function()
    {
        var datos = [];
        
        if($scope.nuevaCombinacion.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;  
        }
        
        datos[1] = $scope.nuevaCombinacion.CombinacionMaterialId;

        ActivarDesactivarCombinacionMaterial($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "La combinación de material se ha actualizado correctamente.";
            }
            else
            {
                $scope.nuevaCombinacion.Activo = !$scope.nuevaCombinacion.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            } 
            $('#mensajeCombinacionMaterial').modal('toggle');
        }).catch(function(error)
        {
            $scope.nuevaCombinacion.Activo = !$scope.nuevaCombinacion.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeCombinacionMaterial').modal('toggle');
        });
        
    };
    
    
    /*------Catálogos auxiliares------*/
    $scope.GetComponentesPorPuertaComponente = function()      
    {
        GetComponentesPorPuertaComponente($http, $q, CONFIG).then(function(data)
        {
            $scope.componentePorPuerta = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetComponente = function()      
    {
        GetTodosComponente($http, $q, CONFIG).then(function(data)
        {
            $scope.componente = data;
        }).catch(function(error)
        {
            alert(error);
        });
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
    
    //--------Inicializar--------
    $scope.InicializarModuloCombinacion = function()
    {
        $scope.GetCombinacionMaterial();  

        $scope.GetComponente();
        $scope.GetTipoMaterial();
        $scope.GetMaterial();
        $scope.GetGruesoMaterial();
        
        $scope.GetComponentesPorPuertaComponente();
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
                    $scope.InicializarModuloCombinacion();
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
    
    //destecta cuando los datos del usuario cambian
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
                if(!$scope.permisoUsuario.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.InicializarModuloCombinacion();
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