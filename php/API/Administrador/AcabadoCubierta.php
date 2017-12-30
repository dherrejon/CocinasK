<?php

function GetAcabadoCubierta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $tipoGrupoId = json_decode($request->getBody());
    
    
    $sql = "SELECT AcabadoCubiertaId, Nombre, Activo FROM AcabadoCubierta";
    
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
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarAcabadoCubierta()
{
    $request = \Slim\Slim::getInstance()->request();
    $acabado = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO AcabadoCubierta (Nombre, Activo) 
            VALUES(:Nombre, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $acabado->Nombre);
        $stmt->bindParam("Activo", $acabado->Activo);

        $stmt->execute();
        $db = null;
        
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        //echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function EditarAcabadoCubierta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $acabado = json_decode($request->getBody());
   
    $sql = "UPDATE AcabadoCubierta SET Nombre='".$acabado->Nombre."', Activo = '".$acabado->Activo."'  WHERE AcabadoCubiertaId=".$acabado->AcabadoCubiertaId."";
    
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

function ActivarDesactivarAcabadoCubierta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE AcabadoCubierta SET Activo = ".$datos[0]." WHERE AcabadoCubiertaId = ".$datos[1]."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
    
        $db = null;
        
        echo '[{"Estatus": "Exito"}]';
    }
    catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus":"Fallo"}]';
        //echo ($sql);
        $app->status(409);
        $app->stop();
    }
}


?>