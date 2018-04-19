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
    
?>
