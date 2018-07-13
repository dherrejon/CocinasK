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
    $scope.conCombinacion = true;
    $scope.conPrecio = true;
    $scope.verPor = "combinacion";
    $scope.puertaSel = null;
    
    $scope.acordion = {costo: true, consumo: true};
    
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
                
                $scope.materialInicial = [];
                for(var material of $scope.material)
                {
                    for(var grueso in material.Grueso)
                    {                    
                        material.GruesoN = FraccionADecimal(grueso.Grueso);
                    }
                    
                    $scope.materialInicial.push(jQuery.extend({}, material));
                    
                    $scope.materialInicial[$scope.materialInicial.length-1].Grueso = [];
            
                    for(var grueso of material.Grueso)
                    {
                        $scope.materialInicial[$scope.materialInicial.length-1].Grueso.push(jQuery.extend({}, grueso));
                    }
                }
                
            
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
        
        $scope.combinacionConf = [];
        $scope.materialConf = [];
        
        for(var combinacion of $scope.combinacion)
        {
            $scope.combinacionConf.push(jQuery.extend({}, combinacion));
        }
        
        for(var material of $scope.material)
        {
            $scope.materialConf.push(jQuery.extend({}, material));
            
            $scope.materialConf[$scope.materialConf.length-1].Grueso = [];
            
            for(var grueso of material.Grueso)
            {
                $scope.materialConf[$scope.materialConf.length-1].Grueso.push(jQuery.extend({}, grueso));
            }
        }
        
        console.log($scope.materialConf );
    };
    
    $scope.ReestablecerCombinacion = function()
    {
        $scope.materialConf = [];
        
        for(var k=0; k<$scope.combinacionConf.length; k++)
        {
            $scope.combinacionConf[k].Ver = true;
        }  
        
        console.log($scope.materialInicial);
        for(var material of $scope.materialInicial)
        {
            $scope.materialConf.push(jQuery.extend({}, material));
            $scope.materialConf[$scope.materialConf.length-1].Grueso = [];
            
            for(var grueso of material.Grueso)
            {
                $scope.materialConf[$scope.materialConf.length-1].Grueso.push(jQuery.extend({}, grueso));
            }
        }
    };
    
    $scope.AplicarConfiguracion = function()
    {
        if(!$scope.ValidarPrecios($scope.combinacionConf, $scope.materialConf))
        {
            $('#mensajeCostoConsumoPresupuesto').modal('toggle');
            return;
        }
        else
        {
            $scope.combinacion = [];
            $scope.material = [];

            for(var combinacion of $scope.combinacionConf)
            {
                $scope.combinacion.push(jQuery.extend({}, combinacion));
            }

            for(var material of $scope.materialConf)
            {
                $scope.material.push(jQuery.extend({}, material));

                $scope.material[$scope.material.length-1].Grueso = [];

                for(var grueso of material.Grueso)
                {
                    $scope.material[$scope.material.length-1].Grueso.push(jQuery.extend({}, grueso));
                }
            }

            $scope.SetPrecioMaterial();
            $scope.CerrarConfiguracion();
        }
    };
    
    $scope.ValidarPrecios = function(combinacion, data)
    {  
        var comVer = false;
        for(var com of combinacion)
        {
            if(com.Ver)
            {
                comVer = true;
            }
        }
        
        if(!comVer)
        {
            $scope.mensaje = "Al menos una combinación debe de estar seleccionada.";
            return false;
        }
        
        
        for(var material of data)
        {
            if(material.Grueso.length == 0)
            {
                if(!material.CostoUnidad)
                {
                    $scope.mensaje = "Verifica que los precios sean números decimales con máximo dos decimales.";
                    return false;
                }
            }
            else
            {
                for(var grueso of material.Grueso)
                {
                    if(!grueso.CostoUnidad)
                    {
                        $scope.mensaje = "Verifica que los precios sean números decimales con máximo dos decimales.";
                        return false;
                    }
                }
            }
        }
        
        return true;
        
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
    
    
    $scope.SetCombinacion = function(data)
    {
        return Array.from(data);
    };
    /*window.addEventListener('click', function(e)
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

    });*/
    
    //-- ------- Funcionalidad de vista -- ---------
    $scope.CambiarPuerta = function(puerta)
    {
        if($scope.puertaSel != puerta)
        {
            if(puerta == 'ninguna')
            {
                $scope.puertaSel  = null;
            }
            else
            {
                $scope.puertaSel = puerta;
                
                for(var modulo of $scope.modulo)
                {
                    CalcularCostoConsumoPuerta(modulo, $scope.combinacion, $scope.puertaSel);
                }
            }
            $scope.CalcularValoresCombinacion();
        }
    };
    
    //--- calcular costo - consumo ---
    $scope.CalcularCostoConsumo = function()
    {
        //costo - consumo módulo
        for(var k=0; k<$scope.modulo.length; k++)
        {
            CalcularCostoConsumoModulo($scope.modulo[k], $scope.combinacion, $scope.material);
        }
        
        //Costo - Consumo puerta
        if($scope.puertaSel)
        {
            for(var modulo of $scope.modulo)
            {
                CalcularCostoConsumoPuerta(modulo, $scope.combinacion, $scope.puertaSel);
            }
        }
        
        //Costo - Consumo Total
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
                    //módulos
                    for(var moduloCombinacion of modulo.Combinacion)
                    {
                        if(moduloCombinacion.CombinacionMaterialId == combinacion.CombinacionMaterialId)
                        {
                            combinacion.Costo += moduloCombinacion.Costo * modulo.Cantidad;
                            //combinacion.CostoDesperdicio += moduloCombinacion.CostoDesperdicio * modulo.Cantidad;
                            //combinacion.CostoConsumible = moduloCombinacion.CostoConsumible * modulo.Cantidad;
                            //combinacion.CostoMargen =  moduloCombinacion.CostoMargen * modulo.Cantidad;
                            break;
                        }
                    }
                    //puertas
                    if($scope.puertaSel)
                    {
                        for(var componente of $scope.puertaSel.Componente)
                        {
                            for(var puertaCombinacion of componente.Combinacion)
                            {
                                if(puertaCombinacion.CombinacionMaterialId == combinacion.CombinacionMaterialId)
                                {
                                     combinacion.Costo += (componente.Consumo * parseFloat(puertaCombinacion.Costo) * modulo.Cantidad);
                                    break;
                                }
                            }
                        }
                    }
                    
                    //Otros Costo
                    combinacion.CostoDesperdicio  = combinacion.Costo + (combinacion.Costo*(modulo.Desperdicio/100));
                    combinacion.CostoConsumible = combinacion.CostoDesperdicio   + modulo.CostoConsumible;
                    combinacion.CostoMargen = combinacion.CostoConsumible + (combinacion.CostoConsumible * (modulo.Margen/100));
                    
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
                    
                    
                    //componente módulo
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
                    
                    //componente puerta
                    if($scope.puertaSel)
                    {
                        for(var componente of $scope.puertaSel.Componente)
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
                                                if(material.Grueso == componenteCombinacion.Grueso)
                                                {
                                                    material.Consumo += componente.Consumo;
                                                    material.ConsumoDesperdicio += componente.ConsumoDesperdicio;
                                                    break;
                                                }
                                            }
                                            else
                                            {
                                                material.Consumo += componente.Consumo;
                                                material.ConsumoDesperdicio += componente.ConsumoDesperdicio;
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





