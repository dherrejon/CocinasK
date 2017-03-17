<?php

function GetBuscarPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT PersonaId, Nombre, PrimerApellido, SegundoApellido, MedioCaptacionId, NombreMedioCaptacion, UnidadNegocioId, NombreUnidadNegocio FROM BuscarPersonaVista
            WHERE Nombre LIKE '%".$persona->Nombre."%' AND PrimerApellido LIKE '%".$persona->PrimerApellido."%'";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Persona":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function EditarMedioContactoPersona()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $contacto = json_decode($request->getBody());
   
    $sql = "UPDATE ContactoPersona SET TipoMedioContactoId='".$contacto->TipoMedioContacto->TipoMedioContactoId."', Contacto='".$contacto->Contacto."'  WHERE ContactoPersonaId=".$contacto->ContactoPersonaId."";
    
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
        echo $e;
        $app->status(409);
        $app->stop();
    }
}

function EditarDireccionPersona()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $direccion = json_decode($request->getBody());
   
    $sql = "UPDATE DireccionPersona SET TipoMedioContactoId='".$direccion->TipoMedioContacto->TipoMedioContactoId."', Domicilio='".$direccion->Domicilio."',
    Codigo='".$direccion->Codigo."', Estado='".$direccion->Estado."', Municipio='".$direccion->Municipio."', Ciudad='".$direccion->Ciudad."', Colonia='".$direccion->Colonia."'   
    WHERE DireccionPersonaId=".$direccion->DireccionPersonaId."";
    
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
        echo $e;
        $app->status(409);
        $app->stop();
    }
}
	
/*function GetColor()
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
}*/

function GetMedioContactoPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT ContactoPersonaId, PersonaId, MedioContactoId,TipoMedioContactoId, Contacto, Activo, NombreMedioContacto, NombreTipoMedioContacto
            FROM MedioContactoPersonaVista WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Contacto":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetDireccionPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT *
            FROM DireccionPersonaVista WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Direccion":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}
    
?>
