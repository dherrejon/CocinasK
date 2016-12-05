<?php

function GetMuestrarioPuerta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM Muestrario WHERE TipoMuestrarioId = 1";

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

function AgregarMuestrario()
{
    $request = \Slim\Slim::getInstance()->request();
    $muestrario = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Muestrario (TipoMuestrarioId, Nombre, Activo) VALUES(:TipoMuestrarioId, :Nombre, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("TipoMuestrarioId", $muestrario->TipoMuestrarioId);
        $stmt->bindParam("Nombre", $muestrario->Nombre);
        $stmt->bindParam("Activo", $muestrario->Activo);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo '[{"Estatus": "Fallido"}]';
    }
}

function EditarMuestrario()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $muestrario = json_decode($request->getBody());
   
    $sql = "UPDATE Muestrario SET Nombre='".$muestrario->Nombre."', TipoMuestrarioId='".$muestrario->TipoMuestrarioId."', Activo = '".$muestrario->Activo."'  WHERE MuestrarioId=".$muestrario->MuestrarioId."";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db = null;

        echo '[{"Estatus":"Exitoso"}]';
    }
    catch(PDOException $e) 
    {   
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarMuestrario()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Muestrario SET Activo = ".$datos[0]." WHERE MuestrarioId = ".$datos[1]."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        

        $db = null;
        echo '[{"Estatus":"Exito"}]';
    }
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        //echo ($e);
        $app->status(409);
        $app->stop();
    }
}

function GetPuertaPorMuestrario()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $muestrarioId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM Puerta WHERE MuestrarioId='".$muestrarioId[0]."'";
    
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
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

?>