<?php

function GetGrupo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $tipoGrupoId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM GrupoVista WHERE TipoGrupoId='".$tipoGrupoId[0]."'";
    
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

function ActivarDesactivarGrupo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Grupo SET Activo = ".$datos[0]." WHERE GrupoId = ".$datos[1]."";
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

function GetGrupoPorColor()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $grupoId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM GrupoColorCubiertaVista WHERE GrupoId='".$grupoId[0]."'";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        foreach ($response as $img) 
        {
            $img->Imagen =  base64_encode($img->Imagen);
        }
        
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

/*--------------- grupo de color ----------------------*/
function AgregarGrupoColorCubierta()
{
    $request = \Slim\Slim::getInstance()->request();
    $grupo = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Grupo (Nombre, Activo, TipoGrupoId) VALUES(:Nombre, :Activo, :TipoGrupoId)";

    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $grupo->Nombre);
        $stmt->bindParam("TipoGrupoId", $grupo->TipoGrupo->TipoGrupoId);
        $stmt->bindParam("Activo", $grupo->Activo);

        $stmt->execute();
        
        $grupoId = $db->lastInsertId();

    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
        
    }
    
    $color = count($grupo->Color);
    
    if($color > 0)
    {
        $sql = "INSERT INTO GrupoPorColor (GrupoId, ColorId) VALUES";
        
        for($k=0; $k<$color; $k++)
        {
            $sql .= " (".$grupoId.", ".$grupo->Color[$k]->ColorId."),";
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

function EditarGrupoColorCubierta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $grupo = json_decode($request->getBody());
   
    $sql = "UPDATE Grupo SET Nombre='".$grupo->Nombre."', Activo = '".$grupo->Activo."'  WHERE GrupoId=".$grupo->GrupoId."";
    
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
    
    $sql = "DELETE FROM GrupoPorColor WHERE GrupoId=".$grupo->GrupoId;
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
    
    $color = count($grupo->Color);
    
    if($color > 0)
    {
        $sql = "INSERT INTO GrupoPorColor (GrupoId, ColorId) VALUES";
        
        for($k=0; $k<$color; $k++)
        {
            $sql .= " (".$grupo->GrupoId.", ".$grupo->Color[$k]->ColorId."),";
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

?>