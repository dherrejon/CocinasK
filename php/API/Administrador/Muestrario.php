<?php

function GetMuestrario()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $tipoMuestrarioId = json_decode($request->getBody());

    $sql = "SELECT * FROM MuestrarioVista WHERE TipoMuestrarioId = ".$tipoMuestrarioId;

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
    $sql = "INSERT INTO Muestrario (TipoMuestrarioId, Nombre, Activo, PorDefecto, Margen, TipoAccesorioId) VALUES(:TipoMuestrarioId, :Nombre, :Activo, :PorDefecto, :Margen, :TipoAccesorioId)";
    
    $db;
    $stmt;
    $muestrarioId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("TipoMuestrarioId", $muestrario->TipoMuestrarioId);
        $stmt->bindParam("Nombre", $muestrario->Nombre);
        $stmt->bindParam("Activo", $muestrario->Activo);
        $stmt->bindParam("PorDefecto", $muestrario->PorDefecto);
        $stmt->bindParam("Margen", $muestrario->Margen);
        $stmt->bindParam("TipoAccesorioId", $muestrario->TipoAccesorio->TipoAccesorioId);

        $stmt->execute();
        
        $muestrarioId = $db->lastInsertId();

    } catch(PDOException $e) 
    {
        $db->rollBack();
        echo '[{"Estatus": "Fallido"}]';
        echo $e;
        $app->status(409);
        $app->stop();
    }
    
    if($muestrario->PorDefecto=="1" && $muestrario->TipoMuestrarioId=="1")
    {
        $sql = "UPDATE Muestrario SET PorDefecto=0  WHERE PorDefecto=1 AND TipoMuestrarioId = 1";
    
        try 
        {   
            $stmt = $db->prepare($sql);
            $stmt->execute();
        }
        catch(PDOException $e) 
        {   
            $db->rollBack();
            echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $app->status(409);
            $app->stop();
        }
        
        $sql = "UPDATE Muestrario SET PorDefecto=1, Activo=1  WHERE MuestrarioId=".$muestrarioId;
    
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
            $db = null;
            echo '[{"Estatus":"Exitoso"}]';
        }
        catch(PDOException $e) 
        {   
            $db->rollBack();
            echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $app->status(409);
            $app->stop();
        }
    }
    else
    {
        $db->commit();
        $db = null;        
        echo '[{"Estatus":"Exitoso"}]';
    }
}

function EditarMuestrario()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $muestrario = json_decode($request->getBody());
   
    $sql = "UPDATE Muestrario SET Nombre='".$muestrario->Nombre."', TipoMuestrarioId='".$muestrario->TipoMuestrarioId."', Activo = '".$muestrario->Activo."', 
    PorDefecto = '".$muestrario->PorDefecto."', Margen = ".$muestrario->Margen.", TipoAccesorioId = ".$muestrario->TipoAccesorio->TipoAccesorioId." WHERE MuestrarioId=".$muestrario->MuestrarioId."";
    
    $stmt;
    $db;
        
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        $stmt->execute();
    }
    catch(PDOException $e) 
    {   
        echo $e;
        $db->rollBack();
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
    
    if($muestrario->PorDefecto == "1" && $muestrario->TipoMuestrarioId=="1")
    {
        $sql = "UPDATE Muestrario SET PorDefecto=0  WHERE PorDefecto=1 AND TipoMuestrarioId = 1";
    
        try 
        {   
            $stmt = $db->prepare($sql);
            $stmt->execute();
        }
        catch(PDOException $e) 
        {   
            $db->rollBack();
            echo '[{"Estatus": "Fallido"}]';
            $app->status(409);
            $app->stop();
        }
        
        $sql = "UPDATE Muestrario SET PorDefecto=1, Activo = 1  WHERE MuestrarioId=".$muestrario->MuestrarioId;
    
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
            $db = null;
            echo '[{"Estatus":"Exitoso"}]';
        }
        catch(PDOException $e) 
        {   
            $db->rollBack();
            echo '[{"Estatus": "Fallido"}]';
            $app->status(409);
            $app->stop();
        }
    }
    else
    {
        $db->commit();
        $db = null;        
        echo '[{"Estatus":"Exitoso"}]';
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

function GetAccesorioPorMuestrario()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $muestrarioId = json_decode($request->getBody());
    
    
    $sql = "SELECT a.AccesorioId, a.Nombre, a.Activo,  ta.Nombre as NombreTipoAccesorio FROM Accesorio a, TipoAccesorio ta WHERE a.TipoAccesorioId = ta.TipoAccesorioId AND a.MuestrarioId='".$muestrarioId[0]."'";
    
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