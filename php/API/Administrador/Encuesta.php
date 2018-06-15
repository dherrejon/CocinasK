<?php


function GetEncuesta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM Encuesta";

    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $db = null;
        echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function EstatusEncuesta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Encuesta SET Activo = ".$datos->Activo." WHERE EncuestaId = ".$datos->EncuestaId."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        
        $app->status(200);
        $db = null;
        echo '[{"renglones":'. $stmt->rowCount() .'}]';
    }
    catch(PDOException $e) {
        echo ($e);
        $app->status(409);
        $app->stop();
    }
}


//--- Preguntas
function GetPreguntaEncuesta($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM PreguntaPorEncuestaVista WHERE EncuestaId = ".$id;

    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $pregunta = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $count = count($pregunta);
        
        for($k=0; $k<$count; $k++)
        {
            $sql = "SELECT * FROM RespuestaPorPreguntaVista WHERE PreguntaId = ".$pregunta[$k]->PreguntaId;
            try 
            {
                $stmt = $db->query($sql);
                $pregunta[$k]->Respuesta = $stmt->fetchAll(PDO::FETCH_OBJ);
            } 
            catch(PDOException $e) 
            {
                $db = null;
                echo $e;
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }
        
        $app->status(200);
        $db = null;
        echo json_encode($pregunta);  
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    
}

function AgregarEncuesta()
{
    $request = \Slim\Slim::getInstance()->request();
    $encuesta = json_decode($request->getBody());
    global $app;
    
    
    $sql = "INSERT INTO Encuesta (Nombre, Activo) 
                            VALUES( :Nombre, :Activo)";
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("Nombre", $encuesta->Nombre);
        $stmt->bindParam("Activo", $encuesta->Activo);
        
        $stmt->execute();
        
        $encuesta->EncuestaId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $numeroPregunta = count($encuesta->Pregunta);
    if($numeroPregunta > 0)
    {
        for($k=0; $k<$numeroPregunta; $k++)
        {
            $sql = "INSERT INTO Pregunta (TipoPreguntaId, Pregunta, Comentario, Otro) VALUES (".$encuesta->Pregunta[$k]->TipoPregunta->TipoPreguntaId.", '".$encuesta->Pregunta[$k]->Pregunta."', ".$encuesta->Pregunta[$k]->Comentario.", ".$encuesta->Pregunta[$k]->Otro.");";
        
            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $encuesta->Pregunta[$k]->PreguntaId = $db->lastInsertId();
            }
            catch(PDOException $e) 
            {
                echo $sql;
                echo '[{"Estatus": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            
            $sql = "INSERT INTO PreguntaPorEncuesta (EncuestaId, PreguntaId, NumeroPregunta) VALUES 
                    (".$encuesta->EncuestaId.", ".$encuesta->Pregunta[$k]->PreguntaId.", ".($k+1).");";

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
            }
            catch(PDOException $e) 
            {
                echo $e;
                echo '[{"Estatus": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();
                        }
            
            //Respuesta
            if($encuesta->Pregunta[$k]->TipoPregunta->TipoPreguntaId == "1" || $encuesta->Pregunta[$k]->TipoPregunta->TipoPreguntaId == "2")
            {
                $numeroRespuesta = count($encuesta->Pregunta[$k]->Respuesta);

                if($numeroRespuesta > 0)
                {   
                    for($i=0; $i<$numeroRespuesta; $i++)
                    {
                        $sql = "INSERT INTO Respuesta (Respuesta) VALUES ('".$encuesta->Pregunta[$k]->Respuesta[$i]->Respuesta."');";
                        
                        try 
                        {
                            $stmt = $db->prepare($sql);
                            $stmt->execute();

                            $encuesta->Pregunta[$k]->Respuesta[$i]->RespuestaId = $db->lastInsertId();
                        }
                        catch(PDOException $e) 
                        {
                            echo $e;
                            echo '[{"Estatus": "Fallido"}]';
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                        
                        $sql = "INSERT INTO RespuestaPorPregunta (PreguntaId, RespuestaId, Orden) VALUES 
                                (".$encuesta->Pregunta[$k]->PreguntaId.", ".$encuesta->Pregunta[$k]->Respuesta[$i]->RespuestaId.", ".($i+1).");";
                        
                        try 
                        {
                            $stmt = $db->prepare($sql);
                            $stmt->execute();

                        }
                        catch(PDOException $e) 
                        {
                            echo $sql;
                            echo '[{"Estatus": "Fallido"}]';
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                    }
                    
                }
            }
        
        }
                
    }

    $app->status(200);
    echo '[{"Estatus": "Exitoso"}]';
    $db->commit();
    $db = null; 
}

function EditarEncuesta()
{
    $request = \Slim\Slim::getInstance()->request();
    $encuesta = json_decode($request->getBody());
    global $app;
    
    
    $sql = "UPDATE Encuesta SET Nombre = :Nombre, Activo = :Activo WHERE EncuestaId = ".$encuesta->EncuestaId;
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("Nombre", $encuesta->Nombre);
        $stmt->bindParam("Activo", $encuesta->Activo);
        
        $stmt->execute();
    }
    catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM PreguntaPorEncuesta WHERE EncuestaId = ".$encuesta->EncuestaId;
        
    try 
    {
        $stmt = $db->prepare($sql);
        $stmt->execute();
    }
    catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    
    $numeroPregunta = count($encuesta->Pregunta);
    if($numeroPregunta > 0)
    {
        for($k=0; $k<$numeroPregunta; $k++)
        {
            if(intval($encuesta->Pregunta[$k]->PreguntaId) < 0)
            {
                $sql = "INSERT INTO Pregunta (TipoPreguntaId, Pregunta, Comentario, Otro) VALUES (".$encuesta->Pregunta[$k]->TipoPregunta->TipoPreguntaId.", '".$encuesta->Pregunta[$k]->Pregunta."', ".$encuesta->Pregunta[$k]->Comentario.", ".$encuesta->Pregunta[$k]->Otro.");";
            }
            else
            {
                 $sql = "UPDATE Pregunta SET TipoPreguntaId = ".$encuesta->Pregunta[$k]->TipoPregunta->TipoPreguntaId.", Pregunta = '".$encuesta->Pregunta[$k]->Pregunta."', Comentario =  ".$encuesta->Pregunta[$k]->Comentario.", Otro = ".$encuesta->Pregunta[$k]->Otro." WHERE PreguntaId = ".$encuesta->Pregunta[$k]->PreguntaId;
            }
        
            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                if(intval($encuesta->Pregunta[$k]->PreguntaId) < 0)
                {
                    $encuesta->Pregunta[$k]->PreguntaId = $db->lastInsertId();
                }
            }
            catch(PDOException $e) 
            {
                echo $sql;
                echo '[{"Estatus": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            
            $sql = "INSERT INTO PreguntaPorEncuesta (EncuestaId, PreguntaId, NumeroPregunta) VALUES 
                    (".$encuesta->EncuestaId.", ".$encuesta->Pregunta[$k]->PreguntaId.", ".($k+1).");";

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
            }
            catch(PDOException $e) 
            {
                echo $e;
                echo '[{"Estatus": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            
            //Respuesta
            
            $sql = "DELETE FROM RespuestaPorPregunta WHERE PreguntaId = ".$encuesta->Pregunta[$k]->PreguntaId;
        
            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
            }
            catch(PDOException $e) 
            {
                echo $sql;
                echo '[{"Estatus": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            if($encuesta->Pregunta[$k]->TipoPregunta->TipoPreguntaId == "1" || $encuesta->Pregunta[$k]->TipoPregunta->TipoPreguntaId == "2")
            {
                $numeroRespuesta = count($encuesta->Pregunta[$k]->Respuesta);

                if($numeroRespuesta > 0)
                {   
                    for($i=0; $i<$numeroRespuesta; $i++)
                    {
                        if(!$encuesta->Pregunta[$k]->Respuesta[$i]->RespuestaId)
                        {
                            $sql = "INSERT INTO Respuesta (Respuesta) VALUES ('".$encuesta->Pregunta[$k]->Respuesta[$i]->Respuesta."');";
                        }
                        else
                        {
                            $sql = "UPDATE Respuesta SET Respuesta  = '".$encuesta->Pregunta[$k]->Respuesta[$i]->Respuesta."' WHERE RespuestaId = ".$encuesta->Pregunta[$k]->Respuesta[$i]->RespuestaId;
                        }
                        
                        try 
                        {
                            $stmt = $db->prepare($sql);
                            $stmt->execute();
                            
                            if(!$encuesta->Pregunta[$k]->Respuesta[$i]->RespuestaId )
                            {
                                $encuesta->Pregunta[$k]->Respuesta[$i]->RespuestaId = $db->lastInsertId();
                            }
                        }
                        catch(PDOException $e) 
                        {
                            echo $e;
                            echo '[{"Estatus": "Fallido"}]';
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                        
                        $sql = "INSERT INTO RespuestaPorPregunta (PreguntaId, RespuestaId, Orden) VALUES 
                                (".$encuesta->Pregunta[$k]->PreguntaId.", ".$encuesta->Pregunta[$k]->Respuesta[$i]->RespuestaId.", ".($i+1).");";
                        
                        try 
                        {
                            $stmt = $db->prepare($sql);
                            $stmt->execute();

                        }
                        catch(PDOException $e) 
                        {
                            echo $e;
                            echo '[{"Estatus": "Fallido"}]';
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                    }
                    
                }
            }
        
        }
                
    }

    $app->status(200);
    echo '[{"Estatus": "Exitoso"}]';
    $db->commit();
    $db = null; 
}


//------------- Encuestas sugeridas ------------

function GetEncuestasSugeridas($unidad)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    
    if($unidad == '-1')
    {
        $sql = "SELECT * FROM EncuestaSugeridaVista GROUP BY EncuestaSugeridaId ";
    }
    else
    {
        $sql = "SELECT * FROM EncuestaSugeridaVista WHERE UnidadNegocioId = ".$unidad;
    }
    
    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $encuesta = $stmt->fetchAll(PDO::FETCH_OBJ);

        
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    
    $count = count($encuesta);
    
    for($i=0; $i<$count; $i++)
    {
        $sql = "SELECT * FROM MotivoEncuestaSugeridaVista WHERE EncuestaSugeridaId = ".$encuesta[$i]->EncuestaSugeridaId;
        
        try 
        {
            $stmt = $db->query($sql);
            $encuesta[$i]->Motivo = $stmt->fetchAll(PDO::FETCH_OBJ);
        } 
        catch(PDOException $e) 
        {
            $db = null;
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
    }
    
    $db = null;
    echo json_encode($encuesta); 
    
}

function GetEncuestasSugeridasCliente($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    

    $sql = "SELECT * FROM EncuestaSugeridaVista WHERE PersonaId = ".$id." GROUP BY EncuestaSugeridaId";
    
    
    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $encuesta = $stmt->fetchAll(PDO::FETCH_OBJ);

        
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    
    $count = count($encuesta);
    
    for($i=0; $i<$count; $i++)
    {
        $sql = "SELECT * FROM MotivoEncuestaSugeridaVista WHERE EncuestaSugeridaId = ".$encuesta[$i]->EncuestaSugeridaId;
        
        try 
        {
            $stmt = $db->query($sql);
            $encuesta[$i]->Motivo = $stmt->fetchAll(PDO::FETCH_OBJ);
        } 
        catch(PDOException $e) 
        {
            $db = null;
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
    }
    
    $db = null;
    echo json_encode($encuesta); 
    
}


function RechazarEncuesta()
{
    $request = \Slim\Slim::getInstance()->request();
    $encuesta = json_decode($request->getBody());
    global $app;
    
    
    $sql = "UPDATE EncuestaSugerida SET EstatusEncuestaSugeridaId = 3, UsuarioId = ".$encuesta->usuarioId.", MotivoRechazo = '".$encuesta->motivo."' WHERE EncuestaSugeridaId = ".$encuesta->encuestaSugeridaId;
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        
        $stmt = $db->prepare($sql);
        $stmt->execute();
        
        $app->status(200);
        echo '[{"Estatus": "Exitoso"}]';
        $db->commit();
        $db = null; 
    }
    catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
}



function AplicarEncuesta()
{
    $request = \Slim\Slim::getInstance()->request();
    $encuesta = json_decode($request->getBody());
    global $app;
    
    
    $sql = "INSERT INTO EncuestaPorPersona (PersonaId, EncuestaId, UsuarioId, Fecha) 
                            VALUES( :PersonaId, :EncuestaId, :UsuarioId, NOW() - INTERVAL 9 HOUR)";
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("PersonaId", $encuesta->personaId);
        $stmt->bindParam("EncuestaId", $encuesta->encuestaId);
        $stmt->bindParam("UsuarioId", $encuesta->usuarioId);
        
        $stmt->execute();
        
        $encuesta->EncuestaPorPersonaId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $numeroPregunta = count($encuesta->pregunta);
    if($numeroPregunta > 0)
    {
        for($k=0; $k<$numeroPregunta; $k++)
        {
            $sql = "INSERT INTO PreguntaPorEncuestaPersona (EncuestaPorPersonaId, PreguntaId, Comentario, Otro) 
            VALUES (".$encuesta->EncuestaPorPersonaId.", '".$encuesta->pregunta[$k]->PreguntaId."', '".$encuesta->pregunta[$k]->ComentarioRespuesta."', '".$encuesta->pregunta[$k]->EspecificarOtro."');";
        
            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $encuesta->pregunta[$k]->PreguntaPorEncuestaPersonaId = $db->lastInsertId();
            }
            catch(PDOException $e) 
            {
                echo $sql;
                echo '[{"Estatus": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            //Ratio button
            if($encuesta->pregunta[$k]->TipoPregunta->TipoPreguntaId == "1")
            {
                $sql = "INSERT INTO RespuestaPorPreguntaPersona (PreguntaPorEncuestaPersonaId, RespuestaId, Respuesta) VALUES 
                    (".$encuesta->pregunta[$k]->PreguntaPorEncuestaPersonaId.", null, '".$encuesta->pregunta[$k]->RespuestaSel."');";
            }
            //check-box
            if($encuesta->pregunta[$k]->TipoPregunta->TipoPreguntaId == "2")
            {
                $sql = "INSERT INTO RespuestaPorPreguntaPersona (PreguntaPorEncuestaPersonaId, RespuestaId, Respuesta) VALUES ";
                    
                $count = count($encuesta->pregunta[$k]->Respuesta);
                
                for($i=0; $i<$count; $i++)
                {
                    if($encuesta->pregunta[$k]->Respuesta[$i]->RespuestaSel)
                    {
                        $sql .=  " (".$encuesta->pregunta[$k]->PreguntaPorEncuestaPersonaId.", ".$encuesta->pregunta[$k]->Respuesta[$i]->RespuestaId.", '".$encuesta->pregunta[$k]->Respuesta[$i]->Respuesta."'),";
                    }
                }
                
                if($encuesta->pregunta[$k]->RespuestaSelOtro)
                {
                    $sql .= " (".$encuesta->pregunta[$k]->PreguntaPorEncuestaPersonaId.", null, 'Otro'),";
                }
                    
                 $sql = rtrim($sql,",");
            }
            
            if($encuesta->pregunta[$k]->TipoPregunta->TipoPreguntaId == "1" || $encuesta->pregunta[$k]->TipoPregunta->TipoPreguntaId == "2")
            {
                try 
                {
                    $stmt = $db->prepare($sql);
                    $stmt->execute();
                }
                catch(PDOException $e) 
                {
                    echo $e;
                    echo '[{"Estatus": "Fallido"}]';
                    $db->rollBack();
                    $app->status(409);
                    $app->stop();
                }
            }
            
        }
                
    }
    
    if(intval($encuesta->encuestaSugeridaId) > 0)
    {
        $sql = "UPDATE EncuestaSugerida SET EstatusEncuestaSugeridaId = 2, UsuarioId = ".$encuesta->usuarioId.", EncuestaPorPersonaId = 
                ".$encuesta->EncuestaPorPersonaId." WHERE EncuestaSugeridaId = ".$encuesta->encuestaSugeridaId;

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();

        }
        catch(PDOException $e) 
        {
            echo $sql;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }

    $app->status(200);
    echo '[{"Estatus": "Exitoso"}]';
    $db->commit();
    $db = null; 
}

function AplicarEncuestaDetalle($id)
{
    global $app;
    global $session_expiration_time;

    
    $sql = "SELECT * FROM EncuestaPorPersonaVista WHERE EncuestaPorPersonaId = ".$id;

    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $encuesta = $stmt->fetchAll(PDO::FETCH_OBJ);
        $encuesta = $encuesta[0];
    } 
    catch(PDOException $e) 
    {
        $db = null;
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    
    $sql = "SELECT * FROM PreguntaPorEncuestaPorPersonaVista WHERE EncuestaPorPersonaId = ".$id;

    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $encuesta->Pregunta = $stmt->fetchAll(PDO::FETCH_OBJ);
    } 
    catch(PDOException $e) 
    {
        $db = null;
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    
    $numPre = count($encuesta->Pregunta);
    
    for($k=0; $k<$numPre; $k++)
    {
        $sql = "SELECT * FROM RespuestaPorPreguntaPersona WHERE PreguntaPorEncuestaPersonaId = ".$encuesta->Pregunta[$k]->PreguntaPorEncuestaPersonaId;

        try 
        {
            $db = getConnection();

            $stmt = $db->query($sql);
            $encuesta->Pregunta[$k]->RespuestaContestada = $stmt->fetchAll(PDO::FETCH_OBJ);
        } 
        catch(PDOException $e) 
        {
            $db = null;
            //echo $e;
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
        
        $sql = "SELECT rp.*, r.Respuesta
                FROM RespuestaPorPregunta  rp
                INNER JOIN Respuesta r ON r.RespuestaId = rp.RespuestaId
                INNER JOIN RespuestaPorPregunta rpp ON rpp.RespuestaId = r.RespuestaId AND rpp.PreguntaId = rp.PreguntaId
                WHERE rp.PreguntaId = ".$encuesta->Pregunta[$k]->PreguntaId." ORDER BY rpp.Orden";

        try 
        {
            $db = getConnection();

            $stmt = $db->query($sql);
            $encuesta->Pregunta[$k]->Respuesta = $stmt->fetchAll(PDO::FETCH_OBJ);
        } 
        catch(PDOException $e) 
        {
            $db = null;
            echo $e;
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
    }
    
    $app->status(200);
    $db = null;
    echo json_encode($encuesta);  
}

//Encuesta por persona
function GetEncuestaPorPersona($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    

    $sql = "SELECT * FROM EncuestaVista WHERE PersonaId = ".$id;
    
    
    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $encuesta = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $db = null;
        echo json_encode($encuesta); 
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }    
}




?>
