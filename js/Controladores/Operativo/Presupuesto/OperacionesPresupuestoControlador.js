app.controller("OperacionesPresupuesto", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $location, datosUsuario, OPEPRESUPUESTO, PRESUPUESTO)
{   
    //------------- Unir presupuestos -----------------
    $scope.cliente = [];
    $scope.proyecto = [];
    $scope.pres = [];
    $scope.usuario = datosUsuario.getUsuario();
    
    $scope.ciudad = ["aa", "a", "aguas", "aaguas", "todod"];
    
    $scope.$on('UnirPresupuestoCero',function()
    {
        $scope.opt = "cero";
        $scope.GetCliente();
        $scope.unir = [];
        $scope.presupuesto = {Cliente: null, Proyecto: null, Presupuesto: null};
        $scope.buscarCliente = "";
        $scope.noResultados = false;
        
        $('#unirPresupuesto').modal('toggle');
    });
    
    $scope.$on('UnirPresupuestoPreCargado',function()
    {
        $scope.opt = "pre";
        $scope.GetCliente();
        $scope.unir = [];
        $scope.presupuesto = {Cliente: null, Proyecto: null, Presupuesto: null};
        $scope.buscarCliente = "";
        $scope.noResultados = false;
         
        $scope.IniciarUnirPresupuesto();
        
        $('#unirPresupuesto').modal('toggle');
    });
    
    $scope.$on('ClonarPresupuestoGeneral',function()
    {
        $scope.GetCliente();
        $scope.clonar = new Presupuesto();
        $scope.buscarCliente = "";
        $scope.presupuesto = {Cliente: null, Proyecto: null, Presupuesto: null};
        $scope.noResultados = false;
        
        $('#clonarPresupuesto').modal('toggle');
    });

    
    $scope.IniciarUnirPresupuesto = function()
    {
        $scope.presupuesto.Cliente = OPEPRESUPUESTO.GetPersona();
        $scope.presupuesto.Proyecto = OPEPRESUPUESTO.GetProyecto();
        $scope.presupuesto.Presupuesto = OPEPRESUPUESTO.GetPresupuesto();
        
        $scope.presupuesto.Cliente.NombreCompleto = $scope.presupuesto.Cliente.Nombre + " " + $scope.presupuesto.Cliente.PrimerApellido + " " + $scope.presupuesto.Cliente.SegundoApellido;
        
        $scope.unir.push($scope.presupuesto);
        $scope.GetDatosPresupuesto($scope.unir[0].Presupuesto, 0);
        
        $scope.presupuesto = {Cliente: null, Proyecto: null, Presupuesto: null};
    };
    
    
    //------------- Catálogos ------------------
    $scope.GetCliente = function()
    {   
        var id = 0;
        if($rootScope.permisoOperativo.verTodosCliente)
        {
            id = -1;
        }
        else
        {
            id = $scope.usuario.UnidadNegocioId;    
        }
        
        GetCliente($http, $q, CONFIG, id).then(function(data)
        {
            $scope.datoCliente = data;

            for(var k=0; k<$scope.datoCliente.length; k++)
            {
                $scope.datoCliente[k].NombreA = $scope.QuitarAcento($scope.datoCliente[k].Nombre);
                $scope.datoCliente[k].PrimerApellidoA = $scope.QuitarAcento($scope.datoCliente[k].PrimerApellido);
                $scope.datoCliente[k].SegundoApellidoA = $scope.QuitarAcento($scope.datoCliente[k].SegundoApellido);
            }
            
            var sql = "Select DISTINCT PersonaId, Nombre, PrimerApellido, SegundoApellido, NombreA, PrimerApellidoA, SegundoApellidoA, CONCAT(Nombre, ' ', PrimerApellido, ' ', SegundoApellido) as NombreCompleto  FROM ? ";
            $scope.cliente = alasql(sql,[$scope.datoCliente]);
            
        }).catch(function(error)
        {
            $scope.cliente = [];
            alert(error);
        });
    };
    
    $scope.QuitarAcento = function(data)
    {
        var texto;
        texto = data.replace(/[Ááàäâ]/g, "a");
        texto = texto.replace(/[Ééèëê]/g, "e");
        texto = texto.replace(/[Ííìïî]/g, "i");
        texto = texto.replace(/[Óóòôö]/g, "o");
        texto = texto.replace(/[Úúùüü]/g, "u");
        texto = texto.toUpperCase();
        
        return texto;
    };
    
    $scope.GetProyectoPersona = function(id)              
    {
        GetProyectoPersona($http, $q, CONFIG, id).then(function(data)
        {
            $scope.proyecto = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPresupuestoPorProyecto = function(proyecto)              
    {
        GetPresupuestoPorProyecto($http, $q, CONFIG, proyecto.ProyectoId).then(function(data)
        {
            $scope.pres = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetDatosPresupuesto = function(presupuesto, index)              
    {
        GetDatosPresupuesto($http, $q, CONFIG, presupuesto).then(function(data)
        {
            $scope.unir[index].Presupuesto = data[1].Presupuesto;
         
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    $scope.GetDatosPresupuestoClon = function(presupuesto)              
    {
        GetDatosPresupuesto($http, $q, CONFIG, presupuesto).then(function(data)
        {
            $scope.presupuesto.Presupuesto = data[1].Presupuesto;
         
        }).catch(function(error)
        {
            $rootScope.mensaje = "Ha ocurrido un error intente más tarde.";
            $('#mensajePerfil').modal('toggle');
        });
    };
    
    //--------- Operaciones ----------------------
    $scope.LimpiarCliente = function()
    {
        $scope.buscarCliente = "";
        $scope.presupuesto = {Cliente: null, Proyecto: null, Presupuesto: null};
    };
    
    $scope.CambiarCliente = function()
    {
        $scope.presupuesto.Cliente = $scope.buscarCliente;
        $scope.presupuesto.Proyecto = null;
        $scope.presupuesto.Presupuesto = null;
        
        $scope.GetProyectoPersona($scope.buscarCliente.PersonaId);
    };
    
    $scope.CambiarProyecto = function(proyecto)
    {
        $scope.presupuesto.Proyecto = proyecto;
        $scope.presupuesto.Presupuesto = null;
        
        $scope.GetPresupuestoPorProyecto(proyecto);
    };
    
    $scope.CambiarPresupuesto = function(presupuesto)
    {
        $scope.presupuesto.Presupuesto = presupuesto;
    };
    
    $scope.AgregarPresupuesto = function()
    {
        $scope.unir.push(jQuery.extend({}, $scope.presupuesto));
    
        $scope.presupuesto.Proyecto = null;
        $scope.presupuesto.Presupuesto = null;
        
        
        $scope.GetDatosPresupuesto($scope.unir[$scope.unir.length - 1].Presupuesto, ($scope.unir.length - 1));
    };
    
    $scope.QuitarPresupuesto = function(index)
    {
        $scope.unir.splice(index,1);
    };
    
    $scope.GetPresupuestosOrdenados = function(presupuesto)
    {
        if(presupuesto !== undefined && presupuesto !== null)
        {
            if(presupuesto.length > 0)
            {
                presupuesto.sort(function(a, b){return (b.PresupuestoIdN - a.PresupuestoIdN)});
            }
        }
        
        return presupuesto;
    };
    
    
    $scope.UnirPresupuestos = function()
    {
        var final = new Object();
        
        //Datos generales
    
        //maqueo
        final.CantidadMaqueo = 0;
        final.FechaCreacion = null;
        final.DescripcionCliente = null;
        final.DescripcionInterna = null;
        final.NombreColaborador = "";
        final.NumeroCajon = 0;
        final.NumeroPuerta = 0;
        final.NumeroSeccionVacia = 0;
        final.Persona = new Persona();
        final.PersonaId = -1;
        final.PresupuestoId = -1;
        final.Proyecto = new Proyecto();
        final.Titulo = "";
        final.UsuarioId = -1;
        
        for(var  k=0; k<$scope.unir.length; k++)
        {
            //Maqueo
            if($scope.unir[k].Presupuesto.CantidadMaqueo !== undefined)
            {
                final.CantidadMaqueo += $scope.unir[k].Presupuesto.CantidadMaqueo;
            }
            
            if(k === 0)
            {
                //accesorios
                if($scope.unir[k].Presupuesto.Accesorio !== undefined)
                {
                    final.Accesorio = $scope.unir[0].Presupuesto.Accesorio;
                }
                else
                {
                    final.Accesorio = [];
                }
                
                //combinacion material
                if($scope.unir[k].Presupuesto.CombinacionMaterial !== undefined)
                {
                    final.CombinacionMaterial = $scope.unir[0].Presupuesto.CombinacionMaterial;
                }
                else
                {
                    final.CombinacionMaterial = [];
                }
                
                //Maqueo
                if($scope.unir[k].Presupuesto.Maqueo !== undefined)
                {
                    final.Maqueo = $scope.unir[0].Presupuesto.Maqueo;
                }
                else
                {
                    final.Maqueo = [];
                }
                
                //Modulo
                if($scope.unir[k].Presupuesto.Modulo !== undefined)
                {
                    final.Modulo = $scope.unir[0].Presupuesto.Modulo;
                }
                else
                {
                    final.Modulo = [];
                }
                
                //Puerta
                if($scope.unir[k].Presupuesto.Puerta !== undefined)
                {
                    final.Puerta = $scope.unir[0].Presupuesto.Puerta;
                }
                else
                {
                    final.Puerta = [];
                }
                
                //Servicio
                if($scope.unir[k].Presupuesto.Servicio !== undefined)
                {
                    final.Servicio = $scope.unir[0].Presupuesto.Servicio;
                }
                else
                {
                    final.Servicio = [];
                }
                
                //Tipo Cubierta
                if($scope.unir[k].Presupuesto.TipoCubierta !== undefined)
                {
                    final.TipoCubierta = $scope.unir[0].Presupuesto.TipoCubierta;
                }
                else
                {
                    final.TipoCubierta = [];
                }
            }
            else
            {
                //accesorios
                if($scope.unir[k].Presupuesto.Accesorio !== undefined)
                {
                    
                    for(var i=0; i<$scope.unir[k].Presupuesto.Accesorio.length; i++)
                    {
                        var agregado = false;
                        
                        for(var j=0; j<final.Accesorio.length; j++)
                        {
                            if(final.Accesorio[j].TipoAccesorioId == $scope.unir[k].Presupuesto.Accesorio[i].TipoAccesorioId)
                            {
                                agregado = true;
                                final.Accesorio[j].Cantidad = parseInt(final.Accesorio[j].Cantidad ) + parseInt($scope.unir[k].Presupuesto.Accesorio[i].Cantidad);
                                
                                for(var l=0; l<$scope.unir[k].Presupuesto.Accesorio[i].Muestrario.length; l++)
                                {
                                    var muestrario = false;
                                    
                                    for(var m=0; m<final.Accesorio[j].Muestrario.length; m++)
                                    {
                                        if(final.Accesorio[j].Muestrario[m].MuestrarioId == $scope.unir[k].Presupuesto.Accesorio[i].Muestrario[l].MuestrarioId)
                                        {
                                            muestrario = true;
                                            break;
                                        }
                                    }
                                    
                                    if(!muestrario)
                                    {
                                        final.Accesorio[j].Muestrario.push($scope.unir[k].Presupuesto.Accesorio[i].Muestrario[l]);
                                    }
                                }
                                
                                break;
                            }
                        }
                        
                        if(!agregado)
                        {
                            final.Accesorio.push($scope.unir[k].Presupuesto.Accesorio[i]);
                        }
                    }
                }
                
                //combinacion material
                if($scope.unir[k].Presupuesto.CombinacionMaterial !== undefined)
                {
                    for(var i=0; i<$scope.unir[k].Presupuesto.CombinacionMaterial.length; i++)
                    {
                        var agregado = false;
                        for(var j=0; j<final.CombinacionMaterial.length; j++)
                        {
                            if(final.CombinacionMaterial[j].CombinacionMaterialId == $scope.unir[k].Presupuesto.CombinacionMaterial[i].CombinacionMaterialId)
                            {
                                agregado = true;
                                break;
                            }
                        }
                        
                        if(!agregado)
                        {
                            final.CombinacionMaterial.push($scope.unir[k].Presupuesto.CombinacionMaterial[i]);
                        }
                    }
                }
                
                //Maqueo
                if($scope.unir[k].Presupuesto.Maqueo !== undefined)
                {
                    for(var i=0; i<$scope.unir[k].Presupuesto.Maqueo.length; i++)
                    {
                        var agregado = false;
                        for(var j=0; j<final.Maqueo.length; j++)
                        {
                            if(final.Maqueo[j].MaqueoId == $scope.unir[k].Presupuesto.Maqueo[i].MaqueoId)
                            {
                                agregado = true;
                                break;
                            }
                        }
                        
                        if(!agregado)
                        {
                            final.Maqueo.push($scope.unir[k].Presupuesto.Maqueo[i]);
                        }
                    }
                }
                
                //Modulo
                if($scope.unir[k].Presupuesto.Modulo !== undefined)
                {
                    for(var i=0; i<$scope.unir[k].Presupuesto.Modulo.length; i++)
                    {
                        var agregado = false;
                        for(var j=0; j<final.Modulo.length; j++)
                        {
                            if(final.Modulo[j].ModuloId == $scope.unir[k].Presupuesto.Modulo[i].ModuloId && final.Modulo[j].Ancho == $scope.unir[k].Presupuesto.Modulo[i].Ancho && final.Modulo[j].Alto == $scope.unir[k].Presupuesto.Modulo[i].Alto && final.Modulo[j].Profundo == $scope.unir[k].Presupuesto.Modulo[i].Profundo) 
                            {
                                agregado = true;
                                final.Modulo[j].Cantidad = parseInt(final.Modulo[j].Cantidad) + parseInt($scope.unir[k].Presupuesto.Modulo[i].Cantidad);
                                break;
                            }
                        }
                        
                        if(!agregado)
                        {
                            final.Modulo.push($scope.unir[k].Presupuesto.Modulo[i]);
                        }
                    }
                }
                
                //Puerta
                if($scope.unir[k].Presupuesto.Puerta !== undefined)
                {
                    for(var i=0; i<$scope.unir[k].Presupuesto.Puerta.length; i++)
                    {
                        var agregado = false;
                        for(var j=0; j<final.Puerta.length; j++)
                        {
                            if(final.Puerta[j].MuestrarioId == $scope.unir[k].Presupuesto.Puerta[i].MuestrarioId)
                            {
                                agregado = true;
                                break;
                            }
                        }
                        
                        if(!agregado)
                        {
                            final.Puerta.push($scope.unir[k].Presupuesto.Puerta[i]);
                        }
                    }
                }
                
                //Servicio
                if($scope.unir[k].Presupuesto.Servicio !== undefined)
                {
                    for(var i=0; i<$scope.unir[k].Presupuesto.Servicio.length; i++)
                    {
                        var agregado = false;
                        for(var j=0; j<final.Servicio.length; j++)
                        {
                            if(final.Servicio[j].ServicioId == $scope.unir[k].Presupuesto.Servicio[i].ServicioId)
                            {
                                agregado = true;
                                final.Servicio[j].Cantidad = parseFloat(final.Servicio[j].Cantidad) + parseFloat($scope.unir[k].Presupuesto.Servicio[i].Cantidad);
                                break;
                            }
                        }
                        
                        if(!agregado)
                        {
                            final.Servicio.push($scope.unir[k].Presupuesto.Servicio[i]);
                        }
                    }
                }
                
                //Tipo Cubierta
                if($scope.unir[k].Presupuesto.TipoCubierta !== undefined)
                {
                    for(var i=0; i<$scope.unir[k].Presupuesto.TipoCubierta.length; i++)
                    {
                        var agregado = false;
                        for(var j=0; j<final.TipoCubierta.length; j++)
                        {
                            if(final.TipoCubierta[j].TipoCubiertaId == $scope.unir[k].Presupuesto.TipoCubierta[i].TipoCubiertaId)
                            {
                                //material
                                for(var m=0; m<$scope.unir[k].Presupuesto.TipoCubierta[i].Material.length; m++)
                                {
                                    var material = false;
                                    for(var n=0; n<final.TipoCubierta[j].Material.length; n++)
                                    {
                                        if($scope.unir[k].Presupuesto.TipoCubierta[i].Material[m].MaterialId == final.TipoCubierta[j].Material[n].MaterialId && $scope.unir[k].Presupuesto.TipoCubierta[i].Material[m].GrupoId == final.TipoCubierta[j].Material[n].GrupoId)
                                        {
                                            material = true;
                                            break;
                                        }
                                    }
                                    
                                    if(!material)
                                    {
                                        final.TipoCubierta[j].Material.push($scope.unir[k].Presupuesto.TipoCubierta[i].Material[m]);
                                    }
                                }
                                
                                //ubicacion
                                for(var m=0; m<$scope.unir[k].Presupuesto.TipoCubierta[i].Ubicacion.length; m++)
                                {
                                    var ubicacion = false;
                                    for(var n=0; n<final.TipoCubierta[j].Ubicacion.length; n++)
                                    {
                                        if($scope.unir[k].Presupuesto.TipoCubierta[i].Ubicacion[m].UbicacionCubiertaId == final.TipoCubierta[j].Ubicacion[n].UbicacionCubiertaId)
                                        {
                                            ubicacion = true;
                                            
                                            if($scope.unir[k].Presupuesto.TipoCubierta[i].TipoCubiertaId == "1")
                                            {
                                                final.TipoCubierta[j].Ubicacion[n].Cantidad = parseInt(final.TipoCubierta[j].Ubicacion[n].Cantidad) + parseInt($scope.unir[k].Presupuesto.TipoCubierta[i].Ubicacion[m].Cantidad);
                                            }
                                            else if($scope.unir[k].Presupuesto.TipoCubierta[i].TipoCubiertaId == "2")
                                            {
                                                for(var p=0; p<$scope.unir[k].Presupuesto.TipoCubierta[i].Ubicacion[m].Seccion.length; p++)
                                                {
                                                    final.TipoCubierta[j].Ubicacion[n].Seccion.push($scope.unir[k].Presupuesto.TipoCubierta[i].Ubicacion[m].Seccion[p]);
                                                }
                                            }
                                            
                                            break;
                                        }
                                    }
                                    
                                    if(!ubicacion)
                                    {
                                        final.TipoCubierta[j].Ubicacion.push($scope.unir[k].Presupuesto.TipoCubierta[i].Ubicacion[m]);
                                    }
                                }
                                
                                agregado = true;
                                break;
                            }
                        }
                        
                        if(!agregado)
                        {
                            final.TipoCubierta.push($scope.unir[k].Presupuesto.TipoCubierta[i]);
                        }
                    }
                }
            }
        }

        if($scope.opt == "cero")
        {
            PRESUPUESTO.UnirPresupuesto(final, null, null);
        }
        else if($scope.opt == "pre")
        {
            PRESUPUESTO.UnirPresupuesto(final, $scope.unir[0].Cliente, $scope.unir[0].Proyecto);
        }
        
        $('#unirPresupuesto').modal('toggle');
    };
    
    //------------ Clonar --------------
    $scope.CambiarPresupuestoClon = function(presupuesto)
    {
        $scope.presupuesto.Presupuesto = presupuesto;
        $scope.GetDatosPresupuestoClon($scope.presupuesto.Presupuesto);
    };    
    
    $scope.ClonarPresupuestos = function()
    {
        if($scope.presupuesto.Presupuesto !== undefined && $scope.presupuesto.Presupuesto !== null )
        {
            if($scope.presupuesto.Presupuesto.PresupuestoId.length > 0)
            {
                $scope.presupuesto.Presupuesto.Persona = null;
                $scope.presupuesto.Presupuesto.Proyecto = null;
            
                PRESUPUESTO.ClonarPresupuesto($scope.presupuesto.Presupuesto);
                
                $('#clonarPresupuesto').modal('toggle');
            }
            else
            {
                $scope.mensajeError = [];
                $scope.mensajeError[0] = "*Selecciona un presupuesto.";
            }
        }
        else
        {
            $scope.mensajeError = [];
            $scope.mensajeError[0] = "*Selecciona un presupuesto.";
        }
    };
    
    $scope.CerrarClon = function()
    {
        $scope.mensajeError = [];
    };
    
});


app.factory('OPEPRESUPUESTO',function($rootScope)
{
  var service = {};
  service.presupuesto = null;
  service.persona = null;
  service.proyecto = null;
    
  service.UnirPresupuesto = function()
  {
      $rootScope.$broadcast('UnirPresupuestoCero');
  };
    
  service.ClonarPresupuesto = function()
  {
      $rootScope.$broadcast('ClonarPresupuestoGeneral');
  };
    
  service.UnirPresupuestoPreCargado = function(presupuesto, persona, proyecto)
  {
      this.presupuesto = presupuesto;
      this.persona = persona;
      this.proyecto = proyecto;
      $rootScope.$broadcast('UnirPresupuestoPreCargado');
  };

  service.GetPresupuesto = function()
  {
      return this.presupuesto;
  }; 
    
  service.GetPersona = function()
  {
      return this.persona;
  }; 
    
  service.GetProyecto = function()
  {
      return this.proyecto;
  }; 
    
  return service;
});




