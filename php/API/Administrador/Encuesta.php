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

?>
