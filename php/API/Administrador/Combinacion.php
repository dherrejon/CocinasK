<?php

function GetCombinacionMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM CombinacionVista ";

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
    
    $sql = "INSERT INTO CombinacionMaterial (Nombre, Activo, PorDefecto, TipoCombinacionId) 
                            VALUES(:Nombre, :Activo, :PorDefecto, :TipoCombinacionId)";

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
        $stmt->bindParam("PorDefecto", $combinacion->PorDefecto);
        $stmt->bindParam("TipoCombinacionId", $combinacion->TipoCombinacion->TipoCombinacionId);

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
    
    $countAccesorio = count($combinacion->Accesorio);
    
    if($countAccesorio > 0)
    {
        $sql = "INSERT INTO CombinacionPorMaterialAccesorio (CombinacionMaterialId, AccesorioId, MaterialId, Grueso) VALUES";

        for($k=0; $k<$countAccesorio; $k++)
        {
            $sql .= " (".$combinacionMaterialId.", ".$combinacion->Accesorio[$k]->Accesorio->AccesorioId.", ".$combinacion->Accesorio[$k]->Material->MaterialId.", '".$combinacion->Accesorio[$k]->Grueso."'),";
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
    
    $sql = "UPDATE CombinacionMaterial SET Nombre='".$combinacion->Nombre."', TipoCombinacionId='".$combinacion->TipoCombinacion->TipoCombinacionId."', Activo='".$combinacion->Activo."', PorDefecto='".$combinacion->PorDefecto."' WHERE CombinacionMaterialId=".$combinacion->CombinacionMaterialId."";

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
        echo '[ { "Estatus": "Fallo" } ]';
        //echo $e;
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
    
    $sql = "DELETE FROM CombinacionPorMaterialAccesorio WHERE CombinacionMaterialid=".$combinacion->CombinacionMaterialId;
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
    
    $countAccesorio= count($combinacion->Accesorio);
    
    if($countAccesorio > 0)
    {
        $sql = "INSERT INTO CombinacionPorMaterialAccesorio (CombinacionMaterialId, AccesorioId, MaterialId, Grueso) VALUES";

        for($k=0; $k<$countAccesorio; $k++)
        {
            $sql .= " (".$combinacion->CombinacionMaterialId.", ".$combinacion->Accesorio[$k]->Accesorio->AccesorioId.", ".$combinacion->Accesorio[$k]->Material->MaterialId.", '".$combinacion->Accesorio[$k]->Grueso."'),";
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
    
    if($datos[0] == "1")
    {
        $sql = "UPDATE CombinacionMaterial SET Activo = ".$datos[0]." WHERE CombinacionMaterialId = ".$datos[1]."";
    }
    else
    {
        $sql = "UPDATE CombinacionMaterial SET Activo = ".$datos[0].", PorDefecto = '"."0"."' WHERE CombinacionMaterialId = ".$datos[1]."";
    }
    
    try 
    {
        $db = getConnection();
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
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function GetCombinacionMaterialCosto()
{    
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $combinacionId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM CombinacionMaterialCostoVista";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exitoso" }, {"Costo":' .json_encode($response). '} ]';  
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
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

//-------------------------------- Get tipo de combinación de combinación----------
function GetTipoCombinacionMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoCombinacion ";

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

function AgregarTipoCombiancion()
{
    $request = \Slim\Slim::getInstance()->request();
    $tipoCombinacion = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO TipoCombinacion (Nombre, Descripcion, Activo) 
            VALUES(:Nombre, :Descripcion, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $tipoCombinacion->Nombre);
        $stmt->bindParam("Descripcion", $tipoCombinacion->Descripcion);
        $stmt->bindParam("Activo", $tipoCombinacion->Activo);

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

function EditarTipoCombiancion()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $tipoCombinacion = json_decode($request->getBody());
   
    $sql = "UPDATE TipoCombinacion SET Nombre='".$tipoCombinacion->Nombre."', Descripcion='".$tipoCombinacion->Descripcion."', Activo = '".$tipoCombinacion->Activo."'  WHERE TipoCombinacionId=".$tipoCombinacion->TipoCombinacionId."";
    
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

function ActivarDesactivarTipoCombinacion()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    
    $sql = "UPDATE TipoCombinacion SET Activo = ".$datos[0]." WHERE TipoCombinacionId = ".$datos[1]."";
    
    try 
    {
        $db = getConnection();
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