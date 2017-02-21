<?php

/*--------------Pieza------------------*/
function GetPieza()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM Pieza";

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

function AgregarPieza()
{
    $request = \Slim\Slim::getInstance()->request();
    $pieza = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Pieza (Nombre, FormulaAncho, FormulaLargo, Activo) VALUES(:Nombre, :FormulaAncho, :FormulaLargo, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $pieza->Nombre);
        $stmt->bindParam("FormulaAncho", $pieza->FormulaAncho2);
        $stmt->bindParam("FormulaLargo", $pieza->FormulaLargo2);
        $stmt->bindParam("Activo", $pieza->Activo);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
    }
}

function EditarPieza()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $pieza = json_decode($request->getBody());
   
    $sql = "UPDATE Pieza SET Nombre='".$pieza->Nombre."', FormulaAncho='".$pieza->FormulaAncho2."',  FormulaLargo='".$pieza->FormulaLargo2."', Activo = '".$pieza->Activo."'  WHERE PiezaId=".$pieza->PiezaId."";
    
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

function ActivarDesactivarPieza()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Pieza SET Activo = ".$datos[0]." WHERE PiezaId = ".$datos[1]."";
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