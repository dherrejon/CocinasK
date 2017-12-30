<?php

function GetDescripcionContrato()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $tipoGrupoId = json_decode($request->getBody());
    
    
    $sql = "SELECT DescripcionContratoId, Descripcion, Activo, TipoVentaId, TipoVentaNombre FROM DescripcionContratoVista";
    
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

function AgregarDescripcionContrato()
{
    $request = \Slim\Slim::getInstance()->request();
    $desc = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO DescripcionContrato (Descripcion, Activo, TipoVentaId) 
            VALUES(:Descripcion, :Activo, :TipoVentaId)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Descripcion", $desc->Descripcion);
        $stmt->bindParam("Activo", $desc->Activo);
        $stmt->bindParam("TipoVentaId", $desc->TipoVentaId);

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

function EditarDescripcionContrato()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $desc = json_decode($request->getBody());
   
    $sql = "UPDATE DescripcionContrato SET Descripcion='".$desc->Descripcion."', Activo = '".$desc->Activo."', TipoVentaId = '".$desc->TipoVentaId."'  WHERE DescripcionContratoId=".$desc->DescripcionContratoId."";
    
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

function ActivarDesactivarDescripcion()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE DescripcionContrato SET Activo = ".$datos[0]." WHERE DescripcionContratoId = ".$datos[1]."";
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