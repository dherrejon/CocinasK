<?php

function GetBug()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM BugVista";

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
        echo($e);
        $app->status(409);
        $app->stop();
    }
}

function AgregarBug()
{
    $request = \Slim\Slim::getInstance()->request();
        $bug = json_decode($request->getBody());
        global $app;
        $sql = "INSERT INTO Bug (UsuarioId, Modulo, Seccion, Operacion, Descripcion, Fecha, Resuelto) 
                            VALUES(:UsuarioId, :Modulo, :Seccion, :Operacion, :Descripcion, NOW(), 0)";
 
        try 
        {
            $db = getConnection();
            $stmt = $db->prepare($sql);

            $stmt->bindParam("UsuarioId", $bug->UsuarioId);
            $stmt->bindParam("Modulo", $bug->Modulo);
            $stmt->bindParam("Seccion", $bug->Seccion);
            $stmt->bindParam("Operacion", $bug->Operacion);
            $stmt->bindParam("Descripcion", $bug->Descripcion);
            
            $stmt->execute();
            
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';
            
        } catch(PDOException $e) 
        {
            echo $e;
            echo '[{"Estatus": "Fallido"}]';
        }
}

function ResolverBug()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $bug = json_decode($request->getBody());
   
    $sql = "UPDATE Bug SET Resuelto = 1, Observacion='".$bug->Observacion."', FechaResuelto = NOW() WHERE BugId=".$bug->BugId."";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db = null;
        //if($stmt->rowCount() == 1)
        echo '[{"Estatus":"Exitoso"}]';
    }
    catch(PDOException $e) {
        //echo ($e);
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

?>