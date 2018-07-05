app.controller("CostoConsumoPresupuesto", function($scope, $rootScope, datosUsuario, $window, datosUsuario, COSCONPRESUPUESTO, CocinasKService)
{   
    $rootScope.clasePrincipal = "";
    $scope.permiso = {ver: false};
    $scope.presupuesto = [];
    $scope.combinacion = [];
    $scope.material = [];
    $scope.materialInicial = [];
    $scope.modulo = [];
    $scope.puerta = [];
    $scope.configuracion = false;
    $scope.animacionCon = "";
    $scope.conCombinacion = false;
    $scope.conPrecio = false;
    $scope.verPor = "combinacion";
    
    //------------ Cargar Catalogos --------------------
    $scope.CargarCatalagosInicio = function()
    {
        //$scope.presupuesto = COSCONPRESUPUESTO.GetPresupuesto();
        //$scope.presupuesto = ["101", "336", "337"];
        $scope.presupuesto = ["491"];
        $scope.GetCatalogosCostoConsumo();
        
       // console.log($scope.presupuesto);
    };
    
    $scope.GetCatalogosCostoConsumo = function()
    {   
        (self.servicioObj = CocinasKService.Post('CostoConsumo', $scope.presupuesto)).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.combinacion = dataResponse.data.combinacion;
                $scope.material = dataResponse.data.material;
                
                for(var k=0; k<$scope.combinacion.length; k++)
                {
                    $scope.combinacion[k].Ver = true;
                }
                
                $scope.materialInicial = jQuery.extend({}, dataResponse.data.material);
            
                console.log($scope.combinacion);
                console.log($scope.material);
                
                $scope.GetModuloPresupuesto();
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede cargar la información.", 'error');
                $scope.encuesta = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
    $scope.GetModuloPresupuesto = function()
    {   
        (self.servicioObj = CocinasKService.Post('CostoConsumo/Modulo', $scope.presupuesto)).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.modulo = dataResponse.data.modulo;
                $scope.puerta = dataResponse.data.puerta;
                
                for(var k=0; k<$scope.modulo.length; k++)
                {
                    $scope.modulo[k].AnchoNumero = FraccionADecimal($scope.modulo[k].Ancho);        
                    $scope.modulo[k].AltoNumero = FraccionADecimal($scope.modulo[k].Alto);        
                    $scope.modulo[k].ProfundoNumero = FraccionADecimal($scope.modulo[k].Profundo); 
                    
                    $scope.modulo[k].Cantidad = parseInt($scope.modulo[k].Cantidad);
                }
                
                $scope.SetPrecioMaterial();
                //console.log(dataResponse.data.modulo);
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede cargar la información.", 'error');
                $scope.encuesta = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
    $scope.SetPrecioMaterial = function()
    {
        //modulo
        for(var i=0; i<$scope.modulo.length; i++) //i->módulo
        {
            //componente
            for(var j=0; j<$scope.modulo[i].Componente.length; j++)  //j-> componente
            {
                for(var k=0; k<$scope.modulo[i].Componente[j].Combinacion.length; k++) //k--> Combinacion
                {
                    var combinacion = $scope.modulo[i].Componente[j].Combinacion[k];
                    combinacion.Costo = $scope.GetCostoMaterial(combinacion.MaterialId, combinacion.Grueso);
                }
            }
            
            //componente especial
            for(var j=0; j<$scope.modulo[i].ComponenteEspecial.length; j++) //j-> componente especial
            {
                 for(var k=0; k<$scope.modulo[i].ComponenteEspecial[j].Combinacion.length; k++) //k--> Combinacion
                {
                    var combinacion = $scope.modulo[i].ComponenteEspecial[j].Combinacion[k];
                    combinacion.Costo = $scope.GetCostoMaterial(combinacion.MaterialId, combinacion.Grueso);
                    
                }
            }
        }
        
        //puerta
        for(var i=0; i<$scope.puerta.length; i++) //i->puerta
        {
            //componente
            for(var j=0; j<$scope.puerta[i].Componente.length; j++)  //j-> componente
            {
                for(var k=0; k<$scope.puerta[i].Componente[j].Combinacion.length; k++) //k--> Combinacion
                {
                    var combinacion = $scope.puerta[i].Componente[j].Combinacion[k];
                    combinacion.Costo = $scope.GetCostoMaterial(combinacion.MaterialId, combinacion.Grueso);
                }
            }
        }
        
        $scope.CalcularCostoConsumo();
        
         console.log($scope.modulo);
         console.log($scope.puerta);
    };
    
    $scope.GetCostoMaterial = function(id, grueso)
    {
        for(var m=0; m<$scope.material.length; m++) //m-> material
        {
            if(id == $scope.material[m].MaterialId)
            {
                if($scope.material[m].Grueso.length > 0)
                {
                    for(var n=0; n<$scope.material[m].Grueso.length; n++) //n->grueso
                    {
                        if(grueso == $scope.material[m].Grueso[n].Grueso)
                        {
                            return parseFloat($scope.material[m].Grueso[n].CostoUnidad);
                        }
                    }
                }
                else
                {
                    return parseFloat($scope.material[m].CostoUnidad);
                }
            }
        }
        
        return 0;
    };
    
    //-- -------------------- configuración ---------
    $scope.AbrirConfiguracion = function()
    {
        $scope.animacionCon = "abrir";
        $scope.configuracion = true;
        $("body").addClass('noscroll');
    };
    
    $scope.ReestablecerCombinacion = function()
    {
        for(var k=0; k<$scope.combinacion.length; k++)
        {
            $scope.combinacion[k].Ver = true;
            $scope.material = jQuery.extend({}, $scope.materialInicial);
            $scope.SetPrecioMaterial();
        }  
    };
    
    $scope.CerrarConfiguracion = function()
    {
      $scope.animacionCon = "cerrar";
        
      setTimeout(function()
      {
          $scope.configuracion = false;
          $("body").removeClass('noscroll');
          $scope.$apply();
      }, 400);  
    };
    
    window.addEventListener('click', function(e)
    { 
      if(document.getElementById('sidebar'))
      {
          if(document.getElementById('sidebar').contains(e.target) && !document.getElementById('sidebar-content').contains(e.target))
          {
            $scope.animacionCon = "cerrar";
            $scope.$apply();
            $scope.CerrarConfiguracion();
          } 
      }

    });
    
    //--- calcular costo - consumo ---
    $scope.CalcularCostoConsumo = function()
    {
        for(var k=0; k<$scope.modulo.length; k++)
        {
            CalcularCostoConsumoModulo($scope.modulo[k], $scope.combinacion, $scope.material);
        }
        
        $scope.CalcularValoresCombinacion();
    };
    
    //-- Calcula los valore por combinacion 
    $scope.CalcularValoresCombinacion = function()
    {
        for(var combinacion of $scope.combinacion)
        {
            combinacion.Costo = 0;
            combinacion.CostoDesperdicio = 0;
            combinacion.CostoConsumible = 0;
            combinacion.CostoMargen = 0;
            combinacion.Material = [];
        
            if(combinacion.Ver)
            {
                for(var modulo of $scope.modulo) 
                {
                    //--costos--
                    for(var moduloCombinacion of modulo.Combinacion)
                    {
                        if(moduloCombinacion.CombinacionMaterialId == combinacion.CombinacionMaterialId)
                        {
                            combinacion.Costo += moduloCombinacion.Costo * modulo.Cantidad;
                            combinacion.CostoDesperdicio += moduloCombinacion.CostoDesperdicio * modulo.Cantidad;
                            combinacion.CostoConsumible = moduloCombinacion.CostoConsumible * modulo.Cantidad;
                            combinacion.CostoMargen =  moduloCombinacion.CostoMargen * modulo.Cantidad;
                            break;
                        }
                    }
                    
                    //-- consumos --
                    
                    //material
                    for(var material of $scope.material)
                    {
                        var mataux = {TipoMaterialId:material.TipoMaterialId, MaterialId:material.MaterialId, Material:material.NombreMaterial, Grueso:"1", Consumo:0, ConsumoDesperdicio: 0, GruesoN:1};
                        if(material.Grueso.length > 0)
                        {
                            for(var grueso of material.Grueso)
                            {
                                var gruesoaux;
                                
                                gruesoaux =  jQuery.extend({}, mataux);
                                gruesoaux.Grueso = grueso.Grueso;
                                gruesoaux.GruesoN = FraccionADecimal(grueso.Grueso);
                                combinacion.Material.push(gruesoaux);
        
                                //var gruesoAux = {Grueso: grueso.Grueso, Consumo:0, ConsumoDesperdicio:0};
                                //mataux.Grueso.push(gruesoAux);
                            }
                        }
                        else
                        {
                            combinacion.Material.push(mataux);
                        }                    
                    }
                    
                    
                    //componente
                    for(var componente of modulo.Componente)
                    {
                        for(var componenteCombinacion of componente.Combinacion)
                        {
                            if(componenteCombinacion.CombinacionMaterialId == combinacion.CombinacionMaterialId)
                            {
                                for(var material of combinacion.Material)
                                {
                                    if(material.MaterialId == componenteCombinacion.MaterialId)
                                    {
                                        if(material.Grueso != "1")
                                        {
                                            //for(grueso of material.Grueso)
                                            //{
                                                if(material.Grueso == componenteCombinacion.Grueso)
                                                {
                                                    material.Consumo += componenteCombinacion.Consumo;
                                                    material.ConsumoDesperdicio += componenteCombinacion.ConsumoDesperdicio;
                                                    break;
                                                }
                                            //}
                                        }
                                        else
                                        {
                                            material.Consumo += componenteCombinacion.Consumo;
                                            material.ConsumoDesperdicio += componenteCombinacion.ConsumoDesperdicio;
                                            break;
                                        }
                                        
                                        
                                    }
                                }
                                
                                break;
                            }
                        }
                    }
                    
                    //componente especial
                    for(var especial of modulo.ComponenteEspecial)
                    {
                        for(var especialCombinacion of especial.Combinacion)
                        {
                            if(especialCombinacion.CombinacionMaterialId == combinacion.CombinacionMaterialId)
                            {
                                for(var material of combinacion.Material)
                                {
                                    if(material.MaterialId == especialCombinacion.MaterialId)
                                    {
                                        if(material.Grueso != "1")
                                        {
                                            //for(grueso of material.Grueso)
                                            //{
                                                if(material.Grueso == especialCombinacion.Grueso)
                                                {
                                                    material.Consumo += especialCombinacion.Consumo;
                                                    material.ConsumoDesperdicio += especialCombinacion.ConsumoDesperdicio;
                                                    break;
                                                }
                                            //}
                                        }
                                        else
                                        {
                                            material.Consumo += especialCombinacion.Consumo;
                                            material.ConsumoDesperdicio += especialCombinacion.ConsumoDesperdicio;
                                            break;
                                        }
                                        
                                        
                                    }
                                }
                                
                                break;
                            }
                        }  
                    }
                    
                }
            }
        }
       
        
        console.log($scope.modulo);
        console.log($scope.combinacion);
       
    };
    
    /*------------------  Valida el inicio de sesion y los permisos -------------------*/
    $scope.Inicializar = function()
    {
        $scope.IdentificarPermisos();
        
        if(!$scope.permiso.ver)
        {
            $rootScope.IrAHomePerfil($scope.usuario.PerfilSeleccionado);
        }
        else
        {
            $scope.CargarCatalagosInicio();
        }
    };
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuario.Permiso.length; k++)
        {
            if($scope.usuario.Permiso[k] == "OpeCCPConsultar")
            {
                $scope.permiso.ver = true;
            }
        }
    };
    
        //----- Valida si el usuario esta cargando
    $scope.usuario =  datosUsuario.getUsuario(); 
    
    if($scope.usuario !== null)
    {
        if($scope.usuario.SesionIniciada)
        {
            if($scope.usuario.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            } 
            else if($scope.usuario.PerfilSeleccionado == "Operativo")
            {
                $scope.Inicializar();
            }
            else
            {
                $rootScope.VolverAHome($scope.usuario.PerfilSeleccionado);
            }
        }
        else
        {
            $window.location = "#Login";
        }
    }
    
        //Se manda a llamar cada ves que los datos de un usuario han cambiado
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuario =  datosUsuario.getUsuario();
    
        if($scope.usuario.SesionIniciada)
        {
            if($scope.usuario.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            } 
            else if($scope.usuario.PerfilSeleccionado == "Operativo")
            {
                $scope.Inicializar();
            }
            else
            {
                $rootScope.VolverAHome($scope.usuario.PerfilSeleccionado);
            }
        }
        else
        {
            $window.location = "#Login";
        }
    });
    
});





