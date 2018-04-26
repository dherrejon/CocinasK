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
    $scope.Borrar = null;
    
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
            $scope.pregunta = [];
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
    
    //--GuardarEncuesta 
    $scope.GuardarEncuesta = function()
    {
        if(!$scope.ValidarEncuesta())
        {
            return;
        }
        else
        {
            var encuesta = SetEncuesta($scope.nuevaEncuesta, "Guardar");
            
            for(var k=0; k<$scope.pregunta.length; k++)
            {
                encuesta.Pregunta[k] = SetPregunta($scope.pregunta[k], "Guardar");
            }
            
            
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarEncuesta(encuesta);
            }
            else if($scope.operacion == "Editar")
            {
                $scope.EditarEncuesta(encuesta);
            }
        }
    };
    
    
    $scope.AgregarEncuesta = function(encuesta)
    {
        (self.servicioObj = CocinasKService.Post('Encuesta', encuesta)).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.GetEncuesta();
                $scope.CerrarEncuesta();
                $('#encuestaModal').modal('toggle');
                
                $scope.mensaje = "Encuesta agregada";
                $('#mensajeEncuesta').modal('toggle');
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede realizar la operación, intentelo más tarde", 'error');
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
    $scope.EditarEncuesta = function(encuesta)
    {
        (self.servicioObj = CocinasKService.Put('Encuesta', encuesta)).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.GetEncuesta();
                $scope.CerrarEncuesta();
                $('#encuestaModal').modal('toggle');
                
                $scope.mensaje = "Encuesta editada";
                $('#mensajeEncuesta').modal('toggle');
            } 
            else 
            {
                $rootScope.$broadcast('Alerta', "Por el momento no se puede realizar la operación, intentelo más tarde", 'error');
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $rootScope.$broadcast('Alerta', error, 'error');
        });
    };
    
    $scope.ValidarEncuesta = function()
    {
        $scope.mensajeError = [];
        
        if(!$scope.nuevaEncuesta.Nombre)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "Indica el título de la encuesta.";
        }
        else
        {
            for(var k=0; k<$scope.encuesta.length; k++)
            {
                if($scope.encuesta[k].Nombre.toLowerCase() == $scope.nuevaEncuesta.Nombre.toLowerCase() && $scope.encuesta[k].EncuestaId != $scope.nuevaEncuesta.EncuestaId)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "La encuesta " + $scope.nuevaEncuesta.Nombre + " ya existe.";
                    break;
                }
            }
        }
        
        if($scope.pregunta.length == 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "Indica al menos una pregunta para la encuesta.";
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
    
    //-- Cerrar Encuesta 
    $scope.CerrarEncuesta = function()
    {
        $scope.nuevaEncuesta = null;
        $scope.pregunta = [];
        $scope.mensajeError = [];
    };
    
    
    //-------- Cambiar de estatus encuesta -------
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
            $scope.nuevaPregunta.Respuesta.push(new Respuesta());
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
    
    
    $scope.QuitarRespuesta = function(index)
    {
        $scope.nuevaPregunta.Respuesta.splice(index, 1);
    };
    
    $scope.AgregarRespuesta = function()
    {
        $scope.nuevaPregunta.Respuesta.push(new Respuesta());
    };
    
    //-- Guardar Pregunta
    
    $scope.GuardarPregunta = function()
    {
        if(!$scope.ValidarPregunta())
        {
            return;
        }
        else
        {
            if($scope.operacionPregunta == "Agregar" || $scope.operacionPregunta == "Copiar")
            {
                $scope.AgregarPregunta();
            }
            else if($scope.operacionPregunta == "Editar")
            {
                $scope.EditarPregunta();
            }
        }
        
        $('#preguntaModal').modal('toggle');
    };
    
    $scope.AgregarPregunta = function()
    {
        //calcaular id de la pregunta
        var id = -1;
        
        for(var k=0; k<$scope.pregunta.length; k++)
        {
            if(parseInt($scope.pregunta[k].PreguntaId) <= -1)
            {
                id--;
            }
        }
        
        $scope.nuevaPregunta.PreguntaId = id.toString();
        
        $scope.pregunta.push($scope.nuevaPregunta);
    };
    
    $scope.EditarPregunta = function()
    {
        for(var k=0; k<$scope.pregunta.length; k++)
        {
            if($scope.pregunta[k].PreguntaId == $scope.nuevaPregunta.PreguntaId)
            {
                $scope.pregunta[k] = SetPregunta($scope.nuevaPregunta , 'Preguardar');
                $scope.pregunta[k].Editar = true;
                
                return;
            }
        }
    };
    
    
    $scope.ValidarPregunta = function()
    {
        $scope.mensajeError = [];
        
        if(!$scope.nuevaPregunta.Pregunta)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "Indica la pregunta";
        }
        
        if(!$scope.nuevaPregunta.TipoPregunta.TipoPreguntaId)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "Indica el tipo de pregunta";
        }
        else
        {
            if($scope.nuevaPregunta.TipoPregunta.TipoPreguntaId == "1" || $scope.nuevaPregunta.TipoPregunta.TipoPreguntaId == "2")
            {
                if($scope.nuevaPregunta.Respuesta.length == 0)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "Indica al menos una respuesta";
                }
                else
                {
                    for(var k=0; k<$scope.nuevaPregunta.Respuesta.length; k++)
                    {
                        if(!$scope.nuevaPregunta.Respuesta[k].Respuesta)
                        {
                            $scope.mensajeError[$scope.mensajeError.length] = "Indica la respuesta " + (k+1);
                        }
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
    
    
    //--- cerrar
    $scope.CerrarPreguntaModal = function()
    {
        $scope.nuevaPregunta = null;
        $scope.mensajeError = [];  
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
    
    //Eliminar Pregunta 
    $scope.BorrarPregunta = function(pregunta)
    {
        $scope.mensajeAdvertencia = "¿Estas seguro de eliminar la pregungta \"" + pregunta.Pregunta  +"\" de la encuesta?";
        $scope.idBorrarPregunta = pregunta.PreguntaId;
        
        $('#modalBorrarPregunta').modal('toggle');
    };
    
    $scope.ConfirmarBorrarPregunta = function()
    {
        $scope.Borrar = $scope.idBorrarPregunta ;
        setTimeout(function()
        {
            for(var i=0; i<$scope.pregunta.length; i++)
            {
                if($scope.pregunta[i].PreguntaId == $scope.idBorrarPregunta )
                {
                    $scope.pregunta.splice(i,1);
                    break;
                }
            }   

            $scope.Borrar = "";

            $scope.$apply();
        }, 700);
    };
    
    $scope.CancelarBorrarPregunta = function()
    {
        $scope.mensajeAdvertencia = "";
        $scope.idBorrarPregunta = "";  
    };
    

    
});