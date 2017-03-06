app.controller("CostoModuloControlador", function($scope, $http, $q, CONFIG, datosUsuarioPerfil, md5, $rootScope, datosUsuario, $window, $location)
{
    $rootScope.clasePrincipal = "";  //si esta en el login muestra una cocina de fondo
    
    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "CatModConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
        }
    };
    
    $scope.titulo = "Calcular Costos de Módulos";
    $scope.modulo = [];
    $scope.tipoModulo = [];
    $scope.combinacion = [];
    $scope.puerta = [];
    
    $scope.costosMedidas = null;
    $scope.costosPuerta = null;
    $scope.medidaVer = null;
    
    $scope.moduloSeleccionado = new Modulo();
    $scope.puertaSeleccionada = null;
    
    /*--------- Catálogos -------------*/
    $scope.GetModulo = function()          
    {
        GetModulo($http, $q, CONFIG).then(function(data)
        {
            $scope.modulo = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetTipoModulo = function()      
    {
        GetTipoModulo($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoModulo = data;
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
    
    $scope.GetPuerta = function()      
    {
        GetPuerta($http, $q, CONFIG).then(function(data)
        {
            //console.log(data);
            $scope.puerta = data;
            for(var k=0; k<$scope.puerta.length; k++)
            {
                if($scope.puerta[k].Activo)
                {
                    $scope.GetComponentePorPuerta($scope.puerta[k].PuertaId, $scope.puerta[k]);
                    $scope.GetCombinacionPorPuerta($scope.puerta[k].PuertaId, $scope.puerta[k]);
                }
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
                                          
    /*----------------- Datos de puertas -------------------*/
    $scope.GetComponentePorPuerta = function(puertaId, puerta)      
    {
        GetComponentePorPuerta($http, $q, CONFIG, puertaId).then(function(data)
        {
            
            puerta.Seccion = $scope.SetComponentePuerta(data);
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetCombinacionPorPuerta = function(puertaId, puerta)
    {
        GetCombinacionPorMaterialComponente($http, $q, CONFIG, puertaId, "puerta").then(function(data)
        {
            puerta.Combinacion = $scope.SetCombinacionPuerta(data);
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener los componentes." + error);
            return;
        });
    };
    
    $scope.SetCombinacionPuerta = function(data)
    {
        var combinacion = [];
        for(var k=0; k<data.length; k++)
        {
            combinacion[k] = new Object();
            combinacion[k].CombinacionMaterialId = data[k].CombinacionMaterial.CombinacionMaterialId;
            combinacion[k].Grueso = data[k].Grueso;
            combinacion[k].ComponenteId = data[k].Componente.ComponenteId;
            $scope.GetCostoMaterial(data[k].Material.MaterialId, data[k].Grueso, combinacion[k]);
        }
        
        return combinacion;
    };
    
    $scope.SetComponentePuerta = function(data)
    {
        var seccion = new Object();
        var puerta = new Object();
        var cajon = new Object();
        
        puerta.Componente = [];
        puerta.Componente[0] = new Object();
        puerta.Componente[1] = new Object();
        
        cajon.Componente = [];
        cajon.Componente[0] = new Object();
        cajon.Componente[1] = new Object();
        cajon.Componente[2] = new Object();
        cajon.Componente[3] = new Object();
        
        puerta.Componente[0].Pieza = [];
        puerta.Componente[0].ComponenteId = "2";
        puerta.Componente[0].Nombre = "Frente Puerta";
        
        puerta.Componente[1].Pieza = [];
        puerta.Componente[1].ComponenteId = "3";
        puerta.Componente[1].Nombre = "Panel Puerta";
        
        cajon.Componente[0].Pieza = [];
        cajon.Componente[0].ComponenteId = "4";
        cajon.Componente[0].Nombre = "Frente Cajón";
        
        cajon.Componente[1].Pieza = [];
        cajon.Componente[1].ComponenteId = "5";
        cajon.Componente[1].Nombre = "Panel Cajón";
        
        cajon.Componente[2].Pieza = [];
        cajon.Componente[2].ComponenteId = "6";
        cajon.Componente[2].Nombre = "Interior Cajón";
        
        cajon.Componente[3].Pieza = [];
        cajon.Componente[3].ComponenteId = "12";
        cajon.Componente[3].Nombre = "Piso Interior Cajón";
        
        var id;
        for(var k=0; k<data.length; k++)
        {
           id = parseInt(data[k].ComponenteId);
            
            switch (id)
            {
                case 2:
                    puerta.Componente[0].Pieza[puerta.Componente[0].Pieza.length] = new Object();
                    puerta.Componente[0].Pieza[puerta.Componente[0].Pieza.length-1] = data[k];
                    break;
                    
                case 3:
                    puerta.Componente[1].Pieza[puerta.Componente[1].Pieza.length] = new Object();
                    puerta.Componente[1].Pieza[puerta.Componente[1].Pieza.length-1] = data[k];
                    break;
                    
                case 4:
                    cajon.Componente[0].Pieza[cajon.Componente[0].Pieza.length] = new Object();
                    cajon.Componente[0].Pieza[cajon.Componente[0].Pieza.length-1] = data[k];
                    break;
                    
                case 5:
                    cajon.Componente[1].Pieza[cajon.Componente[1].Pieza.length] = new Object();
                    cajon.Componente[1].Pieza[cajon.Componente[1].Pieza.length-1] = data[k];
                    break;
                    
                case 6:
                    cajon.Componente[2].Pieza[cajon.Componente[2].Pieza.length] = new Object();
                    cajon.Componente[2].Pieza[cajon.Componente[2].Pieza.length-1] = data[k];
                    break;
                    
                case 12:
                    cajon.Componente[3].Pieza[cajon.Componente[3].Pieza.length] = new Object();
                    cajon.Componente[3].Pieza[cajon.Componente[3].Pieza.length-1] = data[k];
                    break;
                    
                    
                    
                default:
                    break;
            }
        }
        
        seccion.Puerta = puerta;
        seccion.Cajon = cajon;
        return seccion;
    };
    
    /*------------- Informacion del módulo -------------*/
    $scope.GetMedidasPorModulo = function(moduloId)
    {
        GetMedidasPorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.moduloSeleccionado.Medida = data;
            
        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    $scope.GetPartePorModulo = function(moduloId)
    {
        var q = $q.defer();
        GetPartePorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.moduloSeleccionado.Parte = data;
            $scope.GetCombinacionPorMaterialComponente("1", $scope.moduloSeleccionado.Parte);
            q.resolve("listo");
        }).catch(function(error)
        {
            q.resolve("error");
            alert("Ha ocurrido un error." + error);
            return;
        });
        
        return q.promise;
    };
    
    $scope.GetComponentePorModulo = function(moduloId)
    {
        var q = $q.defer();
        GetComponentePorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.moduloSeleccionado.Componente = data;
            
            for(var k=0; k<$scope.moduloSeleccionado.Componente.length; k++)
            {
                $scope.GetCombinacionPorMaterialComponente($scope.moduloSeleccionado.Componente[k].Componente.ComponenteId, $scope.moduloSeleccionado.Componente[k]);
                $scope.GetPiezaPorComponente($scope.moduloSeleccionado.Componente[k].Componente.ComponenteId, $scope.moduloSeleccionado.Componente[k]);
            }
            q.resolve("listo");
        }).catch(function(error)
        {
            q.resolve("listo");
            alert("Ha ocurrido un error." + error);
            return;
        });
        
        return q.promise;
    };
    
    $scope.GetCombinacionPorMaterialComponente = function(componenteId, componente)          
    {
        var q = $q.defer();
        
        GetCombinacionPorMaterialComponente($http, $q, CONFIG, componenteId, "componente").then(function(data)
        {
            componente.Combinacion = data;
            
            for(var k=0; k<data.length; k++)
            {
                $scope.GetCostoMaterial(data[k].Material.MaterialId, data[k].Grueso, componente.Combinacion[k]);
            }
                
            q.resolve("listo");
        }).catch(function(error)
        {
            alert(error);
            q.resolve(error);
        });
        return q.promise;
    };
        
    $scope.GetCostoMaterial = function(materialId, grueso, combinacion)
    {
        var q = $q.defer();
        
        var datos = [];
        datos[0] = materialId;
        datos[1] = grueso;
        
        GetCostoMaterial($http, $q, CONFIG, datos).then(function(data)
        {
            combinacion.CostoUnidad = parseFloat(data[0].CostoUnidad);
                
            q.resolve("listo");
        }).catch(function(error)
        {
            alert(error);
            q.resolve(error);
        });
        return q.promise;
    };
    
    $scope.GetPiezaPorComponente = function(componenteId, componente)
    {
        
        GetPiezaPorComponente($http, $q, CONFIG, componenteId).then(function(data)
        {
            componente.Pieza = data;
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener las piezas del componente." + error);
            return;
        });
    };
    
     $scope.GetSeccionPorModulo = function(moduloId)
    {
        var q = $q.defer();
        
        GetSeccionPorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.moduloSeleccionado.Seccion = data;

            for(var k=0; k<data.length; k++)
            {   
                $scope.GetLuzPorSeccion($scope.moduloSeleccionado.Seccion[k].SeccionPorModuloId, k).then(function(respuesta)
                {
                    if(respuesta == (data.length-1))
                    {
                        q.resolve("listo"); 
                    }
                });
                
            } 
        }).catch(function(error)
        {
            q.resolve("error");  
            alert("Ha ocurrido un error." + error);
            return;
        });
        
        return q.promise;
    };
    
    $scope.GetLuzPorSeccion = function(seccionId, index)
    {
        var q = $q.defer();
        GetLuzPorSeccion($http, $q, CONFIG, seccionId).then(function(data)
        {
            $scope.moduloSeleccionado.Seccion[index].Luz = data;
            q.resolve(index);  
        }).catch(function(error)
        {
            q.resolve("error");  
            alert("Ha ocurrido un error." + error);
            return;
        });
        return q.promise;
    };
    
    /*------ Seccionar caracteristicas --------*/
    $scope.CambiarTipoModulo = function(tipo)
    {
        if($scope.moduloSeleccionado.TipoModulo.TipoModuloId != tipo.TipoModuloId)
        {
            $scope.moduloSeleccionado = new Modulo();
            $scope.moduloSeleccionado.TipoModulo = tipo;
        }
    };
    
    $scope.CambiarModulo = function(modulo)
    {
        if(modulo.ModuloId != $scope.moduloSeleccionado.ModuloId)
        {
            $scope.moduloSeleccionado = modulo;

            $scope.GetMedidasPorModulo(modulo.ModuloId);
            $scope.GetComponentePorModulo(modulo.ModuloId);
            $scope.GetPartePorModulo(modulo.ModuloId);
            $scope.GetSeccionPorModulo(modulo.ModuloId);
            
            modulo.Entrepano = new Object();
            $scope.GetCombinacionPorMaterialComponente("9", modulo.Entrepano);  
        }
        
        //console.log($scope.moduloSeleccionado);
    };
    
    $scope.CambiarPuerta = function(puerta)
    {
        $scope.puertaSeleccionada = puerta;
    };
    
    /*--------------------------------------- PUERTAS ----------------------------------*/
    /*$scope.SetSeccionPuerta = function()
    {  
        for(var k=0; k<$scope.moduloSeleccionado.Seccion.length; k++)
        {
            $scope.moduloSeleccionado.Seccion[k].Puerta = [];
            if($scope.moduloSeleccionado.Seccion[k].SeccionModulo.SeccionModuloId == "1" || $scope.moduloSeleccionado.Seccion[k].SeccionModulo.SeccionModuloId == "2")
            {
                var iPuerta = 0; 
                
                for(var i=0; i<$scope.puerta.length; i++)
                {
                    if($scope.puerta[i].Activo)
                    {
                        $scope.moduloSeleccionado.Seccion[k].Puerta[iPuerta] = new Object();
                        $scope.moduloSeleccionado.Seccion[k].Puerta[iPuerta].Componente = []; 
                        $scope.moduloSeleccionado.Seccion[k].Puerta[iPuerta].PuertaId = $scope.puerta[i].PuertaId; 
                        $scope.moduloSeleccionado.Seccion[k].Puerta[iPuerta].Nombre = $scope.puerta[i].Nombre; 
                        $scope.moduloSeleccionado.Seccion[k].Puerta[iPuerta].Combinacion = $scope.puerta[i].Combinacion; 
                        var iComponente = 0;
                        for(var j=0; j<$scope.puerta[i].Componente.length; j++)
                        {
                            if($scope.moduloSeleccionado.Seccion[k].SeccionModulo.SeccionModuloId == "1")
                            {
                                if($scope.puerta[i].Componente[j].NombreComponente == "Frente Puerta" || $scope.puerta[i].Componente[j].NombreComponente == "Panel Puerta" )
                                {
                                    $scope.moduloSeleccionado.Seccion[k].Puerta[iPuerta].Componente[iComponente] = new Object();
                                    $scope.moduloSeleccionado.Seccion[k].Puerta[iPuerta].Componente[iComponente] = $scope.puerta[i].Componente[j];
                                    iComponente++;
                                }
                            }
                            if($scope.moduloSeleccionado.Seccion[k].SeccionModulo.SeccionModuloId == "2")
                            {
                                if($scope.puerta[i].Componente[j].NombreComponente == "Frente Cajón" || $scope.puerta[i].Componente[j].NombreComponente == "Panel Cajón" || $scope.puerta[i].Componente[j].NombreComponente == "Piso Interior Cajón" || $scope.puerta[i].Componente[j].NombreComponente == "Interior Cajón")
                                {
                                    $scope.moduloSeleccionado.Seccion[k].Puerta[iPuerta].Componente[iComponente] = new Object();
                                    $scope.moduloSeleccionado.Seccion[k].Puerta[iPuerta].Componente[iComponente] = $scope.puerta[i].Componente[j];
                                    iComponente++;
                                }
                            }
                        }
                        iPuerta++;
                    }
                }
            }
        }
        
        console.log($scope.moduloSeleccionado.Seccion);
    };*/
    $scope.AgruparCombinacionComponentePuerta = function()
    {
        for(var k=0; k<$scope.puerta.length; k++)
        {
            if($scope.puerta[k].Activo)
            {
                for(var j=0; j<$scope.puerta[k].Seccion.Puerta.Componente.length; j++)
                {
                    $scope.puerta[k].Seccion.Puerta.Componente[j].Combinacion = [];
                }

                for(var j=0; j<$scope.puerta[k].Seccion.Cajon.Componente.length; j++)
                {
                    $scope.puerta[k].Seccion.Cajon.Componente[j].Combinacion = [];
                }

                for(var i=0; i<$scope.puerta[k].Combinacion.length; i++)
                {
                    for(var j=0; j<$scope.puerta[k].Seccion.Puerta.Componente.length; j++)
                    {
                        if($scope.puerta[k].Seccion.Puerta.Componente[j].ComponenteId == $scope.puerta[k].Combinacion[i].ComponenteId)
                        {
                            var index = $scope.puerta[k].Seccion.Puerta.Componente[j].Combinacion.length;
                            $scope.puerta[k].Seccion.Puerta.Componente[j].Combinacion[index] = new Object();
                            $scope.puerta[k].Seccion.Puerta.Componente[j].Combinacion[index] = $scope.puerta[k].Combinacion[i];
                            break;
                        }
                    }
                    
                    for(var j=0; j<$scope.puerta[k].Seccion.Cajon.Componente.length; j++)
                    {
                        if($scope.puerta[k].Seccion.Cajon.Componente[j].ComponenteId == $scope.puerta[k].Combinacion[i].ComponenteId)
                        {
                            var index = $scope.puerta[k].Seccion.Cajon.Componente[j].Combinacion.length;
                            $scope.puerta[k].Seccion.Cajon.Componente[j].Combinacion[index] = new Object();
                            $scope.puerta[k].Seccion.Cajon.Componente[j].Combinacion[index] = $scope.puerta[k].Combinacion[i];
                            break;
                        }
                    }
                }
            }
        }
        
        //console.log($scope.puerta);
    };
    
    $scope.AbrirCostoPuerta = function(medida)
    {
        $scope.medidaVer = medida;
        //console.log($scope.medidaVer);
        $('#CostoPuerta').modal('toggle');
    };
    
    /*----------------------------- Calcular Costos ----------------------------------------*/
    $scope.CalcularCostos = function()
    {
        $scope.moduloSeleccionado.Entrepano = $scope.SetCombinacionEntrepano($scope.moduloSeleccionado.Entrepano );
        $scope.AgruparCombinacionComponentePuerta();
        //$scope.SetSeccionPuerta();
        
        for(var k=0; k<$scope.moduloSeleccionado.Medida.length; k++)
        {
            $scope.SustituirFormula($scope.moduloSeleccionado.Medida[k], $scope.moduloSeleccionado.Seccion);
        }
        
        //console.log($scope.moduloSeleccionado.Medida);
        //console.log($scope.moduloSeleccionado.Entrepano);
    };
    
    $scope.SustituirFormula = function( medida, seccion)
    {
        $scope.CalcularCostoPuerta( medida);
        
        var parte = $scope.SetParte($scope.moduloSeleccionado.Parte, medida.Ancho, medida.Alto);
        var componente = $scope.SetComponente($scope.moduloSeleccionado.Componente);
        var peinazoVertical = $scope.SetPeinazoVertical(seccion, medida.Alto);
        var entrepano = $scope.SetEntrepano(parte, medida.Ancho, medida.Alto, medida.Profundo, seccion);
        
        $scope.SutituirModuloMedida(componente, medida.Ancho, medida.Alto, medida.Profundo);
        $scope.SutituirParte(parte, componente);
        
        medida.Combinacion = [];
        for(var k=0; k<$scope.combinacion.length; k++)
        {
            if($scope.combinacion[k].Activo)
            {
                var indexParte, indexEntepano;
                for(var i=0; i<parte.Combinacion.length; i++)
                {
                    if(parte.Combinacion[i].CombinacionMaterialId == $scope.combinacion[k].CombinacionMaterialId)
                    {
                        indexParte = i;
                        break;
                    }
                }
                
                for(var i=0; i<$scope.moduloSeleccionado.Entrepano.length; i++)
                {
                    if($scope.moduloSeleccionado.Entrepano[i].CombinacionMaterialId ==  $scope.combinacion[k].CombinacionMaterialId)
                    {
                        indexEntepano = i;
                        break;
                    }
                }
                
                $scope.SustituirComponente(componente, parte.Combinacion[indexParte], $scope.combinacion[k].CombinacionMaterialId);
                
                for(var j=0; j<componente.length; j++)
                {
                    for(var i=0; i<componente[j].Pieza.length; i++)
                    {
                        $scope.SustituirPieza(componente[j].Pieza[i], componente[j].Pieza);
                    }
                }
                
                $scope.combinacion[k].Componente = [];
                $scope.combinacion[k].CostoTotal = 0;

                for(var i=0; i<componente.length; i++)
                {
                    $scope.combinacion[k].Componente[i]  = new Object();
                    $scope.combinacion[k].Componente[i].ComponenteId = componente[i].ComponenteId;
                    $scope.combinacion[k].Componente[i].Consumo = 0;
                    $scope.combinacion[k].Componente[i].Costo = 0;

                    for(var j=0; j<componente[i].Combinacion.length; j++)
                    {
                        if(componente[i].Combinacion[j].CombinacionMaterialId == $scope.combinacion[k].CombinacionMaterialId)
                        {
                            $scope.combinacion[k].Componente[i].Costo = componente[i].Combinacion[j].CostoUnidad;
                        }
                    }

                    for(var j=0; j<componente[i].Pieza.length; j++)
                    {
                        $scope.combinacion[k].Componente[i].Consumo += (componente[i].Pieza[j].AnchoNuevo * componente[i].Pieza[j].LargoNuevo * parseInt(componente[i].Pieza[j].Cantidad))/144.0;
                    }

                    $scope.combinacion[k].CostoTotal += $scope.combinacion[k].Componente[i].Costo * $scope.combinacion[k].Componente[i].Consumo;
                }

                var i = $scope.combinacion[k].Componente.length;

                $scope.combinacion[k].Componente[i]  = new Object();
                $scope.combinacion[k].Componente[i].ComponenteId = "1";
                $scope.combinacion[k].Componente[i].Consumo = 0;
                $scope.combinacion[k].Componente[i].Costo = 0;

                for(var l=0; l<parte.Combinacion.length; l++)
                {
                    if(parte.Combinacion[l].CombinacionMaterialId == $scope.combinacion[k].CombinacionMaterialId)
                    {
                        $scope.combinacion[k].Componente[i].Costo = parte.Combinacion[l].CostoUnidad;
                    }
                }

                for(var l=0; l<parte.Parte.length; l++)
                {
                    $scope.combinacion[k].Componente[i].Consumo += (parte.Parte[l].Ancho * parte.Parte[l].Largo)/144.0;
                }

                $scope.combinacion[k].CostoTotal += $scope.combinacion[k].Componente[i].Costo * $scope.combinacion[k].Componente[i].Consumo;

                medida.Combinacion[k] = new Object();
                medida.Combinacion[k].CombinacionMaterialId = $scope.combinacion[k].CombinacionMaterialId;
                medida.Combinacion[k].Nombre = $scope.combinacion[k].Nombre;
                medida.Combinacion[k].Activo = $scope.combinacion[k].Activo;
                medida.Combinacion[k].CostoTotal = $scope.combinacion[k].CostoTotal;
                
                //peinazo Vertical
                medida.Combinacion[k].CostoTotal += (peinazoVertical*parte.Combinacion[indexParte].CostoUnidad);
                
                //entrepano
                medida.Combinacion[k].CostoTotal += entrepano.ConsumoTotal*$scope.moduloSeleccionado.Entrepano[indexEntepano].CostoUnidad;
                
                medida.Combinacion[k].CostoTotal = medida.Combinacion[k].CostoTotal.toFixed(2);
                medida.Combinacion[k].CostoTotal = parseFloat(medida.Combinacion[k].CostoTotal);
            }
        }
        //console.log($scope.combinacion);
        //console.log(componente);
    };
    
    /*---------------puerta -------------------------*/
    $scope.CalcularCostoPuerta = function(medida)
    {
        medida.Puerta = [];
        var indexPuerta = 0;
        
        for(var i=0; i<$scope.puerta.length; i++)
        {
            if($scope.puerta[i].Activo)
            {
                medida.Puerta[indexPuerta] = new Object();
                medida.Puerta[indexPuerta].PuertaId = $scope.puerta[i].PuertaId;
                medida.Puerta[indexPuerta].Nombre = $scope.puerta[i].Nombre;
                medida.Puerta[indexPuerta].Componente = [];
                var indexComponente = 0;
                
                for(var k=0; k<$scope.moduloSeleccionado.Seccion.length; k++)
                {
                    var seccion = $scope.SetSeccion($scope.moduloSeleccionado.Seccion[k], medida, seccion);
                    var componente;
                    
                    if(seccion.SeccionModuloId == "1")
                    {
                        componente = $scope.SustituirValoresComponentePuerta($scope.puerta[i].Seccion.Puerta, medida, seccion);
                    }
                    else if(seccion.SeccionModuloId == "2")
                    {
                        componente = $scope.SustituirValoresComponentePuerta($scope.puerta[i].Seccion.Cajon, medida, seccion);
                    }
                    
                    for(var l=0; l<componente.length; l++)
                    {
                        medida.Puerta[indexPuerta].Componente[indexComponente] = new Object();
                        medida.Puerta[indexPuerta].Componente[indexComponente].Combinacion = [];
                        
                        for(var j=0; j<componente[l].Combinacion.length; j++)
                        {
                            medida.Puerta[indexPuerta].Componente[indexComponente].Combinacion[j] = new Object();
                            medida.Puerta[indexPuerta].Componente[indexComponente].Combinacion[j].CombinacionMaterialId = componente[l].Combinacion[j].CombinacionMaterialId;
                            medida.Puerta[indexPuerta].Componente[indexComponente].Combinacion[j].Nombre = componente[l].Combinacion[j].Nombre;
                            medida.Puerta[indexPuerta].Componente[indexComponente].Combinacion[j].Costo = componente[l].Consumo*componente[l].Combinacion[j].CostoUnidad;
                        }
                        
                        indexComponente++;
                    }
                }
                indexPuerta++;
            }
        }
        
        
        for(var i=0; i<medida.Puerta.length; i++)
        {
            medida.Puerta[i].Combinacion = [];
            
            
            for(var k=0; k<$scope.combinacion.length; k++)
            {
                medida.Puerta[i].Combinacion[k]  = new Object();
                medida.Puerta[i].Combinacion[k].CombinacionMaterialId = $scope.combinacion[k].CombinacionMaterialId;
                medida.Puerta[i].Combinacion[k].Nombre = $scope.combinacion[k].Nombre;
                medida.Puerta[i].Combinacion[k].Activo = $scope.combinacion[k].Activo;
                medida.Puerta[i].Combinacion[k].CostoTotal = 0;
                
                for(var j=0; j<medida.Puerta[i].Componente.length; j++)
                {
                    for(var l=0; l<medida.Puerta[i].Componente[j].Combinacion.length; l++)
                    {
                        if(medida.Puerta[i].Componente[j].Combinacion[l].CombinacionMaterialId == $scope.combinacion[k].CombinacionMaterialId)
                        {
                            medida.Puerta[i].Combinacion[k].CostoTotal += medida.Puerta[i].Componente[j].Combinacion[l].Costo;
                        }
                    }
                }
                
                medida.Puerta[i].Combinacion[k].CostoTotal = medida.Puerta[i].Combinacion[k].CostoTotal.toFixed(2);
                medida.Puerta[i].Combinacion[k].CostoTotal = parseFloat(medida.Puerta[i].Combinacion[k].CostoTotal);
            }
        }
            
        //console.log(medida);
    };
    
    $scope.SustituirValoresComponentePuerta = function(data, medida, seccion)
    {   
        for(var k=0; k<data.Componente.length; k++)
        {
            data.Componente[k].Consumo = 0;
            for(var i=0; i<data.Componente[k].Pieza.length; i++)
            {
                data.Componente[k].Pieza[i].Ancho = $scope.EvaluarFormula(data.Componente[k].Pieza[i].FormulaAncho);
                data.Componente[k].Pieza[i].Largo = $scope.EvaluarFormula(data.Componente[k].Pieza[i].FormulaLargo);
                
                $scope.SustituirModuloMedidaPuerta(data.Componente[k].Pieza[i], medida);
                $scope.SustituirPuertaMedida(data.Componente[k].Pieza[i], seccion);
                $scope.SustituirPiezaPuerta(data.Componente[k].Pieza[i], data.Componente);
                
                data.Componente[k].Consumo += ((data.Componente[k].Pieza[i].Ancho * data.Componente[k].Pieza[i].Largo)/144)*parseInt(data.Componente[k].Pieza[i].Cantidad);
                
            }
            data.Componente[k].Consumo *= parseInt(seccion.NumeroPiezas);
        }
        //console.log(data.Componente);
        return data.Componente;
    };
    
    $scope.SustituirPiezaPuerta = function(pieza, componente)
    {
        if(pieza.Ancho < 0)
        {
            pieza.Ancho = $scope.SustituirValorPiezaPuerta(pieza.FormulaAncho2, componente);
        }
        if(pieza.Largo < 0)
        {
            pieza.Largo = $scope.SustituirValorPiezaPuerta(pieza.FormulaLargo2, componente);
        }
    };
    
    $scope.SustituirValorPiezaPuerta = function(formula, componente)
    {
        var piezaId;
        var medidaPieza;
        
        var index = formula.indexOf("[Pieza]");
        
        while(index > -1)
        {
            piezaId = "";
            medidaPieza = "";
            
            for(var j=index+8; j<formula.length; j++)
            {
                piezaId += formula[j];
                if(formula[j+1] == "]")
                {
                    index = j+1;
                    break;
                }
            }

            for(var j=index+2; j<formula.length; j++)
            {
                medidaPieza += formula[j];
                if(formula[j+1] == "]")
                {
                    break;
                }
            }

            //console.log(piezaId);
            //console.log(medidaPieza);
            //console.log(piezaId);
            for(var j=0; j<componente.length; j++)
            {
                for(var i=0; i<componente[j].Pieza.length; i++)
                {
                    //console.log("pieza: "+componente[j].Pieza[i].Piezad);
                    if(componente[j].Pieza[i].PiezaId == piezaId)
                    {
                        var medida = "[Pieza][" + piezaId + "][" + medidaPieza + "]";

                        //console.log(medida);
                        //console.log(formula);

                        if(medidaPieza == "Largo")
                        {
                            if(componente[j].pieza[i].Largo > -1)
                            {
                                formula = formula.replace(medida, componente[j].Pieza[i].Largo);
                            }
                            else
                            {
                                componente[j].Pieza[i].Largo = $scope.SustituirValorPieza(pieza[j].FormulaLargo2, componente);
                                formula = formula.replace(medida, componente[j].Pieza[i].Largo);
                            }
                        }
                        else if(medidaPieza == "Ancho")
                        {
                           // console.log("ancho: "+pieza[j].ancho);
                            if(componente[j].Pieza[i].Ancho > -1)
                            {
                                formula = formula.replace(medida, componente[j].Pieza[i].Ancho);
                            }
                            else
                            {
                                componente[j].Pieza[i].Ancho = $scope.SustituirValorPieza(componente[j].Pieza[i].FormulaAncho2, componente);
                                formula = formula.replace(medida, componente[j].Pieza[i].Ancho);
                            }
                        }

                        break;
                    }
                }
                
            }
            //console.log(formula);
            index = formula.indexOf("[Pieza]");
            
            //console.log(ancho);
            //console.log(index);
        }
        
        //console.log(  formula + " = " + eval(formula));
        return eval(formula);
    };
    
    $scope.SustituirPuertaMedida = function(pieza, seccion)
    {        
        if(pieza.Ancho < 0)
        {
            pieza.FormulaAncho2 = $scope.SustituirPuertaValor(pieza.FormulaAncho2, seccion);
            pieza.Ancho = $scope.EvaluarFormula(pieza.FormulaAncho2);
        }
        if(pieza.Largo < 0)
        {
            pieza.FormulaLargo2 = $scope.SustituirPuertaValor(pieza.FormulaLargo2, seccion);
            pieza.Largo = $scope.EvaluarFormula(pieza.FormulaLargo2);
        }
    };
    
    $scope.SustituirPuertaValor = function(formula, seccion)
    {
        var ancho = seccion.Ancho;
        var alto = seccion.Alto;
        
        var newFormula = formula;
        var index = newFormula.indexOf("[Puerta]");
        
        do
        {
            var puertaMedida = "";
            
            for(var j=index+9; j<newFormula.length; j++)
            {
                puertaMedida += newFormula[j];
                if(newFormula[j+1] == "]")
                {
                    index = j+1;
                    break;
                }
            }

            var medida = "[Puerta][" + puertaMedida + "]";
            
            if(puertaMedida == "Ancho")
            {
                newFormula = newFormula.replace(medida, ancho);
            }
            else if(puertaMedida == "Alto")
            {
                newFormula = newFormula.replace(medida, alto);
            }
            
            index = newFormula.indexOf("[Puerta]");
            
        }while(index > -1);
    
        return newFormula;
    };
    
    $scope.SustituirModuloMedidaPuerta = function(pieza, medida)
    {        
        if(pieza.Ancho < 0)
        {
            pieza.FormulaAncho2 = $scope.SustituirModuloValor(pieza.FormulaAncho, medida);
            pieza.Ancho = $scope.EvaluarFormula(pieza.FormulaAncho2);
        }
        if(pieza.Largo < 0)
        {
            pieza.FormulaLargo2 = $scope.SustituirModuloValor(pieza.FormulaLargo, medida);
            pieza.Largo = $scope.EvaluarFormula(pieza.FormulaLargo2);
        }
    };
    
    $scope.SustituirModuloValor = function(formula, medida)
    {
        var ancho = $scope.FraccionADecimal(medida.Ancho);
        var alto = $scope.FraccionADecimal(medida.Alto);
        var profundo = $scope.FraccionADecimal(medida.Profundo);
        
        var newFormula = formula;
        var index = newFormula.indexOf("[Modulo]");
        
        do
        {
            var moduloMedida = "";
            
            for(var j=index+9; j<newFormula.length; j++)
            {
                moduloMedida += newFormula[j];
                if(newFormula[j+1] == "]")
                {
                    index = j+1;
                    break;
                }
            }

            var medida = "[Modulo][" + moduloMedida + "]";
            
            if(moduloMedida == "Ancho")
            {
                newFormula = newFormula.replace(medida, ancho);
            }
            else if(moduloMedida == "Alto")
            {
                newFormula = newFormula.replace(medida, alto);
            }
            else if(moduloMedida == "Profundo")
            {
                newFormula = newFormula.replace(medida, profundo);
            }
            
            index = newFormula.indexOf("[Modulo]");
            
        }while(index > -1);
    
        return newFormula;
    };
    
    $scope.SetSeccion = function(data, medida)
    {
        var seccion = new Object();
        
        seccion.NumeroPiezas = parseInt(data.NumeroPiezas);
        seccion.SeccionModuloId = data.SeccionModulo.SeccionModuloId;
        
        var cosIzq = 0, cosDer =0;
        
        for(var i=0; i<$scope.moduloSeleccionado.Parte.length; i++)
        {
            if($scope.moduloSeleccionado.Parte[i].TipoParteId == "1")
            {
                cosIzq = $scope.FraccionADecimal($scope.moduloSeleccionado.Parte[i].Ancho);
            }
            else if($scope.moduloSeleccionado.Parte[i].TipoParteId == "2")
            {
                cosDer = $scope.FraccionADecimal($scope.moduloSeleccionado.Parte[i].Ancho);
            }
        }

        seccion.Ancho =  (($scope.FraccionADecimal(medida.Ancho) - (cosIzq+cosDer) - ((seccion.NumeroPiezas-1)*$scope.FraccionADecimal(data.PeinazoVertical)))/seccion.NumeroPiezas)+ 1;
        
        for(var i=0; i<data.Luz.length; i++)
        {
            if(medida.Alto == data.Luz[i].AltoModulo)
            {
                seccion.Alto = $scope.FraccionADecimal(data.Luz[i].Luz)+1;
            }
        }
        
        return seccion;
    };
    
    /*----------------Modulo -------------------------*/
    $scope.SetCombinacionEntrepano = function(entrepano)
    {
        var combinacion = [];
        
        for(var k=0; k<entrepano.Combinacion.length; k++)
        {
            combinacion[k] = new Object();
            combinacion[k].CombinacionMaterialId = entrepano.Combinacion[k].CombinacionMaterial.CombinacionMaterialId;
            combinacion[k].Grueso = entrepano.Combinacion[k].Grueso;
            combinacion[k].CostoUnidad = entrepano.Combinacion[k].CostoUnidad;
        }
        
        return combinacion;
    };
    
    $scope.SetEntrepano = function(parte, ancho, alto, profundo, seccion)
    {
        var entrepano = new Object();
        var cosIzq = 0;
        var cosDer = 0;
        var numEntrepano = 0;
        
        for(var k=0; k<parte.Parte.length; k++)
        {
            if(parte.Parte[k].TipoParteId == "1")
            {
                cosIzq = parte.Parte[k].Ancho;
            }
            if(parte.Parte[k].TipoParteId == "2")
            {
                cosDer = parte.Parte[k].Ancho;
            }
        }
        
        for(var k=0; k<seccion.length; k++)
        {
            for(var j=0; j<seccion[k].Luz.length; j++)
            {
                if(alto == seccion[k].Luz[j].AltoModulo)
                {
                    numEntrepano += parseInt(seccion[k].Luz[j].NumeroEntrepano);
                    break;
                }
            }
        }
        
        entrepano.Ancho = $scope.FraccionADecimal(ancho) - (cosDer+cosIzq) + 1;
        entrepano.Largo = $scope.FraccionADecimal(profundo)-2;
        
        entrepano.ConsumoTotal = ((entrepano.Ancho*entrepano.Largo)/144)*numEntrepano;
        
        //console.log(entrepano);
        return entrepano;
    };
    
    $scope.SetPeinazoVertical = function(seccion, alto)
    {
        var consumo = 0;
        var luz = 0;
        
        for(var k=0; k<seccion.length; k++)
        {
            for(var j=0; j<seccion[k].Luz.length; j++)
            {
                if(alto == seccion[k].Luz[j].AltoModulo)
                {
                    luz = $scope.FraccionADecimal(seccion[k].Luz[j].Luz);
                    break;
                }
            }
            
            consumo += ((luz*$scope.FraccionADecimal(seccion[k].PeinazoVertical)*(parseInt(seccion[k].NumeroPiezas)-1))/144);
        }
    
        return consumo;
    };
    
    $scope.SustituirPieza = function(pieza, piezas)
    {
        //console.log(pieza);
        if(pieza.AnchoNuevo == -1)
        {
            pieza.AnchoNuevo = $scope.SustituirValorPieza(pieza.FormulaAnchoNuevo, piezas);
        }
        if(pieza.LargoNuevo == -1)
        {
            pieza.LargoNuevo = $scope.SustituirValorPieza(pieza.FormulaLargoNuevo, piezas);
        }
    };
    
    $scope.SustituirValorPieza = function(formula, pieza)
    {
        var piezaId;
        var medidaPieza;
        
        var index = formula.indexOf("[Pieza]");
        
        while(index > -1)
        {
            piezaId = "";
            medidaPieza = "";
            
            for(var j=index+8; j<formula.length; j++)
            {
                piezaId += formula[j];
                if(formula[j+1] == "]")
                {
                    index = j+1;
                    break;
                }
            }

            for(var j=index+2; j<formula.length; j++)
            {
                medidaPieza += formula[j];
                if(formula[j+1] == "]")
                {
                    break;
                }
            }

            //console.log(piezaId);
            //console.log(medidaPieza);
            //console.log(pieza);
            for(var j=0; j<pieza.length; j++)
            {
                //console.log("pieza: "+pieza[j].nombre);
                if(pieza[j].PiezaId == piezaId)
                {
                    var medida = "[Pieza][" + piezaId + "][" + medidaPieza + "]";

                    //console.log(medida);
                    //console.log(formula);

                    if(medidaPieza == "Largo")
                    {
                        if(pieza[j].LargoNuevo > -1)
                        {
                            formula = formula.replace(medida, pieza[j].LargoNuevo);
                        }
                        else
                        {
                            pieza[j].LargoNuevo = $scope.SustituirValorPieza(pieza[j].FormulaLargoNuevo, pieza);
                            formula = formula.replace(medida, pieza[j].LargoNuevo);
                        }
                    }
                    else if(medidaPieza == "Ancho")
                    {
                       // console.log("ancho: "+pieza[j].ancho);
                        if(pieza[j].AnchoNuevo > -1)
                        {
                            formula = formula.replace(medida, pieza[j].AnchoNuevo);
                        }
                        else
                        {
                            pieza[j].AnchoNuevo = $scope.SustituirValorPieza(pieza[j].FormulaAnchoNuevo, pieza);
                            formula = formula.replace(medida, pieza[j].AnchoNuevo);
                        }
                    }

                    break;
                }
                
            }
            
            index = formula.indexOf("[Pieza]");
            
            //console.log(ancho);
            //console.log(index);
        }
        
        //console.log(  formula + " = " + eval(formula));
        return eval(formula);
    };
    
    
    $scope.SustituirComponente = function(componente, parte, combinacionId)
    {
        var combinacionComponente = [];
        
        for(var k=0; k<componente.length; k++)
        {
            combinacionComponente[k] = new Object();
            for(var i=0; i<componente[k].Combinacion.length; i++)
            {
                if(combinacionId == componente[k].Combinacion[i].CombinacionMaterialId)
                {
                    combinacionComponente[k] = componente[k].Combinacion[i];
                    break;
                }
            }
        }
        
        for(var k=0; k<componente.length; k++)
        {
            for(var i=0; i<componente[k].Pieza.length; i++)
            {
                if(componente[k].Pieza[i].Ancho < 0)
                {
                    if(componente[k].Pieza[i].FormulaAncho.includes(["Componente"]))
                    {
                        componente[k].Pieza[i].FormulaAnchoNuevo = $scope.SustituirComponenteValor( componente[k].Pieza[i].FormulaAncho, componente, parte, combinacionComponente);
                        componente[k].Pieza[i].AnchoNuevo = $scope.EvaluarFormula(componente[k].Pieza[i].FormulaAnchoNuevo);
                    }
                }
                else
                {
                   componente[k].Pieza[i].AnchoNuevo  =  componente[k].Pieza[i].Ancho;
                }
                if(componente[k].Pieza[i].Largo < 0)
                {
                    if(componente[k].Pieza[i].FormulaLargo.includes(["Componente"]))
                    {
                        componente[k].Pieza[i].FormulaLargoNuevo = $scope.SustituirComponenteValor( componente[k].Pieza[i].FormulaLargo, componente, parte, combinacionComponente);
                        componente[k].Pieza[i].LargoNuevo = $scope.EvaluarFormula(componente[k].Pieza[i].FormulaLargoNuevo);
                    }
                }
                else
                {
                   componente[k].Pieza[i].LargoNuevo  =  componente[k].Pieza[i].Largo;
                }
                
            }
        }
        
        //console.log(combinacionId);
        //console.log(componente);
    };
    
    $scope.SustituirComponenteValor = function(formula, componente, parte, combinacion)
    {
        var newFormula = formula;
        var index = newFormula.indexOf("[Componente]");
        var componenteId = "";
        
        do
        {
            for(var j=index+13; j<newFormula.length; j++)
            {
                componenteId += newFormula[j];
                if(newFormula[j+1] == "]")
                {
                    index = j+1;
                    break;
                }
            }
            
            var medida = "[Componente][" + componenteId + "][Grueso]";
            
            if(componenteId == "1")
            {
                if(parte.Grueso != "No Aplica")
                {
                    newFormula = newFormula.replace(medida, $scope.FraccionADecimal(parte.Grueso));
                }
                else
                {
                    newFormula = newFormula.replace(medida, "0");
                }
            }
            
            else
            {
                for(var j=0; j<componente.length; j++)
                {

                    if(componente[j].ComponenteId == componenteId)
                    {
                        if(combinacion[j].Grueso != "No Aplica")
                        {
                            newFormula = newFormula.replace(medida, $scope.FraccionADecimal(combinacion[j].Grueso));
                        }
                        else
                        {
                            newFormula = newFormula.replace(medida, "0");
                        }

                        break;
                    }
                }
            }
            
            componenteId = "";

            index = newFormula.indexOf("[Componente]");
            
        }while(index > -1);
        
        return newFormula;
    };
    
    
    $scope.SutituirParte = function(parte, componente)
    {
        for(var k=0; k<componente.length; k++)
        {
            for(var i=0; i<componente[k].Pieza.length; i++)
            {
                if(componente[k].Pieza[i].Ancho < 0)
                {
                    if(componente[k].Pieza[i].FormulaAncho.includes(["Parte"]))
                    {
                        componente[k].Pieza[i].FormulaAncho = $scope.SustituirParteValor( componente[k].Pieza[i].FormulaAncho, parte);
                        componente[k].Pieza[i].Ancho = $scope.EvaluarFormula(componente[k].Pieza[i].FormulaAncho);
                    }
                }
                if(componente[k].Pieza[i].Largo < 0)
                {
                    if(componente[k].Pieza[i].FormulaLargo.includes(["Parte"]))
                    {
                        componente[k].Pieza[i].FormulaLargo = $scope.SustituirParteValor( componente[k].Pieza[i].FormulaLargo, parte);
                        componente[k].Pieza[i].Largo = $scope.EvaluarFormula(componente[k].Pieza[i].FormulaAncho);
                    }
                }
                
            }
        }
    };
    
    $scope.SustituirParteValor = function(formula, parte)
    {
        var index = formula.indexOf("[Parte]");
        var parteId = "";
        var medidaParte = "";
        do
        {
            for(var j=index+8; j<formula.length; j++)
            {
                parteId += formula[j];
                if(formula[j+1] == "]")
                {
                    index = j+1;
                    break;
                }
            }

            for(var j=index+2; j<formula.length; j++)
            {
                medidaParte += formula[j];
                if(formula[j+1] == "]")
                {
                    break;
                }
            }

            for(var j=0; j<parte.Parte.length; j++)
            {

                if(parte.Parte[j].TipoParteId == parteId)
                {
                    var medida = "[Parte][" + parteId + "][" + medidaParte + "]";

                    if(medidaParte == "Largo")
                    {
                        formula = formula.replace(medida, parte.Parte[j].Largo);
                    }
                    else if(medidaParte == "Ancho")
                    {
                        formula = formula.replace(medida, parte.Parte[j].Ancho);
                    }

                    break;
                }
            }
            
            parteId = "";
            medidaParte = "";
            
            index = formula.indexOf("[Parte]");
            
        }while(index > -1);
        return formula;
    };
    
    $scope.SutituirModuloMedida = function(compoenente, ancho, alto, profundo)
    {
        for(var k=0; k<compoenente.length; k++)
        {
            for(var i=0; i<compoenente[k].Pieza.length; i++)
            {
                if(compoenente[k].Pieza[i].Ancho < 0)
                {
                    if(compoenente[k].Pieza[i].FormulaAncho.includes(["Modulo"]))
                    {
                        compoenente[k].Pieza[i].FormulaAncho = compoenente[k].Pieza[i].FormulaAncho.replace("[Modulo][Ancho]", $scope.FraccionADecimal(ancho));
                        compoenente[k].Pieza[i].FormulaAncho = compoenente[k].Pieza[i].FormulaAncho.replace("[Modulo][Alto]", $scope.FraccionADecimal(alto));
                        compoenente[k].Pieza[i].FormulaAncho = compoenente[k].Pieza[i].FormulaAncho.replace("[Modulo][Profundo]", $scope.FraccionADecimal(profundo));

                        compoenente[k].Pieza[i].Ancho = $scope.EvaluarFormula(compoenente[k].Pieza[i].FormulaAncho);
                    }
                }
                if(compoenente[k].Pieza[i].Largo < 0)
                {
                    if(compoenente[k].Pieza[i].FormulaLargo.includes(["Modulo"]))
                    {
                        compoenente[k].Pieza[i].FormulaLargo = compoenente[k].Pieza[i].FormulaLargo.replace("[Modulo][Ancho]", $scope.FraccionADecimal(ancho));
                        compoenente[k].Pieza[i].FormulaLargo = compoenente[k].Pieza[i].FormulaLargo.replace("[Modulo][Alto]", $scope.FraccionADecimal(alto));
                        compoenente[k].Pieza[i].FormulaLargo = compoenente[k].Pieza[i].FormulaLargo.replace("[Modulo][Profundo]", $scope.FraccionADecimal(profundo));

                        compoenente[k].Pieza[i].Largo = $scope.EvaluarFormula(compoenente[k].Pieza[i].FormulaLargo);
                    }
                }
            }
        }
    };
    
    $scope.SetParte = function(data, ancho, alto)
    {
        var parte = new Object();
        
        parte.Parte = [];
        parte.Combinacion = [];
        
        var cosIzq = 0, cosDer = 0; 
        for(var k=0; k<data.length; k++)
        {
            parte.Parte[k] = new Object();
            parte.Parte[k].TipoParteId = data[k].TipoParteId;
            parte.Parte[k].Ancho = $scope.FraccionADecimal(data[k].Ancho);
            
            if(data[k].TipoParteId == "1" || data[k].TipoParteId == "2")
            {
                parte.Parte[k].Largo = $scope.FraccionADecimal(alto);
                if(data[k].TipoParteId == "1")
                {
                    cosIzq = parte.Parte[k].Ancho;
                }
                else
                {
                    cosDer = parte.Parte[k].Ancho;
                }
            }
            else if(data[k].TipoParteId == "3" || data[k].TipoParteId == "4" || data[k].TipoParteId == "5")
            {
                parte.Parte[k].Largo = ancho + " - ([Parte][1][Ancho]+[Parte][2][Ancho])";
            }
        }
        
        for(var k=0; k<data.Combinacion.length; k++)
        {
            parte.Combinacion[k] = new Object();
            parte.Combinacion[k].Grueso = data.Combinacion[k].Grueso;
            parte.Combinacion[k].CostoUnidad = data.Combinacion[k].CostoUnidad;
            parte.Combinacion[k].CombinacionMaterialId = data.Combinacion[k].CombinacionMaterial.CombinacionMaterialId;
        }
        
        
        for(var k=0; k<parte.Parte.length; k++)
        {
            if(parte.Parte[k].TipoParteId == "3" || parte.Parte[k].TipoParteId == "4" || parte.Parte[k].TipoParteId == "5")
            {
                parte.Parte[k].Largo = parte.Parte[k].Largo.replace("[Parte][1][Ancho]", cosIzq);
                parte.Parte[k].Largo = parte.Parte[k].Largo.replace("[Parte][2][Ancho]", cosDer);
                parte.Parte[k].Largo = eval(parte.Parte[k].Largo);
            }
        }
        
        //console.log(parte);
        return parte;
    };
    
    $scope.SetComponente = function(data)
    {
        var componente = [];
        
        for(var k=0; k<data.length; k++)
        {
            componente[k] = new Object();
            componente[k].ComponenteId = data[k].Componente.ComponenteId;
            componente[k].Cantidad = data[k].Cantidad;
            
            componente[k].Pieza = [];
            componente[k].Combinacion = [];
            
            for(var i=0; i<data[k].Pieza.length; i++)
            {
                componente[k].Pieza[i] = new Object();
                componente[k].Pieza[i].Cantidad = data[k].Pieza[i].Cantidad;
                componente[k].Pieza[i].PiezaId = data[k].Pieza[i].Pieza.PiezaId;
                componente[k].Pieza[i].FormulaAncho = data[k].Pieza[i].Pieza.FormulaAncho;
                componente[k].Pieza[i].FormulaLargo = data[k].Pieza[i].Pieza.FormulaLargo;
                
                componente[k].Pieza[i].Ancho = $scope.EvaluarFormula(data[k].Pieza[i].Pieza.FormulaAncho);
                componente[k].Pieza[i].Largo = $scope.EvaluarFormula(data[k].Pieza[i].Pieza.FormulaLargo);
            }
            
            for(var i=0; i<data[k].Combinacion.length; i++)
            {
                componente[k].Combinacion[i] = new Object();
                componente[k].Combinacion[i].Grueso = data[k].Combinacion[i].Grueso;
                componente[k].Combinacion[i].CostoUnidad = data[k].Combinacion[i].CostoUnidad;
                componente[k].Combinacion[i].CombinacionMaterialId = data[k].Combinacion[i].CombinacionMaterial.CombinacionMaterialId;
            }
        }
        
        //console.log(componente);
        return componente;
    };
    
    $scope.EvaluarFormula = function(formula)
    {
        if(!formula.includes("["))
        {
            return eval(formula);
        }
        else
        {
            return -1;
        }
    };
    
    $scope.FraccionADecimal = function(valor)
    {
        //console.log(valor);
        if(valor.includes(' '))
        {
            var fraccion = valor.split(' ');

            return parseInt(fraccion[0]) + eval(fraccion[1]);
        }
        else
        {
            return eval(valor);
        }       
    };
    
    
    /*-------------------Vista------------------*/
    $scope.MostrarCostoMedida = function(medida)
    {
        if(medida == $scope.costosMedidas)
        {
            $scope.costosMedidas = null;
            return;
        }
        
        $scope.costosMedidas = medida;
    };
    
    $scope.GetClaseDetallesSeccion = function(medidas)
    {
        if($scope.costosMedidas == medidas)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    $scope.MostrarCostoPuerta = function(puerta)
    {
        if(puerta == $scope.costosPuerta)
        {
            $scope.costosPuerta = null;
            return;
        }
        
        $scope.costosPuerta = puerta;
    };
    
    $scope.GetClaseCostoPuerta = function(puerta)
    {
        if($scope.costosPuerta == puerta)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    
    /*-------Inicializar-------*/
    $scope.InicializarModuloModulos = function()
    {
        $scope.GetModulo();
        $scope.GetTipoModulo();
        $scope.GetCombinacionMaterial();
        $scope.GetPuerta();
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
                    $scope.InicializarModuloModulos();
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
                    $scope.InicializarModuloModulos();
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