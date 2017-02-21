<?php
	
function GetMaqueo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT MaqueoId, GrupoId, Nombre, CostoUnidad, Margen, PorDefecto, Activo, NombreGrupo FROM MaqueoVista";

    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        //echo '[ { "Estatus": "Exito"}, {"Color":'.json_encode($response).'} ]'; 
        echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarMaqueo()
{
    $request = \Slim\Slim::getInstance()->request();
    $maqueo = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Maqueo (GrupoId, Nombre, CostoUnidad, Margen, Activo, PorDefecto) 
            VALUES(:GrupoId, :Nombre, :CostoUnidad, :Margen, :Activo, :PorDefecto)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        
        $stmt->bindParam("GrupoId", $maqueo->Grupo->GrupoId);
        $stmt->bindParam("Nombre", $maqueo->Nombre);
        $stmt->bindParam("CostoUnidad", $maqueo->CostoUnidad);
        $stmt->bindParam("Margen", $maqueo->Margen);
        $stmt->bindParam("Activo", $maqueo->Activo);
        $stmt->bindParam("PorDefecto", $maqueo->PorDefecto);

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

function EditarMaqueo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $maqueo = json_decode($request->getBody());
   
    $sql = "UPDATE Maqueo SET GrupoId = ".$maqueo->Grupo->GrupoId.", Nombre='".$maqueo->Nombre."', CostoUnidad='".$maqueo->CostoUnidad."', Margen='".$maqueo->Margen."', PorDefecto='".$maqueo->PorDefecto."', Activo = '".$maqueo->Activo."'  WHERE MaqueoId=".$maqueo->MaqueoId."";
    
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

function ActivarDesactivarMaqueo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Maqueo SET Activo = ".$datos[0]." WHERE MaqueoId = ".$datos[1]."";
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
