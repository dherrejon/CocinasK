app.controller("CostoConsumoPresupuesto", function($scope, $rootScope, datosUsuario, $window, datosUsuario, COSCONPRESUPUESTO, CocinasKService)
{   
    $rootScope.clasePrincipal = "";
    $scope.permiso = {ver: false};
    $scope.presupuesto = [];
    $scope.combinacion = [];
    $scope.material = [];
    $scope.materialInicial = [];
    $scope.modulofiltro = [];
    $scope.tipomodulo = [];
    $scope.puerta = [];
    $scope.accesorio = [];
    $scope.muestrarioAccesorio = [];
    $scope.tipoAccesorio = [];
    
    $scope.configuracion = false;
    $scope.animacionCon = "";
    $scope.conCombinacion = true;
    $scope.conPrecio = true;
    $scope.verPor = "combinacion";
    $scope.puertaSel = null;
    $scope.costoRadio = "total";
    $scope.consumoRadio = "total";
    
    $scope.acordion = {costo: false, consumo: false, accesorio: false, totalconsumo: false, totalcosto: false, totales:false};
    $scope.filtroModulo = {TipoModulo: {TipoModuloId:"", Nombre:""}, Modulo: {TipoModuloId:"", Nombre:""}};
    
    //------------ Cargar Catalogos --------------------
    $scope.CargarCatalagosInicio = function()
    {
        $scope.presupuesto = COSCONPRESUPUESTO.GetPresupuesto();
        //$scope.presupuesto = ["101", "336", "337"];
        //$scope.presupuesto = ["491"]; //417
        $scope.GetCatalogosCostoConsumo();
        
        //console.log($scope.presupuesto);
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
                
            
                //console.log($scope.combinacion);
                //console.log($scope.material);
                
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
                $scope.accesorio = dataResponse.data.accesorio;
                
                $scope.tipomodulo = alasql('SELECT DISTINCT TipoModuloId, NombreTipoModulo as Nombre FROM ?', [$scope.modulo]);
                $scope.modulofiltro = alasql('SELECT DISTINCT TipoModuloId, Nombre FROM ?', [$scope.modulo]);
                $scope.muestrarioAccesorio = alasql('SELECT DISTINCT MuestrarioId, Muestrario, TipoAccesorioId FROM ?', [$scope.accesorio]);
                $scope.tipoAccesorio = alasql('SELECT DISTINCT TipoAccesorioId, TipoAccesorio AS Nombre FROM ?', [$scope.accesorio]);
                
                for(var k=0; k<$scope.modulo.length; k++)
                {
                    $scope.modulo[k].AnchoNumero = FraccionADecimal($scope.modulo[k].Ancho);        
                    $scope.modulo[k].AltoNumero = FraccionADecimal($scope.modulo[k].Alto);        
                    $scope.modulo[k].ProfundoNumero = FraccionADecimal($scope.modulo[k].Profundo); 
                    
                    $scope.modulo[k].Cantidad = parseInt($scope.modulo[k].Cantidad);
                    $scope.modulo[k].Margen = parseFloat($scope.modulo[k].Margen);
                    $scope.modulo[k].Desperdicio = parseFloat($scope.modulo[k].Desperdicio);
                }
                
                for(accesorio of $scope.accesorio)
                {
                    accesorio.Cantidad = parseInt(accesorio.Cantidad);
                    accesorio.ConsumoUnidad = parseFloat(accesorio.ConsumoUnidad);
                    accesorio.Margen = parseFloat(accesorio.Margen)/100;
                    
                    accesorio.ConsumoTotal = accesorio.Cantidad *  accesorio.ConsumoUnidad;
                }
                
                for(tipo of $scope.tipoAccesorio)
                {
                    for(muestrario of $scope.muestrarioAccesorio)
                    {
                        if(tipo.TipoAccesorio == muestrario.TipoAccesorio)
                        {
                            tipo.Muestrario = muestrario;
                            
                            for(accesorio of $scope.accesorio)
                            {
                                if(accesorio.MuestrarioId == muestrario.MuestrarioId)
                                {
                                    tipo.Muestrario.Accesorio = accesorio;
                                    break;
                                }
                            }

                            break;
                        }
                    }
                }
                
                $scope.SetPrecioMaterial();
                //console.log($scope.tipomodulo);
                //console.log($scope.muestrarioAccesorio);
                //console.log($scope.tipoAccesorio);
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
        
        //accesorio
        for(var accesorio of $scope.accesorio)
        {
            for(var combinacion of accesorio.Combinacion)
            {
                combinacion.Costo = $scope.GetCostoMaterial(combinacion.MaterialId, combinacion.Grueso);
            }
        }
        
        $scope.CalcularCostoConsumo();
        
         //console.log($scope.modulo);
         //console.log($scope.puerta);
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
        
        //console.log($scope.materialConf );
    };
    
    $scope.ReestablecerCombinacion = function()
    {
        $scope.materialConf = [];
        
        for(var k=0; k<$scope.combinacionConf.length; k++)
        {
            $scope.combinacionConf[k].Ver = true;
        }  
        
        //console.log($scope.materialInicial);
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
                
                for(var modulo of $scope.modulo)
                {
                    modulo.Puerta = null;
                }
            }
            else
            {
                $scope.puertaSel = puerta;
                
                for(var modulo of $scope.modulo)
                {
                    CalcularCostoConsumoPuerta(modulo, $scope.combinacion, $scope.puertaSel);
                    modulo.Puerta = $scope.SetPuertaValores($scope.puertaSel);
                }
            }
            $scope.CalcularValoresCombinacion();
            $scope.CalcularValoresModulo();
            
            //console.log($scope.puertaSel);
        }
    };
    
    $scope.SetPuertaValores = function(data)
    {
        var puerta = new Object();
        
        puerta.PuertaId = data.PuertaId;
        puerta.Puerta = data.Puerta;
        puerta.MuestrarioId = data.MuestrarioId;
        puerta.Muestrario = data.Muestrario;
        puerta.Componente = [];
        
        for(var comp of data.Componente)
        {
            var aux = new Object();
            
            aux.Nombre = comp.Nombre;
            aux.ConsumoDesperdicio = comp.ConsumoDesperdicio;
            aux.Consumo = comp.Consumo;
            aux.Nombre = comp.Nombre;
            aux.ComponentePorPuertaId = comp.ComponentePorPuertaId;
            aux.ComponenteId = comp.ComponenteId;
            aux.Combinacion = [];
            aux.Pieza = [];
            
            for(var comb of comp.Combinacion)
            {
                var aux2 = new Object();
                
                aux2.TipoMaterialId = comb.TipoMaterialId;
                aux2.NombreTipoMaterial = comb.NombreTipoMaterial;
                aux2.NombreMaterial = comb.NombreMaterial;
                aux2.Nombre = comb.Nombre;
                aux2.MaterialId = comb.MaterialId;
                aux2.Grueso = comb.Grueso;
                aux2.Costo = comb.Costo;
                aux2.CombinacionMaterialId = comb.CombinacionMaterialId;
                
                aux.Combinacion.push(aux2);
            }
            
            for(var pie of comp.Pieza)
            {
                var aux2 = new Object();
                
                aux2.Nombre = pie.Nombre;
                aux2.Cantidad = pie.Cantidad;
                aux2.nAncho = pie.nAncho;
                aux2.nLargo = pie.nLargo;
                
                aux.Pieza.push(aux2);
            }
            
            puerta.Componente.push(aux);           
        }    
        
        return puerta;
    };
    
    $scope.CambiarVerPor = function()
    {
        if($scope.verPor == 'combinacion')
        {
            $scope.costoRadio = 'total';
        }
    };
    
    //-- filtros --
    $scope.CambiarTipoModuloFiltro = function(tipomodulo)
    {
        if(tipomodulo.TipoModuloId == $scope.filtroModulo.TipoModulo.TipoModuloId )
        {
            return;
        }
        
        if(tipomodulo == "Ninguno")
        {
            $scope.filtroModulo.TipoModulo.TipoModuloId = "";
            $scope.filtroModulo.TipoModulo.Nombre = "";
        }
        else
        {
            $scope.filtroModulo.TipoModulo.TipoModuloId = tipomodulo.TipoModuloId;
            $scope.filtroModulo.TipoModulo.Nombre = tipomodulo.Nombre;
        }
        
        $scope.filtroModulo.Modulo.TipoModuloId = "";
        $scope.filtroModulo.Modulo.Nombre = "";
        
    };
    
    $scope.CambiarModuloFiltro = function(modulo)
    {
        if($scope.filtroModulo.Modulo.Nombre == modulo.Nombre)
        {
            return;
        }
        
        if(modulo == "Ninguno")
        {
            $scope.filtroModulo.Modulo.TipoModuloId = "";
            $scope.filtroModulo.Modulo.Nombre = "";
        }
        else
        {
            $scope.filtroModulo.Modulo.TipoModuloId = modulo.TipoModuloId;
            $scope.filtroModulo.Modulo.Nombre = modulo.Nombre;
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
                 modulo.Puerta = $scope.SetPuertaValores($scope.puertaSel);
            }
        }
        else
        {
            for(var modulo of $scope.modulo)
            {
                modulo.Puerta = null;
            }
        }
        
        //console.log($scope.modulo);
        
        //Costo - Consumo Total
        $scope.CalcularValoresCombinacion();
        $scope.CalcularValoresModulo();
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
                
                for(var modulo of $scope.modulo) 
                {
                    //-- costos --
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
                        for(var componente of modulo.Puerta.Componente)
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
                    combinacion.CostoConsumible = combinacion.CostoDesperdicio   + (modulo.CostoConsumible * modulo.Cantidad);
                    combinacion.CostoMargen = combinacion.CostoConsumible + (combinacion.CostoConsumible * (modulo.Margen/100));
                    
                    
                    
                    
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
                                                    material.Consumo += componenteCombinacion.Consumo * modulo.Cantidad;
                                                    material.ConsumoDesperdicio += componenteCombinacion.ConsumoDesperdicio * modulo.Cantidad;
                                                    break;
                                                }
                                            //}
                                        }
                                        else
                                        {
                                            material.Consumo += componenteCombinacion.Consumo * modulo.Cantidad;
                                            material.ConsumoDesperdicio += componenteCombinacion.ConsumoDesperdicio * modulo.Cantidad;
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
                                                    material.Consumo += especialCombinacion.Consumo * modulo.Cantidad;
                                                    material.ConsumoDesperdicio += especialCombinacion.ConsumoDesperdicio * modulo.Cantidad;
                                                    break;
                                                }
                                            //}
                                        }
                                        else
                                        {
                                            material.Consumo += especialCombinacion.Consumo * modulo.Cantidad;
                                            material.ConsumoDesperdicio += especialCombinacion.ConsumoDesperdicio * modulo.Cantidad;
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
                        for(var componente of modulo.Puerta.Componente)
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
                                                    material.Consumo += componente.Consumo * modulo.Cantidad;
                                                    material.ConsumoDesperdicio += componente.ConsumoDesperdicio * modulo.Cantidad;
                                                    break;
                                                }
                                            }
                                            else
                                            {
                                                material.Consumo += componente.Consumo * modulo.Cantidad;
                                                material.ConsumoDesperdicio += componente.ConsumoDesperdicio * modulo.Cantidad;
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
       
        
        //console.log($scope.modulo);
        //console.log($scope.combinacion);
       
    };
    
    //calcular los valores por módulo
    $scope.CalcularValoresModulo = function()
    {   
        for(var modulo of $scope.modulo)
        {
            for(var combinacion of modulo.Combinacion)
            {
                //-- Costo ---
                //modulo
                combinacion.CostoUnitario = combinacion.Costo;
                
                //puerta
                if($scope.puertaSel)
                {
                    for(var componente of modulo.Puerta.Componente)
                    {
                        for(var puertaCombinacion of componente.Combinacion)
                        {
                            if(puertaCombinacion.CombinacionMaterialId == combinacion.CombinacionMaterialId)
                            {
                                combinacion.CostoUnitario += (componente.Consumo * parseFloat(puertaCombinacion.Costo));
                                break;
                            }
                        }
                    }
                }
                
                combinacion.CostoDesperdicioUnitario  = combinacion.CostoUnitario + (combinacion.CostoUnitario*(modulo.Desperdicio/100));
                combinacion.CostoConsumibleUnitario = combinacion.CostoDesperdicioUnitario + modulo.CostoConsumible;
                combinacion.CostoMargenUnitario = combinacion.CostoConsumibleUnitario + (combinacion.CostoConsumibleUnitario * (modulo.Margen/100));
                
                combinacion.CostoTotal = combinacion.CostoUnitario * modulo.Cantidad;
                combinacion.CostoDesperdicioTotal  = combinacion.CostoTotal + (combinacion.CostoTotal*(modulo.Desperdicio/100));
                combinacion.CostoConsumibleTotal = combinacion.CostoDesperdicioTotal   + (modulo.CostoConsumible * modulo.Cantidad);
                combinacion.CostoMargenTotal = combinacion.CostoConsumibleTotal + (combinacion.CostoConsumibleTotal * (modulo.Margen/100));
                
                
                //-- Consumo --
                //Módulo consumo
                
                for(var combinacion of modulo.Combinacion)
                {
                    //material
                    combinacion.Material = [];

                    for(var material of $scope.material)
                    {
                        var mataux = {TipoMaterialId:material.TipoMaterialId, MaterialId:material.MaterialId, Material:material.NombreMaterial, Grueso:"1", ConsumoUnitario:0, ConsumoDesperdicioUnitario: 0,  ConsumoTotal: 0, ConsumoDesperdicioTotal: 0, GruesoN:1};
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
                                            if(material.Grueso == componenteCombinacion.Grueso)
                                            {
                                                material.ConsumoUnitario += componenteCombinacion.Consumo;
                                                material.ConsumoDesperdicioUnitario += componenteCombinacion.ConsumoDesperdicio;
                                                
                                                material.ConsumoTotal += componenteCombinacion.Consumo * modulo.Cantidad;
                                                material.ConsumoDesperdicioTotal += componenteCombinacion.ConsumoDesperdicio * modulo.Cantidad;
                                                break;
                                            }
                                        }
                                        else
                                        {
                                            material.ConsumoUnitario += componenteCombinacion.Consumo;
                                            material.ConsumoDesperdicioUnitario += componenteCombinacion.ConsumoDesperdicio;
                                            
                                            material.ConsumoTotal += componenteCombinacion.Consumo * modulo.Cantidad;
                                            material.ConsumoDesperdicioTotal += componenteCombinacion.ConsumoDesperdicio * modulo.Cantidad;
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
                                            if(material.Grueso == especialCombinacion.Grueso)
                                            {
                                                material.ConsumoUnitario += especialCombinacion.Consumo;
                                                material.ConsumoDesperdicioUnitario += especialCombinacion.ConsumoDesperdicio;
                                                
                                                material.ConsumoTotal += especialCombinacion.Consumo * modulo.Cantidad;
                                                material.ConsumoDesperdicioTotal += especialCombinacion.ConsumoDesperdicio * modulo.Cantidad;
                                                break;
                                            }
                                        }
                                        else
                                        {
                                            material.ConsumoUnitario += especialCombinacion.Consumo;
                                            material.ConsumoDesperdicioUnitario += especialCombinacion.ConsumoDesperdicio;
                                            
                                            material.ConsumoTotal += especialCombinacion.Consumo * modulo.Cantidad;
                                            material.ConsumoDesperdicioTotal += especialCombinacion.ConsumoDesperdicio * modulo.Cantidad;
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
                        for(var componente of modulo.Puerta.Componente)
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
                                                    material.ConsumoUnitario += componente.Consumo;
                                                    material.ConsumoDesperdicioUnitario += componente.ConsumoDesperdicio;
                                                    
                                                    material.ConsumoTotal += componente.Consumo * modulo.Cantidad;
                                                    material.ConsumoDesperdicioTotal += componente.ConsumoDesperdicio * modulo.Cantidad;
                                                    break;
                                                }
                                            }
                                            else
                                            {
                                                material.ConsumoUnitario += componente.Consumo;
                                                material.ConsumoDesperdicioUnitario += componente.ConsumoDesperdicio;
                                                
                                                material.ConsumoTotal += componente.Consumo * modulo.Cantidad;
                                                material.ConsumoDesperdicioTotal += componente.ConsumoDesperdicio * modulo.Cantidad;
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
    };
    
    //------ Piezas ------
    $scope.VerPiezasModulo = function(modulo)
    {
        $rootScope.$broadcast('PiezaModulo', modulo);
    };
    
    //------ Totales ------
    $scope.GetCostoAccesorio = function(combinacion)
    {
        if( $scope.tipoAccesorio && combinacion)
        {
             var total = combinacion.Costo;
            for(tipo of $scope.tipoAccesorio)
            {
                if(tipo.Muestrario.Accesorio)
                {
                    for(combinacionAcceserio of tipo.Muestrario.Accesorio.Combinacion)
                    {
                        if(combinacion.CombinacionMaterialId == combinacionAcceserio.CombinacionMaterialId)
                        {
                            total += (tipo.Muestrario.Accesorio.ConsumoTotal * combinacionAcceserio.Costo);
                            break;
                        }
                    }
                }
            }
            
            return total;
        }
        else
        {
            return 0;
        }

    }
    
    $scope.GetCostoMargenAccesorio = function(combinacion)
    {
        
        if( $scope.tipoAccesorio && combinacion)
        {
            var total = combinacion.CostoMargen;
            
            for(tipo of $scope.tipoAccesorio)
            {
                if(tipo.Muestrario.Accesorio)
                {
                    for(combinacionAcceserio of tipo.Muestrario.Accesorio.Combinacion)
                    {
                        if(combinacion.CombinacionMaterialId == combinacionAcceserio.CombinacionMaterialId)
                        {
                            total += (tipo.Muestrario.Accesorio.ConsumoTotal * combinacionAcceserio.Costo * (tipo.Muestrario.Accesorio.Margen+1));
                            break;
                        }
                    }
                }
            }
            
            return total;
        }
        else
        {
            return 0;
        }
    }
    
    $scope.GetTotalAccesorioConsumo = function(material, combinacionid)
    {
        if( $scope.tipoAccesorio && material)
        {
            for(mat of material)
            {
                mat.ConsumoAccesorio = mat.Consumo;
                
                for(tipo of $scope.tipoAccesorio)
                {
                    if(tipo.Muestrario.Accesorio)
                    {
                        for(combinacionAcceserio of tipo.Muestrario.Accesorio.Combinacion)
                        {
                            if(combinacionid == combinacionAcceserio.CombinacionMaterialId && mat.MaterialId == combinacionAcceserio.MaterialId && mat.Grueso ==  combinacionAcceserio.Grueso)
                            {
                                
                                mat.ConsumoAccesorio += tipo.Muestrario.Accesorio.ConsumoTotal;
                                break;
                            }
                        }
                    }
                }
            }
            
            return material;
        }
        else
        {
            return material;
        }
                
    }
    
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





