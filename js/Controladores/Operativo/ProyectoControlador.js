app.controller("ProyectoControlador", function($scope, $rootScope, $location, PRESUPUESTO, $http, $q, CONFIG, $filter, MEDIOCONTACTO, DOMICILIO, datosUsuario)
{   
    $scope.medioCaptacion = [];
    $scope.persona = [];
    $scope.tipoProyecto = [];
    $scope.unidadNegocio = [];
    $scope.combinacion = [];
    $scope.tipoCubierta = [];
    $scope.tipoModulo = [];
    $scope.muestrario = [];
    $scope.servicio = [];
    $scope.puerta = [];
    $scope.maqueo = [];
    $scope.tipoAccesorio = [];
    $scope.muestrarioAccesorio = [];
    $scope.accesorio = [];
    $scope.cubierta = [];
    $scope.ubicacion = [];
    $scope.tipoCombinacion = [];
    $scope.promocion = [];
    
    $scope.componente = [];
    $scope.pieza = [];
    $scope.parteModulo = [];
    $scope.costoCombinacion = [];
    $scope.componenteEspecial = [];
    $scope.consumible = [];
    $scope.presupuesto = new Presupuesto();
    
    $scope.iva = new IVA();
    
    $scope.personaSeleccionada = false;
    
    $scope.detallePaso = pasoPresupuesto;
    
    $scope.grupoPrePiedra = new Object();
    $scope.grupoPreAglomerado13 = new Object();
    $scope.grupoPreAglomerado24 = new Object();
    
    $scope.clasePresupuesto = {
                            paso1:{nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"},
                            paso2:{tipoProyecto: "dropdownlistModal"},
                        };
    
    $scope.moduloAgregar = new ModuloPresupuesto();
    $scope.tipoModuloAgregar = [];
    $scope.tabSeleccionada = "";
    $scope.opt = "";
    
    $scope.$on('AgregarPresupuestoCero',function()
    {
        $scope.operacion = "Agregar";
         $scope.opt = "AgregarProyectoCero";
        
        $scope.presupuesto = new Presupuesto();
        
        $scope.copiarPresupuesto = false;
        $scope.personaSeleccionada = false;
        $scope.pasoPresupuesto = 1;
        
        $scope.proyectoNuevo = true;
        $scope.EstatusProyecto = "Nuevo";
        
        $scope.IniciarPresupuesto();
       
        
        $scope.CargarCatalogoPresupuesto();
        $scope.pasoMinimo = 1;
    
        $('#agregarPresupuestoModal').modal('toggle');
    });
    
    $scope.$on('EditarPresupuesto',function()
    {
        $scope.operacion = "Editar";
        $scope.opt = "";
        
        $scope.presupuesto = new Presupuesto();
        
        $scope.copiarPresupuesto = true; //bandera que indica que despues de obtener los catálogos se deberan de copiar los datos de algun presupuesto
        $scope.personaSeleccionada = true;
        $scope.pasoPresupuesto = 3;
         
        $scope.IniciarPresupuesto();
         
        $scope.presupuestoBase = PRESUPUESTO.GetPresupuesto(); // presupuesto a patir del cual se empezará a trabajar
         
        $scope.presupuestoBase.Persona.Seleccionado = true;
        $scope.SeleccionarPersona($scope.presupuestoBase.Persona);
        $scope.GetCombincacionInicio();
        $scope.CargarCatalogoPresupuesto();
        $scope.pasoMinimo = 3;
        $scope.SetPresupuestoBaseDatos();
        
        $scope.proyectoNuevo = false;
        $scope.EstatusProyecto = "Registrado";
    
        $('#agregarPresupuestoModal').modal('toggle');
    });
    
    $scope.$on('PersonalizarPresupuesto',function()
    {
        $scope.operacion = "Personalizar";
        $scope.opt = "Personalizar";
        
        $scope.presupuesto = new Presupuesto();
        $scope.combinacion = null;
        
        $scope.copiarPresupuesto = true; //bandera que indica que despues de obtener los catálogos se deberan de copiar los datos de algun presupuesto
        $scope.personaSeleccionada = true; 
        
        $scope.IniciarPresupuesto();
        $scope.pasoMinimo = 10;
         
        $scope.presupuestoBase = PRESUPUESTO.GetPresupuesto(); // presupuesto a patir del cual se empezará a trabajar
        $scope.presupuesto.Persona = $scope.presupuestoBase.Persona;
         
        $scope.CargarCatalogoPresupuesto();
        $scope.SetPresupuestoBaseDatos();
        
        $('#agregarPresupuestoModal').modal('toggle');
    });
    
    $scope.$on('ClonarPresupuesto',function()
    {
        $scope.operacion = "Agregar";
        $scope.opt = "Clonar";
        
        $scope.presupuesto = new Presupuesto();
        
        $scope.copiarPresupuesto = true; //bandera que indica que despuÉs de obtener los catálogos se deberan de copiar los datos de algún presupuesto
        $scope.personaSeleccionada = false;
        $scope.pasoPresupuesto = 1;

        $scope.IniciarPresupuesto();
         
        $scope.presupuestoBase = PRESUPUESTO.GetPresupuesto(); // presupuesto a patir del cual se empezará a trabajar
 
        if($scope.presupuestoBase.Persona !== null)
        {
            $scope.personaSeleccionada = true;
            
            $scope.presupuestoBase.Persona.Seleccionado = true;
            $scope.presupuestoBase.Persona.MedioCaptacionId = $scope.presupuestoBase.Persona.MedioCaptacion.MedioCaptacionId;
            $scope.presupuestoBase.Persona.NombreMedioCaptacion = $scope.presupuestoBase.Persona.MedioCaptacion.Nombre;
            $scope.SeleccionarPersona($scope.presupuestoBase.Persona);
            
            $scope.persona = [];
            $scope.persona.push($scope.presupuestoBase.Persona);
        }
        else
        {
             $scope.opt = "ClonarPre";
        }

        $scope.CargarCatalogoPresupuesto();
        $scope.pasoMinimo = 1;
        $scope.SetPresupuestoBaseDatos();
        //console.log($scope.proyectoNuevo );
        
        if($scope.presupuestoBase.Proyecto !== null)
        {
            $scope.proyectoNuevo = false;
            $scope.EstatusProyecto = "Registrado";
        }
        else
        {
            $scope.proyectoNuevo = true;
            $scope.EstatusProyecto = "Nuevo";
        }
    
    
        $('#agregarPresupuestoModal').modal('toggle');
    });
    
    $scope.$on('UnirPresupuesto',function()
    {
        $scope.operacion = "Agregar";
        $scope.opt = "UnirPresupuesto";
        
        $scope.presupuesto = new Presupuesto();
        
        $scope.copiarPresupuesto = true; //bandera que indica que despues de obtener los catálogos se deberan de copiar los datos de algun presupuesto
        $scope.personaSeleccionada = false;
        $scope.pasoPresupuesto = 1;

        $scope.IniciarPresupuesto();
         
        $scope.presupuestoBase = PRESUPUESTO.GetPresupuesto(); // presupuesto a patir del cual se empezará a trabajar
         
        var persona = PRESUPUESTO.GetPersona();
        var proyecto = PRESUPUESTO.GetProyecto();
        
        if(persona !== null)
        {
            $scope.presupuestoBase.Persona = persona;
            $scope.presupuestoBase.Persona.Seleccionado = true;
            $scope.presupuestoBase.Persona.MedioCaptacionId = $scope.presupuestoBase.Persona.MedioCaptacion.MedioCaptacionId;
            $scope.presupuestoBase.Persona.NombreMedioCaptacion = $scope.presupuestoBase.Persona.MedioCaptacion.Nombre;
            $scope.SeleccionarPersona($scope.presupuestoBase.Persona);
            
            $scope.persona = [];
        
        $scope.persona.push($scope.presupuestoBase.Persona);
        }
        
        if(proyecto !== null)
        {
           $scope.opt = "UnirPresupuestoPre";
        }

        $scope.CargarCatalogoPresupuesto();
        $scope.pasoMinimo = 1;
        //$scope.SetPresupuestoBaseDatos();
        //console.log($scope.proyectoNuevo );
        //$scope.GetCombincacionInicio();
        
        if(proyecto !== null)
        {
            $scope.presupuestoBase.Proyecto = proyecto;
            $scope.proyectoNuevo = false;
            $scope.EstatusProyecto = "Registrado";
        }
        else
        {
            $scope.proyectoNuevo = true;
            $scope.EstatusProyecto = "Nuevo";
        }
        
    
        $('#agregarPresupuestoModal').modal('toggle');
    });
    
    $scope.$on('AgregarProyecto',function()
    {
        $scope.operacion = "Agregar";
        $scope.opt = "AgregarProyecto";
        
        $scope.presupuesto = new Presupuesto();
        
        $scope.copiarPresupuesto = false;
        $scope.personaSeleccionada = false;
        $scope.pasoPresupuesto = 2;
        
        $scope.proyectoNuevo = true;
        $scope.EstatusProyecto = "Nuevo";
        
        $scope.IniciarPresupuesto();
        
        var persona = PRESUPUESTO.GetPersona();
        persona.Seleccionado = true;
        $scope.SeleccionarPersona(persona);
       
        
        $scope.CargarCatalogoPresupuesto();
        $scope.pasoMinimo = 2;
    
        $('#agregarPresupuestoModal').modal('toggle');
    });
    
    $scope.$on('AgregarPresupuestoProyecto',function()
    {
        $scope.operacion = "Agregar";
        $scope.opt = "AgregarPresupuesto";
        
        $scope.presupuesto = new Presupuesto();
        
        $scope.copiarPresupuesto = false;
        $scope.personaSeleccionada = true;
        $scope.pasoPresupuesto = 3;
        
        $scope.IniciarPresupuesto();
        
        var persona = PRESUPUESTO.GetPersona();
        persona.Seleccionado = true;
        $scope.SeleccionarPersona(persona);
        
        $scope.proyectoBase = PRESUPUESTO.GetProyecto();
        //console.log($scope.proyectoBase);
       
        
        $scope.CargarCatalogoPresupuesto();
        $scope.GetCombincacionInicio();
        $scope.pasoMinimo = 3;
    
        $scope.proyectoNuevo = false;
        $scope.EstatusProyecto = "Registrado";
        
        $('#agregarPresupuestoModal').modal('toggle');
    });
    
    $scope.SetPresupuestoBaseDatos = function()
    {
        $scope.presupuesto.Titulo = $scope.presupuestoBase.Titulo;
        $scope.presupuesto.DescripcionCliente = $scope.presupuestoBase.DescripcionCliente;
        $scope.presupuesto.DescripcionInterna = $scope.presupuestoBase.DescripcionInterna;
        $scope.presupuesto.PresupuestoId = $scope.presupuestoBase.PresupuestoId;
    };
    
    $scope.PresupuestoPersonalizado = function()
    {
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            $scope.combinacion = $scope.presupuestoBase.CombinacionMaterial;
            $scope.muestrario = $scope.presupuestoBase.Puerta;
            $scope.servicio = $scope.presupuestoBase.Servicio;
            $scope.maqueo = $scope.presupuestoBase.Maqueo;
            $scope.tipoAccesorio = $scope.presupuestoBase.Accesorio;
            $scope.maqueo = $scope.presupuestoBase.Maqueo;

            for(var k=0; k<$scope.combinacion.length; k++)
            {
                $scope.combinacion[k].PrecioVentaModulo = parseFloat($scope.combinacion[k].PrecioVenta);
                $scope.combinacion[k].Activo = true;
                $scope.combinacion[k].PorDefecto = true;
            }

            $scope.combinacionSeleccionada = $scope.combinacion[0].CombinacionMaterialId;

            for(var k=0; k<$scope.muestrario.length; k++)
            {
                $scope.muestrario[k].Activo = true;
                $scope.muestrario[k].PorDefecto = true;
                
                for(var i=0; i<$scope.muestrario[k].Combinacion.length; i++)
                {
                    $scope.muestrario[k].Combinacion[i].PrecioVenta = parseFloat($scope.muestrario[k].Combinacion[i].PrecioVenta);
                }
            }

            for(var k=0; k<$scope.maqueo.length; k++)
            {
                $scope.maqueo[k].Subtotal = parseFloat($scope.maqueo[k].PrecioVenta);
                $scope.maqueo[k].Activo = true;
                $scope.maqueo[k].PorDefecto = true;
            }

            for(var k=0; k<$scope.servicio.length; k++)
            {
                $scope.servicio[k].Subtotal = parseFloat($scope.servicio[k].PrecioVenta);
                $scope.servicio[k].Activo = true;
                $scope.servicio[k].Obligatorio = true;
            }

            for(var k=0; k<$scope.tipoAccesorio.length; k++)
            {
                $scope.tipoAccesorio[k].Presupuesto = true;
                $scope.tipoAccesorio[k].Obligatorio = CambiarDatoEnteroABool($scope.tipoAccesorio[k].Obligatorio);
                $scope.tipoAccesorio[k].ClaseAccesorio = new ClaseAccesorio();
                $scope.tipoAccesorio[k].ClaseAccesorio.ClaseAccesorioId = $scope.tipoAccesorio[k].ClaseAccesorioId;

                for(var i=0; i<$scope.tipoAccesorio[k].Muestrario.length; i++)
                {
                    $scope.tipoAccesorio[k].Muestrario[i].Subtotal =  parseFloat($scope.tipoAccesorio[k].Muestrario[i].PrecioVenta);
                    $scope.tipoAccesorio[k].Muestrario[i].Activo = true;
                    $scope.tipoAccesorio[k].Muestrario[i].PorDefecto = true;
                    $scope.tipoAccesorio[k].Muestrario[i].Accesorio = [true, false];

                    if($scope.tipoAccesorio[k].ClaseAccesorioId == "2")
                    {
                        for(var j=0; j<$scope.tipoAccesorio[k].Muestrario[i].Combinacion.length; j++)
                        {
                            $scope.tipoAccesorio[k].Muestrario[i].Combinacion[j].CombinacionId = $scope.tipoAccesorio[k].Muestrario[i].Combinacion[j].CombinacionMaterialId;
                            $scope.tipoAccesorio[k].Muestrario[i].Combinacion[j].Subtotal = parseFloat($scope.tipoAccesorio[k].Muestrario[i].Combinacion[j].PrecioVenta);
                        }
                    }
                }
            }

            
        }
        
        $scope.tipoCubierta = $scope.presupuestoBase.TipoCubierta;
        for(var k=0; k<$scope.tipoCubierta.length; k++)
        {
            $scope.tipoCubierta[k].PorDefecto = true;

            if(k === 0)
            {
                $scope.ubicacion = $scope.tipoCubierta[k].Ubicacion;
                for(var i=0; i<$scope.ubicacion.length; i++)
                {
                    $scope.ubicacion[i].Activo = true;
                    $scope.ubicacion[i].Seleccionado = false;
                    $scope.ubicacion[i].SeleccionadoAglomerado = false;

                    if($scope.tipoCubierta[k].TipoCubiertaId == "1")
                    {
                        $scope.ubicacion[i].SeleccionadoAglomerado = true;
                    }
                    else if($scope.tipoCubierta[k].TipoCubiertaId == "2")
                    {
                        $scope.ubicacion[i].Seleccionado = true;
                    }
                }
            }
            else
            {
                for(var i=0; i<$scope.tipoCubierta[k].Ubicacion.length; i++)
                {
                    var ubicado = false;
                    for(var j=0; j<$scope.ubicacion.length; j++)
                    {
                        if($scope.tipoCubierta[k].Ubicacion[i].UbicacionCubiertaId == $scope.ubicacion[j].UbicacionCubiertaId)
                        {
                            ubicado = true;
                            console.log($scope.ubicacion[j].UbicacionCubiertaId);
                            break;
                        }
                    }

                    if(!ubicado)
                    {
                       var u = $scope.tipoCubierta[k].Ubicacion[i];
                        u.Seleccionado = false;
                        u.SeleccionadoAglomerado = false;
                        u.Activo = true;
                       
                        
                        if($scope.tipoCubierta[k].TipoCubiertaId == "1")
                        {
                            u.SeleccionadoAglomerado = true;
                        }
                        else if($scope.tipoCubierta[k].TipoCubiertaId == "2")
                        {
                            u.Seleccionado = true;
                        }
                        
                         $scope.ubicacion.push(u);
                    }
                    else
                    {
                        if($scope.tipoCubierta[k].TipoCubiertaId == "1")
                        {
                            $scope.ubicacion[j].SeleccionadoAglomerado = true;
                        }
                        else if($scope.tipoCubierta[k].TipoCubiertaId == "2")
                        {
                            $scope.ubicacion[j].Seleccionado = true;
                        }
                    }
                }


            }
        }
        
        console.log($scope.ubicacion);
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            $scope.CrearPresupuestoBasico();
        }
        else
        {
            $scope.GetPromoPlanPago();
            $scope.CalcularTotalPromocion();
        }
        
        
    
    };
    
    $scope.IniciarPresupuesto = function()
    {
        $scope.catalogo = {combinacion: false, modulo: false, puerta: false, accesorio:false, cubierta: false, promoPlanPago: false};
        
        $scope.presupuesto.Persona.NuevoContacto = [];
        $scope.presupuesto.Persona.NuevoDomicilio = [];
        $scope.presupuesto.Persona.UnidadNegocio = [];
        $scope.persona = [];
        
        $scope.crearBasico = false;
        $scope.mostrarContenido = {contacto:false, direccion:false, unidad:false};
        $scope.usuario = datosUsuario.getUsuario();
        $scope.verPromo = false;
        $scope.verPlanPago = true;
        $scope.verPromoCubierta = false;
        $scope.nuevasPromociones = false;
        
         $scope.idPromocion = -1;
        $scope.promoActualizar = false;
        $scope.GetDatosUnidadNegocio();
        $scope.margenDireccion = true;
    };
    
    $scope.CargarCatalogoPresupuesto = function()
    {   
        //paso 1-2
        if($scope.opt != "Personalizar")
        {
            $scope.GetMedioCaptacion();
            $scope.GetUnidadNegocio();
            $scope.GetIVA();
        }
        
        $scope.GetTipoProyecto();
        //console.log($scope.usuario);
    };
    
    $scope.GetCombincacionInicio = function()
    {
        if(!$scope.catalogo.combinacion)
        {
            //paso 3
            $scope.GetCombinacionMaterial();
            $scope.GetTipoCubierta();
            $scope.GetTipoCombinacionMaterial();  
            $scope.GetColorGrupo();
                  
            
            $scope.catalogo.combinacion = true;
        }
    };
    
    $scope.GetModuloInicio = function()
    {
        if(!$scope.catalogo.modulo)
        {
            //modulos paso 4
            $scope.GetModuloPresupuesto();
            $scope.GetSeccionPorModulo();
            $scope.GetTipoModulo();

            $scope.GetCombinacionMaterialCosto();
            $scope.GetComponentePorModulo();
            $scope.GetPiezaPorComponente();
            $scope.GetPartePorModulo();
            $scope.GetComponenteEspecial();
            $scope.GetConsumiblePorModulo();
            
            $scope.catalogo.modulo = true;
        }
    };
    
    
    $scope.GetServicioPuertaInicio = function()
    {
        if(!$scope.catalogo.puerta)
        {
            //paso 5
            $scope.GetServicio();
            $scope.GetMuestrarioPuerta();
            
            $scope.catalogo.puerta = true;
        }
        
    };
    
    $scope.GetAccesorioInicio = function()
    {
        if(!$scope.catalogo.accesorio)
        {
            //paso 6
            $scope.GetMaqueo();
            $scope.GetTipoAccesorio();
            
            $scope.catalogo.accesorio = true;
        }
         
    };
    
    $scope.GetCubiertaInicio = function()
    {
        if(!$scope.catalogo.cubierta)
        {
            //paso 7-8
            $scope.GetCubierta();
            $scope.GetUbicacionCubierta();
            
            $scope.catalogo.cubierta = true;
        }
    };
    
    $scope.GetPromoPlanPago = function()
    {
        if(!$scope.catalogo.promoPlanPago && $scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            //paso 11
            $scope.catalogo.promoPlanPago = true;
            $scope.GetPlanPago();
        }
        
        if((!$scope.personaSeleccionada || $scope.nuevasPromociones) || $scope.promoActualizar)
        {
            if(!$rootScope.permisoOperativo.verTodosCliente)
            {
                $scope.GetPromocionPorUnidadNegocio($scope.usuario.UnidadNegocioId);
            }
            else
            {
                if($scope.presupuesto.Persona.UnidadNegocio.length == 1)
                {
                    $scope.GetPromocionPorUnidadNegocio($scope.presupuesto.Persona.UnidadNegocio[0].UnidadNegocioId);
                }
                else
                {
                    var unidad = false;
                    for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
                    {
                        if($scope.presupuesto.Persona.UnidadNegocio[k].MargenSel === true)
                        {
                            $scope.GetPromocionPorUnidadNegocio($scope.presupuesto.Persona.UnidadNegocio[k].UnidadNegocioId);
                            unidad = true;
                            break;
                        }
                    }

                    if(!unidad)
                    {
                        $scope.GetPromocionPorUnidadNegocio($scope.presupuesto.UnidadNegocioId);
                    }
                }
            }
        }
        else
        {
            $scope.promocion = [];
            for(var k=0; k<$scope.PromocionCubierta.length; k++)
            {
                $scope.PromocionCubierta[k].Presupuesto = true;
                $scope.PromocionCubierta[k].Show = true;
                $scope.PromocionCubierta[k].Activo = true; 
                $scope.PromocionCubierta[k].TipoVenta = new Object();
                $scope.PromocionCubierta[k].TipoVenta.TipoVentaId = $scope.PromocionCubierta[k].TipoVentaId;
                
                $scope.PromocionCubierta[k].TipoPromocion = new Object();
                $scope.PromocionCubierta[k].TipoPromocion.TipoPromocionId = $scope.PromocionCubierta[k].TipoPromocionId;
                
                $scope.promocion.push($scope.PromocionCubierta[k]);
            }
            
            for(var k=0; k<$scope.PromocionMueble.length; k++)
            {
                $scope.PromocionMueble[k].Presupuesto = true;
                $scope.PromocionMueble[k].Show = true;
                $scope.PromocionMueble[k].Activo = true; 
                $scope.PromocionMueble[k].TipoVenta = new Object();
                $scope.PromocionMueble[k].TipoVenta.TipoVentaId = $scope.PromocionMueble[k].TipoVentaId;
                
                $scope.PromocionMueble[k].TipoPromocion = new Object();
                $scope.PromocionMueble[k].TipoPromocion.TipoPromocionId = $scope.PromocionMueble[k].TipoPromocionId;
                
                $scope.promocion.push($scope.PromocionMueble[k]);
            }
        }
    };
    
    /*--------------- Cátalogos de módulos ----------------------*/
    $scope.GetComponentePorModulo = function()
    {
        GetComponentePorModulo($http, $q, CONFIG, "-1").then(function(data)
        {
            $scope.componente = data;
    
        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
        
    };
    
    $scope.GetPiezaPorComponente = function()
    {
        
        GetPiezaPorComponente($http, $q, CONFIG, "-1").then(function(data)
        {
            $scope.pieza = data;
            //console.log(data);
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener las piezas del componente." + error);
            return;
        });
    };
    
    $scope.GetPartePorModulo = function()
    {

        GetPartePorModulo($http, $q, CONFIG, "-1").then(function(data)
        {
            $scope.parteModulo = data;

        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    $scope.GetCombinacionMaterialCosto = function()
    {
        GetCombinacionMaterialCosto($http, $q, CONFIG).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
               $scope.costoCombinacion = data[1].Costo; 
            }
            else
            {
                $scope.costoCombinacion = [];
            }
    
        }).catch(function(error)
        {
            $scope.costoCombinacion  = [];
            alert("Ha ocurrido un error." + error);
            return;
        });
        
    };
    
    $scope.GetComponenteEspecial = function()
    {
        GetComponenteEspecial($http, $q, CONFIG).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
               $scope.componenteEspecial = data[1].Componente; 
            }
            else
            {
                $scope.componenteEspecial = [];
            }
    
        }).catch(function(error)
        {
            $scope.componenteEspecial  = [];
            alert("Ha ocurrido un error." + error);
            return;
        });
        
    };
    
    $scope.GetConsumiblePorModulo = function()
    {
        GetConsumiblePorModulo($http, $q, CONFIG, "-1").then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.consumible = data[1].Consumible;
            }
            else
            {
                $scope.consumible = [];
            }
            
            //console.log(data);
            
        }).catch(function(error)
        {
            $scope.consumible = [];
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    /*------------------------------ catálogos --------------------------------*/
     $scope.GetTipoProyecto = function()      
    {
        GetTipoProyecto($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoProyecto = data;
            
            if($scope.copiarPresupuesto && $scope.opt != "UnirPresupuesto" && $scope.opt != "Personalizar" && $scope.presupuestoBase.Proyecto != null)
            {
                $scope.CambiarProyectoPersona($scope.presupuestoBase.Proyecto);
            }
            if($scope.opt == "AgregarPresupuesto")
            {
                $scope.CambiarProyectoPersona($scope.proyectoBase);
            }
            if($scope.opt == "Personalizar")
            {
                for(var k=0; k<$scope.tipoProyecto.length; k++)
                {
                    if($scope.tipoProyecto[k].TipoProyectoId == $scope.presupuestoBase.Proyecto.TipoProyecto.TipoProyectoId)
                    {
                        $scope.CambiarTipoProyecto($scope.tipoProyecto[k]);

                        if($scope.tipoProyecto[k].Mueble)
                        {
                            $scope.pasoPresupuesto = 10;
                        }
                        else if($scope.tipoProyecto[k].CubiertaPiedra)
                        {
                            $scope.pasoPresupuesto = 12;
                            if($scope.opt == "Personalizar")
                            {
                                $scope.pasoMinimo = 12;
                            }
                        }
                        break;
                    }
                }
                
                $scope.GetPromocionPersona($scope.presupuesto.Persona.PersonaId);
                $scope.GetUnidadNegocioPersona($scope.presupuesto.Persona.PersonaId);
                $scope.GetColorGrupo();
                
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetMedioCaptacion = function()              
    {
        GetMedioCaptacion($http, $q, CONFIG).then(function(data)
        {
            $scope.medioCaptacion = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetBuscarPersona = function()              
    {
        var persona = new Object();
        persona.Nombre = $scope.presupuesto.Persona.Nombre;
        persona.PrimerApellido = $scope.presupuesto.Persona.PrimerApellido;
        GetBuscarPersona($http, $q, CONFIG, persona).then(function(data)
        {
            $scope.persona = data;
            //console.log($scope.persona);
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetUnidadNegocio = function()
    {
        GetUnidadNegocioSencillaPresupuesto($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                if(($scope.opt == "Clonar" || $scope.opt == "UnirPresupuesto") && $scope.personaSeleccionada)
                {
                    for(var k=0; k<data.length; k++)
                    {
                        data[k].show = true;
                        
                        for(un of $scope.presupuesto.Persona.UnidadNegocio)
                        {
                            if(data[k].UnidadNegocioId == un.UnidadNegocioId)
                            {
                                data[k].show = false;
                                break;
                            }
                        }
                    }
                }
                else
                {
                     for(var k=0; k<data.length; k++)
                    {
                        if(data[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                        {
                            data[k].show = false;
                            if($scope.presupuesto.Persona.UnidadNegocio.length === 0)
                            {
                                $scope.presupuesto.Persona.UnidadNegocio[0] = data[k];
                            }
                        }
                        else
                        {
                            data[k].show = true;
                        }
                    }   
                }
                
                $scope.unidadNegocio = data;
                
                
                /*if($scope.operacion == "Editar" || $scope.opt== "Agregar")
                {
                    for(var k=0; k<data.length; k++)
                    {
                        if(data[k].UnidadNegocioId == $scope.presupuestoBase.Proyecto.UnidadNegocioId)
                        {
                            $scope.CambiarMargenPresupuesto(data[k].UnidadNegocioId, true);
                            break;
                        }
                    }
                }*/
            }
            else
            {
                $scope.unidadNegocio = [];
            }
        }).catch(function(error)
        {
            $scope.unidadNegocio = [];
            alert(error);
        });
    };
    
    $scope.GetMedioContactoPersona = function(id)              
    {
        GetMedioContactoPersona($http, $q, CONFIG, id).then(function(data)
        {
            $scope.presupuesto.Persona.Contacto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDireccionPersona = function(id)              
    {
        GetDireccionPersona($http, $q, CONFIG, id).then(function(data)
        {
            $scope.presupuesto.Persona.Domicilio = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetProyectoPersona = function(id)              
    {
        GetProyectoPersona($http, $q, CONFIG, id).then(function(data)
        {
            //console.log(data);
            $scope.presupuesto.Persona.Proyecto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPromocionPersona = function(id)              
    {
        GetPromocionPersona($http, $q, CONFIG, id).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                if(data[2].NumeroPresupuesto != "0")
                {
                    $scope.PromocionCubierta = data[1].Promocion.PromocionCubierta;
                    $scope.PromocionMueble = data[1].Promocion.PromocionMueble;
                }
                else
                {
                    $scope.promoActualizar = true;
                    $scope.nuevasPromociones = true;
                }
            }
            else
            {
               $scope.presupuesto.Promocion = {promocionMueble: [], promocionCubierta: []};
            }
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetUnidadNegocioPersona = function(id)              
    {
        GetUnidadNegocioPersona($http, $q, CONFIG, id).then(function(data)
        {
            
            /*if($scope.operacion == "Editar")
            {
                for(var k=0; k<data.length; k++)
                {
                    if(data[k].UnidadNegocioId == $scope.presupuestoBase.Proyecto.UnidadNegocioId)
                    {
                        data[k].MargenSel = true;
                        //$scope.CambiarMargenPresupuesto(data[k].UnidadNegocioId, data.MargenSel);
                        break;
                    }
                }
            }*/
            
            $scope.presupuesto.Persona.UnidadNegocio = data;
            
            for(var k=0; k<$scope.unidadNegocio.length; k++)
            {
                $scope.unidadNegocio[k].show = true;
                
                for(var i=0; i<data.length; i++)
                {
                    if(data[i].UnidadNegocioId == $scope.unidadNegocio[k].UnidadNegocioId)
                    {
                        $scope.unidadNegocio[k].show = false;
                        break;
                    }
                }
            }
            
            if(!$rootScope.permisoOperativo.verTodosCliente)
            {
                var unidad = false;
                for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
                {
                    if($scope.presupuesto.Persona.UnidadNegocio[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                    {
                        unidad = true;
                        break;
                    }
                }

                if(!unidad)
                {
                    for(var k=0; k<$scope.unidadNegocio.length; k++)
                    {
                        if($scope.unidadNegocio[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                        {
                            $scope.unidadNegocio[k].show = false;
                            var i = $scope.presupuesto.Persona.UnidadNegocio.length;
                            $scope.presupuesto.Persona.UnidadNegocio[i] = $scope.unidadNegocio[k];

                            break;
                        }
                    }
                }
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
                
                if($scope.copiarPresupuesto)
                {
                    for(var k=0; k<$scope.combinacion.length; k++)
                    {
                        $scope.combinacion[k].PorDefecto = false;
                        for(var i=0; i<$scope.presupuestoBase.CombinacionMaterial.length; i++)
                        {
                            if($scope.presupuestoBase.CombinacionMaterial[i].CombinacionMaterialId == $scope.combinacion[k].CombinacionMaterialId)
                            {
                                $scope.combinacion[k].PorDefecto = true;
                                break;   
                            }
                        }
                    }
                }
                //console.log(data);
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetTipoCombinacionMaterial = function()      
    {
        GetTipoCombinacionMaterial($http, $q, CONFIG).then(function(data)
        {
            $scope.tipoCombinacion = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetTipoCubierta = function()          
    {
        $scope.tipoCubierta = GetTipoCubierta();
        
        if($scope.copiarPresupuesto)
        {
            for(var k=0; k<$scope.tipoCubierta.length; k++)
            {
                $scope.tipoCubierta[k].PorDefecto = false;
                for(var i=0; i<$scope.presupuestoBase.TipoCubierta.length; i++)
                {
                    //console.log($scope.presupuestoBase.TipoCubierta);
                    if($scope.tipoCubierta[k].TipoCubiertaId == $scope.presupuestoBase.TipoCubierta[i].TipoCubiertaId)
                    {
                        $scope.tipoCubierta[k].PorDefecto = true;
                        break;
                    }
                }
            }
        }
        
    };
    
    $scope.GetModuloPresupuesto = function()          
    {
        GetModuloPresupuesto($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.modulo = data;
                $scope.GetMedidasModulo();
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetMedidasModulo = function()          
    {
        GetMedidasModulo($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.medidasModulo = data;
                $scope.SetMedidasModulo();
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetMedidasModulo = function()
    {
        var sqlBase = "Select Ancho, Alto, Profundo, AnchoNumero, AltoNumero, ProfundoNumero From ? WHERE ModuloId = '";
        var sql = "";

        for(var k=0; k<$scope.modulo.length; k++)
        {
            sql = sqlBase;
            sql +=  $scope.modulo[k].ModuloId + "'";

            $scope.modulo[k].Medida = alasql(sql,[$scope.medidasModulo]);
        }
        
        $scope.ValidarModulos([]);
        
        if($scope.copiarPresupuesto)
        {
            for(var k=0; k<$scope.presupuestoBase.Modulo.length; k++)
            {
                $scope.moduloAgregar = $scope.SetModuloPresupuesto($scope.presupuestoBase.Modulo[k]);
                $scope.AgregarModulo($scope.moduloAgregar.Cantidad);
                //console.log($scope.moduloAgregar);
            }
            
            $scope.moduloAgregar = new ModuloPresupuesto();
        }
    };
    
    $scope.SetModuloPresupuesto = function(data)
    {
        var modulo = new ModuloPresupuesto();
        
        modulo.ModuloId = data.ModuloId;
        modulo.Nombre = data.Nombre;
        modulo.Cantidad = parseInt(data.Cantidad);
        
        modulo.Ancho = data.Ancho;
        modulo.Alto = data.Alto;
        modulo.Profundo = data.Profundo;
        
        modulo.AnchoNumero = FraccionADecimal(data.Ancho);
        modulo.AltoNumero = FraccionADecimal(data.Alto);
        modulo.ProfundoNumero = FraccionADecimal(data.Profundo);
        
        modulo.Desperdicio = parseFloat(data.Desperdicio);
        modulo.Margen = parseFloat(data.Margen);
        
        modulo.TipoModulo.TipoModuloId = data.TipoModuloId;
        modulo.TipoModulo.Nombre = data.NombreTipoModulo;
        
        return modulo;
    };
    
    $scope.GetSeccionPorModulo = function()
    {
        GetSeccionPorModulo($http, $q, CONFIG, "-1").then(function(data)
        {
            $scope.seccionModulo = data;
            
        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
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
    
    $scope.GetModuloImagen = function(modulo)
    {
        GetModuloImagen($http, $q, CONFIG, modulo.ModuloId).then(function(data)
        {
            modulo.Imagen = data;
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetServicio = function()      
    {
        GetServicio($http, $q, CONFIG).then(function(data)
        {
            $scope.servicio = data;
            
            if($scope.copiarPresupuesto)
            {
                for(var k=0; k<$scope.servicio.length; k++)
                {
                    $scope.servicio[k].Obligatorio = false;
                    for(var i=0; i<$scope.presupuestoBase.Servicio.length; i++)
                    {
                        if($scope.servicio[k].ServicioId == $scope.presupuestoBase.Servicio[i].ServicioId)
                        {
                            $scope.servicio[k].Obligatorio = true;
                            $scope.servicio[k].Cantidad = "";
                            break;
                        }
                    }
                }
            }
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetMuestrarioPuerta = function()      
    {
        GetMuestrario($http, $q, CONFIG, 1).then(function(data)
        {
            $scope.muestrario = data;
            $scope.GetPuerta();
            
            if($scope.copiarPresupuesto)
            {
                for(var k=0; k<$scope.muestrario.length; k++)
                {
                    $scope.muestrario[k].PorDefecto = false;
                    
                    for(var i=0; i<$scope.presupuestoBase.Puerta.length; i++)
                    {
                        if($scope.muestrario[k].MuestrarioId == $scope.presupuestoBase.Puerta[i].MuestrarioId)
                        {
                            $scope.muestrario[k].PorDefecto = true;
                            break;
                        }
                    }
                }
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
            $scope.puerta = data;
            
            for(var k=0; k<$scope.puerta.length; k++)
            {
                $scope.puerta[k].MuestrarioId = $scope.puerta[k].Muestrario.MuestrarioId;
            }
            
            $scope.GetComponentePorPuerta();
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetComponentePorPuerta = function()      
    {
        GetComponentesPorPuertaComponente($http, $q, CONFIG).then(function(data)
        {
            $scope.componentePuerta = data;
            $scope.GetPiezaPorComponentePuerta();
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPiezaPorComponentePuerta = function()      
    {
        GetComponentePorPuerta($http, $q, CONFIG, "-1").then(function(data)
        {
            
            $scope.piezaComponentePuerta = data;
            $scope.SetPuertaMuestrario();
        }).catch(function(error)
        {
            alert(error);
        });
    
    };
    
    $scope.SetPuertaMuestrario = function()
    {
        var sqlBase = "Select PuertaId, Nombre, Activo From ? WHERE Activo = true AND MuestrarioId = '";
        var sql = "";

        for(var k=0; k<$scope.muestrario.length; k++)
        {
            sql = sqlBase;
            sql +=  $scope.muestrario[k].MuestrarioId + "'";

            $scope.muestrario[k].Puerta = alasql(sql,[$scope.puerta]);
        }
        
        sqlBase = "Select ComponenteId, NombreComponente as Nombre, ComponentePorPuertaId From ? WHERE PuertaId = '";

        for(var k=0; k<$scope.muestrario.length; k++)
        {
            for(var i=0; i<$scope.muestrario[k].Puerta.length; i++)
            {
                if($scope.muestrario[k].Puerta[i].Activo)
                {
                    sql = sqlBase;
                    sql +=  $scope.muestrario[k].Puerta[i].PuertaId + "'";

                    $scope.muestrario[k].Puerta[i].Componente = alasql(sql,[$scope.componentePuerta]);
                }
            }
        }
        
        sqlBase = "Select * From ? WHERE ComponenteId = '";

        for(var k=0; k<$scope.muestrario.length; k++)
        {
            for(var i=0; i<$scope.muestrario[k].Puerta.length; i++)
            {
                if($scope.muestrario[k].Puerta[i].Activo)
                {
                    for(var j=0; j<$scope.muestrario[k].Puerta[i].Componente.length; j++)
                    {
                        sql = sqlBase;
                        sql +=  $scope.muestrario[k].Puerta[i].Componente[j].ComponenteId + "' AND PuertaId = '" + $scope.muestrario[k].Puerta[i].PuertaId +"'";

                        $scope.muestrario[k].Puerta[i].Componente[j].Pieza = alasql(sql,[$scope.piezaComponentePuerta]);
                    }
                }
            }
        }
    };
    
    $scope.GetMaqueo = function()      
    {
        GetMaqueo($http, $q, CONFIG).then(function(data)
        {
            $scope.maqueo = data;
            $scope.SetColorMaqueo();
            
            if($scope.copiarPresupuesto)
            {
                for(var k=0; k<$scope.maqueo.length; k++)
                {
                    $scope.maqueo[k].PorDefecto = false;
                    for(var i=0; i<$scope.presupuestoBase.Maqueo.length; i++)
                    {
                        if($scope.maqueo[k].MaqueoId == $scope.presupuestoBase.Maqueo[i].MaqueoId)
                        {
                            $scope.maqueo[k].PorDefecto = true;
                            break;
                        }
                    }
                }
            }
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetColorGrupo = function()
    {
        GetGrupoPorColor($http, $q, CONFIG, "-1").then(function(data)
        {
            $scope.grupoColor = data;
            
            if($scope.opt == "Personalizar")
            {
                $scope.GetCubierta();
            }
            
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetColorMaqueo = function()
    {
        var sqlBase = "Select Nombre, ColorId, Imagen, Activo From ? WHERE GrupoId = '";
        var sql = "";

        for(var k=0; k<$scope.maqueo.length; k++)
        {
            sql = sqlBase;
            sql +=  $scope.maqueo[k].Grupo.GrupoId + "'";

            $scope.maqueo[k].Color = alasql(sql,[$scope.grupoColor]);
        }
    };
    
    $scope.GetTipoAccesorio = function()              
    {
        GetTipoAccesorio($http, $q, CONFIG, "presupuesto").then(function(data)
        {

            $scope.tipoAccesorio = data;
            $scope.GetMuestrarioAccesorio();
                
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetMuestrarioAccesorio = function()      
    {
        GetMuestrario($http, $q, CONFIG, 2).then(function(data)
        {
            $scope.muestrarioAccesorio = data;
            $scope.GetAccesorio();
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetAccesorio = function()      
    {
        GetAccesorio($http, $q, CONFIG, "presupuesto").then(function(data)
        {
            $scope.accesorio = data;
            $scope.GetAccesorioCosto();
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetAccesorioCosto = function()      
    {
        GetAccesorioCosto($http, $q, CONFIG).then(function(data)
        {
            $scope.accesorioCostos = data;
            $scope.SetDatosAccesorio();
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetDatosAccesorio = function()
    {
        // Muestrarios en tipo de accesorios
        var sqlBase = "Select MuestrarioId, Nombre, Margen, PorDefecto, Activo From ? WHERE TipoAccesorioId = '";
        var sql = "";

        for(var k=0; k<$scope.tipoAccesorio.length; k++)
        {
            sql = sqlBase;
            sql +=  $scope.tipoAccesorio[k].TipoAccesorioId + "'";

            $scope.tipoAccesorio[k].Muestrario = alasql(sql,[$scope.muestrarioAccesorio]);
            
            if($scope.tipoAccesorio[k].Obligatorio)
            {
                $scope.tipoAccesorio[k].Presupuesto = true;
            }
            else
            {
                $scope.tipoAccesorio[k].Presupuesto = false;
            }
        }
        
        // Accesorios en muestrarios
        sqlBase = "Select AccesorioId, TipoAccesorioId, Nombre, Imagen, CostoUnidad, ConsumoUnidad, Contable, Obligatorio From ? WHERE MuestrarioId = '";
        
        for(var k=0; k<$scope.tipoAccesorio.length; k++)
        {
            for(var i=0; i<$scope.tipoAccesorio[k].Muestrario.length; i++)
            {
                sql = sqlBase;
                sql +=  $scope.tipoAccesorio[k].Muestrario[i].MuestrarioId + "'";

                $scope.tipoAccesorio[k].Muestrario[i].Accesorio = alasql(sql,[$scope.accesorio]);
            }
        }
        
        sqlBase = "Select * From ? WHERE AccesorioId = '";
        
        for(var k=0; k<$scope.tipoAccesorio.length; k++)
        {
            for(var i=0; i<$scope.tipoAccesorio[k].Muestrario.length; i++)
            {
                for(var j=0; j<$scope.tipoAccesorio[k].Muestrario[i].Accesorio.length; j++)
                {
                    sql = sqlBase;
                    sql +=  $scope.tipoAccesorio[k].Muestrario[i].Accesorio[j].AccesorioId + "'";

                    $scope.tipoAccesorio[k].Muestrario[i].Accesorio[j].Costo = alasql(sql,[$scope.accesorioCostos]);
                }
            }
        }
        
        
        if($scope.copiarPresupuesto)
        {
            for(var k=0; k<$scope.tipoAccesorio.length; k++)
            {
                $scope.tipoAccesorio[k].Presupuesto = false;
                for(var i=0; i<$scope.presupuestoBase.Accesorio.length; i++)
                {
                    if($scope.tipoAccesorio[k].TipoAccesorioId == $scope.presupuestoBase.Accesorio[i].TipoAccesorioId)
                    {
                        $scope.tipoAccesorio[k].Presupuesto = true;
                        $scope.tipoAccesorio[k].Cantidad = parseInt($scope.presupuestoBase.Accesorio[i].Cantidad);

                        for(var l=0; l<$scope.tipoAccesorio[k].Muestrario.length; l++)
                        {
                            $scope.tipoAccesorio[k].Muestrario[l].PorDefecto = false;
                            for(var j=0; j<$scope.presupuestoBase.Accesorio[i].Muestrario.length; j++)
                            {
                                if($scope.tipoAccesorio[k].Muestrario[l].MuestrarioId ==$scope.presupuestoBase.Accesorio[i].Muestrario[j].MuestrarioId )
                                {
                                    $scope.tipoAccesorio[k].Muestrario[l].PorDefecto = true;
                                    break;
                                }
                            }
                        }

                        break;
                    }
                }

            }
        }
        
        //console.log($scope.tipoAccesorio);
    };
    
    $scope.GetCubierta = function()
    {
        GetCubierta($http, $q, CONFIG).then(function(data)
        {
            $scope.cubierta = data;
            
            $scope.GetGrupoColorCubierta();
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetUbicacionCubierta = function()      
    {
        GetUbicacionCubierta($http, $q, CONFIG).then(function(data)
        {
            $scope.ubicacion = data;
            $scope.GetDatosUbicacion();
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDatosUbicacion = function()
    {
        GetDatosUbicacion($http, $q, CONFIG, "-1").then(function(data)
        {   
            $scope.ubicacionDatos = data;
            $scope.GetConsumiblePorFabricacion();
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetConsumiblePorFabricacion = function()
    {
        GetConsumiblePorFabricacion($http, $q, CONFIG, "-1").then(function(data)
        {
            $scope.fabricacionConsumible = data;
            $scope.SetUbicacionDatos();
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetGrupoColorCubierta = function()              
    {
        GetGrupoColorCubierta($http, $q, CONFIG, "-1").then(function(data)
        {
            $scope.grupoCubierta = data;
            $scope.GetCubiertaUbicacion();
            
        
        }).catch(function(error)
        {
            alert(error);
        });

    };
    
    $scope.GetCubiertaUbicacion = function()
    {
        GetCubiertaUbicacion($http, $q, CONFIG, -1).then(function(data)
        {
            $scope.cubiertaUbicacion = data;
            $scope.SetColorMaterialCubierta();
        }).catch(function(error)
        { 
            alert(error);
        });
    };
    
    $scope.SetUbicacionDatos = function()
    {           
        //Fabricacion Ubicacion
        for(var k=0; k<$scope.ubicacion.length; k++)
        {
            $scope.ubicacion[k].Fabricacion = [];
            for(var i=0; i<$scope.ubicacionDatos.length; i++)
            {
                if($scope.ubicacion[k].UbicacionCubiertaId == $scope.ubicacionDatos[i].UbicacionCubierta.UbicacionCubiertaId)
                {
                    var index = $scope.ubicacion[k].Fabricacion.length;
                    $scope.ubicacion[k].Fabricacion[index] = new Object();
                    $scope.ubicacion[k].Fabricacion[index].TipoCubiertaId = $scope.ubicacionDatos[i].TipoCubierta.TipoCubiertaId;
                    $scope.ubicacion[k].Fabricacion[index].FabricacionCubiertaId = $scope.ubicacionDatos[i].FabricacionCubierta.FabricacionCubiertaId;
                }
            }
        }
        
        // consumible Fabricacion
        var sqlBase = "Select Cantidad, Costo From ? WHERE FabricacionCubiertaId = '";
        var sql = "";

        for(var k=0; k<$scope.ubicacion.length; k++)
        {
            for(var i=0; i<$scope.ubicacion[k].Fabricacion.length; i++)
            {
                sql = sqlBase;
                sql +=  $scope.ubicacion[k].Fabricacion[i].FabricacionCubiertaId + "'";

                $scope.ubicacion[k].Fabricacion[i].Consumible = alasql(sql,[$scope.fabricacionConsumible]);
            }
            
        }
        
        if($scope.copiarPresupuesto)
        {
            for(var k=0; k<$scope.ubicacion.length; k++)
            {
                $scope.ubicacion[k].SeleccionadoAglomerado = false;
                $scope.ubicacion[k].Seleccionado = false;

                for(var i=0; i<$scope.presupuestoBase.TipoCubierta.length; i++)
                {
                    if($scope.presupuestoBase.TipoCubierta[i].TipoCubiertaId == "1")
                    {
                        for(var j=0; j<$scope.presupuestoBase.TipoCubierta[i].Ubicacion.length; j++)
                        {
                            if($scope.presupuestoBase.TipoCubierta[i].Ubicacion[j].UbicacionCubiertaId == $scope.ubicacion[k].UbicacionCubiertaId)
                            {
                                $scope.ubicacion[k].SeleccionadoAglomerado = true;
                                $scope.ubicacion[k].CantidadAglomerado = parseInt($scope.presupuestoBase.TipoCubierta[i].Ubicacion[j].Cantidad);
                                break;
                            }

                        }
                    }
                    else if($scope.presupuestoBase.TipoCubierta[i].TipoCubiertaId == "2")
                    {
                        for(var j=0; j<$scope.presupuestoBase.TipoCubierta[i].Ubicacion.length; j++)
                        {
                            if($scope.presupuestoBase.TipoCubierta[i].Ubicacion[j].UbicacionCubiertaId == $scope.ubicacion[k].UbicacionCubiertaId)
                            {
                                $scope.ubicacion[k].Seleccionado = true;
                                $scope.ubicacion[k].Elemento = [];

                                for(var h=0; h<$scope.presupuestoBase.TipoCubierta[i].Ubicacion[j].Seccion.length; h++)
                                {
                                    var secc = new Object();
                                    secc.Lado1 = $scope.presupuestoBase.TipoCubierta[i].Ubicacion[j].Seccion[h].Lado1;
                                    secc.Lado2 = $scope.presupuestoBase.TipoCubierta[i].Ubicacion[j].Seccion[h].Lado2;
                                    $scope.ubicacion[k].Elemento.push(secc);
                                }

                                break;
                            }

                        }
                    }
                }
            }
        }
        
        //console.log($scope.ubicacion);
        //console.log($scope.ubicacionDatos);
        //console.log($scope.fabricacionConsumible);
    
    };
    
    $scope.SetColorMaterialCubierta = function()
    {
        
        // ubicacion Cubierta
        var sqlBase = "Select UbicacionCubiertaId, Nombre From ? WHERE MaterialId = '";
        var sql = "";

        for(var k=0; k<$scope.cubierta.length; k++)
        {
            sql = sqlBase;
            sql +=  $scope.cubierta[k].Material.MaterialId + "'";

            $scope.cubierta[k].Ubicacion = alasql(sql,[$scope.cubiertaUbicacion]);
        }
        
        // cubierta con grupo
        sqlBase = "Select CostoUnidad, GrupoId, NombreGrupo, PorDefecto, Activo From ? WHERE MaterialId = '";

        for(var k=0; k<$scope.cubierta.length; k++)
        {
            sql = sqlBase;
            sql +=  $scope.cubierta[k].Material.MaterialId + "'";

            $scope.cubierta[k].Grupo = alasql(sql,[$scope.grupoCubierta]);
        }
        
        // ColoresGrupo
        sqlBase = "Select Nombre, ColorId, Imagen, Activo From ? WHERE GrupoId = '";
        
        for(var k=0; k<$scope.cubierta.length; k++)
        {
            for(var i=0; i<$scope.cubierta[k].Grupo.length; i++)
            {
                sql = sqlBase;
                sql +=  $scope.cubierta[k].Grupo[i].GrupoId + "'";
                $scope.cubierta[k].Grupo[i] = SetColorPorMaterialCubierta($scope.cubierta[k].Grupo[i]);
                $scope.cubierta[k].Grupo[i].Color = alasql(sql,[$scope.grupoColor]);
            }
        }
        
        if($scope.copiarPresupuesto)
        {
            for(var k=0; k<$scope.cubierta.length; k++)
            {
                for(var l=0; l<$scope.cubierta[k].Grupo.length; l++)
                {
                    $scope.cubierta[k].Grupo[l].PorDefecto = false;
                    
                    for(var i=0; i<$scope.presupuestoBase.TipoCubierta.length; i++)
                    {
                        if($scope.presupuestoBase.TipoCubierta[i].TipoCubiertaId == $scope.cubierta[k].TipoCubierta.TipoCubiertaId)
                        {
                            for(var j=0; j<$scope.presupuestoBase.TipoCubierta[i].Material.length; j++)
                            {
                                if($scope.presupuestoBase.TipoCubierta[i].Material[j].MaterialId == $scope.cubierta[k].Material.MaterialId && $scope.cubierta[k].Grupo[l].Grupo.GrupoId == $scope.presupuestoBase.TipoCubierta[i].Material[j].GrupoId)
                                {

                                    $scope.cubierta[k].Grupo[l].PorDefecto = true;
                                    if($scope.opt == "Personalizar")
                                    {
                                        $scope.cubierta[k].Grupo[l].Ubicacion = $scope.presupuestoBase.TipoCubierta[i].Material[j].Ubicacion;
                                        for(var n=0; n<$scope.cubierta[k].Grupo[l].Ubicacion.length; n++)
                                        {
                                            $scope.cubierta[k].Grupo[l].Ubicacion[n].UbicacionId = $scope.cubierta[k].Grupo[l].Ubicacion[n].UbicacionCubiertaId;
                                            $scope.cubierta[k].Grupo[l].Ubicacion[n].Subtotal = parseFloat($scope.cubierta[k].Grupo[l].Ubicacion[n].PrecioVenta);
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    
                }
            }
        }
        
        if($scope.opt == "Personalizar")
        {
            $scope.PresupuestoPersonalizado();
        }
        
    };
    
    $scope.SetTipoCombinacion = function()
    {
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            for(var k=0; k<$scope.tipoCombinacion.length; k++)
            {
                $scope.tipoCombinacion.Combinacion = [];
                for(var i=0; i<$scope.combinacion.length; i++)
                {
                    if($scope.tipoCombinacion[k].TipoCombinacionId == $scope.combinacion[i].TipoCombinacion.TipoCombinacionId && $scope.combinacion[i].Activo && $scope.combinacion[i].PorDefecto)
                    {
                        $scope.tipoCombinacion.Combinacion.push($scope.combinacion[i]);
                    }
                }
            }
        }
        
        //console.log($scope.combinacion);
        //console.log($scope.tipoCombinacion);
    };
    
    
    $scope.GetMargenDireccion = function(direccion)              
    {
        GetMargenDireccion($http, $q, CONFIG, direccion).then(function(data)
        {
            //console.log(data);
            if(data !== "fallo")
            {
                if($scope.operacion != "Editar" || data[1].Margen != "-1")
                {
                    $scope.presupuesto.Margen = parseFloat(data[1].Margen);
                    $scope.presupuesto.UnidadNegocioId = data[2].UnidadNegocioId;
                }
                
                if(data[1].Margen != "-1")
                {
                    $scope.margenDireccion = false;
                }
                else
                {
                    $scope.margenDireccion = true;
                    
                    $scope.SetMargenUnidadSel();
                }
                //console.log($scope.presupuesto.Margen);
            }
            else
            {
                $scope.presupuesto.Margen = -1;
                $scope.presupuesto.UnidadNegocioId = 0;
            }
            
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.SetMargenUnidadSel = function()
    {
        for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
        {
            if($scope.presupuesto.Persona.UnidadNegocio[k].MargenSel == true)
            {
                $scope.CambiarMargenPresupuesto($scope.presupuesto.Persona.UnidadNegocio[k].UnidadNegocioId, true);
                break;
            }
        }
    };
        
    
    $scope.GetPromocionPorUnidadNegocio = function(id)
    {
        if(id != $scope.idPromocion)
        {
            $scope.idPromocion = id;
            GetPromocionPorUnidadNegocio($http, $q, CONFIG, id).then(function(data)
            {
                if(data.length > 0)
                {
                    $scope.promocion = data;
                    $scope.PromocionPorCombinacion();
                }
                else
                {
                    $scope.promocion = [];
                }
            }).catch(function(error)
            {
                $scope.promocion = [];
                alert(error);
            });
        }
    };
    
    $scope.GetPlanPago = function()
    {
        GetPlanPago($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.planPago = data;
                
                var fecha = new Date();
                var fechaEnt; 
                
                for(var k=0; k<data.length; k++)
                {
                    $scope.planPago[k].Abono = [];
                    
                    fechaEnt = new Date();
                    
                    fechaEnt.setDate(fecha.getDate()+parseInt($scope.planPago[k].FechaEntrega));
                    /*var mes = fechaEnt.getMonth()+1;

                    if(mes < 10)
                    {
                        mes = "0" + mes;
                    }*/
                    $scope.planPago[k].FechaFin = fechaEnt.getDate() + "/" + GetMesNombre(fechaEnt.getMonth()) + "/" + fechaEnt.getFullYear();
                    $scope.planPago[k].FechaFin2 = new Date(fechaEnt.getFullYear(), fechaEnt.getMonth(), fechaEnt.getDate());
                }
            }
            else
            {
                $scope.planPago = [];
            }
        }).catch(function(error)
        {
            $scope.planPago = [];
            alert(error);
        });
    };
    
    $scope.GetPlanPagoAbono = function(dato)
    {
        GetPlanPagoAbono($http, $q, CONFIG, dato.PlanPagoId).then(function(data)
        {   
            dato.Abono = data;
            $scope.CalcularAbono(dato);
        }).catch(function(error)
        {
            dato.Abono = [];
            alert(error);
        });
    };
    
    $scope.GetIVA = function()
    {
        GetIVA($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.iva = data[0];
            }
            else
            {
                $scope.iva = 0;
            }
        }).catch(function(error)
        {
            $scope.iva = 0;
            alert(error);
        });
    };
    
    $scope.GetDatosUnidadNegocio = function()
    {
        GetDatosUnidadNegocio($http, $q, CONFIG, $scope.usuario.UnidadNegocioId).then(function(data)
        {
            $scope.UnidadNegocioDato = data[0];
        }).catch(function(error)
        { 
            alert(error);
        });
    };
    
    /*----------------------------   Agregar Presupuesto ------------------------*/
    
    /*----------- interfaz -----------*/
    $scope.GetClaseDropdown = function(valor)
    {
        if(valor)
        {
            return "active";
        }
        else
        {
            return "";     
        }
    };
    
    /*--------- Paso 1 -------------*/
    $scope.TerminarPaso1 = function(nombreInvalido, apellidoInvalido, medioInvalido)
    {

        if(!$scope.ValidarDatos(nombreInvalido, apellidoInvalido, medioInvalido))
        {
            return;
        }
        else
        {
            $scope.pasoPresupuesto++;
        }
    };
    
    $scope.ValidarDatos = function(nombreInvalido, apellidoInvalido, medioInvalido)
    {
        $scope.mensajeError = [];
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre válido.";
            $scope.clasePresupuesto.paso1.nombre = "entradaError";
        }
        else
        {
            $scope.clasePresupuesto.paso1.nombre = "entrada";
        }
        
        if(apellidoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El primer apellido no es válido.";
            $scope.clasePresupuesto.paso1.apellido1 = "entradaError";
        }
        else
        {
            $scope.clasePresupuesto.paso1.apellido1 = "entrada";
        }
        
        if($scope.presupuesto.Persona.SegundoApellido.length > 0)
        {
            if(!$rootScope.erNombrePersonal.test($scope.presupuesto.Persona.SegundoApellido))
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El segundo apellido no es válido.";
                $scope.clasePresupuesto.paso1.apellido2 = "entradaError";
            }
            else
            {
                $scope.clasePresupuesto.paso1.apellido2 = "entrada";
            }
        }
        
        if($scope.presupuesto.Persona.MedioCaptacion.MedioCaptacionId.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un medio de captación.";
            $scope.clasePresupuesto.paso1.captacion = "dropdownlistModalError";
        }
        else
        {
             $scope.clasePresupuesto.paso1.captacion = "dropdownlistModal";
            
            if($scope.presupuesto.Persona.MedioCaptacion.MedioCaptacionId == "0")
            {
                if(medioInvalido)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El nombre de medio de captación solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
                    $scope.clasePresupuesto.paso1.otro = "entradaError";
                }
                else
                {
                    $scope.clasePresupuesto.paso1.otro = "entrada";
                }
            }
        }
        
        if($scope.presupuesto.Persona.UnidadNegocio.length == 0 && $rootScope.permisoOperativo.verTodosCliente)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar al menos una Unidad de negocio del cliente.";
        }
        
        var telefono = false;
        
        if($scope.presupuesto.Persona.Contacto !== undefined)
        {
            for(var k=0; k<$scope.presupuesto.Persona.Contacto.length; k++)
            {
                if($scope.presupuesto.Persona.Contacto[k].MedioContacto.MedioContactoId == "2")
                {
                    telefono = true;
                    break;
                }
            }
        }
        
        if(!telefono)
        {
            for(var k=0; k<$scope.presupuesto.Persona.NuevoContacto.length; k++)
            {
                if($scope.presupuesto.Persona.NuevoContacto[k].MedioContacto.MedioContactoId == "2")
                {
                    telefono = true;
                    break;
                }
            }
        }
        
        if(!telefono)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de ingresar al menos un número telefónico.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        
        
        for(var k=0; k<$scope.presupuesto.Persona.NuevoContacto.length; k++)
        {
            var repetido = false;
            for(var i=0; i<$scope.presupuesto.Persona.NuevoContacto.length; i++)
            {
                if(i<k && $scope.presupuesto.Persona.NuevoContacto[k].Contacto == $scope.presupuesto.Persona.NuevoContacto[i].Contacto)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*" + $scope.presupuesto.Persona.NuevoContacto[k].Contacto + " se repite.";
                    repetido = true;
                    break;
                }
            }
            
            if($scope.presupuesto.Persona.Contacto !== undefined && !repetido)
            {
                for(var i=0; i<$scope.presupuesto.Persona.Contacto.length; i++)
                {
                    if($scope.presupuesto.Persona.NuevoContacto[k].Contacto == $scope.presupuesto.Persona.Contacto[i].Contacto)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*" + $scope.presupuesto.Persona.NuevoContacto[k].Contacto + " se repite.";
                        break;
                    }
                }
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.GoToPeople = function()
    {
        if($scope.presupuesto.Persona.Nombre.length > 0 && $scope.presupuesto.Persona.PrimerApellido.length > 0)
        {
            $scope.GetBuscarPersona();
        }
    };
    
    $scope.CambiarMedioCaptacion = function(medio)
    {
        if(medio == 'otro')
        {
            $scope.presupuesto.Persona.MedioCaptacion.MedioCaptacionId = "0";
            $scope.presupuesto.Persona.MedioCaptacion.Nombre = "Otro";
            
        }
        else
        {
            $scope.presupuesto.Persona.MedioCaptacion = medio;
        }
    };
    
    $scope.SeleccionarPersona = function(persona)
    {
        for(var k=0; k<$scope.persona.length; k++)
        {
            if($scope.persona[k].PersonaId != persona.PersonaId)
            {
                $scope.persona[k].Seleccionado = false;
            }
        }
        
        if(persona.Seleccionado)
        {
            $scope.presupuesto.Persona = $scope.SetPersona(persona);
            $scope.GetMedioContactoPersona(persona.PersonaId);
            $scope.GetDireccionPersona(persona.PersonaId);
            $scope.GetUnidadNegocioPersona(persona.PersonaId);
            $scope.GetProyectoPersona(persona.PersonaId);
            $scope.GetPromocionPersona(persona.PersonaId);
            
            $scope.personaSeleccionada = true;
            
            $scope.mensajeError = [];
            $scope.clasePresupuesto = {
                                    paso1:{nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"},
                                    paso2:{tipoProyecto: "dropdownlistModal"},
                                };
        }
        else
        {
            $scope.presupuesto.Persona = new Persona();
            $scope.presupuesto.Persona.NuevoContacto = [];
            $scope.presupuesto.Persona.NuevoDomicilio = [];
            $scope.presupuesto.Persona.UnidadNegocio = [];
            
            $scope.personaSeleccionada = false;
            
            for(var k=0; k<$scope.unidadNegocio.length; k++)
            {   
                if($scope.unidadNegocio[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                {
                    $scope.presupuesto.Persona.UnidadNegocio[0] = $scope.unidadNegocio[k];
                    $scope.unidadNegocio[k].show = false;
                }
                else
                {
                    $scope.unidadNegocio[k].show = true;
                }
            }
        }
        
        $scope.ProyectoNuevoRegistrado("Nuevo");
    };
        
    $scope.SetPersona = function(data)
    {
        var persona = new Persona();
        
        persona.PersonaId = data.PersonaId;
        persona.Nombre = data.Nombre;
        persona.PrimerApellido = data.PrimerApellido;
        persona.SegundoApellido = data.SegundoApellido;
        
        if(data.MedioCaptacionId == "0")
        {
            persona.NombreMedioCaptacion = data.NombreMedioCaptacion;
            persona.MedioCaptacion.Nombre = "Otro";
        }
        else
        {
            persona.MedioCaptacion.Nombre = data.NombreMedioCaptacion;
        }
        
        persona.MedioCaptacion.MedioCaptacionId = data.MedioCaptacionId;
        persona.NuevoContacto = $scope.presupuesto.Persona.NuevoContacto;
        persona.NuevoDomicilio = $scope.presupuesto.Persona.NuevoDomicilio;
        persona.UnidadNegocio = $scope.presupuesto.Persona.UnidadNegocio;
        
        return persona;
    };
    
    $scope.AgregarUnidadNegocio = function(unidad)
    {
        $scope.presupuesto.Persona.UnidadNegocio.push(unidad);
        
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if(unidad.UnidadNegocioId == $scope.unidadNegocio[k].UnidadNegocioId)
            {
                $scope.unidadNegocio[k].show = false;
                break;
            }
        }
    };
    
    $scope.QuitarUnidadNegocio = function(unidad)
    {
        for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
        {
            if(unidad.UnidadNegocioId == $scope.presupuesto.Persona.UnidadNegocio[k].UnidadNegocioId)
            {
                $scope.presupuesto.Persona.UnidadNegocio.splice(k,1);
                break;
            }
        }
        
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if(unidad.UnidadNegocioId == $scope.unidadNegocio[k].UnidadNegocioId)
            {
                $scope.unidadNegocio[k].show = true;
                break;
            }
        }
    };
    
    $scope.MostrarContenido = function(contenido)
    {
        if(contenido == "contacto")
        {
            $scope.mostrarContenido.contacto = !$scope.mostrarContenido.contacto;
        }
        else if(contenido == "direccion")
        {
            $scope.mostrarContenido.direccion = !$scope.mostrarContenido.direccion;
        }
        else if(contenido == "unidad")
        {
            $scope.mostrarContenido.unidad = !$scope.mostrarContenido.unidad;
        }
    };
    
    $scope.AgregarMedioContacto = function()
    {
        MEDIOCONTACTO.AgregarMedioContacto("Proyecto");
    };
    
    $scope.$on('MedioContactoAgregado',function()
    {
        $scope.presupuesto.Persona.NuevoContacto.push(MEDIOCONTACTO.GetMedioContacto());
    });
    
    $scope.EditarContactoAgregado = function(contacto, tipo)
    {
        $scope.tipoEditar = tipo;
        if(tipo == "Nuevo")
        {
            $scope.nuevoContacto = contacto;
            MEDIOCONTACTO.EditarMedioContacto(contacto, "Proyecto");
        }
        else if(tipo == "Registrado")
        {
            $scope.nuevoContacto = contacto;
            MEDIOCONTACTO.EditarMedioContactoRegistrado(contacto, "Proyecto");
        }
        
    };
    
    $scope.$on('MedioContactoEditado',function()
    {
        if($scope.tipoEditar == "Nuevo")
        {
            for(var k=0; k<$scope.presupuesto.Persona.NuevoContacto.length; k++)
            {
                if($scope.presupuesto.Persona.NuevoContacto[k] == $scope.nuevoContacto)
                {
                    $scope.presupuesto.Persona.NuevoContacto[k] = MEDIOCONTACTO.GetMedioContacto();
                }
            }
        }
        else if($scope.tipoEditar == "Registrado")
        {
            $scope.GetMedioContactoPersona($scope.presupuesto.Persona.PersonaId);
        }
    });
    
    $scope.BorrarContactoAgregado = function(contacto)
    {
        for(var k=0; k<$scope.presupuesto.Persona.NuevoContacto.length; k++)
        {
            if(contacto == $scope.presupuesto.Persona.NuevoContacto[k])
            {
                $scope.presupuesto.Persona.NuevoContacto.splice(k,1);
                break;
            }
        }
        
    };
    
    $scope.MostrarMedioContacto = function(id)
    {
        return parseInt(id) > 0;
    };
    
    /*------------------------ Paso 2 ---------------------*/
    $scope.AnteriorPresupuesto = function()
    {
        $scope.mensajeError = [];
        $scope.clasePresupuesto = {
                            paso1:{nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"},
                            paso2:{tipoProyecto: "dropdownlistModal"},
                      };
        
        if($scope.pasoPresupuesto == 7)
        {
            if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
            {
                $scope.pasoPresupuesto--;
            }
            else
            {
                $scope.pasoPresupuesto = 3;
            }
        }
        else if($scope.pasoPresupuesto == 8)
        {
            if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado)
            {
                for(var k=0; k<$scope.tipoCubierta.length; k++)
                {
                    if($scope.tipoCubierta[k].TipoCubiertaId == "1")
                    {
                        if($scope.tipoCubierta[k].PorDefecto)
                        {
                            $scope.pasoPresupuesto--;
                        }
                        else
                        {
                            if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
                            {
                                $scope.pasoPresupuesto = 6;
                            }
                            else
                            {
                                $scope.pasoPresupuesto = 3;
                            }
                        }
                    }
                }
            }
            else
            {
                if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
                {
                    $scope.pasoPresupuesto = 6;
                }
                else
                {
                    $scope.pasoPresupuesto = 3;
                }
            }
        }
        
        else if($scope.pasoPresupuesto == 9)
        {
            if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado || $scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
            {
                if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
                {
                    for(var k=0; k<$scope.tipoCubierta.length; k++)
                    {
                        if($scope.tipoCubierta[k].TipoCubiertaId == "2")
                        {
                            if($scope.tipoCubierta[k].PorDefecto)
                            {
                                $scope.pasoPresupuesto--;
                                return;
                            }
                            else
                            {
                                $scope.pasoPresupuesto = 7;
                            }
                        }
                    }
                }
                else
                {
                    $scope.pasoPresupuesto = 7;
                }
            }
            else
            {
                if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
                {
                    $scope.pasoPresupuesto = 6;
                }
                else
                {
                    $scope.pasoPresupuesto = 3;
                }
            }
        }
        else
        {
            $scope.pasoPresupuesto--;
        }
            
    };
   
    
    $scope.AgregarDomicilio = function()
    {
        DOMICILIO.AgregarDomicilio("Proyecto");
    };
    
    $scope.$on('DomicilioAgregadoProyecto',function()
    {
        var domicilio = DOMICILIO.GetDomicilio();
        domicilio.Seleccionado = false;
        $scope.presupuesto.Persona.NuevoDomicilio.push(domicilio);
    });
    
    $scope.BorrarDomicilioAgregado = function(domicilio)
    {
        for(var k=0; k<$scope.presupuesto.Persona.NuevoDomicilio.length; k++)
        {
            if($scope.presupuesto.Persona.NuevoDomicilio[k] == domicilio)
            {
                $scope.presupuesto.Persona.NuevoDomicilio.splice(k,1);
                break;
            }
        }
    };
    
    $scope.EditarDomicilioAgregado = function(domicilio, tipo)
    {
        $scope.operacionDomicilio = tipo;
        $scope.operacionDomicilioEditar = domicilio;
        
        if(tipo == "Nuevo")
        {
            DOMICILIO.EditarDomicilioNuevo(domicilio, "Proyecto");
        }
        
        if(tipo == "Registrado")
        {
            DOMICILIO.EditarDomicilioRegistrado(domicilio, "Proyecto");
        }
    };
    
    $scope.$on('DomicilioEditado',function()
    {
        if( $scope.operacionDomicilio == "Nuevo")
        {
            for(var k=0; k<$scope.presupuesto.Persona.NuevoDomicilio.length; k++)
            {
                if($scope.operacionDomicilioEditar == $scope.presupuesto.Persona.NuevoDomicilio[k])
                {
                    $scope.presupuesto.Persona.NuevoDomicilio[k] = DOMICILIO.GetDomicilio();
                }
            }
        }
        else if($scope.operacionDomicilio == "Registrado")
        {
            $scope.GetDireccionPersona($scope.presupuesto.Persona.PersonaId);
        }
        
    });
    
    $scope.SeleccionarDomicilio = function(domicilio)
    {
        for(var k=0; k<$scope.presupuesto.Persona.NuevoDomicilio.length; k++)
        {
            if($scope.presupuesto.Persona.NuevoDomicilio[k] != domicilio)
            {
                $scope.presupuesto.Persona.NuevoDomicilio[k].Seleccionado = false; 
            }
        }
        
        if($scope.presupuesto.Persona.Domicilio !== undefined)
        {
            for(var k=0; k<$scope.presupuesto.Persona.Domicilio.length; k++)
            {
                if($scope.presupuesto.Persona.Domicilio[k] != domicilio)
                {
                    $scope.presupuesto.Persona.Domicilio[k].Seleccionado = false; 
                }
                else
                {
                    $scope.presupuesto.Proyecto.Domicilio =  domicilio;
                    $scope.presupuesto.Proyecto.Domicilio.DomicilioId =  domicilio.DireccionPersonaId;
                }
            }
        }
        
        if(domicilio.Seleccionado)
        {
            $scope.presupuesto.Domicilio = domicilio;
            
            $scope.GetMargenDireccion(domicilio);
            
            /*for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
            {
                $scope.presupuesto.Persona.UnidadNegocio[k].MargenSel = false;
            }
            
            $scope.unidadResponsable = false;*/
        }
        else
        {
            $scope.presupuesto.Domicilio = new Object();
            $scope.presupuesto.Domicilio.DomicilioId = "Unidad";
            $scope.presupuesto.Proyecto.Domicilio.DomicilioId = null; 
            
            $scope.presupuesto.Margen = -1;
            
            if($rootScope.permisoOperativo.verTodosCliente)
            {
                if($scope.presupuesto.Persona.UnidadNegocio.length == 1)
                {
                    $scope.presupuesto.Domicilio.UnidadNegocioId = $scope.presupuesto.Persona.UnidadNegocio[0].UnidadNegocioId;
                }
            }
            else
            {
                 $scope.presupuesto.Domicilio.DireccionPersonaId =  domicilio.DireccionPersonaId;
                 $scope.presupuesto.Domicilio.UnidadNegocioId = $scope.usuario.UnidadNegocioId;
            }
            $scope.margenDireccion = true;
            $scope.SetMargenUnidadSel();
        }
    };
    
    $scope.DetalleDomicilio = function(domicilio)
    {
        DOMICILIO.VerDomicilio(domicilio);
    };
    
    $scope.TerminarPaso2 = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if($scope.presupuesto.Proyecto.TipoProyecto.TipoProyectoId.length == 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de proyecto."; 
            $scope.clasePresupuesto.paso2.tipoProyecto = "dropdownlistModalError";
            
        }
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Indica el nombre del proyecto."; 
        }
        
        if($scope.presupuesto.Persona.UnidadNegocio.length > 1 && $rootScope.permisoOperativo.verTodosCliente)
        {
            var sel = false;
            for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
            {
                if($scope.presupuesto.Persona.UnidadNegocio[k].MargenSel == true)
                {
                    sel =  true;
                    break;
                }
            }
            if(!sel)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona la unidad de negocio responsable."; 
            }
        }
        
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        else
        {
            if($scope.ObtenerMargenTerritorio())
            {
                //console.log($scope.presupuesto.Margen);
                $scope.clasePresupuesto.paso2.tipoProyecto = "dropdownlistModal";
                $scope.pasoPresupuesto++;
                $scope.GetCombincacionInicio();
                
                $scope.SetIVAPresupuesto();
                
                if($scope.proyectoNuevo)
                {
                    $scope.presupuesto.Proyecto.ProyectoId = "-1";
                }
            }
            else
            {
                return;
            }
        }
    };
    
    $scope.SetIVAPresupuesto = function()
    {
        if($scope.presupuesto.Proyecto.TipoProyecto.IVA)
        {
            if(!$scope.presupuesto.Proyecto.TipoProyecto.LibreIVA)
            {
                if(!$scope.iva.Incluye)
                {
                    $scope.presupuesto.iva = $scope.iva.IVA;
                }
                else
                {
                    $scope.presupuesto.iva = 0;
                }
            }
            else
            {
                $scope.presupuesto.iva = 0;
            }
        }
        else
        {
            $scope.presupuesto.iva = 0;
        }
        
    };
    
    $scope.ObtenerMargenTerritorio = function()
    {
        if($scope.presupuesto.Margen < 0 || $scope.presupuesto.Margen === undefined || $scope.presupuesto.Margen === null )
        {
            if($scope.presupuesto.Persona.UnidadNegocio.length == 1)
            {
                $scope.presupuesto.Margen = parseFloat($scope.presupuesto.Persona.UnidadNegocio[0].Margen);
                $scope.presupuesto.Persona.UnidadNegocio[0].MargenSel = true;
                return true;
            }
            else
            {
                if($rootScope.permisoOperativo.verTodosCliente)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una unidad de negocio responsable de este proyecto.";
                    return false;
                }
                else
                {
                    for(var k=0; k<$scope.unidadNegocio.length; k++)
                    {
                          if($scope.unidadNegocio[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                          {
                              $scope.presupuesto.Margen = parseFloat($scope.unidadNegocio[k].Margen);
                              break;
                          }
                    }
                    
                    for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
                    {
                        if($scope.presupuesto.Persona.UnidadNegocio[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                        {
                            $scope.presupuesto.Persona.UnidadNegocio[k].MargenSel = true; 
                        }
                        else
                        {
                            $scope.presupuesto.Persona.UnidadNegocio[k].MargenSel = false; 
                        }
                    }
                    
                    return true;
                }
            }
        }
        else
        {
            return true;
        }
    };
    
    $scope.CambiarMargenPresupuesto = function(id, sel)
    {
        if(sel)
        {
            if($scope.margenDireccion != false)
            {
                for(var k=0; k<$scope.unidadNegocio.length; k++)
                {
                    if($scope.unidadNegocio[k].UnidadNegocioId == id)
                    {
                        $scope.presupuesto.Margen = parseFloat($scope.unidadNegocio[k].Margen);
                        break;
                    }
                }
            }

            for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
            {
                if($scope.presupuesto.Persona.UnidadNegocio[k].UnidadNegocioId != id)
                {
                    $scope.presupuesto.Persona.UnidadNegocio[k].MargenSel = false;
                }

            }
            
        }
        else
        {
            if($scope.margenDireccion != false)
            {
                $scope.presupuesto.Margen = -1;
            }
        }
        
        $scope.unidadResponsable = true;
    };
    
    $scope.CambiarProyectoPersona = function(proyecto)
    {
        if($scope.proyectoPresupuesto != proyecto)
        {
            $scope.proyectoPresupuesto = proyecto;
            
            for(var k=0; k<$scope.tipoProyecto.length; k++)
            {
                if($scope.tipoProyecto[k].TipoProyectoId == proyecto.TipoProyecto.TipoProyectoId)
                {
                    $scope.CambiarTipoProyecto($scope.tipoProyecto[k]);
                    break;
                }
            }
            
            //console.log(proyecto.Domicilio);
            if(proyecto.Domicilio !== null && proyecto.Domicilio !== undefined)
            {
                for(var k=0; k<$scope.presupuesto.Persona.Domicilio.length; k++)
                {
                    //console.log($scope.presupuesto.Persona.Domicilio[k].DireccionPersonaId);
                    if(proyecto.Domicilio.DireccionPersonaId == $scope.presupuesto.Persona.Domicilio[k].DireccionPersonaId)
                    {
                        $scope.presupuesto.Persona.Domicilio[k].Seleccionado = true;
                        $scope.SeleccionarDomicilio($scope.presupuesto.Persona.Domicilio[k]);
                        break;
                    }
                }
            }
            else
            {
                var domiciolio = new Domicilio();
                domiciolio.DomicilioId = "-1";
                domiciolio.Seleccionado = false;
                $scope.SeleccionarDomicilio(domiciolio);
            }
            
            
            $scope.presupuesto.Proyecto.ProyectoId = proyecto.ProyectoId;
            $scope.presupuesto.Proyecto.Nombre = proyecto.Nombre;
            
            for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
            {
                if($scope.presupuesto.Persona.UnidadNegocio[k].UnidadNegocioId == proyecto.UnidadNegocioId)
                {
                    $scope.presupuesto.Persona.UnidadNegocio[k].MargenSel = true;
                    $scope.SetMargenUnidadSel();
                }
                else
                {
                    $scope.presupuesto.Persona.UnidadNegocio[k].MargenSel = false;
                }
            }
        }
    };
    
    $scope.CambiarTipoProyecto = function(tipo)
    {
        $scope.presupuesto.Proyecto.TipoProyecto = tipo;
    };
    
    $scope.ProyectoNuevoRegistrado = function(val)
    {
        if($scope.EstatusProyecto != val)
        {
            $scope.EstatusProyecto = val;
            $scope.presupuesto.Proyecto = new Proyecto();
            
            if(val == "Nuevo")
            {
                //console.log("entra");
                $scope.proyectoNuevo = true;
                $scope.proyectoPresupuesto = new Proyecto();
            }
            else if("Registrado")
            {
                $scope.proyectoNuevo = false;
            }            
        }
    };
    
    /*------------------------------------------------- Paso 3 -----------------------------------------------*/
    $scope.GetClasePaso = function(paso)
    {
        
        if(paso > 1 && paso <5)
        {
            if(!$scope.presupuesto.Proyecto.TipoProyecto.Mueble)
            {
                return "negro";
            }
        }
        
        if(paso == 5)
        {
            if(!($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado || $scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra))
            {
                return "negro";
            }
        }
        
        if(paso <= ($scope.pasoPresupuesto -2))
        {
            return "active";
        }
        else
        {
            return "";
        }
    };
    
    $scope.GetClaseLineaPaso = function()
    {
        switch($scope.pasoPresupuesto - 2)
        {
            case 1:
                return "paso1";
            case 2:
                return "paso2";
            case 3:
                return "paso3";
            case 4:
                return "paso4";
            case 5:
                return "paso5";
            case 6:
                return "paso6";
            default:
                return "";
        }
    };
    
    $scope.TerminarPaso3 = function()
    {
        //console.log($scope.presupuesto.Margen);
        if(!$scope.ValidarPaso3())
        {
            return;
        }
        else
        {
            if($scope.operacion == "Editar" || $scope.opt == "AgregarPresupuesto")
            {
                if(!$scope.ObtenerMargenTerritorio())
                {
                    return;
                }
                else
                {
                    $scope.SetIVAPresupuesto();
                }
                //console.log($scope.presupuesto.Margen);
            }
            
            if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
            {
                $scope.GetModuloInicio();
                $scope.pasoPresupuesto++;
            }
            else
            {
                if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado)
                {
                    for(var k=0; k<$scope.tipoCubierta.length; k++)
                    {
                        if($scope.tipoCubierta[k].TipoCubiertaId == "1")
                        {
                            if($scope.tipoCubierta[k].PorDefecto)
                            {
                                $scope.pasoPresupuesto = 7;
                            }
                            else
                            {
                                $scope.pasoPresupuesto = 8;
                            }
                        }
                    }
                }
                else
                {
                    $scope.pasoPresupuesto = 8;
                }
                
                $scope.GetCubiertaInicio();
            }
        }
    };
    
    $scope.ValidarPaso3 = function()
    {
        $scope.mensajeError = [];
        
        //var seleccion = false;
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            /*for(var k=0; k<$scope.combinacion.length; k++)
            {
                if($scope.combinacion[k].Activo && $scope.combinacion[k].PorDefecto)
                {
                    seleccion = true;
                    break;
                }
            }

            if(!seleccion)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona al menos una combinación.";
            }*/
            
            var com = alasql('SELECT * FROM ? WHERE Activo = true AND PorDefecto = true GROUP BY TipoCombinacionId ', [$scope.combinacion]);
            
            if(com.length > 1)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Solo puedes seleccionar combinaciones del mismo tipo.";
            }
            else if(com.length == 1)
            {
                if(com[0].CombinacionMaterialId != undefined)
                {
                    if($scope.operacion == "Agregar" && $scope.opt != "Clonar")
                    {
                        $scope.presupuesto.DescripcionCliente = com[0].TipoCombinacion.Descripcion;
                    }
                }
                else
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona al menos una combinación.";
                }
            }
        }
        
        seleccion = false;
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado || $scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            for(var k=0; k<$scope.tipoCubierta.length; k++)
            {
                if($scope.tipoCubierta[k].PorDefecto && $scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra && $scope.tipoCubierta[k].TipoCubiertaId == "2")
                {
                    seleccion = true;
                    break;
                }
                
                if($scope.tipoCubierta[k].PorDefecto && $scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado && $scope.tipoCubierta[k].TipoCubiertaId == "1")
                {
                    seleccion = true;
                    break;
                }
            }

            if(!seleccion)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona al menos un tipo de cubierta.";
            }
        }
        
        if($scope.presupuesto.Persona.UnidadNegocio.length > 1 && $rootScope.permisoOperativo.verTodosCliente && ($scope.operacion == 'Editar' || $scope.opt == 'AgregarPresupuesto'))
        {
            var sel = false;
            for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
            {
                if($scope.presupuesto.Persona.UnidadNegocio[k].MargenSel == true)
                {
                    sel =  true;
                    break;
                }
            }
            if(!sel)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona la unidad de negocio responsable."; 
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    /*------------------------------------------------- Paso 4 -----------------------------------------------*/
    $scope.ValidarModulos = function(modulo)
    {
        for(var i=0; i<$scope.modulo.length; i++)
        {
            for(var j=0; j<$scope.modulo[i].Medida.length; j++)
            {
                $scope.modulo[i].Medida[j].show = true;
                
                for(var k=0; k<modulo.length; k++)
                {
                    if($scope.modulo[i].ModuloId == modulo[k].ModuloId)
                    {
                        if($scope.modulo[i].Medida[j].Ancho == modulo[k].Ancho && $scope.modulo[i].Medida[j].Alto == modulo[k].Alto && $scope.modulo[i].Medida[j].Profundo == modulo[k].Profundo)
                        {
                            $scope.modulo[i].Medida[j].show = false;
                            break;
                        }
                    }
                }
            }
        }
        
        //console.log($scope.modulo);
    };
    
    $scope.CambiarTipoModulo = function(tipo)
    {
        if($scope.moduloAgregar.TipoModulo.TipoModuloId != tipo.TipoModuloId)
        {
            $scope.moduloAgregar = new ModuloPresupuesto();
            $scope.moduloAgregar.TipoModulo = tipo;
        }
    };
    
    $scope.CambiarModulo = function(modulo)
    {
        if($scope.moduloAgregar.ModuloId != modulo.ModuloId)
        {
            $scope.moduloAgregar.ModuloId = modulo.ModuloId;
            $scope.moduloAgregar.Nombre = modulo.Nombre;
            
            $scope.moduloAgregar.Medida = modulo.Medida;
            $scope.moduloAgregar.Ancho = "";
            $scope.moduloAgregar.Alto = "";
            $scope.moduloAgregar.Profundo = "";
            
            $scope.moduloAgregar.Desperdicio = modulo.Desperdicio;
            $scope.moduloAgregar.Margen = modulo.Margen;
            
            //console.log(modulo);
            
            //Ir por imagen
            $scope.GetModuloImagen($scope.moduloAgregar);
        }
    };
    
    $scope.CambiarAncho = function(ancho)
    {
        if($scope.moduloAgregar.Ancho != ancho)
        {
            $scope.moduloAgregar.Ancho = ancho;
            $scope.moduloAgregar.Alto = "";
            $scope.moduloAgregar.Profundo = "";
            
            
            $scope.moduloAgregar.AnchoNumero = FraccionADecimal(ancho);
        }
    };
    
    $scope.CambiarAlto = function(alto)
    {
        if($scope.moduloAgregar.Alto != alto)
        {
            $scope.moduloAgregar.Alto = alto;
            $scope.moduloAgregar.Profundo = "";
            
            $scope.moduloAgregar.AltoNumero= FraccionADecimal(alto);
        }
    };
    
    $scope.CambiarProfundo = function(profundo)
    {
        if($scope.moduloAgregar.Profundo != profundo)
        {
            $scope.moduloAgregar.Profundo = profundo;
            
            $scope.moduloAgregar.ProfundoNumero = FraccionADecimal(profundo);
        }
    };
    
    $scope.AgregarModulo = function(cantidad)
    {
        $scope.presupuesto.Modulo.push($scope.SetModuloNuevo($scope.moduloAgregar, cantidad));
        
        $scope.presupuesto.Modulo = alasql("SELECT * FROM ? ORDER BY AnchoNumero, AltoNumero, ProfundoNumero", [$scope.presupuesto.Modulo]);
        
        $scope.HideMedida($scope.moduloAgregar);
        $scope.GetTipoModuloCantidad();
        
        $scope.moduloAgregar.Ancho = "";
        $scope.moduloAgregar.Alto = "";
        $scope.moduloAgregar.Profundo = "";
        
    };
    
    $scope.SetModuloNuevo = function(modulo, cantidad)
    {
        var m = new ModuloPresupuesto();
        
        m.Nombre = modulo.Nombre;
        m.ModuloId = modulo.ModuloId;
        m.Ancho = modulo.Ancho;
        m.Alto = modulo.Alto;
        m.Profundo = modulo.Profundo;
        
        m.AnchoNumero = modulo.AnchoNumero;
        m.AltoNumero = modulo.AltoNumero;
        m.ProfundoNumero = modulo.ProfundoNumero;
        
        m.Margen = modulo.Margen;
        m.Desperdicio = modulo.Desperdicio;
        
        m.Cantidad = cantidad;
        
        m.TipoModulo.Nombre = modulo.TipoModulo.Nombre;
        m.TipoModulo.TipoModuloId = modulo.TipoModulo.TipoModuloId;
        
        return m;
    };
    
    $scope.HideMedida = function(medida)
    {
        for(var i=0; i<$scope.modulo.length; i++)
        {
            for(var j=0; j<$scope.modulo[i].Medida.length; j++)
            {
                if($scope.modulo[i].ModuloId == medida.ModuloId)
                {
                    if($scope.modulo[i].Medida[j].Ancho == medida.Ancho && $scope.modulo[i].Medida[j].Alto == medida.Alto && $scope.modulo[i].Medida[j].Profundo == medida.Profundo)
                    {
                        $scope.modulo[i].Medida[j].show = false;
                        return;
                    }
                }
            }
        }
    };
    
    $scope.GetTipoModuloCantidad = function(tipo, cantidad)
    {   
        //console.log($scope.presupuesto.Modulo);
        $scope.tipoModuloAgregar = [];
        var atm = [];
        for(var k=0; k<$scope.presupuesto.Modulo.length; k++)
        {
            var tm = new Object();
            tm.TipoModuloId = $scope.presupuesto.Modulo[k].TipoModulo.TipoModuloId;
            tm.Nombre = $scope.presupuesto.Modulo[k].TipoModulo.Nombre;
            tm.Cantidad = parseInt($scope.presupuesto.Modulo[k].Cantidad);
            atm.push(tm);
        }
        
        $scope.tipoModuloAgregar = alasql("SELECT DISTINCT TipoModuloId, Nombre FROM ?", [atm]);
        
        for(var k=0; k<$scope.tipoModuloAgregar.length; k++)
        {
            $scope.tipoModuloAgregar[k].Cantidad = 0;
            
            for(var i=0; i<atm.length; i++)
            {
                if(atm[i].TipoModuloId == $scope.tipoModuloAgregar[k].TipoModuloId)
                {
                    $scope.tipoModuloAgregar[k].Cantidad += atm[i].Cantidad; 
                }
            }
        }
    };
    
    $scope.AgregarCantidad = function(modulo)
    {
        modulo.Cantidad++;
        $scope.SetTipoModuloCantidad(modulo.TipoModulo, 1);
    };
    
    $scope.ReducirCantidad = function(modulo)
    {
        if((modulo.Cantidad-1) > 0)
        {
            modulo.Cantidad--; 
            $scope.SetTipoModuloCantidad(modulo.TipoModulo, -1);
        }
    };
    
    $scope.QuitarModulo = function(modulo)
    {
        for(var i=0; i<$scope.modulo.length; i++)
        {
            if($scope.modulo[i].ModuloId == modulo.ModuloId)
            {
                for(var j=0; j<$scope.modulo[i].Medida.length; j++)
                {
                    if($scope.modulo[i].Medida[j].Ancho == modulo.Ancho && $scope.modulo[i].Medida[j].Alto == modulo.Alto && $scope.modulo[i].Medida[j].Profundo == modulo.Profundo)
                    {
                        $scope.modulo[i].Medida[j].show = true;
                        break;
                    }
                }
            }
        }
        
        for(var k=0; k<$scope.presupuesto.Modulo.length; k++)
        {
            if(modulo == $scope.presupuesto.Modulo[k])
            {
                $scope.presupuesto.Modulo.splice(k,1);
                break;
            }
        }
        
        $scope.GetTipoModuloCantidad();
    };
    
    $scope.SetTipoModuloCantidad = function(tipo, val)
    {
        for(var k=0; k<$scope.tipoModuloAgregar.length; k++)
        {
            if($scope.tipoModuloAgregar[k].TipoModuloId == tipo.TipoModuloId)
            {
               $scope.tipoModuloAgregar[k].Cantidad += val; 
               break;
            }
        }
    };
    
    
    $scope.TerminarPaso4 = function()
    {
        $scope.GetServicioPuertaInicio();
        $scope.CalcularCantidadesPropuestas();
        $scope.pasoPresupuesto++;
        
        for(var k=0; k<$scope.combinacion.length; k++)
        {
            $scope.combinacion[k].PrecioVentaModulo = 0;
        }
        
        for(var k=0; k<$scope.presupuesto.Modulo.length; k++)
        {
                CalcularCostoModulo($scope.presupuesto.Modulo[k], $scope.combinacion, $scope.presupuesto.Margen, $scope.presupuesto.iva);
        }
        
        /*var docDefinition = 
        { content:[
            
            {text:"Probando tablas\n"},
            {
			     style: 'tableExample',
			     table: {
                     widths: ['*', '*', '*'],
                    body: [
                        [
                            {
                                fillColor: '#262626',
                                color: 'white',
                                text: 'Pino',
                                alignment: 'center'
                            },
                            {
                                fillColor: '#262626',
                                color: 'white',
                                text: 'Alder',
                                alignment: 'center'
                            },
                            {
                                fillColor: '#262626',
                                color: 'white',
                                text: 'Cedro',
                                alignment: 'center'
                            }
                        ],
                        [
                            {
                                text: '$232',
                                alignment: 'center'
                            },
                            {
                                text: '$892',
                                alignment: 'center'
                            },
                            {
                                text: '$203',
                                alignment: 'center'
                            }
                        ],
                        
                    ]
                },

            },
            
            ],
            styles:{
                tableExample: {
			margin: [0, 5, 0, 15]
		},
            }
         
            
        };
        pdfMake.createPdf(docDefinition).download();*/
    };
    
    $scope.CalcularCantidadesPropuestas = function()
    {
        //Set secciones del módulo
        var sqlBase = "Select SeccionModuloId, Nombre, NumeroPiezas, ModuloId, PeinazoVertical, Luz, NumeroEntrepano From ? WHERE ModuloId = '";
        var sql = "";
        
        var sqlBaseConsumible = "Select * From ? WHERE ModuloId = '";
        var sqlBaseComponente = "Select ComponenteId, Cantidad, NombreComponente as Nombre From ? WHERE ModuloId = '";
        var sqlBaseParte = "Select TipoParteId as ParteId , Ancho From ? WHERE ModuloId = '";
            
        
        for(var k=0; k<$scope.presupuesto.Modulo.length; k++)
        {
            //secciones
            sql = sqlBase;
            sql +=  $scope.presupuesto.Modulo[k].ModuloId + "' AND AltoModulo = '" + $scope.presupuesto.Modulo[k].Alto  + "'";
            
            $scope.presupuesto.Modulo[k].Seccion = alasql(sql,[$scope.seccionModulo]);
            
            //consumibles
            sql = sqlBaseConsumible;
            sql +=  $scope.presupuesto.Modulo[k].ModuloId + "'";
            
            $scope.presupuesto.Modulo[k].Consumible = alasql(sql,[$scope.consumible]);
            
            //componentes
            sql = sqlBaseComponente;
            sql +=  $scope.presupuesto.Modulo[k].ModuloId + "'";
            
            $scope.presupuesto.Modulo[k].Componente = alasql(sql,[$scope.componente]);
            
            //parte
            sql = sqlBaseParte;
            sql +=  $scope.presupuesto.Modulo[k].ModuloId + "'";
            
            $scope.presupuesto.Modulo[k].Parte = alasql(sql,[$scope.parteModulo]);
            
            
            //Componentes especiales
            $scope.presupuesto.Modulo[k].ComponenteEspecial = $scope.componenteEspecial;
        }
        
        var sqlBaseCombinacion = "Select * From ? WHERE ComponenteId = '";
        var sqlBasePieza = "Select * FROM ? WHERE ComponenteId = '";
        
        
        sql = "SELECT CombinacionMaterialId FROM ? WHERE Activo = true AND PorDefecto = true ";
        var combinacion = alasql(sql,[$scope.combinacion]);
        
        for(var k=0; k<$scope.presupuesto.Modulo.length; k++)
        {
            for(var i=0; i<$scope.presupuesto.Modulo[k].Componente.length; i++)
            {
                //combinaciones
                $scope.presupuesto.Modulo[k].Componente[i].Combinacion = [];
                
                sql = sqlBaseCombinacion;
                sql +=  ($scope.presupuesto.Modulo[k].Componente[i].ComponenteId + "' AND CombinacionMaterialId = '");
                
                for(var j=0; j<combinacion.length; j++)
                {
                    var sqlCombinacionSeleccionada = sql;
                    sqlCombinacionSeleccionada += (combinacion[j].CombinacionMaterialId + "'");
                    
                    var res = alasql(sqlCombinacionSeleccionada,[$scope.costoCombinacion]);
                    $scope.presupuesto.Modulo[k].Componente[i].Combinacion.push(res[0]);
                }
                
                //piezas
                sql = sqlBasePieza;
                sql +=  $scope.presupuesto.Modulo[k].Componente[i].ComponenteId + "'";

                $scope.presupuesto.Modulo[k].Componente[i].Pieza = alasql(sql,[$scope.pieza]);
            }
            
            for(var i=0; i<$scope.presupuesto.Modulo[k].ComponenteEspecial.length; i++)
            {
                //combinaciones
                sql = sqlBaseCombinacion;
                sql +=  $scope.presupuesto.Modulo[k].ComponenteEspecial[i].ComponenteId + "' AND CombinacionMaterialId = '";

                $scope.presupuesto.Modulo[k].ComponenteEspecial[i].Combinacion = [];
                
                for(var j=0; j<combinacion.length; j++)
                {
                    var sqlCombinacionSeleccionada = sql;
                    sqlCombinacionSeleccionada += (combinacion[j].CombinacionMaterialId + "'");
                    
                    var res = alasql(sqlCombinacionSeleccionada,[$scope.costoCombinacion]);
                    $scope.presupuesto.Modulo[k].ComponenteEspecial[i].Combinacion.push(res[0]);
                }
            }
        }
        
        //Calcular Valores
        $scope.presupuesto.NumeroPuerta = 0;
        $scope.presupuesto.NumeroCajon = 0;
        $scope.presupuesto.NumeroSeccionVacia = 0;
        
        $scope.presupuesto.NumeroVisagra = 0;
        $scope.presupuesto.Superficie = 0;
        
        for(var k=0; k<$scope.presupuesto.Modulo.length; k++)
        {
            //Contar Puertas y cajones
            for(var i=0; i<$scope.presupuesto.Modulo[k].Seccion.length; i++)
            {
                var seccionId = parseInt($scope.presupuesto.Modulo[k].Seccion[i].SeccionModuloId);
                
                var cantidad = 0;
                
                switch(seccionId)
                {
                    case 1:
                        cantidad =  ($scope.presupuesto.Modulo[k].Cantidad * parseInt($scope.presupuesto.Modulo[k].Seccion[i].NumeroPiezas));
                        
                        $scope.presupuesto.NumeroPuerta += cantidad;
                        if(FraccionADecimal($scope.presupuesto.Modulo[k].Seccion[i].Luz) >= 60)
                        {
                            $scope.presupuesto.NumeroVisagra += (3*cantidad);
                        }
                        else
                        {
                            $scope.presupuesto.NumeroVisagra += (2*cantidad);
                        }
                        break;
                        
                    case 2:
                        $scope.presupuesto.NumeroCajon += ($scope.presupuesto.Modulo[k].Cantidad * parseInt($scope.presupuesto.Modulo[k].Seccion[i].NumeroPiezas));
                        break;
                        
                    case 3:
                        $scope.presupuesto.NumeroSeccionVacia += ($scope.presupuesto.Modulo[k].Cantidad * parseInt($scope.presupuesto.Modulo[k].Seccion[i].NumeroPiezas));
                        break;
                    default:
                        break;
                }
            }
            
            $scope.presupuesto.NumeroJaladera = $scope.presupuesto.NumeroPuerta + $scope.presupuesto.NumeroCajon;
            $scope.presupuesto.NumeroRiel = $scope.presupuesto.NumeroCajon;
            
            
            //Superficie
             $scope.presupuesto.Superficie  += (FraccionADecimal($scope.presupuesto.Modulo[k].Alto) * FraccionADecimal($scope.presupuesto.Modulo[k].Ancho) * $scope.presupuesto.Modulo[k].Cantidad * 0.00064517);
            
        }
        
        $scope.presupuesto.Superficie = $scope.presupuesto.Superficie.toFixed(2);
        $scope.presupuesto.CantidadMaqueo = $scope.presupuesto.Superficie;
        
        if($scope.presupuesto.NumeroPuerta === 0)
        {
            $scope.presupuesto.NumeroPuerta = "0";
        }
        if($scope.presupuesto.NumeroCajon === 0)
        {
            $scope.presupuesto.NumeroCajon = "0";
        }
        //console.log($scope.presupuesto);
        
    };
    
   
    
    /*-------------------------  Paso 5 -----------------------------------------*/
    $scope.CambiarTab = function(tab)
    {
        if($scope.tabSeleccionada == tab)
        {
            $scope.tabSeleccionada = "";
        }
        else
        {
            $scope.tabSeleccionada = tab;
        }
    };
    
    $scope.GetClaseTab = function(tab)
    {
        if($scope.tabSeleccionada == tab)
        {
            return "active";
        }
        else
        {
            return "";
        }
    };
    
    $scope.TerminarPaso5 = function()
    {
        if(!$scope.ValidadDatosPaso5())
        {
            return;
        }
        else
        {            
            $scope.SetCombinacionPuerta();
            $scope.pasoPresupuesto++;
            $scope.GetAccesorioInicio();
            
            //Servicios
            for(var k=0; k<$scope.servicio.length; k++)
            {
                if($scope.servicio[k].Activo && $scope.servicio[k].Obligatorio)
                {
                    $scope.servicio[k].CostoTotal = $scope.servicio[k].CostoUnidad*parseFloat($scope.servicio[k].Cantidad);
                    $scope.servicio[k].Subtotal = $scope.servicio[k].CostoTotal + ($scope.servicio[k].CostoTotal*($scope.servicio[k].PrecioVenta/100));
                    //$scope.servicio[k].Subtotal += (($scope.servicio[k].Subtotal*$scope.presupuesto.Margen)/100);
                    $scope.servicio[k].Subtotal += (($scope.servicio[k].Subtotal*$scope.presupuesto.iva)/100);
                    $scope.servicio[k].Subtotal = Math.round($scope.servicio[k].Subtotal);
                }
            }
            
            //precio venta de puertas
            CalcularCostoPuerta($scope.muestrario, $scope.presupuesto.Modulo, $scope.combinacion, $scope.presupuesto.Margen, $scope.presupuesto.iva);
        }
    };
    
    $scope.SetCombinacionPuerta = function()
    {
        var sqlBaseCombinacion = "Select * From ? WHERE ComponentePorPuertaId = '";
        var sql = "";

        sql = "SELECT CombinacionMaterialId FROM ? WHERE Activo = true AND PorDefecto = true ";
        var combinacion = alasql(sql,[$scope.combinacion]);

        for(var k=0; k<$scope.muestrario.length; k++)
        {
            if($scope.muestrario[k].PorDefecto)
            {
                for(var i=0; i<$scope.muestrario[k].Puerta.length; i++)
                {
                    if($scope.muestrario[k].Puerta[i].Activo)
                    {
                        for(var j=0; j<$scope.muestrario[k].Puerta[i].Componente.length; j++)
                        {
                            //combinaciones
                            $scope.muestrario[k].Puerta[i].Componente[j].Combinacion = [];

                            sql = sqlBaseCombinacion;
                            sql +=  ($scope.muestrario[k].Puerta[i].Componente[j].ComponentePorPuertaId + "' AND CombinacionMaterialId = '");

                            for(var l=0; l<combinacion.length; l++)
                            {
                                var sqlCombinacionSeleccionada = sql;
                                sqlCombinacionSeleccionada += (combinacion[l].CombinacionMaterialId + "'");

                                var res = alasql(sqlCombinacionSeleccionada,[$scope.costoCombinacion]);
                                $scope.muestrario[k].Puerta[i].Componente[j].Combinacion.push(res[0]);
                            }
                        }
                    }
                }
            }
        }
        
        //console.log($scope.muestrario);
    };
    
    $scope.ValidadDatosPaso5 = function()
    {
        $scope.mensajeError = [];
        
        
        for(var k=0; k<$scope.servicio.length; k++)
        {
            if($scope.servicio[k].Activo && $scope.servicio[k].Obligatorio)
            {
                if($scope.servicio[k].Cantidad == "" || $scope.servicio[k].Cantidad == undefined)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Escribe una cantidad válida para los servicios seleccionados";
                }
            }
        }
        
        if($scope.presupuesto.NumeroPuerta == "" || $scope.presupuesto.NumeroPuerta == undefined)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El número de puertas debe ser entero.";
        }
        
        if($scope.presupuesto.NumeroCajon == "" || $scope.presupuesto.NumeroCajon == undefined)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El número de cajones debe ser entero.";
        }
        
        var muestrarioSeleccionado = false;
        
        for(var k=0; k<$scope.muestrario.length; k++)
        {
            if($scope.muestrario[k].PorDefecto && $scope.muestrario[k].Activo)
            {
                muestrarioSeleccionado = true;
                break;
            }
        }
        
        if(!muestrarioSeleccionado)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes seleccionar al menos un muestrario de puertas.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };

    $scope.ServicioFocus = function(servicio)
    {
        if(servicio.Obligatorio)
        {
            var id = "servicio" + servicio.ServicioId;
            document.getElementById(id).focus();
        }
        else
        {
            return;
        }
    };
    
    /*-------------------------  Paso 6 -----------------------------------------*/
    $scope.AbrirModalVerImagenes = function(muestrario, index, nombre)
    {
        $scope.nombreMuestrario = nombre;
        $scope.muestrarioVerImagen = muestrario;
        $scope.indiceImagen = index;
        
        $('#ImagenPresupuestoModal').modal('toggle');
    };
    
    $scope.CambiarVerImagen = function(val)
    {
        if(val == 1)
        {
            if(($scope.indiceImagen+1) == $scope.muestrarioVerImagen.length)
            {
                $scope.indiceImagen = 0;
            }
            else
            {
                $scope.indiceImagen++;
            }
        }
        else if(val == -1)
        {
            if(($scope.indiceImagen-1) < 0)
            {
                $scope.indiceImagen = $scope.muestrarioVerImagen.length -1;
            }
            else
            {
                $scope.indiceImagen--;
            }
        }
    };
    
    $('#ImagenPresupuestoModal').keydown(function(e)
    {
        switch(e.which) {
            case 37:
              $scope.CambiarVerImagen(-1);
              $scope.$apply();
              break;
            /*
            case 38: //console.log('up');
            break;
            */
            case 39:
              $scope.CambiarVerImagen(1);
              $scope.$apply();
              break;
            /*
            case 40: //console.log('down');
            break;
            */
            default: return;
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    
    $scope.TerminarPaso6 = function()
    {
        if(!$scope.ValidarPaso6())
        {
            return;
        }
        else
        {
            if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado || $scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
            {
                if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado)
                {
                    for(var k=0; k<$scope.tipoCubierta.length; k++)
                    {
                        if($scope.tipoCubierta[k].TipoCubiertaId == "1")
                        {
                            if($scope.tipoCubierta[k].PorDefecto)
                            {
                                $scope.pasoPresupuesto++;
                            }
                            else
                            {
                                $scope.pasoPresupuesto = 8;
                            }
                        }
                    }
                }
                else
                {
                    $scope.pasoPresupuesto = 8;
                }
                
                $scope.GetCubiertaInicio();
            }
            else
            {
                $scope.pasoPresupuesto = 9;
                $scope.SetTipoCombinacion();
            }
            
            $scope.CalcularPrecioVentaMaqueoAcceosrio();
        }
    };
    
    $scope.CalcularPrecioVentaMaqueoAcceosrio = function()
    {
         //Maqueo
        for(var k=0; k<$scope.maqueo.length; k++)
        {
            if($scope.maqueo[k].Activo && $scope.maqueo[k].PorDefecto)
            {
                $scope.maqueo[k].CostoTotal = $scope.maqueo[k].CostoUnidad*parseFloat($scope.presupuesto.CantidadMaqueo);
                $scope.maqueo[k].Subtotal = $scope.maqueo[k].CostoTotal + ($scope.maqueo[k].CostoTotal*($scope.maqueo[k].Margen/100));
                //$scope.maqueo[k].Subtotal += (($scope.maqueo[k].Subtotal*$scope.presupuesto.Margen)/100);
                $scope.maqueo[k].Subtotal += (($scope.maqueo[k].Subtotal*$scope.presupuesto.iva)/100);
                $scope.maqueo[k].Subtotal = Math.round($scope.maqueo[k].Subtotal);
            }
        }
        
        //Accesorios
        for(var k=0; k<$scope.tipoAccesorio.length; k++)
        {
            $scope.tipoAccesorio[k].showPrecio = false;
            //accesorio Compra - Venta
            if($scope.tipoAccesorio[k].ClaseAccesorio.ClaseAccesorioId == "1" && $scope.tipoAccesorio[k].Presupuesto)
            {
                for(var i=0; i<$scope.tipoAccesorio[k].Muestrario.length; i++)
                {
                    if($scope.tipoAccesorio[k].Muestrario[i].Activo && $scope.tipoAccesorio[k].Muestrario[i].PorDefecto && $scope.tipoAccesorio[k].Muestrario[i].Accesorio.length > 0)
                    {
                        $scope.tipoAccesorio[k].showPrecio = true;
                        
                        $scope.tipoAccesorio[k].Muestrario[i].CostoUnidad = 0;
                        
                        for(var j=0; j<$scope.tipoAccesorio[k].Muestrario[i].Accesorio.length; j++)
                        {
                            if($scope.tipoAccesorio[k].Muestrario[i].Accesorio[j].CostoUnidad > $scope.tipoAccesorio[k].Muestrario[i].CostoUnidad)
                            {
                                $scope.tipoAccesorio[k].Muestrario[i].CostoUnidad = $scope.tipoAccesorio[k].Muestrario[i].Accesorio[j].CostoUnidad;
                            }
                        }
                        
                        $scope.tipoAccesorio[k].Muestrario[i].CostoTotal = $scope.tipoAccesorio[k].Muestrario[i].CostoUnidad*parseInt($scope.tipoAccesorio[k].Cantidad);
                        $scope.tipoAccesorio[k].Muestrario[i].Subtotal = $scope.tipoAccesorio[k].Muestrario[i].CostoTotal + ($scope.tipoAccesorio[k].Muestrario[i].CostoTotal*($scope.tipoAccesorio[k].Muestrario[i].Margen/100));
                        
                        //$scope.tipoAccesorio[k].Muestrario[i].Subtotal += (($scope.tipoAccesorio[k].Muestrario[i].Subtotal*$scope.presupuesto.Margen)/100);
                        $scope.tipoAccesorio[k].Muestrario[i].Subtotal += (($scope.tipoAccesorio[k].Muestrario[i].Subtotal*$scope.presupuesto.iva)/100);
                        $scope.tipoAccesorio[k].Muestrario[i].Subtotal = Math.round($scope.tipoAccesorio[k].Muestrario[i].Subtotal);
                    }
                }
            }
            
            //Accesorio de madera
            if($scope.tipoAccesorio[k].ClaseAccesorio.ClaseAccesorioId == "2" && $scope.tipoAccesorio[k].Presupuesto)
            {
                for(var i=0; i<$scope.tipoAccesorio[k].Muestrario.length; i++)
                {
                    if($scope.tipoAccesorio[k].Muestrario[i].Activo && $scope.tipoAccesorio[k].Muestrario[i].PorDefecto && $scope.tipoAccesorio[k].Muestrario[i].Accesorio.length > 0)
                    {
                        $scope.tipoAccesorio[k].showPrecio = true;
                        
                        $scope.tipoAccesorio[k].Muestrario[i].Combinacion = [];
                        
                        for(var m=0; m<$scope.combinacion.length; m++)
                        {
                            if($scope.combinacion[m].Activo && $scope.combinacion[m].PorDefecto)
                            {
                                var ind = $scope.tipoAccesorio[k].Muestrario[i].Combinacion.length;
                                $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind] = new Object();
                                $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].CombinacionId = $scope.combinacion[m].CombinacionMaterialId;
                                $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Nombre = $scope.combinacion[m].Nombre;
                                $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].CostoUnidad = 0;
                                
                                for(var j=0; j<$scope.tipoAccesorio[k].Muestrario[i].Accesorio.length; j++)
                                {
                                    for(var n=0; n<$scope.tipoAccesorio[k].Muestrario[i].Accesorio[j].Costo.length; n++)
                                    {
                                        if($scope.tipoAccesorio[k].Muestrario[i].Accesorio[j].Costo[n].CombinacionMaterialId == $scope.combinacion[m].CombinacionMaterialId)
                                        {
                                            
                                            var costo = parseFloat($scope.tipoAccesorio[k].Muestrario[i].Accesorio[j].ConsumoUnidad) * parseFloat($scope.tipoAccesorio[k].Muestrario[i].Accesorio[j].Costo[n].CostoUnidad);
                                            if(costo > $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].CostoUnidad)
                                            {
                                               $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].CostoUnidad = costo;
                                            }

                                            break;
                                        }
                                    }
                                    
                                    $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].CostoTotal = $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].CostoUnidad * parseInt($scope.tipoAccesorio[k].Cantidad);
                                    $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Subtotal = $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].CostoTotal + ($scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].CostoTotal*($scope.tipoAccesorio[k].Muestrario[i].Margen/100));
                                
                                    //$scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Subtotal += (($scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Subtotal*$scope.presupuesto.Margen)/100);
                                    $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Subtotal += (($scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Subtotal*$scope.presupuesto.iva)/100);
                                    $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Subtotal = Math.round($scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Subtotal);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        //console.log($scope.tipoAccesorio);
    };
    
    $scope.ValidarPaso6 = function()
    {
        $scope.mensajeError = [];
        var seleccionado = false;
        
        for(var k=0; k<$scope.maqueo.length; k++)
        {
            if($scope.maqueo[k].PorDefecto && $scope.maqueo[k].Color.length > 0 && $scope.maqueo[k].Activo)
            {
                seleccionado = true;
            }
        }
        
        if(!seleccionado)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar al menos un maqueo.";
        }
        
        if($scope.presupuesto.CantidadMaqueo === "" || $scope.presupuesto.CantidadMaqueo === undefined)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe una cantidad válida para el maqueo.";
        }
        
        for(var k=0; k<$scope.tipoAccesorio.length; k++)
        {
            if($scope.tipoAccesorio[k].Presupuesto)
            {
                var muestrarioSeleccionado = false;
                for(var i=0; i<$scope.tipoAccesorio[k].Muestrario.length; i++)
                {
                    if($scope.tipoAccesorio[k].Muestrario[i].PorDefecto && $scope.tipoAccesorio[k].Muestrario[i].Accesorio.length > 0)
                    {
                        muestrarioSeleccionado = true;
                        break;
                    }
                }

                if(!muestrarioSeleccionado)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar al menos un muestrario para " + $scope.tipoAccesorio[k].Nombre + ".";
                }
                
                if($scope.tipoAccesorio[k].Cantidad === "" || $scope.tipoAccesorio[k].Cantidad === undefined)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Escribe una cantidad válida para " + $scope.tipoAccesorio[k].Nombre + ".";
                }
            }
            else
            {
                if($scope.tipoAccesorio[k].Obligatorio)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Debes presupuestar " + $scope.tipoAccesorio[k].Nombre + ".";
                }
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.DescargarInstrucciones = function(tipo)
    {
        GetInstruccionesTipoAccesorio($http, $q, CONFIG, tipo.TipoAccesorioId).then(function(data)
        {
            if(data != [])
            {
                if(data.Instrucciones.length > 0)
                {
                    var url = 'data:application/PDF;base64,' + data.Instrucciones;
                    window.open(url, '_blank');
                }
                else
                {
                    $scope.mensaje = "Este tipo de accesorio no cuenta con instrucciones.";
                    $('#mensajePresupuesto').modal('toggle');
                }
            }

        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.PresupuestoTipoAccesorio = function(tipo)
    {
        if(tipo.Obligatorio)
        {
            tipo.Presupuesto = true;
        }
        else
        {
            tipo.Presupuesto = !tipo.Presupuesto;
        }
        
        
        if(tipo.Presupuesto)
        {
            var muestrarioSeleccionado = false;
            for(var k=0; k<tipo.Muestrario.length; k++)
            {
                if(tipo.Muestrario[k].Activo && tipo.Muestrario[k].Accesorio.length > 0 && tipo.Muestrario[k].PorDefecto)
                {
                    muestrarioSeleccionado = true;
                    break;
                }
            }

            if(!muestrarioSeleccionado)
            {
                $scope.CambiarTab(tipo.Nombre);
            }
            
            $scope.SetFocusElement("Tipo"+tipo.TipoAccesorioId)
        }
        else
        {
            if($scope.tabSeleccionada == tipo.Nombre)
            {
                $scope.tabSeleccionada  = "";
            }
        }
    };
    
    $scope.SetFocusElement = function(id)
    {
        document.getElementById(id).focus();
    };
    
    /*------------------------ Paso 7 -----------------------*/
    $scope.MostrarMaterial = function(grupo)
    {
        if(grupo !== undefined)
        {
            for(var k=0; k<grupo.length; k++)
            {
                if(grupo[k].Grupo.Activo)
                {
                    for(var i=0; i<grupo[k].Color.length; i++)
                    {
                        if(grupo[k].Color[i].Activo)
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.MostarPorUbicacion = function(ubicacion)
    {
        if(ubicacion != undefined && ubicacion != null)
        {
            for(var i=0; i<$scope.ubicacion.length; i++)
            {
                if($scope.ubicacion[i].SeleccionadoAglomerado)
                {
                    for(var j=0; j<ubicacion.length; j++)
                    {
                        if(ubicacion[j].UbicacionCubiertaId == $scope.ubicacion[i].UbicacionCubiertaId)
                        {
                            return true;
                        }
                    }
                }
            }
        }
        
        return false;
    };
    
    $scope.TerminaPaso7 = function()
    {
        
       if($scope.ValidarPaso7())
       {
           if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
            {
                for(var k=0; k<$scope.tipoCubierta.length; k++)
                {
                    if($scope.tipoCubierta[k].TipoCubiertaId == "2")
                    {
                        if($scope.tipoCubierta[k].PorDefecto)
                        {
                            $scope.pasoPresupuesto++;
                        }
                        else
                        {
                            $scope.pasoPresupuesto = 9;
                            $scope.SetTipoCombinacion();
                            $scope.CalcularPrecioVentaCubierta();
                        }
                    }
                }
            }
            else
            {
                $scope.pasoPresupuesto = 9;
                $scope.SetTipoCombinacion();
                $scope.CalcularPrecioVentaCubierta();
            }
        }
    };
    
    $scope.ValidarPaso7 = function()
    {
        $scope.mensajeError = [];
        
        if(!$scope.MotrarMaterialesCubiertaAglomerado())
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar al menos una ubicación.";
        }
        else
        {
            for(var m=0; m<$scope.ubicacion.length; m++)
            {
                //cantidad correcta
                if($scope.ubicacion[m].SeleccionadoAglomerado)
                {
                    if(!$rootScope.erNumeroEntero.test($scope.ubicacion[m].CantidadAglomerado))
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*La cantidad para " + $scope.ubicacion[m].Nombre + " debe ser un número entero.";
                    }
                
                
                    //material para la ubicacion seleccionado
                    var cumple = false;
                    for(var k=0; k<$scope.cubierta.length; k++)
                    {
                        if($scope.cubierta[k].TipoCubierta.TipoCubiertaId == "1" && $scope.cubierta[k].Material.Activo)
                        {
                            for(var i=0; i<$scope.cubierta[k].Grupo.length; i++)
                            {
                                if($scope.cubierta[k].Grupo[i].Grupo.Activo && $scope.cubierta[k].Grupo[i].Color.length > 0 && $scope.cubierta[k].Grupo[i].PorDefecto)
                                {
                                    for(var l=0; l<$scope.cubierta[k].Ubicacion.length; l++)
                                    {
                                        if($scope.cubierta[k].Ubicacion[l].UbicacionCubiertaId == $scope.ubicacion[m].UbicacionCubiertaId)
                                        {
                                            cumple = true;
                                            break;
                                        }
                                    }
                                }

                                if(cumple)
                                    break;
                            }
                        }

                        if(cumple)
                            break;
                    }
                    
                    if(!cumple)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar al menos una material para presupuestar " + $scope.ubicacion[m].Nombre + ".";
                    }
                }
            }
        }
        

        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
        
    };
    
    $scope.MotrarMaterialesCubiertaAglomerado = function()
    {
        for(var k=0; k<$scope.ubicacion.length; k++)
        {
            if($scope.ubicacion[k].SeleccionadoAglomerado === true)
            {
                return true;
            }
        }
        
        return false;
    };

    /*------------------------ Paso 8 -----------------------*/
    $scope.AgregarElementoUbicacion = function(ubicacion)
    {
        ubicacion.MensajeError = "";
        
        if(!((ubicacion.Lado1 === "" || ubicacion.Lado1 === undefined) || (ubicacion.Lado2 === "" || ubicacion.Lado2 === undefined)))
        {
            if(ubicacion.Elemento == undefined)
            {
                ubicacion.Elemento = [];
            }
            
            index = ubicacion.Elemento.length;
            
            ubicacion.Elemento[index] = new Object();
            ubicacion.Elemento[index].Lado1 = ubicacion.Lado1;
            ubicacion.Elemento[index].Lado2 = ubicacion.Lado2;
            
            ubicacion.Lado1 = "";
            ubicacion.Lado2 = "";
        }
        else
        {
            ubicacion.MensajeError = "*Los lados deben ser números fraccionales. Ejemplo: 21, 30 1/4, 24 1/2, etc.";
        }
    };
    
    $scope.QuitarElementoUbicacion = function(ubicacion, index)
    {
        ubicacion.Elemento.splice(index, 1);
    };
    
    $scope.TerminarPaso8 = function()
    {
        if($scope.ValidarPaso8())
        {
            $scope.pasoPresupuesto++;
            $scope.CalcularPrecioVentaCubierta();
        }
    };
    
    $scope.ValidarPaso8 = function()
    {
        $scope.mensajeError = [];
        
        if(!$scope.MotrarMaterialesCubiertaPiedra())
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar al menos una ubicación.";
        }
        else
        {
            for(var m=0; m<$scope.ubicacion.length; m++)
            {
                if($scope.ubicacion[m].Seleccionado === true)
                {
                    if($scope.ubicacion[m].Elemento !== undefined)
                    {
                        if($scope.ubicacion[m].Elemento.length == 0)
                        {
                            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de indicar al menos una sección para " + $scope.ubicacion[m].Nombre + ".";
                        }
                    }
                    else
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*Debes de indicar al menos una sección para " + $scope.ubicacion[m].Nombre + ".";
                    }
                }
            }
            
            //material para la ubicacion seleccionado
            var cumple = false;
            for(var k=0; k<$scope.cubierta.length; k++)
            {
                if($scope.cubierta[k].TipoCubierta.TipoCubiertaId == "2" && $scope.cubierta[k].Material.Activo)
                {
                    for(var i=0; i<$scope.cubierta[k].Grupo.length; i++)
                    {
                        if($scope.cubierta[k].Grupo[i].Grupo.Activo && $scope.cubierta[k].Grupo[i].Color.length > 0 && $scope.cubierta[k].Grupo[i].PorDefecto)
                        {

                            cumple = true;
                            break;
                        }
                    }
                }

                if(cumple)
                    break;
            }

            if(!cumple)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Debes de seleccionar al menos una material para presupuestar las cubiertas de piedra.";
            }
        }
        
        var lados = false;
        for(var m=0; m<$scope.ubicacion.length; m++)
        {
            if($scope.ubicacion[m].Lado1 || $scope.ubicacion[m].Lado2)
            {
                 lados = true;
                 $scope.mensajeError[$scope.mensajeError.length] = "*Tienes una sección pendiente de agregar en " + $scope.ubicacion[m].Nombre + ".";
            }
        }
        
        if(lados)
        {
             $scope.mensajeError[$scope.mensajeError.length] = "*Para pasar al siguiente paso el Lado 1 y el Lado 2 de todas las ubicaciones deben estar vacios.";
        }
    
        
        if($scope.mensajeError.length > 0)
        {
             return false;
        }
        else
        {
            return true;
        }
    };
       
    $scope.MotrarMaterialesCubiertaPiedra = function()
    {
        for(var k=0; k<$scope.ubicacion.length; k++)
        {
            if($scope.ubicacion[k].Seleccionado === true)
            {
                return true;
            }
        }
        
        return false;
    };      
    
    /*----------------------------- Paso 9 -------------------------------------*/
    $scope.TerminarPaso9 = function()
    {
        if($scope.ValidarPaso9())
        {            
            if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
            {
                $scope.pasoPresupuesto++;
            
                if(!$scope.crearBasico)
                {
                    $scope.CrearPresupuestoBasico();
                    $scope.crearBasico = true;
                }
            }
            else if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
            {
                 $scope.pasoPresupuesto = 12;
                 $scope.GetPromoPlanPago();
                 $scope.CalcularTotalPromocion();
            }
            
            if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
            {
                $scope.CalcularPrecioVentaCubiertaPiedra();
            }
            
            if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
            {
                $scope.CalcularPrecioVentaCubiertaAglomerado();
            }
        }
        //$scope.CalcularPrecioVenta();
    };
    
    $scope.ValidarPaso9 = function()
    {
        $scope.mensajeError = [];
        
        if($scope.presupuesto.Titulo !== undefined)
        {
            if($scope.presupuesto.Titulo.length == 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Escribe el título del presupuesto.";
            }
        }
        else
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe el título del presupuesto.";
        }
        
        if($scope.presupuesto.DescripcionCliente !== undefined)
        {
            if($scope.presupuesto.DescripcionCliente.length == 0)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Escribe la descripción del cliente.";
            }
        }
        else
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe la descripción del cliente.";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    
    /*----------------------------- Paso 10 -------------------------------------*/
    $scope.CalcularPrecioVentaCubierta = function()
    {
        /*//console.log($scope.servicio);
        //console.log($scope.maqueo);
        //console.log($scope.tipoAccesorio);
        //console.log($scope.cubierta);
        //console.log($scope.ubicacion);*/

        //console.log($scope.combinacion);
        //console.log($scope.cubierta);
        
        //Limpiar ubicacion grupo cubierta
        for(var j=0; j<$scope.cubierta.length; j++)
        {
            if($scope.cubierta[j].Material.Activo)
            {
                for(var k=0; k<$scope.cubierta[j].Grupo.length; k++)
                {
                    if($scope.cubierta[j].Grupo[k].Grupo.Activo && $scope.cubierta[j].Grupo[k].PorDefecto && $scope.cubierta[j].Grupo[k].Color.length > 0)
                    {
                        $scope.cubierta[j].Grupo[k].Ubicacion = [];
                    }
                }
                    
            }
        }
        
        //Cubierta
        for(var i=0; i<$scope.ubicacion.length; i++)
        {
            //costo de consumibles
            for(var j=0; j<$scope.ubicacion[i].Fabricacion.length; j++)
            {
                $scope.ubicacion[i].Fabricacion[j].Costo = 0;
                
                for(var k=0; k<$scope.ubicacion[i].Fabricacion[j].Consumible.length; k++)
                {
                    $scope.ubicacion[i].Fabricacion[j].Costo += ($scope.ubicacion[i].Fabricacion[j].Consumible[k].Cantidad * $scope.ubicacion[i].Fabricacion[j].Consumible[k].Costo);
                }
            }
            
            //Cantidad de piedra
            if($scope.ubicacion[i].Seleccionado === true)
            {
                $scope.ubicacion[i].CantidadPiedra = 0;
                for(var j=0; j<$scope.ubicacion[i].Elemento.length; j++)
                {
                    $scope.ubicacion[i].CantidadPiedra += (FraccionADecimal($scope.ubicacion[i].Elemento[j].Lado1) * FraccionADecimal($scope.ubicacion[i].Elemento[j].Lado2));
                }
                
                $scope.ubicacion[i].CantidadPiedra  = $scope.ubicacion[i].CantidadPiedra*0.00064516;
            }
            
            //$scope.ubicacion[i].Material = [];
            
            //Costo por material
            for(var j=0; j<$scope.cubierta.length; j++)
            {
                // cubierta de piedra
                if($scope.cubierta[j].TipoCubierta.TipoCubiertaId == "2" && $scope.ubicacion[i].Seleccionado)
                {
                    if($scope.cubierta[j].Material.Activo)
                    {
                        var CantidadTotal = $scope.ubicacion[i].CantidadPiedra + ($scope.ubicacion[i].CantidadPiedra *($scope.cubierta[j].Desperdicio/100));
                    
                        for(var k=0; k<$scope.cubierta[j].Grupo.length; k++)
                        {
                            /*if($scope.cubierta[j].Grupo[k].Ubicacion === undefined)
                            {
                                $scope.cubierta[j].Grupo[k].Ubicacion = [];
                            }*/
                            
                            if($scope.cubierta[j].Grupo[k].Grupo.Activo && $scope.cubierta[j].Grupo[k].PorDefecto && $scope.cubierta[j].Grupo[k].Color.length > 0)
                            {            
                                var ind = $scope.cubierta[j].Grupo[k].Ubicacion.length;
                                $scope.cubierta[j].Grupo[k].Ubicacion[ind] = new Object();
                                $scope.cubierta[j].Grupo[k].Ubicacion[ind].UbicacionId = $scope.ubicacion[i].UbicacionCubiertaId;
                                $scope.cubierta[j].Grupo[k].Ubicacion[ind].NombreUbicacion = $scope.ubicacion[i].Nombre;

                                var CostoTotal = CantidadTotal * $scope.cubierta[j].Grupo[k].CostoUnidad;

                                for(var l=0; l<$scope.ubicacion[i].Fabricacion.length; l++)
                                {
                                    if($scope.ubicacion[i].Fabricacion[l].TipoCubiertaId == "2")
                                    {
                                        $scope.cubierta[j].Grupo[k].Ubicacion[ind].Cantidad = $scope.ubicacion[i].CantidadPiedra; 
                                        $scope.cubierta[j].Grupo[k].Ubicacion[ind].Fabricacion = $scope.ubicacion[i].Fabricacion[l].Costo;
                                        
                                        
                                        CostoTotal += ($scope.ubicacion[i].Fabricacion[l].Costo * $scope.ubicacion[i].CantidadPiedra);
                                        break;
                                    }
                                }
                                
                                var Subtotal = CostoTotal + (CostoTotal*($scope.cubierta[j].Margen/100));
                                //Subtotal += ((Subtotal*$scope.presupuesto.Margen)/100); 
                                Subtotal += ((Subtotal*$scope.presupuesto.iva)/100); 
                                
                                $scope.cubierta[j].Grupo[k].Ubicacion[ind].CostoTotal = CostoTotal;
                                $scope.cubierta[j].Grupo[k].Ubicacion[ind].Subtotal = Math.round(Subtotal);
                                
                                /*var ind2 = $scope.ubicacion[i].Material.length;
                                $scope.ubicacion[i].Material[ind2] = new Object();
                                $scope.ubicacion[i].Material[ind2].Nombre = $scope.cubierta[j].Material.Nombre;
                                $scope.ubicacion[i].Material[ind2].MaterialId = $scope.cubierta[j].Material.MaterialId;
                                $scope.ubicacion[i].Material[ind2].Grupo = $scope.cubierta[j].Grupo[k].Grupo.Nombre;
                                $scope.ubicacion[i].Material[ind2].GrupoId = $scope.cubierta[j].Grupo[k].Grupo.GrupoId;
                                $scope.ubicacion[i].Material[ind2].Subtotal = $scope.cubierta[j].Grupo[k].Ubicacion[ind].Subtotal;*/
                            }
                        }
                    }
                }
                // Cubierta de aglomerado
                else if($scope.cubierta[j].TipoCubierta.TipoCubiertaId == "1" && $scope.ubicacion[i].SeleccionadoAglomerado)
                {
                    if($scope.cubierta[j].Material.Activo)
                    {
                        var CantidadTotal = FraccionADecimal($scope.ubicacion[i].CantidadAglomerado) + (FraccionADecimal($scope.ubicacion[i].CantidadAglomerado) *($scope.cubierta[j].Desperdicio/100));
                    
                        for(var k=0; k<$scope.cubierta[j].Grupo.length; k++)
                        {
                            if($scope.cubierta[j].Grupo[k].Ubicacion === undefined)
                            {
                                primeroAglomerado = false;
                                $scope.cubierta[j].Grupo[k].Ubicacion = [];
                            }
                            
                            var calcularCosto = false;
                            for(var l=0; l<$scope.cubierta[j].Ubicacion.length; l++)
                            {
                                if($scope.cubierta[j].Ubicacion[l].UbicacionCubiertaId == $scope.ubicacion[i].UbicacionCubiertaId)
                                {
                                    calcularCosto = true;
                                    break;
                                }
                            }
                            
                            var ind = $scope.cubierta[j].Grupo[k].Ubicacion.length;
                            $scope.cubierta[j].Grupo[k].Ubicacion[ind] = new Object();
                            $scope.cubierta[j].Grupo[k].Ubicacion[ind].UbicacionId = $scope.ubicacion[i].UbicacionCubiertaId;
                            $scope.cubierta[j].Grupo[k].Ubicacion[ind].NombreUbicacion = $scope.ubicacion[i].Nombre;
                            
                            if($scope.cubierta[j].Grupo[k].Grupo.Activo && $scope.cubierta[j].Grupo[k].PorDefecto && $scope.cubierta[j].Grupo[k].Color.length > 0 && calcularCosto)
                            {            
                                var CostoTotal = CantidadTotal * $scope.cubierta[j].Grupo[k].CostoUnidad;

                                for(var l=0; l<$scope.ubicacion[i].Fabricacion.length; l++)
                                {
                                    if($scope.ubicacion[i].Fabricacion[l].TipoCubiertaId == "1")
                                    {
                                        $scope.cubierta[j].Grupo[k].Ubicacion[ind].Cantidad = $scope.ubicacion[i].CantidadAglomerado; 
                                        $scope.cubierta[j].Grupo[k].Ubicacion[ind].Fabricacion = $scope.ubicacion[i].Fabricacion[l].Costo;
                                        
                                        CostoTotal += ($scope.ubicacion[i].Fabricacion[l].Costo * $scope.ubicacion[i].CantidadAglomerado);
                                        break;
                                    }
                                }

                                var Subtotal = CostoTotal + (CostoTotal*($scope.cubierta[j].Margen/100));
                                //Subtotal += ((Subtotal*$scope.presupuesto.Margen)/100);
                                Subtotal += ((Subtotal*$scope.presupuesto.iva)/100);;
                                
                                $scope.cubierta[j].Grupo[k].Ubicacion[ind].CostoTotal = CostoTotal;
                                $scope.cubierta[j].Grupo[k].Ubicacion[ind].Subtotal = Math.round(Subtotal);
                            }
                            else
                            {
                                $scope.cubierta[j].Grupo[k].Ubicacion[ind].Subtotal = "Sin Valor";
                            }
                        }
                    }
                }
            }
        }
        
        //console.log($scope.ubicacion);
        //console.log($scope.cubierta);
    };
    
    $scope.CrearPresupuestoBasico = function()
    {
        //combinacion
        var index = -1;
        var precio = 99999999999999;
        $scope.combinacionSeleccionada;
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            if(!$scope.crearBasico)
            {
                for(var k=0; k<$scope.combinacion.length; k++)
                {
                    if($scope.combinacion[k].PorDefecto && $scope.combinacion[k].Activo)
                    {
                        if($scope.combinacion[k].PrecioVentaModulo < precio)
                        {
                            index = k;
                            precio = $scope.combinacion[k].PrecioVentaModulo;
                        }
                    }

                    $scope.combinacion[k].Basico = false;
                    $scope.combinacion[k].Presupuesto = false;
                }

                if(index > -1)
                {
                    $scope.combinacion[index].Basico = true;
                    $scope.combinacion[index].Presupuesto = true;
                    $scope.combinacionSeleccionada = $scope.combinacion[index].CombinacionMaterialId;
                }
            }
        
            //puertas
            index = -1;
            precio = 99999999999999;

            for(var k=0; k<$scope.muestrario.length; k++)
            {
                if($scope.muestrario[k].Activo && $scope.muestrario[k].PorDefecto)
                {
                    for(var i=0; i<$scope.muestrario[k].Combinacion.length; i++)
                    {
                        if( $scope.combinacionSeleccionada == $scope.muestrario[k].Combinacion[i].CombinacionMaterialId)
                        {
                            if(precio > $scope.muestrario[k].Combinacion[i].PrecioVenta)
                            {
                                index = k;
                                precio = $scope.muestrario[k].Combinacion[i].PrecioVenta;
                            }
                            break;
                        }
                    }
                }
                $scope.muestrario[k].Basico = false;
                $scope.muestrario[k].Presupuesto = false;
            }

            if(index > -1)
            {
                $scope.muestrario[index].Basico = true;
                $scope.muestrario[index].Presupuesto = true;
            }
        
            //servicio
            for(var k=0; k<$scope.servicio.length; k++)
            {
                if($scope.servicio[k].Obligatorio && $scope.servicio[k].Activo)
                {
                    $scope.servicio[k].Basico = true;
                    $scope.servicio[k].Presupuesto = true;
                }

                else
                {
                     $scope.servicio[k].Basico = false;
                     $scope.servicio[k].Presupuesto = false;
                }
            }

            //maqueo
            index = -1;
            precio = 99999999999999;

            for(var k=0; k<$scope.maqueo.length; k++)
            {
                if($scope.maqueo[k].PorDefecto && $scope.maqueo[k].Activo)
                {
                    if(precio > $scope.maqueo[k].Subtotal)
                    {
                        index = k;
                        precio = $scope.maqueo[k].Subtotal;
                    }
                }

                $scope.maqueo[k].Basico = false;
                $scope.maqueo[k].Presupuesto = false;
            }

            if(index > -1)
            {
                $scope.maqueo[index].Basico = true;
                $scope.maqueo[index].Presupuesto = true;
            }
        
            //Accesorios
            for(var i=0; i<$scope.tipoAccesorio.length; i++)
            {
                if($scope.tipoAccesorio[i].Presupuesto)
                {
                    index = -1;
                    precio = 99999999999999;

                    for(var j=0; j<$scope.tipoAccesorio[i].Muestrario.length; j++)
                    {
                        if($scope.tipoAccesorio[i].Obligatorio && $scope.tipoAccesorio[i].Muestrario[j].PorDefecto && $scope.tipoAccesorio[i].Muestrario[j].Activo && ($scope.tipoAccesorio[i].Muestrario[j].Accesorio.length > 0))
                        {
                            if($scope.tipoAccesorio[i].ClaseAccesorio.ClaseAccesorioId == "1")
                            {
                                if(precio > $scope.tipoAccesorio[i].Muestrario[j].Subtotal)
                                {
                                    index = j;
                                    precio = $scope.tipoAccesorio[i].Muestrario[j].Subtotal;
                                }
                            }

                            if($scope.tipoAccesorio[i].ClaseAccesorio.ClaseAccesorioId == "2")
                            {
                                for(var k=0; k<$scope.tipoAccesorio[i].Muestrario[j].Combinacion.length; k++)
                                {
                                    if($scope.tipoAccesorio[i].Muestrario[j].Combinacion[k].CombinacionMaterialId == $scope.combinacionSeleccionada)
                                    {
                                        if(precio > $scope.tipoAccesorio[i].Muestrario[j].Combinacion[k].Subtotal)
                                        {
                                            index = j;
                                            precio = $scope.tipoAccesorio[i].Muestrario[j].Combinacion[k].Subtotal;
                                        }
                                        break;
                                    }
                                }
                            }
                        }

                        $scope.tipoAccesorio[i].Muestrario[j].Basico = false;
                        $scope.tipoAccesorio[i].Muestrario[j].Presupuesto = false;
                    }

                    if(index > -1)
                    {
                        $scope.tipoAccesorio[i].Muestrario[index].Basico = true;
                        $scope.tipoAccesorio[i].Muestrario[index].Presupuesto = true;
                    }
                }
            }
        }
    };
    
    /*$scope.CambiarCombinacionPresupuesto = function(combinacion)
    {
        for(var k=0; k<$scope.combinacion.length; k++)
        {
                $scope.combinacion[k].Presupuesto = false;
        }
        
        combinacion.Presupuesto = true;
        
        $scope.combinacionSeleccionada = combinacion.CombinacionMaterialId;
        
        //$scope.SetMuestrarioCombinacion(combinacion);
        //$scope.SetAccesorioMaderaCombinacion(combinacion);
    };*/
    
    $scope.CambiarMuestrarioPresupuesto = function(muestrario)
    {
        for(var k=0; k<$scope.muestrario.length; k++)
        {
                $scope.muestrario[k].Presupuesto = false;
        }
        
        muestrario.Presupuesto = true;
    };
    
    $scope.CambiarMaqueoPresupuesto = function(maqueo)
    {
        for(var k=0; k<$scope.maqueo.length; k++)
        {
            $scope.maqueo[k].Presupuesto = false;
        }
        
        maqueo.Presupuesto = true;
    };
    
    $scope.CambiarAccesorioPresupuesto = function (tipo, muestrario)
    {
        if(tipo.Obligatorio)
        {
            if(muestrario.Presupuesto == false)
            {
                muestrario.Presupuesto = true;
                return;
            }
        }
        
        for(var k=0; k<tipo.Muestrario.length; k++)
        {
            if(muestrario.MuestrarioId != tipo.Muestrario[k].MuestrarioId)
            {
                tipo.Muestrario[k].Presupuesto = false;
            }
        }
    };
    
    $scope.MostrarCubiertaSeleccionPresupuesto = function(tipo)
    {
        if(tipo == "2" && $scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            return true;
        }
        else if(tipo == "1" && $scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado)
        {
            return true;
        }
        else
        {
            return false;
        }        
    };
    
    /*$scope.SetMuestrarioCombinacion = function(combinacion)
    {
        for(var k=0; k<$scope.muestrario.length; k++)
        {
            if($scope.muestrario[k].PorDefecto && $scope.muestrario[k].Activo)
            {
                for(var i=0; i<$scope.muestrario[k].Combinacion.length; i++)
                {
                    if($scope.muestrario[k].Combinacion[i].CombinacionMaterialId == combinacion.CombinacionMaterialId)
                    {
                        $scope.muestrario[k].PrecioVenta = $scope.muestrario[k].Combinacion[i].PrecioVenta;
                        break;
                    }
                }
            }
        }
    };
    
    $scope.SetAccesorioMaderaCombinacion = function(combinacion)
    {
        //console.log($scope.tipoAccesorio);
        
        for(var i=0; i<$scope.tipoAccesorio.length; i++)
        {
            if($scope.tipoAccesorio[i].ClaseAccesorio.ClaseAccesorioId == "2")
            {
                for(var j=0; j<$scope.tipoAccesorio[i].Muestrario.length; j++)
                {
                    if($scope.tipoAccesorio[i].Muestrario[j].PorDefecto && $scope.tipoAccesorio[i].Muestrario[j].Activo && ($scope.tipoAccesorio[i].Muestrario[j].Accesorio.length > 0))
                    {
                        for(var k=0; k<$scope.tipoAccesorio[i].Muestrario[j].Combinacion.length; k++)
                        {
                            if($scope.tipoAccesorio[i].Muestrario[j].Combinacion[k].CombinacionId == combinacion.CombinacionMaterialId)
                            {
                                $scope.tipoAccesorio[i].Muestrario[j].Subtotal = $scope.tipoAccesorio[i].Muestrario[j].Combinacion[k].Subtotal;
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
    
    $scope.MostrarServicios = function(servicio)
    {
        var sql = "SELECT COUNT(*) AS num WHERE Activo = true AND Obligatorio = true";
        var num = alasql(sql, [servicio]);
        
        if(num[0].num > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    };*/
    
    $scope.CambiarTipoCubiertaPresupuesto = function(tipo)
    {
        for(var k=0; k<$scope.tipoCubierta.length; k++)
        {
            if(tipo.TipoCubiertaId != $scope.tipoCubierta[k].TipoCubiertaId)
            {
                $scope.tipoCubierta[k].Presupuesto = false;
            }
        }
        
        if(tipo.Presupuesto)
        {
            $scope.tipoCubiertaPresupuesto = tipo.TipoCubiertaId;
        }
        else
        {
            $scope.tipoCubiertaPresupuesto  = "";
        }
        
        $scope.CalcularPrecioVentaCubiertaPiedra();
        $scope.CalcularPrecioVentaCubiertaAglomerado();
    };
    
    $scope.CalcularPrecioVentaCubiertaPiedra = function()
    {
        if($scope.tipoCubiertaPresupuesto  == "2")
        {
            for(var i=0; i<$scope.cubierta.length; i++)
            {
                if($scope.cubierta[i].TipoCubierta.TipoCubiertaId == "2")
                {
                    for(var j=0; j<$scope.cubierta[i].Grupo.length; j++)
                    {
                        if($scope.cubierta[i].Grupo[j].Grupo.Activo && $scope.cubierta[i].Grupo[j].Color.length > 0 && $scope.cubierta[i].Grupo[j].PorDefecto)
                        {
                            var precio = 0;
                            for(var m=0; m<$scope.ubicacion.length; m++)
                            {
                                if($scope.ubicacion[m].Seleccionado && $scope.ubicacion[m].Activo && $scope.ubicacion[m].Presupuesto)
                                {
                                    for(var k=0; k<$scope.cubierta[i].Grupo[j].Ubicacion.length; k++)
                                    {
                                        if($scope.cubierta[i].Grupo[j].Ubicacion[k].UbicacionId == $scope.ubicacion[m].UbicacionCubiertaId)
                                        {
                                            precio += $scope.cubierta[i].Grupo[j].Ubicacion[k].Subtotal;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        $scope.cubierta[i].Grupo[j].Total = precio;
                    }
                }
            }
        }
    }
    
    $scope.CalcularPrecioVentaCubiertaAglomerado = function()
    {
        if($scope.tipoCubiertaPresupuesto  == "1")
        {
            for(var i=0; i<$scope.cubierta.length; i++)
            {
                if($scope.cubierta[i].TipoCubierta.TipoCubiertaId == "1")
                {
                    for(var j=0; j<$scope.cubierta[i].Grupo.length; j++)
                    {
                        if($scope.cubierta[i].Grupo[j].Grupo.Activo && $scope.cubierta[i].Grupo[j].Color.length > 0 && $scope.cubierta[i].Grupo[j].PorDefecto)
                        {
                            var precio = 0;
                            for(var m=0; m<$scope.ubicacion.length; m++)
                            {
                                if($scope.ubicacion[m].SeleccionadoAglomerado && $scope.ubicacion[m].Activo && $scope.ubicacion[m].Presupuesto)
                                {
                                    for(var k=0; k<$scope.cubierta[i].Grupo[j].Ubicacion.length; k++)
                                    {
                                        if($scope.cubierta[i].Grupo[j].Ubicacion[k].UbicacionId == $scope.ubicacion[m].UbicacionCubiertaId)
                                        {
                                            if($scope.cubierta[i].Grupo[j].Ubicacion[k].Subtotal !== "Sin Valor")
                                            {
                                                precio += $scope.cubierta[i].Grupo[j].Ubicacion[k].Subtotal;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        $scope.cubierta[i].Grupo[j].Total = precio;
                    }
                }
            }
        }
    }
    
    $scope.CambiarUbicionCubiertaPiedra = function(ubicacion)
    {
        if(ubicacion.UbicacionCubiertaId == "1")
        {
            for(var k=0; k<$scope.ubicacion.length; k++)
            {
                if($scope.ubicacion[k].UbicacionCubiertaId == "3" && $scope.ubicacion[k].Seleccionado == true)
                {
                    $scope.ubicacion[k].Presupuesto = ubicacion.Presupuesto;
                    break;
                }
            }
        }
        
        if(ubicacion.UbicacionCubiertaId == "3")
        {
            for(var k=0; k<$scope.ubicacion.length; k++)
            {
                if($scope.ubicacion[k].UbicacionCubiertaId == "1" && $scope.ubicacion[k].Seleccionado == true)
                {
                    $scope.ubicacion[k].Presupuesto = ubicacion.Presupuesto;
                    break;
                }
            }
        }
        
        $scope.CalcularPrecioVentaCubiertaPiedra();
    }
    
    $scope.CambiarUbicionCubiertaAglomerado = function(ubicacion)
    {
        if(ubicacion.UbicacionCubiertaId == "1")
        {
            for(var k=0; k<$scope.ubicacion.length; k++)
            {
                if($scope.ubicacion[k].UbicacionCubiertaId == "3" && $scope.ubicacion[k].SeleccionadoAglomerado == true)
                {
                    $scope.ubicacion[k].Presupuesto = ubicacion.Presupuesto;
                    break;
                }
            }
        }
        
        if(ubicacion.UbicacionCubiertaId == "3")
        {
            for(var k=0; k<$scope.ubicacion.length; k++)
            {
                if($scope.ubicacion[k].UbicacionCubiertaId == "1" && $scope.ubicacion[k].SeleccionadoAglomerado == true)
                {
                    $scope.ubicacion[k].Presupuesto = ubicacion.Presupuesto;
                    break;
                }
            }
        }
        
        $scope.CalcularPrecioVentaCubiertaAglomerado();
    }
    
    $scope.MostrarCubiertaAglomerado13 = function(ubicacion)
    {
        if(ubicacion != undefined && ubicacion != null)
        {
            for(var k=0; k<ubicacion.length; k++)
            {
                if(ubicacion[k].UbicacionCubiertaId == "1" || ubicacion[k].UbicacionCubiertaId == "3")
                {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    $scope.MostrarCubiertaAglomerado24 = function(ubicacion)
    {
        if(ubicacion != undefined && ubicacion != null)
        {
            for(var k=0; k<ubicacion.length; k++)
            {
                if(ubicacion[k].UbicacionCubiertaId == "2" || ubicacion[k].UbicacionCubiertaId == "4")
                {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    $scope.MotrarLabelCubiertaAglomerado13 = function()
    {
        for(var k=0; k<$scope.ubicacion.length; k++)
        {
            if(($scope.ubicacion[k].UbicacionCubiertaId == "1" || $scope.ubicacion[k].UbicacionCubiertaId == "3") && $scope.ubicacion[k].Presupuesto == true)
            {
                return true;
            }
        }
        
        return false;
    }
    
    $scope.MotrarLabelCubiertaAglomerado24 = function()
    {
        for(var k=0; k<$scope.ubicacion.length; k++)
        {
            if(($scope.ubicacion[k].UbicacionCubiertaId == "2" || $scope.ubicacion[k].UbicacionCubiertaId == "4") && $scope.ubicacion[k].Presupuesto == true)
            {
                return true;
            }
        }
        
        return false;
    }
    
    $scope.SeleccionarMaterialCubierta = function(grupo)
    {
        if(grupo.Presupuesto == false)
        {
            grupo.Presupuesto = true;
        }
        else
        {
            $scope.grupoPrePiedra.Presupuesto = false;
            $scope.grupoPrePiedra = new Object();
            $scope.grupoPrePiedra = grupo;
        }
    }
    
    $scope.SeleccionarMaterialAglomerado13 = function(grupo)
    {
        if(grupo.Presupuesto == false)
        {
            grupo.Presupuesto = true;
        }
        else
        {
            $scope.grupoPreAglomerado13.Presupuesto = false;
            $scope.grupoPreAglomerado13 = new Object();
            $scope.grupoPreAglomerado13 = grupo;
        }
    }
    
    $scope.SeleccionarMaterialAglomerado24 = function(grupo)
    {
        if(grupo.Presupuesto == false)
        {
            grupo.Presupuesto = true;
        }
        else
        {
            $scope.grupoPreAglomerado24.Presupuesto = false;
            $scope.grupoPreAglomerado24 = new Object();
            $scope.grupoPreAglomerado24 = grupo;
        }
    }
    
    $scope.TerminarPaso10 = function()
    {
        if($scope.ValidarPaso10())
        {
            $scope.pasoPresupuesto++;
            //Cacular total del proyecto
            $scope.CalcularTotalProyecto();
            
            $scope.GetPromoPlanPago();
            
            //console.log($scope.presupuesto);
        }
    };
    
    $scope.ValidarPaso10 = function()
    {
        $scope.mensajeError = [];
        //Validar si es que existe una cubierta seleccionada, si este es el caso verificar que se haya seleccionado una ubicacion y un material
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble == true)
        {
            var combinacionPresupuesto = false;
            for(var k=0; k<$scope.combinacion.length; k++)
            {

                if($scope.combinacion[k].Presupuesto == true)
                {
                    combinacionPresupuesto = true;
                    break;
                }
            }

            if(!combinacionPresupuesto)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona al menos una combinación.";
                return false;
            }
        }
        
        if($scope.tipoCubiertaPresupuesto == "1" || $scope.tipoCubiertaPresupuesto == "2")
        {
            var cubiertaSel = false;
           
            // cubierta de aglomerado
            if($scope.tipoCubiertaPresupuesto == "1")
            {
                var aglomerado13 = false;
                var aglomerado24 = false;
                var materialSel13 = false;
                var materialSel24 = false;
                
                for(var k=0; k<$scope.ubicacion.length; k++)
                {
                    if($scope.ubicacion[k].Presupuesto == true && $scope.ubicacion[k].SeleccionadoAglomerado == true)
                    {
                        if($scope.ubicacion[k].UbicacionCubiertaId == "1" || $scope.ubicacion[k].UbicacionCubiertaId == "3")
                        {
                            aglomerado13 = true;
                        }
                        
                        if($scope.ubicacion[k].UbicacionCubiertaId == "2" || $scope.ubicacion[k].UbicacionCubiertaId == "4")
                        {
                            aglomerado24 = true;
                        }
                        
                        cubiertaSel = true;
                    }
                }
                
                if(!cubiertaSel)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona al menos una ubicacion para la cubierta de aglomerado.";
                    return false;
                }
                
                else
                {
                    for(var k=0; k<$scope.cubierta.length; k++)
                    {
                        if($scope.cubierta[k].TipoCubierta.TipoCubiertaId == "1")
                        {
                            for(var i=0; i<$scope.cubierta[k].Grupo.length; i++)
                            {
                                if($scope.cubierta[k].Grupo[i].Color.length > 0 && $scope.cubierta[k].Grupo[i].Grupo.Activo && $scope.cubierta[k].Grupo[i].PorDefecto && $scope.cubierta[k].Grupo[i].Presupuesto == true)
                                {
                                    if(aglomerado13)
                                    {
                                        if($scope.MostrarCubiertaAglomerado13($scope.cubierta[k].Ubicacion))
                                        {
                                            materialSel13 = true;
                                        }
                                    }
                                    
                                    if(aglomerado24)
                                    {
                                        if($scope.MostrarCubiertaAglomerado24($scope.cubierta[k].Ubicacion))
                                        {
                                            materialSel24 = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    if(aglomerado13 && !materialSel13)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un material para la cubierta y barra.";
                        return false;
                    }
                    
                    if(aglomerado24 && !materialSel24)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un material para la isla y backsplash.";
                        return false;
                    }
                    
                    
                    if($scope.mensajeError.length == 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                
            }
            
            //Cubierta de piedra
            else if($scope.tipoCubiertaPresupuesto == "2")
            {
                var materialSel = false;
                
                for(var k=0; k<$scope.ubicacion.length; k++)
                {
                    if($scope.ubicacion[k].Presupuesto == true && $scope.ubicacion[k].Seleccionado == true)
                    {
                        cubiertaSel = true;
                        break;
                    }
                }
                
                if(!cubiertaSel)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona al menos una ubicacion para la cubierta de piedra.";
                    return false;
                }
                
                else
                {
                    for(var k=0; k<$scope.cubierta.length; k++)
                    {
                        if($scope.cubierta[k].TipoCubierta.TipoCubiertaId == "2")
                        {
                            for(var i=0; i<$scope.cubierta[k].Grupo.length; i++)
                            {
                                if($scope.cubierta[k].Grupo[i].Color.length > 0 && $scope.cubierta[k].Grupo[i].Grupo.Activo && $scope.cubierta[k].Grupo[i].PorDefecto && $scope.cubierta[k].Grupo[i].Presupuesto == true)
                                {
                                    materialSel = true;
                                    return true;
                                }
                            }
                        }
                    }
                    
                    if(!materialSel)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un material para las cubiertas.";
                        return false;
                    }
                    else
                    {
                        return true;  
                    }
                }
            }
        }
        else
        {
            return true;
        }
    };
    
    $scope.CalcularTotalProyecto = function()
    {
        var servicio = 0;
        var maqueo = 0;
        var accesorio = 0;
        var cubiertaA = 0;
        
        
        $scope.presupuesto.TotalProyecto = 0;
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            $scope.presupuesto.Servicio = [];
            for(var k=0; k<$scope.servicio.length; k++)
            {
                if($scope.servicio[k].Obligatorio == true && $scope.servicio[k].Presupuesto == true)
                {
                    servicio += $scope.servicio[k].Subtotal;
                    $scope.presupuesto.Servicio.push($scope.servicio[k]);
                }
            }
            
            $scope.presupuesto.Maqueo = new Object();
            for(var k=0; k<$scope.maqueo.length; k++)
            {
                if($scope.maqueo[k].PorDefecto == true && $scope.maqueo[k].Presupuesto == true)
                {
                    maqueo += $scope.maqueo[k].Subtotal;
                    $scope.presupuesto.Maqueo = $scope.maqueo[k];
                    break;
                }
            }
            
            $scope.presupuesto.Accesorio = [];
            for(var k=0; k<$scope.tipoAccesorio.length; k++)
            {
                if($scope.tipoAccesorio[k].ClaseAccesorio.ClaseAccesorioId == "1" && $scope.tipoAccesorio[k].Presupuesto)
                {
                    if($scope.tipoAccesorio[k].Cantidad > 0)
                    {
                        for(var i=0; i<$scope.tipoAccesorio[k].Muestrario.length; i++)
                        {
                            if($scope.tipoAccesorio[k].Muestrario[i].PorDefecto == true && $scope.tipoAccesorio[k].Muestrario[i].Presupuesto == true)
                            {
                                accesorio += $scope.tipoAccesorio[k].Muestrario[i].Subtotal;
                                
                                $scope.presupuesto.Accesorio.push($scope.AgregarAccesorioPresupuesto($scope.tipoAccesorio[k], $scope.tipoAccesorio[k].Muestrario[i]));
                                
                                break;
                            }
                        }
                    }
                }
            }
        
            $scope.presupuesto.Cubierta = [];
            if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado && $scope.tipoCubiertaPresupuesto == "1")
            {
                for(var k=0; k<$scope.ubicacion.length;k++)
                {
                    if($scope.ubicacion[k].SeleccionadoAglomerado && $scope.ubicacion[k].Presupuesto)    
                    {
                        if($scope.ubicacion[k].UbicacionCubiertaId != "3")
                        {
                            $scope.presupuesto.Cubierta.push($scope.ubicacion[k].Nombre);
                        }
                        else
                        {
                            for(var j=0; j<$scope.ubicacion.length;j++)
                            {
                                if($scope.ubicacion[j].UbicacionCubiertaId == "1")
                                {
                                    if($scope.ubicacion[j].SeleccionadoAglomerado && $scope.ubicacion[j].Presupuesto)    
                                    {
                                       break;
                                    }
                                    else
                                    {
                                        $scope.presupuesto.Cubierta.push($scope.ubicacion[k].Nombre);
                                        break;
                                    }  
                                }
                            }
                        }
                        
                    }
                }
            
                for(var k=0; k<$scope.cubierta.length; k++)
                {
                    if($scope.cubierta[k].TipoCubierta.TipoCubiertaId == "1")
                    {
                        for(var i=0; i<$scope.cubierta[k].Grupo.length; i++)
                        {
                            if($scope.cubierta[k].Grupo[i].PorDefecto == true && $scope.cubierta[k].Grupo[i].Presupuesto == true)
                            {
                                cubiertaA += $scope.cubierta[k].Grupo[i].Total;
                            }
                        }
                    }
                }
            }

            for(var k=0; k<$scope.combinacion.length; k++)
            {
                if($scope.combinacion[k].PorDefecto && $scope.combinacion[k].Activo)
                {
                    $scope.combinacion[k].Total =  servicio + maqueo + accesorio + cubiertaA;

                    if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
                    {
                        $scope.combinacion[k].Total += $scope.combinacion[k].PrecioVentaModulo; 

                        //puertas
                        var puerta = false;
                        $scope.presupuesto.Puerta = new Object();
                        for(var i=0; i<$scope.muestrario.length; i++)
                        {
                            if($scope.muestrario[i].PorDefecto == true && $scope.muestrario[i].Presupuesto == true)
                            {
                                for(var j=0; j<$scope.muestrario[i].Combinacion.length; j++)
                                {
                                    if($scope.muestrario[i].Combinacion[j].CombinacionMaterialId == $scope.combinacion[k].CombinacionMaterialId)
                                    {
                                        $scope.combinacion[k].Total += $scope.muestrario[i].Combinacion[j].PrecioVenta;
                                        puerta = true;
                                        
                                        break;
                                    }
                                }
                            }
                            if(puerta)
                            {
                                $scope.presupuesto.Puerta = $scope.muestrario[i];
                                break;
                            }
                        }

                        //accesorio de madera
                        var accMadera = false;
                        for(var i=0; i<$scope.tipoAccesorio.length; i++)
                        {
                            if($scope.tipoAccesorio[i].Cantidad > 0 && $scope.tipoAccesorio[i].ClaseAccesorio.ClaseAccesorioId == "2" && $scope.tipoAccesorio[i].Presupuesto)
                            {
                                accMadera = false;
                                for(var j=0; j<$scope.tipoAccesorio[i].Muestrario.length; j++)
                                {
                                    if($scope.tipoAccesorio[i].Muestrario[j].PorDefecto == true && $scope.tipoAccesorio[i].Muestrario[j].Presupuesto == true)
                                    {
                                        for(var m=0; m<$scope.tipoAccesorio[i].Muestrario[j].Combinacion.length; m++)
                                        {
                                            if($scope.tipoAccesorio[i].Muestrario[j].Combinacion[m].CombinacionId == $scope.combinacion[k].CombinacionMaterialId)
                                            {
                                                $scope.combinacion[k].Total += $scope.tipoAccesorio[i].Muestrario[j].Combinacion[m].Subtotal;
                                                accMadera = true;
                                                
                                                break;
                                            }
                                        }
                                    }
                                    if(accMadera)
                                    {
                                        break;        
                                    }
                                }
                            }
                        }
                        if($scope.combinacion[k].Presupuesto == true)
                        {
                            $scope.presupuesto.Combinacion = $scope.combinacion[k];
                        }   
                    }

                }
            }
            
            //accesorio de madera
            for(var i=0; i<$scope.tipoAccesorio.length; i++)
            {
                if($scope.tipoAccesorio[i].Cantidad > 0 && $scope.tipoAccesorio[i].ClaseAccesorio.ClaseAccesorioId == "2" && $scope.tipoAccesorio[i].Presupuesto)
                {
                    for(var j=0; j<$scope.tipoAccesorio[i].Muestrario.length; j++)
                    {
                        if($scope.tipoAccesorio[i].Muestrario[j].PorDefecto == true && $scope.tipoAccesorio[i].Muestrario[j].Presupuesto == true)
                        {
                            $scope.presupuesto.Accesorio.push($scope.AgregarAccesorioPresupuesto($scope.tipoAccesorio[i], $scope.tipoAccesorio[i].Muestrario[j]));
                            break;
                        }
                    }
                }
            }
        }
        
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra && $scope.tipoCubiertaPresupuesto == "2")
        {
            $scope.presupuesto.CubiertaPiedra = new Object();
            
            for(var k=0; k<$scope.cubierta.length; k++)
            {
                if($scope.cubierta[k].TipoCubierta.TipoCubiertaId == "2")
                {
                    for(var i=0; i<$scope.cubierta[k].Grupo.length; i++)
                    {
                        if($scope.cubierta[k].Grupo[i].Presupuesto == true)
                        {
                            $scope.presupuesto.CubiertaPiedra.Nombre = $scope.cubierta[k].Material.Nombre + " " + $scope.cubierta[k].Grupo[i].Grupo.Nombre;
                            $scope.presupuesto.CubiertaPiedra.Total = $scope.cubierta[k].Grupo[i].Total;
                            break;
                        }
                    }
                }
            }
        }
        
        $scope.CalcularTotalPromocion();
    };
    
    $scope.AgregarAccesorioPresupuesto = function(tipo, muestrario)
    {
        var newAcc = new Object();
        newAcc.Nombre = tipo.Nombre;
        newAcc.Cantidad = tipo.Cantidad;
        newAcc.Contable = tipo.Contable;
        newAcc.Muestrario = muestrario.Nombre;

        return newAcc;
    };
    
    /*------------- Paso 11 ------------------------------*/
    $scope.PromocionPorCombinacion = function()
    {
         var hoy = new Date();
        
        for(var j=0; j<$scope.promocion.length; j++)
        {
            if($scope.promocion[j].Activo)
            {
                if($scope.promocion[j].TipoPromocion.TipoPromocionId == "3")
                {
                    var fecha = new Date();

                    fecha.setDate(fecha.getDate()+parseInt($scope.promocion[j].Vigencia));
                    var mes = fecha.getMonth()+1;

                    if(mes < 10)
                    {
                        mes = "0" + mes;
                    }
                    $scope.promocion[j].FechaLimite2 = fecha.getFullYear()+ "/" + mes + "/" + fecha.getDate();
                    $scope.promocion[j].FechaLimite = fecha.getDate() + "/" + GetMesNombre(fecha.getMonth()) + "/" + fecha.getFullYear();
                }

                if($scope.promocion[j].TipoPromocion.TipoPromocionId == "1")
                {
                    
                    var dia = $scope.promocion[j].FechaLimite.slice(0,2);
                    var mes = parseInt($scope.promocion[j].FechaLimite.slice(3,5));
                    var year = $scope.promocion[j].FechaLimite.slice(6,10);
                    
                    if(mes < 10)
                    {
                        mes = "0" + mes;
                    }
                    
                    $scope.promocion[j].FechaLimite2 = year + "/" + mes + "/" + dia;
                    
                    mes = parseInt(mes);
                    mes = mes -1;
                    
                    $scope.promocion[j].FechaLimite = dia + "/" + GetMesNombre(mes) + "/" + year;
                    
                    var promo = new Date(year, mes, dia, 23, 59, 59);
                    
                    if(hoy > promo)
                    {
                        $scope.promocion[j].Show = false;
                    }
                    else
                    {
                        $scope.promocion[j].Show = true;
                    }
                }
                else
                {
                    $scope.promocion[j].Show = true;
                }

                $scope.promocion[j].Presupuesto = true;
            }
            
        }
        
        //console.log($scope.promocion);
        $scope.CalcularTotalPromocion();
    };
    
    $scope.CalcularTotalPromocion = function()
    {
        /*if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            for(var j=0; j<$scope.promocion.length; j++)
            {
                if($scope.promocion[j].TipoVenta.TipoVentaId == "1" && $scope.promocion[j].Activo)
                {
                    $scope.promocion[j].Total = []; 
                    for(var k=0; k<$scope.combinacion.length; k++)
                    {
                        if($scope.combinacion[k].Activo && $scope.combinacion[k].PorDefecto)
                        {
                            if($scope.promocion[j].TipoPromocion.TipoPromocionId == "2")
                            {
                                $scope.promocion[j].Total[$scope.promocion[j].Total.length] = $scope.combinacion[k].Total/parseInt($scope.promocion[j].NumeroPagos);
                                $scope.promocion[j].Total[$scope.promocion[j].Total.length-1] = $scope.promocion[j].Total[$scope.promocion[j].Total.length-1].toFixed(2);
                            }
                            else if($scope.promocion[j].TipoPromocion.TipoPromocionId == "1" || $scope.promocion[j].TipoPromocion.TipoPromocionId == "3") 
                            {
                                $scope.promocion[j].Total[$scope.promocion[j].Total.length] = $scope.combinacion[k].Total - ($scope.combinacion[k].Total*parseFloat($scope.promocion[j].DescuentoMinimo)/100);
                                $scope.promocion[j].Total[$scope.promocion[j].Total.length-1] = $scope.promocion[j].Total[$scope.promocion[j].Total.length-1].toFixed(2);
                            }
                        }
                    }
                }
            }
        }*/
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            for(var k=0; k<$scope.cubierta.length; k++)
            {
                if($scope.cubierta[k].TipoCubierta.TipoCubiertaId == "2")
                {
                    for(var i=0; i<$scope.cubierta[k].Grupo.length; i++)
                    {
                        var total = 0;
                        if($scope.cubierta[k].Grupo[i].Grupo.Activo && $scope.cubierta[k].Grupo[i].PorDefecto && $scope.cubierta[k].Grupo[i].Color.length > 0)
                        {
                            for(j=0; j<$scope.cubierta[k].Grupo[i].Ubicacion.length; j++)
                            {
                                if($scope.cubierta[k].Grupo[i].Ubicacion[j].UbicacionId != "3")
                                {
                                    $scope.cubierta[k].Grupo[i].Ubicacion[j].Total =  $scope.cubierta[k].Grupo[i].Ubicacion[j].Subtotal;
                            
                                    if($scope.cubierta[k].Grupo[i].Ubicacion[j].UbicacionId == "1")
                                    {
                                        for(m=0; m<$scope.cubierta[k].Grupo[i].Ubicacion.length; m++)
                                        {
                                            if($scope.cubierta[k].Grupo[i].Ubicacion[m].UbicacionId == "3")
                                            {
                                                $scope.cubierta[k].Grupo[i].Ubicacion[j].Total +=  $scope.cubierta[k].Grupo[i].Ubicacion[m].Subtotal;
                                                                                        
                                                break;
                                            }
                                        }
                                    }
                                    total += $scope.cubierta[k].Grupo[i].Ubicacion[j].Total;
                                }
                            }
                        }
                        
                        $scope.cubierta[k].Grupo[i].TotalCubierta = total;
                        
                        /*$scope.cubierta[k].Grupo[i].Promocion 
                        for(var m=0; m<$scope.promocion.length; m++)
                        {
                            if($scope.promocion[m].TipoVenta.TipoVentaId == "2")
                            {
                                
                            }
                        }*/
                    }
                }
            }
        }
    };
    
    $scope.ActualizarPromocion = function()
    {
        $scope.promoActualizar = true;
        $scope.GetPromoPlanPago();
    };
    
    $scope.TerminarPaso11 = function()
    {
        var piedra = false;
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra )
        {
            for(var k=0; k<$scope.tipoCubierta.length; k++)
            {
                if($scope.tipoCubierta[k].TipoCubiertaId == "2")
                {
                    if($scope.tipoCubierta[k].PorDefecto)
                    {
                        $scope.pasoPresupuesto++;
                        piedra = true;
                    }
                    
                }
            }
            
            if(!piedra)
            {
                $scope.pasoPresupuesto = 13;
                $scope.IniciarPlanPago();
            }
            
            
        }
        else
        {
            $scope.pasoPresupuesto = 13;
            $scope.IniciarPlanPago();
        }
        
    }
    
    $scope.GetHoy = function()
    {
        var hoy = new Date();
        
        var dia = hoy.getDate();
        //var mes = hoy.getMonth() +1;
        var year = hoy.getFullYear();
        
        /*if(mes < 10)
        {
            mes = "0"+mes;
        }*/
        
        return dia + "/" + GetMesNombre(hoy.getMonth()) + "/" + year;
    };
    
    //--------------------- Paso 12 --------------------------
    $scope.CalcularPromocionTotalCubierta = function(total, promocion)
    {
        if(promocion.TipoPromocion.TipoPromocionId == "1" || promocion.TipoPromocion.TipoPromocionId == "3")
        {
            return Math.round(total-((total*promocion.DescuentoMinimo)/100));
        }
        else if(promocion.TipoPromocion.TipoPromocionId == "2")
        {
            return Math.round(total/promocion.NumeroPagos);
        }
    };
    
    $scope.TerminarPaso12 = function()
    {
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            $scope.pasoPresupuesto++;
            $scope.IniciarPlanPago();
        }
        else
        {
            //$scope.pasoPresupuesto = 14;
            if($scope.opt != "Personalizar")
            {
                $scope.TerminarPresupuesto();
            }
            else
            {
                $scope.PDFPresupuestoCubierta();
                $scope.pasoPresupuesto = 14;
            }
            
        }
        
    }
    
    $scope.AnteriorPresupuestoPaso12 = function()
    {
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            $scope.pasoPresupuesto--;
        }
        else
        {
            $scope.pasoPresupuesto = 9;
        }
    }
    
    
    $scope.IniciarPlanPago = function()
    {
        $scope.presupuesto.FechaVenta = $scope.GetHoy();
        
        
        if($scope.presupuesto.PromocionMueble == undefined || $scope.presupuesto.PromocionMueble == null)
        {
            $scope.presupuesto.PromocionMueble = "Ninguno";
        }
        
        if($scope.presupuesto.PromocionCubierta == undefined || $scope.presupuesto.PromocionCubierta == null)
        {
            $scope.presupuesto.PromocionCubierta = "Ninguno";
        }
        
        
        //$scope.GetPrecioVentaPresupuesto();
        if($scope.presupuesto.PlanPago != undefined && $scope.presupuesto.PlanPago != null)
        {
            if($scope.presupuesto.PlanPago.Abono != undefined && $scope.presupuesto.PlanPago.Abono != null)
            {
                if($scope.presupuesto.PlanPago.Abono.length > 0)
                {
                    $scope.CalcularAbono($scope.presupuesto.PlanPago);
                } 
            }
        }
        
    };
    
    $scope.GetPrecioVentaPresupuesto = function(combinacionTotal)
    {
        $scope.presupuesto.TotalProyecto = 0;
        var subtotal;
        var total = 0;
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            if($scope.presupuesto.PromocionMueble != "Ninguno")
            {
                subtotal = combinacionTotal - ((combinacionTotal*parseFloat($scope.presupuesto.PromocionMueble.Descuento))/100);
            }
            else
            {
                subtotal = combinacionTotal;
            }
            
            total += Math.round(subtotal);
        }
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra && $scope.tipoCubiertaPresupuesto == "2")
        {
            subtotal = $scope.presupuesto.CubiertaPiedra.Total;
            
            if($scope.presupuesto.PromocionCubierta != "Ninguno")
            {
                subtotal = subtotal - ((subtotal*parseFloat($scope.presupuesto.PromocionCubierta.Descuento))/100);
            }
            
            total += Math.round(subtotal);
        }
        
        return total;
    };
    
    //--------------------- Paso 13 --------------------------
    $scope.CambiarPlan = function(plan)
    {
        if(plan.Presupuesto == true)
        {
            if(plan.Abono.length == 0)
            {
                $scope.GetPlanPagoAbono(plan);
                $scope.presupuesto.PlanPago = plan;
            }
            else if(plan.Presupuesto == true)
            {
                $scope.CalcularAbono(plan);
                $scope.presupuesto.PlanPago = plan;
            }
            
            for(var k=0; k<$scope.planPago.length; k++)
            {
                if($scope.planPago[k].PlanPagoId != plan.PlanPagoId)
                {
                    $scope.planPago[k].Presupuesto = false;
                }
            }
        }
         else
        {
            $scope.presupuesto.PlanPago = new Object();
        }
    };
    
    $scope.CalcularAbono = function(plan)
    {
        var fecha, mes;
        var total;
        var abono;
        
        
        for(var k=0; k<plan.Abono.length; k++)
        {
            fecha = new Date();
            fecha.setDate(fecha.getDate() + parseInt(plan.Abono[k].Dias));
            
            mes = parseInt(fecha.getMonth());
            var mes2 = mes + 1;
            if(mes2 < 10)
            {
                mes2 = "0" + mes2;
            }
            
            var dia = parseInt(fecha.getDate());
            if(dia < 10)
            {
                dia = "0" + dia;
            }
            
            plan.Abono[k].FechaCompromiso = dia+ "/" + Month[mes] + "/" + fecha.getFullYear();
            plan.Abono[k].FechaCompromiso2 = fecha.getFullYear()+ "/" + mes2 + "/" + dia;
            //plan.Abono[k].Pago = (total*parseFloat(plan.Abono[k].Abono))/100;
        }
        
        for(var k=0; k<$scope.combinacion.length; k++)
        {
            if($scope.combinacion[k].Presupuesto == true)
            {
                $scope.combinacion[k].Abono = [];
                total = $scope.GetPrecioVentaPresupuesto($scope.combinacion[k].Total);
                $scope.combinacion[k].TotalProyecto = total;
                
                var acumulado = 0;
                for(var i=0; i<plan.Abono.length; i++)
                {
                    $scope.combinacion[k].Abono[i] = new Object();
                    $scope.combinacion[k].Abono[i].FechaCompromiso = plan.Abono[i].FechaCompromiso;
                    $scope.combinacion[k].Abono[i].FechaCompromiso2 = plan.Abono[i].FechaCompromiso2;
                    
                    if(i == plan.Abono.length-1)
                    {
                        $scope.combinacion[k].Abono[i].Pago = total - acumulado;
                    }
                    else
                    {
                        $scope.combinacion[k].Abono[i].Pago = Math.round((total*parseFloat(plan.Abono[i].Abono))/100);
                        acumulado += $scope.combinacion[k].Abono[i].Pago;
                    }
                }
            }
        
        }
        
        //console.log($scope.combinacion);
    };
    
    $scope.CambiarPromocionCubierta = function(promo)
    {
        if(promo != $scope.presupuesto.PromocionCubierta)
        {
            $scope.presupuesto.PromocionCubierta = promo;
            $scope.presupuesto.PromocionCubierta.Descuento = promo.DescuentoMinimo;
            $scope.CalcularAbono($scope.presupuesto.PlanPago);
            //$scope.GetPrecioVentaPresupuesto();
        }
    }
    
    $scope.CambiarPromocionMueble = function(promo)
    {
        if(promo != $scope.presupuesto.PromocionMueble)
        {
            $scope.presupuesto.PromocionMueble = promo;
            $scope.presupuesto.PromocionMueble.Descuento = promo.DescuentoMinimo;
            $scope.CalcularAbono($scope.presupuesto.PlanPago);
            //$scope.GetPrecioVentaPresupuesto();
        }
    }
    
    $scope.CambiarDescuento = function(promo, val)
    {
        if(val == -1)
        {
            if((parseFloat(promo.Descuento) - 1) >= 0)
            {
                promo.Descuento = parseFloat(promo.Descuento) - 1;
            }
        }
        if(val == 1)
        {
            if(promo.DescuentoMaximo >= (parseFloat(promo.Descuento) + 1))
            {
                promo.Descuento = parseFloat(promo.Descuento) + 1;
            }
        }
        
         $scope.CalcularAbono($scope.presupuesto.PlanPago);
    };

    
    $scope.AnteriorPaso13 = function()
    {
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            for(var k=0; k<$scope.tipoCubierta.length; k++)
            {
                if($scope.tipoCubierta[k].TipoCubiertaId == "2")
                {
                    if($scope.tipoCubierta[k].PorDefecto)
                    {
                        $scope.pasoPresupuesto--;
                        return;
                    }
                    else
                    {
                        $scope.pasoPresupuesto = 11;
                        return;
                    }
                }
                
            }
            $scope.pasoPresupuesto = 11;
        }
        else
        {
            $scope.pasoPresupuesto = 11;
        }
    }
    
    $scope.TerminarPaso13 = function()
    {
        if($scope.ValidarPaso13())
        {
            if($scope.opt != "Personalizar")
            {
                $scope.TerminarPresupuesto();
            }
            else
            {
                $scope.PDFPresupuesto();
                $scope.pasoPresupuesto++;
            }
        }
    };
    
    $scope.ValidarPaso13 = function()
    {
        $scope.mensajeError = [];
        var selPal = false;
        for(var k=0; k<$scope.planPago.length; k++)
        {
            if($scope.planPago[k].Presupuesto == true)
            {
                selPal =  true;
                break;
            }
        }
        
        if(selPal)
        {
            return true;
        }
        else
        {
            $scope.mensajeError[0] = "*Selecciona un plan de pagos.";
            //console.log($scope.mesajeError);
            return false;
        }
    };
    
    /*$scope.GenerarPDF = function()
    {
        //console.log("entra");
        
        html2canvas(document.getElementById('Hoja3'),{
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
            }
        });
        
    };*/
    
    //---------------------- Paso 14 ---------------------------
    $scope.TerminarPresupuesto = function()
    {
        var fecha = $scope.GetHoyNumero();
        
        //paso 1
        if(!$scope.personaSeleccionada)
        {
            $scope.presupuesto.Persona.PersonaId = "0";
        }
        
        //paso 2
        if($scope.proyectoNuevo)
        {
            $scope.presupuesto.Proyecto.ProyectoId = "0";
            $scope.presupuesto.Proyecto.FechaCreacion = fecha;
        }
        
        $scope.presupuesto.FechaCreacion = fecha;
        $scope.presupuesto.UsuarioId = $scope.usuario.UsuarioId;
        
        //paso 3 - ...
        $scope.presupuesto.CombinacionPresupuesto = [];
        $scope.presupuesto.ServicioPresupuesto = [];
        $scope.presupuesto.PuertaPresupuesto = [];
        $scope.presupuesto.MaqueoPresupuesto = [];
        $scope.presupuesto.AccesorioPresupuesto = [];
        $scope.presupuesto.CubiertaPresupuesto = [];
        $scope.presupuesto.Promocion = [];
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            //paso 3
            for(var k=0; k<$scope.combinacion.length; k++)
            {
                if($scope.combinacion[k].PorDefecto && $scope.combinacion[k].Activo)
                {
                    var i = $scope.presupuesto.CombinacionPresupuesto.length;
                    $scope.presupuesto.CombinacionPresupuesto[i] = new Object();
                    $scope.presupuesto.CombinacionPresupuesto[i].CombinacionMaterialId = $scope.combinacion[k].CombinacionMaterialId;
                    $scope.presupuesto.CombinacionPresupuesto[i].PrecioVenta = $scope.combinacion[k].PrecioVentaModulo;
                }
            }
            
            //paso 4
            for(var k=0; k<$scope.servicio.length; k++)
            {
                if($scope.servicio[k].Obligatorio && $scope.servicio[k].Activo)
                {
                    var i = $scope.presupuesto.ServicioPresupuesto.length;
                    $scope.presupuesto.ServicioPresupuesto[i] = new Object();
                    $scope.presupuesto.ServicioPresupuesto[i].ServicioId = $scope.servicio[k].ServicioId;
                    $scope.presupuesto.ServicioPresupuesto[i].Cantidad = $scope.servicio[k].Cantidad;
                    $scope.presupuesto.ServicioPresupuesto[i].PrecioVenta = $scope.servicio[k].Subtotal;
                }
            }
            
            for(var k=0; k<$scope.muestrario.length; k++)
            {
                if($scope.muestrario[k].PorDefecto && $scope.muestrario[k].Activo)
                {
                    var i = $scope.presupuesto.PuertaPresupuesto.length;
                    $scope.presupuesto.PuertaPresupuesto[i] = new Object();
                    $scope.presupuesto.PuertaPresupuesto[i].MuestrarioId = $scope.muestrario[k].MuestrarioId;
                    $scope.presupuesto.PuertaPresupuesto[i].Combinacion = [];
                    
                    for(var j=0; j<$scope.muestrario[k].Combinacion.length; j++)
                    {
                        $scope.presupuesto.PuertaPresupuesto[i].Combinacion[j] = new Object();
                        $scope.presupuesto.PuertaPresupuesto[i].Combinacion[j].PuertaPresupuestoId = "-1";
                        $scope.presupuesto.PuertaPresupuesto[i].Combinacion[j].CombinacionMaterialId = $scope.muestrario[k].Combinacion[j].CombinacionMaterialId;
                        $scope.presupuesto.PuertaPresupuesto[i].Combinacion[j].PrecioVenta = $scope.muestrario[k].Combinacion[j].PrecioVenta;
                    }
                }
            }
            
            
            //paso 5
            for(var k=0; k<$scope.maqueo.length; k++)
            {
                if($scope.maqueo[k].PorDefecto && $scope.maqueo[k].Activo)
                {
                    var i = $scope.presupuesto.MaqueoPresupuesto.length;
                    $scope.presupuesto.MaqueoPresupuesto[i] = new Object();
                    $scope.presupuesto.MaqueoPresupuesto[i].MaqueoId = $scope.maqueo[k].MaqueoId;
                    $scope.presupuesto.MaqueoPresupuesto[i].PrecioVenta = $scope.maqueo[k].Subtotal;
                }
            }
            
            for(var k=0; k<$scope.tipoAccesorio.length; k++)
            {
                if($scope.tipoAccesorio[k].Presupuesto)
                {
                    var tipoAgregado = false;
                    for(var m=0; m<$scope.tipoAccesorio[k].Muestrario.length; m++)
                    {
                        if($scope.tipoAccesorio[k].Muestrario[m].PorDefecto && $scope.tipoAccesorio[k].Muestrario[m].Activo && $scope.tipoAccesorio[k].Muestrario[m].Accesorio.length >0)
                        {
                            if(!tipoAgregado)
                            {
                                var i = $scope.presupuesto.AccesorioPresupuesto.length;
                                $scope.presupuesto.AccesorioPresupuesto[i] = new Object();
                                $scope.presupuesto.AccesorioPresupuesto[i].TipoAccesorioId = $scope.tipoAccesorio[k].TipoAccesorioId;
                                $scope.presupuesto.AccesorioPresupuesto[i].Cantidad = $scope.tipoAccesorio[k].Cantidad;
                                $scope.presupuesto.AccesorioPresupuesto[i].Muestrario = [];

                                tipoAgregado = true;

                            }

                            var j = $scope.presupuesto.AccesorioPresupuesto[i].Muestrario.length;
                            $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j] = new Object();
                            $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j].MuestrarioId = $scope.tipoAccesorio[k].Muestrario[m].MuestrarioId;

                            if($scope.tipoAccesorio[k].ClaseAccesorio.ClaseAccesorioId == "1")
                            {
                                $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j].Combinacion = [];
                                $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j].PrecioVenta = $scope.tipoAccesorio[k].Muestrario[m].Subtotal;
                            }
                            else if($scope.tipoAccesorio[k].ClaseAccesorio.ClaseAccesorioId == "2")
                            {
                                $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j].Combinacion = [];
                                $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j].PrecioVenta = null;

                                for(var l=0; l<$scope.tipoAccesorio[k].Muestrario[m].Combinacion.length; l++)
                                {
                                    $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j].Combinacion[l] = new Object();
                                    $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j].Combinacion[l].MuestrarioAccesorioPresupuestoId = "-1";
                                    $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j].Combinacion[l].PrecioVenta = $scope.tipoAccesorio[k].Muestrario[m].Combinacion[l].Subtotal;
                                    $scope.presupuesto.AccesorioPresupuesto[i].Muestrario[j].Combinacion[l].CombinacionMaterialId = $scope.tipoAccesorio[k].Muestrario[m].Combinacion[l].CombinacionId;
                                }
                            }
                        }
                    }
                }
            }
        }
          
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaAglomerado)
        {
            for(var k=0; k<$scope.tipoCubierta.length; k++)
            {
                if($scope.tipoCubierta[k].TipoCubiertaId == "1" && $scope.tipoCubierta[k].PorDefecto)
                {
                    var i = $scope.presupuesto.CubiertaPresupuesto.length;
                    $scope.presupuesto.CubiertaPresupuesto[i] = new Object();
                    $scope.presupuesto.CubiertaPresupuesto[i].TipoCubiertaId = "1";
                    $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion = [];
                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo = [];
                    
                    for(var m=0; m<$scope.ubicacion.length; m++)
                    {
                        if($scope.ubicacion[m].SeleccionadoAglomerado == true)
                        {
                            var j = $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion.length;
                            $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j] = new Object();
                            $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j].UbicacionCubiertaId = $scope.ubicacion[m].UbicacionCubiertaId;
                            $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j].Elemento = [];
                            $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j].CantidadAglomerado =  $scope.ubicacion[m].CantidadAglomerado;
                        }
                    }
                    
                    for(var m=0; m<$scope.cubierta.length; m++)
                    {
                        if($scope.cubierta[m].Material.Activo && $scope.cubierta[m].TipoCubierta.TipoCubiertaId == "1")
                        {
                            for(var n=0; n<$scope.cubierta[m].Grupo.length; n++)
                            {
                                if($scope.cubierta[m].Grupo[n].Grupo.Activo == true && $scope.cubierta[m].Grupo[n].Color.length > 0 && $scope.cubierta[m].Grupo[n].PorDefecto)
                                {
                                    var j =  $scope.presupuesto.CubiertaPresupuesto[i].Grupo.length;
                                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j] = new Object();
                                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].GrupoId = $scope.cubierta[m].Grupo[n].Grupo.GrupoId;
                                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].MaterialId = $scope.cubierta[m].Material.MaterialId; 
                                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion = [];
                                    
                                    for(var l=0; l<$scope.cubierta[m].Grupo[n].Ubicacion.length; l++)
                                    {
                                        if($scope.cubierta[m].Grupo[n].Ubicacion[l].Subtotal != "Sin Valor")
                                        {
                                            var li= $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion.length;
                                            $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion[li] =  new Object();
                                            $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion[li].MaterialTipoCubiertaPresupuestoId = "-1";
                                            $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion[li].UbicacionCubiertaId = $scope.cubierta[m].Grupo[n].Ubicacion[l].UbicacionId;
                                            $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion[li].PrecioVenta = $scope.cubierta[m].Grupo[n].Ubicacion[l].Subtotal;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    break;
                }
            
            }
        }
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            for(var k=0; k<$scope.tipoCubierta.length; k++)
            {
                if($scope.tipoCubierta[k].TipoCubiertaId == "2" && $scope.tipoCubierta[k].PorDefecto)
                {
                    var i = $scope.presupuesto.CubiertaPresupuesto.length;
                    $scope.presupuesto.CubiertaPresupuesto[i] = new Object();
                    $scope.presupuesto.CubiertaPresupuesto[i].TipoCubiertaId = "2";
                    $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion = [];
                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo = [];
                    
                    for(var m=0; m<$scope.ubicacion.length; m++)
                    {
                        if($scope.ubicacion[m].Seleccionado == true)
                        {
                            var j = $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion.length;
                            $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j] = new Object();
                            $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j].UbicacionCubiertaId = $scope.ubicacion[m].UbicacionCubiertaId;
                            $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j].Elemento = [];
                            $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j].CantidadAglomerado =  null;
                            
                            for(var n=0; n<$scope.ubicacion[m].Elemento.length; n++)
                            {
                                $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j].Elemento[n] = new Object();
                                
                                $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j].Elemento[n].Lado1 = $scope.ubicacion[m].Elemento[n].Lado1; 
                                $scope.presupuesto.CubiertaPresupuesto[i].Ubicacion[j].Elemento[n].Lado2 = $scope.ubicacion[m].Elemento[n].Lado2; 
                            }
                        }
                    }
                    
                    for(var m=0; m<$scope.cubierta.length; m++)
                    {
                        if($scope.cubierta[m].Material.Activo && $scope.cubierta[m].TipoCubierta.TipoCubiertaId == "2")
                        {
                            for(var n=0; n<$scope.cubierta[m].Grupo.length; n++)
                            {
                                if($scope.cubierta[m].Grupo[n].Grupo.Activo == true && $scope.cubierta[m].Grupo[n].Color.length > 0 && $scope.cubierta[m].Grupo[n].PorDefecto)
                                {
                                    var j =  $scope.presupuesto.CubiertaPresupuesto[i].Grupo.length;
                                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j] = new Object();
                                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].GrupoId = $scope.cubierta[m].Grupo[n].Grupo.GrupoId;
                                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].MaterialId = $scope.cubierta[m].Material.MaterialId;
                                    $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion = [];
                                    
                                    for(var l=0; l<$scope.cubierta[m].Grupo[n].Ubicacion.length; l++)
                                    {
                                        $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion[l] = new Object();
                                        $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion[l].MaterialTipoCubiertaPresupuestoId = "-1";
                                        $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion[l].UbicacionCubiertaId = $scope.cubierta[m].Grupo[n].Ubicacion[l].UbicacionId;
                                        $scope.presupuesto.CubiertaPresupuesto[i].Grupo[j].Ubicacion[l].PrecioVenta = $scope.cubierta[m].Grupo[n].Ubicacion[l].Subtotal;
                                    }
                                }
                            }
                        }
                    }
                    
                    break;
                }
            }
        }
        
        //paso 11
        for(var k=0; k<$scope.promocion.length; k++)
        {
            if($scope.promocion[k].Activo && $scope.promocion[k].Show && $scope.promocion[k].TipoVenta.TipoVentaId == '1' && $scope.promocion[k].Presupuesto)
            {
                $scope.presupuesto.Promocion.push(jQuery.extend({}, $scope.promocion[k]));
            }
        }
        
        for(var k=0; k<$scope.promocion.length; k++)
        {
            if($scope.promocion[k].Activo && $scope.promocion[k].Show && $scope.promocion[k].TipoVenta.TipoVentaId == '2' && $scope.promocion[k].Presupuesto)
            {
                $scope.presupuesto.Promocion.push(jQuery.extend({}, $scope.promocion[k]));
            }
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarProyectoPresupuesto();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarProyectoPresupuesto();
        }
        
        //console.log($scope.tipoAccesorio);
        //console.log($scope.presupuesto);
    };
    
    $scope.GetHoyNumero = function()
    {
        var hoy = new Date();
        
        var dia = hoy.getDate();
        var mes = hoy.getMonth() +1;
        var year = hoy.getFullYear();
        var hora = hoy.getHours();
        var min = hoy.getMinutes();
        
        if(mes < 10)
        {
            mes = "0"+mes;
        }
        if(dia < 10)
        {
            dia = "0"+dia;
        }
        
        return year + "/" + mes + "/" + dia + " " + hora + ":" + min;
    };
    
    $scope.CubiertaPiedraPersonalizado = function()
    {
        var ubicacion = [];
        for(var k=0; k<$scope.ubicacion.length; k++)
        {
            if($scope.ubicacion[k].Presupuesto == true && $scope.ubicacion[k].Seleccionado && $scope.ubicacion[k].UbicacionCubiertaId != '3')
            {
                ubicacion.push($scope.ubicacion[k].Nombre);
            }
        }
        
        var msn = "";
        for(var k=0; k<(ubicacion.length-1); k++)
        {
            msn += (ubicacion[k] + ", ");
        }
        
        msn += (ubicacion[ubicacion.length-1] + ".");
        
        return msn;
    };
    
    $scope.GetTextoPresupustoPromo = function(promo)
    {
        if(promo == "Mueble")
        {
            if($scope.presupuesto.PromocionMueble == "Ninguno")
            {
                return "Ninguno.";
            }
            else
            {
                if($scope.presupuesto.PromocionMueble != undefined )
                {
                    return $scope.presupuesto.PromocionMueble.Descuento + "% de descuento hasta " + $scope.presupuesto.PromocionMueble.FechaLimite + ".";
                }
               
            }
        }
        else if(promo == "Cubierta")
        {
            if($scope.presupuesto.PromocionCubierta == "Ninguno")
            {
                return "Ninguno.";
            }
            else
            {
                if($scope.presupuesto.PromocionCubierta != undefined )
                {
                    return $scope.presupuesto.PromocionCubierta.Descuento + "% de descuento hasta " + $scope.presupuesto.PromocionCubierta.FechaLimite + ".";
                }
            }
        }
    };
    
    /*$scope.GetPromocionMueble = function()
    {
        var promo = [];
        for(var k=0; k<$scope.promocion.length; k++)
        {
            if( $scope.promocion[k].Presupuesto == true && $scope.promocion[k].Show == true && $scope.promocion[k].TipoVenta.TipoVentaId == "1")
            {
                var index = promo.length;
                promo[index] = new Object();
                if($scope.promocion[k].TipoPromocion.TipoPromocionId == "3")
                {
                    promo[index].DescuentoMinimo = 0;
                    promo[index].Texto = $scope.promocion[k].NumeroPagos + " meses sin intereses " + $scope.promocion[k].Descripcion;
                }
                else
                {
                    promo[index].DescuentoMinimo = $scope.promocion[k].DescuentoMinimo;
                    promo[index].Texto = $scope.promocion[k].DescuentoMinimo + "% de descuento hasta  " + $scope.promocion[k].FechaLimite + " " + $scope.promocion[k].Descripcion;
                }
            }
        }
        
        promo.sort(function(a, b){return a.DescuentoMinimo-b.DescuentoMinimo});
        
        
        for(var k=0; k<(promo.length-1); k++)
        {
            promo[k].Texto += " O";
        }
        
        return promo;
        
    };
    
    $scope.GetPromocionCubierta = function()
    {
        var promo = [];
        for(var k=0; k<$scope.promocion.length; k++)
        {
            if( $scope.promocion[k].Presupuesto == true && $scope.promocion[k].Show == true && $scope.promocion[k].TipoVenta.TipoVentaId == "2")
            {
                var index = promo.length;
                //console.log(index);
                promo[index] = new Object();
                if($scope.promocion[k].TipoPromocion.TipoPromocionId == "3")
                {
                    promo[index].DescuentoMinimo = 0;
                    promo[index].Texto = $scope.promocion[k].NumeroPagos + " meses sin intereses " + $scope.promocion[k].Descripcion;
                }
                else
                {
                    promo[index].DescuentoMinimo = $scope.promocion[k].DescuentoMinimo;
                    promo[index].Texto = $scope.promocion[k].DescuentoMinimo + "% de descuento hasta  " + $scope.promocion[k].FechaLimite + " " + $scope.promocion[k].Descripcion;
                }
            }
        }
        
        promo.sort(function(a, b){return a.DescuentoMinimo-b.DescuentoMinimo});
        
        
        for(var k=0; k<(promo.length-1); k++)
        {
            promo[k].Texto += " O";
        }
        
        return promo;
        
    };*/
    
    $scope.GetTextoDescripcionPromocion = function(promo)
    {
        var texto = "";
        if(promo.TipoPromocion.TipoPromocionId == "2")
        {

            texto = promo.NumeroPagos + " meses sin intereses " + promo.Descripcion;
        }
        else
        {
            texto = promo.DescuentoMinimo + "% de descuento hasta  " + promo.FechaLimite + " " + promo.Descripcion;
        }
        
        return texto;
    };
    
    //------ terminar ---------
    $scope.AgregarProyectoPresupuesto = function()
    {  
        $scope.SetUnidadNegocio();
        var nuevo = ($scope.presupuesto.Persona.PersonaId == "0");

        AgregarProyectoPresupuesto($http, CONFIG, $q, $scope.presupuesto).then(function(data)
        {
            //console.log(data);
            if(data[0].Estatus == "Exitoso")
            {
                $scope.presupuesto.PresupuestoId = data[1].PresupuestoId;
                $scope.presupuesto.Persona.PersonaId = data[2].PersonaId;
                $scope.presupuesto.Proyecto.ProyectoId = data[3].ProyectoId;
                
                $scope.pasoPresupuesto = 14;
                if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
                {
                    $scope.PDFPresupuesto();
                }
                else
                {
                    $scope.PDFPresupuestoCubierta();
                }
            
                if(nuevo)
                {
                    $location.path('/PerfilCliente/' + $scope.presupuesto.Persona.PersonaId + '/Proyectos'); 
                    return;
                }
                
                if($scope.opt == "AgregarProyecto")
                {
                    PRESUPUESTO.ProyectoAgregado($scope.presupuesto.Proyecto);
                }
                
                if($scope.opt == "AgregarPresupuesto")
                {
                    PRESUPUESTO.PresupuestoProyectoAgregado($scope.presupuesto);
                }
                
                if($scope.opt == "Clonar" || $scope.opt == "ClonarPre" || $scope.opt == "AgregarProyectoCero")
                {
                    PRESUPUESTO.PresupuestoClonado($scope.presupuesto);
                }
                
                if($scope.opt == "UnirPresupuestoPre" || $scope.opt == "UnirPresupuesto")
                {
                    
                    PRESUPUESTO.PresupuestoUnido($scope.presupuesto);
                }
                
                $scope.opt = "";
                          
                /*$('#agregarCitaModal').modal('toggle');
                $scope.mensaje = "La cita se ha agregado.";
                $scope.CerrarCitaModal();*/
            }
            else
            {
                //$scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            //$('#mensajeCita').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePresupuesto').modal('toggle');
        })
    };
    
    $scope.EditarProyectoPresupuesto = function()
    {  
        $scope.SetUnidadNegocio();
        EditarProyectoPresupuesto($http, CONFIG, $q, $scope.presupuesto).then(function(data)
        {
            //console.log(data);
            if(data[0].Estatus == "Exitoso")
            {                
                $scope.pasoPresupuesto = 14;
                if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
                {
                    $scope.PDFPresupuesto();
                }
                else
                {
                    $scope.PDFPresupuestoCubierta();
                }
                          
                PRESUPUESTO.PresupuestoEditado($scope.presupuesto);
            }
            else
            {
                //$scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
            //$('#mensajeCita').modal('toggle');
            
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajePresupuesto').modal('toggle');
        })
    };
    
    $scope.SetUnidadNegocio = function()
    {
        if(!$rootScope.permisoOperativo.verTodosCliente)
        {
            $scope.presupuesto.Proyecto.UnidadNegocioId = $scope.usuario.UnidadNegocioId;
        }
        else if($scope.presupuesto.Persona.UnidadNegocio.length == 1)
        {
            $scope.presupuesto.Proyecto.UnidadNegocioId = $scope.presupuesto.Persona.UnidadNegocio[0].UnidadNegocioId;
        }
        else
        {
            for(var k=0; k<$scope.presupuesto.Persona.UnidadNegocio.length; k++)
            {
                if($scope.presupuesto.Persona.UnidadNegocio[k].MargenSel)
                {
                    $scope.presupuesto.Proyecto.UnidadNegocioId = $scope.presupuesto.Persona.UnidadNegocio[k].UnidadNegocioId;
                    break;
                }
            }
        }
    }
    
    $scope.PDFPresupuesto = function()
    {
        var sql = "SELECT * FROM ? ORDER BY TotalProyecto ASC";
        $scope.combinacion = alasql(sql, [$scope.combinacion]);
        
        var doc = new jsPDF();
        var totalPagesExp = "{total_pages_count_string}";
        doc.setFontSize(12);
        
        var tit = doc.autoTableHtmlToJson(document.getElementById("titulo"));
        var des = doc.autoTableHtmlToJson(document.getElementById("descripcion"));
        var com = doc.autoTableHtmlToJson(document.getElementById("combinacionTabla"));
        var inc = doc.autoTableHtmlToJson(document.getElementById("incluye"));
        var ppInc = doc.autoTableHtmlToJson(document.getElementById("planPagoIncluye"));
        var promo = doc.autoTableHtmlToJson(document.getElementById("planPagoPromo"));
        var datos = doc.autoTableHtmlToJson(document.getElementById("datosPresupuesto"));
        var pMue = doc.autoTableHtmlToJson(document.getElementById("promocionMueble"));
        var pCub = doc.autoTableHtmlToJson(document.getElementById("promocionCubierta"));
        var descr = doc.autoTableHtmlToJson(document.getElementById("msnPresupuesto"));
        var usuario = doc.autoTableHtmlToJson(document.getElementById("Usuario"));
        var unidad = doc.autoTableHtmlToJson(document.getElementById("sucursal"));
        
        var cub = [];
        var tCub = [];
        

        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            for(var i=0; i<$scope.cubierta.length; i++)
            {
                if($scope.cubierta[i].TipoCubierta.TipoCubiertaId == "2")
                {
                    for(var j=0; j<$scope.cubierta[i].Grupo.length; j++)
                    {
                        if($scope.cubierta[i].Grupo[j].Grupo.Activo && $scope.cubierta[i].Grupo[j].PorDefecto && $scope.cubierta[i].Grupo[j].Color.length > 0)
                        {
                            var id=  $scope.cubierta[i].Material.MaterialId + "-" + $scope.cubierta[i].Grupo[j].Grupo.GrupoId;
                            var idc = "Cub"  + id;
                            var idt = "TitCub" + id;
                                
                            tCub[tCub.length] = doc.autoTableHtmlToJson(document.getElementById(idt));
                            cub[cub.length] = doc.autoTableHtmlToJson(document.getElementById(idc));
                        }
                    }
                }
            }
        }
    
        //encabezado
        var nombre = $scope.presupuesto.Persona.Nombre + " " + $scope.presupuesto.Persona.PrimerApellido + " " + $scope.presupuesto.Persona.SegundoApellido;
        var fecha = $scope.GetHoy() + "     No. " + $scope.presupuesto.PresupuestoId;
        
        var pageWidth = doc.internal.pageSize.width;
        var fontSize = 10;
        
        var nombreW = doc.getStringUnitWidth(nombre)*fontSize/doc.internal.scaleFactor;
        var dateW = doc.getStringUnitWidth(fecha)*fontSize/doc.internal.scaleFactor;
        
        var w = nombreW > dateW ? nombreW : dateW;
        var x = pageWidth - w - 15;
        var page = 0;
        
        var pageContent = function (data) 
        {
            if(page < doc.internal.getCurrentPageInfo().pageNumber)
            {
                // HEADER
                if (base64Img) 
                {
                    doc.setFontSize(10);
                    doc.addImage(base64Img, 'JPEG', 15, 10, 30, 10);
                }

                doc.text(fecha, x, 13);
                doc.text(nombre, x, 18);

                // FOOTER
                var str = "Página " + doc.internal.getCurrentPageInfo().pageNumber;

                // Total número de páginas
                if(typeof doc.putTotalPages === 'function') 
                {
                    str = str + " de " + totalPagesExp;
                }
                
                doc.setFontSize(10);

                doc.text(str, 173, 287);
                
                doc.setFontSize(8);
                
                var sucursal = "Sucursal " + $scope.UnidadNegocioDato.Ciudad + " " + $scope.UnidadNegocioDato.Estado + "\nDirección " + $scope.UnidadNegocioDato.Domicilio + "\nTeléfono " + $filter('tel')($scope.UnidadNegocioDato.Telefono); ;
                doc.text(sucursal, 14.11, 280);
                
                
                page = doc.internal.getCurrentPageInfo().pageNumber;
            }
        };
        
        
        
        //Hoja 1
        doc.autoTable(tit.columns, tit.data, {
            margin: {top: 25},
            addPageContent: pageContent,
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'bold', halign: 'center'}, 
            styles: {overflow: 'linebreak'},
            columnStyles: {text: {columnWidth: 'auto'}}
        });
        

        doc.autoTable(des.columns, des.data, {
            margin: {top: 25},
            startY: doc.autoTable.previous.finalY,
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
            styles: {overflow: 'linebreak'},
            columnStyles: {text: {columnWidth: 'auto'}}
        });

        var options = 
        {
            margin: {top: 80},
            startY: doc.autoTable.previous.finalY + 5,
            headerStyles: {fillColor: [250, 97, 21]}
        };
        
        doc.autoTable(com.columns, com.data, options);

        let first = doc.autoTable.previous;

         doc.autoTable(inc.columns, inc.data, {
            startY: first.finalY + 10,
            margin: {right: 107},
            headerStyles: {fillColor: [250, 97, 21], fontSize:18, halign: 'center', textColor: [255,255,255]},
            styles: {textColor: [0,0,0], overflow: 'linebreak', halign:'left'},
            theme: 'grid',
             createdCell: function (cell, data) {
                        if(cell.text[0] == "Incluye" || cell.text[0] == "Servicios" || cell.text[0] == "Accesorios" || cell.text[0] == "Cubierta de aglomerado")
                        {
                           cell.styles.fontSize= 10;
                           cell.styles.textColor = [0, 0, 0];
                           cell.styles.halign = 'center';
                           cell.styles.fillColor = [230, 230, 230];
                           cell.styles.fontStyle = 'bold';
                        }

                    }

        });
        
        doc.autoTable(pMue.columns, pMue.data, {
                startY: doc.autoTable.previous.finalY + 5,
                headerStyles: {fillColor: [255, 255, 255], fontSize:0, textColor: [0,0, 0], halign:'center'},
                styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0},
                columnStyles: {fillColor: [255, 255, 255]},
                pageBreak: 'avoid',
                theme: 'grid',
         });
        
        var piedra = false;
        for(var k=0; k<$scope.tipoCubierta.length; k++)
        {
            if($scope.tipoCubierta[k].TipoCubiertaId == "2" && $scope.tipoCubierta[k].PorDefecto)
            {
                piedra = true;
            }
        }
        //Hoja 2
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra && cub.length > 0 && piedra)
        {   
            doc.addPage();
            
            if (base64Img) 
            {
                doc.addImage(base64Img, 'JPEG', 15, 10, 30, 10);
            }
            
            doc.autoTable(tCub[0].columns, tCub[0].data, {
            margin: {top: 25},
            addPageContent: pageContent,
            headerStyles: {fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', fontSize:14}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
            styles: {overflow: 'linebreak'},
            columnStyles: {text: {columnWidth: 'auto'}}
            });

            //doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);
            
            doc.autoTable(cub[0].columns, cub[0].data,  {
                startY: doc.autoTable.previous.finalY ,
                headerStyles: {fillColor: [250, 97, 21], fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
                styles: {overflow: 'linebreak'},
                columnStyles: {text: {columnWidth: 'auto'}},
                pageBreak: 'avoid',


                });
            
            for(var k=1; k<cub.length; k++)
            {
                doc.autoTable(tCub[k].columns, tCub[k].data, {
                    margin: {top: 80},
                    startY: doc.autoTable.previous.finalY + 10,
                    headerStyles: {fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', fontSize:14}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
                    styles: {overflow: 'linebreak'},
                 });
                
                doc.autoTable(cub[k].columns, cub[k].data, {
                startY: doc.autoTable.previous.finalY,
                headerStyles: {fillColor: [250, 97, 21], fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
                styles: {overflow: 'linebreak'},
                columnStyles: {text: {columnWidth: 'auto'}},
                pageBreak: 'avoid',


                });
            }
            
            doc.autoTable(pCub.columns, pCub.data, {
                startY: doc.autoTable.previous.finalY + 5,
                headerStyles: {fillColor: [255, 255, 255], fontSize:0, textColor: [0,0, 0], halign:'center'},
                styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0},
                columnStyles: {fillColor: [255, 255, 255]},
                pageBreak: 'avoid',
                theme: 'grid',
         });
        }
        
        
        //Hoja 3        
        doc.addPage();
        
        
        doc.autoTable(datos.columns, datos.data, {
            margin: {top: 22},
            addPageContent: pageContent,
            headerStyles: {fillColor: [255, 255, 255], textColor: 0, fontStyle: 'normal'}, 
            styles: {overflow: 'linebreak'},
            theme: 'grid',
            columnStyles: { 0: {columnWidth: 91}, 1: {columnWidth: 91}},
        });
        
        doc.autoTable(ppInc.columns, ppInc.data,  {
            startY: doc.autoTable.previous.finalY ,
            addPageContent: pageContent,
            headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:10},
            theme: 'grid',
            columnStyles: {text: {columnWidth: 'auto'}},
            pageBreak: 'avoid',
        });
        
        doc.autoTable(promo.columns, promo.data,  {
            startY: doc.autoTable.previous.finalY ,
            addPageContent: pageContent,
            headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:10},
            theme: 'grid',
            columnStyles: {text: {columnWidth: 'auto'}},
            pageBreak: 'avoid',
        });
        
        
        var nCom = 1;
        for(var k=0; k<$scope.combinacion.length; k++)
        {
            if($scope.combinacion[k].Presupuesto == true && $scope.combinacion[k].PorDefecto)
            {
                
                var idP = "precio" + $scope.combinacion[k].CombinacionMaterialId; 
                var idPp = "pp" + $scope.combinacion[k].CombinacionMaterialId;
                
                var precio = doc.autoTableHtmlToJson(document.getElementById(idP));
                var planPago = doc.autoTableHtmlToJson(document.getElementById(idPp));
                
                if(nCom%2 > 0)
                {   
                    first = doc.autoTable.previous;

                     doc.autoTable(precio.columns, precio.data, {
                        startY: first.finalY + 10,
                        addPageContent: pageContent,
                        showHeader: 'firstPage',
                        margin: {right: 107, top:22},
                        headerStyles: {fillColor: [0, 0, 0], fontSize:14, textColor: [255,255, 255], halign:'center',},
                        styles: {fillColor: [250, 97, 21], textColor: [255,255,255], overflow: 'linebreak', halign:'center', fontSize:16},
                         theme: 'grid',
                    });

                     doc.autoTable(planPago.columns, planPago.data, {
                        startY: doc.autoTable.previous.finalY,
                        addPageContent: pageContent,
                        margin: {right: 107, top: 25},
                        headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], fontStyle:'bold'},
                        styles: {textColor: [0,0,0], overflow: 'linebreak', halign:'left'},
                         theme: 'grid',
                    });
                    
                    doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);
                }
                else
                {
                    doc.autoTable(precio.columns, precio.data, {
                        startY: first.finalY + 10,
                        addPageContent: pageContent,
                        margin: {left: 107, top:22},
                        headerStyles: {fillColor: [0, 0, 0], fontSize:14, textColor: [255,255, 255], halign:'center',},
                        styles: {fillColor: [250, 97, 21], textColor: [255,255,255], overflow: 'linebreak', halign:'center', fontSize:16},
                         theme: 'grid',
                    });

                    doc.autoTable(planPago.columns, planPago.data, {
                        startY: doc.autoTable.previous.finalY,
                        addPageContent: pageContent,
                        margin: {left: 107, top: 25},
                        headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], fontStyle:'bold'},
                        styles: {textColor: [0,0,0], overflow: 'linebreak', halign:'left'},
                        theme: 'grid',
                    });
                }
                
                nCom++;
                
            }
        }
        
        doc.autoTable(descr.columns, descr.data,  {
            margin: {top: 22},
            startY: doc.autoTable.previous.finalY + 8,
            showHeader: 'never',
            addPageContent: pageContent,
            headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:10, lineWidth: 0, textColor: [0,0, 0]},
            theme: 'grid',
            columnStyles: {text: {columnWidth: 'auto'}},
            pageBreak: 'avoid',
        });
        
        doc.autoTable(usuario.columns, usuario.data,  {
            startY: doc.autoTable.previous.finalY + 10,
            showHeader: 'never',
             margin: {top: 25},
            addPageContent: pageContent,
            headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:10, lineWidth: 0, textColor: [0,0, 0], halign:'center'},
            theme: 'grid',
            columnStyles: {text: {columnWidth: 'auto'}},
            pageBreak: 'avoid',
            createdCell: function(cell, opts) 
            {
                cell.styles.cellPadding = 0;
            }
        });
        
        /*doc.autoTable(unidad.columns, unidad.data,  {
            startY: doc.autoTable.previous.finalY + 5,
            showHeader: 'never',
            margin: {top: 25},
            addPageContent: pageContent,
            headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:8, lineWidth: 0, textColor: [0,0, 0]},
            theme: 'grid',
            columnStyles: {text: {columnWidth: 'auto'}},
            pageBreak: 'avoid',
            createdCell: function(cell, opts) 
            {
                cell.styles.cellPadding = 0;
            }
        });*/
        
        
        //doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);

        var nombre = 'P_' + $scope.presupuesto.Persona.Nombre + $scope.presupuesto.Persona.PrimerApellido + $scope.presupuesto.PresupuestoId + ".pdf";
        
        if(typeof doc.putTotalPages === 'function') 
        {
            doc.putTotalPages(totalPagesExp);
        }
        
        doc.save(nombre);
    }
    
    $scope.PDFPresupuestoCubierta = function()
    {   
        var doc = new jsPDF();
        var totalPagesExp = "{total_pages_count_string}";
        
        doc.setFontSize(12);
        
        var tit = doc.autoTableHtmlToJson(document.getElementById("titulo"));
        var des = doc.autoTableHtmlToJson(document.getElementById("descripcion"));
        var pCub = doc.autoTableHtmlToJson(document.getElementById("promocionCubierta"));
        var pCub = doc.autoTableHtmlToJson(document.getElementById("promocionCubierta"));
        var pCub = doc.autoTableHtmlToJson(document.getElementById("promocionCubierta"));
        var descr = doc.autoTableHtmlToJson(document.getElementById("msnPresupuesto"));
        var usuario = doc.autoTableHtmlToJson(document.getElementById("Usuario"));
        var unidad = doc.autoTableHtmlToJson(document.getElementById("sucursal"));
        var cub = [];
        var tCub = [];
        
        //encabezado
        var nombre = $scope.presupuesto.Persona.Nombre + " " + $scope.presupuesto.Persona.PrimerApellido + " " + $scope.presupuesto.Persona.SegundoApellido;
        var fecha = $scope.GetHoy() + "     No. " + $scope.presupuesto.PresupuestoId;
        
        var pageWidth = doc.internal.pageSize.width;
        var fontSize = 10;
        
        var nombreW = doc.getStringUnitWidth(nombre)*fontSize/doc.internal.scaleFactor;
        var dateW = doc.getStringUnitWidth(fecha)*fontSize/doc.internal.scaleFactor;
        
        var w = nombreW > dateW ? nombreW : dateW;
        var x = pageWidth - w - 15;
        var page = 0;
        
        var pageContent = function (data) 
        {
            if(page < doc.internal.getCurrentPageInfo().pageNumber)
            {
                // HEADER
                if (base64Img) 
                {
                    doc.setFontSize(10);
                    doc.addImage(base64Img, 'JPEG', 15, 10, 30, 10);
                }

                doc.text(fecha, x, 13);
                doc.text(nombre, x, 18);

                // FOOTER
                var str = "Página " + doc.internal.getCurrentPageInfo().pageNumber;

                // Total número de páginas
                if(typeof doc.putTotalPages === 'function') 
                {
                    str = str + " de " + totalPagesExp;
                }

                doc.setFontSize(10);

                doc.text(str, 173, 287);
                
                doc.setFontSize(8);
                
                var sucursal = "Sucursal " + $scope.UnidadNegocioDato.Ciudad + " " + $scope.UnidadNegocioDato.Estado + "\nDirección " + $scope.UnidadNegocioDato.Domicilio + "\nTeléfono " + $filter('tel')($scope.UnidadNegocioDato.Telefono); ;
                doc.text(sucursal, 14.11, 280);
                
                
                page = doc.internal.getCurrentPageInfo().pageNumber;
            }
        };
        
    
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra)
        {
            for(var i=0; i<$scope.cubierta.length; i++)
            {
                if($scope.cubierta[i].TipoCubierta.TipoCubiertaId == "2")
                {
                    for(var j=0; j<$scope.cubierta[i].Grupo.length; j++)
                    {
                        if($scope.cubierta[i].Grupo[j].Grupo.Activo && $scope.cubierta[i].Grupo[j].PorDefecto && $scope.cubierta[i].Grupo[j].Color.length > 0)
                        {
                            var id=  $scope.cubierta[i].Material.MaterialId + "-" + $scope.cubierta[i].Grupo[j].Grupo.GrupoId;
                            var idc = "Cub"  + id;
                            var idt = "TitCub" + id;
                                
                            tCub[tCub.length] = doc.autoTableHtmlToJson(document.getElementById(idt));
                            cub[cub.length] = doc.autoTableHtmlToJson(document.getElementById(idc));
                        }
                    }
                }
            }
        }
        
        //Hoja 2
        
        /*doc.autoTable(enc1.columns, enc1.data, {
            margin: {top: 7, left: 50},
            addPageContent: pageContent,
            showHeader: 'never',
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, 
            styles: { overflow: 'linebreak', fillColor: [255, 255, 255], halign: 'right', lineWidth: 0, textColor: [0, 0, 0]},
            theme: 'grid',
        });
        
        doc.autoTable(enc2.columns, enc2.data, {
            margin: { left: 50},
            startY: doc.autoTable.previous.finalY,
            addPageContent: pageContent,

            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal',}, 
            styles: {overflow: 'linebreak', halign: 'right'},
            columnStyles: {fillColor: [255, 255, 255], text: {columnWidth: 'auto'}}
        });*/
        
        doc.autoTable(tit.columns, tit.data, {
            margin: {top: 25},
            addPageContent: pageContent,
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'bold', halign: 'center'}, 
            styles: {overflow: 'linebreak'},
            columnStyles: {text: {columnWidth: 'auto'}}
        });

        doc.autoTable(des.columns, des.data, {
            margin: {top: 25},
            startY: doc.autoTable.previous.finalY,
            addPageContent: pageContent,
            headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, 
            styles: {overflow: 'linebreak', columnWidth: 'wrap'},
            styles: {overflow: 'linebreak'},
            columnStyles: {text: {columnWidth: 'auto'}}
        });

        var options = 
        {
            margin: {top: 80},
            addPageContent: pageContent,
            startY: doc.autoTable.previous.finalY + 6,
            headerStyles: {fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', fontSize:14}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
            styles: {overflow: 'linebreak'},
        };

        //doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);
        
        if($scope.presupuesto.Proyecto.TipoProyecto.CubiertaPiedra && cub.length > 0)
        {   
            
            doc.autoTable(tCub[0].columns, tCub[0].data, options);
            doc.autoTable(cub[0].columns, cub[0].data,  {
                startY: doc.autoTable.previous.finalY ,
                headerStyles: {fillColor: [250, 97, 21], fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
                styles: {overflow: 'linebreak'},
                columnStyles: {text: {columnWidth: 'auto'}},
                pageBreak: 'avoid',


                });
            
            for(var k=1; k<cub.length; k++)
            {
                doc.autoTable(tCub[k].columns, tCub[k].data, {
                    margin: {top: 80},
                    startY: doc.autoTable.previous.finalY + 6,
                    headerStyles: {fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', fontSize:14}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
                    styles: {overflow: 'linebreak'},
                 });
                
                doc.autoTable(cub[k].columns, cub[k].data, {
                startY: doc.autoTable.previous.finalY,
                headerStyles: {fillColor: [250, 97, 21], fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
                styles: {overflow: 'linebreak'},
                columnStyles: {text: {columnWidth: 'auto'}},
                pageBreak: 'avoid',


                });
            }
            
            doc.autoTable(pCub.columns, pCub.data, {
                startY: doc.autoTable.previous.finalY + 6,
                headerStyles: {fillColor: [255, 255, 255], fontSize:0, textColor: [0,0, 0], halign:'center'},
                styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0},
                columnStyles: {fillColor: [255, 255, 255]},
                pageBreak: 'avoid',
                theme: 'grid',
            });
        }
        
        doc.autoTable(descr.columns, descr.data,  {
            startY: doc.autoTable.previous.finalY + 8,
            showHeader: 'never',
             margin: {top: 25},
            addPageContent: pageContent,
            headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:10, lineWidth: 0, textColor: [0,0, 0]},
            theme: 'grid',
            columnStyles: {text: {columnWidth: 'auto'}},
            pageBreak: 'avoid',
        });
        
        doc.autoTable(usuario.columns, usuario.data,  {
            startY: doc.autoTable.previous.finalY + 10,
            showHeader: 'never',
             margin: {top: 25},
            addPageContent: pageContent,
            headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:10, lineWidth: 0, textColor: [0,0, 0], halign:'center'},
            theme: 'grid',
            columnStyles: {text: {columnWidth: 'auto'}},
            pageBreak: 'avoid',
            createdCell: function(cell, opts) 
            {
                cell.styles.cellPadding = 0;
            }
        });
        
        /*doc.autoTable(unidad.columns, unidad.data,  {
            startY: doc.autoTable.previous.finalY + 5,
            margin: {top: 25},
            showHeader: 'never',
            addPageContent: pageContent,
            headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:8, lineWidth: 0, textColor: [0,0, 0]},
            theme: 'grid',
            columnStyles: {text: {columnWidth: 'auto'}},
            pageBreak: 'avoid',
            createdCell: function(cell, opts) 
            {
                cell.styles.cellPadding = 0;
            }
        });*/
        
        var nombre = 'PC_' + $scope.presupuesto.Persona.Nombre + $scope.presupuesto.Persona.PrimerApellido + $scope.presupuesto.PresupuestoId + ".pdf";
        
        if(typeof doc.putTotalPages === 'function') 
        {
            doc.putTotalPages(totalPagesExp);
        }
        
        doc.save(nombre);
    }

    function OrdenarCombinacion(a,b)
    {
        return a.Total - b.Total;
    }

    
    /*--------------- ---------------------------------*/
    
    $scope.CerrarPresupuestoModal = function()
    {
        $scope.mensajeError = [];
        
        $scope.clasePresupuesto = {
                                paso1:{nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"},
                                paso2:{tipoProyecto: "dropdownlistModal"},
                            };
        $scope.LimpiarInterfaz();
    };
    
    $scope.LimpiarInterfaz = function()
    {
        $scope.moduloAgregar = new ModuloPresupuesto();
        $scope.tipoModuloAgregar = [];
        $scope.tabSeleccionada = "";
        $scope.tipoCubiertaPresupuesto = "";
        $scope.proyectoPresupuesto = null;
    };

    
});

app.factory('PRESUPUESTO',function($rootScope)
{
  var service = {};
  service.presupuesto = null;
  service.persona = null;
  service.proyecto = null;
    
  service.AgregarPresupuestoCero = function()
  {
      this.presupuesto = null;
      $rootScope.$broadcast('AgregarPresupuestoCero');
  };
    
  service.EditarPresupuesto = function(datos)
  {
      this.presupuesto = datos;
      $rootScope.$broadcast('EditarPresupuesto');
  };
    
  service.PresupuestoEditado = function(datos)
  {
      this.presupuesto = datos;
      $rootScope.$broadcast('PresupuestoEditado');
  };
    
  service.GetPresupuesto = function()
  {
      return this.presupuesto;
  };
    
  service.AgregarProyecto = function(datos)
  {
      this.persona = datos;
      $rootScope.$broadcast('AgregarProyecto');
  };
    
  service.GetPersona = function()
  {
      return this.persona;
  };
    
  service.ProyectoAgregado = function(datos)
  {
      this.proyecto = datos;
      $rootScope.$broadcast("ProyectoAgregado");
  };
    
  service.GetProyecto = function()
  {
      return this.proyecto;
  };
    
  service.AgregarPresupuestoProyecto = function(persona, proyecto)
  {
      this.persona = persona;
      this.proyecto = proyecto;
      $rootScope.$broadcast("AgregarPresupuestoProyecto");
  };
    
  service.PresupuestoProyectoAgregado = function(datos)
  {
      this.presupuesto = datos;
      $rootScope.$broadcast("PresupuestoProyectoAgregado");
  };

  service.ClonarPresupuesto = function(datos)
  {
      this.presupuesto = datos;
      //console.log(this.presupuesto);
      $rootScope.$broadcast("ClonarPresupuesto");
  };
    
  service.PresupuestoClonado = function(datos)
  {
      this.presupuesto = datos;
      $rootScope.$broadcast("PresupuestoClonado");
  };
    
  service.UnirPresupuesto = function(presupuesto, persona, proyecto)
  {
      this.presupuesto = presupuesto;
      this.persona = persona;
      this.proyecto = proyecto;
      $rootScope.$broadcast("UnirPresupuesto");
  };
    
  service.PresupuestoUnido = function(datos)
  {
      this.presupuesto = datos;
      $rootScope.$broadcast("ProyectoUnido");
  };

  service.PersonalizarPresupuesto = function(presupuesto)
  {
      //console.log(presupuesto);
      this.presupuesto = presupuesto;
      $rootScope.$broadcast("PersonalizarPresupuesto");
  };
    
  return service;
});

var pasoPresupuesto =   [
                            {nombre:"Datos", numero:1}, 
                            {nombre:"Módulos", numero:2}, 
                            {nombre:"Puertas", numero:3}, 
                            {nombre:"Accesorios", numero:4}, 
                            {nombre:"Cubierta", numero:5}
                        ];   
        