<?php
	
function GetMedioPago()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT MedioPagoId, Nombre, Activo, Defecto FROM MedioPago WHERE MedioPagoId > 0";

    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"MedioPago":'.json_encode($response).'} ]'; 
        //echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarMedioPago()
{
    $request = \Slim\Slim::getInstance()->request();
    $medioPago = json_decode($request->getBody());
    global $app;
    
    
    if($medioPago->Defecto == "1")
    {
        $sql = "UPDATE MedioPago SET Defecto = 0 WHERE Defecto = '1'";
        try 
        {
            $db = getConnection();
            $db->beginTransaction();
            $stmt = $db->prepare($sql);

            $stmt->execute();
        } catch(PDOException $e) 
        {
            $db->rollBack();
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $app->status(409);
            $app->stop();
        }
    }
    else
    {
        try 
        {
            $db = getConnection();
            $db->beginTransaction();
        } catch(PDOException $e) 
        {
            $db->rollBack();
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $app->status(409);
            $app->stop();
        }
    }
    
    $sql = "INSERT INTO MedioPago (Nombre, Activo, Defecto) 
            VALUES(:Nombre, :Activo, :Defecto)";
    try 
    {
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $medioPago->Nombre);
        $stmt->bindParam("Activo", $medioPago->Activo);
        $stmt->bindParam("Defecto", $medioPago->Defecto);
        
        $stmt->execute();
        $MedioPagoId = $db->lastInsertId();
        
        $db->commit();
        $db = null;
        
        echo '[{"Estatus": "Exitoso"}, {"Id": "'.$MedioPagoId.'"}]';

    } catch(PDOException $e) 
    {
        //echo $e;
        $db->rollBack();
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function EditarMedioPago()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $medioPago = json_decode($request->getBody());
    
    if($medioPago->Defecto == "1")
    {
        $sql = "UPDATE MedioPago SET Defecto = 0 WHERE Defecto = '1'";
        try 
        {
            $db = getConnection();
            $db->beginTransaction();
            $stmt = $db->prepare($sql);

            $stmt->execute();
        } catch(PDOException $e) 
        {
            $db->rollBack();
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $app->status(409);
            $app->stop();
        }
    }
    else
    {
        try 
        {
            $db = getConnection();
            $db->beginTransaction();
        } catch(PDOException $e) 
        {
            $db->rollBack();
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $app->status(409);
            $app->stop();
        }
    }
   
    $sql = "UPDATE  MedioPago SET Nombre='".$medioPago->Nombre."', Activo='".$medioPago->Activo."', Defecto='".$medioPago->Defecto."'
    WHERE MedioPagoId=".$medioPago->MedioPagoId."";
    
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
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarMedioPago()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE MedioPago SET Activo = ".$datos[0]." WHERE MedioPagoId = ".$datos[1];
        $stmt = $db->prepare($sql);
        $stmt->execute();
    
        $db = null;
        
        echo '[{"Estatus": "Exito"}]';
    }
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[{"Estatus":"Fallo"}]';
        //echo ($sql);
        $app->status(409);
        $app->stop();
    }
}
    
?>
