app.controller("CombinacionControlador", function($scope, $http, $q, CONFIG, datosUsuarioPerfil, md5, $rootScope, datosUsuario, $window)
{   
    $rootScope.clasePrincipal = "";  //si esta en el login muestra una cocina de fondo
    
    $scope.titulo = "Combinación de Materiales para Módulos";
    $scope.buscar = "";
    
    $scope.combinacion = null;
    $scope.combinacionMaterialComponente = null;
    $scope.componente = null;
    $scope.material = null;
    $scope.tipoMaterial = null;
    $scope.gruesoMaterial = null;
    
    $scope.ordenarPor = "Nombre";
    $scope.claseCombinacion = {nombre:"entrada"};
    
    $scope.mensajeError = [];
    
    $scope.GetCombinacionMaterial = function()          
    {
        GetCombinacionMaterial($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.combinacion = data;
                if($scope.combinacionMaterialComponente !== null)
                {
                    $scope.SetMaterialPorComponente();
                }
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetCombinacionPorMaterialComponente = function()          
    {
        GetCombinacionPorMaterialComponente($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.combinacionMaterialComponente = data;
                if($scope.combinacion !== null)
                {
                    $scope.SetMaterialPorComponente();
                }
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetMaterialPorComponente = function()
    {
        for(var i=0; i<$scope.combinacion.length; i++)
        {
            $scope.combinacion[i].MaterialComponente = [];
            for(var j=0; j<$scope.combinacionMaterialComponente.length; j++)
            {
                if($scope.combinacion[i].CombinacionMaterialId == $scope.combinacionMaterialComponente[j].CombinacionMaterial.CombinacionMaterialId)
                {
                    $scope.combinacion[i].MaterialComponente[$scope.combinacion[i].MaterialComponente.length] =  $scope.combinacionMaterialComponente[j];
                }
            }
        }
    };
    
    /*---------- Detalles ---------*/
    $scope.MostarDetalles = function(combinacion)
    {
        $scope.nuevaCombinacion = combinacion;
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
        
        if(operacion == "Agregar")
        {
            $scope.nuevaCombinacion = new CombinacionMaterial();
            $scope.nuevaCombinacion.MaterialComponente = [];
            
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.nuevaCombinacion.MaterialComponente[k] = new CombinacionPorMaterialComponente();
                $scope.nuevaCombinacion.MaterialComponente[k].Componente = SetComponente($scope.componente[k]);
                
                $scope.nuevaCombinacion.MaterialComponente[k].clase = {tipoMaterial:"dropdownListModal", material:"dropdownListModal", grueso:"dropdownListModal"};
            }
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaCombinacion = SetCombinacionMaterial(objeto); 
            $scope.nuevaCombinacion.MaterialComponente = [];
            
            for(var k=0; k<objeto.MaterialComponente.length; k++)
            {
                $scope.nuevaCombinacion.MaterialComponente[k] = new CombinacionPorMaterialComponente();
                
                $scope.nuevaCombinacion.MaterialComponente[k].Grueso = objeto.MaterialComponente[k].Grueso;
                $scope.nuevaCombinacion.MaterialComponente[k].CombinacionMaterialId = objeto.MaterialComponente[k].CombinacionMaterialId;
                
                $scope.nuevaCombinacion.MaterialComponente[k].Componente = SetComponente(objeto.MaterialComponente[k].Componente);
                $scope.nuevaCombinacion.MaterialComponente[k].Material = SetMaterial(objeto.MaterialComponente[k].Material);
                $scope.nuevaCombinacion.MaterialComponente[k].Material.TipoMaterial = SetTipoMaterial(objeto.MaterialComponente[k].Material.TipoMaterial);
            
                
                for(var i=0; i<$scope.material.length; i++)
                {
                    if($scope.material[i].MaterialId == $scope.nuevaCombinacion.MaterialComponente[k].Material.MaterialId)
                    {
                        $scope.nuevaCombinacion.MaterialComponente[k].Material.Grueso = $scope.material[i].grueso;
                    }
                }
                
                $scope.nuevaCombinacion.MaterialComponente[k].clase = {tipoMaterial:"dropdownListModal", material:"dropdownListModal", grueso:"dropdownListModal"};
            }
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
        combinacion.Material.Nombre = material.Nombre;
        combinacion.Material.MaterialId = material.MaterialId;
        combinacion.Material.Grueso = material.grueso;
        
        if(material.grueso.length == 0)
        {
            combinacion.Grueso = 1;
        }
    };
    
    $scope.CambiarGrueso = function(grueso, combinacion)
    {
        combinacion.Grueso = grueso;
    };
    
    $scope.TerminarCombinacion = function(nombreInvalido)
    {
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
            if($scope.combinacion[k].Nombre == $scope.nuevaCombinacion.Nombre && $scope.combinacion[k].CombinacionMaterialId != $scope.nuevaCombinacion.CombinacionMaterialId)
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
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarCombinacionMaterial();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarCombinacionMaterial();
        }
    };
    
    $scope.AgregarCombinacionMaterial = function()
    {
        AgregarCombinacionMaterial($http, CONFIG, $q, $scope.nuevaCombinacion).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetCombinacionMaterial();
                $scope.GetCombinacionPorMaterialComponente();  
               
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
    $scope.GetCombinacionMaterial();
    $scope.GetCombinacionPorMaterialComponente();    
    
    $scope.GetComponente();
    $scope.GetTipoMaterial();
    $scope.GetMaterial();
    $scope.GetGruesoMaterial();
   
});