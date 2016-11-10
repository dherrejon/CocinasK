<?php

//obtien los datos sde un codigo o estado determinado
function GetCodigoPostal()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM CodigoPostal WHERE Codigo = '".$filtro[0]."' OR Estado = '".$filtro[0]."' ";
    
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

//obtiene los estados de México sin repetirse
function GetEstadoMexico()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT DISTINCT cp.Estado FROM CodigoPostal cp ";

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
    
?>
