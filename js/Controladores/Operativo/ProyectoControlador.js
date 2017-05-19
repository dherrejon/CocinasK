app.controller("ProyectoControlador", function($scope, $rootScope, PRESUPUESTO, $http, $q, CONFIG, MEDIOCONTACTO, DOMICILIO, datosUsuario)
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
    
    $scope.componente = [];
    $scope.pieza = [];
    $scope.parteModulo = [];
    $scope.costoCombinacion = [];
    $scope.componenteEspecial = [];
    $scope.consumible = [];
    $scope.presupuesto = new Presupuesto();
    
    $scope.personaSeleccionada = false;
    
    $scope.detallePaso = pasoPresupuesto;
    
    $scope.clasePresupuesto = {
                            paso1:{nombre:"entrada", apellido1:"entrada", apellido2:"entrada", captacion:"dropdownlistModal", otro:"entrada"},
                            paso2:{tipoProyecto: "dropdownlistModal"},
                        };
    
    $scope.moduloAgregar = new ModuloPresupuesto();
    $scope.tipoModuloAgregar = [];
    $scope.tabSeleccionada = "";
    
    $scope.$on('AgregarPresupuestoCero',function()
    {
        $scope.operacion = "Agregar";
        $scope.presupuesto = new Presupuesto();
        
        $scope.presupuesto.Persona.NuevoContacto = [];
        $scope.presupuesto.Persona.NuevoDomicilio = [];
        $scope.presupuesto.Persona.UnidadNegocio = [];
        
        $scope.personaSeleccionada = false;
        $scope.pasoPresupuesto = 1;
        
        $scope.persona = [];
      
        $scope.mostrarContenido = {contacto:false, direccion:false, unidad:false};
        $scope.usuario = datosUsuario.getUsuario();
        
        $scope.CargarCatalogoPresupuesto();
        
        $scope.catalogo = {combinacion: false, modulo: false, puerta: false, accesorio:false, cubierta: false};
        
        $('#agregarPresupuestoModal').modal('toggle');
    });
    
    $scope.CargarCatalogoPresupuesto = function()
    {   
        //paso 1-2
        $scope.GetTipoProyecto();
        $scope.GetMedioCaptacion();
        $scope.GetUnidadNegocio();
    };
    
    $scope.GetCombincacionInicio = function()
    {
        if(!$scope.catalogo.combinacion)
        {
            //paso 3
            $scope.GetCombinacionMaterial();
            $scope.GetTipoCubierta();
            $scope.GetTipoCombinacionMaterial();  
                  
            
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
            $scope.GetUbicacionCubierta();
            
            $scope.catalogo.cubierta = true;
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
            console.log(data);
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
            
            console.log(data);
            
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
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetUnidadNegocio = function()
    {
        GetUnidadNegocioSencilla($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                for(var k=0; k<data.length; k++)
                {
                    if(data[k].UnidadNegocioId == $scope.usuario.UnidadNegocioId)
                    {
                        data[k].show = false;
                        $scope.presupuesto.Persona.UnidadNegocio[0] = data[k];
                    }
                    else
                    {
                        data[k].show = true;
                    }
                }
                
                $scope.unidadNegocio = data;
    
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
    
    $scope.GetUnidadNegocioPersona = function(id)              
    {
        GetUnidadNegocioPersona($http, $q, CONFIG, id).then(function(data)
        {
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
                console.log(data);
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
            $scope.GetColorGrupoMaqueo();
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetColorGrupoMaqueo = function()
    {
        GetGrupoPorColor($http, $q, CONFIG, "-1").then(function(data)
        {
            $scope.grupoColor = data;
            $scope.SetColorMaqueo();
            
            $scope.GetCubierta();
            
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
        
        console.log($scope.combinacion);
        console.log($scope.tipoCombinacion);
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
        for(var k=0; k<$scope.persona.length ;k++)
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
    
    $scope.CambiarTipoProyecto = function(tipo)
    {
        $scope.presupuesto.Proyecto.TipoProyecto = tipo;
    };
   
    
    $scope.AgregarDomicilio = function()
    {
        DOMICILIO.AgregarDomicilio("Proyecto");
    };
    
    $scope.$on('DomicilioAgregadoProyecto',function()
    {
        $scope.presupuesto.Persona.NuevoDomicilio.push(DOMICILIO.GetDomicilio());
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
                    $scope.presupuesto.Proyecto.Domicilio.DomicilioId =  domicilio.DireccionPersonaId;
                }
            }
        }
        
        if(domicilio.Seleccionado)
        {
            $scope.presupuesto.Domicilio = domicilio;
        }
        else
        {
            $scope.presupuesto.Domicilio = new Object();
            $scope.presupuesto.Domicilio.DomicilioId = "Unidad";
            
            if($rootScope.permisoOperativo.verTodosCliente)
            {
                if($scope.presupuesto.Persona.UnidadNegocio.length == 1)
                {
                    $scope.presupuesto.Domicilio.UnidadNegocioId = $scope.presupuesto.Persona.UnidadNegocio[0].UnidadNegocioId;
                }
            }
            else
            {
                 $scope.presupuesto.Domicilio.UnidadNegocioId = $scope.usuario.UnidadNegocioId;
            }
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
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        else
        {
            $scope.clasePresupuesto.paso2.tipoProyecto = "dropdownlistModal";
            $scope.pasoPresupuesto++;
            $scope.GetCombincacionInicio();
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
        if(!$scope.ValidarPaso3())
        {
            return;
        }
        else
        {
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
        
        var seleccion = false;
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
        {
            for(var k=0; k<$scope.combinacion.length; k++)
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
        
        console.log($scope.modulo);
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
            
            console.log(modulo);
            
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
    
    $scope.AgregarModulo = function()
    {
        $scope.presupuesto.Modulo.push($scope.SetModuloNuevo($scope.moduloAgregar));
        $scope.HideMedida($scope.moduloAgregar);
        $scope.AgregarTipoModulo($scope.moduloAgregar.TipoModulo);
        
        $scope.moduloAgregar.Ancho = "";
        $scope.moduloAgregar.Alto = "";
        $scope.moduloAgregar.Profundo = "";
    };
    
    $scope.SetModuloNuevo = function(modulo)
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
        
        m.Cantidad = 1;
        
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
    
    $scope.AgregarTipoModulo = function(tipo)
    {
        for(var k=0; k<$scope.tipoModuloAgregar.length; k++)
        {
            if($scope.tipoModuloAgregar[k].TipoModuloId == tipo.TipoModuloId)
            {
                $scope.tipoModuloAgregar[k].Cantidad++;
                return;
            }
        }
        
        var tipoModulo = new TipoModulo();
        tipoModulo.TipoModuloId = tipo.TipoModuloId;
        tipoModulo.Nombre = tipo.Nombre;
        tipoModulo.Cantidad = 1;
        
        $scope.tipoModuloAgregar.push(tipoModulo);
    };
    
    $scope.AgregarCantidad = function(modulo)
    {
        modulo.Cantidad++;
    };
    
    $scope.ReducirCantidad = function(modulo)
    {
        if((modulo.Cantidad-1) > 0)
        {
           modulo.Cantidad--; 
        }
    };
    
    $scope.QuitarModulo = function(modulo)
    {
        for(var k=0; k<$scope.tipoModuloAgregar.length; k++)
        {
            if(modulo.TipoModulo.TipoModuloId == $scope.tipoModuloAgregar[k].TipoModuloId)
            {
                $scope.tipoModuloAgregar[k].Cantidad--;
                if($scope.tipoModuloAgregar[k].Cantidad == 0)
                {
                    $scope.tipoModuloAgregar.splice(k,1);
                }
                break;
            }
        }
        
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
                return;
            }
        }
    };
    
    $scope.TerminarPaso4 = function()
    {
        $scope.GetServicioPuertaInicio();
        $scope.CalcularCantidadesPropuestas();
        $scope.pasoPresupuesto++;
        
        for(var k=0; k<$scope.presupuesto.Modulo.length; k++)
        {
                CalcularCostoModulo($scope.presupuesto.Modulo[k], $scope.combinacion);
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
            $scope.presupuesto.NumeroRiel = 2*$scope.presupuesto.NumeroCajon;
            
            
            //Superficie
             $scope.presupuesto.Superficie  += (FraccionADecimal($scope.presupuesto.Modulo[k].Alto) * FraccionADecimal($scope.presupuesto.Modulo[k].Ancho) * $scope.presupuesto.Modulo[k].Cantidad * 0.00064517);
            
        }
        
        $scope.presupuesto.Superficie = $scope.presupuesto.Superficie.toFixed(2);
        
        if($scope.presupuesto.NumeroPuerta === 0)
        {
            $scope.presupuesto.NumeroPuerta = "0";
        }
        if($scope.presupuesto.NumeroCajon === 0)
        {
            $scope.presupuesto.NumeroCajon = "0";
        }
        console.log($scope.presupuesto);
        
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
                    $scope.servicio[k].Subtotal = Math.round($scope.servicio[k].Subtotal);
                }
            }
            
            //precio venta de puertas
            CalcularCostoPuerta($scope.muestrario, $scope.presupuesto.Modulo, $scope.combinacion);
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
        
        console.log($scope.muestrario);
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
            case 38: console.log('up');
            break;
            */
            case 39:
              $scope.CambiarVerImagen(1);
              $scope.$apply();
              break;
            /*
            case 40: console.log('down');
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
                $scope.maqueo[k].Subtotal = Math.round($scope.maqueo[k].Subtotal);
            }
        }
        
        //Accesorios
        for(var k=0; k<$scope.tipoAccesorio.length; k++)
        {
            $scope.tipoAccesorio[k].showPrecio = false;
            //accesorio Compra - Venta
            if($scope.tipoAccesorio[k].ClaseAccesorio.ClaseAccesorioId == "1")
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
                        $scope.tipoAccesorio[k].Muestrario[i].Subtotal = Math.round($scope.tipoAccesorio[k].Muestrario[i].Subtotal);
                    }
                }
            }
            
            //Accesorio de madera
            if($scope.tipoAccesorio[k].ClaseAccesorio.ClaseAccesorioId == "2")
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
                                    $scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Subtotal = Math.round($scope.tipoAccesorio[k].Muestrario[i].Combinacion[ind].Subtotal);
                                }
                            }
                        }
                    }
                }
            }
        }
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
            for(var i=0; i<$scope.tipoAccesorio[k].Muestrario.length; i++)
            {
                if($scope.tipoAccesorio[k].Muestrario[i].PorDefecto && $scope.tipoAccesorio[k].Muestrario[i].Accesorio.length > 0)
                {
                    if($scope.tipoAccesorio[k].Cantidad === "" || $scope.tipoAccesorio[k].Cantidad === undefined)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "*Escribe una cantidad válida para " + $scope.tipoAccesorio[k].Nombre + ".";
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
                    alert("Este tipo de accesorio no cuenta con instrucciones.");
                }
            }

        }).catch(function(error)
        {
            alert(error);
        });
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
        
        return false;
    };
    
    $scope.TerminaPaso7 = function()
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
                    }
                }
            }
        }
        else
        {
            $scope.pasoPresupuesto = 9;
            $scope.SetTipoCombinacion();
        }
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
        $scope.pasoPresupuesto++;
        $scope.CalcularPrecioVentaCubierta();
    };
    
    /*----------------------------- Paso 9 -------------------------------------*/
    $scope.TerminarPaso9 = function()
    {
        $scope.pasoPresupuesto++;
        $scope.CrearPresupuestoBasico();
        //$scope.CalcularPrecioVenta();
    };
    
    /*----------------------------- Paso 10 -------------------------------------*/
    $scope.CalcularPrecioVentaCubierta = function()
    {
        /*console.log($scope.servicio);
        console.log($scope.maqueo);
        console.log($scope.tipoAccesorio);
        console.log($scope.cubierta);
        console.log($scope.ubicacion);*/

        console.log($scope.combinacion);
        
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
                                        
                                        CostoTotal += $scope.ubicacion[i].Fabricacion[l].Costo;
                                        break;
                                    }
                                }

                                var Subtotal = CostoTotal + (CostoTotal*($scope.cubierta[j].Margen/100));

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
                                    if($scope.ubicacion[i].Fabricacion[l].TipoCubiertaId == "2")
                                    {
                                        $scope.cubierta[j].Grupo[k].Ubicacion[ind].Cantidad = $scope.ubicacion[i].CantidadAglomerado; 
                                        $scope.cubierta[j].Grupo[k].Ubicacion[ind].Fabricacion = $scope.ubicacion[i].Fabricacion[l].Costo;
                                        
                                        CostoTotal += $scope.ubicacion[i].Fabricacion[l].Costo;
                                        break;
                                    }
                                }

                                var Subtotal = CostoTotal + (CostoTotal*($scope.cubierta[j].Margen/100));

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
        
        console.log($scope.ubicacion);
        console.log($scope.cubierta);
    };
    
    $scope.CrearPresupuestoBasico = function()
    {
        //combinacion
        var index = -1;
        var precio = 99999999999999;
        $scope.combinacionSeleccionada;
        
        if($scope.presupuesto.Proyecto.TipoProyecto.Mueble)
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
                index = -1;
                precio = 99999999999999;

                for(var j=0; j<$scope.tipoAccesorio[i].Muestrario.length; j++)
                {
                    if($scope.tipoAccesorio[i].Muestrario[j].PorDefecto && $scope.tipoAccesorio[i].Muestrario[j].Activo && ($scope.tipoAccesorio[i].Muestrario[j].Accesorio.length > 0))
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
                                if($scope.tipoAccesorio[i].Muestrario[j].Combinacion[k].CombinacionId == $scope.combinacionSeleccionada)
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
    };
    
    $scope.CambiarCombinacionPresupuesto = function(combinacion)
    {
        for(var k=0; k<$scope.combinacion.length; k++)
        {
                $scope.combinacion[k].Presupuesto = false;
        }
        
        combinacion.Presupuesto = true;
        
        $scope.combinacionSeleccionada = combinacion.CombinacionMaterialId;
        
        //$scope.SetMuestrarioCombinacion(combinacion);
        //$scope.SetAccesorioMaderaCombinacion(combinacion);
    };
    
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

        for(var k=0; k<tipo.Muestrario.length; k++)
        {
            if(muestrario != tipo.Muestrario[k].MuestrarioId)
            {
                tipo.Muestrario[k].Presupuesto = false;
            }
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
        console.log($scope.tipoAccesorio);
        
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
    };
    
    $scope.CalcularPrecioVentaCubiertaPiedra = function()
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
    };
    
});

app.factory('PRESUPUESTO',function($rootScope)
{
  var service = {};
  service.presupuesto = null;
    
  service.AgregarPresupuestoCero = function()
  {
      this.presupuesto = null;
      $rootScope.$broadcast('AgregarPresupuestoCero');
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
        