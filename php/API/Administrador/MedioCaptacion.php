<?php
	
function GetMedioCaptacion()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT MedioCaptacionId, Nombre, Activo FROM MedioCaptacion";

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

function AgregarMedioCaptacion()
{
    $request = \Slim\Slim::getInstance()->request();
    $medio = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO MedioCaptacion (Nombre, Activo) 
            VALUES(:Nombre, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $medio->Nombre);
        $stmt->bindParam("Activo", $medio->Activo);

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

function EditarMedioCaptacion()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $medio = json_decode($request->getBody());
   
    $sql = "UPDATE MedioCaptacion SET Nombre='".$medio->Nombre."', Activo='".$medio->Activo."' WHERE MedioCaptacionId=".$medio->MedioCaptacionId."";
    
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

function ActivarDesactivarMedioCaptacion()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE MedioCaptacion SET Activo = ".$datos[0]." WHERE MedioCaptacionId = ".$datos[1]."";
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

//--------------------------- Otro --------------------------------
function GetMedioCaptacionOtro()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT NombreMedioCaptacion as Nombre FROM Persona WHERE MedioCaptacionId = 0 GROUP BY NombreMedioCaptacion";

    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"MedioCaptacion":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function ActualizarMedioCaptacion()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $medio = json_decode($request->getBody());
    
    $countOtro = count($medio->Otro);
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        
        for($k=0; $k<$countOtro; $k++)
        {
            if($medio->Otro[$k]->Seleccionado)
            {
                $sql = "UPDATE Persona SET MedioCaptacionId='".$medio->MedioCaptacionId."', NombreMedioCaptacion = null WHERE MedioCaptacionId = 0 AND NombreMedioCaptacion = '".$medio->Otro[$k]->Nombre."'";
                
                try 
                {
                    $stmt = $db->prepare($sql);
                    $stmt->execute();
                } 
                catch(PDOException $e) 
                {
                    //echo($sql);
                    echo '[ { "Estatus": "Fallo" } ]';
                    $db->rollBack();
                    $app->status(409);
                    $app->stop();
                }
            }
        }
        
        
        $db->commit();
        $db = null;

        echo '[{"Estatus":"Exitoso"}]';
    }
    catch(PDOException $e) 
    {    
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
}

function ActualizarMedioCaptacionAgregar()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $medio = json_decode($request->getBody());
   
    $sql = "INSERT INTO MedioCaptacion(Nombre, Activo) VALUES ('".$medio->Nombre."', 1)";
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        
        $medioId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {    
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $countOtro = count($medio->Otro);
    try 
    {
        for($k=0; $k<$countOtro; $k++)
        {
            if($medio->Otro[$k]->Seleccionado)
            {
                $sql = "UPDATE Persona SET MedioCaptacionId='".$medioId."', NombreMedioCaptacion = null WHERE MedioCaptacionId = 0 AND NombreMedioCaptacion = '".$medio->Otro[$k]->Nombre."'";
                
                try 
                {
                    $stmt = $db->prepare($sql);
                    $stmt->execute();
                } 
                catch(PDOException $e) 
                {
                    echo($sql);
                    echo '[ { "Estatus": "Fallo" } ]';
                    $db->rollBack();
                    $app->status(409);
                    $app->stop();
                }
            }
        }
        
        $db->commit();
        $db = null;

        echo '[{"Estatus":"Exitoso"}]';
    }
    catch(PDOException $e) 
    {    
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
}

//--- Reporte de medios de captacion 
function GetReporteMedioCaptacion()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM MedioCaptacionReporteVista";
    
    if($filtro->unidadId == -1 && $filtro->fecha1 == -1 && $filtro->fecha2 == -1)
    {
        $sql = "SELECT * FROM MedioCaptacionReporteVista";
    }
    else if($filtro->unidadId != -1 && $filtro->fecha1 == -1 && $filtro->fecha2 == -1)
    {
         $sql = "SELECT * FROM MedioCaptacionReporteVista WHERE UnidadNegocioId = ".$filtro->unidadId."";
    }
    else if($filtro->unidadId == -1 && $filtro->fecha1 != -1 && $filtro->fecha2 != -1)
    {
         $sql = "SELECT * FROM MedioCaptacionReporteVista WHERE Registro >= '".$filtro->fecha1."' AND Registro <= '".$filtro->fecha2."'";
    }
    else
    {
        $sql = "SELECT * FROM MedioCaptacionReporteVista WHERE UnidadNegocioId = ".$filtro->unidadId." AND Registro >= '".$filtro->fecha1."' AND Registro <= '".$filtro->fecha2."'";
    }
    
    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $medioCaptacion = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($medioCaptacion); 
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        //echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    } 
    
}
    
?>
