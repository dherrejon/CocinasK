<?php
	
function GetTipoMedioContacto()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoMedioContactoVista";

    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        //echo '[ { "Estatus": "Exito"}, {"TipoMedioContacto":'.json_encode($response).'} ]'; 
        echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        echo($e);
        //echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarTipoMedioContacto()
{
    $request = \Slim\Slim::getInstance()->request();
    $tipoMedio = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO TipoMedioContacto (Nombre, MedioContactoId, Activo) VALUES(:Nombre, :MedioContactoId, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $tipoMedio->Nombre);
        $stmt->bindParam("MedioContactoId", $tipoMedio->MedioContactoId);
        $stmt->bindParam("Activo", $tipoMedio->Activo);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
    }
}

function EditarTipoMedioContacto()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $tipoMedio = json_decode($request->getBody());
   
    $sql = "UPDATE TipoMedioContacto SET Nombre='".$tipoMedio->Nombre."', MedioContactoId='".$tipoMedio->MedioContactoId."', Activo = '".$tipoMedio->Activo."'  WHERE TipoMedioContactoId=".$tipoMedio->TipoMedioContactoId."";
    
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

function ActivarDesactivarTipoMedioContacto()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE TipoMedioContacto SET Activo = ".$datos[0]." WHERE TipoMedioContactoId = ".$datos[1]."";
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
