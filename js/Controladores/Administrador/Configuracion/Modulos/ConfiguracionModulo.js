app.controller("ConfiguaracionModulo", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter)
{   
    $rootScope.clasePrincipal = "";
    $scope.permisoUsuario = {
                            componente:{consultar:false, agregar:false, editar:false, activar:false}, 
                            pieza:{consultar:false, agregar:false, editar:false, activar:false},
                            consumible:{consultar:false, agregar:false, editar:false, activar:false},
                            tipoModulo:{consultar:false, agregar:false, editar:false, activar:false},
                            };
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "ConCmpConsultar")
            {
                $scope.permisoUsuario.componente.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCmpAgregar")
            {
                $scope.permisoUsuario.componente.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCmpEditar")
            {
                $scope.permisoUsuario.componente.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCmpActivar")
            {
                $scope.permisoUsuario.componente.activar= true;
            }
            
            else if($scope.usuarioLogeado.Permiso[k] == "ConPieConsultar")
            {
                $scope.permisoUsuario.pieza.consultar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConPieAgregar")
            {
                $scope.permisoUsuario.pieza.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConPieEditar")
            {
                $scope.permisoUsuario.pieza.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConPieActivar")
            {
                $scope.permisoUsuario.pieza.activar = true;
            }
            
            else if($scope.usuarioLogeado.Permiso[k] == "ConCnsConsultar")
            {
                $scope.permisoUsuario.consumible.consultar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCnsAgregar")
            {
                $scope.permisoUsuario.consumible.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCnsEditar")
            {
                $scope.permisoUsuario.consumible.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConCnsActivar")
            {
                $scope.permisoUsuario.consumible.activar = true;
            }
            
            else if($scope.usuarioLogeado.Permiso[k] == "ConTMdConsultar")
            {
                $scope.permisoUsuario.tipoModulo.consultar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTMdAgregar")
            {
                $scope.permisoUsuario.tipoModulo.agregar= true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTMdEditar")
            {
                $scope.permisoUsuario.tipoModulo.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "ConTmdActivar")
            {
                $scope.permisoUsuario.tipoModulo.activar = true;
            }
        }
    };

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
    $scope.tipoParte = null;
    
    $scope.mensajeError = [];
    
    $scope.objetoActivo = null;
    $scope.seccionCambiarActivo = "";
    
    $scope.botonPieza = {mostrar:true, texto:"<<"};
    $scope.buscarPieza = "";
    $scope.piezaPorComponente = [];
    $scope.claseComponente = {nombre:"entrada", pieza:"botonOperacion"};
    
    $scope.componenteTab = "Datos";
    
    $scope.ordenarPorConsumible = "Nombre";
    
    $scope.mostrarDetalles = "pieza";
    
    $scope.tabFormula = tabFormula;
    $scope.tabOperador = operadores;
    $scope.medidasFormula = "";
    
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
                $('#Consumible').hide();
                break;
            case 1:
                $('#Pieza').show();
                $('#TipoModulo').hide();
                $('#Componente').hide();
                $('#Consumible').hide();
                break;
            case 2:
                $('#TipoModulo').show();
                $('#Componente').hide();
                $('#Pieza').hide();
                $('#Consumible').hide();
                break;
            case 3:
                $('#Consumible').show();
                $('#Componente').hide();
                $('#Pieza').hide();
                $('#TipoModulo').hide();
                break;
            default:
                break;
        }        
    };
    
    $scope.contanteFormula = {valor:"", clase:"entrada", mensaje:""};
    $scope.valorFormula = "valor";
    $scope.buscarPiezaFormula = "";
    $scope.buscarComponenteFormula = "";
    $scope.componenteFormula = "";
    $scope.piezaFormula = "";
    $scope.clasePieza = {nombre:"entrada", ancho:"entrada", largo:"entrada"};
    
    
    /*-----------------------------------Componente----------------------------------------------------------*/
    $scope.AbrirComponenteForma = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.botonPieza.mostrar = true;
            $scope.botonPieza.texto = "<<";
            $scope.nuevoComponente = new Componente(); 
            
            $scope.combinacionMaterialComponente = [];
            
            for(var k=0; k<$scope.combinacion.length; k++)
            {
                $scope.combinacionMaterialComponente[k] = new CombinacionPorMaterialComponente();
                $scope.combinacionMaterialComponente[k].CombinacionMaterial = SetCombinacionMaterial($scope.combinacion[k]);
                
                $scope.combinacionMaterialComponente[k].claseTipoMaterial = "dropdownListModal";
                $scope.combinacionMaterialComponente[k].claseMaterial = "dropdownListModal";
                $scope.combinacionMaterialComponente[k].claseGrueso = "dropdownListModal";
            }
            
            for(var k=0; k<$scope.pieza.length; k++)
            {
                $scope.pieza[k].mostrar = true;
            }
        }
        else if(operacion == "Editar")
        {
            $scope.botonPieza.mostrar = false;
            $scope.botonPieza.texto = ">>";
            $scope.GetPiezaPorComponente(objeto.ComponenteId);
            
            $scope.nuevoComponente = SetComponente(objeto);
           
            $scope.GetCombinacionPorMaterialComponente(objeto.ComponenteId, "editar");
        }
        
        if($scope.tipoParte === null)
        {
            $scope.GetTipoParte();
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
    
    $scope.ValidarPiezas = function()
    {
        $scope.piezaFaltante = [];
        for(var k=0; k<$scope.piezaPorComponente.length; k++)
        {
            $scope.ValidarPiezaFormula($scope.piezaPorComponente[k].Pieza.FormulaAncho);
            $scope.ValidarPiezaFormula($scope.piezaPorComponente[k].Pieza.FormulaLargo);
        }
        
        if($scope.piezaFaltante.length >0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.ValidarPiezaFormula = function(formula)
    {
        var nombrePieza;
        
        var index = formula.indexOf("[Pieza]");
        
        while(index > -1)
        {
            nombrePieza = "";
            
            for(var k=index+8; k<formula.length; k++)
            {
                nombrePieza += formula[k];
                if(formula[k+1] == "]")
                {
                    break;
                }
            }
            
            var isPieza = false;
            
            
            for(var k=0; k<$scope.tipoParte.length; k++)
            {
                if(nombrePieza == $scope.tipoParte[k].Nombre)
                {
                    isPieza = true;
                }
            }
            
            if(!isPieza)
            {
                for(var k=0; k<$scope.piezaPorComponente.length; k++)
                {
                    if(nombrePieza == $scope.piezaPorComponente[k].Pieza.Nombre)
                    {
                        isPieza = true;
                    }
                }
            }
            
            if(!isPieza)
            {
                var piezaRegistrada = false;
                for(var k=0; k<$scope.piezaFaltante.length; k++)
                {
                    if($scope.piezaFaltante[k] == nombrePieza)
                    {
                        piezaRegistrada = true;
                        break;
                    }
                }
                if(!piezaRegistrada)
                {
                    $scope.piezaFaltante[$scope.piezaFaltante.length] = nombrePieza;
                    $scope.mensajeError[$scope.mensajeError.length] = "*Falta agregar la pieza \"" + nombrePieza + "\".";
                }
                
            }
            
            var pieza = "[Pieza][" + nombrePieza + "]"; 
            formula = formula.replace(pieza, " ");
            
            index = formula.indexOf("[Pieza]");
        }
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
        
        if(!$scope.ValidarPiezas())
        {
            return;
        }
        
        for(var k=0; k<$scope.componente.length; k++)
        {
            if($scope.componente[k].Nombre.toLowerCase() == $scope.nuevoComponente.Nombre.toLowerCase() && $scope.componente[k].ComponenteId != $scope.nuevoComponente.ComponenteId)
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
        $scope.nuevoComponente.CombinacionMaterial = $scope.combinacionMaterialComponente;
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
        
        $scope.piezaPorComponente[index] = new PiezaPorComponente();
        $scope.piezaPorComponente[index].Pieza = SetPieza(pieza);
        $scope.piezaPorComponente[index].Cantidad = 1;
        pieza.mostrar = false;
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
        
        for(var k=0; k<$scope.pieza.length; k++)
        {
            if($scope.pieza[k].PiezaId == pieza.Pieza.PiezaId)
            {
                $scope.pieza[k].mostrar = true;
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
            
            for(var k=0; k<$scope.pieza.length; k++)
            {
                $scope.pieza[k].mostrar = true;
                for(i=0; i<$scope.piezaPorComponente.length; i++)
                {
                    if($scope.pieza[k].PiezaId == $scope.piezaPorComponente[i].Pieza.PiezaId)
                    {
                        $scope.pieza[k].mostrar = false;
                        break;
                    }
                }
            }
            
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener las piezas del componente." + error);
            return;
        });
    };
    
    /*--detalles--*/
    $scope.AbrirDetallesComponenteForma = function(componente)
    {
        $scope.GetPiezaPorComponente(componente.ComponenteId);
        $scope.GetCombinacionPorMaterialComponente(componente.ComponenteId);
        $scope.componenteDetalles = componente;
        $('#DetallesComponente').modal('toggle');
    };
    
    $scope.MostrarPanelDetalles = function(detalle)
    {
        if(detalle == $scope.mostrarDetalles)
        {
            $scope.mostrarDetalles = "";
            return;
        }
        
        $scope.mostrarDetalles = detalle;
    };
    
    $scope.GetClaseDetallesSeccion = function(seccion)
    {
        if($scope.mostrarDetalles == seccion)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    /*-----------------------------------Pestaña Pieza----------------------------------------------------------*/
    
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
        
        if($scope.tipoParte === null)
        {
            $scope.GetTipoParte();
        }
        
        $('#piezaForma').modal('toggle');
    };
    
    $scope.ValidarDatosPieza = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.clasePieza.nombre = "entradaError";
        }
        else
        {
            $scope.clasePieza.nombre = "entrada";
        }
        
        if($scope.nuevaPieza.FormulaAncho.length  === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de especificar una formula para calcular el ancho de la pieza.";
            $scope.clasePieza.ancho = "entradaError";
        }
        else
        {
            $scope.clasePieza.ancho = "entrada";
        }
        
        if($scope.nuevaPieza.FormulaLargo.length  === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de especificar una formula para calcular el largo de la pieza.";
            $scope.clasePieza.largo = "entradaError";
        }
        else
        {
            $scope.clasePieza.largo = "entrada";
        }
        
        if($scope.mensajeError.length>0)
        {
            return false;
        }
        
        for(var k=0; k<$scope.pieza.length; k++)
        {
            if($scope.pieza[k].Nombre.toLowerCase() == $scope.nuevaPieza.Nombre.toLowerCase() && $scope.pieza[k].PiezaId != $scope.nuevaPieza.PiezaId )
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*La pieza " + $scope.nuevaPieza.Nombre + " ya existe.";
                $scope.clasePieza.nombre = "entradaError";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.TerminarPieza = function(nombreInvalido)
    {
        if(!($scope.ValidarDatosPieza(nombreInvalido)))
        {
            return;
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarPieza();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarPieza();
        }
    };
    
    $scope.AgregarPieza = function(datos)
    {   
        AgregarPieza($http, CONFIG, $q, $scope.nuevaPieza).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetPieza();
                
                $('#piezaForma').modal('toggle');
                $scope.mensaje = "La pieza se ha agregado.";
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
    
    $scope.EditarPieza = function(datos)
    {
        EditarPieza($http, CONFIG, $q, $scope.nuevaPieza).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetPieza();

                $('#piezaForma').modal('toggle');
                $scope.mensaje = "La pieza se ha editado.";
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
    
    $scope.CerrarPiezaForma = function()
    {
        $scope.mensajeError = [];
        $scope.clasePieza = {nombre:"entrada", ancho:"entrada", largo:"entrada"};
    };
    
    
    /*---------Formula pieza ------------*/
    $scope.AbrirFormulaForma = function(medida, formula)
    {
        $scope.editarFormula = medida;
        $scope.nuevaFormula = formula;
        
        if($scope.nuevaFormula.length > 0)
        {
            $scope.valorFormula = "operador";
        }
        else
        {
            $scope.valorFormula = "valor";
        }
        
        $scope.mensajeError = [];
        $('#piezaFormulaForma').modal('toggle');
    };
    
    $scope.MostrarMedidasFormula = function(valor)
    {
        if($scope.medidasFormula == valor)
        {
             $scope.medidasFormula = "";
        }
        else
        {
            $scope.medidasFormula = valor;
        }
    };
    
    $scope.GetClaseFormula = function(valor)
    {
        if($scope.medidasFormula == valor)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    $scope.SetModuloValor = function(valor)
    {

        $scope.nuevaFormula += "[Modulo][" + valor +"]";

        $scope.valorFormula = "operador";
    };
    
    $scope.SetPuertaValor = function(valor)
    {

        $scope.nuevaFormula += "[Puerta][" + valor +"]";

        $scope.valorFormula = "operador";
    };
    
    $scope.SetConstanteValor = function(constanteInvalida)
    {
        if(constanteInvalida)
        {
            $scope.contanteFormula.clase = "entradaError";
            $scope.contanteFormula.mensaje = "*La constante debe ser un número decimal.";
            return;
        }
        else
        {
            $scope.contanteFormula.clase = "entrada";
        }

        $scope.nuevaFormula += $scope.contanteFormula.valor;
        $scope.contanteFormula = {valor:"", clase:"entrada", mensaje:""};
        $scope.valorFormula = "operador";
    };
    
    $scope.SetOperador = function(operador)
    {
        $scope.nuevaFormula += operador;

        if(operador == ")")
        {
            $scope.valorFormula = "operador";
        }
        else
        {
            $scope.valorFormula = "valor";
        }
    };
    
    $scope.CerrarFormulaForma = function()
    {
        $scope.contanteFormula = {valor:"", clase:"entrada", mensaje:""};
        $scope.medidasFormula = "";
        $scope.valorFormula = "valor";
        $scope.mensajeError = [];
    };
    
    $scope.SetComponenteFormula = function(componente)
    {
        $scope.componenteFormula = componente;
    };
    
    $scope.SetComponenteValor = function()
    {
        $scope.nuevaFormula += "[Componente][" +$scope.componenteFormula + "][Grueso]"; 
        $scope.valorFormula = "operador";
        $scope.componenteFormula = "";
    };
    
    $scope.SetPiezaFormula = function(pieza)
    {
        $scope.piezaFormula = pieza;
    };
    
    $scope.SetPiezaValor = function(valor)
    {
        $scope.nuevaFormula += "[Pieza][" +$scope.piezaFormula + "]["+valor+"]"; 
        $scope.valorFormula = "operador";
        $scope.piezaFormula = "";
    };
    
    $scope.RegresarFormula = function()
    {
        var index = $scope.nuevaFormula.length-1;
        var caracter = $scope.nuevaFormula[index];
    
        if(index > 0)
        {
            if(caracter == "]")
            {
                var letra = true;
                do
                {
                    $scope.nuevaFormula  = $scope.nuevaFormula.substr(0, index);

                    if(index > 0)
                    {
                        index = $scope.nuevaFormula.length-1;
                        caracter = $scope.nuevaFormula[index];



                        for(var k=0; k<$scope.tabOperador.length; k++)
                        {
                            if($scope.tabOperador[k].operador == caracter)
                            {
                                letra = false;
                                break;
                            }
                        }
                    }
                    else
                    {
                        letra = false;
                    }
                }while(letra);
               $scope.valorFormula = "valor"; 
            }
            else
            {
                if($scope.IsNumero(caracter))
                {
                    do
                    {
                        $scope.nuevaFormula  = $scope.nuevaFormula.substr(0, index);
                        index = $scope.nuevaFormula.length-1;

                        if(index >= 0)
                        {
                            caracter = $scope.nuevaFormula[index];
                        }

                    }while(($scope.IsNumero(caracter) || caracter==".") && index>=0);

                    $scope.valorFormula = "valor";
                }
                else
                {
                    $scope.nuevaFormula  = $scope.nuevaFormula.substr(0, index);
                    if(caracter == "(")
                    {
                        $scope.valorFormula = "valor";
                    }
                    else
                    {
                        $scope.valorFormula = "operador";
                    }
                }
            }
        }
    };
    
    $scope.IsNumero = function(caracter)
    {
        var isNumero = false;
        
        var numero = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        
        for(var k = 0; k<numero.length; k++)
        {
            if(numero[k] == caracter)
            {
                isNumero = true;
                break;
            }
        }
        
        return isNumero;
    };
    
    $scope.ValidarFormula = function()
    {
        var abierto = 0;
        var cerrado = 0;
        for(var k=0; k<$scope.nuevaFormula.length; k++)
        {
            if($scope.nuevaFormula[k] == "(")
            {
                abierto++;
            }
            else if($scope.nuevaFormula[k] == ")")
            {
                cerrado++;
            }
        }
        
        if(abierto == cerrado)
        {
           return true; 
        }
        else
        {
            return false;
        }
    };
    
    $scope.GuardarFormula = function()
    {
        $scope.mensajeError = [];
        
        if(!($scope.ValidarFormula()))
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Formula invalida. El número de parentesis abiertos debe ser el mismo que el número de parentesis cerrados.";
            return;
        }
        else
        {
            if($scope.editarFormula == "Ancho")
            {
                $scope.nuevaPieza.FormulaAncho = $scope.nuevaFormula;
            }
            else if($scope.editarFormula == "Largo")
            {
                $scope.nuevaPieza.FormulaLargo = $scope.nuevaFormula;
            }
            
            $('#piezaFormulaForma').modal('toggle');
        }
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
            if($scope.tipoModulo[k].Nombre.toLowerCase() == $scope.nuevoTipoModulo.Nombre.toLowerCase() && $scope.tipoModulo[k].TipoModuloId != $scope.nuevoTipoModulo.TipoModuloId)
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
    $scope.claseConsumible = {nombre:"entrada", costo:"entrada"};
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
    
    /*-------- Ordenar -----------*/
    //cambia el campo por el cual se van a ordenar los consumibles
    $scope.CambiarOrdenarConsumible = function(campoOrdenar)
    {
        if($scope.ordenarPorConsumible == campoOrdenar)
        {
            $scope.ordenarPorConsumible = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPorConsumible = campoOrdenar;
        }
    };
    
    $scope.AbrirConsumibleForma = function(operacion, consumible)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoConsumible = new Consumible();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoConsumible = SetConsumible(consumible);
        }
        
        $('#consumibleForma').modal('toggle');
    };
    
    $scope.TerminarConsumible = function(nombreInvalido, costoInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.claseConsumible.nombre = "entradaError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";  
        }
        else
        {
            $scope.claseConsumible.nombre = "entrada";
        }
        if(costoInvalido)
        {
            $scope.claseConsumible.costo = "entradaError";
            $scope.mensajeError[$scope.mensajeError.length] = "*Indica un costo válido.";  
        }
        else
        {
            $scope.claseConsumible.costo = "entrada";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.consumible.length; k++)
        {
            if($scope.consumible[k].Nombre.toLowerCase() == $scope.nuevoConsumible.Nombre.toLowerCase() && $scope.consumible[k].ConsumibleId != $scope.nuevoConsumible.ConsumibleId)
            {
                $scope.claseConsumible.nombre = "entradaError";
                $scope.mensajeError[$scope.mensajeError.length] = "*El consumible " + $scope.nuevoConsumible.Nombre + " ya exite."; 
                return;
            }
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarConsumible();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarConsumible();
        }
        
    };
    
    $scope.AgregarConsumible = function()
    {
        AgregarConsumible($http, CONFIG, $q, $scope.nuevoConsumible).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetConsumible();
                $('#consumibleForma').modal('toggle');
                $scope.mensaje = "El consumible se ha agregado.";
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
    
    $scope.EditarConsumible = function()
    {
        EditarConsumible($http, CONFIG, $q, $scope.nuevoConsumible).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetConsumible();
                $('#consumibleForma').modal('toggle');
                $scope.mensaje = "El consumible se ha editado.";
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
    
    $scope.CerrarConsumibleForma = function()
    {
        $scope.claseConsumible = {nombre:"entrada", costo:"entrada"};
        $scope.mensajeError = [];
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
        
        if($scope.seccionCambiarActivo == "consumible")
        {
            datos[1] = $scope.objetoActivo.ConsumibleId;
            
            ActivarDesactivarConsumible($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El consumible se ha actualizado correctamente";
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
        GetTodosComponente($http, $q, CONFIG).then(function(data)
        {
            $scope.componente = data;
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
    
    $scope.GetCombinacionPorMaterialComponente = function(componenteId, operacion)          
    {
        GetCombinacionPorMaterialComponente($http, $q, CONFIG, componenteId, "componente").then(function(data)
        {
            if(data.length > 0)
            {
                $scope.combinacionMaterialComponente = data;
                if(operacion == "editar")
                {
                    for(var k=0; k<data.length; k++)
                    {
                        for(var i=0; i<$scope.material.length; i++)
                        {
                            if($scope.material[i].MaterialId == $scope.combinacionMaterialComponente[k].Material.MaterialId)
                            {
                                $scope.combinacionMaterialComponente[k].Material.Grueso = $scope.material[i].grueso;
                                break;
                            }
                        }

                        $scope.combinacionMaterialComponente[k].claseTipoMaterial = "dropdownListModal";
                        $scope.combinacionMaterialComponente[k].claseMaterial = "dropdownListModal";
                        $scope.combinacionMaterialComponente[k].claseGrueso = "dropdownListModal";
                    }
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
    
    $scope.GetTipoParte = function()
    {
        $scope.tipoParte = GetTipoParte();
    };
    
    //-------------Inicializar-----------------------
    $scope.InicializarModuloModulo = function()
    {
        $scope.GetTipoModulo();
        $scope.GetPieza();
        $scope.GetComponente();
        $scope.GetConsumible();

        $scope.GetCombinacionMaterial();
        $scope.GetTipoMaterial();
        $scope.GetMaterial();
        $scope.GetGruesoMaterial();
    };

    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            $scope.IdentificarPermisos();
            if(!$scope.permisoUsuario.componente.consultar && !$scope.permisoUsuario.pieza.consultar && !$scope.permisoUsuario.consumible.consultar && !$scope.permisoUsuario.tipoModulo.consultar)
            {
               for(var k=0; k<$rootScope.Perfiles.length; k++)
                {
                    if($scope.usuarioLogeado.PerfilSeleccionado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
                    {
                        $window.location = $rootScope.Perfiles[k].paginaPrincipal;
                    }
                } 
            }
            else
            {
                $scope.InicializarModuloModulo();
            }
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
            $scope.IdentificarPermisos();
            if(!$scope.permisoUsuario.componente.consultar && !$scope.permisoUsuario.pieza.consultar && !$scope.permisoUsuario.consumible.consultar && !$scope.permisoUsuario.tipoModulo.consultar)
            {
               for(var k=0; k<$rootScope.Perfiles.length; k++)
                {
                    if($scope.usuarioLogeado.PerfilSeleccionado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
                    {
                        $window.location = $rootScope.Perfiles[k].paginaPrincipal;
                    }
                } 
            }
            else
            {
                $scope.InicializarModuloModulo();
            }
        }
    });

});

//Pestañas
var tabConModulo = 
    [
        {titulo:"Componente", referencia: "#Componente", clase:"active", area:"componente"},
        {titulo:"Pieza", referencia: "#Pieza", clase:"", area:"pieza"},
        {titulo:"Tipo Módulo", referencia: "#TipoModulo", clase:"", area:"tipoModulo"},
        {titulo:"Consumible", referencia: "#Consumible", clase:"", area:"consumible"}
    ];

var tabFormula = 
    [
        {titulo:"Módulo"},
        {titulo:"Componente"},
        {titulo:"Pieza"},
        {titulo:"Constante"},
        {titulo:"Puerta"}
    ];

var operadores = 
    [
        {operador:"+", tipo:"operador"},
        {operador:"-", tipo:"operador"},
        {operador:"*", tipo:"operador"},
        {operador:"/", tipo:"operador"},
        {operador:"(", tipo:""},
        {operador:")", tipo:""}
    ];