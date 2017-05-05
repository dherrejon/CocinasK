<?php

function GetComponente()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM Componente WHERE TipoComponenteId = 1 AND ComponenteId > 0";

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

function GetTodosComponente()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM Componente WHERE ComponenteId > 0 AND TipoComponenteId != 2";

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

function GetComponentePuerta()  //obtiene los componentes exclusivos para puertas
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM Componente WHERE TipoComponenteId = 2 AND ComponenteId > 0";

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

function AgregarComponente()
{
    $request = \Slim\Slim::getInstance()->request();
    $componente = json_decode($request->getBody());
    global $app;
    
    $sql = "INSERT INTO Componente (TipoComponenteId, Nombre, Activo) 
                            VALUES( 1, :Nombre, :Activo)";

    $db;
    $stmt;
    $usuarioId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("Nombre", $componente->componente->Nombre);
        $stmt->bindParam("Activo", $componente->componente->Activo);

        $stmt->execute();
        
        $componenteId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $countCombinaciones = count($componente->componente->CombinacionMaterial);
    
    if($countCombinaciones > 0)
    {
        $sql = "INSERT INTO CombinacionPorMaterialComponente (ComponenteId, CombinacionMaterialId, MaterialId, Grueso) VALUES";

        for($k=0; $k<$countCombinaciones; $k++)
        {
            $sql .= " (".$componenteId.", ".$componente->componente->CombinacionMaterial[$k]->CombinacionMaterial->CombinacionMaterialId.", ".$componente->componente->CombinacionMaterial[$k]->Material->MaterialId.", '".$componente->componente->CombinacionMaterial[$k]->Grueso."'),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
        } 
        catch(PDOException $e) 
        {
            echo $e;
            $db->rollBack();
            $app->status(409);
            $app->stop();

            //echo '[{"Estatus": "Fallido"}]';
        }
    }

    $numeroPieza = count($componente->pieza);
    
    if($numeroPieza > 0)
    {
        $sql = "INSERT INTO PiezaPorComponente (ComponenteId, PiezaId, Cantidad) VALUES";

        for($k=0; $k<$numeroPieza; $k++)
        {
            $sql .= " (".$componenteId.", ".$componente->pieza[$k]->Pieza->PiezaId.",  ".$componente->pieza[$k]->Cantidad."),";
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
            $db->rollBack();
            $app->status(409);
            $app->stop();
            echo $e;
            //echo '[{"Estatus": "Fallido"}]';
        }
    }
    
    else
    {
        echo '[{"Estatus": "Exitoso"}]';
        $db->commit();
        $db = null; 
    }
}

function EditarComponente()
{
    $request = \Slim\Slim::getInstance()->request();
    $componente = json_decode($request->getBody());
    global $app;
    
    $sql = "UPDATE Componente SET Nombre='".$componente->componente->Nombre."', Activo='".$componente->componente->Activo."' WHERE ComponenteId=".$componente->componente->ComponenteId."";

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
    
    $sql = "DELETE FROM PiezaPorComponente WHERE ComponenteId=".$componente->componente->ComponenteId;
    try 
    {
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 
        
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        //echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM CombinacionPorMaterialComponente WHERE ComponenteId=".$componente->componente->ComponenteId;
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
    
    $countCombinaciones = count($componente->componente->CombinacionMaterial);
    
    if($countCombinaciones > 0)
    {
        $sql = "INSERT INTO CombinacionPorMaterialComponente (ComponenteId, CombinacionMaterialId, MaterialId, Grueso) VALUES";

        for($k=0; $k<$countCombinaciones; $k++)
        {
            $sql .= " (".$componente->componente->ComponenteId.", ".$componente->componente->CombinacionMaterial[$k]->CombinacionMaterial->CombinacionMaterialId.", ".$componente->componente->CombinacionMaterial[$k]->Material->MaterialId.", '".$componente->componente->CombinacionMaterial[$k]->Grueso."'),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
        } 
        catch(PDOException $e) 
        {
            echo $e;
            $db->rollBack();
            $app->status(409);
            $app->stop();

            //echo '[{"Estatus": "Fallido"}]';
        }
    }
    

    $numeroPieza = count($componente->pieza);
    
    if($numeroPieza > 0)
    {
        $sql = "INSERT INTO PiezaPorComponente (ComponenteId, PiezaId, Cantidad) VALUES";

        for($k=0; $k<$numeroPieza; $k++)
        {
            $sql .= " (".$componente->componente->ComponenteId.", ".$componente->pieza[$k]->Pieza->PiezaId.",  ".$componente->pieza[$k]->Cantidad."),";
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
            $db->rollBack();
            $app->status(409);
            $app->stop();
            echo $e;
            //echo '[{"Estatus": "Fallido"}]';
        }
    }
    
    else
    {
        $db->commit();
        $db = null; 
        echo '[{"Estatus": "Exitoso"}]';
    }
}

function ActivarDesactivarComponente()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Componente SET Activo = ".$datos[0]." WHERE ComponenteId = ".$datos[1]."";
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

function GetPiezaPorComponente()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $componenteId = json_decode($request->getBody());
    
    if($componenteId[0] != "-1")
    {
        $sql = "SELECT * FROM ComponenteVista WHERE ComponenteId='".$componenteId[0]."'";
    }
    else
    {
        $sql = "SELECT ComponenteId, PiezaId, FormulaAncho, FormulaLargo, NombrePieza, Cantidad FROM ComponenteVista";
    }
    
    
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
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetComponenteEspecial()
{    
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    
    
    $sql = "SELECT ComponenteId, Nombre FROM Componente WHERE TipoComponenteId = '3' AND Activo = '1'";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exitoso" }, {"Componente":' .json_encode($response). '} ]';  
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

?>