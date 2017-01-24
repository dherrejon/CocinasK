<?php

function GetUbicacionCubierta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $tipoGrupoId = json_decode($request->getBody());
    
    
    $sql = "SELECT UbicacionCubiertaId, Nombre, Activo FROM UbicacionCubierta";
    
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

function EditarUbicacionFabricacionTipoCubierta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $ubicacion = json_decode($request->getBody());
   
    $sql = "UPDATE UbicacionCubierta SET Activo='".$ubicacion->Activo."' WHERE UbicacionCubiertaId=".$ubicacion->UbicacionCubiertaId."";
    
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
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $datos = count($ubicacion->Datos);
    
    for($k=0; $k<$datos; $k++)
    {
        $sql = "UPDATE FabricacionPorUbicacionTipoCubierta SET FabricacionCubiertaId = ".$ubicacion->Datos[$k]->FabricacionCubierta->FabricacionCubiertaId." WHERE FabricacionPorUbicacionTipoCubierta = ". $ubicacion->Datos[$k]->FabricacionPorUbicacionTipoCubiertaId;
        
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

    $db->commit();
    $db = null;
    echo '[{"Estatus": "Exitoso"}]';
    
}

function ActivarDesactivarUbicacionCubierta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE UbicacionCubierta SET Activo = ".$datos[0]." WHERE UbicacionCubiertaId = ".$datos[1]."";
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




/*--------------- Datos Ubicacion ----------------------*/
function GetDatosUbicacion()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $ubicacionId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM UbicacionPorFabricacionTipoCubiertaVista WHERE UbicacionCubiertaId ='".$ubicacionId[0]."'";
    
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