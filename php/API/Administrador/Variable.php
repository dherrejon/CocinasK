<?php


function GetIVA()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT IVAId, IVA, Incluye FROM IVA";

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

function EditarIVA()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $iva = json_decode($request->getBody());
   
    $sql = "UPDATE IVA SET IVA='".$iva->IVA."', Incluye = '".$iva->Incluye."'  WHERE IVAId=".$iva->IVAId."";
    
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
    
?>
