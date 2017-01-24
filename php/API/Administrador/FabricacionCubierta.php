<?php

function GetFabricacionCubierta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    
    
    $sql = "SELECT FabricacionCubiertaId, Nombre, Activo FROM FabricacionCubierta";
    
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
        $app->status(409);
        $app->stop();
    }
}

function AgregarFabricacionCubierta()
{
    $request = \Slim\Slim::getInstance()->request();
    $fabricacion = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO FabricacionCubierta (Nombre, Activo) VALUES(:Nombre, :Activo)";

    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $fabricacion->Nombre);
        $stmt->bindParam("Activo", $fabricacion->Activo);

        $stmt->execute();
        
        $fabricacionId = $db->lastInsertId();

    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
        
    }
    
    $consumible = count($fabricacion->Consumible);
    
    if($consumible > 0)
    {
        $sql = "INSERT INTO ConsumiblePorFabricacion (FabricacionCubiertaId, ConsumibleId, Cantidad) VALUES";
        
        for($k=0; $k<$consumible; $k++)
        {
            $sql .= " (".$fabricacionId.", ".$fabricacion->Consumible[$k]->ConsumibleId.", ".$fabricacion->Consumible[$k]->Cantidad."),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';
        } 
        catch(PDOException $e) 
        {
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();

        }
        
    }
    else
    {
        $db->commit();
        $db = null;
        echo '[{"Estatus": "Exitoso"}]';
    }
    
}

function EditarFabricacionCubierta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $fabricacion = json_decode($request->getBody());
   
    $sql = "UPDATE FabricacionCubierta SET Nombre='".$fabricacion->Nombre."', Activo = '".$fabricacion->Activo."'  WHERE FabricacionCubiertaId=".$fabricacion->FabricacionCubiertaId."";
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        //$db = null;

        //echo '[{"Estatus":"Exitoso"}]';
    }
    catch(PDOException $e) 
    {    
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM ConsumiblePorFabricacion WHERE FabricacionCubiertaId=".$fabricacion->FabricacionCubiertaId;
    try 
    {
        $stmt = $db->prepare($sql); 
        $stmt->execute();   
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        //echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $consumible = count($fabricacion->Consumible);
    
    if($consumible > 0)
    {
        $sql = "INSERT INTO ConsumiblePorFabricacion (FabricacionCubiertaId, ConsumibleId, Cantidad) VALUES";
        
        for($k=0; $k<$consumible; $k++)
        {
            $sql .= " (".$fabricacion->FabricacionCubiertaId.", ".$fabricacion->Consumible[$k]->ConsumibleId.", ".$fabricacion->Consumible[$k]->Cantidad."),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';
        } 
        catch(PDOException $e) 
        {
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();

        }
        
    }
    else
    {
        $db->commit();
        $db = null;
        echo '[{"Estatus": "Exitoso"}]';
    }
}

function ActivarDesactivarFabricacionCubierta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE FabricacionCubierta SET Activo = ".$datos[0]." WHERE FabricacionCubiertaId = ".$datos[1]."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
    
        $db = null;
        
        echo '[{"Estatus": "Exito"}]';
    }
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        //echo ($sql);
        $app->status(409);
        $app->stop();
    }
}

/*--------------- consumibles de fabricación ----------------------*/
function GetConsumiblePorFabricacion()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $fabricacionId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM ConsumiblePorFabricacionVista WHERE FabricacionCubiertaId ='".$fabricacionId[0]."'";
    
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
        $app->status(409);
        $app->stop();
    }
}

?>