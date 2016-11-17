app.controller("ConfiguaracionModulo", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter)
{   
    
    var str = {ancho:"m.alto + (m.ancho/2)"};
    m = {alto: 5, ancho: 6};
    
    var u = "[Modulo]";
    u =+ "[Alto]";
    
    var v = "[Modulo][Alto] + [Modulo][Ancho]";
    
    v = v.replace("[Modulo][Alto]", 5);
    console.log(v);
   
    var res = str.ancho.replace("m.alto", m.alto);
    res = res.replace("m.ancho", m.ancho);
    res = eval(res);
    console.log(res);
    
    var t = "gabriel gabriel";
    
    var q = t.indexOf("bri");
    var w = t.indexOf("alan");
    
    console.log(q + " " + (q+3));
    console.log(w);
    
    
    var pieza =
                [
                    {nombre: "pieza1", anchoFormula:"[Modulo][Ancho]+([Pieza][pieza3][largo]/2)", largoFormula:"([Modulo][Alto]-4)+([Pieza][pieza2][ancho]*2)", cantidad: 2, ancho:-1, largo:-1},
                    {nombre: "pieza2", anchoFormula:"[Pieza][pieza3][ancho]+[Pieza][pieza1][ancho]", largoFormula:"2*[Modulo][Profundo]+[Pieza][pieza3][ancho]", cantidad: 1, ancho:-1, largo:-1},
                    {nombre: "pieza3", anchoFormula:"[Modulo][Profundo]+[Modulo][Alto]", largoFormula:"([Pieza][pieza2][largo]/2)*([Modulo][Alto]/2)", cantidad:2, ancho:-1, largo:-1}
                ];
    
    var modulo = 
                [
                    {id:"1", ancho:"21", alto:"30", profundo:"24"},
                    //{id:"2", ancho:"18", alto:"30", profundo:"24"},
                    //{id:"3", ancho:"15", alto:"30", profundo:"24"}
                ];
    
    for(var k=0; k<modulo.length; k++)
    {        
        for(var i=0; i<pieza.length; i++)
        {
            pieza[i].ancho = -1;
            pieza[i].largo = -1;
        }
        
        for(var i=0; i<pieza.length; i++)
        {
            if(pieza[i].ancho < 0)
            {            
                pieza[i].ancho = CalcularMedida(pieza[i].anchoFormula, modulo[k].ancho, modulo[k].alto, modulo[k].profundo);
            }
            
            if(pieza[i].largo < 0)
            {                
                pieza[i].largo = CalcularMedida(pieza[i].largoFormula, modulo[k].ancho, modulo[k].alto, modulo[k].profundo);
            }
                
            
            //pieza[i].ancho = eval(ancho);
            //pieza[i].largo = eval(largo);
            //console.log((i+1) + ": " + ancho + " = " + pieza[i].ancho);
            //console.log((i+1) + ": " + largo + " = " + pieza[i].largo);
            console.log(i + ": " + pieza[i].ancho);
            console.log(i + ": " + pieza[i].largo);
        }
    }
    
    function CalcularMedida(formula, moduloAncho, moduloAlto, moduloProfundo)
    {
        //console.log("Nueva");
        //console.log(formula);
        formula = formula.replace("[Modulo][Ancho]", moduloAncho);
        formula = formula.replace("[Modulo][Alto]", moduloAlto);
        formula = formula.replace("[Modulo][Profundo]", moduloProfundo);
        
       
        var nombrePieza;
        var medidaPieza;
        
        var index = formula.indexOf("[Pieza]");
        
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

            for(var j=0; j<pieza.length; j++)
            {
                if(pieza[j].nombre == nombrePieza)
                {
                    var medida = "[Pieza][" + nombrePieza + "][" + medidaPieza + "]";

                    //console.log(medida);
                    //console.log(formula);

                    if(medidaPieza == "largo")
                    {
                        if(pieza[j].largo > -1)
                        {
                            formula = formula.replace(medida, pieza[j].largo);
                        }
                        else
                        {
                            pieza[j].largo = CalcularMedida(pieza[j].largoFormula, moduloAncho, moduloAlto, moduloProfundo);
                            formula = formula.replace(medida, pieza[j].largo);
                        }
                    }
                    else if(medidaPieza == "ancho")
                    {
                        if(pieza[j].ancho > -1)
                        {
                            formula = formula.replace(medida, pieza[j].ancho);
                        }
                        else
                        {
                            pieza[j].ancho = CalcularMedida(pieza[j].anchoFormula, moduloAncho, moduloAlto, moduloProfundo);
                            formula = formula.replace(medida, pieza[j].ancho);
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
    }
        
    
    /*for(var k=0; k<modulo.length; k++)
    {
        for(var i=0; i<pieza.length; i++)
        {
            var ancho = pieza[i].anchoFormula.replace("[Modulo][Ancho]", modulo[k].ancho);
            ancho = ancho.replace("[Modulo][Alto]", modulo[k].alto);
            ancho = ancho.replace("[Modulo][Profundo]", modulo[k].profundo);
            
            var largo = pieza[i].largoFormula.replace("[Modulo][Ancho]", modulo[k].ancho);
            largo = largo.replace("[Modulo][Alto]", modulo[k].alto);
            largo = largo.replace("[Modulo][Profundo]", modulo[k].profundo);
            
            var index = ancho.indexOf("[Pieza]");
            while(index > -1)
            {
                var nombrePieza = "";
                for(var j=index+8; j<ancho.length; j++)
                {
                    nombrePieza += ancho[j];
                    if(ancho[j+1] == "]")
                    {
                        index = j+1;
                        break;
                    }
                }
                 
                var medidaPieza = "";
                for(var j=index+2; j<ancho.length; j++)
                {
                    medidaPieza += ancho[j];
                    if(ancho[j+1] == "]")
                    {
                        break;
                    }
                }
                
                //console.log(nombrePieza);
                //console.log(medidaPieza);
                
                for(var j=0; j<pieza.length; j++)
                {
                    if(pieza[j].nombre == nombrePieza)
                    {
                        var medida = "[Pieza][" + nombrePieza + "][" + medidaPieza + "]";
                        
                        //console.log(medida);
                        //console.log(ancho);
                        
                        if(medidaPieza == "largo")
                        {
                            ancho = ancho.replace(medida, pieza[j].largo);
                        }
                        else if(medidaPieza == "ancho")
                        {
                            ancho = ancho.replace(medida, pieza[j].ancho);
                        }
                
                        break;
                    }
                }
                
                index = ancho.indexOf("[Pieza]");
                
                //console.log(ancho);
                //console.log(index);
            }
            
            //console.log("largo");
            var index = largo.indexOf("[Pieza]");
            while(index > -1)
            {
                var nombrePieza = "";
                for(var j=index+8; j<largo.length; j++)
                {
                    nombrePieza += largo[j];
                    if(largo[j+1] == "]")
                    {
                        index = j+1;
                        break;
                    }
                }
                 
                var medidaPieza = "";
                for(var j=index+2; j<largo.length; j++)
                {
                    medidaPieza += largo[j];
                    if(largo[j+1] == "]")
                    {
                        break;
                    }
                }
                
                //console.log(nombrePieza);
                //console.log(medidaPieza);
                
                for(var j=0; j<pieza.length; j++)
                {
                    if(pieza[j].nombre == nombrePieza)
                    {
                        var medida = "[Pieza][" + nombrePieza + "][" + medidaPieza + "]";
                        
                        //console.log(medida);
                        //console.log(largo);
                        
                        if(medidaPieza == "largo")
                        {
                            largo = largo.replace(medida, pieza[j].largo);
                        }
                        else if(medidaPieza == "ancho")
                        {
                            largo = largo.replace(medida, pieza[j].ancho);
                        }
                
                        break;
                    }
                }
                
                index = largo.indexOf("[Pieza]");
                
                //console.log(largo);
                //console.log(index);
            }
            
            pieza[i].ancho = eval(ancho);
            pieza[i].largo = eval(largo);
            console.log((i+1) + ": " + ancho + " = " + pieza[i].ancho);
            console.log((i+1) + ": " + largo + " = " + pieza[i].largo);
            //console.log(largo);
        }
    }*/
    
    /*for(var k=0; k<modulo.length; k++)
    {
        var m = {ancho:0, alto:0, profundo: 0};
        
        m.ancho = modulo[k].ancho;
        m.alto = modulo[k].alto;
        m.profundo = modulo[k].profundo;
        
        for(var i=0; i<pieza.length; i++)
        {
            //var pancho = eval(pieza[i].ancho);
            //var plargo = eval(pieza[i].largo);
            
            var largo = pieza[i].largo.replace("m.ancho", m.ancho);
            //console.log(largo);
            largo = largo.replace("m.alto", m.alto);
            //console.log( largo);
            largo = eval(largo);
            
            console.log(i + ": " + largo);
            
           /*pieza[i] = pieza[i].largo.replace("m.alto", m.alto);
            console.log(pieza[i].largo);
            var plargo = eval(pieza[i].largo);
            
            console.log(pancho + " " + plargo);
            
        }
    }*/
    
    /*var str = "[]+ modulo [] + [] + [] + ]";
    
    console.log(str.split("modulo").length-1);
    console.log(str);
    
    var studentTypes = new Array();

    studentTypes["NAME"] = "TEXT";
    studentTypes["MARKS"] = "NUMBER";
    studentTypes["DOB"] = "DATE";
    
    console.log(studentTypes["DOB"]);*/
    
    $rootScope.clasePrincipal = "";

    $scope.titulo = "Componente";
    $scope.tabs = tabConModulo;
    $scope.tipoModulo = null;
    $scope.pieza = null;
    $scope.componente = null;
    $scope.consumible = null;
    
    $scope.combinacion = null;
    $scope.combinacionMaterialComponente = null;
    $scope.material = null;
    $scope.tipoMaterial = null;
    $scope.gruesoMaterial = null;
    
    $scope.mensajeError = [];
    
    $scope.objetoActivo = null;
    $scope.seccionCambiarActivo = "";
    
    $scope.botonPieza = {mostrar:true, texto:"<<"};
    $scope.buscarPieza = "";
    $scope.piezaPorComponente = [];
    $scope.claseComponente = {nombre:"entrada", pieza:"botonOperacion"};
    
    $scope.componenteTab = "Datos";
    
    $scope.mostrarDetalles = [{
                                pieza:{mostrar:true, texto:"<<"},
                                combinacion:{mostrar:true, texto:"<<"}
                              }];
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#Componente').show();
                $('#TipoModulo').hide();
                $('#Pieza').hide();
                break;
            case 1:
                $('#Pieza').show();
                $('#TipoModulo').hide();
                $('#Componente').hide();
                break;
            case 2:
                $('#TipoModulo').show();
                $('#Componente').hide();
                $('#Pieza').hide();
                break;
            default:
                break;
        }        
    };
    
    /*-----------------------------------Componente----------------------------------------------------------*/
    $scope.AbrirComponenteForma = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.botonPieza.mostrar = true;
            $scope.botonPieza.texto = "<<";
            $scope.nuevoComponente = new Componente(); 
            
            $scope.nuevoComponente.CombinacionMaterial = [];
            
            for(var k=0; k<$scope.combinacion.length; k++)
            {
                $scope.nuevoComponente.CombinacionMaterial[k] = new CombinacionPorMaterialComponente();
                $scope.nuevoComponente.CombinacionMaterial[k].CombinacionMaterial = SetCombinacionMaterial($scope.combinacion[k]);
                
                $scope.nuevoComponente.CombinacionMaterial[k].claseTipoMaterial = "dropdownListModal";
                $scope.nuevoComponente.CombinacionMaterial[k].claseMaterial = "dropdownListModal";
                $scope.nuevoComponente.CombinacionMaterial[k].claseGrueso = "dropdownListModal";
            }
        }
        else if(operacion == "Editar")
        {
            $scope.botonPieza.mostrar = false;
            $scope.botonPieza.texto = ">>";
            $scope.GetPiezaPorComponente(objeto.ComponenteId);
            
            $scope.nuevoComponente = SetComponente(objeto)
            $scope.nuevoComponente.CombinacionMaterial = [];
            
            for(var k=0; k<objeto.CombinacionMaterial.length; k++)
            {
                $scope.nuevoComponente.CombinacionMaterial[k] = new CombinacionPorMaterialComponente();
                
                $scope.nuevoComponente.CombinacionMaterial[k].Grueso = objeto.CombinacionMaterial[k].Grueso;
                
                $scope.nuevoComponente.CombinacionMaterial[k].CombinacionMaterial.CombinacionMaterialId = objeto.CombinacionMaterial[k].CombinacionMaterial.CombinacionMaterialId;
                $scope.nuevoComponente.CombinacionMaterial[k].CombinacionMaterial.Nombre = objeto.CombinacionMaterial[k].CombinacionMaterial.Nombre;
                $scope.nuevoComponente.CombinacionMaterial[k].CombinacionMaterial.Activo = objeto.CombinacionMaterial[k].CombinacionMaterial.Activo;
                
                $scope.nuevoComponente.CombinacionMaterial[k].Material = SetMaterial(objeto.CombinacionMaterial[k].Material);
                $scope.nuevoComponente.CombinacionMaterial[k].Material.TipoMaterial = SetTipoMaterial(objeto.CombinacionMaterial[k].Material.TipoMaterial);
            
                for(var i=0; i<$scope.material.length; i++)
                {
                    if($scope.material[i].MaterialId == $scope.nuevoComponente.CombinacionMaterial[k].Material.MaterialId)
                    {
                        $scope.nuevoComponente.CombinacionMaterial[k].Material.Grueso = $scope.material[i].grueso;
                    }
                }
                
                $scope.nuevoComponente.CombinacionMaterial[k].claseTipoMaterial = "dropdownListModal";
                $scope.nuevoComponente.CombinacionMaterial[k].claseMaterial = "dropdownListModal";
                $scope.nuevoComponente.CombinacionMaterial[k].claseGrueso = "dropdownListModal";
            }
        }
        
        $('#componenteForma').modal('toggle');
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
        componente.Material.Nombre = material.Nombre;
        componente.Material.MaterialId = material.MaterialId;
        componente.Material.Grueso = material.grueso;
        
        if(material.grueso.length == 0)
        {
            componente.Grueso = 1;
        }
    };
    
    $scope.CambiarGrueso = function(grueso, componente)
    {
        componente.Grueso = grueso;
    };
    
    $scope.SiguienteComponente = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.claseComponente.nombre = "entradaError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
        }
        else
        {
            $scope.claseComponente.nombre = "entrada";
        }
        
        if($scope.piezaPorComponente.length === 0)
        {
            $scope.claseComponente.pieza = "botonOperacionError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El componente debe de tener almenos una pieza.";
        }
        else
        {
            $scope.claseComponente.pieza = "botonOperacion";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.componente.length; k++)
        {
            if($scope.componente[k].Nombre == $scope.nuevoComponente.Nombre && $scope.componente[k].ComponenteId != $scope.nuevoComponente.ComponenteId)
            {
                $scope.claseComponente.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "*El componente " + $scope.nuevoComponente.Nombre + " ya existe.";
                return;        
            }
        }
        
        $scope.componenteTab = "Combinacion";
    };
    
    $scope.AnteriorComponente = function()
    {
        $scope.componenteTab = "Datos";
        $scope.mensajeError = [];
    };
    
    $scope.TerminarComponente = function()
    {
        $scope.mensajeError = [];
        var datosIncompletos = false;
        
        for(var k=0; k<$scope.nuevoComponente.CombinacionMaterial.length; k++)
        {
            if(!$scope.nuevoComponente.CombinacionMaterial[k].CombinacionMaterial.Activo)
            {
                $scope.CambiarTipoMaterial('No Aplica', $scope.nuevoComponente.CombinacionMaterial[k]);
            }
            else
            {
                if($scope.nuevoComponente.CombinacionMaterial[k].Material.TipoMaterial.Nombre.length === 0)
                {
                    datosIncompletos = true;
                    $scope.nuevoComponente.CombinacionMaterial[k].claseTipoMaterial = "dropdownListModalError";
                }
                else
                {
                  $scope.nuevoComponente.CombinacionMaterial[k].claseTipoMaterial = "dropdownListModal";  
                }
                if($scope.nuevoComponente.CombinacionMaterial[k].Material.Nombre.length === 0)
                {
                    datosIncompletos = true;
                    $scope.nuevoComponente.CombinacionMaterial[k].claseMaterial = "dropdownListModalError";
                }
                else
                {
                  $scope.nuevoComponente.CombinacionMaterial[k].claseMaterial = "dropdownListModal";  
                }
                if($scope.nuevoComponente.CombinacionMaterial[k].Grueso.length === 0)
                {
                    $scope.nuevoComponente.CombinacionMaterial[k].claseGrueso = "dropdownListModalError";
                    datosIncompletos = true;
                }
                else
                {
                  $scope.nuevoComponente.CombinacionMaterial[k].claseGrueso = "dropdownListModal";  
                }
            }
        }
        
        if(datosIncompletos)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Completa todos los datos"; 
            return;
        }
        
        var datos = {componente:"", pieza:""};
        datos.componente = $scope.nuevoComponente;
        datos.pieza = $scope.piezaPorComponente;
        
        if(datos.componente.Activo)
        {
            datos.componente.Activo = 1;
        }
        else
        {
            datos.componente.Activo = 0;
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarComponente(datos);
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarComponente(datos);
        }
    };
    
    $scope.AgregarComponente = function(datos)
    {   
        AgregarComponente($http, CONFIG, $q, datos).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetComponente();
                $scope.GetCombinacionPorMaterialComponente();
                
                $scope.CerrarComponenteForma();
                
                $('#componenteForma').modal('toggle');
                $scope.mensaje = "El componente se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeConfigurarModulo').modal('toggle');
    };
    
    $scope.EditarComponente = function(datos)
    {
        EditarComponente($http, CONFIG, $q, datos).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetComponente();
                $scope.GetCombinacionPorMaterialComponente();
                
                $scope.CerrarComponenteForma();
                $('#componenteForma').modal('toggle');
                $scope.mensaje = "El componente se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeConfigurarModulo').modal('toggle');
    };
    
    /*----- Agregar componente vista --*/
    
    $scope.CambiarMostrarPiezas = function()
    {
        $scope.botonPieza.mostrar = !$scope.botonPieza.mostrar;
        
        if($scope.botonPieza.mostrar)
        {
            $scope.botonPieza.texto = "<<";
        }
        else
        {
           $scope.botonPieza.texto = ">>"; 
        }
    };
    
    $scope.AgregarPiezaComponente = function(pieza)
    {
        var index = $scope.piezaPorComponente.length;
        
        var piezaAgregada = false;
        for(var k=0; k<index; k++)
        {
            if($scope.piezaPorComponente[k].Pieza.PiezaId == pieza.PiezaId)
            {
                $scope.piezaPorComponente[k].Cantidad++;
                piezaAgregada = true;
                break;
            }
        }
        
        if(!piezaAgregada)
        {
            $scope.piezaPorComponente[index] = new PiezaPorComponente();
            $scope.piezaPorComponente[index].Pieza = SetPieza(pieza);
            $scope.piezaPorComponente[index].Cantidad = 1;
        }
    };
    
    $scope.AgregarCantidadPieza = function(pieza)
    {
        pieza.Cantidad++;
    };
    
    $scope.RemoverCantidadPieza = function(pieza)
    {
        if((pieza.Cantidad-1) === 0)
        {
            return;
        }
        
        pieza.Cantidad--;
    };
    
    $scope.QuitarPieza = function(pieza)
    {
        
        for(var k=0; k<$scope.piezaPorComponente.length; k++)
        {
            if($scope.piezaPorComponente[k].Pieza.PiezaId == pieza.Pieza.PiezaId)
            {
                $scope.piezaPorComponente.splice(k,1);
                break;
            }
        }
    };
    
    $scope.CerrarComponenteForma = function()
    {
        $scope.claseComponente = {nombre:"entrada", pieza:"botonOperacion"};
        $scope.mensajeError = [];
        $scope.piezaPorComponente = [];
        $scope.componenteTab = "Datos";
    };
    
    $scope.GetPiezaPorComponente = function(componenteId)
    {
        GetPiezaPorComponente($http, $q, CONFIG, componenteId).then(function(data)
        {
            $scope.piezaPorComponente = data;
            
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener los permisos." + error);
            return;
        });
    };
    
    /*--detalles--*/
    $scope.AbrirDetallesComponenteForma = function(componente)
    {
        $scope.GetPiezaPorComponente(componente.ComponenteId);
        $scope.componenteDetalles = componente;
        $('#DetallesComponente').modal('toggle');
    };
    
    $scope.MostrarPanelDetalles = function(detalle)
    {
        if(detalle == "pieza")
        {
            $scope.mostrarDetalles[0].pieza.mostrar = !$scope.mostrarDetalles[0].pieza.mostrar;
            if($scope.mostrarDetalles[0].pieza.mostrar)
            {
                $scope.mostrarDetalles[0].pieza.texto = "<<";
            }
            else
            {
                $scope.mostrarDetalles[0].pieza.texto = ">>";
            }
        }
        else if(detalle == "combinacion")
        {
            $scope.mostrarDetalles[0].combinacion.mostrar = !$scope.mostrarDetalles[0].combinacion.mostrar;
            if($scope.mostrarDetalles[0].combinacion.mostrar)
            {
                $scope.mostrarDetalles[0].combinacion.texto = "<<";
            }
            else
            {
                $scope.mostrarDetalles[0].combinacion.texto = ">>";
            }
        }
    };
    
    /*-----------------------------------Pieza----------------------------------------------------------*/
    
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
    
    $scope.AbrirPiezaForma = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevaPieza = new Pieza();   
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaPieza = SetPieza(objeto);
        }
        
        $('#piezaForma').modal('toggle');
    };
    
    
    /*---------Formula pieza ------------*/
    $scope.AbrirFormulaForma = function(medida, formula)
    {
        $scope.editarFormula = medida;
        $scope.nuevaFormula = formula;
        $('#piezaFormulaForma').modal('toggle');
    };
    
    /*-------------------------------TIPO MÓDULO----------------------------------------------------*/
    $scope.claseTipoModulo = {nombre:"entrada"};
    
    //Obtiene los tipos de unidad de negocio dados de alta 
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
    
    $scope.AbrirTipoModuloForma = function(operacion, tipoModulo)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoTipoModulo = new TipoModulo();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoTipoModulo = SetTipoModulo(tipoModulo);
        }
        
        $('#tipoModuloForma').modal('toggle');
    };
    
    //Agregar o editar tipo de módulo
    //Valida que los datos indicados sean valido
    $scope.TerminarTipoModulo = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.claseTipoModulo.nombre = "entradaError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
        }
        else
        {
            $scope.claseTipoModulo.nombre = "entrada";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.tipoModulo.length; k++)
        {
            if($scope.tipoModulo[k].Nombre == $scope.nuevoTipoModulo.Nombre && $scope.tipoModulo[k].TipoModuloId != $scope.nuevoTipoModulo.TipoModuloId)
            {
                $scope.claseTipoModulo.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "El tipo de módulo \"" + $scope.nuevoTipoModulo.Nombre + "\" ya existe.";
                return;
            }
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarTipoModulo();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarTipoModulo();
        }
    };
    
    $scope.AgregarTipoModulo = function()
    {
        AgregarTipoModulo($http, CONFIG, $q, $scope.nuevoTipoModulo).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTipoModulo();
                $('#tipoModuloForma').modal('toggle');
                $scope.mensaje = "El tipo de módulo se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            
            $('#mensajeConfigurarModulo').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarModulo').modal('toggle');
        });
    };
    
    $scope.EditarTipoModulo = function()
    {
        EditarTipoModulo($http, CONFIG, $q, $scope.nuevoTipoModulo).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetTipoModulo();
                $('#tipoModuloForma').modal('toggle');
                $scope.mensaje = "El tipo de módulo se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde"; 
            }
            $('#mensajeConfigurarModulo').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeConfigurarModulo').modal('toggle');
        });
    };
    
    /*----------------------------Consumible --------------------*/
    //Obtiene los consumibles
    $scope.GetConsumible = function()      
    {
        GetConsumible($http, $q, CONFIG).then(function(data)
        {
            $scope.consumible = data;
        }).catch(function(error)
        {
            alert(error);
        });
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
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + objeto.Nombre + "?"
        }
        
        $('#modalActivarDesactivarConfigurarModulo').modal('toggle');
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
        
        if($scope.seccionCambiarActivo == "tipoModulo")
        {
            datos[1] = $scope.objetoActivo.TipoModuloId;
            
            ActivarDesactivarTipoModulo($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El tipo de modulo se ha actualizado correctamente";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarModulo').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarModulo').modal('toggle');
            });
        }
        
        if($scope.seccionCambiarActivo == "pieza")
        {
            datos[1] = $scope.objetoActivo.PiezaId;
            
            ActivarDesactivarPieza($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "La pieza se ha actualizado correctamente";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarModulo').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarModulo').modal('toggle');
            });
        }
        
        if($scope.seccionCambiarActivo == "componente")
        {
            datos[1] = $scope.objetoActivo.ComponenteId;
            
            ActivarDesactivarComponente($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El componente se ha actualizado correctamente";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarModulo').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarModulo').modal('toggle');
            });
        }
    };
    
    $scope.CerrarTipoModuloForma = function()
    {
        $scope.claseTipoModulo = {nombre:"entrada"};
        $scope.mensajeError = [];
    };
    
    /*------- Catálogos componentes ----------------*/
    $scope.GetComponente = function()      
    {
        GetComponente($http, $q, CONFIG).then(function(data)
        {
            $scope.componente = data;
            if($scope.combinacionMaterialComponente !== null)
            {
                $scope.SetCombinacionlPorComponente();
            }
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
    
    $scope.GetCombinacionPorMaterialComponente = function()          
    {
        GetCombinacionPorMaterialComponente($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.combinacionMaterialComponente = data;
                if($scope.componente !== null)
                {
                    $scope.SetCombinacionlPorComponente();
                }
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetCombinacionlPorComponente = function()
    {
        for(var i=0; i<$scope.componente.length; i++)
        {
            $scope.componente[i].CombinacionMaterial = [];
            for(var j=0; j<$scope.combinacionMaterialComponente.length; j++)
            {
                if($scope.componente[i].ComponenteId == $scope.combinacionMaterialComponente[j].Componente.ComponenteId)
                {
                    $scope.componente[i].CombinacionMaterial[$scope.componente[i].CombinacionMaterial.length] =  $scope.combinacionMaterialComponente[j];
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
    
    //-------------Inicializar-----------------------
    $scope.GetTipoModulo();
    $scope.GetPieza();
    $scope.GetComponente();
    $scope.GetConsumible();
    
    $scope.GetCombinacionMaterial();
    $scope.GetCombinacionPorMaterialComponente();
    $scope.GetTipoMaterial();
    $scope.GetMaterial();
    $scope.GetGruesoMaterial();

});

//Pestañas
var tabConModulo = 
    [
        {titulo:"Componente", referencia: "#Componente", clase:"active", area:"componente"},
        {titulo:"Pieza", referencia: "#Pieza", clase:"", area:"pieza"},
        {titulo:"Tipo Módulo", referencia: "#TipoModulo", clase:"", area:"tipoModulo"}
    ];