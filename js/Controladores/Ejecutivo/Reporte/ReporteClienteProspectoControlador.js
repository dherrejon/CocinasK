app.controller("ReporteClienteProspectoControlador", function($scope, $rootScope, $http, $q, CONFIG, $window,  $routeParams, $location, datosUsuario)
{   
    $rootScope.clasePrincipal = "";
    /*----------------verificar los permisos---------------------*/
    $scope.permiso = {ver: false, actulizarOtro:false};
    
    $scope.unidad = [];
    $scope.filtro = {fecha1: "", fecha2: "", unidad: new Object()};
    $scope.buscar = false;
    
    $scope.medioCaptacion = [];
    $scope.otro = [];
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "EjeRMCConsultar")
            {
                $scope.permiso.ver = true;
            }
            
            if($scope.usuarioLogeado.Permiso[k] == "EjeAOMCActualizar")
            {
                $scope.permiso.actulizarOtro = true;
            }
        }
    };
    
    $scope.GetUnidadNegocio = function()
    {
        GetUnidadNegocioSencillaPresupuesto($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.unidad = data;
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
    
    $scope.GetMedioCaptacion = function()              
    {
        GetMedioCaptacion($http, $q, CONFIG).then(function(data)
        {
            $scope.medioCaptacionCatalogo = data;
        
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //---------------- Filtro -----------------
    $scope.CambiarUnidadNegocio = function(unidad)
    {
        if(unidad == 'ninguna')
        {
            $scope.filtro.unidad = new Object();
        }
        else
        {
            $scope.filtro.unidad = unidad;
        }
    };
    
    $scope.CambiarFechaInicio = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.filtro.fecha1 = element.value;
        });
        
        if(element.value.length > 0)
        {
            $('#fechaFin').datetimepicker("minDate", element.value);
        }
        else
        {
            $('#fechaFin').datetimepicker("minDate", false);
        }
    };
    
    $scope.CambiarFechaFin = function(element) 
    {
        $scope.$apply(function($scope) 
        {
            $scope.filtro.fecha2 = element.value;
        });
        
        if(element.value.length > 0)
        {
            $('#fechaInicio').datetimepicker("maxDate", element.value);
        }
        else
        {
            $('#fechaInicio').datetimepicker("maxDate", new Date());
        }
    };
    
    $('#fechaInicio').datetimepicker(
    {
        locale: 'es',
        format: 'DD/MMM/YYYY',
        maxDate: new Date(),
        date: null
    });
    
    $('#fechaFin').datetimepicker(
    {
        locale: 'es',
        format: 'DD/MMM/YYYY',
        maxDate: new Date(),
        date: null
    }); 
    
    $scope.LimpiarFiltro = function()
    {
        $scope.filtro = {fecha1: "", fecha2: "", unidad: new Object()};
        $('#fechaInicio').data("DateTimePicker").clear();
        $('#fechaFin').data("DateTimePicker").clear();
        
        $scope.buscar = false;
        
        $('#fechaFin').datetimepicker("minDate", false);
        $('#fechaInicio').datetimepicker("maxDate", new Date());
    };
    
    //---- Enviar Filtro
    $scope.GetReporteMedioCaptacion = function()
    {   
        GetReporteMedioCaptacion($http, $q, CONFIG, $scope.datos).then(function(data)
        {
            var sql = "SELECT *, IF(MedioUsado = '0', 0, COUNT(*) )AS Numero FROM ?  GROUP BY MedioCaptacionId ORDER BY Nombre";
            $scope.medioCaptacion = alasql(sql, [data]);
            
            var sql = "SELECT DISTINCT Otro AS Nombre FROM ? WHERE MedioCaptacionId = '0' ORDER BY Otro ASC";
            $scope.otro = alasql(sql, [data]);
            
            $scope.total = 0;
            for(var k=0; k<$scope.medioCaptacion.length; k++)
            {
                $scope.total += parseInt($scope.medioCaptacion[k].Numero);
            }
            
            for(var k=0; k<$scope.medioCaptacion.length; k++)
            {
                $scope.medioCaptacion[k].Porcentaje = parseInt($scope.medioCaptacion[k].Numero)/$scope.total * 100;
                $scope.medioCaptacion[k].Porcentaje = parseFloat($scope.medioCaptacion[k].Porcentaje.toFixed(2));
            }
            
            $scope.Graficar();
            
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    $scope.GetContratoFiltro = function()
    {
        if(!$scope.ValidarFiltro())
        {
            return;
        }
        else
        {
            $scope.buscar = true;
            $scope.GetReporteMedioCaptacion();
        }
    };
    
    $scope.ValidarFiltro = function()
    {
        $scope.datos = {fecha1:"", fecha2:"", unidadId:""};
        $scope.mensajeError = [];
        
        if($scope.filtro.fecha1 || $scope.filtro.fecha2)
        {
            if(!$scope.filtro.fecha1 || !$scope.filtro.fecha2)
            {
                if(!$scope.filtro.fecha1)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona la primera fecha.";
                }
                
                if(!$scope.filtro.fecha2)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona la segunda fecha.";
                }
            }
            
            if($scope.mensajeError.length == 0)
            {
                $scope.datos.fecha1 = GetFechaAbrEng($scope.filtro.fecha1);
                $scope.datos.fecha2 = GetFechaAbrEng($scope.filtro.fecha2);

                if($scope.datos.fecha1 > $scope.datos.fecha2)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*La primera fecha debe ser menor a la segunda.";
                }
            }
        }
        else
        {
            $scope.datos.fecha1 = -1;
            $scope.datos.fecha2 = -1;
        }
    
        if($scope.filtro.unidad.UnidadNegocioId != undefined && $scope.filtro.unidad.UnidadNegocioId != null )
        {
            $scope.datos.unidadId = $scope.filtro.unidad.UnidadNegocioId;
        }
        else
        {
            $scope.datos.unidadId = -1;
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
    
    //_------------------ graficar -----
    $scope.Graficar = function()
    {
        var label = [];
        var valor = [];
        
        for(var k=0; k<$scope.medioCaptacion.length; k++)
        {
            label[k] = $scope.medioCaptacion[k].Nombre + " (" +  $scope.medioCaptacion[k].Numero + ")";
            valor[k] = $scope.medioCaptacion[k].Porcentaje;
        }
        
        $('#myChart').remove();
        
        $('#contenedorGrafica').append('<canvas id="myChart"><canvas>');
       
        
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',

            // The data for our dataset
            data: 
            {
                labels: label,
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: ['red', 'rgb(250, 97, 21)', 'purple', 'pink', 'skyblue', 'blue', 'green', 'darkgreen', '#F1C40F', 'lightgray', 'black', 'darkred', '#D7BDE2', '#48C9B0', '#34495E', '#F39C12', '#33FCFF'],
                    borderColor: 'rgb(255, 255, 255)',
                    data: valor,
                }],
            },

            // Configuration options go here
            options: {}
        });  
    };
    
    
    
    //-------------------- Otro Medio Captacion -------------------------------------------------
    $scope.AbrirMedioCaptacionOtro = function()
    { 
        $scope.InicializarOtroMedioCaptacion();
        
        $('#medioCaptacionModalOtroReporte').modal('toggle');
    };
    
    $scope.InicializarOtroMedioCaptacion = function()
    {
        for(var k=0; k<$scope.otro.length; k++)
        {
            $scope.otro[k].Seleccionado = false;
        }
        
        $scope.otroNuevo = false;
        $scope.medioCaptacionOtro = new MedioCaptacion();
        $scope.mensajeErrorOtro = [];
    };
    
    $scope.CambiarMedioCaptacion = function(medio)
    {
        if(medio == "Nuevo")
        {
            $scope.otroNuevo  = true;
            $scope.medioCaptacionOtro = new MedioCaptacion();
        }
        else
        {
            $scope.otroNuevo = false;
            $scope.medioCaptacionOtro = medio;
        }
        
    };
    
    $scope.TerminarMedioCaptacionOtro = function(nombreInvalido)
    {
        if(!$scope.ValidarDatosOtroMedioCaptacion(nombreInvalido))
        {
            return;
        }
        else
        {
            $scope.medioCaptacionOtro.Otro = $scope.otro;
            $scope.medioCaptacionOtro.Nuevo = $scope.otroNuevo;
            $scope.ActualizarMedioCaptacion();
        }
    };
    
    $scope.ActualizarMedioCaptacion = function()
    {
        ActualizarMedioCaptacion($http, CONFIG, $q, $scope.medioCaptacionOtro).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                //$('#medioCaptacionModalOtro').modal('toggle');
                $scope.mensaje = "El medio de captación se ha actualizado.";
                
                $scope.GetReporteMedioCaptacion();
                
                if($scope.otroNuevo)
                {
                    $scope.GetMedioCaptacion();
                }
                
                $scope.InicializarOtroMedioCaptacion();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeMedioCaptacionReporte').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioCaptacionReporte').modal('toggle');
        });
    };
    
    $scope.ValidarDatosOtroMedioCaptacion = function(nombreInvalido)
    {
        $scope.mensajeErrorOtro = [];
        if($scope.otroNuevo)
        {
            if(nombreInvalido)
            {
                $scope.mensajeErrorOtro[$scope.mensajeErrorOtro.length] = "*El nombre solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            }
            else
            {
                for(var k=0; k<$scope.medioCaptacionCatalogo.length; k++)
                {
                    if($scope.medioCaptacionOtro.Nombre.toLowerCase() == $scope.medioCaptacion[k].Nombre.toLowerCase())
                    {
                        $scope.mensajeErrorOtro[$scope.mensajeErrorOtro.length] = "*El medio de captación " + $scope.medioCaptacionOtro.Nombre.toLowerCase() + " ya existe.";
                        return false;
                    }
                }
            }
        }
        else
        {
            if(!$scope.medioCaptacionOtro.Nombre)
            {
                $scope.mensajeErrorOtro[$scope.mensajeErrorOtro.length] = "*Selecciona un medio de captación.";
            }
        }
        
        var seleccionado = false;
        for(var k=0; k<$scope.otro.length; k++)
        {
            if($scope.otro[k].Seleccionado)
            {
                seleccionado = true;
            }
        }
        if(!seleccionado)
        {
            $scope.mensajeErrorOtro[$scope.mensajeErrorOtro.length] = "*Selecciona mínimo un medio de captación a actualizar.";
        }
        
        if($scope.mensajeErrorOtro.length>0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
 

    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.Inicializar = function()
    {
        
        $scope.IdentificarPermisos();
        if(!$scope.permiso.ver)
        {
            $rootScope.IrAHomePerfil($scope.usuarioLogeado.PerfilSeleccionado);
        }
        else
        {
            $scope.GetUnidadNegocio();
            $scope.GetMedioCaptacion();
        }
    };
    
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            } 
            else if($scope.usuarioLogeado.PerfilSeleccionado == "Ejecutivo")
            {
                $scope.Inicializar();
            }
            else
            {
                $rootScope.IrAHomePerfil($scope.usuarioLogeado.PerfilSeleccionado);
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
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $location.path('/Login');
            return;
        }
        else
        {
            if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $location.path('/Perfil');
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado == "Ejecutivo")
            {
                $scope.Inicializar();
            }
            else
            {
                $rootScope.IrAHomePerfil($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
    });
    
    
});


