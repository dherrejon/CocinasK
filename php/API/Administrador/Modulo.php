<?php

function GetTipoModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoModulo";

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

function AgregarTipoModulo()
{
    $request = \Slim\Slim::getInstance()->request();
    $tipoModulo = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO TipoModulo (Nombre, Activo) VALUES(:Nombre, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $tipoModulo->Nombre);
        $stmt->bindParam("Activo", $tipoModulo->Activo);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo '[{"Estatus": "Fallido"}]';
    }
}

function EditarTipoModulo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $tipoModulo = json_decode($request->getBody());
   
    $sql = "UPDATE TipoModulo SET Nombre='".$tipoModulo->Nombre."', Activo = '".$tipoModulo->Activo."'  WHERE TipoModuloId=".$tipoModulo->TipoModuloId."";
    
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

function ActivarDesactivarTipoModulo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE TipoModulo SET Activo = ".$datos[0]." WHERE TipoModuloId = ".$datos[1]."";
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