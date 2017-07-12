<?php
	
function GetProyectoPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM ProyectoPersonaVista WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Proyecto":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}
    
?>
