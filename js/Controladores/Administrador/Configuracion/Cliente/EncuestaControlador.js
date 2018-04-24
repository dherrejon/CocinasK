app.controller("EncuestaControlador", function($scope, $http, $q, CONFIG, $rootScope, CocinasKService)
{   
    
    $scope.encuesta = [];
    $scope.pregunta = [];
    $scope.buscarEncuesta = "";
    $scope.ordenEncuesta = "Nombre";
    $scope.operacion = "";
    $scope.nuevaEncuesta = null;
    
    $scope.Subir = null;
    $scope.Bajar = null;
    
    $scope.operacionPregunta = "";
    $scope.nuevaPregunta = null;
    $scope.tipoPregunta = GetTipoPregunta();

    $scope.GetEncuesta = function()
    {   
        (self.servicioObj = CocinasKService.Get('Encuesta' )).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.encuesta = dataResponse.data;
                
                for(var k=0; k<$scope.encuesta.length; k++)
                {
                    $scope.encuesta[k].Activo = $scope.encuesta[k].Activo == "1" ? true : false; 
                }
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede cargar la información.", 'error');
                $scope.encuesta = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
    
    //---- Ordenar ----
    $scope.CambiarOrdenEncuesta = function(orden)
    {
        if(orden == $scope.ordenEncuesta)
        {
            $scope.ordenEncuesta = "-" + orden;
        }
        else
        {
            $scope.ordenEncuesta = orden;
        }
    };
    
    $scope.SubirOrdenPrioridad = function(data)
    {
        $scope.optOrden = "Subir";
        var priordidad = [];
        var p = new Prioridad();
        p.PrioridadId = data.PrioridadId;
        p.Orden = parseInt(data.Orden) -1;
        priordidad.push(p);
        
        for(var k=0; k<$scope.prioridad.length; k++)
        {
            if(parseInt($scope.prioridad[k].Orden) ==  priordidad[0].Orden)
            {
                p = new Prioridad();
                p.PrioridadId = $scope.prioridad[k].PrioridadId;
                p.Orden = parseInt($scope.prioridad[k].Orden) +1;
                priordidad.push(p);
                break;
            }
        }
        
        $scope.EditarOrdenPrioridad(priordidad);
    };
    
    
    //----- Trabajar con la encueta ----
    $scope.AbrirEncuesta = function(operacion, encuesta)
    {
        $scope.operacion = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevaEncuesta = new Encuesta();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaEncuesta = SetEncuesta(encuesta, "Editar");
            
            $scope.GetPreguntaEncuesta(encuesta);
        }
        
        $('#encuestaModal').modal('toggle');
    };
    
        //--- Obtines las preguntas y respuestas de las encuestas
    $scope.GetPreguntaEncuesta = function(encuesta)
    {   
        (self.servicioObj = CocinasKService.Get('Encuesta/' + encuesta.EncuestaId + "/Pregunta" )).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.pregunta = dataResponse.data;
                
                for(var k=0; k<$scope.pregunta.length; k++)
                {
                    $scope.pregunta[k] = SetPregunta($scope.pregunta[k], 'Iniciar');
                }
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede cargar la información.", 'error');
                $scope.pregunta = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $scope.pregunta = [];
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
        //----------------- cambiar orden pregunta ---
    $scope.BajarOrdenPregunta = function(pregunta1, pregunta2, indice)
    {
        $scope.pregunta[indice] = pregunta2;
        $scope.pregunta[indice+1] = pregunta1;
        
        $scope.EditarOrdenPregunta(pregunta1.PreguntaId, pregunta2.PreguntaId);
    };
    
    $scope.SubirOrdenPregunta = function(pregunta1, pregunta2, indice)
    {
        
        $scope.pregunta[indice] = pregunta2;
        $scope.pregunta[indice-1] = pregunta1;
        
        $scope.EditarOrdenPregunta(pregunta2.PreguntaId, pregunta1.PreguntaId);
    };
    
    
    
    $scope.EditarOrdenPregunta = function( bajar, subir)
    {        
        $scope.Subir = subir;
        $scope.Bajar = bajar;

        setTimeout(function()
        {
             $scope.Bajar = "";
             $scope.Subir = "";
             $scope.$apply();
        }, 700);
    };
    
    //-------- Cambiar de estatus el proyecto -------
    $scope.CambiarEstatusEncuesta = function(encuesta)
    {
        $scope.encuestaActualizar = encuesta;
        var estatus = encuesta.Activo ? "ACTIVAR" : "DESACTIVAR";
        $scope.mensajeAdvertencia = "¿Estas seguro de " + estatus + " la encuesta \"" + encuesta.Nombre + "\"?";
        
        $("#modalEstatusEncuesta").modal('toggle');
    };
    
    $scope.CancelarEstatusEncuesta = function()
    {        
        $scope.encuestaActualizar.Activo = !$scope.encuestaActualizar.Activo;
    };
    
    $scope.ConfirmarActualizarEncuesta = function()
    {        
        var datos = new Encuesta();
        datos.EncuestaId = $scope.encuestaActualizar.EncuestaId;
        datos.Activo = $scope.encuestaActualizar.Activo ? "1" : "0";
        
        (self.servicioObj = CocinasKService.Put('Encuesta/Estatus', datos )).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $rootScope.mensaje = "El estatus de la encuesta se ha actualizado correctamente.";
            } 
            else 
            {
                $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
                $scope.encuestaActualizar.Activo = !$scope.encuestaActualizar.Activo;
            }
            self.servicioObj.detenerTiempo();
                    
            $("#mensajeEncuesta").modal('toggle');
            
        }, 
        function (error) 
        {
            $scope.encuestaActualizar.Activo = !$scope.encuestaActualizar.Activo;
            $rootScope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            
             $("#mensajeEncuesta").modal('toggle');
        });
    };
    
    
    //-----------------  Pregunta ------------------------
    $scope.AbrirPregunta = function(operacion, objeto)
    {
        $scope.operacionPregunta = operacion;
        
        if(operacion == "Agregar")
        {
            $scope.nuevaPregunta = new Pregunta();
        }
        else if(operacion == "Editar")
        {
            $scope.nuevaPregunta = SetPregunta(objeto, "Editar");
        }
        else if(operacion == "Copiar")
        {
            $scope.nuevaPregunta = SetPregunta(objeto, "Copiar");
        }
        
        $("#preguntaModal").modal('toggle');
    };
    
    
    //------- tipo pregunta ---
    $scope.CambiarTipoPregunta = function(tipo)
    {
        $scope.nuevaPregunta.TipoPregunta = tipo;
        
        
        if(tipo.TipoPreguntaId == "3")
        {
            $scope.nuevaPregunta.Otro = false;
            $scope.nuevaPregunta.Comentario = false;
        }
    };
    
});