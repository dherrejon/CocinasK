<?php
	
function GetTipoProyecto()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT TipoProyectoId, Nombre, Mueble, CubiertaAglomerado, CubiertaPiedra, IVA, LibreIVA, Activo FROM TipoProyecto";

    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"TipoProyecto":'.json_encode($response).'} ]'; 
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

function AgregarTipoProyecto()
{
    $request = \Slim\Slim::getInstance()->request();
    $tipoProyecto = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO TipoProyecto (Nombre, Mueble, CubiertaAglomerado, CubiertaPiedra, IVA, LibreIVA, Activo) 
            VALUES(:Nombre, :Mueble, :CubiertaAglomerado, :CubiertaPiedra, :IVA, :LibreIVA, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $tipoProyecto->Nombre);
        $stmt->bindParam("Mueble", $tipoProyecto->Mueble);
        $stmt->bindParam("CubiertaAglomerado", $tipoProyecto->CubiertaAglomerado);
        $stmt->bindParam("CubiertaPiedra", $tipoProyecto->CubiertaPiedra);
        $stmt->bindParam("IVA", $tipoProyecto->IVA);
        $stmt->bindParam("LibreIVA", $tipoProyecto->LibreIVA);
        $stmt->bindParam("Activo", $tipoProyecto->Activo);
        
        $stmt->execute();
        $tipoProyectoId = $db->lastInsertId();
        $db = null;
        
        echo '[{"Estatus": "Exitoso"}, {"Id": "'.$tipoProyectoId.'"}]';

    } catch(PDOException $e) 
    {
        //echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function EditarTipoProyecto()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $tipoProyecto = json_decode($request->getBody());
   
    $sql = "UPDATE TipoProyecto SET Nombre='".$tipoProyecto->Nombre."', Mueble='".$tipoProyecto->Mueble."', CubiertaAglomerado='".$tipoProyecto->CubiertaAglomerado."', 
    CubiertaPiedra='".$tipoProyecto->CubiertaPiedra."', Activo = '".$tipoProyecto->Activo."', IVA = '".$tipoProyecto->IVA."', 
    LibreIVA = '".$tipoProyecto->LibreIVA."' WHERE TipoProyectoId=".$tipoProyecto->TipoProyectoId."";
    
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

function ActivarDesactivarTipoProyecto()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE TipoProyecto SET Activo = ".$datos[0]." WHERE TipoProyectoId = ".$datos[1]."";
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
