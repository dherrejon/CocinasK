<?php

/*--------------Consumible------------------*/
function GetConsumible()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM Consumible";

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

function AgregarConsumible()
{
    $request = \Slim\Slim::getInstance()->request();
    $consumible = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Consumible (Nombre, Costo, Activo) VALUES(:Nombre, :Costo, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $consumible->Nombre);
        $stmt->bindParam("Costo", $consumible->Costo);
        $stmt->bindParam("Activo", $consumible->Activo);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo '[{"Estatus": "Fallido"}]';
    }
}

function EditarConsumible()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $consumible = json_decode($request->getBody());
   
    $sql = "UPDATE Consumible SET Nombre='".$consumible->Nombre."', Costo='".$consumible->Costo."', Activo = '".$consumible->Activo."'  WHERE ConsumibleId=".$consumible->ConsumibleId."";
    
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

function ActivarDesactivarConsumible()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Consumible SET Activo = ".$datos[0]." WHERE ConsumibleId = ".$datos[1]."";
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

?>