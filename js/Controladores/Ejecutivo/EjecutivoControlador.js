app.controller("EjecutivoControlador", function($scope, $http, $q, CONFIG, datosUsuarioPerfil, md5, $rootScope, datosUsuario, $window)
{   
    $scope.modulo = null;
    $scope.tipoModulo = null;
    $scope.medidaModulo = null;
    $scope.material = null;
    $scope.gruesoMaterial = null;
    
    $scope.moduloSeleccionado = {};
    
    $scope.frenteModulo = {};
    
    $scope.CambiarTipoModulo = function(tipo)
    {
        tipo.Activo = true;
        $scope.moduloSeleccionado.tipoModulo = tipo;
    };
    
    $scope.CambiarModulo = function(modulo)
    {
        $scope.moduloSeleccionado.modulo = modulo.Nombre;
        $scope.moduloSeleccionado.moduloId = modulo.ModuloId;
        $scope.GetMedidasPorModulo(modulo.ModuloId);

    };
    
    $scope.CambiarModulo2 = function(modulo)
    {
        var q = $q.defer();
        $scope.GetComponentePorModulo(modulo.moduloId).then(function(data)
        {
            $scope.GetCombinacionPorMaterialComponente(4, $scope.frenteModulo);
            $scope.GetPartePorModulo(modulo.moduloId).then(function(data)
            {
                q.resolve(data);
            });
        });
        return q.promise;
    };
    
    $scope.CambiarAncho = function(ancho)
    {
        $scope.moduloSeleccionado.ancho = ancho;
    };
    
    $scope.CambiarAlto = function(alto)
    {
        $scope.moduloSeleccionado.alto = alto;
        $scope.moduloSeleccionado.Alto = alto;
    };
    
    $scope.CambiarProfundo = function(profundo)
    {
        $scope.moduloSeleccionado.profundo = profundo;
    };
    
    $scope.GetCombinaciones = function()
    {
        var q = $q.defer();
        
        $scope.combinacion = [];
        $scope.GetCombinacionPorMaterialComponente(4, $scope.combinacion).then(function(data)
        {
            q.resolve(data);
        });
        
        return q.promise;
    };
    
    $scope.CalcularCosto = function()
    {
        $scope.CambiarModulo2($scope.moduloSeleccionado).then(function(data)
        {
            $scope.GetCombinaciones().then(function(data)
            {
                $scope.CalcularPuerta();
                $scope.CalcularLargoPartes();
                $scope.moduloSeleccionado.ancho = $scope.FraccionADecimal($scope.moduloSeleccionado.ancho);
                $scope.moduloSeleccionado.alto = $scope.FraccionADecimal($scope.moduloSeleccionado.alto);
                $scope.moduloSeleccionado.profundo = $scope.FraccionADecimal($scope.moduloSeleccionado.profundo);

                for(var k=0; k<$scope.componenteModulo.length; k++)
                {
                    for(var i=0; i<$scope.componenteModulo[k].Pieza.length; i++)
                    {
                        $scope.componenteModulo[k].Pieza[i].Pieza.FormulaAncho = $scope.SustituirModulo($scope.componenteModulo[k].Pieza[i].Pieza.FormulaAncho);
                        $scope.componenteModulo[k].Pieza[i].Pieza.FormulaLargo = $scope.SustituirModulo($scope.componenteModulo[k].Pieza[i].Pieza.FormulaLargo);

                        $scope.componenteModulo[k].Pieza[i].Pieza.FormulaAncho = $scope.SustituirParte($scope.componenteModulo[k].Pieza[i].Pieza.FormulaAncho);
                        $scope.componenteModulo[k].Pieza[i].Pieza.FormulaLargo = $scope.SustituirParte($scope.componenteModulo[k].Pieza[i].Pieza.FormulaLargo);
                    }

                    for(var i=0; i<$scope.componenteModulo[k].Combinacion.length; i++)
                    {
                        var formulaAncho = "";
                        var formulaLargo = "";
                        if($scope.componenteModulo[k].Combinacion[i].CombinacionMaterial.Activo)
                        {
                            $scope.componenteModulo[k].Combinacion[i].Pieza = [];
                            for(var j=0; j<$scope.componenteModulo[k].Pieza.length; j++)
                            {
                                $scope.componenteModulo[k].Combinacion[i].Pieza[j] = new Object();

                                formulaAncho = $scope.SustituirComponente($scope.componenteModulo[k].Pieza[j].Pieza.FormulaAncho, $scope.componenteModulo[k].Combinacion[i].CombinacionMaterial.CombinacionMaterialId);
                                formulaLargo = $scope.SustituirComponente($scope.componenteModulo[k].Pieza[j].Pieza.FormulaLargo, $scope.componenteModulo[k].Combinacion[i].CombinacionMaterial.CombinacionMaterialId);

                                $scope.componenteModulo[k].Combinacion[i].Pieza[j].formulaAncho = formulaAncho;
                                $scope.componenteModulo[k].Combinacion[i].Pieza[j].formulaLargo = formulaLargo;

                                $scope.componenteModulo[k].Combinacion[i].Pieza[j].largo = $scope.EvaluarFormulaParcial(formulaLargo);
                                $scope.componenteModulo[k].Combinacion[i].Pieza[j].ancho = $scope.EvaluarFormulaParcial(formulaAncho);
                                $scope.componenteModulo[k].Combinacion[i].Pieza[j].nombre = $scope.componenteModulo[k].Pieza[j].Pieza.Nombre;

                                $scope.componenteModulo[k].Combinacion[i].Pieza[j].cantidad = $scope.componenteModulo[k].Pieza[j].Cantidad;

                                //console.log($scope.componenteModulo[k].Componente.Nombre + " "+ $scope.componenteModulo[k].Combinacion[i].CombinacionMaterial.Nombre, + " " + $scope.componenteModulo[k].Pieza[j].Pieza.Nombre);
                                //console.log("ancho: "+formulaAncho);
                                //console.log("largo: "+ formulaLargo);
                            }

                        }
                    }

                    for(var i=0; i<$scope.componenteModulo[k].Combinacion.length; i++)
                    {
                        if($scope.componenteModulo[k].Combinacion[i].CombinacionMaterial.Activo)
                        {
                            for(var j=0; j<$scope.componenteModulo[k].Combinacion[i].Pieza.length; j++)
                            {
                                $scope.SustituirPieza($scope.componenteModulo[k].Combinacion[i].Pieza[j], $scope.componenteModulo[k].Combinacion[i].Pieza);
                            }
                        }
                    }
                }

                $scope.CalcularCostoPorCombinacion();
                $scope.CalcularCostoPorMaterial();

                //console.log($scope.componenteModulo);
            });
        });
        
        
    };
    
    
    $scope.CalcularCostoPorMaterial = function()
    {
        for(var k=0; k<$scope.componenteModulo.length; k++)
        {
            for(var i=0; i<$scope.componenteModulo[k].Combinacion.length; i++)
            {
                if($scope.componenteModulo[k].Combinacion[i].CombinacionMaterial.Activo)
                {
                    for(var j=0; j<$scope.material.length; j++)
                    {
                        if($scope.material[j].MaterialId == $scope.componenteModulo[k].Combinacion[i].Material.MaterialId)
                        {
                            if($scope.material[j].grueso.length === 0)
                            {
                                $scope.componenteModulo[k].Combinacion[i].costo = $scope.componenteModulo[k].Combinacion[i].consumo * $scope.material[j].CostoUnidad * $scope.componenteModulo[k].Cantidad;
                                
                            }
                            else
                            {
                                for(var l=0; l<$scope.material[j].grueso.length; l++)
                                {
                                    
                                    if($scope.material[j].grueso[l].Grueso == $scope.componenteModulo[k].Combinacion[i].Grueso)
                                    {
                                        $scope.componenteModulo[k].Combinacion[i].costo = $scope.componenteModulo[k].Combinacion[i].consumo * $scope.material[j].grueso[l].CostoUnidad * $scope.componenteModulo[k].Cantidad;
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
        
        for(var k=0; k<$scope.combinacion.length; k++)
        {
            $scope.combinacion[k].costoTotal = 0;
            if($scope.combinacion[k].CombinacionMaterial.Activo)
            {
                for(var i=0; i<$scope.material.length; i++)
                {
                    if($scope.material[i].MaterialId == $scope.combinacion[k].Material.MaterialId)
                    {
                        if($scope.material[i].grueso.length === 0)
                        {
                            $scope.combinacion[k].costoFrente = $scope.combinacion[k].consumoFrenteModulo * $scope.material[i].CostoUnidad;
                            $scope.combinacion[k].costoTotal += $scope.combinacion[k].costoFrente; 
                        }
                        else
                        {
                            for(var j=0; j<$scope.material[i].grueso.length; j++)
                            {

                                if($scope.material[i].grueso[j].Grueso == $scope.combinacion[k].Grueso)
                                {
                                    $scope.combinacion[k].costoFrente = $scope.combinacion[k].consumoFrenteModulo * $scope.material[i].grueso[j].CostoUnidad;
                                    $scope.combinacion[k].costoTotal += $scope.combinacion[k].costoFrente; 
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                
                for(var i=0; i<$scope.componenteModulo.length; i++)
                {
                    for(var j=0; j<$scope.componenteModulo[i].Combinacion.length; j++)
                    {
                        if($scope.componenteModulo[i].Combinacion[j].CombinacionMaterial.CombinacionMaterialId == $scope.combinacion[k].CombinacionMaterial.CombinacionMaterialId)
                        {
                            $scope.combinacion[k].costoTotal += $scope.componenteModulo[i].Combinacion[j].costo;
                            break;
                        }
                    }
                }
            }
        }
        
        
        //console.log($scope.combinacion);
        //console.log($scope.componenteModulo);
        //console.log($scope.parteModulo);
    };
    
    $scope.CalcularCostoPorCombinacion = function()
    {
        $scope.combinacion = $scope.combinacion.Combinacion;
        //console.log($scope.combinacion[0]);
        for(var i=0; i<$scope.combinacion.length; i++)
        {
            var consumo = 0;
            if($scope.combinacion[i].CombinacionMaterial.Activo)
            {
                for(var k=0; k<$scope.parteModulo.length; k++)
                {
                    //console.log($scope.combinacion[i].Grueso);
                    consumo += $scope.parteModulo[k].Ancho * $scope.parteModulo[k].Largo;
                }
                $scope.combinacion[i].consumoFrenteModulo = consumo/144;
                //$scope.combinacion[i].consumoTotal = 0;
            }
        }
        //console.log($scope.combinacion);
        
        for(var i=0; i<$scope.componenteModulo.length; i++)
        {
            var consumoTotal = 0;
            var costo = 0;
            for(var j=0; j<$scope.componenteModulo[i].Combinacion.length; j++)
            {
                var consumo = 0;
                if($scope.componenteModulo[i].Combinacion[j].CombinacionMaterial.Activo)
                {
                    for(var k=0; k<$scope.componenteModulo[i].Combinacion[j].Pieza.length; k++)
                    {
                        $scope.componenteModulo[i].Combinacion[j].Pieza[k].consumo = $scope.componenteModulo[i].Combinacion[j].Pieza[k].ancho * $scope.componenteModulo[i].Combinacion[j].Pieza[k].largo;
                        consumo += $scope.componenteModulo[i].Combinacion[j].Pieza[k].consumo * $scope.componenteModulo[i].Combinacion[j].Pieza[k].cantidad;
                    }
                    
                    /*for(var k=0; k<$scope.combinacion.length; k++)
                    {
                        if($scope.combinacion[k].CombinacionMaterial.CombinacionMaterialId == $scope.componenteModulo[i].Combinacion[j].CombinacionMaterial.CombinacionMaterialId)
                        {
                            var index = $scope.componenteModulo[i].Combinacion[j].Pieza.length;
                            $scope.componenteModulo[i].Combinacion[j].Pieza[index] = new Object();
                            $scope.componenteModulo[i].Combinacion[j].Pieza[index].nombre = "Frente Modulo";
                            $scope.componenteModulo[i].Combinacion[j].Pieza[index].consumo = $scope.combinacion[k].consumoFrenteModulo;
                            consumo += $scope.combinacion[k].consumoFrenteModulo;
                            
                            //$scope.combinacion[i].consumoTotal += consumo/1728;
                            
                            break;
                        }
                    }*/
                }
             
                
                /*if($scope.componenteModulo[i].Combinacion[j].Material.TipoMaterial.Nombre == "Hoja")
                {
                    consumo = consumo/32;
                }*/
                
                $scope.componenteModulo[i].Combinacion[j].consumo = consumo/144; 
                //consumoTotal += consumo;
            }
            //$scope.componenteModulo[i].consumo = consumoTotal;
        }
        
        //console.log($scope.componenteModulo);
    };
    
    $scope.SustituirPieza = function(pieza, piezas)
    {
        if(pieza.ancho == -1)
        {
            $scope.ObtenerAnchoLargo(pieza.formulaAncho, piezas);
            //console.log(pieza.formulaAncho);
        }
        if(pieza.largo == -1)
        {
            $scope.ObtenerAnchoLargo(pieza.formulaLargo, piezas);
            //console.log(pieza.formulaLargo);
        }
    };    
    
    $scope.ObtenerAnchoLargo = function(formula, pieza)
    {
        var nombrePieza;
        var medidaPieza;
        
        var index = formula.indexOf("[Pieza]");
        var count = 0;
        
        while(index > -1)
        {
            nombrePieza = "";
            medidaPieza = "";
            
            for(var j=index+8; j<formula.length; j++)
            {
                nombrePieza += formula[j];
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

            //console.log(nombrePieza);
            //console.log(medidaPieza);
            //console.log(pieza);
            for(var j=0; j<pieza.length; j++)
            {
                console.log("pieza: "+pieza[j].nombre);
                if(pieza[j].nombre == nombrePieza)
                {
                    var medida = "[Pieza][" + nombrePieza + "][" + medidaPieza + "]";

                    //console.log(medida);
                    //console.log(formula);

                    if(medidaPieza == "Largo")
                    {
                        if(pieza[j].largo > -1)
                        {
                            formula = formula.replace(medida, pieza[j].largo);
                        }
                        else
                        {
                            pieza[j].largo = $scope.ObtenerAnchoLargo(pieza[j].formulaLargo, pieza);
                            formula = formula.replace(medida, pieza[j].largo);
                        }
                    }
                    else if(medidaPieza == "Ancho")
                    {
                        console.log("ancho: "+pieza[j].ancho);
                        if(pieza[j].ancho > -1)
                        {
                            formula = formula.replace(medida, pieza[j].ancho);
                        }
                        else
                        {
                            pieza[j].ancho = $scope.ObtenerAnchoLargo(pieza[j].formulaAncho, pieza);
                            formula = formula.replace(medida, pieza[j].ancho);
                        }
                    }

                    break;
                }
                
            }

            
            count++;
                if(count == 5)
                    break;
            
            index = formula.indexOf("[Pieza]");
            
            //console.log(ancho);
            //console.log(index);
        }
        
        //console.log(  formula + " = " + eval(formula));
        return eval(formula);
    };
    
    $scope.CalcularLargoPartes = function()
    {
        for(var k=0; k<$scope.parteModulo.length; k++)
        {
            $scope.parteModulo[k].Ancho = $scope.FraccionADecimal($scope.parteModulo[k].Ancho);
        }
        
        for(var k=0; k<$scope.parteModulo.length; k++)
        {
            if($scope.parteModulo[k].TipoParteId == "1" || $scope.parteModulo[k].TipoParteId == "2")
            {
                $scope.parteModulo[k].Largo = $scope.FraccionADecimal($scope.moduloSeleccionado.alto);
            }
            else
            {
                var ancho = $scope.FraccionADecimal($scope.moduloSeleccionado.ancho);
                var cosIzq = 0;
                var cosDer = 0;
                
                for(var i=0; i<$scope.parteModulo.length; i++)
                {
                    if($scope.parteModulo[i].TipoParteId == "1")
                    {
                        cosIzq = $scope.parteModulo[i].Ancho;
                    }
                    if($scope.parteModulo[i].TipoParteId == "2")
                    {
                        cosDer = $scope.parteModulo[i].Ancho;
                    }
                }
                
                //console.log(cosIzq);
                //console.log(cosDer);
                $scope.parteModulo[k].Largo  = ancho - (cosIzq + cosDer);
            }
        }
    };
    
    $scope.EvaluarFormulaParcial = function(formula)
    {
        if(formula.includes("["))
        {
            return -1;
        }
        else
        {
            return eval(formula);
        }
    };
    
    $scope.FraccionADecimal = function(valor)
    {
        if(isNaN(valor))
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
        }
        else
        {
            valor = eval(valor);
            return valor;
        }
       
    };
    
    $scope.SustituirModulo = function(formula)
    {
        formula = formula.replace("[Modulo][Ancho]", $scope.moduloSeleccionado.ancho);
        formula = formula.replace("[Modulo][Alto]", $scope.moduloSeleccionado.alto);
        formula = formula.replace("[Modulo][Profundo]", $scope.moduloSeleccionado.profundo);
        
        //console.log(formula);
        
        return formula;
    };
    
    $scope.SustituirParte = function(formula)
    {
        for(var k=0; k<$scope.parteModulo.length; k++)
        {
            if($scope.parteModulo[k].TipoParteId == "1")
            {
                formula = formula.replace("[Pieza][Costado Izquierdo][Ancho]", $scope.parteModulo[k].Ancho);
                formula = formula.replace("[Pieza][Costado Izquierdo][Largo]", $scope.parteModulo[k].Largo);
            }
            else if($scope.parteModulo[k].TipoParteId == "2")
            {
                formula = formula.replace("[Pieza][Costado Derecho][Ancho]", $scope.parteModulo[k].Ancho);
                formula = formula.replace("[Pieza][Costado Derecho][Largo]", $scope.parteModulo[k].Largo);
            }
            else if($scope.parteModulo[k].TipoParteId == "3")
            {
                formula = formula.replace("[Pieza][Peinazo Superior][Ancho]", $scope.parteModulo[k].Ancho);
                formula = formula.replace("[Pieza][Peinazo Superior][Largo]", $scope.parteModulo[k].Largo);
            }
            else if($scope.parteModulo[k].TipoParteId == "4")
            {
                formula = formula.replace("[Pieza][Peinazo Medio][Ancho]", $scope.parteModulo[k].Ancho);
                formula = formula.replace("[Pieza][Peinazo Medio][Largo]", $scope.parteModulo[k].Largo);
            }
            else if($scope.parteModulo[k].TipoParteId == "5")
            {
                formula = formula.replace("[Pieza][Peinazo Inferior][Ancho]", $scope.parteModulo[k].Ancho);
                formula = formula.replace("[Pieza][Peinazo Inferior][Largo]", $scope.parteModulo[k].Largo);
            }
        }
        
        //console.log(formula);
        
        return formula;
    };
    
    $scope.SustituirComponente = function(formula, combinacionId)
    {
        var nombreComponente;
        
        var index = formula.indexOf("[Componente]");
        
        while(index > -1)
        {
            nombreComponente = "";
            
            for(var j=index+13; j<formula.length; j++)
            {
                nombreComponente += formula[j];
                if(formula[j+1] == "]")
                {
                    index = j+1;
                    break;
                }
            }

            //console.log(nombreComponente);
            
            var medida = "[Componente][" + nombreComponente + "][Grueso]";
            
            if(nombreComponente == "Frente Modulo")
            {
                for(var k=0; k<$scope.frenteModulo.Combinacion.length; k++)
                {
                    if(combinacionId == $scope.frenteModulo.Combinacion[k].CombinacionMaterial.CombinacionMaterialId)
                    {
                        var grueso = $scope.FraccionADecimal($scope.frenteModulo.Combinacion[k].Grueso);
                        formula = formula.replace(medida, grueso);
                        break;
                    }
                }
            }
            else
            {
                for(var j=0; j<$scope.componenteModulo.length; j++)
                {
                     if($scope.componenteModulo[j].Componente.Nombre == nombreComponente)
                    {


                        for(var k=0; k<$scope.componenteModulo[j].Combinacion.length; k++)
                        {
                            if(combinacionId == $scope.componenteModulo[j].Combinacion[k].CombinacionMaterial.CombinacionMaterialId)
                            {
                                var grueso = $scope.FraccionADecimal($scope.componenteModulo[j].Combinacion[k].Grueso);
                                formula = formula.replace(medida, grueso);
                                break;
                            }
                        }
                        break;
                    }
                }
            }

            index = formula.indexOf("[Componente]");
        }
    
        return formula;
    };
    
    /*------------------------------Catálogos------------------------------*/
    $scope.GetModulo = function()          
    {
        GetModulo($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.modulo = data;
            }
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
    
    $scope.GetMedidasPorModulo = function(moduloId)
    {
        GetMedidasPorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.medidaModulo = data;
            
        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    $scope.GetComponentePorModulo = function(moduloId)
    {
        var q = $q.defer();
        GetComponentePorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.componenteModulo = data;
            
            for(var k=0; k<$scope.componenteModulo.length; k++)
            {
                $scope.GetCombinacionPorMaterialComponente($scope.componenteModulo[k].Componente.ComponenteId, $scope.componenteModulo[k]);
                $scope.GetPiezaPorComponente($scope.componenteModulo[k].Componente.ComponenteId, $scope.componenteModulo[k]);
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
    
    $scope.GetCombinacionPorMaterialComponente = function(componenteId, componente)          
    {
        var q = $q.defer();
        
        GetCombinacionPorMaterialComponente($http, $q, CONFIG, componenteId, "componente").then(function(data)
        {
            if(data.length > 0)
            {
                componente.Combinacion = data;
                q.resolve("listo");
            }
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
    
    $scope.GetPartePorModulo = function(moduloId)
    {
        var q = $q.defer();
        GetPartePorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.parteModulo = data;
            q.resolve("listo");
        }).catch(function(error)
        {
            q.resolve("error");
            alert("Ha ocurrido un error." + error);
            return;
        });
        
        return q.promise;
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
    
    
    /*------------ Puertas -------------------*/
    $scope.puerta = [];
    $scope.seccionModulo = [];
    $scope.puertaSeleccionada = new Object();
    $scope.componentePuerta = [];
    $scope.combinacionPuerta = [];
    
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
    
    $scope.GetSeccionPorModulo = function(moduloId)
    {
        var q = $q.defer();
        
        GetSeccionPorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.seccionModulo = data;

            for(var k=0; k<data.length; k++)
            {   
                $scope.GetLuzPorSeccion($scope.seccionModulo[k].SeccionPorModuloId, k).then(function(respuesta)
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
            $scope.seccionModulo[index].LuzPorSeccion = data;
            q.resolve(index);  
        }).catch(function(error)
        {
            q.resolve("error");  
            alert("Ha ocurrido un error." + error);
            return;
        });
        return q.promise;
    };
    
     $scope.GetComponentePorPuerta = function(puertaId)      
    {
        GetComponentePorPuerta($http, $q, CONFIG, puertaId).then(function(data)
        {
            $scope.componentePuerta = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetCombinacionPorPuerta = function(puertaId)
    {
        GetCombinacionPorMaterialComponente($http, $q, CONFIG, puertaId, "puerta").then(function(data)
        {
            $scope.combinacionPuerta = data;
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener los componentes." + error);
            return;
        });
    };
    
    $scope.CambiarPuerta = function(puerta)
    {
        $scope.puertaSeleccionada  = puerta;
        
        
        $scope.GetCombinacionPorPuerta(puerta.PuertaId);
    };
    
    $scope.CalcularPuerta = function()
    {
        $scope.GetComponentePorPuerta($scope.puertaSeleccionada.PuertaId);
        
        $scope.GetSeccionPorModulo($scope.moduloSeleccionado.moduloId).then(function(data)
        {
            if(data == "listo")
            {
                $scope.CalcularMedidaSeccion();
                $scope.CalcularConsumoPuerta();
            }
        });
    };
    
    $scope.CalcularConsumoPuerta = function()
    {   
        var count = 0;
        
        for(var i=0; i<$scope.seccionModulo.length; i++)
        {
            $scope.seccionModulo[i].Pieza = [];
            count = 0;
            for(var k=0; k<$scope.componentePuerta.length; k++)
            {
                if($scope.seccionModulo[i].SeccionModulo.Nombre == "Puerta" && ($scope.componentePuerta[k].NombreComponente == "Panel Puerta" || $scope.componentePuerta[k].NombreComponente == "Frente Puerta"))
                {
                    $scope.seccionModulo[i].Pieza[count] = $scope.componentePuerta[k];
                    count++;
                }
                if($scope.seccionModulo[i].SeccionModulo.Nombre == "Cajón" && ($scope.componentePuerta[k].NombreComponente == "Panel Cajón" || $scope.componentePuerta[k].NombreComponente == "Frente Cajón" || $scope.componentePuerta[k].NombreComponente == "Interior Cajón"))
                {
                    $scope.seccionModulo[i].Pieza[count] = $scope.componentePuerta[k];
                    count++;
                }
            }
        }
        
        for(var i=0; i<$scope.seccionModulo.length; i++)
        {
            
            for(var k=0; k<$scope.seccionModulo[i].Pieza.length; k++)
            {
                $scope.seccionModulo[i].Pieza[k].FormulaAncho = $scope.SustituirMedidaPuerta($scope.seccionModulo[i].Pieza[k].FormulaAncho, $scope.seccionModulo[i].AltoSeccion, $scope.seccionModulo[i].AnchoSeccion);
                $scope.seccionModulo[i].Pieza[k].FormulaLargo = $scope.SustituirMedidaPuerta($scope.seccionModulo[i].Pieza[k].FormulaLargo, $scope.seccionModulo[i].AltoSeccion, $scope.seccionModulo[i].AnchoSeccion);
                
                $scope.seccionModulo[i].Pieza[k].Ancho = $scope.EvaluarFormulaParcialPuerta($scope.seccionModulo[i].Pieza[k].FormulaAncho); 
                $scope.seccionModulo[i].Pieza[k].Largo = $scope.EvaluarFormulaParcialPuerta($scope.seccionModulo[i].Pieza[k].FormulaLargo);
            }
            
            for(var k=0; k<$scope.seccionModulo[i].Pieza.length; k++)
            {
                if($scope.seccionModulo[i].Pieza[k].Ancho == -1)
                {
                    $scope.seccionModulo[i].Pieza[k].Ancho = $scope.SustituirPiezasPuerta($scope.seccionModulo[i].Pieza[k].FormulaAncho, $scope.seccionModulo[i].Pieza);
                }
                if($scope.seccionModulo[i].Pieza[k].Largo == -1)
                {
                    $scope.seccionModulo[i].Pieza[k].Largo = $scope.SustituirPiezasPuerta($scope.seccionModulo[i].Pieza[k].FormulaLargo, $scope.seccionModulo[i].Pieza);
                }
            }
        }
        
        //for(var i=0; i<$scope.combinacion.length; i++)
        //{
        var costo = 0;
        for(var j=0; j<$scope.seccionModulo.length; j++)
        {
            for(var k=0; k<$scope.seccionModulo[j].Pieza.length; k++)
            {
                for(var l=0; l<$scope.combinacionPuerta.length; l++)
                {
                    for(var i=0; i<$scope.combinacion.length; i++)
                    {
                        if($scope.seccionModulo[j].Pieza[k].ComponenteId == $scope.combinacionPuerta[l].Componente.ComponenteId && $scope.combinacionPuerta[l].CombinacionMaterial.CombinacionMaterialId == $scope.combinacion[i].CombinacionMaterial.CombinacionMaterialId)
                        {
                            for(var m=0; m<$scope.material.length; m++)
                            {
                                if($scope.material[m].MaterialId == $scope.combinacionPuerta[l].Material.MaterialId)
                                {
                                    if($scope.material[m].grueso.length>0)
                                    {
                                        for(var n=0; n<$scope.material[m].grueso.length; n++)
                                        {
                                            if($scope.material[m].grueso[n].Grueso == $scope.combinacionPuerta[l].Grueso)
                                            {
                                                costo = (($scope.seccionModulo[j].Pieza[k].Ancho * $scope.seccionModulo[j].Pieza[k].Largo)/144)*$scope.seccionModulo[j].Pieza[k].Cantidad*$scope.material[m].grueso[n].CostoUnidad;
                                                break;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        costo = (($scope.seccionModulo[j].Pieza[k].Ancho * $scope.seccionModulo[j].Pieza[k].Largo)/144)*$scope.seccionModulo[j].Pieza[k].Cantidad*$scope.material[m].CostoUnidad;
                                    }
                                    break;
                                }
                            }
                            /*console.log($scope.combinacion[i].CombinacionMaterial.Nombre);
                            console.log($scope.seccionModulo[j].SeccionModulo.Nombre + ": " + ((($scope.seccionModulo[j].Pieza[k].Ancho * $scope.seccionModulo[j].Pieza[k].Largo)/144)*$scope.seccionModulo[j].Pieza[k].Cantidad));
                            console.log($scope.seccionModulo[j].Pieza[k].NombrePieza + ": " + costo);*/
                            $scope.combinacion[i].costoTotal += costo*$scope.seccionModulo[j].NumeroPiezas;
                            costo = 0;
                            break;
                        }
                    }
                }
            }
        }
        //}
        //console.log($scope.material);
        //console.log($scope.combinacion);
        //console.log($scope.seccionModulo);
        //console.log($scope.combinacionPuerta);
    };
    
    $scope.SustituirPiezasPuerta = function(formula, pieza)
    {
        //console.log(formula);
        var nombrePieza;
        var medidaPieza;
        
        var index = formula.indexOf("[Pieza]");
        var count = 0;
        
        while(index > -1)
        {
            nombrePieza = "";
            medidaPieza = "";
            
            for(var j=index+8; j<formula.length; j++)
            {
                nombrePieza += formula[j];
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

            //console.log(nombrePieza);
            //console.log(medidaPieza);
            //console.log(pieza);
            for(var j=0; j<pieza.length; j++)
            {
                //console.log("pieza: "+pieza[j].NombrePieza);
                if(pieza[j].NombrePieza == nombrePieza)
                {
                    var medida = "[Pieza][" + nombrePieza + "][" + medidaPieza + "]";

                    //console.log(medida);
                    //console.log(formula);

                    if(medidaPieza == "Largo")
                    {
                        if(pieza[j].Largo > -1)
                        {
                            formula = formula.replace(medida, pieza[j].Largo);
                        }
                        else
                        {
                            pieza[j].Largo = $scope.SustituirPiezasPuerta(pieza[j].FormulaLargo, pieza);
                            formula = formula.replace(medida, pieza[j].Largo);
                        }
                    }
                    else if(medidaPieza == "Ancho")
                    {
                        //console.log("ancho: "+pieza[j].ancho);
                        if(pieza[j].Ancho > -1)
                        {
                            formula = formula.replace(medida, pieza[j].Ancho);
                        }
                        else
                        {
                            pieza[j].Ancho = $scope.SustituirPiezasPuerta(pieza[j].FormulaAncho, pieza);
                            formula = formula.replace(medida, pieza[j].Ancho);
                        }
                    }

                    break;
                }
                
            }

            
            count++;
                if(count == 5)
                {
                    break;
                }
            
            index = formula.indexOf("[Pieza]");
            
            //console.log(ancho);
            //console.log(index);
        }
        
        //console.log(  formula + " = " + eval(formula));
        return eval(formula);
    };
    
    $scope.EvaluarFormulaParcialPuerta = function(formula)
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
    
    $scope.SustituirMedidaPuerta = function(formula, alto, ancho)
    {
        formula = formula.replace("[Puerta][Ancho]", ancho);
        formula = formula.replace("[Puerta][Alto]", alto);

        return formula;
    };
    
    $scope.CalcularMedidaSeccion = function()
    {
        var cosIzq = 0;
        var cosDer = 0;

        for(var i=0; i<$scope.parteModulo.length; i++)
        {
            if($scope.parteModulo[i].TipoParteId == "1")
            {
                cosIzq = $scope.parteModulo[i].Ancho;
            }
            else if($scope.parteModulo[i].TipoParteId == "2")
            {
                cosDer = $scope.parteModulo[i].Ancho;
            }
        }
        
        for(var index = 0; index<$scope.seccionModulo.length; index++)
        {
            for(var k=0; k<$scope.seccionModulo[index].LuzPorSeccion.length; k++)
            {
                if($scope.seccionModulo[index].SeccionModulo.SeccionModuloId !== "3")
                {
                    $scope.seccionModulo[index].AltoSeccion = $scope.FraccionADecimal($scope.seccionModulo[index].LuzPorSeccion[k].Luz) + 1;
                    $scope.seccionModulo[index].AnchoSeccion = ($scope.moduloSeleccionado.ancho - (($scope.FraccionADecimal($scope.seccionModulo[index].PeinazoVertical)*($scope.seccionModulo[index].NumeroPiezas-1))+cosDer+cosIzq))/$scope.seccionModulo[index].NumeroPiezas + 1;
                    break;
                }
            }
        }
    };
    
    
    /*------------Inicializar---------*/
    $scope.InicializarCosto = function()
    {
        $scope.GetMaterial();
        $scope.GetGruesoMaterial();
        $scope.GetModulo();
        $scope.GetTipoModulo();
        $scope.GetPuerta();
    };
    
    
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            $scope.InicializarCosto();
        }
        else
        {
            $window.location = "#Login";
        }
    }
    
    //Se manda a llamar cada ves que los datos del usuario cambian
    //verifica que el usuario este logeado y que tenga los permisos correspondientes
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
            $scope.InicializarCosto();  
        }
    });
});