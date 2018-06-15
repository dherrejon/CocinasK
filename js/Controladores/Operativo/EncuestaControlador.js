app.controller("AplicarEncuestaControlador", function($scope, $rootScope, $location, CITA, $http, $q, CONFIG, CocinasKService )
{   
    $scope.motivoRechazo = {usuarioId: "", motivo:"", encuestaSugeridaId: ""};
    $scope.encuesta = {personaId:"", usuarioId: "", encuestaSugeridaId: "", pregunta:[], encuestaId:"", tipo:"", tipoId:""};
    
    //Rechazar Encuesta 
    $scope.$on('RechazarEncuesta',function(evento, encuesta)
    {
        $scope.motivoRechazo = {usuarioId: encuesta.UsuarioId, motivo:"", encuestaSugeridaId: encuesta.EncuestaSugeridaId};
        $("#rechazoEncuesta").modal('toggle');
    });
    
    $scope.TerminarRechazarEncuesta = function()
    {   
        if(!$scope.ValidarEncuesta())
        {
            return;
        }
        
        (self.servicioObj = CocinasKService.Put('Encuesta/Rechazar',  $scope.motivoRechazo)).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $rootScope.$broadcast('EncuestaRechazadaGuardada', $scope.motivoRechazo);
                $scope.CerrarModalRechazarEncuesta();
                
                $scope.mensaje = "La encuesta se ha rechazado.";
                $('#mensajeAplicarEncuesta').modal('toggle'); 
            } 
            else 
            {
                $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
                $('#mensajeAplicarEncuesta').modal('toggle'); 
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
            $('#mensajeAplicarEncuesta').modal('toggle'); 
        });
    };
    
    $scope.ValidarEncuesta = function()
    {
        $scope.mensajeError = [];
        if(!$scope.motivoRechazo.motivo)
        {
            $scope.mensajeError[0] = "*Indica el motivo por el cual el cliente rechazó realizar la encuesta.";
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
    
    
    $scope.CerrarModalRechazarEncuesta = function()
    {
        $("#rechazoEncuesta").modal('toggle');
    };
    
    //---- Aplicar Encuesta -------------
    $scope.GetEncuesta = function()
    {   
        (self.servicioObj = CocinasKService.Get('Encuesta' )).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.encuestaLista = dataResponse.data;
                
                for(var k=0; k<$scope.encuesta.length; k++)
                {
                    $scope.encuestaLista[k].Activo = $scope.encuesta[k].Activo == "1" ? true : false; 
                }
            } 
            else 
            {
                $scope.CerrarEncuestaLista();
                $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
                $('#mensajeAplicarEncuesta').modal('toggle'); 
                $scope.encuestaLista = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $scope.CerrarEncuestaLista();
            $scope.mensaje = error;
            $('#mensajeAplicarEncuesta').modal('toggle'); 
            $scope.encuestaLista = [];
            
        });
    };
    
    $scope.GetPreguntaEncuesta = function(encuesta)
    {   
        (self.servicioObj = CocinasKService.Get('Encuesta/' + encuesta.EncuestaId + "/Pregunta" )).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.encuesta.pregunta = dataResponse.data;
                
                for(var k=0; k<$scope.encuesta.pregunta.length; k++)
                {
                    $scope.encuesta.pregunta[k] = SetPregunta($scope.encuesta.pregunta[k], 'Iniciar');
                    
                    $scope.encuesta.pregunta[k].ComentarioRespuesta = "";
                    $scope.encuesta.pregunta[k].RespuestaSel = "";
                    $scope.encuesta.pregunta[k].EspecificarOtro = "";
                    $scope.encuesta.pregunta[k].RespuestaSelOtro = false;
                    
                    for(var i=0; i<$scope.encuesta.pregunta[k].Respuesta.length; i++)
                    {
                        $scope.encuesta.pregunta[k].Respuesta[i].RespuestaSel = false;
                    }
                }
            } 
            else 
            {
                $scope.CerrarAplicarEncuesta();
                $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
                $('#mensajeAplicarEncuesta').modal('toggle'); 
                $scope.encuesta.pregunta = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $scope.encuesta.pregunta = [];
            $scope.CerrarAplicarEncuesta();
            $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
            $('#mensajeAplicarEncuesta').modal('toggle'); 
        });
    };
    
    $scope.$on('AplicarEncuesta',function(evento, encuesta)
    {
        $scope.encuesta = {personaId: encuesta.PersonaId, usuarioId: encuesta.UsuarioId, encuestaSugeridaId: encuesta.EncuestaSugeridaId, pregunta:[], encuestaId:"", tipo: encuesta.NombreTipoEncuesta, tipoId: encuesta.TipoEncuestaId};
        $scope.GetEncuesta();
        $("#encuestaLista").modal('toggle');
    });
    
    $scope.CerrarEncuestaLista = function()
    {
        $("#encuestaLista").modal('toggle');
    };
    
    $scope.CerrarEncuesta = function()
    {
        $("#aplicarEncuesta").modal('toggle');
    };
    
    
    $scope.AplicarEncuesta = function(data)
    {
        $("#encuestaLista").modal('toggle');
        $scope.encuesta.encuestaId = data.EncuestaId;
        $("#aplicarEncuesta").modal('toggle');
        
        $scope.GetPreguntaEncuesta(data);
    };
    
    $scope.CerrarAplicarEncuesta = function()
    {
        $("#aplicarEncuesta").modal('toggle');
    };
    
    $scope.GuardarEncuestaAplicada = function()
    {
        if(!$scope.ValidarEncuestaAplicada())
        {
            return;
        }
        else
        {
            $scope.GuardarAplicarEncuesta();
        }
    };
    
    $scope.GuardarAplicarEncuesta = function()
    {  
        (self.servicioObj = CocinasKService.Post('Encuesta/Aplicar',  $scope.encuesta)).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $rootScope.$broadcast('EncuestaAplicada', $scope.motivoRechazo);
                $scope.CerrarEncuesta();
                
                $scope.mensaje = "La encuesta se guardo con éxito.";
                $('#mensajeAplicarEncuesta').modal('toggle'); 
            } 
            else 
            {
                $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
                $('#mensajeAplicarEncuesta').modal('toggle'); 
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
            $('#mensajeAplicarEncuesta').modal('toggle'); 
        });
    };
    
    $scope.ValidarEncuestaAplicada = function()
    {
        var error = false;
        
        for(var k=0; k<$scope.encuesta.pregunta.length; k++)
        {
            var pregunta = $scope.encuesta.pregunta[k];
            pregunta.Error = "";
            
            //comentario
            if(pregunta.TipoPregunta.TipoPreguntaId == "3")
            {
                if(!pregunta.ComentarioRespuesta)
                {
                    pregunta.Error = "*Escribe el comentario del cliente.";   
                    error = true;
                }
            }
            
            //ratio button
            if(pregunta.TipoPregunta.TipoPreguntaId == "1")
            {
                if(!pregunta.RespuestaSel)
                {
                    pregunta.Error = "*Selecciona una opción. ";   
                    error = true;
                }
                
                if(pregunta.Otro)
                {
                    if(pregunta.RespuestaSel == "Otro" && !pregunta.EspecificarOtro)
                    {
                        pregunta.Error = "*Especifica la respuesta de otro. ";   
                        error = true;
                    }
                }
            }
            
            
            //checkbox
            if(pregunta.TipoPregunta.TipoPreguntaId == "2")
            {
                if(!pregunta.RespuestaSelotro)
                {
                    var respuesta = false;
                    for(var i=0; i<pregunta.Respuesta.length; i++)
                    {
                        if(pregunta.Respuesta[i].RespuestaSel)
                        {
                            respuesta = true;
                            break;
                        }
                    }
                    
                    if(!respuesta)
                    {
                        pregunta.Error = "*Selecciona almenos una opción. ";   
                        error = true;
                    }
                }
                
                if(pregunta.Otro)
                {
                    if(pregunta.RespuestaSelotro && !pregunta.EspecificarOtro)
                    {
                        pregunta.Error = "*Especifica la respuesta de otro. ";   
                        error = true;
                    }
                }
            }
            
            //---- comentario adicional--
            if(pregunta.Comentario)
            {
                if(!pregunta.ComentarioRespuesta)
                {
                    pregunta.Error += "*Escribe el comentario del cliente. ";   
                    error = true;
                }
            }
            
        }
        
        if(error)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    //-- Detalle Encuesta --
    $scope.GetDetalleEncuesta = function(encuesta)
    {   
        (self.servicioObj = CocinasKService.Get('/Encuesta/Aplicar/Detalle/' + encuesta.EncuestaPorPersonaId)).then(function (dataResponse) 
        {
            if (dataResponse.status == 200) 
            {
                $scope.detalleEncuesta = dataResponse.data;
                
                $scope.SetRespuestaPregunta($scope.detalleEncuesta.Pregunta);
            } 
            else 
            {
                $scope.CerrarDetalle();
                $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
                $('#mensajeAplicarEncuesta').modal('toggle'); 
                $scope.encuesta.pregunta = [];
            }
            self.servicioObj.detenerTiempo();
        }, 
        function (error) 
        {
            $scope.encuesta.pregunta = [];
            $scope.CerrarDetalle();
            $scope.mensaje = "Ha ocurrido un errror. Intente más tarde.";
            $('#mensajeAplicarEncuesta').modal('toggle'); 
        });
    };
    
    $scope.SetRespuestaPregunta = function(pregunta)
    {
        for(var k=0; k<pregunta.length; k++)
        {
            pregunta[k].Comentario = pregunta[k].Comentario == "1" ? true : false;
            pregunta[k].Otro = pregunta[k].Otro == "1" ? true : false;
            pregunta[k].TipoPregunta = new TipoPregunta();
            pregunta[k].TipoPregunta.TipoPreguntaId = pregunta[k].TipoPreguntaId;
            
            //ratio button
            if(pregunta[k].TipoPreguntaId == "1")
            {
                pregunta[k].RespuestaSel = pregunta[k].RespuestaContestada[0].Respuesta;
            }
            
            //check box
            if(pregunta[k].TipoPreguntaId == "2")
            {
                pregunta[k].RespuestaSelOtro = (pregunta[k].EspecificarOtro && pregunta[k].Otro) ? true : false;
                
                for(var i=0; i<pregunta[k].Respuesta.length; i++)
                {
                    pregunta[k].Respuesta[i].RespuestaSel = false;
                    
                    for(var j=0; j<pregunta[k].RespuestaContestada.length; j++)
                    {
                        if(pregunta[k].RespuestaContestada[j].Respuesta.toLowerCase() == pregunta[k].Respuesta[i].Respuesta.toLowerCase())
                        {
                            pregunta[k].Respuesta[i].RespuestaSel = true;
                            break;
                        }
                    }
                }
            }
        }
    };
    
    $scope.$on('DetalleEncuestaAplicada',function(evento, encuesta)
    {   
        $scope.GetDetalleEncuesta(encuesta);
        
        $("#detalleEncuesta").modal('toggle');
    });
    
    $scope.CerrarDetalle = function()
    {
        $("#detalleEncuesta").modal('toggle');
    };
    
    
});
