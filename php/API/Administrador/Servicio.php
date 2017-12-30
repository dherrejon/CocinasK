<?php
	
function GetServicio()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT ServicioId, Nombre, CostoUnidad, PrecioVenta, Obligatorio, Activo FROM Servicio";

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

function AgregarServicio()
{
    $request = \Slim\Slim::getInstance()->request();
    $servicio = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Servicio (Nombre, CostoUnidad, PrecioVenta, Activo, Obligatorio) 
            VALUES(:Nombre, :CostoUnidad, :PrecioVenta, :Activo, :Obligatorio)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $servicio->Nombre);
        $stmt->bindParam("CostoUnidad", $servicio->CostoUnidad);
        $stmt->bindParam("PrecioVenta", $servicio->PrecioVenta);
        $stmt->bindParam("Activo", $servicio->Activo);
        $stmt->bindParam("Obligatorio", $servicio->Obligatorio);

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

function EditarServicio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $servicio = json_decode($request->getBody());
   
    $sql = "UPDATE Servicio SET Nombre='".$servicio->Nombre."', CostoUnidad='".$servicio->CostoUnidad."', PrecioVenta='".$servicio->PrecioVenta."', Obligatorio='".$servicio->Obligatorio."', Activo = '".$servicio->Activo."'  WHERE ServicioId=".$servicio->ServicioId."";
    
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

function ActivarDesactivarServicio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Servicio SET Activo = ".$datos[0]." WHERE ServicioId = ".$datos[1]."";
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
