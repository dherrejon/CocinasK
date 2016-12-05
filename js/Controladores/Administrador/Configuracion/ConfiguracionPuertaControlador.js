app.controller("ConfiguracionPuertaControlador", function($scope, $http, $q, CONFIG, $rootScope, datosUsuario, $window, $filter)
{   
    $scope.titulo = "Puerta";
    $scope.tabs = tabPuerta;

    $scope.muestrario = null;
    $scope.puerta = null;
    
    $scope.puertaPorMuestrario = null;      //las puestas que pertenecen a un mismo muestrario
    $scope.componentePorPuerta = null;      //los componentes de una puerta en Detalles
    $scope.componente = null;               //Componentes que puede tener una puerta
    $scope.pieza = null;                    //Componentes que puede tener una puerta
    $scope.componenteOriginal = null;
    $scope.componentePorPuertaOriginal = [];
    
    $scope.buscarPieza = "";
    $scope.buscarPuerta = "";
    $scope.ordenar  = "Nombre";
    $scope.mostrarComponentePuerta = "";
    $scope.filtroCheckbox = [];
    $scope.claseMuestrario = {nombre:"entrada"};
    $scope.clasePuerta = {muestrario:"dropdownListModal", nombre:"entrada"};
    $scope.mostrarPieza = {texto:"<<", mostrar:true};
    
    $scope.mostrarFiltro = {muestrario:true, activo:false};
    $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            muestrario:[]
                     };
    
    $scope.componenteActualId = "";
    
    //Cambia el contenido de la pestaña
    $scope.SeleccionarTab = function(tab, index)    
    {
        $scope.titulo = tab.titulo;
        
        switch (index)
        {
            case 0:  
                $('#Puerta').show();
                $('#Muestrario').hide();
                break;
            case 1:
                $('#Muestrario').show();
                $('#Puerta').hide();
                break;
            default:
                break;
        }        
    };
    
    $scope.GetMuestrarioPuerta = function()      
    {
        GetMuestrarioPuerta($http, $q, CONFIG).then(function(data)
        {
            $scope.muestrario = data;
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
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetPuertaPorMuestrario = function(muestrarioId)      
    {
        GetPuertaPorMuestrario($http, $q, CONFIG, muestrarioId).then(function(data)
        {
            $scope.puertaPorMuestrario = data;
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetComponentePorPuerta = function(puertaId)      
    {
        GetComponentePorPuerta($http, $q, CONFIG, puertaId).then(function(data)
        {
            $scope.componentePorPuerta = data;
            
            for(var k=0; k<$scope.componentePorPuerta.length; k++)
            {
                for(var i=0; i<$scope.componente.length; i++)
                {
                    if(!$scope.componente[i].seleccionado)
                    {
                        if($scope.componente[i].ComponenteId == $scope.componentePorPuerta[k].ComponenteId)
                        {
                            $scope.componente[i].seleccionado = true;
                            $scope.componenteOriginal[i].seleccionado = true;
                            break;
                        }
                    }
                }
                $scope.componentePorPuertaOriginal[k] = $scope.CopiarComponentePorPuerte($scope.componentePorPuerta[k]);
                
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.CopiarComponentePorPuerte = function(componente)
    {
        var nuevoComponente = new Object();
        
        nuevoComponente.NombrePieza = componente.NombrePieza;
        nuevoComponente.PiezaId = componente.PiezaId;
        nuevoComponente.NombreComponente = componente.NombreComponente;
        nuevoComponente.ComponenteId = componente.ComponenteId;
        nuevoComponente.Cantidad = componente.Cantidad;
        nuevoComponente.ComponentePorPuertaId = componente.ComponentePorPuertaId;
        nuevoComponente.PiezaPorComponentePuertaId = componente.PiezaPorComponentePuertaId;
        
        return nuevoComponente;
    };
    
    /*-------------------------Puerta-----------------------------*/
    
    /*------ Ordenar ------------*/
    //cambia el campo por el cual se van a ordenar las puertas
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenar == campoOrdenar)
        {
            $scope.ordenar = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenar = campoOrdenar;
        }
    };
    
    /*--------Filtrar------------*/
    $scope.FiltroPuerta = function(puerta)
    {
        if($scope.filtro.activo.activo != $scope.filtro.activo.inactivo)
        {
            if($scope.filtro.activo.activo)
            {
                if(!puerta.Activo)
                {
                    return false;
                }
            }
            if($scope.filtro.activo.inactivo)
            {
                if(puerta.Activo)
                {
                    return false;
                }
            }   
        }
        
        if($scope.filtro.muestrario.length === 0)
        {
            return true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.muestrario.length; k++)
            {
                if(puerta.Muestrario.Nombre == $scope.filtro.muestrario[k])
                {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    $scope.setFiltro = function(campo)
    {
        for(var k=0; k<$scope.filtro.muestrario.length; k++)
        {
            if($scope.filtro.muestrario[k] == campo)
            {
                $scope.filtro.muestrario.splice(k,1);
                return;
            }
        }
        $scope.filtro.muestrario.push(campo);
        return;
    };
    
    $scope.MostrarFiltros = function(filtro)
    {
        if(filtro == "muestrario")
        {
            $scope.mostrarFiltro.muestrario =  !$scope.mostrarFiltro.muestrario;
        }
        else if(filtro == "activo")
        {
            $scope.mostrarFiltro.activo =  !$scope.mostrarFiltro.activo;
        }
    };
    
    $scope.LimpiarFiltro = function()
    {
        $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            muestrario:[]
                        };
        
        $scope.filtroCheckbox = [];
    };
    
    /*------Detalles----------------*/
    $scope.AbrirDetallesPuerta = function(puerta)
    {
        $scope.detallePuerta = puerta;
        
        $scope.GetComponentePorPuerta(puerta.PuertaId);
        
        $('#DetallesComponentePuerta').modal('toggle');
    };
    
    $scope.MostraPiezaPorComponentePieza = function(componente)
    {
        if(componente != $scope.mostrarComponentePuerta)
        {
            $scope.mostrarComponentePuerta = componente;
        }
        else
        {
            $scope.mostrarComponentePuerta = "";
        }
    };
    
    $scope.GetClaseDetallesComponente = function(componente)
    {
        if($scope.mostrarComponentePuerta == componente)
        {
            return "botonOperacionMarcoNaranja";
        }
        else
        {
            return "botonOperacion";
        }
    };
    
    /*----------------Editar - Agregar Puerta -----------------------*/
    $scope.AbrirPuertaForma = function(operacion, puerta)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevaPuerta = new Puerta();
            
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].seleccionado = true;
            }
            $scope.componentePorPuerta = [];
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaPuerta = SetPuerta(puerta);
            $scope.nuevaPuerta.Muestrario = SetMuestrario(puerta.Muestrario);
            
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].seleccionado = false;
                $scope.componenteOriginal[k].seleccionado = false;
            }
            
            $scope.GetComponentePorPuerta(puerta.PuertaId);
        }
        
        if($scope.pieza === null)
        {
           $scope.GetPieza();
        }
        
        $('#puertaModal').modal('toggle');
    };
    
    $scope.CambiarMuestrario = function(muestrario)
    {
        $scope.nuevaPuerta.Muestrario.MuestrarioId = muestrario.MuestrarioId;
        $scope.nuevaPuerta.Muestrario.Nombre = muestrario.Nombre;
    };
    
    $scope.CambiarComponenteSeleccionado = function(componente)
    {
        componente.seleccionado = !componente.seleccionado; 
        if(componente.ComponenteId == $scope.componenteActualId)
        {
            $scope.componenteActualId = "";
        }
    }; 
    
    $scope.GetClaseComponente = function(seleccionado)
    {
        if(seleccionado)
        {
            return "checkSeleccionado";
        }
        else
        {
            return "checkNoSeleccionado";
        }
    };
    
    $scope.GetClaseComponenteSeleccionado = function(componenteId)
    {
        if($scope.componenteActualId == componenteId)
        {
            return "resaltarSeleccion";
        }
        
        return "";
    };
    
    $scope.AgregarPiezaComponente = function(pieza, componente)
    {
        var index = $scope.componentePorPuerta.length;
        
        $scope.componentePorPuerta[index] = new Object();
       
        $scope.componentePorPuerta[index].ComponenteId = componente.ComponenteId;
        $scope.componentePorPuerta[index].NombreComponente = componente.Nombre;
        $scope.componentePorPuerta[index].PiezaId = pieza.PiezaId;
        $scope.componentePorPuerta[index].NombrePieza = pieza.Nombre;
        $scope.componentePorPuerta[index].Cantidad = 1;
    };
    
    $scope.RemoverCantidadPieza = function(pieza)
    {
        if((pieza.Cantidad-1) > 0)
        {
            pieza.Cantidad--;    
        }
    };
    
    $scope.AgregarCantidadPieza = function(pieza)
    {
        pieza.Cantidad++;    
    };
    
    $scope.QuitarPieza = function(pieza)
    {
        for(var k=0; k<$scope.componentePorPuerta.length; k++)
        {
            if(pieza.ComponenteId == $scope.componentePorPuerta[k].ComponenteId && pieza.PiezaId == $scope.componentePorPuerta[k].PiezaId)
            {
                $scope.componentePorPuerta.splice(k,1);
            }
        }
    };
    
    $scope.FitrarPieza = function( pieza)
    {
        if($scope.componentePorPuerta !== null)
        {
            for(var k=0; k<$scope.componentePorPuerta.length; k++)
            {
                if($scope.componentePorPuerta[k].ComponenteId == $scope.componenteActualId && $scope.componentePorPuerta[k].PiezaId == pieza.PiezaId)
                {
                    return false;
                }
            }
        }
            
        return true;
    };
    
    $scope.CambiarComponenteActual = function(componenteId)
    {
        if(componenteId != $scope.componenteActualId)
        {
            $scope.componenteActualId = componenteId;
        }
        else
        {
            $scope.componenteActualId = "";
        }
    };
    
    $scope.CambiarMostrarPiezas = function()
    {
        $scope.mostrarPieza.mostrar = !$scope.mostrarPieza.mostrar;
        if($scope.mostrarPieza.mostrar)
        {
            $scope.mostrarPieza.texto = "<<";
        }
        else
        {
            $scope.mostrarPieza.texto = ">>";
        }
    };
    
    //--------Terminar de editar agregar
    $scope.ValidarDatos = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        var datoInvalido = true;
        
        if(nombreInvalido)
        {
            $scope.clasePuerta.nombre = "entradaError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";   
        }
        else
        {
            $scope.clasePuerta.nombre = "entrada";
        }
        if($scope.nuevaPuerta.Muestrario.MuestrarioId === "")
        {
            $scope.clasePuerta.muestrario = "dropdownListModalError";
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un muestrario.";
        }
        else
        {
            $scope.clasePuerta.muestrario = "dropdownListModal";
        }
        
        
        for(var k=0; k<$scope.componente.length; k++)
        {
            if($scope.componente[k].seleccionado)
            {
                datoInvalido = false;
                break;
            }
        }
        if(datoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de selecionar al menos un componente.";
            
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].clase = "botonOperacionError";
            }
        }
        else
        {
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].clase = "botonOperacion";
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
    
        for(var k=0; k<$scope.componente.length; k++)
        {
            if($scope.componente[k].seleccionado)
            {
                datoInvalido = true;
                for(var i=0; i<$scope.componentePorPuerta.length; i++)
                {
                    if($scope.componentePorPuerta[i].ComponenteId == $scope.componente[k].ComponenteId)
                    {
                       datoInvalido = false;
                       break;
                    }
                }
                if(datoInvalido)
                {
                    $scope.componente[k].clase = "botonOperacionError";
                    $scope.mensajeError[$scope.mensajeError.length] = "*El componente " + $scope.componente[k].Nombre + " debe de contar con almenos una pieza.";
                }
                else
                {
                    $scope.componente[k].clase = "botonOperacion";
                }
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
            
        for(var k=0; k<$scope.puerta.length; k++)
        {
            if($scope.nuevaPuerta.Nombre == $scope.puerta[k].Nombre && $scope.nuevaPuerta.PuertaId != $scope.puerta[k].PuertaId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*La puerta "+ $scope.nuevaPuerta.Nombre + " ya existe.";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.SetValoresAgregar = function()
    {
        $scope.nuevaPuerta.Componente = $scope.componente;
        $scope.nuevaPuerta.componentePorPuerta = $scope.componentePorPuerta;
    };
    
    $scope.SetValoresEditarComponente = function()
    {
        var componenteBorrar = [];
        var componenteAgregar = [];
        var componenteEditar = [];
        
        for(var i=0; i<$scope.componenteOriginal.length; i++)
        {
            if($scope.componenteOriginal[i].seleccionado && !$scope.componente[i].seleccionado)
            {
                componenteBorrar[componenteBorrar.length] = $scope.componente[i].ComponenteId;
            }
            
            if(!$scope.componenteOriginal[i].seleccionado && $scope.componente[i].seleccionado)
            {
                componenteAgregar[componenteAgregar.length] = $scope.componente[i].ComponenteId;
            }
            if($scope.componenteOriginal[i].seleccionado && $scope.componente[i].seleccionado)
            {
                componenteEditar[componenteEditar.length] = $scope.componente[i].ComponenteId;
            }
        }
        
        $scope.nuevaPuerta.componenteEditar = componenteEditar;
        $scope.nuevaPuerta.componenteAgregar = componenteAgregar;
        $scope.nuevaPuerta.componenteBorrar = componenteBorrar;
    };
    
    $scope.SetValoresEditarComponentePorPuerta = function()
    { 
        var piezaPorComponenteAgregar = [];
        var piezaPorComponenteBorrar = [];
        var piezaPorComponenteEditar = [];
        
        var datoEncontrado;
        for(var i=0; i<$scope.componentePorPuerta.length; i++)
        {
            datoEncontrado = false;
            for(var k=0; k<$scope.componentePorPuertaOriginal.length; k++)
            {
                if($scope.componentePorPuertaOriginal[k].ComponenteId == $scope.componentePorPuerta[i].ComponenteId && $scope.componentePorPuertaOriginal[k].PiezaId == $scope.componentePorPuerta[i].PiezaId)
                {
                    datoEncontrado = true;
                    break;
                }
            }
            
            if(datoEncontrado)
            {
                for(var j=0; j<$scope.componente.length; j++)
                {
                    if($scope.componente[j].ComponenteId == $scope.componentePorPuerta[i].ComponenteId && $scope.componente[j].seleccionado)
                    {
                        piezaPorComponenteEditar[piezaPorComponenteEditar.length] = $scope.componentePorPuerta[i];
                        break;
                    }
                }
            }
            else
            {
                for(var j=0; j<$scope.componente.length; j++)
                {
                    if($scope.componente[j].ComponenteId == $scope.componentePorPuerta[i].ComponenteId && $scope.componente[j].seleccionado)
                    {
                        piezaPorComponenteAgregar[piezaPorComponenteAgregar.length] = $scope.componentePorPuerta[i];
                        break;
                    }
                }
            }
        }
        
        for(var i=0; i<$scope.componentePorPuertaOriginal.length; i++)
        {
            datoEncontrado = false;
            for(var k=0; k<$scope.componentePorPuerta.length; k++)
            {
                if($scope.componentePorPuertaOriginal[i].ComponenteId == $scope.componentePorPuerta[k].ComponenteId && $scope.componentePorPuertaOriginal[i].PiezaId == $scope.componentePorPuerta[k].PiezaId)
                {
                    datoEncontrado = true;
                    break;
                }
            }
            if(!datoEncontrado)
            {
                piezaPorComponenteBorrar[piezaPorComponenteBorrar.length] = $scope.componentePorPuertaOriginal[i];
            }
        }
        
        $scope.nuevaPuerta.piezaPorComponenteAgregar = piezaPorComponenteAgregar;
        $scope.nuevaPuerta.piezaPorComponenteBorrar = piezaPorComponenteBorrar;
        $scope.nuevaPuerta.piezaPorComponenteEditar = piezaPorComponenteEditar;
    };
    
    $scope.TerminarPuerta = function(nombreInvalido)
    {
        if(!$scope.ValidarDatos(nombreInvalido))
        {
            return;
        }
        
        if($scope.operacion == "Agregar")
        {
            $scope.SetValoresAgregar ();
            $scope.AgregarPuerta();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.SetValoresEditarComponente();
            $scope.SetValoresEditarComponentePorPuerta();
            
            $scope.EditarPuerta();
        }
    };
    
    $scope.AgregarPuerta = function()
    {
        AgregarPuerta($http, CONFIG, $q, $scope.nuevaPuerta).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetPuerta();
                $scope.CerrarPuerta();
                
                $('#puertaModal').modal('toggle');
                $scope.mensaje = "La puerta se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeConfigurarPuerta').modal('toggle');
    };
    
    $scope.EditarPuerta = function()
    {
        EditarPuerta($http, CONFIG, $q, $scope.nuevaPuerta).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetPuerta();
                $scope.CerrarPuerta();
                
                $('#puertaModal').modal('toggle');
                $scope.mensaje = "La puerta se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeConfigurarPuerta').modal('toggle');
    };
    
    $scope.CerrarPuerta = function()
    {
        $scope.componenteActualId = ""; 
        $scope.mensajeError = [];
        $scope.clasePuerta = {nombre:"entrada", muestrario:"dropdownListModal"};
        
        for(var k=0; k<$scope.componente.length; k++)
        {
            $scope.componente.clase = "botonOperacion";
        }
    };
    
    /*--------------------------Muestrario ------------------------------*/
    
    /*------------ Detalles ----------------*/
    $scope.AbrirDetallesMuestrario = function(muestrario)
    {
        $scope.detalleMuestrario = muestrario;
        
        $scope.GetPuertaPorMuestrario(muestrario.MuestrarioId);
        
        $('#DetallesPuertaMuestrario').modal('toggle');
    };
    
    /*Agregar-Editar muestrario*/
    $scope.AbrirMuestrarioModal = function(operacion, muestrario)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoMuestrario = new Muestrario();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoMuestrario = SetMuestrario(muestrario);
        }
        
        $('#muestrarioModal').modal('toggle');
    };
    
    $scope.TerminarMuestrario = function(nombreInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";   
            $scope.claseMuestrario.nombre = "entradaError";
        }
        else
        {
            $scope.claseMuestrario.nombre = "entrada";
        }
         
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.muestrario.length; k++)
        {
            if($scope.nuevoMuestrario.Nombre == $scope.muestrario[k].Nombre && $scope.nuevoMuestrario.MuestrarioId != $scope.muestrario[k].MuestrarioId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "El muestario " + $scope.nuevoMuestrario.Nombre + " ya existe.";
                $scope.claseMuestrario.nombre = "entradaError";
                return;
            }
        }
        
        $scope.nuevoMuestrario.TipoMuestrarioId = 1;  // tipo de muestrario de puertas
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarMuestrario();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarMuestrario();
        }        
    };
    
    $scope.AgregarMuestrario = function()
    {
        AgregarMuestrario($http, CONFIG, $q, $scope.nuevoMuestrario).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetMuestrarioPuerta();
                
                $('#muestrarioModal').modal('toggle');
                $scope.mensaje = "El muestrario se ha agregado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeConfigurarPuerta').modal('toggle');
    };
    
    $scope.EditarMuestrario = function()
    {
        EditarMuestrario($http, CONFIG, $q, $scope.nuevoMuestrario).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetMuestrarioPuerta();

                $('#muestrarioModal').modal('toggle');
                $scope.mensaje = "El muestrario se ha editado.";
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeConfigurarPuerta').modal('toggle');
    };
    
    $scope.CerrarMuestrarioForma = function()
    {
        $scope.mensajeError = [];
        $scope.claseMuestrario = {nombre:"entrada"};
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
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + objeto.Nombre + "?";
        }
        
        $('#modalActivarDesactivarConfigurarPuerta').modal('toggle');
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
        
        if($scope.seccionCambiarActivo == "puerta")
        {
            datos[1] = $scope.objetoActivo.PuertaId;
            
            ActivarDesactivarPuerta($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "La puerta se ha actualizado correctamente.";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarPuerta').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarPuerta').modal('toggle');
            });
            
            if($scope.objetoActivo.Activo)
            {
                $scope.objetoActivo.ActivoN = 1;
            }
            else
            {
                $scope.objetoActivo.ActivoN = 0;
            }
        }
        
        if($scope.seccionCambiarActivo == "muestrario")
        {
            datos[1] = $scope.objetoActivo.MuestrarioId;
            
            ActivarDesactivarMuestrario($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El muestrario se ha actualizado correctamente.";
                }
                else
                {
                    $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeConfigurarPuerta').modal('toggle');
            }).catch(function(error)
            {
                $scope.objetoActivo.Activo = !$scope.objetoActivo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeConfigurarPuerta').modal('toggle');
            });
        }    
    };
    
    /*-----------Otros Catálogos-----------*/
    $scope.GetComponentePuerta = function()      
    {
        GetComponentePuerta($http, $q, CONFIG).then(function(data)
        {            
            $scope.componente = data;
            $scope.componenteOriginal = [];
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].clase = "botonOperacion";
                $scope.componenteOriginal[k] = $scope.SetComponenteCopia($scope.componente[k]);
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
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
    
    $scope.SetComponenteCopia = function(componente)
    {
        var copiaComponente = new Object();
        
        copiaComponente.ComponenteId = componente.ComponenteId;
        copiaComponente.Nombre = componente.Nombre;
        copiaComponente.ComponenteId = componente.ComponenteId;
        
        return copiaComponente;
    };
    
    /*--------- Inicializar -------------*/
    $scope.GetMuestrarioPuerta();
    $scope.GetPuerta();
    $scope.GetComponentePuerta();
    
    
    
});

//Pestañas
var tabPuerta = 
    [
        {titulo:"Puerta", referencia: "#Puerta", clase:"active", area:"puerta"},
        {titulo:"Muestrario", referencia: "#Muestrario", clase:"", area:"muestrario"}
    ];
