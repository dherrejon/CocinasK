<?php

function GetCombinacionMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM CombinacionMaterial";

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

function AgregarCombinacionMaterial()
{
    $request = \Slim\Slim::getInstance()->request();
    $combinacion = json_decode($request->getBody());
    global $app;
    
    $sql = "INSERT INTO CombinacionMaterial (Nombre, Activo) 
                            VALUES(:Nombre, :Activo)";

    $db;
    $stmt;
    $combinacionMaterialId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("Nombre", $combinacion->Nombre);
        $stmt->bindParam("Activo", $combinacion->Activo);

        $stmt->execute();
        
        $combinacionMaterialId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

    $countMaterialComponente = count($combinacion->MaterialComponente);
    
    if($countMaterialComponente > 0)
    {
        $sql = "INSERT INTO CombinacionPorMaterialComponente (CombinacionMaterialId, ComponenteId, MaterialId, Grueso) VALUES";

        for($k=0; $k<$countMaterialComponente; $k++)
        {
            $sql .= " (".$combinacionMaterialId.", ".$combinacion->MaterialComponente[$k]->Componente->ComponenteId.", ".$combinacion->MaterialComponente[$k]->Material->MaterialId.", '".$combinacion->MaterialComponente[$k]->Grueso."'),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
        } 
        catch(PDOException $e) 
        {
            echo '[{"Estatus": "Fallido"}]';
            echo $e;
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $countComponentePuerta = count($combinacion->puerta);
    
    if($countComponentePuerta > 0)
    {
        $sql = "INSERT INTO CombinacionPorMaterialComponente (CombinacionMaterialId, ComponentePorPuertaId, MaterialId, Grueso) VALUES";

        for($k=0; $k<$countComponentePuerta; $k++)
        {
            $sql .= " (".$combinacionMaterialId.", ".$combinacion->puerta[$k]->Puerta->ComponentePorPuertaId.", ".$combinacion->puerta[$k]->Material->MaterialId.", '".$combinacion->puerta[$k]->Grueso."'),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
            $db = null; 
            
            echo '[{"Estatus": "Exitoso"}]';
        } 
        catch(PDOException $e) 
        {
            echo '[{"Estatus": "Fallido"}]';
            echo $e;
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    else
    {
        echo '[{"Estatus": "Exitoso"}]';
        $db->commit();
        $db = null; 
    }
}

function EditarCombinacionMaterial()
{
    $request = \Slim\Slim::getInstance()->request();
    $combinacion = json_decode($request->getBody());
    global $app;
    
    $sql = "UPDATE CombinacionMaterial SET Nombre='".$combinacion->Nombre."', Activo='".$combinacion->Activo."' WHERE CombinacionMaterialId=".$combinacion->CombinacionMaterialId."";

    $db;
    $stmt;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        $stmt->execute();
    }
    catch(PDOException $e) 
    {
        //echo '[ { "Estatus": "Fallo" } ]';
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM CombinacionPorMaterialComponente WHERE CombinacionMaterialid=".$combinacion->CombinacionMaterialId;
    try 
    {
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 
        
    } 
    catch(PDOException $e) 
    {
        //echo '[ { "Estatus": "Fallo" } ]';
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    

    $countMaterialComponente = count($combinacion->MaterialComponente);
    
    if($countMaterialComponente > 0)
    {
        $sql = "INSERT INTO CombinacionPorMaterialComponente (CombinacionMaterialId, ComponenteId, MaterialId, Grueso) VALUES";

        for($k=0; $k<$countMaterialComponente; $k++)
        {
            $sql .= " (".$combinacion->CombinacionMaterialId.", ".$combinacion->MaterialComponente[$k]->Componente->ComponenteId.", ".$combinacion->MaterialComponente[$k]->Material->MaterialId.", '".$combinacion->MaterialComponente[$k]->Grueso."'),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
        } 
        catch(PDOException $e) 
        {
            $db->rollBack();
            $app->status(409);
            $app->stop();
            echo $e;
            //echo '[{"Estatus": "Fallido"}]';
        }
    }
    
    $countComponentePuerta = count($combinacion->puerta);
    
    if($countComponentePuerta > 0)
    {
        $sql = "INSERT INTO CombinacionPorMaterialComponente (CombinacionMaterialId, ComponentePorPuertaId, MaterialId, Grueso) VALUES";

        for($k=0; $k<$countComponentePuerta; $k++)
        {
            $sql .= " (".$combinacion->CombinacionMaterialId.", ".$combinacion->puerta[$k]->Puerta->ComponentePorPuertaId.", ".$combinacion->puerta[$k]->Material->MaterialId.", '".$combinacion->puerta[$k]->Grueso."'),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
            $db = null; 
            
            echo '[{"Estatus": "Exitoso"}]';
        } 
        catch(PDOException $e) 
        {
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    else
    {
        $db->commit();
        $db = null; 
        echo '[{"Estatus": "Exitoso"}]';
    }
}


function ActivarDesactivarCombinacionMaterial()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE CombinacionMaterial SET Activo = ".$datos[0]." WHERE CombinacionMaterialId = ".$datos[1]."";
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


/*--------------------Combinacion Por material Componente-------------------*/
function GetCombinacionPorMaterialComponente()
{    
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $combinacionId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM CombinacionMaterialVista WHERE CombinacionMaterialId='".$combinacionId[0]."'";
    
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
        echo $e;
        //echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function GetCombinacionPorMaterialComponentePorComponente()
{    
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $componente = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM CombinacionMaterialVista WHERE ComponenteId='".$componente[0]."'";
    
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
        echo $e;
        //echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function GetCombinacionPorMaterialComponentePorPuertaCombinacion()
{    
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $combinacion = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM CombinacionMaterialPuertaVista WHERE CombinacionMaterialId='".$combinacion[0]."'";
    
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
        echo $e;
        //echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function GetCombinacionPorMaterialComponentePorPuerta()
{    
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $puerta = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM CombinacionMaterialPuertaVista WHERE PuertaId='".$puerta[0]."'";
    
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
        echo $e;
        //echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}



?>