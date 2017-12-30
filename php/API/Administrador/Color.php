<?php
	
function GetColor()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM Color";

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
        
        //echo '[ { "Estatus": "Exito"}, {"Color":'.json_encode($response).'} ]'; 
        echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        //echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarColor()
{
    $request = \Slim\Slim::getInstance()->request();
    $color = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Color (Nombre, Activo) VALUES(:Nombre, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $color->Nombre);
        //$stmt->bindParam("MedioContactoId", $color->MedioContactoId);
        $stmt->bindParam("Activo", $color->Activo);

        $stmt->execute();
        
        $colorId = $db->lastInsertId();
        $db = null;
        
        echo '[{"Estatus": "Exitoso"}, {"ColorId":'.$colorId.'}]';

    } catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
    }
}

function EditarColor()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $color = json_decode($request->getBody());
   
    $sql = "UPDATE Color SET Nombre='".$color->Nombre."', Activo = '".$color->Activo."'  WHERE ColorId=".$color->ColorId."";
    
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

function ActivarDesactivarColor()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Color SET Activo = ".$datos[0]." WHERE ColorId = ".$datos[1]."";
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

function GuardarImagenColor($id)
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $name = $_FILES['file']['tmp_name'];
    
    $imagen = addslashes(file_get_contents($_FILES['file']['tmp_name']));

    $sql = "UPDATE Color SET Imagen = '".$imagen."' WHERE ColorId= ".$id."";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db = null;
        echo '[{"Estatus": "Exitoso"}]';
        //echo '[{"rowcount":'. $stmt->rowCount() .'}]';
    }
    catch(PDOException $e) 
    {
        
        //echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}
    
?>
