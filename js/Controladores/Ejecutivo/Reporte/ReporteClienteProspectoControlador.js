app.controller("ReporteClienteProspectoControlador", function($scope, $rootScope, $http, $q, CONFIG, $window,  $routeParams, $location, datosUsuario)
{   
    $rootScope.clasePrincipal = "";
    /*----------------verificar los permisos---------------------*/
    $scope.permiso = {ver: false};
    
    $scope.unidad = [];
    $scope.filtro = {fecha1: "", fecha2: "", unidad: new Object()};
    $scope.buscar = false;
    
    $scope.reporte = new Object();
    
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "EjeRCPConsultar")
            {
                $scope.permiso.ver = true;
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
    $scope.GetReporteClientePersona = function()
    {   
        GetReporteClientePersona($http, $q, CONFIG, $scope.datos).then(function(data)
        {
            $scope.reporte = new Object();
            $scope.reporte.NumeroPersona = data.length;
            $scope.reporte.NumeroCliente = 0;
            $scope.reporte.NumeroClientePro = 0;
            $scope.reporte.NumeroClienteNormal = 0;
            
            for(var k=0; k<data.length; k++)
            {
                data[k].Numero = parseInt(data[k].Numero);
                
                if(data[k].Numero > 0)
                {
                    $scope.reporte.NumeroCliente++;
                    
                    if(data[k].Numero > 1)
                    {
                        $scope.reporte.NumeroClientePro++;
                    }
                    else
                    {
                        $scope.reporte.NumeroClienteNormal++;
                    }
                }
            }
            
            $scope.reporte.PorcentajePersona = (($scope.reporte.NumeroPersona - $scope.reporte.NumeroCliente)/$scope.reporte.NumeroPersona)*100;
            $scope.reporte.PorcentajeCliente = ($scope.reporte.NumeroCliente/$scope.reporte.NumeroPersona)*100;
            $scope.reporte.PorcentajeClientePro = ($scope.reporte.NumeroClientePro/$scope.reporte.NumeroPersona)*100;
            $scope.reporte.PorcentajeClienteNormal = ($scope.reporte.NumeroClienteNormal/$scope.reporte.NumeroPersona)*100;
            
            
            $scope.reporte.PorcentajePersona = parseFloat($scope.reporte.PorcentajePersona.toFixed(2));
            $scope.reporte.PorcentajeCliente = parseFloat($scope.reporte.PorcentajeCliente.toFixed(2));
            $scope.reporte.PorcentajeClientePro = parseFloat($scope.reporte.PorcentajeClientePro.toFixed(2));
            $scope.reporte.PorcentajeClienteNormal = parseFloat($scope.reporte.PorcentajeClienteNormal.toFixed(2));
            
            $scope.reporte.PorcentajeClienteRedondeado = Math.round($scope.reporte.PorcentajeCliente/10);
            
            
            //$scope.reporte.Leyenda = "Por cada 10 personas registradas" + $scope.reporte.PorcentajeClienteRedondeado + " se convierten en clientes de Cocinas k";
            
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
            $scope.GetReporteClientePersona();
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
        
        label[0] = "Personas registradas sin contrato (" + ($scope.reporte.NumeroPersona - $scope.reporte.NumeroCliente) + ")";
        label[1] = "Personas con un contrato (" + $scope.reporte.NumeroClienteNormal + ")";
        label[2] = "Personas con más de un contrato (" + $scope.reporte.NumeroClientePro + ")";
        
        valor[0] = $scope.reporte.PorcentajePersona;
        valor[1] = $scope.reporte.PorcentajeClienteNormal;
        valor[2] = $scope.reporte.PorcentajeClientePro;
        
        $('#chartCliente').remove();
        
        $('#contenedorGraficaCliente').append('<canvas id="chartCliente"><canvas>');
       
        
        var ctx = document.getElementById('chartCliente').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',

            // The data for our dataset
            data: 
            {
                labels: label,
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: ['lightgray', 'red', 'rgb(250, 97, 21)'],
                    borderColor: 'rgb(255, 255, 255)',
                    data: valor,
                }],
            },

            // Configuration options go here
            options: {}
        });  
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
            $scope.GetContratoFiltro();
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


