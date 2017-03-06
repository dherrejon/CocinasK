<?php

/*---------------------Material---------------------*/
function GetMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM MaterialVista WHERE MaterialId > 0";

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

function AgregarMaterial()
{
    $request = \Slim\Slim::getInstance()->request();
    $material = json_decode($request->getBody());
    global $app;
    
    $sql = "INSERT INTO Material (TipoMaterialId, Nombre, CostoUnidad, MaterialDe, Activo) 
                            VALUES( :TipoMaterialId, :Nombre, :CostoUnidad, :MaterialDe, :Activo)";
    $db;
    $stmt;
    $materialId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("TipoMaterialId", $material->TipoMaterial->TipoMaterialId);
        $stmt->bindParam("Nombre", $material->Nombre);
        $stmt->bindParam("CostoUnidad", $material->CostoUnidad);
        $stmt->bindParam("MaterialDe", $material->MaterialDe);
        $stmt->bindParam("Activo", $material->Activo);

        $stmt->execute();
        
        $materialId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

    $numeroGrueso = count($material->grueso);
        
    if($numeroGrueso > 0)
    {
        $sql = "INSERT INTO GruesoMaterial (MaterialId, Grueso, CostoUnidad, Activo) VALUES";

        for($k=0; $k<$numeroGrueso; $k++)
        {
            $sql .= " (".$materialId.", '".$material->grueso[$k]->Grueso."',  ".$material->grueso[$k]->CostoUnidad.", ".$material->grueso[$k]->Activo."),";
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
            echo '[{"Estatus": "Fallido"}]';
        }
    }
    
    else
    {
        echo '[{"Estatus": "Exitoso"}]';
        $db->commit();
        $db = null; 
    }
}

function EditarMaterial()
{
    $request = \Slim\Slim::getInstance()->request();
    $material = json_decode($request->getBody());
    global $app;
    
    $sql = "UPDATE Material SET TipoMaterialId='".$material->TipoMaterial->TipoMaterialId."', Nombre='".$material->Nombre."', CostoUnidad='".$material->CostoUnidad."',  Activo='".$material->Activo."' WHERE MaterialId=".$material->MaterialId."";

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
    
    $sql = "DELETE FROM GruesoMaterial WHERE MaterialId=".$material->MaterialId;
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
    

    $numeroGrueso = count($material->grueso);
    
    if($numeroGrueso > 0)
    {
        $sql = "INSERT INTO GruesoMaterial (MaterialId, Grueso, CostoUnidad, Activo) VALUES";

        for($k=0; $k<$numeroGrueso; $k++)
        {
            $sql .= " (".$material->MaterialId.", '".$material->grueso[$k]->Grueso."',  ".$material->grueso[$k]->CostoUnidad.",  ".$material->grueso[$k]->Activo."),";
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

function ActivarDesactivarMaterial()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Material SET Activo = ".$datos[0]." WHERE MAterialId = ".$datos[1]."";
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

/*------------------ Grueso Material ------------------*/
function GetGruesoMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM GruesoMaterial";

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

function ActivarDesactivarGruesoMaterial()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE GruesoMaterial SET Activo = ".$datos[0]." WHERE GruesoMaterialId = ".$datos[1]."";
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

function GetCostoMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $material = json_decode($request->getBody());
    
    
    $sql = "SELECT IF(COUNT(*)=0, m.CostoUnidad, gm.CostoUnidad) as CostoUnidad FROM GruesoMaterial gm, Material m 
            WHERE gm.MaterialId = m.MaterialId AND m.MaterialId = ".$material[0]." AND gm.Grueso = '".$material[1]."'";
    
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

/*---------------------tipo material---------------------*/
function GetTipoMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoMaterialVista WHERE TipoMaterialId > 0";

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

function AgregarTipoMaterial()
{
    $request = \Slim\Slim::getInstance()->request();
    $tipoMaterial = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO TipoMaterial (Nombre, Activo, DisponibleModulo, DisponibleCubierta) VALUES(:Nombre, :Activo, :DisponibleModulo, :DisponibleCubierta)";

    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        
        $stmt->bindParam("Nombre", $tipoMaterial->Nombre);
        $stmt->bindParam("Activo", $tipoMaterial->Activo);
        $stmt->bindParam("DisponibleModulo", $tipoMaterial->DisponibleModulo);
        $stmt->bindParam("DisponibleCubierta", $tipoMaterial->DisponibleCubierta);

        $stmt->execute();

        $tipoMaterialId = $db->lastInsertId();

    } catch(PDOException $e) 
    {
        $db->rollBack();
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
    
    if($tipoMaterial->DisponibleCubierta == "1")
    {
        $sql = "INSERT TipoMaterialPorTipoCubierta (TipoMaterialId, TipoCubiertaId) VALUES ('".$tipoMaterialId."', '".$tipoMaterial->TipoCubierta->TipoCubiertaId."')";
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';

        } catch(PDOException $e) 
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

function EditarTipoMaterial()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $tipoMaterial = json_decode($request->getBody());
   
    $sql = "UPDATE TipoMaterial SET DisponibleModulo='".$tipoMaterial->DisponibleModulo."', DisponibleCubierta='".$tipoMaterial->DisponibleCubierta."', Nombre='".$tipoMaterial->Nombre."', Activo = '".$tipoMaterial->Activo."'  WHERE TipoMaterialID=".$tipoMaterial->TipoMaterialId."";
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        $stmt->execute();
    }
    catch(PDOException $e) 
    {    
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

    if($tipoMaterial->DisponibleCubierta == "1")
    {
        $sql = "SELECT COUNT(*) as contador FROM TipoMaterialPorTipoCubierta WHERE TipoMaterialId = ".$tipoMaterial->TipoMaterialId;
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        }
        catch(PDOException $e) 
        {   
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
        
        if($response[0]->contador == "0")
        {
            $sql = "INSERT TipoMaterialPorTipoCubierta (TipoMaterialId, TipoCubiertaId) VALUES ('".$tipoMaterial->TipoMaterialId."', '".$tipoMaterial->TipoCubierta->TipoCubiertaId."')";
            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();

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
        
        else
        {
            $sql = "UPDATE TipoMaterialPorTipoCubierta SET TipoCubiertaId = '".$tipoMaterial->TipoCubierta->TipoCubiertaId."' WHERE TipoMaterialId =".$tipoMaterial->TipoMaterialId;
            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();

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
    }
    else
    {
        $sql = "DELETE FROM TipoMaterialPorTipoCubierta WHERE TipoMaterialId = ".$tipoMaterial->TipoMaterialId;
        try 
        {            
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
            $db = null;

            echo '[{"Estatus":"Exitoso"}]';
        }
        catch(PDOException $e) 
        {   
            echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
}

function ActivarDesactivarTipoMaterial()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE TipoMaterial SET Activo = ".$datos[0]." WHERE TipoMaterialId = ".$datos[1]."";
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

/*---------------Material para --------*/

function GetTipoMaterialParaModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoMaterial WHERE DisponibleModulo=1 AND TipoMaterialId > 0";

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

function GetTipoMaterialParaCubierta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoMaterialVista WHERE DisponibleCubierta=1 AND TipoMaterialId > 0";

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

function GetMaterialCubierta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM MaterialDisponibleCubiertaVista";

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