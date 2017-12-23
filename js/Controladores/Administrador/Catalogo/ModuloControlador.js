app.controller("ModuloControlador", function($scope, $http, $q, CONFIG, datosUsuarioPerfil, md5, $rootScope, datosUsuario, $window, $location)
{
    $rootScope.clasePrincipal = "";  //si esta en el login muestra una cocina de fondo
    
    /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false, editar: false, activar:false, agregar:false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "CatModConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "CatModAgregar")
            {
                $scope.permisoUsuario.agregar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "CatModEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "CatModActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
        }
    };
    
    $scope.titulo = "Módulos";
    $scope.buscar = "";
    $scope.ordenarPor = "TipoModulo.Nombre";
    
    $scope.modulo = [];
    $scope.medidaModulo = [];
    $scope.consumibleModulo = [];
    $scope.componenteModulo = [];
    $scope.parteModulo = [];
    $scope.seccionModulo = [];
    
    $scope.tipoModulo = [];
    $scope.consumible = [];
    $scope.componente = []; 
    $scope.tipoSeccion = [];
    
    $scope.mostrarDato = "medida";
    $scope.altoLuz = "";
    $scope.imagen = [];
    
    $scope.pasoModulo = pasoModulo;
    $scope.numeroPaso = 1;
    $scope.nuevaMedida = {Ancho:"", Alto:"", Profundo:""};
    $scope.editarMedida = false;
    
    $scope.imagenSeleccionada = false;
    
    $scope.buscarConsumible = "";
    $scope.buscarComponente= "";
    $scope.mostrarCatalago ={
                                consumible:{mostrar:true, texto:"<<"},
                                componente:{mostrar:true, texto:"<<"}
                            };
    
    $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            margen:{maximo:0, minimo: 0},
                            numSeccion:"",
                            tipoModulo:[]
                     };
    
    $scope.filtroCheckbox = [];
    $scope.mostrarFiltro = { activo:false, margen: false, numSeccion: false, tipoModulo:true};
    
    /*-------- Ordenar -----------*/
    //cambia el campo por el cual se van a ordenar los modulos
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenarPor == campoOrdenar)
        {
            $scope.ordenarPor = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPor = campoOrdenar;
        }
    };
    
    /*----------Filtrar--------------*/
    $scope.FiltrarModulo = function(modulo)
    {
        if($scope.filtro.activo.activo != $scope.filtro.activo.inactivo)
        {
            if($scope.filtro.activo.activo)
            {
                if(!modulo.Activo)
                {
                    return false;
                }
            }
            if($scope.filtro.activo.inactivo)
            {
                if(modulo.Activo)
                {
                    return false;
                }
            }   
        }
        
        if(($scope.filtro.margen.maximo !==0 || $scope.filtro.margen.minimo !==0) && ($scope.filtro.margen.maximo >= $scope.filtro.margen.minimo))
        {
            if(modulo.Margen > $scope.filtro.margen.maximo || modulo.Margen < $scope.filtro.margen.minimo)
            {
                return false;
            }
        }
        
        if($scope.filtro.numSeccion !== "")
        {
            if(modulo.NumeroSeccion != $scope.filtro.numSeccion)
            {
                return false;
            }
        }
        
        if($scope.filtro.tipoModulo.length === 0)
        {
            return true;
        }
        else
        {   
            for(var k=0; k<$scope.filtro.tipoModulo.length; k++)
            {
                if(modulo.TipoModulo.Nombre == $scope.filtro.tipoModulo[k])
                {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    $scope.MostrarFiltros = function(filtro)
    {
        if(filtro == "tipoModulo")
        {
            $scope.mostrarFiltro.tipoModulo = !$scope.mostrarFiltro.tipoModulo;
        }
        else if(filtro == "numSeccion")
        {
            $scope.mostrarFiltro.numSeccion = !$scope.mostrarFiltro.numSeccion;
        }
        else if(filtro == "margen")
        {
            $scope.mostrarFiltro.margen = !$scope.mostrarFiltro.margen;
        }
        else if(filtro == "activo")
        {
            $scope.mostrarFiltro.activo = !$scope.mostrarFiltro.activo;
        }
        
    };
    
    $scope.LimpiarFiltro = function()
    {
        $scope.filtro = {
                            activo:{activo:false, inactivo: false},
                            margen:{maximo:0, minimo: 0},
                            numSeccion:"",
                            tipoModulo:[]
                        };
        
        $scope.filtroCheckbox = [];
    };
    
    $scope.setFiltro = function(campo)
    {
        for(var k=0; k<$scope.filtro.tipoModulo.length; k++)
        {
            if($scope.filtro.tipoModulo[k] == campo)
            {
                $scope.filtro.tipoModulo.splice(k,1);
                return;
            }
        }
        $scope.filtro.tipoModulo.push(campo);
        return;
    };
    
    $scope.AgregarNumeroSeccionFiltro = function()
    {
        if($scope.filtro.numSeccion === "")
        {
            $scope.filtro.numSeccion = 1;
        }
        else
        {
            $scope.filtro.numSeccion++;
        }
    };
    
    $scope.ReducirNumeroSeccionFiltro = function()
    {
        if((($scope.filtro.numSeccion-1) >= 0) && $scope.filtro.numSeccion !== "")
        {
            $scope.filtro.numSeccion--;
        }
    };
    
    $scope.LimpiarNumeroSeccionFiltro = function()
    {
        $scope.filtro.numSeccion = "";
    };
    
    /*------- Detalles --------*/
    $scope.MostarDetalles = function(modulo)
    {
        $scope.nuevoModulo = modulo;
        
        $scope.GetDatosModulo(modulo);
    };
    
    $scope.GetDatosModulo = function(modulo)
    {
        $scope.GetMedidasPorModulo(modulo.ModuloId);
        $scope.GetConsumiblePorModulo(modulo.ModuloId);
        $scope.GetComponentePorModulo(modulo.ModuloId);
        $scope.GetPartePorModulo(modulo.ModuloId);
        $scope.GetSeccionPorModulo(modulo.ModuloId);
    };
    
    $scope.MostrarDetalleEspecifico = function(detalle)
    {
        if($scope.mostrarDato == detalle )
        {
            $scope.mostrarDato = "";
            return;
        }
        
        $scope.mostrarDato = detalle;
    };
    
    $scope.CambiarAltoLuz = function(alto)
    {
        $scope.altoLuz = alto;  
    };
    
    $scope.GetClaseDetallesSeccion = function(seccion)
    {
        if($scope.mostrarDato == seccion)
        {
            return "opcionAcordionSeleccionado";
        }
        else
        {
            return "opcionAcordion";
        }
    };
    
    $scope.GetClaseLuz = function(alto)
    {
        if($scope.altoLuz == alto)
        {
            return "botonOperacionMarcoNaranja";
        }
        else
        {
            return "botonOperacion";
        }
    };
    /*---------Modulos-------------*/
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
    
    /*--------------Agregar-Editar Módulo----------------------------------------*/
    $scope.AbrirModuloModal = function(operacion, objeto)
    {
        $scope.operacion = operacion;
        
        for(var k=0; k<$scope.consumible.length; k++)
        {
            $scope.consumible[k].mostrar = true;
        }
        for(var k=0; k<$scope.componente.length; k++)
        {
            $scope.componente[k].mostrar = true;
        }

        if(operacion == "Agregar")
        {
            $scope.nuevoModulo = new Modulo();
            $scope.nuevoModulo.MedidasPorModulo = [];
            
            $scope.medidaModulo = [];
            $scope.consumibleModulo = [];
            $scope.componenteModulo = [];
            $scope.parteModulo = [];
            $scope.seccionModulo = [];
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoModulo = $scope.SetDatosModulo(objeto);
            
            $scope.GetDatosModulo(objeto);
        }
        
        if($scope.tipoSeccion === null)
        {
            $scope.GetTipoSeccion();
        }
        
        $('#moduloModal').modal('toggle');
    };
    
    /*-----Paso 1----*/
    $scope.claseModulo = {nombre:"entrada", seccion:"entrada", margen:"entrada", tipoModulo:"dropdownListModal", desperdicio:"entrada", consumible:"botonOperacion", componente:"botonOperacion"};
    
    $scope.CambiarTipoModulo = function(tipo)
    {
        $scope.nuevoModulo.TipoModulo = SetTipoModulo(tipo);
    };
    
    $scope.SiguienteDatosModulo1 = function(nombreInvalido, numeroSeccionInvalido, margenInvalido, desperdicioValido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.claseModulo.nombre = "entradaError"; 
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
        }
        else
        {
            $scope.claseModulo.nombre = "entrada"; 
        }
        if(numeroSeccionInvalido)
        {
            $scope.claseModulo.seccion = "entradaError"; 
            $scope.mensajeError[$scope.mensajeError.length] = "*El número de secciones debe ser un número entero.";
        }
        else
        {
            $scope.claseModulo.seccion = "entrada"; 
        }
        if(margenInvalido)
        {
            $scope.claseModulo.margen = "entradaError"; 
            $scope.mensajeError[$scope.mensajeError.length] = "*El margen debe ser un número entero o decimal.";
        }
        else
        {
            $scope.claseModulo.margen = "entrada"; 
        }
        if(desperdicioValido)
        {
            $scope.claseModulo.desperdicio = "entradaError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El desperdicio debe ser un porcentaje hasta con 2 decimas.";
        }
        else
        {
            $scope.claseModulo.desperdicio = "entrada";
        }
        if($scope.nuevoModulo.TipoModulo.Nombre.length == "0")
        {
            $scope.claseModulo.tipoModulo = "dropdownListModalError"; 
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de módulo.";
        }
        else
        {
            $scope.claseModulo.tipoModulo = "dropdownListModal"; 
        }
        if($scope.medidaModulo !== null)
        {
            if(($scope.medidaModulo.length + $scope.nuevoModulo.MedidasPorModulo.length) === 0)
            {
                $scope.medidasClase = {ancho:"entradaError", alto:"entradaError", profundo:"entradaError"}; 
                $scope.mensajeError[$scope.mensajeError.length] = "*El módulo al menos debe tener una combinación de medidas.";
            }
            else
            {
                $scope.medidasClase = {ancho:"entrada", alto:"entrada", profundo:"entrada"};
            }
        }
        else
        {
            if($scope.nuevoModulo.MedidasPorModulo.length === 0)
            {
                $scope.medidasClase = {ancho:"entradaError", alto:"entradaError", profundo:"entradaError"}; 
                $scope.mensajeError[$scope.mensajeError.length] = "*El módulo al menos debe tener una combinación de medidas.";
            }
            else
            {
                $scope.medidasClase = {ancho:"entrada", alto:"entrada", profundo:"entrada"};
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.modulo.length; k++)
        {
            if($scope.modulo[k].Nombre.toLowerCase() == $scope.nuevoModulo.Nombre.toLowerCase() && $scope.modulo[k].TipoModulo.TipoModuloId == $scope.nuevoModulo.TipoModulo.TipoModuloId && $scope.modulo[k].ModuloId != $scope.nuevoModulo.ModuloId) 
            {
                $scope.claseModulo.nombre="entradaError";
                $scope.claseModulo.tipoModulo="dropdownListModalError";
                $scope.mensajeError[$scope.mensajeError.length] = "*El módulo " + $scope.nuevoModulo.TipoModulo.Nombre + " - " + $scope.nuevoModulo.Nombre + " ya existe.";
                return;
            }
        }
        
        if($scope.editarMedida)
        {
            $scope.CancelarEdicionMedida();
        }
        
        $scope.numeroPaso = 2;
        
        $scope.pasoModulo[0].clase="pasoNoActivo";
        $scope.pasoModulo[1].clase="pasoActivo";

        if($scope.nuevoModulo.NumeroSeccion > 0)
        {
            $scope.ConfigurarPartePorModulo();
            $scope.ConfigurarSeccionModulo();
        }
    };
    
    $scope.ConfigurarSeccionModulo = function()
    {
        $scope.alturas = $scope.GetAlturas();
        
        if($scope.seccionModulo.length === 0)
        {
            $scope.SetSecciones($scope.nuevoModulo.NumeroSeccion);
        }
        else
        {   
            var nuevaSeccion = $scope.nuevoModulo.NumeroSeccion - $scope.seccionModulo.length;
            
            $scope.SetAlturaModulo();

            if(nuevaSeccion > 0)
            {
                $scope.SetSecciones(nuevaSeccion);
            }
            else if(nuevaSeccion < 0)
            {
                $scope.seccionModulo.splice($scope.seccionModulo.length+nuevaSeccion,(-nuevaSeccion));
            }
        }
    };
    
    $scope.SetAlturaModulo = function()
    {
        var alturaRegistrada = false;
        for(var k=0; k<$scope.seccionModulo.length; k++)
        {
            for(var j=0; j<$scope.alturas.length; j++)
            {
                alturaRegistrada = false;
                for(var i=0; i<$scope.seccionModulo[k].LuzPorSeccion.length; i++)
                {
                    if($scope.alturas[j] == $scope.seccionModulo[k].LuzPorSeccion[i].AltoModulo)
                    {
                       alturaRegistrada = true;
                       break;
                    }
                }
                if(!alturaRegistrada)
                {
                    $scope.seccionModulo[k].LuzPorSeccion[$scope.seccionModulo[k].LuzPorSeccion.length] = new LuzPorSeccion;
                    $scope.seccionModulo[k].LuzPorSeccion[$scope.seccionModulo[k].LuzPorSeccion.length -1].AltoModulo = $scope.alturas[j];
                    $scope.seccionModulo[k].LuzPorSeccion[$scope.seccionModulo[k].LuzPorSeccion.length -1].NumeroEntrepano = 0;
                    $scope.seccionModulo[k].LuzPorSeccion[$scope.seccionModulo[k].LuzPorSeccion.length -1].claseLuz = "entrada";
                }
            }
        }
        
        for(var k=0; k<$scope.seccionModulo.length; k++)
        {
            for(var i=0; i<$scope.seccionModulo[k].LuzPorSeccion.length; i++)
            {
                if(!$scope.alturas.includes($scope.seccionModulo[k].LuzPorSeccion[i].AltoModulo))
                {
                    $scope.seccionModulo[k].LuzPorSeccion.splice(i,1);
                    i--;
                }
            } 
        }
    };
    
    $scope.SetSecciones = function(numeroSeccion)
    {
        var seccionesregistradas =$scope.seccionModulo.length;
        for(var k=$scope.seccionModulo.length; k<(seccionesregistradas+numeroSeccion); k++)
        {
            $scope.seccionModulo[k] = new SeccionPorModulo();
            $scope.seccionModulo[k].NumeroPiezas = 1;
            $scope.seccionModulo[k].PeinazoVertical = 0;
            $scope.seccionModulo[k].clasePeinazo = "entrada";
            $scope.seccionModulo[k].claseTipoSeccion = "dropdownListModal";

            for(var i=0; i<$scope.alturas.length; i++)
            {
                $scope.seccionModulo[k].LuzPorSeccion[i] = new LuzPorSeccion();
                $scope.seccionModulo[k].LuzPorSeccion[i].AltoModulo = $scope.alturas[i];
                $scope.seccionModulo[k].LuzPorSeccion[i].NumeroEntrepano = 0;
                $scope.seccionModulo[k].LuzPorSeccion[i].claseLuz = "entrada";
            }
        }
    };
               
    $scope.GetAlturas = function()
    {
        var alturas = [];
        
        if($scope.medidaModulo.length > 0)
        {
            alturas[0] = $scope.medidaModulo[0].Alto;

            for(var k=1; k<$scope.medidaModulo.length; k++)
            {
                if(!alturas.includes( $scope.medidaModulo[k].Alto))
                {
                    alturas[alturas.length] = $scope.medidaModulo[k].Alto;
                }
            }
        }
        
        for(var k=0; k<$scope.nuevoModulo.MedidasPorModulo.length; k++)
        {
            if(!alturas.includes($scope.nuevoModulo.MedidasPorModulo[k].Alto))
            {
                alturas[alturas.length] = $scope.nuevoModulo.MedidasPorModulo[k].Alto;
            }
        }
        
        alturas.sort();
        
        $scope.altoLuz = alturas[0];
        
        return alturas;
    };
        
    $scope.ConfigurarPartePorModulo = function()
    {
        var parte = {TipoParteId:"", NombreTipoParte:"", Ancho:""};
        
        if($scope.parteModulo.length === 0)
        {
            
            parte = {TipoParteId:"1", NombreTipoParte:"Costado Izquierdo", Ancho:""};
            $scope.parteModulo[0] = SetPartePorModulo(parte);
            
            parte = {TipoParteId:"2", NombreTipoParte:"Costado Derecho", Ancho:""};
            $scope.parteModulo[1] = SetPartePorModulo(parte);
            
            parte = {TipoParteId:"3", NombreTipoParte:"Peinazo Superior", Ancho:""};
            $scope.parteModulo[2] = SetPartePorModulo(parte);
            
            parte = {TipoParteId:"5", NombreTipoParte:"Peinazo Inferior", Ancho:""};
            $scope.parteModulo[3] = SetPartePorModulo(parte);
            
            parte = {TipoParteId:"4", NombreTipoParte:"Peinazo Medio", Ancho:""};
            for(var k=1; k<$scope.nuevoModulo.NumeroSeccion; k++)
            {
                $scope.parteModulo[3+k] = SetPartePorModulo(parte);
            }
            
            for(k=0; k<$scope.parteModulo.length; k++)
            {
                $scope.parteModulo[k].claseAncho = "entrada";      
            }
        }
        
        else
        {
            var numeroPartes = parseInt($scope.nuevoModulo.NumeroSeccion) + 1 + 2; //las partes son 2 costados y los peinazos es el numero de secciones más 1
            
            if($scope.parteModulo.length == numeroPartes)
            {
                return;
            }
            else if($scope.parteModulo.length < numeroPartes)
            {
                parte = {TipoParteId:"4", NombreTipoParte:"Peinazo Medio", Ancho:""};
                
                var parteAgregar = numeroPartes - $scope.parteModulo.length;
                for(var k=0; k<parteAgregar; k++)
                {
                    $scope.parteModulo[$scope.parteModulo.length] = SetPartePorModulo(parte);
                    $scope.parteModulo[$scope.parteModulo.length-1].claseAncho = "entrada";  
                }
            }
            else if($scope.parteModulo.length > numeroPartes)
            {
                var piezasQuitar =  $scope.parteModulo.length - numeroPartes;
                var parteEliminadas = 0;
                for(var k=$scope.parteModulo.length-1; k>=0; k--)
                {
                    if($scope.parteModulo[k].TipoParteId == "4")
                    {
                        $scope.parteModulo.splice(k,1);
                        parteEliminadas++;
                        if(parteEliminadas == piezasQuitar)
                        {
                           return;
                        }
                    }
                }
            }
        }
    };
    
    
    /*--------Paso 2------------*/
    $scope.AgregarConsumible = function(consumible)
    {
        if($scope.consumibleModulo !== null)
        {    
            for(var k=0; k<$scope.consumible.length; k++)
            {
                if($scope.consumible[k].ConsumibleId == consumible.ConsumibleId)
                {
                    $scope.consumible[k].mostrar = false;
                    break;
                }
            }
        }
        else
        {
            $scope.consumibleModulo = [];
        }
        
        var numConsumible = $scope.consumibleModulo.length;
        $scope.consumibleModulo[numConsumible] = new ConsumiblePorModulo();
        $scope.consumibleModulo[numConsumible].Consumible = new Consumible();
        $scope.consumibleModulo[numConsumible].Consumible = SetConsumible(consumible);
        $scope.consumibleModulo[numConsumible].Cantidad = 1;
    };
    
    $scope.RemoverCantidadConsumible = function(consumible)
    {
        if((consumible.Cantidad-1) !== 0)
        {
            consumible.Cantidad--;
        }
    };
    
    $scope.AgregarCantidadConsumible = function(consumible)
    {
        consumible.Cantidad++;
    };
    
    $scope.QuitarConsumible = function(consumible)
    {
        
        for(var k=0; k<$scope.consumibleModulo.length; k++)
        {
            if($scope.consumibleModulo[k].Consumible.ConsumibleId == consumible.Consumible.ConsumibleId)
            {
                $scope.consumibleModulo.splice(k,1);
                break;
            }
        }
        
        for(var k=0; k<$scope.consumible.length; k++)
        {
            if($scope.consumible[k].ConsumibleId == consumible.Consumible.ConsumibleId)
            {
                $scope.consumible[k].mostrar = true;
                break;
            }
        }
    };
    
    $scope.SiguienteDatosModulo2 = function()
    {
        $scope.mensajeError = [];
        
        if($scope.consumibleModulo.length === 0)
        {
            $scope.claseModulo.consumible = "botonOperacionError";
            $scope.mensajeError[$scope.mensajeError.length] = "*El módulo debe de contar con al menos un consumible.";
        }
        else
        {
            $scope.claseModulo.consumible = "botonOperacion";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        $scope.numeroPaso = 3;
        $scope.pasoModulo[0].clase="pasoNoActivo";
        $scope.pasoModulo[1].clase="pasoNoActivo";
        $scope.pasoModulo[2].clase="pasoActivo";
        $scope.pasoModulo[3].clase="pasoNoActivo";
    };
    
    /*--------Paso 3------------*/
    $scope.AgregarComponente = function(componente)
    {
        if($scope.componenteModulo !== null)
        {    
            for(var k=0; k<$scope.componente.length; k++)
            {
                if($scope.componente[k].ComponenteId == componente.ComponenteId)
                {
                    $scope.componente[k].mostrar = false;
                    break;
                }
            }
        }
        else
        {
            $scope.componenteModulo = [];
        }
        
        var numComponente = $scope.componenteModulo.length;
        $scope.componenteModulo[numComponente] = new ComponentePorModulo();
        $scope.componenteModulo[numComponente].Componente = new Componente();
        $scope.componenteModulo[numComponente].Componente = SetComponente(componente);
        $scope.componenteModulo[numComponente].Cantidad = 1;
    };
    
    $scope.RemoverCantidadComponente = function(componente)
    {
        if((componente.Cantidad-1) !== 0)
        {
            componente.Cantidad--;
        }
    };
    
    $scope.AgregarCantidadComponente = function(componente)
    {
        componente.Cantidad++;
    };
    
    $scope.QuitarComponente = function(componente)
    {
        
        for(var k=0; k<$scope.componenteModulo.length; k++)
        {
            if($scope.componenteModulo[k].Componente.ComponenteId == componente.Componente.ComponenteId)
            {
                $scope.componenteModulo.splice(k,1);
                break;
            }
        }
        
        for(var k=0; k<$scope.componente.length; k++)
        {
            if($scope.componente[k].ComponenteId == componente.Componente.ComponenteId)
            {
                $scope.componente[k].mostrar = true;
                break;
            }
        }
    };
    
    $scope.ValidarComponentes = function()
    {           
        var q = $q.defer();
        
        var promesas = [];
        
        $scope.componenteFaltante = [];
        
        for(var k=0; k<$scope.componenteModulo.length; k++)
        {        
            var promesaP = GetPiezaPorComponente($http, $q, CONFIG, $scope.componenteModulo[k].Componente.ComponenteId).then(function(data)
            {   
                for(var i=0; i<data.length; i++)
                {
                    var promesaA = $scope.ValidarComponenteFormula(data[i].Pieza.FormulaAncho);
                    var promesaL = $scope.ValidarComponenteFormula(data[i].Pieza.FormulaLargo);
                    
                    promesas.push(promesaA);
                    promesas.push(promesaL);
                }
                
            }).catch(function(error)
            {
                alert("Ha ocurrido un error al obtener las piezas del componente." + error);
                return;
            });
            
            promesas.push(promesaP);
        }
        
        $q.all(promesas).then(function()
        {
            if($scope.mensajeError.length == 0)
            {
                q.resolve(true);
            }
            else
            {
                q.resolve(false);
            }
        });
        
        return q.promise;
    };
    
    
    $scope.ValidarComponenteFormula = function(formula)
    {
        var q = $q.defer();
        
        var nombreComponente;
        
        var index = formula.indexOf("[Componente]");
        
        if(index <= -1)
        {
            q.resolve();
        } 
        else
        {
        
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
                
                var isComponente = false;

                if(nombreComponente == "1")
                {
                    isComponente = true;  
                }

                if(!isComponente)
                {
                    for(var k=0; k<$scope.componenteModulo.length; k++)
                    {
                        if(nombreComponente == $scope.componenteModulo[k].Componente.ComponenteId)
                        {

                            isComponente = true;
                        }
                    }
                }
                
                if(!isComponente)
                {
                    var componenteRegistrada = false;
                    for(var k=0; k<$scope.componenteFaltante.length; k++)
                    {
                        if($scope.componenteFaltante[k] == nombreComponente)
                        {
                            componenteRegistrada = true;
                            break;
                        }
                    }

                    if(!componenteRegistrada)
                    {
                        $scope.componenteFaltante[$scope.componenteFaltante.length] = nombreComponente;
                        for(var k=0; k<$scope.componente.length; k++)
                        {
                            if($scope.componente[k].ComponenteId == nombreComponente)
                            {

                                $scope.mensajeError[$scope.mensajeError.length] = "*Falta agregar el componente \"" + $scope.componente[k].Nombre + "\".";
                                break;
                            }
                        }
                    }

                }

                var componente = "[Componente][" + nombreComponente + "]"; 
                formula = formula.replace(componente, " ");

                index = formula.indexOf("[Componente]");

                if(index < 0)
                {
                    q.resolve();
                }
            }
        }
        
        return q.promise;
    };
    
    $scope.SiguienteComponente = function()
    {
        $scope.mensajeError = [];
        
        if($scope.componenteModulo.length === 0)
        {
            $scope.claseModulo.componente ="botonOperacion";
            $scope.mensajeError[$scope.mensajeError.length] = "*El módulo debe de contar con al menos un componente.";
        }
        else
        {
            $scope.claseModulo.componente ="botonOperacion";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }

        $scope.ValidarComponentes().then(function(valido)
        {
            if(!valido)
            {
                return;
            }
            else
            {
                if($scope.nuevoModulo.NumeroSeccion != "0")
                {
                    $scope.numeroPaso = 4;
                    $scope.pasoModulo[2].clase="pasoNoActivo";
                    $scope.pasoModulo[3].clase="pasoActivo";
                }
                else
                {
                    $scope.SetDatosNuevoModulo();

                    if($scope.operacion == "Agregar")
                    {
                        $scope.AgregarModulo();
                    }
                    else if($scope.operacion == "Editar")
                    {
                        $scope.EditarModulo();
                    }
                }
            }
        });
        
    };
    
     /*--------Paso 4------------*/
    $scope.CambiaSeccionModulo = function(tipo, seccion)
    {
        seccion.SeccionModulo.SeccionModuloId = tipo.SeccionModuloId;
        seccion.SeccionModulo.Nombre = tipo.Nombre;
        if(tipo.Nombre == "Cajón")
        {
            for(var k=0; k<seccion.LuzPorSeccion.length; k++)
            {
                seccion.LuzPorSeccion[k].NumeroEntrepano = 0; 
            }
        }
        else
        {
            for(var k=0; k<seccion.LuzPorSeccion.length; k++)
            {
                if(seccion.LuzPorSeccion[k].NumeroEntrepano === 0)
                {
                    seccion.LuzPorSeccion[k].NumeroEntrepano = 1;
                }
            }
        }
    };
    
    $scope.AgregarNumeroPiezas = function(seccion)
    {
        seccion.NumeroPiezas++;
    };
    
    $scope.RemoverNumeroPiezas = function(seccion)
    {
        if((seccion.NumeroPiezas-1) !== 0)
        {
            seccion.NumeroPiezas--;
        }
        
        if(seccion.NumeroPiezas == "1")
        {
            seccion.PeinazoVertical = 0;
        }
    };
    
    $scope.AgregarNumeroEntrepano = function(luz)
    {
        luz.NumeroEntrepano++;
    };
    
    $scope.RemoverNumeroEntrepano = function(luz)
    {
        if((luz.NumeroEntrepano-1) >= 0)
        {
            luz.NumeroEntrepano--;
        }
    };
    
    /*-----Terminar de editar o agregar--------------*/
    $scope.TerminarModuloForma = function()
    {  
        //Validar datos
        $scope.mensajeError = [];
        var datoError = false, peinazoError = false, luzError = false, tipoError = false;
        for(var k=0; k<$scope.parteModulo.length; k++)
        {
            if($scope.parteModulo[k].Ancho === undefined || $scope.parteModulo[k].Ancho === "")
            {
                if(!datoError)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "El ancho del módulo se indica con una fracción.";
                    datoError = true;
                }
                
                $scope.parteModulo[k].claseAncho = "entradaError";
            }
            else
            {
                $scope.parteModulo[k].claseAncho = "entrada";
            }
        }
        
        for(var k=0; k<$scope.seccionModulo.length; k++)
        {
            if($scope.seccionModulo[k].SeccionModulo.Nombre === "")
            {
                if(!tipoError)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "Selecciona un tipo de sección para cada una de las secciones.";
                    tipoError = true;
                }
                $scope.seccionModulo[k].claseTipoSeccion = "dropdownListModalError";
            }
            else
            {
                $scope.seccionModulo[k].claseTipoSeccion = "dropdownListModal";
            }
                
            if($scope.seccionModulo[k].PeinazoVertical === undefined || $scope.seccionModulo[k].PeinazoVertical === "")
            {
                if(!peinazoError)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "El peinazo se indica con una fracción.";
                    peinazoError = true;
                }
                
                $scope.seccionModulo[k].clasePeinazo = "entradaError";
            }
            else
            {
                $scope.seccionModulo[k].clasePeinazo = "entrada";
            }
            
            for(var i=0; i<$scope.seccionModulo[k].LuzPorSeccion.length; i++)
            {
                if($scope.seccionModulo[k].LuzPorSeccion[i].Luz  === undefined || $scope.seccionModulo[k].LuzPorSeccion[i].Luz === "")
                {
                    if(!luzError)
                    {
                        $scope.mensajeError[$scope.mensajeError.length] = "La luz de la sección del módulo se indica con una fracción.";
                        luzError = true;
                    }

                    $scope.seccionModulo[k].LuzPorSeccion[i].claseLuz = "entradaError";
                }
                else
                {
                    $scope.seccionModulo[k].LuzPorSeccion[i].claseLuz = "entrada";
                }
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        //Validar luces
    
        var altoPeinazo = 0;
        for(var k=0; k<$scope.parteModulo.length; k++)
        {
            if($scope.parteModulo[k].TipoParteId == "3" || $scope.parteModulo[k].TipoParteId == "4" || $scope.parteModulo[k].TipoParteId == "5")
            {
                altoPeinazo += $scope.FraccionADecimal($scope.parteModulo[k].Ancho);
            }
        }
 
        var alturasLuces = [];
        for(var k=0; k<$scope.alturas.length; k++)
        {
            alturasLuces[k] = altoPeinazo;
        }
        
        for(var k=0; k<$scope.seccionModulo.length; k++)
        {
            for(var i=0; i<$scope.seccionModulo[k].LuzPorSeccion.length; i++)
            {
                for(var j=0; j<$scope.alturas.length; j++)
                {
                    if($scope.alturas[j] == $scope.seccionModulo[k].LuzPorSeccion[i].AltoModulo)
                    {
                        alturasLuces[j] +=  $scope.FraccionADecimal($scope.seccionModulo[k].LuzPorSeccion[i].Luz);
                    }
                }
            }
        }
        
        var altoAux = 0;
        for(var k=0; k<$scope.alturas.length; k++)
        {
            altoAux = $scope.FraccionADecimal($scope.alturas[k]);
            if(altoAux != alturasLuces[k])
            {
                $scope.mensajeError[$scope.mensajeError.length] = "La suma de los anchos de los peinazos y de las alturas de las luces debe ser igual a la altura del módulo. Altura: " + $scope.alturas[k] + "."; 
            }
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        $scope.SetDatosNuevoModulo();
        
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarModulo();
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarModulo();
        }
        
    };
    
    $scope.SetDatosNuevoModulo = function()
    {
        /*var numMedidas = $scope.nuevoModulo.MedidasPorModulo.length;
        if($scope.operacion == "Editar")
        {
            for(var k=0; k<$scope.medidaModulo.length; k++)
            {
                $scope.nuevoModulo.MedidasPorModulo[numMedidas + k] = $scope.medidaModulo[k];
            }
        };*/
        
        $scope.nuevoModulo.ComponentePorModulo = $scope.componenteModulo;
        $scope.nuevoModulo.ConsumiblePorModulo = $scope.consumibleModulo;
        
        if($scope.nuevoModulo.NumeroSeccion != "0")
        {
            $scope.nuevoModulo.PartePorModulo = $scope.parteModulo;
            $scope.nuevoModulo.SeccionPorModulo = $scope.seccionModulo;
        }
        else
        {
            $scope.nuevoModulo.PartePorModulo = [];
            $scope.nuevoModulo.SeccionPorModulo = [];
        }
    };
    
    $scope.AgregarModulo = function()
    {
        AgregarModulo($http, CONFIG, $q, $scope.nuevoModulo).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.CerrarModuloForma();
                $('#moduloModal').modal('toggle');
                $scope.mensaje = "El módulo se ha agregado.";
                
                if($scope.imagenSeleccionada)
                {
                    $scope.GuardarImagenModulo(data[1].ModuloId);
                }
                else
                {
                    $scope.GetModulo();
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeModulo').modal('toggle');
    };
    
    $scope.EditarModulo = function()
    {
        EditarModulo($http, CONFIG, $q, $scope.nuevoModulo).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.CerrarModuloForma();
                $('#moduloModal').modal('toggle');
                $scope.mensaje = "El módulo se ha editado.";
                
                if($scope.imagenSeleccionada)
                {
                    $scope.GuardarImagenModulo($scope.nuevoModulo.ModuloId);
                }
                else
                {
                    $scope.GetModulo();
                }
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
        });
        
        $('#mensajeModulo').modal('toggle');
    };
    
    $scope.FraccionADecimal = function(valor)
    {
        if(valor.includes(' '))
        {
            var fraccion = valor.split(' ');
            
            return parseInt(fraccion[0]) + eval(fraccion[1]);
        }
        else
        {
            return eval(valor);
        }
    };
    
    /*-------Imagen-------*/
    $scope.CargarImagen = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.imagen[0] = element.files[0];
            $scope.imagenSeleccionada = true; 
        });
    };
    
    $scope.GuardarImagenModulo = function(moduloId) 
    {
        GuardarImagenModulo($http, $q, CONFIG, $scope.imagen ,moduloId).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                $scope.GetModulo();
            }
        }).catch(function(error)
        {
            $scope.GetModulo();
            alert("No se pudo guardar la imagen del módulo");
        });
        
        $scope.imagenSeleccionada = false;
        $scope.imagen = [];
    };
    
    function ImagenSeleccionada(evt) 
    {
        var files = evt.target.files;

        for (var i = 0, f; f = files[i]; i++) 
        {
            if (!f.type.match('image.*')) 
            {
                continue;
            }

            var reader = new FileReader();

            reader.onload = (function(theFile) 
            {
                return function(e) 
                {
                    document.getElementById("PrevisualizarImagen").innerHTML = ['<img class="imagenModulo center-block" src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('');
                    document.getElementById("PrevisualizarImagenDetalles").innerHTML = ['<img class=" center-block img-responsive" src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('');
                };
            })(f);

            reader.readAsDataURL(f);
        }
    }
 
    document.getElementById('cargarImagen').addEventListener('change', ImagenSeleccionada, false);
    
    /*------Medida-------*/
    
    $scope.medidasClase = {ancho:"entrada", alto:"entrada", profundo:"entrada"};
    
    $scope.ValidarMedida = function(anchoInvalido, altoInvalido, profundoInvalido)
    {
        $scope.mensajeErrorMedida = [];
        
        if(anchoInvalido)
        {
            $scope.medidasClase.ancho = "entradaError";
            $scope.mensajeErrorMedida[$scope.mensajeErrorMedida.length] = "*Las medidas del módulo se deben de indicar con un número entero o una fracción. Por ejemplo: \"30\", \"24 1/2\", etc.";
        }
        else
        {
            $scope.medidasClase.ancho = "entrada";
        }
        
        if(altoInvalido)
        {
            $scope.medidasClase.alto = "entradaError";
            if($scope.mensajeErrorMedida.length === 0)
            {
                $scope.mensajeErrorMedida[$scope.mensajeErrorMedida.length] = "*Las medidas del módulo se deben de indicar con un número entero o una fracción. Por ejemplo: \"30\", \"24 1/2\", etc.";
            }
        }
        else
        {
            $scope.medidasClase.alto = "entrada";
        }
        
        if(profundoInvalido)
        {
            $scope.medidasClase.profundo = "entradaError";
            if($scope.mensajeErrorMedida.length === 0)
            {
                $scope.mensajeErrorMedida[$scope.mensajeErrorMedida.length] = "*Las medidas del módulo se deben de indicar con un número entero o una fracción. Por ejemplo: \"30\", \"24 1/2\", etc.";
            }
        }
        else
        {
            $scope.medidasClase.profundo = "entrada";
        }
        
        if($scope.mensajeErrorMedida.length > 0)
        {
            return false;
        }
        
        if($scope.medidaModulo !== null)
        {
            for(var k=0; k<$scope.medidaModulo.length; k++)
            {
                if($scope.medidaModulo[k].Ancho == $scope.nuevaMedida.Ancho && $scope.medidaModulo[k].Alto == $scope.nuevaMedida.Alto && $scope.medidaModulo[k].Profundo == $scope.nuevaMedida.Profundo)
                {
                    $scope.medidasClase.ancho = "entrada";
                    $scope.medidasClase.alto = "entrada";
                    $scope.medidasClase.profundo = "entrada";
                    $scope.mensajeErrorMedida[$scope.mensajeErrorMedida.length] = "*Este módulo ya cuenta con esta convinación de medidas";
                    return false;
                }
            }
        }
        
        for(var k=0; k<$scope.nuevoModulo.MedidasPorModulo.length; k++)
        {
            if($scope.nuevoModulo.MedidasPorModulo[k].Ancho == $scope.nuevaMedida.Ancho && $scope.nuevoModulo.MedidasPorModulo[k].Alto == $scope.nuevaMedida.Alto && $scope.nuevoModulo.MedidasPorModulo[k].Profundo == $scope.nuevaMedida.Profundo)
            {
                $scope.medidasClase.ancho = "entrada";
                $scope.medidasClase.alto = "entrada";
                $scope.medidasClase.profundo = "entrada";
                $scope.mensajeErrorMedida[$scope.mensajeErrorMedida.length] = "*Este módulo ya cuenta con esta convinación de medidas";
                return false;
            }
        }
        
        return true;
    };
    
    $scope.AgregarMedidas = function(anchoInvalido, altoInvalido, profundoInvalido)
    {
        if($scope.ValidarMedida(anchoInvalido, altoInvalido, profundoInvalido))
        {
            var index = $scope.nuevoModulo.MedidasPorModulo.length;
            $scope.nuevoModulo.MedidasPorModulo[index] = new MedidasPorModulo();
            $scope.nuevoModulo.MedidasPorModulo[index].Ancho = $scope.nuevaMedida.Ancho;
            $scope.nuevoModulo.MedidasPorModulo[index].Alto = $scope.nuevaMedida.Alto;
            $scope.nuevoModulo.MedidasPorModulo[index].Profundo = $scope.nuevaMedida.Profundo; 
            
            $scope.nuevoModulo.MedidasPorModulo[index].AnchoNumero = $scope.FraccionADecimal($scope.nuevaMedida.Ancho);
            $scope.nuevoModulo.MedidasPorModulo[index].AltoNumero = $scope.FraccionADecimal($scope.nuevaMedida.Alto);
            $scope.nuevoModulo.MedidasPorModulo[index].ProfundoNumero = $scope.FraccionADecimal($scope.nuevaMedida.Profundo);
        }
        
    };
    
    $scope.EditarMedida = function(medida, tipoMedida)
    {
        $scope.editarMedida = true;
        
        $scope.tipoMedida = tipoMedida;
        $scope.medidaAuxiliar = medida;
        
        $scope.nuevaMedida.Ancho = medida.Ancho;
        $scope.nuevaMedida.Alto = medida.Alto;
        $scope.nuevaMedida.Profundo = medida.Profundo;
        
        $scope.nuevaMedida.MedidasPorModuloId = medida.MedidasPorModuloId;
        
        if(tipoMedida == "nueva")
        {
            for(var k=0; k<$scope.nuevoModulo.MedidasPorModulo.length; k++)
            {
                if(medida == $scope.nuevoModulo.MedidasPorModulo[k])
                {
                    $scope.nuevoModulo.MedidasPorModulo.splice(k,1);
                }
            }
        }
        else if(tipoMedida == "registrada")
        {
            for(var k=0; k<$scope.medidaModulo.length; k++)
            {
                if(medida == $scope.medidaModulo[k])
                {
                    $scope.medidaModulo.splice(k,1);
                }
            }
        }
    };
    
    $scope.ConfirmarEditarMedida = function(anchoInvalido, altoInvalido, profundoInvalido)
    {
        if($scope.tipoMedida == "nueva")
        {
            $scope.AgregarMedidas(anchoInvalido, altoInvalido, profundoInvalido);
            $scope.editarMedida = false;
        }
        
        else if($scope.tipoMedida == "registrada") 
        {
            if($scope.ValidarMedida(anchoInvalido, altoInvalido, profundoInvalido))
            {
                EditarMedidaPorModulo($http, CONFIG, $q, $scope.nuevaMedida).then(function(data)
                {
                    if(data == "Exitoso")
                    {
                        $scope.editarMedida = false;
                        $scope.nuevaMedida = {Ancho:"", Alto:"", Profundo:""};
                        $scope.mensaje = "Las medidas del módulo se han actualizado.";
                        $('#mensajeModulo').modal('toggle');
                        $scope.GetMedidasPorModulo($scope.nuevoModulo.ModuloId);
                    }
                    else
                    {
                        $scope.editarMedida = true;
                        $scope.contactoColaborador[$scope.contactoColaborador.length] = $scope.contactoCambiar;
                        alert("Ha ocurrido un error. Intente más tarde.");
                    }
                }).catch(function(error)
                {
                    $scope.editarMedida = true;
                    $scope.contactoColaborador[$scope.contactoColaborador.length] = $scope.contactoCambiar;
                    alert("Ha ocurrido un error. Intente más tarde." +error);
                    return;
                });
            }  
        }
    };
    
    $scope.BorrarMedidaAgregada = function(med)
    {
        for(var k=0; k<$scope.nuevoModulo.MedidasPorModulo.length; k++)
        {
            if($scope.nuevoModulo.MedidasPorModulo[k].Ancho == med.Ancho && $scope.nuevoModulo.MedidasPorModulo[k].Alto == med.Alto && $scope.nuevoModulo.MedidasPorModulo[k].Profundo == med.Profundo)
            {
                $scope.nuevoModulo.MedidasPorModulo.splice(k, 1);
                break;
            }
        }
    };
    
    $scope.CancelarEdicionMedida = function()
    {
        $scope.editarMedida = false;
        $scope.nuevaMedida = {Ancho:"", Alto:"", Profundo:""};
        $scope.mensajeErrorMedida = [];
        
        if($scope.tipoMedida == "nueva")
        {
            $scope.nuevoModulo.MedidasPorModulo[$scope.nuevoModulo.MedidasPorModulo.length] = $scope.medidaAuxiliar;
        }
        else if($scope.tipoMedida == "registrada")
        {
            $scope.medidaModulo[$scope.medidaModulo.length] = $scope.medidaAuxiliar;
        }
    };
    
    $scope.CerrarModuloForma = function()
    {
        $scope.numeroPaso = 1;
        $scope.pasoModulo[0].clase="pasoActivo";
        $scope.pasoModulo[1].clase="pasoNoActivo";
        $scope.pasoModulo[2].clase="pasoNoActivo";
        $scope.pasoModulo[3].clase="pasoNoActivo";
        
        //$scope.imagen = [];
        //$scope.imagenSeleccionada = false;
        
        $scope.claseModulo = {nombre:"entrada", seccion:"entrada", margen:"entrada", tipoModulo:"dropdownListModal", desperdicio:"entrada", consumible:"botonOperacion", componente:"botonOperacion"};
        
        $scope.editarMedida = false;
        $scope.mensajeErrorMedida = [];
        $scope.mensajeError = [];
        $scope.nuevaMedida = {Ancho:"", Alto:"", Profundo:""};
        $scope.medidasClase = {ancho:"entrada", alto:"entrada", profundo:"entrada"};
    
    };
    
    $scope.LimpiarImagenModulo = function()
    {
        $scope.imagen = [];
        $scope.imagenSeleccionada = false;
        $scope.CerrarModuloForma();
    };
    
    $scope.PasoAnterior = function()
    {
        $scope.numeroPaso--;
        
        $scope.mensajeError = [];
        
        if($scope.numeroPaso == 1)
        {
            $scope.pasoModulo[0].clase = "pasoActivo";
            $scope.pasoModulo[1].clase = "pasoNoActivo";
            $scope.pasoModulo[2].clase = "pasoNoActivo";
            $scope.pasoModulo[3].clase = "pasoNoActivo";
        }
        else if($scope.numeroPaso == 2)
        {
            $scope.pasoModulo[0].clase = "pasoNoActivo";
            $scope.pasoModulo[1].clase = "pasoActivo";
            $scope.pasoModulo[2].clase = "pasoNoActivo";
            $scope.pasoModulo[3].clase = "pasoNoActivo";
        }
        else if($scope.numeroPaso == 3)
        {
            $scope.pasoModulo[0].clase = "pasoNoActivo";
            $scope.pasoModulo[1].clase = "pasoNoActivo";
            $scope.pasoModulo[2].clase = "pasoActivo";
            $scope.pasoModulo[3].clase = "pasoNoActivo";
        }
        else if($scope.numeroPaso == 4)
        {
            $scope.pasoModulo[0].clase = "pasoNoActivo";
            $scope.pasoModulo[1].clase = "pasoNoActivo";
            $scope.pasoModulo[2].clase = "pasoNoActivo";
            $scope.pasoModulo[3].clase = "pasoActivo";
        }
    };
    
    $scope.CambiarMostrarCatalogo = function(catalogo)
    {
        catalogo.mostrar = !catalogo.mostrar;
        if(catalogo.mostrar)
        {
            catalogo.texto = "<<";
        }
        else
        {
           catalogo.texto = ">>"; 
        }
    };
   
    /*------------------------Cambiar Estatus de activo --------------------------*/
    $scope.CambiarEstatusActivoModal = function()
    {
        $scope.nuevoModulo.Activo = !$scope.nuevoModulo.Activo;
        $scope.CambiarEstatusActivo($scope.nuevoModulo, "modulo"); 
    };
    
    $scope.CambiarEstatusActivo = function(objeto, seccion)
    {   
        $scope.objetoCambiarActivo = objeto;
        $scope.seccion = seccion;
        
        if(objeto.Activo)
        {
            if($scope.seccion == "modulo")
            {
                $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR " + objeto.TipoModulo.Nombre + " - " + objeto.Nombre + "?";
            }
            else if($scope.seccion == "medida")
            {
                $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR el módulo con medidas: Ancho: " + objeto.Ancho + " Alto: " + objeto.Alto + " Profundo: " + objeto.Profundo + "?";
            }
            
        }
        else
        {
            if($scope.seccion == "modulo")
            {
                $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + objeto.TipoModulo.Nombre + " - " + objeto.Nombre + "?";
            }
            else if($scope.seccion == "medida")
            {
                $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR el módulo con medidas: Ancho: " + objeto.Ancho + " Alto: " + objeto.Alto + " Profundo: " + objeto.Profundo + "?";
            }
        }
        
        $('#CambiarActivoModuloModal').modal('toggle');
    };
    
    $scope.CancelarCambiarActivo = function()
    {
        $scope.objetoCambiarActivo.Activo = !$scope.objetoCambiarActivo.Activo;
    };
    
    $scope.ConfirmarActualizarActivo = function()
    {
        var datos = [];
        
        if($scope.objetoCambiarActivo.Activo)
        {
            datos[0] = 1;
        }
        else
        {
            datos[0] = 0;  
        }
        
        if($scope.seccion == "modulo")
        {
            datos[1] = $scope.objetoCambiarActivo.ModuloId;

            ActivarDesactivarModulo($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El módulo se ha actualizado correctamente.";
                }
                else
                {
                    $scope.nuevoModulo.Activo = !$scope.nuevoModulo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeModulo').modal('toggle');
            }).catch(function(error)
            {
                $scope.nuevoModulo.Activo = !$scope.nuevoModulo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeModulo').modal('toggle');
            });
            
            if($scope.objetoCambiarActivo.Activo)
            {
                $scope.objetoCambiarActivo.ActivoN = 1;
            }
            else
            {
                $scope.objetoCambiarActivo.ActivoN = 0;
            }
        }
        
        if($scope.seccion == "medida")
        {
            datos[1] = $scope.objetoCambiarActivo.MedidasPorModuloId;

            ActivarDesactivarMedidasPorModulo($http, $q, CONFIG, datos).then(function(data)
            {
                if(data[0].Estatus == "Exito")
                {
                    $scope.mensaje = "El módulo se ha actualizado correctamente.";
                }
                else
                {
                    $scope.nuevoModulo.Activo = !$scope.nuevoModulo.Activo;
                    $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                } 
                $('#mensajeModulo').modal('toggle');
            }).catch(function(error)
            {
                $scope.nuevoModulo.Activo = !$scope.nuevoModulo.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
                $('#mensajeModulo').modal('toggle');
            });
        }
        
    };
    
    /*----------Datos Módulo Seleccioando---------*/
    $scope.GetMedidasPorModulo = function(moduloId)
    {
        GetMedidasPorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            for(var k=0; k<data.length; k++)
            {
                data[k].AnchoNumero = $scope.FraccionADecimal(data[k].Ancho);
                data[k].AltoNumero = $scope.FraccionADecimal(data[k].Alto);
                data[k].ProfundoNumero = $scope.FraccionADecimal(data[k].Profundo);
            }
            $scope.medidaModulo = data;

        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    $scope.GetConsumiblePorModulo = function(moduloId)
    {
        GetConsumiblePorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.consumibleModulo = data;

            for(var i=0; i<data.length; i++)
            {
                for(var j=0; j<$scope.consumible.length; j++)
                {
                    $scope.consumible[j].mostrar = true;
                    if(data[i].Consumible.ConsumibleId == $scope.consumible[j].ConsumibleId)
                    {
                        $scope.consumible[j].mostrar = false;
                        break;
                    }
                }
            }
            
        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    $scope.GetComponentePorModulo = function(moduloId)
    {
        GetComponentePorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.componenteModulo = data;
            
            for(var i=0; i<$scope.componenteModulo.length; i++)
            {
                for(var j=0; j<$scope.componente.length; j++)
                {
                    $scope.componente[j].mostrar = true;
                    if($scope.componenteModulo[i].Componente.ComponenteId == $scope.componente[j].ComponenteId)
                    {
                        $scope.componente[j].mostrar = false;
                        break;
                    }
                }
            }
            
        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    $scope.GetPartePorModulo = function(moduloId)
    {
        GetPartePorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.parteModulo = data;
            
            for(var k=0; k<$scope.parteModulo.length; k++)
            {
                $scope.parteModulo[k].claseAncho = "entrada";
            }
            
        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    $scope.GetSeccionPorModulo = function(moduloId)
    {
        GetSeccionPorModulo($http, $q, CONFIG, moduloId).then(function(data)
        {
            $scope.seccionModulo = data;
            
            for(var k=0; k<data.length; k++)
            {   
                $scope.GetLuzPorSeccion($scope.seccionModulo[k].SeccionPorModuloId, k);
                $scope.seccionModulo[k].clasePeinazo = "entrada";
                $scope.seccionModulo[k].claseTipoSeccion = "dropdownListModal";
            }
            
        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    $scope.GetLuzPorSeccion = function(seccionId, index)
    {
        GetLuzPorSeccion($http, $q, CONFIG, seccionId).then(function(data)
        {
            $scope.seccionModulo[index].LuzPorSeccion = data;
             
            for(var k=0; k<data.length; k++)
            {
                $scope.seccionModulo[index].LuzPorSeccion[k].claseLuz = "entrada";
            }
            
            if(index === 0)
            {
                $scope.altoLuz = data[0].AltoModulo;
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error." + error);
            return;
        });
    };
    
    /*----------Catálogos auxiliares*/
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
    
    $scope.GetConsumible = function()      
    {
        GetConsumible($http, $q, CONFIG).then(function(data)
        {
            $scope.consumible = data;
            for(var k=0; k<$scope.consumible.length; k++)
        {
            $scope.consumible[k].mostrar = true;
        }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetComponente = function()      
    {
        GetComponente($http, $q, CONFIG).then(function(data)
        {
            $scope.componente = data;
            for(var k=0; k<$scope.componente.length; k++)
            {
                $scope.componente[k].mostrar = true;
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetTipoSeccion = function()      
    {
        $scope.tipoSeccion = GetSeccionModulo();
    };
    
    /*-------Inicializar-------*/
    $scope.InicializarModuloModulos = function()
    {
        $scope.GetModulo();
        $scope.GetConsumible();
        $scope.GetComponente();
        $scope.GetTipoModulo();
        $scope.GetTipoSeccion();
    };
    
    $scope.SetDatosModulo = function(data)
    {
        var modulo =  new Modulo();
        
        modulo.TipoModulo = SetTipoModulo(data.TipoModulo);
        
        modulo.ModuloId = data.ModuloId;
        modulo.Nombre = data.Nombre;
        modulo.Margen = parseFloat(data.Margen);
        modulo.Imagen = data.Imagen;
        modulo.NumeroSeccion = parseInt(data.NumeroSeccion);
        modulo.Desperdicio = parseFloat(data.Desperdicio);
        modulo.Activo = data.Activo;
        
        modulo.MedidasPorModulo = [];
        
        return modulo;
    };
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    //verifica que haya un usuario logeado
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.consultar)
                {
                    $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.InicializarModuloModulos();
                }
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
        else
        {
            $location.path('/Login');
        }
    }
    
    //destecta cuando los datos del usuario cambian
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $location.path('/Login');
            return;
        }
        else
        {
            if($scope.usuarioLogeado.PerfilSeleccionado == "Administrador")
            {
                $scope.IdentificarPermisos();
                if(!$scope.permisoUsuario.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.InicializarModuloModulos();
                }
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
    });
   
});

var pasoModulo = [
                    {nombre:"Datos Módulo", clase:"pasoActivo"},
                    {nombre:"Consumibles", clase:"pasoNoActivo"},
                    {nombre:"Componentes", clase:"pasoNoActivo"},
                    {nombre:"Frente Módulo", clase:"pasoNoActivo" }
                 ];