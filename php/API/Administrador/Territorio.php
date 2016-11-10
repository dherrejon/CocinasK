<?php

function GetTerritorio()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM Territorio";

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
        echo($e);
        $app->status(409);
        $app->stop();
    }
}

function AgregarTerritorio()
{
    $request = \Slim\Slim::getInstance()->request();
        $nuevoTerritorio = json_decode($request->getBody());
        global $app;
        $sql = "INSERT INTO Territorio (Nombre, Margen, Activo) VALUES(:Nombre, :Margen, :Activo)";
 
        try 
        {
            $db = getConnection();
            $stmt = $db->prepare($sql);

            $stmt->bindParam("Nombre", $nuevoTerritorio->Nombre);
            $stmt->bindParam("Margen", $nuevoTerritorio->Margen);
            $stmt->bindParam("Activo", $nuevoTerritorio->Activo);
            
            $stmt->execute();
            
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';
            
        } catch(PDOException $e) 
        {
            echo '[{"Estatus": "Fallido"}]';
        }
}

function EditarTerritorio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevoTerritorio = json_decode($request->getBody());
   
    $sql = "UPDATE Territorio SET Nombre='".$nuevoTerritorio->Nombre."', Margen='".$nuevoTerritorio->Margen."', Activo = '".$nuevoTerritorio->Activo."'  WHERE TerritorioId=".$nuevoTerritorio->TerritorioId."";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db = null;
        //if($stmt->rowCount() == 1)
        echo '[{"Estatus":"Exitoso"}]';
    }
    catch(PDOException $e) {
        //echo ($e);
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarTerritorio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Territorio SET Activo = ".$datos[0]." WHERE TerritorioId = ".$datos[1]."";
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

//obtiene las plazas que pertenecen a territorio determinado
function GetPlazaTerritorio()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $territorioId = json_decode($request->getBody());
    
    
    $sql = "SELECT p.*, un.Nombre as NombreUnidad FROM Plaza p, UnidadNegocio un WHERE p.TerritorioId = '".$territorioId[0]."' AND p.Activo = 1 AND p.UnidadNegocioId = un.UnidadNegocioId";
    
    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        //echo '[ { "Estatus": "Exito", {"Plaza":'.json_encode($response).'}} ]';
        echo '[ { "Estatus": "Exito"}, {"Plaza":'.json_encode($response).'} ]'; 
        ///echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

?>