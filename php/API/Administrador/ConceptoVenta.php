<?php
	
function GetConceptoVenta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT ConceptoVentaId, Nombre, Activo, IVA FROM ConceptoVenta";

    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"ConceptoVenta":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarConceptoVenta()
{
    $request = \Slim\Slim::getInstance()->request();
    $conceptoVenta = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO ConceptoVenta (Nombre, IVA, Activo) 
            VALUES(:Nombre, :IVA, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $conceptoVenta->Nombre);
        $stmt->bindParam("IVA", $conceptoVenta->IVA);
        $stmt->bindParam("Activo", $conceptoVenta->Activo);
        
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

function EditarConceptoVenta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $conceptoVenta = json_decode($request->getBody());
   
    $sql = "UPDATE ConceptoVenta SET Nombre='".$conceptoVenta->Nombre."', IVA='".$conceptoVenta->IVA."', Activo='".$conceptoVenta->Activo."'
    WHERE ConceptoVentaId=".$conceptoVenta->ConceptoVentaId."";
    
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
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarConceptoVenta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE ConceptoVenta SET Activo = ".$datos[0]." WHERE ConceptoVentaId = ".$datos[1]."";
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
