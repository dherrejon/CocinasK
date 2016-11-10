<?php

function GetPlaza()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM PlazaVista";

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

function AgregarPlaza()
{
    $request = \Slim\Slim::getInstance()->request();
        $nuevaPlaza = json_decode($request->getBody());
        global $app;
        $sql = "INSERT INTO Plaza (UnidadNegocioId, TerritorioId, Estado, Municipio, Ciudad, Activo) 
                            VALUES(:UnidadNegocioId, :TerritorioId, :Estado, :Municipio, :Ciudad, 1)";
 
        try 
        {
            $db = getConnection();
            $stmt = $db->prepare($sql);

            $stmt->bindParam("UnidadNegocioId", $nuevaPlaza->UnidadNegocioId);
            $stmt->bindParam("TerritorioId", $nuevaPlaza->TerritorioId);
            $stmt->bindParam("Estado", $nuevaPlaza->Estado);
            $stmt->bindParam("Municipio", $nuevaPlaza->Municipio);
            $stmt->bindParam("Ciudad", $nuevaPlaza->Ciudad);
            
            $stmt->execute();
            
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';
            
        } catch(PDOException $e) 
        {
            echo '[{"Estatus": "Fallido"}]';
        }
}

function EditarPlaza()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevaPlaza = json_decode($request->getBody());
   
    $sql = "UPDATE Plaza SET Estado='".$nuevaPlaza->Estado."', Municipio='".$nuevaPlaza->Municipio."', Ciudad = '".$nuevaPlaza->Ciudad."',  
            TerritorioId='".$nuevaPlaza->TerritorioId."', UnidadNegocioId='".$nuevaPlaza->UnidadNegocioId."' WHERE PlazaId=".$nuevaPlaza->PlazaId."";
    
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

function ActivarDesactivarPlaza()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Plaza SET Activo = ".$datos[0]." WHERE PlazaId = ".$datos[1]."";
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

?>